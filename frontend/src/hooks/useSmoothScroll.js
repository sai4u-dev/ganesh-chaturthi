import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // expose for navbar scrollTo
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // handle hash links with offset for sticky navbar
    const handleAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        // offset for sticky nav + announcement (~88px)
        const offset = 88;
        lenis.scrollTo(el, { offset: -offset, duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        // update url without jump
        history.pushState(null, '', href);
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // if page loads with hash, scroll to it
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) setTimeout(() => lenis.scrollTo(el, { offset: -88, immediate: false }), 300);
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.__lenis = null;
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
}
