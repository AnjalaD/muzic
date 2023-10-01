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
import { ListPlusIcon } from "lucide-react";

export function Library() {
  const data = useSoundsStore((state) => state.data);
  const addToQueue = useQueueStore((state) => state.add);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Library</CardTitle>
        <CardDescription>Everything you have.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[...data.values()].map((sound) => {
          return (
            <SoundCard
              key={sound.id}
              sound={sound}
              actions={
                <div className="flex gap-2 items-center mr-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addToQueue(sound.id)}
                  >
                    <ListPlusIcon />
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
