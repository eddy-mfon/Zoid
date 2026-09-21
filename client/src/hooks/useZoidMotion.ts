/* ZOID Concrete Ritual: GSAP motion is directional, editorial, and subordinate to the story. Reduced motion exits cleanly. */
import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productBySlug } from "@/lib/catalog";

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
          gsap.fromTo(navbar, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .65, ease: "power3.out" });
          ScrollTrigger.create({
            trigger: root,
            start: "top -80",
            onUpdate: (self) => {
              if (window.scrollY < 50) {
                gsap.to(navbar, { y: 0, duration: 0.2, ease: "power2.out", overwrite: true });
              } else {
                gsap.to(navbar, { y: self.direction === 1 ? -76 : 0, duration: 0.24, ease: "power2.out", overwrite: true });
              }
            }
          });
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
          gsap.fromTo(section, { y: 26 }, { y: 0, duration: .6, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 96%", once: true, invalidateOnRefresh: true } });
        });
        if (navLinks.length) gsap.fromTo(navLinks, { y: -10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .35, stagger: .07, delay: .2, ease: "power3.out" });

        const headlineTargets = [root.querySelector<HTMLElement>(".hero-copy h1"), root.querySelector<HTMLElement>(".manifesto-band h2"), ...Array.from(root.querySelectorAll<HTMLElement>(".feature-info h3, .rail-meta strong, .archive-card-meta h3"))].filter((heading): heading is HTMLElement => Boolean(heading));
        headlineTargets.forEach((heading, index) => {
          splitHeadline(heading);
          const words = heading.querySelectorAll<HTMLElement>(".zoid-word");
          const chars = heading.querySelectorAll<HTMLElement>(".zoid-char");
          const trigger = index === 0 ? undefined : { trigger: heading, start: "top 86%", once: true };
          gsap.fromTo(words, { yPercent: 110, rotation: index === 0 ? -1.5 : 0, autoAlpha: 1 }, { yPercent: 0, rotation: 0, autoAlpha: 1, duration: .72, stagger: index === 0 ? .11 : .16, ease: "power4.out", scrollTrigger: trigger });
          gsap.fromTo(chars, { y: 22, rotationX: -55, autoAlpha: 1 }, { y: 0, rotationX: 0, autoAlpha: 1, duration: .42, stagger: index === 0 ? .018 : .024, delay: index === 0 ? .18 : .12, ease: "back.out(1.45)", scrollTrigger: trigger });
          if (heading.matches(".hero-copy h1")) {
            chars.forEach((char) => {
              let touchTimer: number | undefined;
              const respond = () => gsap.to(char, { y: -7, rotation: gsap.utils.random(-5, 5), color: "var(--pink)", duration: .18, ease: "power3.out", overwrite: true });
              const reset = () => gsap.to(char, { y: 0, rotation: 0, color: "", duration: .34, ease: "elastic.out(1, .45)", overwrite: true });
              char.addEventListener("mouseenter", respond);
              char.addEventListener("mouseleave", reset);
              char.addEventListener("touchstart", () => { respond(); window.clearTimeout(touchTimer); touchTimer = window.setTimeout(reset, 650); }, { passive: true });
            });
          }
        });
        const manifestoAccent = root.querySelector<HTMLElement>(".manifesto-band h2 span");
        if (manifestoAccent) gsap.fromTo(manifestoAccent, { color: "#252525", opacity: .68, filter: "saturate(.25)" }, { color: "var(--pink)", opacity: 1, filter: "saturate(1)", duration: .7, ease: "power3.out", scrollTrigger: { trigger: manifestoAccent, start: "top 84%", once: true } });
        const productLinks = root.querySelectorAll<HTMLAnchorElement>('a[href^="/product/"]');
        productLinks.forEach((link) => {
          const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const href = link.getAttribute("href");
            if (!href) return;
            const product = productBySlug(href.split("/").pop() ?? "");
            const overlay = document.createElement("div");
            overlay.className = "zoid-route-overlay";
            overlay.innerHTML = product ? `<div class="zoid-route-overlay-media"><img src="${product.image}" alt="" /></div><div class="zoid-route-overlay-copy"><span>ARCHIVE / PRODUCT DOSSIER</span><strong>${product.name}</strong><small>FIELD / ${product.category.toUpperCase()}</small></div>` : `<div class="zoid-route-overlay-copy"><span>ZOID / FIELD NOTE</span><strong>ENTERING THE ARCHIVE.</strong></div>`;
            document.body.appendChild(overlay);
            const card = link.closest<HTMLElement>(".collection-card");
            const siblings = card?.parentElement ? Array.from(card.parentElement.querySelectorAll<HTMLElement>(".collection-card")) : [];
            const timeline = gsap.timeline({ onComplete: () => { window.history.pushState({}, "", href); window.dispatchEvent(new PopStateEvent("popstate")); window.setTimeout(() => overlay.remove(), 120); } });
            timeline.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: .18, ease: "power2.out" }).fromTo(overlay.querySelector(".zoid-route-overlay-media"), { scale: 1.12, xPercent: 8 }, { scale: 1, xPercent: 0, duration: .52, ease: "power3.out" }, "-=.08").fromTo(overlay.querySelector(".zoid-route-overlay-copy"), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .35, ease: "power3.out" }, "-=.26");
            if (card && siblings.length) timeline.to(siblings.filter((item) => item !== card), { autoAlpha: .12, y: 8, duration: .24, stagger: .035, ease: "power2.out" }, "-=.3").to(card, { scale: 1.025, duration: .28, ease: "power3.out" }, "-=.18");
            timeline.to(root, { y: -10, autoAlpha: .06, duration: .22, ease: "power3.in" }, "-=.16");
          };
          link.addEventListener("click", onClick);
        });
        const motionHeadings = root.querySelectorAll<HTMLElement>(".section-heading h2, .special-kits-head h2, .story-copy h2, .drop-banner h2, .archive-intro h2");
        motionHeadings.forEach((heading) => {
          gsap.fromTo(heading, { y: 42, clipPath: "inset(0 0 12% 0)" }, { y: 0, clipPath: "inset(0% 0 0 0)", duration: .66, ease: "power4.out", scrollTrigger: { trigger: heading, start: "top 96%", once: true, invalidateOnRefresh: true } });
        });
        const motionCopy = root.querySelectorAll<HTMLElement>(".manifesto-side p, .story-copy>p:not(.eyebrow), .drop-note p, .collection-note, .archive-intro>p:last-child");
        motionCopy.forEach((copy) => {
          gsap.fromTo(copy, { y: 18 }, { y: 0, duration: .44, delay: .08, ease: "power3.out", scrollTrigger: { trigger: copy, start: "top 98%", once: true, invalidateOnRefresh: true } });
        });
        root.querySelectorAll<HTMLElement>(".eyebrow").forEach((label) => {
          gsap.fromTo(label, { x: -14 }, { x: 0, duration: .34, ease: "power3.out", scrollTrigger: { trigger: label, start: "top 99%", once: true, invalidateOnRefresh: true } });
        });
        const sectionMarkers = root.querySelectorAll<HTMLElement>(".route, .archive-corner, .feature-index, .story-stamp, .drop-number");
        gsap.fromTo(sectionMarkers, { autoAlpha: 0, scale: .86, rotation: -5 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .45, stagger: .08, ease: "back.out(1.6)", scrollTrigger: { trigger: root, start: "top top", once: true } });
        const story = root.querySelector<HTMLElement>(".story-section");
        const storyImage = root.querySelector<HTMLElement>(".story-image img");
        if (story && storyImage) gsap.to(storyImage, { yPercent: -9, ease: "none", scrollTrigger: { trigger: story, start: "top bottom", end: "bottom top", scrub: 1.2 } });
        if (options.floatingJersey) {
          const float = root.querySelector<HTMLElement>(".floating-jersey");
          if (float) {
            gsap.set(float, { autoAlpha: 0, scale: .72, rotation: -8 });
            gsap.to(float, { autoAlpha: .94, scale: .86, rotation: 2, duration: .6, delay: .7, ease: "power3.out" });
            if (options.floatingJerseyKey) gsap.fromTo(float, { scale: .72, rotation: -13, autoAlpha: .36 }, { scale: .86, rotation: 2, autoAlpha: .94, duration: .48, ease: "power3.out" });
            gsap.to(float, { x: "-20vw", y: "18vh", rotation: 12, scale: .62, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: hero ?? root, start: "top top", end: "bottom bottom", scrub: 1.1 } });
          }
        }
        return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, [rootRef, options.floatingJersey, options.floatingJerseyKey]);
}
