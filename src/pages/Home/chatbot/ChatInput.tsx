import { TextInput, Button, Stack, Group, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { addMessage, setSuggestions } from "@/Redux/Reducers/chatSlice";
import { findBotResponse, getSuggestions } from "@/Utils/botUtils";
import { decryptData } from "@/Utils/helper";
import type { BotOption } from "@/Config/botConfig";
import Suggestions from "./Suggestions";
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const suggestions = useAppSelector(state => state.chat.suggestions);
  const recognitionRef = useRef<any>(null);
  const encryptedLoginData = useAppSelector(
    (state) => state.apiResponse.responses?.loginData,
  );
  const loginData = encryptedLoginData ? decryptData(encryptedLoginData) : null;

  const handleSend = () => {
    if (!input.trim()) return;

    dispatch(addMessage({ text: input, sender: "user" }));

    const bot = findBotResponse(input, loginData);

    dispatch(addMessage({
      text: bot.reply,
      sender: "bot",
      options: bot.options
    }));

    dispatch(setSuggestions([]));
    setInput("");
  };

  const handleChange = (val: string) => {
    setInput(val);
    dispatch(setSuggestions(getSuggestions(val, loginData)));
  };

  const handleSuggestionSelect = (suggestion: BotOption) => {
    dispatch(addMessage({ text: suggestion.label, sender: "user" }));
    dispatch(setSuggestions([]));
    setInput("");
    navigate(suggestion.path);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const startListening = () => {
    setVoiceError("");

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      setInput(transcript);
      dispatch(setSuggestions(getSuggestions(transcript, loginData)));
    };

    recognition.onerror = () => {
      setVoiceError("Unable to capture voice. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <Stack gap={5}>
      <Suggestions suggestions={suggestions} onSelect={handleSuggestionSelect} />

      <TextInput
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Type message..."
      />

      <Group grow>
        <Button color="#BF2024" onClick={handleSend}>Send</Button>
        <Button
          variant={isListening ? "filled" : "outline"}
          color={isListening ? "red" : "gray"}
          onClick={toggleVoiceInput}
          leftSection={
            isListening ? <IconMicrophoneOff size={16} /> : <IconMicrophone size={16} />
          }
        >
          {isListening ? "Stop" : "Voice"}
        </Button>
      </Group>
      {voiceError && (
        <Text size="xs" c="red">
          {voiceError}
        </Text>
      )}
    </Stack>
  );
}
