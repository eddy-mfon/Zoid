/* ZOID Concrete Ritual: collection interactions move like a field index—responsive on hover, deliberate on filtering. */
import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

export function useCollectionMotion(rootRef: RefObject<HTMLElement | null>, filterKey: string) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = root.querySelectorAll<HTMLElement>(".collection-card, .archive-card");
        cards.forEach((card) => {
          const image = card.querySelector<HTMLElement>(".collection-image img, .archive-card-image img");
          const meta = card.querySelector<HTMLElement>(".collection-card-meta, .archive-card-meta");
          card.addEventListener("mouseenter", () => {
            gsap.to(card, { y: -6, duration: 0.28, ease: "power3.out", overwrite: true });
            if (image) gsap.to(image, { scale: 1.05, duration: 0.4, ease: "power3.out", overwrite: true });
            if (meta) gsap.to(meta, { x: 4, duration: 0.25, ease: "power3.out", overwrite: true });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: "power3.out", overwrite: true });
            if (image) gsap.to(image, { scale: 1, duration: 0.38, ease: "power3.out", overwrite: true });
            if (meta) gsap.to(meta, { x: 0, duration: 0.25, ease: "power3.out", overwrite: true });
          });
        });
        const grid = root.querySelector<HTMLElement>(".collection-grid");
        if (grid) gsap.fromTo(grid, { autoAlpha: 0.4, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" });
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, [rootRef, filterKey]);
}
