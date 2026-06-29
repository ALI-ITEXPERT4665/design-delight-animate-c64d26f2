import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInView, usePrefersReducedMotion } from "@/hooks/use-in-view";

type Props = {
  src: string;
  poster: string;
  className?: string;
  drift?: boolean;
  alt?: string;
};

export function BackgroundVideo({ src, poster, className, drift = true, alt = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();

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

  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      {reduced ? (
        <img src={poster} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          className={cn("h-full w-full object-cover", drift && "hero-drift")}
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
  );
}
