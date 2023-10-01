import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Howl } from "howler";
import { Sound } from "./sounds";

type SoundInstance = Sound & {
  instance: Howl;
};

type PlayerState = {
  sound?: SoundInstance;
  setSound: (newSound: SoundInstance) => void;
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    immer((set) => ({
      sound: undefined,
      setSound: (newSound) => {
        set((state) => {
          state.sound = newSound;
        });
      },
    }))
  )
);
