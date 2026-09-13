import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Users who asked for less motion get the plain dark background instead of a WebGL scene.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mounted = true;

    const initTubes = async () => {
      try {
        // Bundled from node_modules so Vite splits it into its own lazily loaded chunk
        // instead of fetching an 800 KB module from a CDN at runtime.
        const module = await import('threejs-components/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvas, {
          bloom: { threshold: 0, strength: 1.1, radius: 0.5 },
          tubes: {
            // Thinner tubes than the library default (0.005 – 0.05) so the trail reads as an accent.
            minRadius: 0.003,
            maxRadius: 0.024,
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        // The library pins the renderer to a 2x pixel ratio, so a full-screen canvas with a
        // bloom pass pushes four times the pixels it needs to. Bloom blurs the output anyway,
        // so 1x is visually identical and far cheaper on integrated GPUs.
        if (app?.three) {
          app.three.minPixelRatio = 1;
          app.three.maxPixelRatio = 1;
          app.three.resize();
        }

        tubesRef.current = app;
      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      tubesRef.current?.dispose?.();
      tubesRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div 
      className={cn("relative w-full h-full min-h-[400px] overflow-hidden bg-background", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />
      
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
