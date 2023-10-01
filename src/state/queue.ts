import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type QueueState = {
  _history: string[];
  queue: string[];
  repeat: boolean;

  add: (...items: string[]) => void;
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
      _history: [],
      queue: [],
      repeat: false,

      add: (...items) => {
        set((state) => {
          // add to end of the queue
          state.queue.push(...items);
        });
      },

      remove: (index) => {
        // using positive(with zero) indexes for queue -> [0, 1, 2]
        // using negative indexes for history -> [-1, -2, -3]
        set((state) => {
          if (index >= 0) {
            state.queue.splice(index, 1);
          }
          state._history.splice(-(index + 1), 1);
        });
      },

      removeAll: () => {
        // just set arrays empty
        set((state) => {
          state.queue = [];
          state._history = [];
        });
      },

      goTo: (index) => {
        set((state) => {
          // for positive indexes
          if (index >= 0) {
            if (
              index === 0 ||
              state.queue.length == 0 ||
              index + 1 > state.queue.length
            ) {
              return;
            }

            const newQueue = state.queue.slice(index);
            const skipped = state.queue.slice(0, index);
            state.queue = newQueue;
            state._history.push(...skipped);
            return;
          }
          // for negative indexes
          // negative indexes will be only used when repeat is enabled
          const historyIndex = -(index + 1);
          if (
            state._history.length == 0 ||
            historyIndex + 1 > state._history.length
          ) {
            return;
          }
          const newHistory = state._history.slice(0, historyIndex);
          const toQueue = state._history.slice(historyIndex);
          if (state._history.length === 0) return;
          state._history = newHistory;
          state.queue = [...toQueue, ...state.queue];
        });
      },

      goNext: () => {
        set((state) => {
          if (state.queue.length === 0 && state._history.length === 0) return;

          if (state.queue.length === 0 || state.queue.length === 1) {
            if (!state.repeat) return;

            state.queue = [...state._history];
            state._history = [];
            return;
          }

          state._history.push(state.queue[0]);
          state.queue = state.queue.slice(1);
        });
      },

      goPrev: () => {
        set((state) => {
          if (state.queue.length === 0 && state._history.length === 0) return;

          if (state._history.length === 0) {
            if (!state.repeat) return;

            state._history = state.queue.slice(0, -2);
            state.queue = [state.queue[-1]];
            return;
          }

          state.queue = [state._history[-1], ...state.queue];
          state._history = state._history.slice(0, -1);
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
