/* ZOID Concrete Ritual: collection interactions move like a field index—responsive on hover, deliberate on filtering, cinematic on archive scroll. */
import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCollectionMotion(rootRef: RefObject<HTMLElement | null>, filterKey: string) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = root.querySelectorAll<HTMLElement>(".collection-card");
        cards.forEach((card) => {
          const image = card.querySelector<HTMLElement>(".collection-image img");
          const meta = card.querySelector<HTMLElement>(".collection-card-meta");
          card.addEventListener("mouseenter", () => {
            gsap.to(card, { y: -8, duration: .28, ease: "power3.out", overwrite: true });
            if (image) gsap.to(image, { scale: 1.07, rotate: -1.2, duration: .45, ease: "power3.out", overwrite: true });
            if (meta) gsap.to(meta, { x: 7, duration: .28, ease: "power3.out", overwrite: true });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, { y: 0, duration: .32, ease: "power3.out", overwrite: true });
            if (image) gsap.to(image, { scale: 1, rotate: 0, duration: .42, ease: "power3.out", overwrite: true });
            if (meta) gsap.to(meta, { x: 0, duration: .28, ease: "power3.out", overwrite: true });
          });
        });
        const grid = root.querySelector<HTMLElement>(".collection-grid");
        if (grid) gsap.fromTo(grid, { autoAlpha: .35, y: 10 }, { autoAlpha: 1, y: 0, duration: .38, ease: "power3.out", delay: .04 });
        const archive = root.querySelector<HTMLElement>(".archive-section");
        const track = root.querySelector<HTMLElement>(".archive-track");
        if (archive && track && window.matchMedia("(min-width: 801px)").matches) {
          const distance = Math.max(0, track.scrollWidth - window.innerWidth + 180);
          gsap.to(track, { x: -distance, ease: "none", scrollTrigger: { trigger: archive, start: "top top", end: () => `+=${Math.max(distance * 1.25, 900)}`, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
        }
        return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, [rootRef, filterKey]);
}
