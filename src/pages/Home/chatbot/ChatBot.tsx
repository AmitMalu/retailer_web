import { Paper, ActionIcon, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { addMessage, clearChat, toggleChat } from "@/Redux/Reducers/chatSlice";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import MudraSevakSvg from "@/assets/svg/MudraSevakSvg";
import { decryptData } from "@/Utils/helper";

export default function ChatBot() {
  const dispatch = useAppDispatch();
  const { isOpen, messages } = useAppSelector(state => state.chat);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const apiResponses = useAppSelector((state) => state.apiResponse.responses);

  const loginData = apiResponses?.loginData ? decryptData(apiResponses.loginData) : null;
  const userProfile = apiResponses?.userProfile ? decryptData(apiResponses.userProfile) : null;
  const dashboardProfile = apiResponses?.dashboardData ? decryptData(apiResponses.dashboardData)?.profile : null;

  const userName =
    dashboardProfile?.name ||
    userProfile?.name ||
    loginData?.name ||
    loginData?.username ||
    loginData?.hierarchyId ||
    "there";

  useEffect(() => {
    if (!isOpen || !messagesRef.current) return;
    const id = requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsShaking(false);
      return;
    }

    const intervalId = window.setInterval(() => {
      setIsShaking(true);
      window.setTimeout(() => setIsShaking(false), 700);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    dispatch(
      addMessage({
        sender: "bot",
        text: `Hello ${userName}, what can I help you with today?`,
      }),
    );
  }, [dispatch, isOpen, messages.length, userName]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!target) return;

      const clickedInsidePanel = panelRef.current?.contains(target);
      const clickedOnButton = buttonRef.current?.contains(target);

      if (!clickedInsidePanel && !clickedOnButton) {
        dispatch(toggleChat());
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [dispatch, isOpen]);

  return (
    <>
      <style>
        {`
          @keyframes mudra-sevak-shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-3px) rotate(-4deg); }
            40% { transform: translateX(3px) rotate(4deg); }
            60% { transform: translateX(-3px) rotate(-3deg); }
            80% { transform: translateX(3px) rotate(3deg); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* Floating Button */}
      <div ref={buttonRef}>
        <ActionIcon
          size={54}
          radius="xl"
          variant="filled"
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 9999,
            animation: isShaking ? "mudra-sevak-shake 0.7s ease-in-out" : "none",
            border: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(47, 54, 145, 0.3)",
          }}
          onClick={() => dispatch(toggleChat())}
        >
          <MudraSevakSvg width={100} height={100} />
        </ActionIcon>
      </div>

      {isOpen && (
        <Paper
          ref={panelRef}
          shadow="lg"
          radius="md"
          p="sm"
          style={{
            position: "fixed",
            bottom: 90,
            left: 20,
            zIndex: 9999,
            width: 320,
            height: 450,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 4px 4px 4px",
              borderBottom: "1px solid #edf2f7",
              marginBottom: 8,
            }}
          >
            <MudraSevakSvg width={44} height={44} />
            <Text fw={700} size="sm">
              NFT Sevak
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{ marginLeft: "auto", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => dispatch(clearChat())}
            >
              Clear chat
            </Text>
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              {messages.map((msg, i) => (
                <ChatMessage key={i} msg={msg} />
              ))}
            </div>
          </div>

          {/* Input */}
          <ChatInput />
        </Paper>
      )}
    </>
  );
}
