/* ZOID Concrete Ritual: GSAP motion is directional, editorial, and subordinate to the story. Reduced motion exits cleanly. */
import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function splitHeadline(element: HTMLElement) {
  if (element.dataset.zoidSplit === "true") return;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) textNodes.push(node as Text);
  textNodes.forEach((textNode) => {
    const value = textNode.nodeValue ?? "";
    if (!value.trim()) return;
    const fragment = document.createDocumentFragment();
    value.split(/(\s+)/).forEach((part) => {
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode("\u00a0"));
        return;
      }
      const word = document.createElement("span");
      word.className = "zoid-word";
      word.setAttribute("aria-hidden", "true");
      Array.from(part).forEach((character) => {
        const char = document.createElement("span");
        char.className = "zoid-char";
        char.textContent = character;
        word.appendChild(char);
      });
      fragment.appendChild(word);
    });
    textNode.parentNode?.replaceChild(fragment, textNode);
  });
  element.dataset.zoidSplit = "true";
  element.setAttribute("aria-label", element.textContent?.replace(/\u00a0/g, " ") ?? "");
}

export function useZoidMotion(rootRef: RefObject<HTMLElement | null>, options: { floatingJersey?: boolean; floatingJerseyKey?: string } = {}) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const navbar = root.querySelector<HTMLElement>(".topbar");
        const hero = root.querySelector<HTMLElement>(".hero");
        const heroCopy = root.querySelector<HTMLElement>(".hero-copy");
        const navLinks = root.querySelectorAll<HTMLElement>(".nav-links a");

        if (navbar) {
          gsap.fromTo(navbar, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
        }

        if (hero && heroCopy) {
          const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
          heroTimeline.fromTo(heroCopy.querySelector(".eyebrow"), { y: 18 }, { y: 0, duration: .45 })
            .fromTo(heroCopy.querySelector("h1"), { y: 52, clipPath: "inset(100% 0 0 0)" }, { y: 0, clipPath: "inset(0% 0 0 0)", duration: .9 }, "-=.18")
            .fromTo(heroCopy.querySelector(".hero-intro"), { y: 20 }, { y: 0, duration: .5 }, "-=.35")
            .fromTo(heroCopy.querySelectorAll(".hero-actions > *"), { y: 14 }, { y: 0, duration: .38, stagger: .08 }, "-=.2")
            .fromTo(heroCopy.querySelector(".hero-pager"), { y: 8 }, { y: 0, duration: .35 }, "-=.12");
          gsap.to(hero, { backgroundPosition: "53% 48%", ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 } });
        }

        gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".manifesto-band, .shop-section, .special-kits, .story-section, .drop-banner, .collection-card, .detail-info, .fit-guide")).forEach((section) => {
          gsap.fromTo(section, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 95%", once: true } });
        });

        if (navLinks.length) gsap.fromTo(navLinks, { y: -6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .3, stagger: .05, delay: .1, ease: "power2.out" });

        const headlineTargets = [root.querySelector<HTMLElement>(".hero-copy h1"), root.querySelector<HTMLElement>(".manifesto-band h2"), ...Array.from(root.querySelectorAll<HTMLElement>(".feature-info h3, .rail-meta strong, .archive-card-meta h3"))].filter((heading): heading is HTMLElement => Boolean(heading));
        headlineTargets.forEach((heading, index) => {
          splitHeadline(heading);
          const words = heading.querySelectorAll<HTMLElement>(".zoid-word");
          const chars = heading.querySelectorAll<HTMLElement>(".zoid-char");
          const trigger = index === 0 ? undefined : { trigger: heading, start: "top 86%", once: true };
          gsap.fromTo(words, { yPercent: 110, rotation: index === 0 ? -1.5 : 0, autoAlpha: 1 }, { yPercent: 0, rotation: 0, autoAlpha: 1, duration: .72, stagger: index === 0 ? .11 : .16, ease: "power4.out", scrollTrigger: trigger });
          gsap.fromTo(chars, { y: 22, rotationX: -55, autoAlpha: 1 }, { y: 0, rotationX: 0, autoAlpha: 1, duration: .42, stagger: index === 0 ? .018 : .024, delay: index === 0 ? .18 : .12, ease: "back.out(1.45)", scrollTrigger: trigger });
        });

        const motionHeadings = root.querySelectorAll<HTMLElement>(".section-heading h2, .special-kits-head h2, .story-copy h2, .drop-banner h2, .archive-intro h2");
        motionHeadings.forEach((heading) => {
          gsap.fromTo(heading, { y: 30 }, { y: 0, duration: .5, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 95%", once: true } });
        });

        const motionCopy = root.querySelectorAll<HTMLElement>(".manifesto-side p, .story-copy>p:not(.eyebrow), .drop-note p, .collection-note, .archive-intro>p:last-child");
        motionCopy.forEach((copy) => {
          gsap.fromTo(copy, { y: 14 }, { y: 0, duration: .4, delay: .05, ease: "power3.out", scrollTrigger: { trigger: copy, start: "top 98%", once: true } });
        });

        // Force ScrollTrigger refresh after layout setup
        setTimeout(() => ScrollTrigger.refresh(), 50);

        return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, [rootRef, options.floatingJersey, options.floatingJerseyKey]);
}
