import { create } from "zustand";

interface InititalValue {
  open: false;
}

export const useStore = create((set) => ({
  open: false,
  toggle: () => set((state: InititalValue) => ({ open: !state.open })),
}));
