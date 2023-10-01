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

import {
  PauseIcon,
  PlayIcon,
  Repeat1Icon,
  RepeatIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { usePlayerControls } from "@/components/hooks/use-player-controls";

export function Player() {
  const {
    nowPlaying,
    play,
    pause,
    next,
    prev,
    seek,
    getPosition,
    toggleRepeat,
    isPlaying,
    duration,
    repeat,
  } = usePlayerControls();

  const [isSeeking, setIsSeeking] = useState(false);
  const [position, setPosition] = useState<number>();

  useEffect(() => {
    if (!isPlaying || isSeeking) return;

    const t = setInterval(() => {
      setPosition(getPosition());
    }, 1000);

    return () => {
      clearInterval(t);
    };
  }, [getPosition, isPlaying, isSeeking]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="overflow-hidden whitespace-nowrap text-ellipsis">
          {nowPlaying?.title ?? "Nothing to play"}
        </CardTitle>
        <CardDescription>
          {formatDuration(position) ?? "-"}/{formatDuration(duration) ?? "-"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Slider
          value={[position ?? 0]}
          max={duration}
          step={1}
          onValueChange={(val) => {
            setIsSeeking(true);
            setPosition(val[0]);
          }}
          onValueCommit={(val) => {
            setIsSeeking(false);
            setPosition(val[0]);
            seek(val[0]);
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-2">
        <Button disabled className="mr-4" variant="outline">
          <ShuffleIcon />
        </Button>

        <Button variant="outline" onClick={prev}>
          <SkipBackIcon />
        </Button>

        <Button
          onClick={() => {
            isPlaying ? pause() : play();
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>

        <Button variant="outline" onClick={next}>
          <SkipForwardIcon />
        </Button>

        <Button
          className="ml-4"
          variant={repeat === "OFF" ? "outline" : "secondary"}
          onClick={toggleRepeat}
        >
          {repeat === "ONE" ? <Repeat1Icon /> : <RepeatIcon />}
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
