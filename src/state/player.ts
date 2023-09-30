import { Howl } from "howler";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type PlayerState = {
  sound?: Howl;
  setSound: (newSound: Howl) => void;
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    immer((set) => ({
      sound: undefined,
      setSound: (newSound: Howl) => {
        set((state) => {
          if (state.sound) {
            state.sound.stop();
          }
          state.sound = newSound;
          state.sound.play();
        });
      },
    }))
  )
);
