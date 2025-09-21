"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Vapi from "@vapi-ai/web";
import { auth } from "@/firebase/client";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  feedbackId?: string;
  type: string;
  role: string;
  level: string;
  techstack: string;
  amount: string;
  questions?: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  role,
  level,
  techstack,
  amount,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [partialTranscript, setPartialTranscript] = useState<string>("");

  // Prevent VAPI/generation if in 'generate' mode but questions exist (extra guard)
  const shouldBlockVapi = type === "generate" && Array.isArray(questions) && questions.length > 0;

  const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;

  // Hold a single Vapi instance across renders
  const vapiRef = useRef<Vapi | null>(null);
  const [isVapiInitialized, setIsVapiInitialized] = useState(false);
  const callStatusRef = useRef<CallStatus>(CallStatus.INACTIVE);

  // Update ref whenever callStatus changes
  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  // Initialize Vapi client and set up event listeners
  useEffect(() => {
    // Initialize Vapi instance if not already created
    if (!vapiRef.current && typeof window !== "undefined") {
      try {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);
        setIsVapiInitialized(true);
      } catch (e) {
        console.error("Failed to initialize Vapi", e);
        return;
      }
    }

    const vapi = vapiRef.current;
    if (!vapi) return;

    const onCallStart = () => {
      console.log("VAPI: Call started");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("VAPI: Call ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      console.log("VAPI message:", message);
      // If we're getting messages but still in connecting state, update to active
      if (callStatusRef.current === CallStatus.CONNECTING) {
        console.log("VAPI: Call detected as active via message");
        setCallStatus(CallStatus.ACTIVE);
      }
      if (message.type === "transcript") {
        if (message.transcriptType === "interim") {
          setPartialTranscript(message.transcript);
        } else if (message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript };
          setMessages((prev) => [...prev, newMessage]);
          setPartialTranscript("");
        }
      }
    };

    const onSpeechStart = () => {
      console.log("VAPI: Speech started");
      setIsSpeaking(true);
      // If we're getting speech but still in connecting state, update to active
      if (callStatusRef.current === CallStatus.CONNECTING) {
        console.log("VAPI: Call detected as active via speech");
        setCallStatus(CallStatus.ACTIVE);
      }
    };
    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setPartialTranscript("");
    };
    const onError = (error: any) => {
      if (!error || (typeof error === "object" && Object.keys(error).length === 0)) return;
      
      // Handle ejection/meeting end gracefully
      if (error?.error?.type === "ejected" || error?.errorMsg === "Meeting has ended") {
        if (callStatus !== CallStatus.FINISHED) {
          setCallStatus(CallStatus.FINISHED);
          setErrorMessage("The meeting has ended or you were ejected.");
        }
        return; // Suppress console log for expected ejection
      }
      // Downgrade noisy Daily transport disconnects to a soft hint
      const rawMsg = (error?.errorMsg || error?.message || "") as string;
      if (rawMsg.toLowerCase().includes("send transport changed to disconnected")) {
        setErrorMessage("Connection dropped. Please try again or check your network.");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }
      
      // Log other errors but don't show them to user unless they're significant
      console.error("VAPI Error:", error);
      let message = "";
      if (error && (error.errorMsg || error.message)) {
        message = error.errorMsg || error.message;
      } else {
        message = "An unknown error occurred during the call.";
      }
      setErrorMessage(message);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Stop call on tab close or when page is hidden for a while
    const handleBeforeUnload = () => {
      try { vapi.stop(); } catch {}
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        try { vapi.stop(); } catch {}
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      try {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("message", onMessage);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
        vapi.off("error", onError);
        // Ensure the transport is torn down cleanly
        vapi.stop();
      } catch {}
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibility);
      // release instance after cleanup
      vapiRef.current = null;
      setIsVapiInitialized(false);
    };
  }, []); // Remove callStatus from dependency array

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      // Updated prompt: instruct AI to return at most 5 categoryScores
      const feedbackPrompt = `
        Analyze the following interview transcript and generate feedback for the candidate.
        Return a JSON object with the following fields:
        - totalScore: number
        - categoryScores: an array of at most 5 objects, each with name, score, and comment
        - strengths: array of strings
        - areasForImprovement: array of strings
        - finalAssessment: string
        IMPORTANT: The categoryScores array must contain no more than 5 elements.
        Transcript:
        ${JSON.stringify(messages)}
      `;
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        }),
      });
      const { success, feedbackId: id } = await res.json();

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error("Error saving feedback");
        router.push("/");
      }
    };

    const handleGenerateAndFeedback = async (messages: SavedMessage[]) => {
      try {
        // For generation mode, we don't have an interview ID to associate feedback with
        // The interview was already generated by the VAPI assistant during the conversation
        // So we just redirect to the main page
        console.log("Interview generation completed, redirecting to main page");
        router.push("/");
      } catch (error) {
        console.error("Error in generate flow:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        // Generate the interview and then handle feedback
        handleGenerateAndFeedback(messages);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (shouldBlockVapi) return; // Block VAPI if guard triggers
    if (!isVapiInitialized) {
      setErrorMessage("Voice client is still initializing, please wait...");
      return;
    }
    if (callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ACTIVE) return;
    setErrorMessage("");
    setCallStatus(CallStatus.CONNECTING);
    
    // Set a fallback timeout to detect call start
    const timeoutId = setTimeout(() => {
      if (callStatusRef.current === CallStatus.CONNECTING) {
        console.log("VAPI: Call timeout fallback - assuming call is active");
        setCallStatus(CallStatus.ACTIVE);
      }
    }, 5000); // 5 second timeout
    
    try {
      const vapi = vapiRef.current;
      if (!vapi) throw new Error("Voice client not initialized");
      // Use the interview assistant if questions are present, else use the generator assistant
      const assistantId = questions && questions.length > 0
        ? process.env.NEXT_PUBLIC_VAPI_INTERVIEW_ASSISTANT_ID!
        : process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
      
      console.log("VAPI: Starting call with assistant:", assistantId);
      await vapi.start(assistantId, {
        variableValues: {
          username: userName,
          userId: userId, // Always send the UID from profile
          role,
          type,
          level,
          techstack,
          amount,
          ...(questions ? { questions } : {}),
        },
      });
      console.log("VAPI: Call start request completed");
      
      // If the call start completed but we're still connecting, set a shorter timeout
      if (callStatusRef.current === CallStatus.CONNECTING) {
        setTimeout(() => {
          if (callStatusRef.current === CallStatus.CONNECTING) {
            console.log("VAPI: Setting to active after start completion");
            setCallStatus(CallStatus.ACTIVE);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error starting call:", error);
      clearTimeout(timeoutId);
      setCallStatus(CallStatus.INACTIVE);
      setErrorMessage("Failed to start call. Please try again.");
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    try { vapiRef.current?.stop(); } catch {}
  };

  // Add a function to generate interview (example, place this where you handle interview generation)
  const generateInterview = async (params: { type: string; role: string; level: string; techstack: string; amount: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const idToken = await user.getIdToken();
    const res = await fetch("/api/vapi/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        ...params,
        userId: user.uid, // Include the user ID to prevent null userId
      }),
    });
    return res.json();
  };

  return (
    <>
      <div className="call-view gap-8">
        {/* AI Interviewer Card */}
        <div className="flex-1 flex flex-col items-center justify-center bg-card border border-border/50 rounded-2xl shadow-soft p-8 min-h-[320px]">
          <div className="avatar mb-4">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={80}
              height={80}
              className="object-cover rounded-full border-2 border-border/50 bg-muted"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3 className="text-lg font-bold text-foreground">AI Interviewer</h3>
        </div>

        {/* User Card with Camera */}
        <div className="flex-1 flex flex-col items-center justify-center bg-card border border-border/50 rounded-2xl shadow-soft p-8 min-h-[320px] overflow-hidden">
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Image
                  src="/user-avatar.png"
                  alt="User Avatar"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground">{userName}</h3>
              <p className="text-sm text-muted-foreground">Interviewee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript/Status Bar */}
      {(errorMessage || messages.length > 0 || partialTranscript) && (
        <div className="w-full flex justify-center mt-8">
          <div className="w-full max-w-2xl bg-muted rounded-full px-8 py-4 shadow text-center text-lg text-foreground font-medium">
            {errorMessage ? (
              <span className="text-red-400">{errorMessage}</span>
            ) : partialTranscript ? (
              <span className="text-primary animate-pulse">{partialTranscript}</span>
            ) : messages.length > 0 ? (
              <span>{lastMessage}</span>
            ) : null}
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center mt-8">
        {errorMessage && (
          <div className="text-red-500 text-center mb-2">{errorMessage}</div>
        )}
        {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
          <button
            className={`px-10 py-3 rounded-full text-lg font-bold shadow-lg transition ${
              !isVapiInitialized 
                ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60" 
                : "bg-success-100 text-white hover:opacity-90"
            }`}
            onClick={handleCall}
            disabled={!isVapiInitialized}
          >
            {!isVapiInitialized ? "Initializing..." : "Call"}
          </button>
        ) : callStatus === "CONNECTING" ? (
          <button
            className="px-10 py-3 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-lg flex items-center gap-2 cursor-not-allowed opacity-80"
            disabled
          >
            <span className="loader border-2 border-t-2 border-t-white border-blue-400 rounded-full w-5 h-5 animate-spin" />
            Connecting...
          </button>
        ) : (
          <button
            className="px-10 py-3 rounded-full bg-destructive text-destructive-foreground text-lg font-bold shadow-lg hover:opacity-90 transition"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;