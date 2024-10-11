import { create } from "zustand";

export interface ConfirmationStore {
  isOpened: boolean;
  close: () => void;
  open: () => void;
  title?: string;
  description?: string;
  actionButtonText?: string;
  onSubmit?: () => void;
  confirm: (value: ConfirmationValue) => void;
}

type ConfirmationValue = Required<
  Pick<
    ConfirmationStore,
    "actionButtonText" | "description" | "onSubmit" | "title"
  >
>;

export const useConfirmationStore = create<ConfirmationStore>((set) => ({
  isOpened: false,
  close: () => set({ isOpened: false }),
  open: () => set({ isOpened: true }),
  title: undefined,
  description: undefined,
  actionButtonText: undefined,
  onSubmit: undefined,
  confirm: (value: ConfirmationValue) => set({ ...value, isOpened: true }),
}));
