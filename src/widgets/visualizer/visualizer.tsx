import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlayerStore } from "@/state/player";
import { useEffect, useRef } from "react";
import { Howler } from "howler";
("howler");

export function Visualizer() {
  const sound = usePlayerStore((state) => state.sound);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sound || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const analyser = Howler.ctx.createAnalyser();

    console.log({ Howler });

    Howler.masterGain.disconnect();
    Howler.masterGain.connect(Howler.ctx.destination);
    analyser.connect(Howler.ctx.destination);

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.5;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(analyser.fftSize);

    function draw() {
      requestAnimationFrame(draw);

      if (ctx === null) return;

      // analyser.getByteFrequencyData(dataArray);
      analyser.getByteTimeDomainData(dataArray);

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;
      //   const frequencyBins = analyser.fftSize / 2;
      //   const scale = Math.log(frequencyBins - 1) / WIDTH;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 4;
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      x = 0;
      // console.log(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(WIDTH, ((dataArray[0] / 128.0) * HEIGHT) / 2);
      ctx.stroke();
    }

    draw();
  }, [sound]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} className="w-full h-40" />
      </CardContent>
    </Card>
  );
}
