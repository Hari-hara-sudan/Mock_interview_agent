"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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

  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      console.log("VAPI message:", message);
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



    const onSpeechStart = () => setIsSpeaking(true);
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

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

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

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    if (shouldBlockVapi) return; // Block VAPI if guard triggers
    setCallStatus(CallStatus.CONNECTING);
    try {
      // Use the interview assistant if questions are present, else use the generator assistant
      const assistantId = questions && questions.length > 0
        ? process.env.NEXT_PUBLIC_VAPI_INTERVIEW_ASSISTANT_ID!
        : process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
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
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
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
      body: JSON.stringify(params),
    });
    return res.json();
  };

  return (
    <>
      <div className="call-view gap-8">
        {/* AI Interviewer Card */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#18181b] border border-[#232323] rounded-2xl shadow-lg p-8 min-h-[320px]">
          <div className="avatar mb-4">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={80}
              height={80}
              className="object-cover rounded-full border-2 border-[#232323] bg-[#232323]"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3 className="text-lg font-bold text-white">AI Interviewer</h3>
        </div>

        {/* User Card */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#18181b] border border-[#232323] rounded-2xl shadow-lg p-8 min-h-[320px]">
          <Image
            src="/user-avatar.png"
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-[#232323] bg-[#232323]"
          />
          <h3 className="text-lg font-bold text-white mt-4">{userName}</h3>
        </div>
      </div>

      {/* Transcript/Status Bar */}
      {(errorMessage || messages.length > 0 || partialTranscript) && (
        <div className="w-full flex justify-center mt-8">
          <div className="w-full max-w-2xl bg-[#232323] bg-opacity-80 rounded-full px-8 py-4 shadow text-center text-lg text-white font-medium">
            {errorMessage ? (
              <span className="text-red-400">{errorMessage}</span>
            ) : partialTranscript ? (
              <span className="text-blue-400 animate-pulse">{partialTranscript}</span>
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
            className="px-10 py-3 rounded-full bg-green-500 text-white text-lg font-bold shadow-lg hover:bg-green-600 transition"
            onClick={handleCall}
          >
            Call
          </button>
        ) : callStatus === "CONNECTING" ? (
          <button
            className="px-10 py-3 rounded-full bg-blue-600 text-white text-lg font-bold shadow-lg flex items-center gap-2 cursor-not-allowed opacity-80"
            disabled
          >
            <span className="loader border-2 border-t-2 border-t-white border-blue-400 rounded-full w-5 h-5 animate-spin" />
            Connecting...
          </button>
        ) : (
          <button
            className="px-10 py-3 rounded-full bg-red-600 text-white text-lg font-bold shadow-lg hover:bg-red-700 transition"
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