import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BotOption } from "@/Config/botConfig";

interface Option {
  label: string;
  path: string;
}

interface Message {
  text: string;
  sender: "user" | "bot";
  options?: Option[];
}

interface ChatState {
  messages: Message[];
  suggestions: BotOption[];
  isOpen: boolean;
}

const savedMessages = localStorage.getItem("chat");

const initialState: ChatState = {
  messages: savedMessages ? JSON.parse(savedMessages) : [],
  suggestions: [],
  isOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      localStorage.setItem("chat", JSON.stringify(state.messages));
    },

    setSuggestions: (state, action: PayloadAction<BotOption[]>) => {
      state.suggestions = action.payload;
    },

    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },

    clearChat: (state) => {
      state.messages = [];
      state.suggestions = [];
      localStorage.removeItem("chat");
    },
  },
});

export const { addMessage, setSuggestions, toggleChat, clearChat } =
  chatSlice.actions;
export default chatSlice.reducer;
