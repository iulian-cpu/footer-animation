
(function(){
  const boot = () => { if (!window.__NNC_NAV__) { window.__NNC_NAV__ = true; try { init(); } catch(e){ console.error('[Navbar] init error:', e); } } };
  if (document.readyState !== 'loading') boot();
  document.addEventListener('DOMContentLoaded', boot, { once:true });
  window.addEventListener('load', boot, { once:true });
  try { (window.Webflow = window.Webflow || []).push(boot); } catch(e){}

  function init(){
    if (!window.gsap) return;

    const S = {
      btn: '.navbar-btn',
      text1: '.navbar-btn [navbar-text="1"]',
      text2: '.navbar-btn [navbar-text="2"]',
      logoA: '.navbar-logo',
      logoB: '.navbar-logo-second',
      frontLinks: '.navbar-front-links',
      backLinks: '.navbar-back-links',
      header: '.navbar',
      ddScope: '.navbar-dropdown',
      linkSel: '[navbar-link]',
      btnWrapSel: '.navbar-link-btn-wrap',
      navLinkBlockSel: '.navbar-navigation-link-block',
      navIconWrapSel: '.navbar-navigation-icon-wrap',
      navTextWrapSel: '.navbar-navigation-text-wrap',
      rollSel: '[navbar-text-animation]'
    };

    const $$  = s => document.querySelector(s);
    const $$$ = s => Array.from(document.querySelectorAll(s));
    const css = el => { try { return el ? getComputedStyle(el) : null; } catch(_) { return null; } };

    const headerEl = $$(S.header);
    const btn      = $$(S.btn);
    if (!headerEl || !btn) return;

    /* ---------- Overlay (variabile manuale) ---------- */
    const FRAME_COLOR='#FFFFD0', FRAME_SIDE='1.5vw', FRAME_TOP='8vw', FRAME_TOP_DD='35vw';
    document.querySelectorAll('#nnc-overlay').forEach(n => n.remove());
    const overlay = document.createElement('div'); overlay.id='nnc-overlay';
    const hole = document.createElement('div'); overlay.appendChild(hole); document.body.appendChild(overlay);

    let headerZ = parseInt(css(headerEl)?.zIndex,10);
    if (!headerZ || isNaN(headerZ)) { headerZ = 9999; headerEl.style.zIndex=String(headerZ); if (css(headerEl)?.position==='static') headerEl.style.position='relative'; }
    overlay.style.cssText = `position:fixed; inset:0; pointer-events:none; z-index:${headerZ - 1};`;
    hole.style.cssText = `
      position:fixed; top:var(--t,0); left:50%; transform:translateX(-50%);
      width:calc(100vw - 2*var(--x,0)); height:calc(100vh - var(--t,0));
      border-top-left-radius:2rem; border-top-right-radius:2rem;
      box-shadow:0 0 0 100vmax ${FRAME_COLOR};
      opacity:0; will-change:transform,width,height,opacity;
    `;

    const T  = 8, TD = 35, X = 1.5; // vw (numere)
    const holeState = { t:0, x:0, o:0 };
    const applyHole = ()=>{ hole.style.setProperty('--t', holeState.t+'vw'); hole.style.setProperty('--x', holeState.x+'vw'); hole.style.opacity=String(holeState.o); };
    applyHole();

    /* ---------- Utils ---------- */
    function hiddenHeight(el, displayMode='flex'){
      if (!el) return 0;
      const prev = { display: el.style.display, position: el.style.position, visibility: el.style.visibility, left: el.style.left };
      const wasHidden = getComputedStyle(el).display==='none';
      if (wasHidden){ el.style.display=displayMode; el.style.position='absolute'; el.style.visibility='hidden'; el.style.left='-9999px'; }
      const h = el.getBoundingClientRect().height || 0;
      if (wasHidden){ el.style.display=prev.display; el.style.position=prev.position; el.style.visibility=prev.visibility; el.style.left=prev.left; }
      return h;
    }
    const H = sel => { const el=$$(sel); return el ? (getComputedStyle(el).display==='none' ? hiddenHeight(el) : (el.getBoundingClientRect().height||0)) : 0; };

    // anti-drift
    gsap.set([$$(S.text1),$$(S.text2),$$(S.logoA),$$(S.logoB),$$(S.frontLinks),$$(S.backLinks)].filter(Boolean),
      { x:0,y:0,xPercent:0,yPercent:0,rotate:0,skewX:0,skewY:0,force3D:true,willChange:'transform' });

    // NU mai setăm z-index mare pe bile → vrem sub buton
    $$$('[navbar-ball]').forEach(b=> gsap.set(b, { x:0, autoAlpha:1, visibility:'visible', willChange:'transform' }));

    /* ---------- State ---------- */
    let allowDdResize=false;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const D = reduce ? 0.0001 : 0.85; // >0 pentru onUpdate
    const E = 'power3.inOut';

    function setInitial(){
      gsap.set(S.text1,      { y: 0 });
      gsap.set(S.text2,      { y: H(S.text2) });
      gsap.set(S.logoA,      { y: 0 });
      gsap.set(S.logoB,      { y: 3*H(S.logoB) });
      gsap.set(S.frontLinks, { y: 0, autoAlpha: 1 });
      const back=$$(S.backLinks);
      if (back) gsap.set(back, { display:'none', y:hiddenHeight(back), autoAlpha:0 });
      holeState.t=0; holeState.x=0; holeState.o=0; applyHole();
    }
    setInitial();

    /* ---------- Timeline ---------- */
    const btnBorder0  = getComputedStyle(btn).borderColor;
    const text2Color0 = getComputedStyle($$(S.text2))?.color || '#1E1E1E';

    const tl = gsap.timeline({
      paused:true,
      defaults:{ ease:E },
      onStart:()=>{ allowDdResize=false; },
      onComplete:()=>{
        allowDdResize=true;
        gsap.set(S.text1,      { y:-H(S.text1) });
        gsap.set(S.text2,      { y:0, color:'#1E1E1E' });
        gsap.set(S.logoA,      { y:-H(S.logoA) });
        gsap.set(S.logoB,      { y:0 });
        gsap.set(S.frontLinks, { y:-H(S.frontLinks), autoAlpha:0 });
        gsap.set(S.backLinks,  { y:0, autoAlpha:1, display:'flex' });
        holeState.t=T; holeState.x=X; holeState.o=1; applyHole();
      },
      onReverseStart:()=>{ allowDdResize=false; },
      onReverseComplete:()=>{
        setInitial();
        gsap.set(btn, { borderColor: btnBorder0 });
        gsap.set(S.text2, { color: text2Color0 });
        gsap.to($$$(S.linkSel), { opacity:1, duration:0.25, overwrite:true });
        forceCloseDropdowns();
      }
    });

    tl.add('go')
      .to(S.text1,      { y:()=>-H(S.text1),      duration:D*0.7 }, 'go')
      .to(S.text2,      { y:0,                    duration:D*0.7 }, 'go')
      .to(S.logoA,      { y:()=>-H(S.logoA),      duration:D*0.8 }, 'go+=0.02')
      .to(S.logoB,      { y:0,                    duration:D*0.8 }, 'go+=0.02')
      .to(S.frontLinks, { y:()=>-H(S.frontLinks), autoAlpha:0, duration:D*0.75 }, 'go+=0.04')
      .add(gsap.to(holeState,{ t:T, x:X, o:1, duration:D*1.05, ease:E, onUpdate:applyHole }), 'go+=0.06')
      .add(()=>{ const el=$$(S.backLinks); if(el) gsap.set(el,{ display:'flex' }); }, 'go+=0.36')
      .to(S.backLinks,  { y:0, autoAlpha:1, duration:D*0.55, ease:'power2.out' }, 'go+=0.36')
      .to(btn, { borderColor: FRAME_COLOR, duration:D*0.6 }, 'go');

    function toggleMenu(){
      if (tl.isActive()) return;
      if (tl.reversed() || tl.progress()===0) { tl.invalidate(); tl.play(); }
      else { tl.reverse(); }
    }
    btn.addEventListener('click', (e)=>{ e.preventDefault(); toggleMenu(); }, { passive:true });
    document.addEventListener('click', (e)=>{
      const r = btn.getBoundingClientRect(), x=e.clientX, y=e.clientY;
      if (x>=r.left && x<=r.right && y>=r.top && y<=r.bottom){ e.preventDefault(); toggleMenu(); }
    }, true);

    /* ---------- HOVER pe [navbar-link] — ca în scriptul vechi ---------- */
    (function(){
      const SHIFT='3.13vw', HOVER_D=0.44, HOVER_E='power3.out';
      const links = $$$(`${S.linkSel}`);
      const ballFor = (i) => document.querySelector(`[navbar-ball="${i}"]`) || null;

      let hoverIndex = null;
      function applyHoverLayout(){
        links.forEach((el)=>{
          const idx = parseInt(el.getAttribute('navbar-link'),10) || (links.indexOf(el)+1);
          // mutăm doar linkurile cu index > hoverIndex
          const moveLinksX = (hoverIndex != null && idx > hoverIndex) ? SHIFT : '0vw';
          gsap.to(el, { x: moveLinksX, duration:HOVER_D, ease:HOVER_E, overwrite:'auto' });

          // bila: doar cea a linkului hoverat se mută
          const b = ballFor(idx);
          if (b) gsap.to(b, { x: (hoverIndex === idx) ? SHIFT : '0vw', duration:HOVER_D, ease:HOVER_E, overwrite:'auto' });
        });
      }

      links.forEach((el)=>{
        el.addEventListener('mouseenter', ()=>{ hoverIndex = parseInt(el.getAttribute('navbar-link'),10) || (links.indexOf(el)+1); applyHoverLayout(); });
        el.addEventListener('mouseleave', (e)=>{ const rel=e.relatedTarget; if (!rel || !rel.closest(S.linkSel)) { hoverIndex=null; applyHoverLayout(); } });
      });

      (document.querySelector('.navbar-links-list-wrap') || document.querySelector('.navbar-wrapper') || document.body)
        .addEventListener('mouseleave', ()=>{ hoverIndex=null; applyHoverLayout(); });

      applyHoverLayout();
    })();

    /* ---------- ROLL effect pe [navbar-text-animation] ---------- */
    (function rollEffectV2(){
      const ROLL_SEL = S.rollSel;
      document.querySelectorAll(ROLL_SEL).forEach(el => {
        if (el.dataset.ntaInit === 'v2') return;
        el.dataset.ntaInit = 'v2';

        let wrap = el.querySelector('.nta-wrap'); let l1, l2;
        if (!wrap) {
          wrap = document.createElement('span');
          wrap.className = 'nta-wrap';
          wrap.style.cssText = 'display:inline-block; position:relative; overflow:hidden; vertical-align:bottom;';
          l1 = document.createElement('span');
          l1.className = 'nta-line nta-1';
          l1.style.cssText = 'position:relative; display:block; white-space:nowrap; will-change:transform;';
          while (el.firstChild) l1.appendChild(el.firstChild);
          wrap.appendChild(l1);
          l2 = l1.cloneNode(true);
          l2.classList.remove('nta-1'); l2.classList.add('nta-2'); l2.setAttribute('aria-hidden','true');
          l2.style.position='absolute'; l2.style.left='0'; l2.style.right='0'; l2.style.top='0';
          l2.style.display='block'; l2.style.whiteSpace='nowrap'; l2.style.willChange='transform';
          wrap.appendChild(l2);
          el.appendChild(wrap);
        } else {
          l1 = wrap.querySelector('.nta-1') || wrap.firstElementChild;
          l2 = wrap.querySelector('.nta-2');
          wrap.style.display='inline-block'; wrap.style.position='relative'; wrap.style.overflow='hidden'; wrap.style.verticalAlign='bottom';
          if (l1){ l1.style.position='relative'; l1.style.display='block'; l1.style.whiteSpace='nowrap'; l1.style.willChange='transform'; }
          if (!l2 && l1){ l2 = l1.cloneNode(true); l2.classList.remove('nta-1'); l2.classList.add('nta-2'); l2.setAttribute('aria-hidden','true'); wrap.appendChild(l2); }
          if (l2){ l2.style.position='absolute'; l2.style.left='0'; l2.style.right='0'; l2.style.top='0'; l2.style.display='block'; l2.style.whiteSpace='nowrap'; l2.style.willChange='transform'; }
        }

        gsap.set(l1, { yPercent: 0 });
        gsap.set(l2, { yPercent: 100 });

        const tlRoll = gsap.timeline({ paused:true, defaults:{ duration:0.45, ease:'power3.out' } })
          .to(l1, { yPercent:-100 }, 0)
          .to(l2, { yPercent:0 }, 0);

        const target = el.closest(`a, ${S.navLinkBlockSel}, ${S.btnWrapSel}, ${S.linkSel}`) || el;
        target.addEventListener('pointerenter', () => tlRoll.play(), { passive:true });
        target.addEventListener('pointerleave', () => tlRoll.reverse(), { passive:true });
        target.addEventListener('focusin',  () => tlRoll.play());
        target.addEventListener('focusout', () => tlRoll.reverse());
      });
    })();

    /* ---------- HEIGHT-AUTO robust pentru dropdown link blocks ---------- */
    (function(){
      const items = $$$(`${S.navLinkBlockSel}`);
      const OPEN_PB = 8;

      function measureAutoHeight(w){
        if (!w) return 0;
        let h = w.scrollHeight;
        if (h && h > 0){
          const first = w.firstElementChild, last = w.lastElementChild;
          if (first){ h += parseFloat(getComputedStyle(first).marginTop || '0'); }
          if (last){  h += parseFloat(getComputedStyle(last).marginBottom || '0'); }
          return Math.ceil(h);
        }
        const prev = { height:w.style.height, position:w.style.position, visibility:w.style.visibility, left:w.style.left, display:w.style.display, overflow:w.style.overflow };
        w.style.display='block'; w.style.height='auto'; w.style.position='absolute'; w.style.visibility='hidden'; w.style.left='-9999px'; w.style.overflow='visible';
        h = w.scrollHeight || w.getBoundingClientRect().height || 0;
        const first = w.firstElementChild, last = w.lastElementChild;
        if (first){ h += parseFloat(getComputedStyle(first).marginTop || '0'); }
        if (last){  h += parseFloat(getComputedStyle(last).marginBottom || '0'); }
        w.style.height=prev.height; w.style.position=prev.position; w.style.visibility=prev.visibility; w.style.left=prev.left; w.style.display=prev.display; w.style.overflow=prev.overflow;
        return Math.ceil(h);
      }

      function closeSiblings(currentWrap){
        const parentList = currentWrap?.closest('.navbar-navigation-grid, .navbar-navigationa-wrap, .navbar-navigation-left-wrap, .navbar-navigation-right-wrap') || currentWrap?.parentElement;
        const allWraps = parentList ? Array.from(parentList.querySelectorAll(S.navTextWrapSel)) : $$$(`${S.navTextWrapSel}`);
        allWraps.forEach(w=>{
          if (w === currentWrap) return;
          gsap.killTweensOf(w);
          gsap.to(w, { height:0, paddingBottom:0, duration:0.4, ease:'power3.inOut', overwrite:'auto' });
          const icon = w.closest(S.navLinkBlockSel)?.querySelector(S.navIconWrapSel);
          if (icon) gsap.to(icon, { rotate:0, duration:0.35, ease:'power3.inOut', overwrite:'auto' });
        });
      }

      items.forEach(link => {
        const icon = link.querySelector(S.navIconWrapSel);
        const wrap = link.querySelector(S.navTextWrapSel);
        if (!wrap) return;

        gsap.set(wrap, { height:0, paddingBottom:0, overflow:'hidden', willChange:'height,padding' });

        const openDur=0.55, closeDur=0.45, openEase='power4.out', closeEase='power3.inOut';

        function openWrap(){
          closeSiblings(wrap);
          gsap.killTweensOf(wrap);
          let targetH = measureAutoHeight(wrap);
          if (!targetH || targetH <= 0){
            requestAnimationFrame(()=>{
              targetH = measureAutoHeight(wrap);
              gsap.to(wrap, { height: targetH, paddingBottom: OPEN_PB, duration: openDur, ease: openEase, overwrite:'auto' });
            });
          } else {
            gsap.to(wrap, { height: targetH, paddingBottom: OPEN_PB, duration: openDur, ease: openEase, overwrite:'auto' });
          }
          if (icon) gsap.to(icon, { rotate:-45, duration: openDur*0.85, ease: openEase, overwrite:'auto', transformOrigin:'50% 50%' });
        }

        function closeWrap(){
          gsap.killTweensOf(wrap);
          gsap.to(wrap, { height:0, paddingBottom:0, duration: closeDur, ease: closeEase, overwrite:'auto' });
          if (icon) gsap.to(icon, { rotate:0, duration: closeDur, ease: closeEase, overwrite:'auto' });
        }

        link.addEventListener('pointerenter', openWrap, { passive:true });
        link.addEventListener('pointerleave', closeWrap, { passive:true });
        link.addEventListener('focusin', openWrap);
        link.addEventListener('focusout', (e)=>{ if (!link.contains(e.relatedTarget)) closeWrap(); });
      });
    })();

    /* ---------- Dropdown ---------- */
    const ddScope   = document.querySelector(S.ddScope) || document;
    const ddRoots   = Array.from(ddScope.querySelectorAll('.w-dropdown'));
    const ddToggles = Array.from(ddScope.querySelectorAll('.navbra-dropdown-toggle.w-dropdown-toggle'));
    const ddLists   = Array.from(ddScope.querySelectorAll('.navbar-navigation.w-dropdown-list'));
    const navLinks  = $$$(`${S.linkSel}`);
    const TOGGLE_Z  = headerZ + 20, LIST_Z = headerZ + 10;
    const isDropdownOpen = () => ddToggles.some(tg => tg.classList.contains('w--open'));

    function applyDropdownState(){
      const anyOpen = isDropdownOpen();
      gsap.to(navLinks, { opacity: anyOpen ? 0.2 : 1, duration:0.25, overwrite:true });
      ddToggles.forEach(tg=>{
        const open = tg.classList.contains('w--open');
        if (open) gsap.set(tg, { zIndex:TOGGLE_Z, position:'relative', pointerEvents:'auto' });
        else      gsap.set(tg, { clearProps:'zIndex,position,pointerEvents' });
        gsap.to(tg, { backgroundColor: open?'#1E1E1E':'', color: open?'#fff':'', duration:0.25, overwrite:true });
      });
      ddLists.forEach(dl=>{
        const open = dl.classList.contains('w--open');
        if (open) gsap.set(dl, { zIndex:LIST_Z, pointerEvents:'auto', visibility:'visible', autoAlpha:1 });
        else      gsap.set(dl, { pointerEvents:'none', visibility:'hidden', autoAlpha:0, clearProps:'zIndex' });
      });
      if (allowDdResize && tl.progress()>0 && !tl.reversed()) {
        gsap.to(holeState, { t: anyOpen ? TD : T, duration:D*0.6, ease:E, onUpdate:applyHole, overwrite:'auto' });
      }
    }
    [...ddRoots, ...ddToggles, ...ddLists].forEach(n=>{
      new MutationObserver(applyDropdownState).observe(n, { attributes:true, attributeFilter:['class'] });
    });
    applyDropdownState();

    function forceCloseDropdowns(){
      ddRoots.forEach(n => n.classList.remove('w--open'));
      ddToggles.forEach(n => { n.classList.remove('w--open'); n.setAttribute('aria-expanded','false'); });
      ddLists.forEach(n => { n.classList.remove('w--open'); n.style.display=''; n.style.opacity=''; n.style.transform=''; n.style.visibility=''; });
      applyDropdownState();
    }

    /* ---------- Close on scroll + smart header ---------- */
    let lastY = window.pageYOffset || 0, ticking=false;
    window.addEventListener('scroll', ()=>{
      if (ticking) return; ticking=true;
      requestAnimationFrame(()=>{
        const y = window.pageYOffset || 0;
        if (y > lastY + 2) {
          if (tl.progress()>0 && !tl.isActive()) tl.reverse();
          forceCloseDropdowns();
        }
        lastY=y; ticking=false;
      });
    }, { passive:true });

    (function(){
      const header=headerEl; if(!header) return;
      gsap.set(header,{ y:0, willChange:'transform', force3D:true });
      let lastY=window.pageYOffset||0, ticking=false, hidden=false, Hh=header.getBoundingClientRect().height;
      const show=()=>{ if(!hidden) return; hidden=false; gsap.to(header,{ y:0, duration:0.55, ease:'power3.out', overwrite:'auto' }); };
      const hide=()=>{ if(hidden) return;  hidden=true;  gsap.to(header,{ y:-Hh, duration:0.55, ease:'power3.out', overwrite:'auto' }); };
      window.addEventListener('resize', ()=>{ const was=hidden; Hh=header.getBoundingClientRect().height; if (was) gsap.set(header,{ y:-Hh }); }, { passive:true });
      window.addEventListener('scroll', ()=>{
        if (ticking) return; ticking=true;
        requestAnimationFrame(()=>{
          const y=window.pageYOffset||0, down=y>lastY+4, up=y<lastY-4, nearTop=y<16;
          if (tl.progress()>0 || tl.isActive()) show();
          else { if (down && y>120) hide(); if (up || nearTop) show(); }
          lastY=y; ticking=false;
        });
      }, { passive:true });
    })();

    // re-validate pe resize & bfcache
    let rAF;
    window.addEventListener('resize', ()=>{
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(()=>{
        if (tl.progress()===0 || tl.reversed()) setInitial();
        else { tl.invalidate(); tl.progress(1); holeState.t=(isDropdownOpen()?TD:T); holeState.x=X; holeState.o=1; applyHole(); }
      });
    });
    window.addEventListener('pageshow', ()=>{
      tl.progress(0).pause();
      setInitial();
      applyDropdownState();
    });
  }
})();
