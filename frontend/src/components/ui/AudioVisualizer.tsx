import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  width?: number;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  stream,
  width = 200,
  height = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!stream) {
      // Draw quiet state
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; // sleek blue-gray line
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    let audioCtx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let animationFrameId: number;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        animationFrameId = requestAnimationFrame(draw);

        analyser!.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Neon Glow Styling
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2.5;

        // Wave 1: Cyan Glow
        ctx.beginPath();
        ctx.shadowColor = 'rgba(6, 182, 212, 0.7)'; // neon cyan
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        
        let sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        // Wave 2: Green Glow (slightly offset and scaled down for depth)
        ctx.beginPath();
        ctx.shadowColor = 'rgba(16, 185, 129, 0.5)'; // neon green
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 1.5;
        x = 0;

        for (let i = 0; i < bufferLength; i++) {
          // Add phase shift and amplitude reduction
          const val = dataArray[(i + 4) % bufferLength];
          const v = val / 128.0;
          // dampen the amplitude slightly
          const diff = v - 1.0;
          const y = ((1.0 + diff * 0.6) * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      };

      draw();
    } catch (err) {
      console.error('Error initializing AudioVisualizer:', err);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch((err) => console.warn('Failed to close AudioContext:', err));
      }
    };
  }, [stream]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        background: 'transparent',
        borderRadius: '8px',
        maxWidth: '100%',
      }}
    />
  );
};

export default AudioVisualizer;
