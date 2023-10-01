import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sound, useSoundsStore } from "@/state/sounds";
import { getFilesFromDirectory } from "@/util/file-system";
import * as id3 from "id3js";

export function LocalImporter() {
  const soundsStore = useSoundsStore();

  const onImport = async () => {
    const files = await getFilesFromDirectory();
    console.log({ files });
    if (!files) return;

    const newSounds: Sound[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let title = file.name;

      if (file instanceof Blob) {
        try {
          const meta = await id3.fromFile(file);
          console.log({ meta });

          title = meta?.title ?? title;
          const genre = (meta?.genre ?? undefined) as string | undefined;
          const cover =
            meta?.images && (meta.images as unknown[]).length > 0
              ? (meta.images as any[])[0]
              : undefined;

          newSounds.push({
            id: title,
            fileWrapper: file,
            title,
            meta: {
              album: meta?.album ?? undefined,
              artist: meta?.artist ?? undefined,
              year: meta?.year ?? undefined,
              genre,
              cover,
            },
          });
        } catch (e) {
          console.log(e);

          newSounds.push({
            id: title,
            fileWrapper: file,
            title: file.name,
            meta: {
              album: undefined,
              artist: undefined,
              genre: undefined,
              year: undefined,
            },
          });
        }
      }
    }

    soundsStore.add(...newSounds);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Files</CardTitle>
        <CardDescription>Import your local files.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onImport}>Import Files</Button>
      </CardContent>
    </Card>
  );
}
