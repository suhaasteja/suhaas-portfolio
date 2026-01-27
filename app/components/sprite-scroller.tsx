"use client";

import { useEffect, useRef } from "react";

type Mode = "walk" | "jump" | "attack";

type SpriteConfig = {
  src: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  totalFrames?: number;
  scale?: number;
};

const defaultConfigs: Record<Mode, SpriteConfig> = {
  walk: {
    src: "/sprites/walk-sprite-sheet.png",
    frameWidth: 400,
    frameHeight: 448,
    columns: 3,
    rows: 2,
    totalFrames: 6,
  },
  jump: {
    src: "/sprites/jump-sprite-sheet.png",
    frameWidth: 512,
    frameHeight: 512,
    columns: 2,
    rows: 2,
    totalFrames: 4,
  },
  attack: {
    src: "/sprites/attack-sprite-sheet.png",
    frameWidth: 792,
    frameHeight: 336,
    columns: 2,
    rows: 2,
    totalFrames: 4,
  },
};

const DEFAULT_MODE: Mode = "walk";
const DEFAULT_FPS = 6;
const BG_TOLERANCE = 18;
const TEXT_HEIGHT_MULTIPLIER = 1.9;
const SINGLE_CLICK_TIMEOUT_MS = 250;
const MODE_TIMEOUT_MS = 900;
const DOUBLE_TAP_WINDOW_MS = 280;

export default function SpriteScroller({
  configs = defaultConfigs,
  mode = DEFAULT_MODE,
  fps = DEFAULT_FPS,
  className = "",
}: {
  configs?: Record<Mode, SpriteConfig>;
  mode?: Mode;
  fps?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Record<Mode, HTMLImageElement | null>>({
    walk: null,
    jump: null,
    attack: null,
  });
  const processedRef = useRef<Record<Mode, HTMLCanvasElement | null>>({
    walk: null,
    jump: null,
    attack: null,
  });
  const sizesRef = useRef<
    Record<Mode, { frameWidth: number; frameHeight: number } | null>
  >({
    walk: null,
    jump: null,
    attack: null,
  });
  const modeRef = useRef<Mode>(mode);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(-1);
  const startTimeRef = useRef<number>(0);
  const clickTimeoutRef = useRef<number | null>(null);
  const modeTimeoutRef = useRef<number | null>(null);
  const activeModeRef = useRef<Mode>(mode);
  const lastTapRef = useRef<number>(0);

  const ensureCanvasSize = (width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const removeWhiteBackground = (source: HTMLCanvasElement) => {
    const ctx = source.getContext("2d");
    if (!ctx) return source;

    const { width, height } = source;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];
    const bgA = data[3];

    if (bgA === 0) {
      return source;
    }

    const toleranceSq = BG_TOLERANCE * BG_TOLERANCE;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      if (dr * dr + dg * dg + db * db <= toleranceSq) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return source;
  };

  const quantizeScale = (scale: number) => {
    if (scale <= 0) return scale;
    const target = Math.max(1, Math.round(scale));
    const q1 = 1 / Math.max(1, Math.round(1 / scale));
    return Math.abs(scale - target) < Math.abs(scale - q1) ? target : q1;
  };

  const getFontSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 16;
    const fontSize = Number.parseFloat(
      window.getComputedStyle(canvas).fontSize || "16",
    );
    return Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 16;
  };

  const getDynamicScale = (
    config: SpriteConfig,
    frameHeight: number,
    fontSize: number,
  ) => {
    if (typeof config.scale === "number") {
      return config.scale;
    }
    const scale = (fontSize * TEXT_HEIGHT_MULTIPLIER) / frameHeight;
    return quantizeScale(scale);
  };

  const drawFrame = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentMode = activeModeRef.current;
    const config = configs[currentMode];
    const processed = processedRef.current[currentMode];
    const image = processed ?? imagesRef.current[currentMode];
    if (!image) return;

    const fontSize = getFontSize();
    const derivedSizes = sizesRef.current[currentMode];
    const frameWidth = derivedSizes?.frameWidth ?? config.frameWidth;
    const frameHeight = derivedSizes?.frameHeight ?? config.frameHeight;
    const scale = getDynamicScale(config, frameHeight, fontSize);
    const totalFrames =
      config.totalFrames ?? config.columns * config.rows;
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }
    const elapsed = time - startTimeRef.current;
    const frameDuration = 1000 / Math.max(1, fps);
    const frame = Math.floor(elapsed / frameDuration) % totalFrames;
    if (frame === lastFrameRef.current) {
      return;
    }
    lastFrameRef.current = frame;
    frameRef.current = frame;

    const col = frame % config.columns;
    const row = Math.floor(frame / config.columns);

    const displayFrameWidth = Math.round(frameWidth * scale);
    const displayFrameHeight = Math.round(frameHeight * scale);

    ensureCanvasSize(displayFrameWidth, displayFrameHeight);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, displayFrameWidth, displayFrameHeight);

    ctx.drawImage(
      image,
      col * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      displayFrameWidth,
      displayFrameHeight,
    );
  };

  useEffect(() => {
    (Object.keys(configs) as Mode[]).forEach((key) => {
      const config = configs[key];
      const image = new Image();
      image.decoding = "async";
      image.src = config.src;
      image.onload = () => {
        imagesRef.current[key] = image;
        sizesRef.current[key] = {
          frameWidth: Math.round(image.width / config.columns),
          frameHeight: Math.round(image.height / config.rows),
        };
        const processedCanvas = document.createElement("canvas");
        processedCanvas.width = image.width;
        processedCanvas.height = image.height;
        const ctx = processedCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          processedRef.current[key] = removeWhiteBackground(processedCanvas);
        }
        drawFrame();
      };
    });
  }, [configs]);

  useEffect(() => {
    modeRef.current = mode;
    frameRef.current = 0;
    activeModeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setActiveMode = (nextMode: Mode) => {
      activeModeRef.current = nextMode;
      startTimeRef.current = 0;
      lastFrameRef.current = -1;
      if (modeTimeoutRef.current) {
        window.clearTimeout(modeTimeoutRef.current);
      }
      if (nextMode !== modeRef.current) {
        modeTimeoutRef.current = window.setTimeout(() => {
          activeModeRef.current = modeRef.current;
          startTimeRef.current = 0;
          lastFrameRef.current = -1;
        }, MODE_TIMEOUT_MS);
      }
    };

    const scheduleSingleTap = () => {
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = window.setTimeout(() => {
        setActiveMode("jump");
      }, SINGLE_CLICK_TIMEOUT_MS);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        event.preventDefault();
      }
      const now = performance.now();
      const sinceLastTap = now - lastTapRef.current;
      lastTapRef.current = now;

      if (sinceLastTap > 0 && sinceLastTap < DOUBLE_TAP_WINDOW_MS) {
        if (clickTimeoutRef.current) {
          window.clearTimeout(clickTimeoutRef.current);
        }
        setActiveMode("attack");
        lastTapRef.current = 0;
        return;
      }

      scheduleSingleTap();
    };

    canvas.addEventListener("pointerup", handlePointerUp);

    const loop = (time: number) => {
      drawFrame(time);
      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      canvas.removeEventListener("pointerup", handlePointerUp);
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      if (modeTimeoutRef.current) {
        window.clearTimeout(modeTimeoutRef.current);
      }
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = null;
      startTimeRef.current = 0;
    };
  }, [configs, fps]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="sprite-pixel"
        aria-label="Animated sprite"
        role="img"
      />
    </span>
  );
}
