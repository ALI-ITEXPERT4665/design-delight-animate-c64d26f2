import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView, usePrefersReducedMotion } from "@/hooks/use-in-view";

type Props = {
  src: string;
  poster: string;
  className?: string;
  drift?: boolean;
  parallax?: boolean;
  alt?: string;
};

export function BackgroundVideo({
  src,
  poster,
  className,
  drift = true,
  parallax = true,
  alt = "",
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Merge refs
  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (inView) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, reduced]);

  useEffect(() => {
    if (reduced || !parallax) return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (below) → 0 (centered) → 1 (above)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const translate = Math.max(-60, Math.min(60, progress * -40));
      const scale = 1.12 + Math.abs(progress) * 0.03;
      inner.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, parallax]);

  return (
    <div ref={setRefs} className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        ref={innerRef}
        className="absolute inset-[-8%] will-change-transform"
        style={{ transform: "translate3d(0,0,0) scale(1.12)" }}
      >
        {reduced ? (
          <img src={poster} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            className={cn("h-full w-full object-cover", drift && "bg-video-zoom")}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-hidden="true"
            disableRemotePlayback
          >
            <source src={src} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
