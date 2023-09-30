import { FileWrapper } from "@/util/file-system";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Sound = {
  fileWrapper: FileWrapper;
  title: string;
  meta: {
    artist?: string;
    year?: string;
    genre?: string;
    album?: string;
    cover?: {
      data: ArrayBuffer;
      mime: string;
      type: string;
      description: string;
    };
  };
};

type PlayerState = {
  data: Map<string, Sound>;
  add: (...items: Sound[]) => void;
  remove: (key: string) => void;
};

export const useSoundsStore = create<PlayerState>()(
  devtools(
    immer((set) => ({
      data: new Map(),
      add: (...items) => {
        console.log("Adding");
        set((state) => {
          for (const item of items) {
            state.data.set(item.title, item);
          }
        });
      },
      remove: (index) => {
        set((state) => {
          state.data.delete(index);
        });
      },
    })),
    { name: "sounds" }
  )
);
