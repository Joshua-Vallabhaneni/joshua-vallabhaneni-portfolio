"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollTriggerCleanup() {
  const pathname = usePathname();
  const previousWasWork = useRef(false);

  useEffect(() => {
    const onWork = pathname.startsWith("/work/");
    const wasWork = previousWasWork.current;
    previousWasWork.current = onWork;

    if (!wasWork) return;

    let cancelled = false;
    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      ScrollTrigger.getAll().forEach((t) => {
        const trigger = t.vars.trigger;
        if (!(trigger instanceof Element) || !document.contains(trigger)) {
          t.kill();
        }
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
