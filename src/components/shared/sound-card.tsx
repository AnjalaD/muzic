import { Sound } from "@/state/sounds";
import { MusicIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/util/styles";

interface SoundCardProps {
  sound: Sound;
  nowPlaying?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
}

export function SoundCard({
  sound,
  nowPlaying,
  onClick,
  actions,
}: SoundCardProps) {
  // const cover = s.meta.cover?.data
  // ? URL.createObjectURL(
  //     new Blob([new Uint8ClampedArray(s.meta.cover.data)], {
  //       type: s.meta.cover.mime,
  //     })
  //   )
  // : undefined;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group overflow-hidden bg-background/80 hover:bg-background/40 transition-colors",
        nowPlaying &&
          "bg-gradient-to-b from-primary/20 via-primary/10 to-primary/30"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 h-12 w-12 m-1 rounded-md overflow-hidden">
          <div className="w-full h-full grid place-items-center bg-primary group-hover:bg-primary/50">
            <MusicIcon />
          </div>
        </div>

        <CardHeader className="py-2 pl-0 space-y-0 w-full overflow-hidden">
          <CardTitle className="text-base font-normal text-ellipsis whitespace-nowrap overflow-hidden">
            {sound.title}
          </CardTitle>
          <CardDescription className="mt-0">
            {sound.meta.artist} {sound.meta.album} {sound.meta.year}
          </CardDescription>
        </CardHeader>

        <div className="flex-shrink-0">{actions}</div>
      </div>
    </Card>
  );
}
