// FooterFX — scrub + mouse follow | yellow at xPercent:-20, yPercent:30
;(() => {
  if (window.__FOOTER_FX_LOADED__) return; 
  window.__FOOTER_FX_LOADED__ = true;

  const CDN = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";
  const LOG = (...a) => console.log("[FooterFX]", ...a);
  const ERR = (...a) => console.warn("[FooterFX]", ...a);

  function ensureGSAP(cb) {
    if (window.gsap) return cb();
    const s = document.createElement("script");
    s.src = CDN; s.async = true;
    s.onload = cb;
    s.onerror = () => ERR("Failed to load GSAP:", CDN);
    document.head.appendChild(s);
  }

  function waitForNodes(selectors, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      (function check() {
        const nodes = selectors.map(s => document.querySelector(s));
        if (nodes.every(Boolean)) return resolve(nodes);
        if (performance.now() - start > timeoutMs) return reject(new Error("Timeout: " + selectors.join(", ")));
        requestAnimationFrame(check);
      })();
    });
  }

  function main() {
    let footer, overlay, yellow;
    let followActive = false;
    let tickerAdded = false;

    // -------- CONFIG --------
    const BASE_PERCENT = { x: -20, y: 30 }; // translate(-20%, 30%)
    const SCRUB_SMOOTH = 0.18;
    const FOLLOW = {
      duration: 0.5,
      ease: "power3.out",
      strengthX: 0.14,
      strengthY: 0.18,
      maxX: 100,
      maxY: 100
    };
    // ------------------------

    function setup() {
      gsap.set(overlay, { yPercent: 100 });
      gsap.set(yellow, { xPercent: BASE_PERCENT.x, yPercent: BASE_PERCENT.y, x: 0, y: 0 });

      const setOverlayY = gsap.quickTo(overlay, "yPercent", { duration: SCRUB_SMOOTH, ease: "none" });
      const setYellowX  = gsap.quickTo(yellow,  "x",        { duration: FOLLOW.duration, ease: FOLLOW.ease });
      const setYellowY  = gsap.quickTo(yellow,  "y",        { duration: FOLLOW.duration, ease: FOLLOW.ease });

      function getFooterProgress() {
        const r = footer.getBoundingClientRect();
        const p = (window.innerHeight - r.top) / r.height; // 0..1
        return gsap.utils.clamp(0, 1, p);
      }

      function isFooterVisible() {
        const r = footer.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      }

      function onPointerMove(e) {
        if (!followActive) return;
        const r = footer.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const rx = gsap.utils.clamp(-FOLLOW.maxX, FOLLOW.maxX, dx * FOLLOW.strengthX);
        const ry = gsap.utils.clamp(-FOLLOW.maxY, FOLLOW.maxY, dy * FOLLOW.strengthY);

        setYellowX(rx);
        setYellowY(ry);
      }

      function enableFollow() {
        if (followActive) return;
        followActive = true;
        window.addEventListener("pointermove", onPointerMove);
      }
      function disableFollow(reset = true) {
        if (!followActive) return;
        followActive = false;
        window.removeEventListener("pointermove", onPointerMove);
        if (reset) gsap.to(yellow, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      }

      const tick = () => {
        const p = getFooterProgress();
        setOverlayY(100 - p * 100); // 100% -> 0% pe scrub
        const vis = isFooterVisible();
        if (vis && !followActive) enableFollow();
        if (!vis && followActive) disableFollow(true);
      };

      tick();
      if (!tickerAdded) { gsap.ticker.add(tick); tickerAdded = true; }
      window.addEventListener("resize", tick);

      window.FooterFX = {
        kill() {
          try { gsap.ticker.remove(tick); } catch(e){}
          tickerAdded = false;
          window.removeEventListener("resize", tick);
          disableFollow(true);
          gsap.set(overlay, { clearProps: "transform" });
          gsap.set(yellow,  { clearProps: "transform" });
          LOG("Killed.");
        },
        reinit() { this.kill?.(); setup(); }
      };

      LOG("Initialized ✔");
    }

    waitForNodes([".footer", ".footer .footer-overlay-wrap", ".footer .footer-yellow-wrap"])
      .then(([f, o, y]) => { footer = f; overlay = o; yellow = y; setup(); })
      .catch(err => ERR(err.message));
  }

  function boot() {
    ensureGSAP(() => {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main, { once: true });
      else main();
    });
  }

  boot();
})();
