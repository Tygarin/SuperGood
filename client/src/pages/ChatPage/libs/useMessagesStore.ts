import { create } from "zustand";

export interface MessagesStore {
  activeMessages: Set<string>;
  toggleActiveMessage: (messageID: string) => void;
  clearMessages: () => void;
}

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  activeMessages: new Set([]),
  toggleActiveMessage: (messageID: string) => {
    const activeMessages = get().activeMessages;
    if (activeMessages.has(messageID)) {
      activeMessages.delete(messageID);
    } else {
      activeMessages.add(messageID);
    }
    set({ activeMessages });
  },
  clearMessages: () => set({ activeMessages: new Set([]) }),
}));
