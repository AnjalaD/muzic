import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Howl } from "howler";
import { usePlayerStore } from "@/state/player";
import { useQueueStore } from "@/state/queue";
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";

let prevIndex: number;

export function Player() {
  const { sound, setSound } = usePlayerStore();
  const { currentIndex, data, goNext, goPrev } = useQueueStore();

  const [duration, setDuration] = useState<number>();
  const [pos, setPos] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(sound?.playing());
  const [isSeeking, setIsSeeking] = useState(false);

  console.log({ sound, currentIndex, duration, pos, isPlaying, isSeeking });

  useEffect(() => {
    if (currentIndex === undefined) {
      sound?.stop();
      return;
    }

    if (sound && currentIndex === prevIndex) {
      return;
    }

    const soundBlob = data[currentIndex].fileWrapper;
    if (!(soundBlob instanceof Blob)) return;

    const newSound = new Howl({
      src: [URL.createObjectURL(soundBlob)],
      format: "mp4",
      html5: false,
    });
    prevIndex = currentIndex;

    newSound.once("load", () => {
      setDuration(newSound?.duration());
    });

    newSound.on("play", () => {
      setIsPlaying(true);
      console.log("Playing");
    });

    newSound.on("pause", () => {
      setIsPlaying(false);
    });

    newSound.on("stop", () => {
      setDuration(undefined);
      setPos(undefined);
      setIsPlaying(false);
    });

    newSound.on("end", () => {
      setIsPlaying(false);
      goNext();
    });

    setSound(newSound);
  }, [currentIndex, data, goNext, setSound, sound]);

  useEffect(() => {
    if (!isPlaying || isSeeking) return;

    const t = setInterval(() => {
      setPos(sound?.seek());
    }, 1000);

    return () => {
      clearInterval(t);
    };
  }, [isPlaying, isSeeking, sound]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="overflow-hidden whitespace-nowrap text-ellipsis">
          {currentIndex !== undefined
            ? data[currentIndex].title
            : "Nothing to play"}
        </CardTitle>
        <CardDescription>
          {formatDuration(pos) ?? "-"}/{formatDuration(duration) ?? "-"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Slider
          value={[pos ?? 0]}
          max={duration}
          step={1}
          onValueChange={(val) => {
            setIsSeeking(true);
            setPos(val[0]);
          }}
          onValueCommit={(val) => {
            setIsSeeking(false);
            setPos(val[0]);
            sound?.seek(val[0]);
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-2">
        <Button variant="outline" onClick={goPrev}>
          <SkipBackIcon />
        </Button>
        <Button
          onClick={() => {
            if (data.length === 0) return;

            if (currentIndex === undefined) {
              goNext();
              return;
            }

            if (!sound) {
              return;
            }

            if (!sound.playing()) {
              sound.play();
            } else {
              sound.pause();
            }
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button variant="outline" onClick={goNext}>
          <SkipForwardIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}

function formatDuration(dur?: number) {
  if (!dur) return undefined;

  const minutes = Math.floor(dur / 60);
  const seconds = Math.floor(dur % 60);

  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
}
