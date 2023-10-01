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
import { useSoundsStore } from "@/state/sounds";
import { ListXIcon, PlayIcon, XIcon } from "lucide-react";

export function Queue() {
  const queueStore = useQueueStore();
  const soundsStore = useSoundsStore();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex gap-4">
          <div className="flex-grow">
            <CardTitle>Queue</CardTitle>
            <CardDescription>Now playing</CardDescription>
          </div>

          {queueStore.queue.length > 0 && (
            <Button variant="ghost" onClick={() => queueStore.removeAll()}>
              <ListXIcon />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {queueStore.queue.map((id, index) => {
          const sound = soundsStore.data.get(id);

          if (!sound) return <div>Not available</div>;

          return (
            <SoundCard
              key={id + index}
              sound={sound}
              nowPlaying={index === 0}
              actions={
                <div className="flex gap-2 items-center mr-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => queueStore.goTo(index)}
                  >
                    <PlayIcon />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => queueStore.remove(index)}
                  >
                    <XIcon />
                  </Button>
                </div>
              }
            />
          );
        })}
        {queueStore.repeat &&
          queueStore._history.map((id, index) => {
            const sound = soundsStore.data.get(id);

            if (!sound) return <div>Not available</div>;

            return (
              <SoundCard
                key={id + index}
                sound={sound}
                actions={
                  <div className="flex gap-2 items-center mr-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => queueStore.goTo(index)}
                    >
                      <PlayIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => queueStore.remove(index)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                }
              />
            );
          })}
      </CardContent>
    </Card>
  );
}
