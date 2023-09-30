import { SoundCard } from "@/components/shared/sound-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQueueStore } from "@/state/queue";
import { ListXIcon, PlayIcon, XIcon } from "lucide-react";

export function Queue() {
  const queue = useQueueStore();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex gap-4">
          <div className="flex-grow">
            <CardTitle>Queue</CardTitle>
            <CardDescription>Now playing</CardDescription>
          </div>

          {queue.data.length > 0 && (
            <Button variant="ghost" onClick={() => queue.removeAll()}>
              <ListXIcon />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {queue.data.map((s, index) => (
          <SoundCard
            key={s.title}
            sound={s}
            nowPlaying={queue.currentIndex === index}
            actions={
              <div className="flex gap-2 items-center mr-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => queue.goTo(index)}
                >
                  <PlayIcon />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => queue.remove(index)}
                >
                  <XIcon />
                </Button>
              </div>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
