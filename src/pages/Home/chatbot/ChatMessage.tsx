import { Box, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { persistor, store } from "@/Redux/Store";

type ChatOption = {
  label: string;
  path: string;
  isAuthRoute?: boolean;
};

type ChatMessageType = {
  sender: "user" | "bot";
  text: string;
  options?: ChatOption[];
};

export default function ChatMessage({ msg }: { msg: ChatMessageType }) {
  const navigate = useNavigate();

  const logoutAndRedirect = async (path: string) => {
    try {
      persistor.pause();
      await persistor.flush();
      await persistor.purge();
      store.dispatch({ type: "RESET_APP" });

      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
      localStorage.removeItem("chat");
      localStorage.clear();
      sessionStorage.clear();

      navigate(path, { replace: true });
    } catch (error) {
      console.error("Logout before auth-route redirect failed:", error);
    }
  };

  const handleRouteClick = async (opt: ChatOption) => {
    if (!opt?.path) return;

    const hasAuthToken = document.cookie
      .split("; ")
      .some((row) => row.startsWith("authToken="));

    if (opt.isAuthRoute && hasAuthToken) {
      const shouldLogout = window.confirm(
        "You are already logged in. Logout and continue?",
      );
      if (!shouldLogout) return;
      await logoutAndRedirect(opt.path);
      return;
    }

    navigate(opt.path);
  };

  return (
    <Box
      mb="xs"
      style={{
        textAlign: msg.sender === "user" ? "right" : "left",
      }}
    >
      <Box
        p="xs"
        style={{
          display: "inline-block",
          background: msg.sender === "user" ? "#228be6" : "#f1f3f5",
          color: msg.sender === "user" ? "#fff" : "#000",
          borderRadius: 10,
        }}
      >
        {msg.text}
      </Box>

      {msg.options?.map((opt, i) => (
        <Button
          key={i}
          size="xs"
          mt={5}
          fullWidth
          onClick={() => void handleRouteClick(opt)}
        >
          {opt.label}
        </Button>
      ))}
    </Box>
  );
}
