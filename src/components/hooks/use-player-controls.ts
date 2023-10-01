import { usePlayerStore } from "@/state/player";
import { useQueueStore } from "@/state/queue";
import { useSoundsStore } from "@/state/sounds";

import { useMemo, useState } from "react";
import { Howl } from "howler";

type RepeatMode = "OFF" | "ON" | "ONE";

export const usePlayerControls = () => {
  const queueStore = useQueueStore();
  const soundsStore = useSoundsStore();
  const playerStore = usePlayerStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatOnce, setRepeatOnce] = useState(false);

  const nowPlaying = useMemo(() => {
    const queue = queueStore.queue;
    if (queue.length === 0) return undefined;

    const current = queue[0];
    const newSound = soundsStore.data.get(current);
    return newSound;
  }, [soundsStore.data, queueStore.queue]);

  const repeat = useMemo<RepeatMode>(() => {
    if (queueStore.repeat) return "ON";
    if (repeatOnce) return "ONE";
    return "OFF";
  }, [queueStore.repeat, repeatOnce]);

  const play = () => {
    // play music
    const queue = queueStore.queue;
    if (queue.length === 0 || !nowPlaying) return;

    const playerSound = playerStore.sound;

    if (nowPlaying.id === playerSound?.id) {
      if (playerSound.instance.playing()) {
        return;
      }
      playerSound.instance.play();
      return;
    }

    if (!(nowPlaying.fileWrapper instanceof File)) {
      return;
    }

    const instance = new Howl({
      src: [URL.createObjectURL(nowPlaying.fileWrapper)],
      format: "mp4",
      loop: repeat === "ONE",
      // html5: false,
    });

    instance.once("load", () => {
      instance.play();
    });

    instance.on("play", () => {
      console.log("onPlay");
      setIsPlaying(true);
    });

    instance.on("pause", () => {
      setIsPlaying(false);
    });

    instance.on("stop", () => {
      setIsPlaying(false);
    });

    playerStore.setSound({
      ...nowPlaying,
      instance,
    });
  };

  const pause = () => {
    // pause current sound
    playerStore.sound?.instance.pause();
  };

  const stop = () => {
    // stop current sound
    playerStore.sound?.instance.stop();
  };

  const next = () => {
    // go to next sound
    stop();
    queueStore.goNext();
    play();
  };

  const prev = () => {
    // go to prev sound
    stop();
    queueStore.goNext();
    play();
  };

  const seek = (duration: number) => {
    // seek to position
    playerStore.sound?.instance.seek(duration);
  };

  const getPosition = () => {
    return playerStore.sound?.instance.seek();
  };

  const toggleRepeat = () => {
    if (!queueStore.repeat && !repeatOnce) {
      queueStore.toggleRepeat();
      return;
    }

    if (!repeatOnce) {
      playerStore.sound?.instance.loop(true);
      setRepeatOnce(true);
      queueStore.toggleRepeat();
      return;
    }

    playerStore.sound?.instance.loop(false);
    setRepeatOnce(false);
  };

  const duration = playerStore.sound?.instance.duration();

  return {
    play,
    pause,
    next,
    prev,
    seek,
    getPosition,
    toggleRepeat,
    nowPlaying,
    isPlaying,
    duration,
    repeat,
  };
};
