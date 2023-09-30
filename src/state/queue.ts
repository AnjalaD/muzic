import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Sound } from "./sounds";

type QueueState = {
  data: Sound[];
  repeat: boolean;
  currentIndex?: number;
  add: (...items: Sound[]) => void;
  remove: (index: number) => void;
  removeAll: () => void;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  toggleRepeat: () => void;
};

export const useQueueStore = create<QueueState>()(
  devtools(
    immer((set) => ({
      data: [],
      repeat: false,
      currentIndex: undefined,

      add: (...items) => {
        console.log("Adding");
        set((state) => {
          state.data.push(...items);
        });
      },
      remove: (index) => {
        set((state) => {
          state.data.splice(index, 1);
          state.currentIndex = undefined;
        });
      },
      removeAll: () => {
        set((state) => {
          state.data = [];
          state.currentIndex = undefined;
        });
      },
      goTo: (index) => {
        set((state) => {
          if (state.data.length == 0) return;

          if (state.currentIndex === index) {
            return;
          }

          if (index >= state.data.length) {
            return;
          }

          state.currentIndex = index;
        });
      },
      goNext: () => {
        set((state) => {
          if (state.data.length == 0) return;

          if (state.currentIndex === undefined) {
            state.currentIndex = 0;
            return;
          }

          // if (state.currentIndex + 1 === state.data.length && !state.repeat) {
          //   state.currentIndex = undefined;
          //   return;
          // }

          state.currentIndex = (state.currentIndex + 1) % state.data.length;
        });
      },
      goPrev: () => {
        set((state) => {
          if (state.data.length == 0) return;

          if (state.currentIndex === undefined) {
            state.currentIndex = state.data.length - 1;
            return;
          }

          if (state.currentIndex === 0 && !state.repeat) {
            return;
          }

          if (state.currentIndex === 0) {
            state.currentIndex = state.data.length - 1;
            return;
          }

          state.currentIndex = state.currentIndex - 1;
        });
      },
      toggleRepeat: () => {
        set((state) => {
          state.repeat = !state.repeat;
        });
      },
    })),
    { name: "queue" }
  )
);
