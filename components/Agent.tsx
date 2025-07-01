"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";

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

    // Add transcript event handler for Vapi SDK
    const onTranscript = (event: any) => {
      console.log("VAPI transcript event:", event);
      if (event.transcriptType === "interim") {
        setPartialTranscript(event.transcript);
      } else if (event.transcriptType === "final") {
        const newMessage = { role: event.role || "user", content: event.transcript };
        setMessages((prev) => [...prev, newMessage]);
        setPartialTranscript("");
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => {
      setIsSpeaking(false);
      setPartialTranscript("");
    };
    const onError = (error: any) => {
      console.error("VAPI Error:", error);
      let message = "";
      if (
        (error?.error?.type === "ejected" || error?.errorMsg === "Meeting has ended") &&
        callStatus !== CallStatus.FINISHED
      ) {
        setCallStatus(CallStatus.FINISHED);
        message = "The meeting has ended or you were ejected.";
      } else if (error && (error.errorMsg || error.message)) {
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
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

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
      // Always use the assistant and pass all required variables
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
          type,        // e.g. "technical"
          role,        // e.g. "Frontend Developer"
          level,       // e.g. "Junior"
          techstack,   // e.g. "React, TypeScript"
          amount,      // e.g. "5"
        },
        // Remove clientMessages and serverMessages if not required by the SDK
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

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User Avatar"
              width={120}
              height={120}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="transcript-border">
          <div className="transcript">
            <p className="text-red-500 text-center">{errorMessage}</p>
          </div>
        </div>
      ) : messages.length > 0 ? (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      ) : partialTranscript ? (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={partialTranscript}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100 text-blue-500"
              )}
            >
              {partialTranscript}
            </p>
          </div>
        </div>
      ) : (
        <div className="transcript-border">
          <div className="transcript">
            {messages.filter(m => m.role === "assistant").map((msg, idx) => (
              <p
                key={idx}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {msg.content}
              </p>
            ))}
            {partialTranscript && (
              <p
                key={partialTranscript}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100 text-blue-500"
                )}
              >
                {partialTranscript}
              </p>
            )}
            {messages.filter(m => m.role === "assistant").length === 0 && !partialTranscript && (
              <p
                key="listening"
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                Listening...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {errorMessage && (
          <div className="text-red-500 text-center mb-2">{errorMessage}</div>
        )}
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
