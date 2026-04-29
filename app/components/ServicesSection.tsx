'use client'
import { useEffect, useRef } from 'react'

/* ─────────────────── DATA ─────────────────── */
const STATS = [
  { num: '50+', label: 'Projects Delivered' },
  { num: '98%', label: 'Client Satisfaction' },
  { num: '3+',  label: 'Years Building' },
  { num: '24/7',label: 'Support' },
]
const DEV_SERVICES = [
  { icon: '◈', title: 'Website Development',        desc: 'Pixel-perfect, blazing-fast sites' },
  { icon: '⬡', title: 'Web App Development',        desc: 'Scalable SaaS & web platforms' },
  { icon: '◉', title: 'Cross Platform Mobile Apps', desc: 'iOS & Android from one codebase' },
  { icon: '◈', title: 'API Integrations',           desc: 'Seamless third-party connections' },
  { icon: '⬡', title: 'Performance Optimization',   desc: 'Speed that converts visitors' },
  { icon: '◉', title: 'Ongoing Support',            desc: 'We stay with you post-launch' },
  { icon: '◈', title: 'Automation',                 desc: 'Eliminate repetitive workflows' },
  { icon: '⬡', title: 'Chatbots',                   desc: 'AI assistants built for your brand' },
]
const DES_SERVICES = [
  { icon: '◈', title: 'UI/UX Design',       desc: 'Interfaces people love to use' },
  { icon: '⬡', title: 'Logo Design',        desc: 'Marks that define your identity' },
  { icon: '◉', title: 'Web App Design',     desc: 'Complex flows made intuitive' },
  { icon: '◈', title: 'Website Design',     desc: 'Visual stories that convert' },
  { icon: '⬡', title: 'Mobile App Design',  desc: 'Thumb-friendly, gorgeous UX' },
  { icon: '◉', title: 'Brand Systems',      desc: 'Cohesive visual language' },
]

/* ─────────────────── HELPERS ─────────────────── */
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const prog  = (s: number, e: number, p: number) => clamp((p - s) / (e - s))
const lerp  = (a: number, b: number, t: number) => a + (b - a) * t

/* ─────────────────────────────────────────────────────────────────────────
   SCROLL PHASES  (p = 0..1 over the 700vh section)
   ─────────────────────────────────────────────────────────────────────────
   0.00 → 0.14  Intro header fades IN
   0.00 → 0.14  Stats stagger IN
   0.14 → 0.22  Intro + stats fade OUT          ← was overlapping / too fast
   0.22 → 0.38  Door 1 OPENS
   0.38 → 0.55  Dev cards fade IN
   0.55 → 0.62  Dev cards fade OUT
   0.62 → 0.70  Door 1 CLOSES
   0.70 → 0.78  Door 2 fades in (opacity of wrapper)
   0.78 → 0.88  Door 2 OPENS
   0.88 → 0.97  Design cards fade IN             ← des-panel is now z=9 (above door 2)
   ────────────────────────────────────────────────────────────────────────*/

export default function ServicesSection() {
  const secRef = useRef<HTMLElement>(null)
  const raf    = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      const sec = secRef.current
      if (!sec) { raf.current = requestAnimationFrame(tick); return }

      const rect  = sec.getBoundingClientRect()
      const total = sec.offsetHeight - window.innerHeight
      const p     = clamp(-rect.top / total)

      const el = (id: string) => document.getElementById(id)
      const fade = (id: string, op: number, ty = 0) => {
        const e = el(id); if (!e) return
        e.style.opacity   = op.toFixed(3)
        e.style.transform = `translateY(${ty}px)`
      }

      /* ── PHASE 0: Intro header  0→0.14 show, 0.14→0.22 hide ── */
      const hIn  = prog(0,    0.14, p)
      const hOut = prog(0.14, 0.22, p)
      fade('svc-intro', hIn * (1 - hOut), lerp(32, 0, hIn) * (1 - hOut))

      /* ── PHASE 1: Stats row  0.02→0.14 in, 0.14→0.22 out ── */
      STATS.forEach((_, i) => {
        const t = prog(0.02 + i * 0.02, 0.14, p)
        const o = prog(0.14, 0.22, p)
        const e = el(`stat-${i}`); if (!e) return
        e.style.opacity   = (t * (1 - o)).toFixed(3)
        e.style.transform = `translateY(${lerp(20, 0, t)}px)`
      })

      /* ── PHASE 2: Door 1 — slide IN 0.14→0.22, open 0.22→0.38, close+exit 0.62→0.72 ──
         Doors start fully off-screen (left panel at -100%, right at +100%).
         They slide to center (0%) between 0.14→0.22, then open outward from 0.22→0.38.
         On close they slide back off-screen between 0.62→0.72. */
      const d1slideIn = prog(0.14, 0.22, p)          // 0→1: off-screen → closed/center
      const d1open    = prog(0.22, 0.38, p)           // 0→1: closed → open
      const d1exit    = prog(0.62, 0.72, p)           // 0→1: closed → off-screen again

      // When sliding in: go from -100% → 0% (left) / 100% → 0% (right)
      // When open: go from 0% → -104% (left) / 0% → 104% (right)
      // When exiting: go from -104% → -200% effectively — we just reuse exit to push further
      let d1lX: number, d1rX: number
      if (d1exit > 0) {
        // closing phase: reverse the open then slide off
        const closeProg = prog(0.62, 0.67, p)   // first close the open gap
        const exitProg  = prog(0.67, 0.72, p)   // then slide panels off screen
        const openAmt   = 1 - closeProg          // how open the door still is (1→0)
        d1lX = -openAmt * 104 - exitProg * 104   // slide further left off screen
        d1rX =  openAmt * 104 + exitProg * 104   // slide further right off screen
      } else if (d1open > 0) {
        d1lX = -d1open * 104
        d1rX =  d1open * 104
      } else {
        // sliding in from off-screen to center
        d1lX = lerp(-104, 0, d1slideIn)
        d1rX = lerp( 104, 0, d1slideIn)
      }

      const d1l = el('d1-left');  if (d1l) d1l.style.transform = `translateX(${d1lX}%)`
      const d1r = el('d1-right'); if (d1r) d1r.style.transform = `translateX(${d1rX}%)`

      const seam1 = el('seam1')
      if (seam1) {
        const g = d1exit > 0 ? 0 : Math.sin(d1open * Math.PI)
        seam1.style.opacity   = (g * 0.95).toFixed(3)
        seam1.style.filter    = `blur(${lerp(3, 8, g)}px)`
        seam1.style.width     = `${lerp(2, 22, g)}px`
        seam1.style.boxShadow = `0 0 ${lerp(10,60,g)}px rgba(232,25,44,${(g*0.9).toFixed(2)}), 0 0 ${lerp(20,120,g)}px rgba(232,25,44,${(g*0.4).toFixed(2)})`
      }

      const bolt1L = el('bolt1-L'); const bolt1R = el('bolt1-R')
      if (bolt1L && bolt1R) {
        const bp = d1exit > 0 ? 0 : Math.sin(d1open * Math.PI)
        bolt1L.style.opacity = (bp * 0.8).toFixed(3)
        bolt1R.style.opacity = (bp * 0.8).toFixed(3)
        bolt1L.style.transform = `scaleY(${0.7 + bp * 0.3})`
        bolt1R.style.transform = `scaleY(${0.7 + bp * 0.3})`
      }

      /* ── PHASE 3: Dev content  0.38→0.52 in, 0.56→0.64 out ── */
      const devIn  = prog(0.38, 0.52, p)
      const devOut = prog(0.56, 0.64, p)
      fade('dev-panel', devIn * (1 - devOut), lerp(40, 0, devIn))
      DEV_SERVICES.forEach((_, i) => {
        const t = prog(0.39 + i * 0.016, 0.52, p)
        const e = el(`dev-card-${i}`); if (!e) return
        e.style.opacity   = (t * (1 - devOut)).toFixed(3)
        e.style.transform = `translateY(${lerp(24, 0, t)}px)`
      })

      /* ── PHASE 4: Door 2 — fade in wrapper 0.70→0.78, open 0.78→0.88 ── */
      const d2wrap = el('d2-wrap')
      if (d2wrap) d2wrap.style.opacity = prog(0.70, 0.78, p).toFixed(3)

      const d2open = prog(0.78, 0.88, p)
      const d2l = el('d2-left');  if (d2l) d2l.style.transform = `translateX(${-d2open * 104}%)`
      const d2r = el('d2-right'); if (d2r) d2r.style.transform = `translateX(${d2open * 104}%)`

      const seam2 = el('seam2')
      if (seam2) {
        const g = Math.sin(d2open * Math.PI)
        seam2.style.opacity   = (g * 0.95).toFixed(3)
        seam2.style.filter    = `blur(${lerp(3, 8, g)}px)`
        seam2.style.width     = `${lerp(2, 22, g)}px`
        seam2.style.boxShadow = `0 0 ${lerp(10,60,g)}px rgba(232,25,44,${(g*0.9).toFixed(2)}), 0 0 ${lerp(20,120,g)}px rgba(232,25,44,${(g*0.4).toFixed(2)})`
      }

      const bolt2L = el('bolt2-L'); const bolt2R = el('bolt2-R')
      if (bolt2L && bolt2R) {
        const bp = Math.sin(d2open * Math.PI)
        bolt2L.style.opacity = (bp * 0.8).toFixed(3)
        bolt2R.style.opacity = (bp * 0.8).toFixed(3)
        bolt2L.style.transform = `scaleY(${0.7 + bp * 0.3})`
        bolt2R.style.transform = `scaleY(${0.7 + bp * 0.3})`
      }

      /* ── PHASE 5: Design content  0.88→0.97 ──
         des-panel is z-index:9 (ABOVE d2-wrap z=7) so it renders on top once door opens */
      const desIn = prog(0.88, 0.97, p)
      fade('des-panel', desIn, lerp(40, 0, desIn))
      DES_SERVICES.forEach((_, i) => {
        const t = prog(0.89 + i * 0.015, 0.97, p)
        const e = el(`des-card-${i}`); if (!e) return
        e.style.opacity   = t.toFixed(3)
        e.style.transform = `translateY(${lerp(24, 0, t)}px)`
      })

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <>
      <style>{`
        @keyframes scanLine   { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        @keyframes blink      { 0%,100%{opacity:.25} 50%{opacity:.75} }
        @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse      { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.8;transform:scale(1.04)} }
        @keyframes cornerBlink{ 0%,100%{opacity:.15} 50%{opacity:.55} }

        #services { height:700vh; position:relative; }
        #svc-sticky {
          position:sticky; top:0; height:100vh;
          overflow:hidden; background:#060608;
        }

        /* ── service card ── */
        .svc-card {
          display:flex; gap:14px; align-items:flex-start;
          padding:clamp(12px,1.6vw,20px);
          border:1px solid rgba(232,25,44,0.1);
          border-radius:12px;
          background:rgba(255,255,255,0.02);
          backdrop-filter:blur(10px);
          cursor:default;
          opacity:0; transform:translateY(24px);
          will-change:opacity,transform;
          transition:border-color .3s,background .3s,box-shadow .3s,transform .25s;
        }
        .svc-card:hover {
          border-color:rgba(232,25,44,0.38);
          background:rgba(232,25,44,0.07);
          box-shadow:0 8px 32px rgba(232,25,44,0.12),inset 0 1px 0 rgba(255,255,255,0.05);
          transform:translateY(-3px) !important;
        }
        .svc-card-icon {
          color:#e8192c; font-size:1.1rem; flex-shrink:0;
          filter:drop-shadow(0 0 6px rgba(232,25,44,0.5));
          margin-top:2px;
        }
        .svc-card-title {
          font-family:'Outfit',sans-serif; font-weight:600;
          font-size:clamp(.72rem,1.3vw,.92rem);
          color:rgba(244,244,246,.9);
          letter-spacing:.02em;
        }
        .svc-card-desc {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.6rem,1vw,.76rem);
          color:rgba(244,244,246,.4);
          margin-top:3px; line-height:1.4;
        }
        .svc-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:clamp(8px,1.1vw,14px); }
        .svc-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:clamp(8px,1.1vw,14px); }

        /* stat card */
        .stat-card {
          text-align:center; padding:clamp(12px,1.8vw,22px);
          border:1px solid rgba(232,25,44,0.1);
          border-radius:12px;
          background:rgba(232,25,44,0.03);
          opacity:0; transform:translateY(20px); will-change:opacity,transform;
          transition:border-color .3s, background .3s;
        }
        .stat-card:hover {
          border-color:rgba(232,25,44,0.28); background:rgba(232,25,44,0.06);
        }
        .stat-num {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.6rem,3.5vw,2.8rem); font-weight:900;
          background:linear-gradient(135deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .stat-label {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.5rem,.85vw,.68rem); letter-spacing:.2em;
          text-transform:uppercase; color:rgba(244,244,246,.35);
          margin-top:6px;
        }

        /* content panels */
        .content-panel {
          position:absolute; top:0; left:0; right:0; bottom:0;
          display:flex; align-items:center; justify-content:center;
          padding:clamp(1rem,4vw,3.5rem);
          opacity:0; will-change:opacity,transform;
          /* pointer-events off when invisible so door clicks/hovers aren't blocked */
          pointer-events:none;
        }
        .content-panel[style*="opacity: 0"],
        .content-panel[style*="opacity:0"] { pointer-events:none; }

        .panel-inner {
          display:grid; grid-template-columns:.9fr 2fr;
          gap:clamp(2rem,4vw,5rem);
          max-width:1000px; width:100%; align-items:start;
        }
        .panel-title-block { display:flex; flex-direction:column; padding-top:.5rem; }
        .panel-num {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.48rem,.85vw,.62rem);
          letter-spacing:.42em; text-transform:uppercase;
          color:#e8192c; margin-bottom:.8rem;
        }
        .panel-h3 {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.6rem,3.8vw,3.4rem); font-weight:900; line-height:1.06;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 52%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .panel-rule {
          margin-top:1rem; height:3px; width:50%;
          background:linear-gradient(to right,#e8192c,transparent); border-radius:2px;
        }
        .panel-desc {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.65rem,1.1vw,.82rem);
          color:rgba(244,244,246,.38); line-height:1.6;
          margin-top:1rem; max-width:200px;
        }

        /* door panels */
        .door-panel {
          position:absolute; top:0; bottom:0; width:51%;
          overflow:hidden; will-change:transform;
        }
        .door-panel-L { left:0; background:linear-gradient(130deg,#1a1a2a 0%,#0f0f1c 55%,#070710 100%); border-right:1px solid rgba(232,25,44,0.18); }
        .door-panel-R { right:0; background:linear-gradient(230deg,#1a1a2a 0%,#0f0f1c 55%,#070710 100%); border-left:1px solid rgba(232,25,44,0.18); }

        .door-hex {
          position:absolute; top:0; left:0; right:0; bottom:0;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='90'%3E%3Cpolygon points='26,2 50,15 50,75 26,88 2,75 2,15' fill='none' stroke='%23ffffff' stroke-width='0.35'/%3E%3C/svg%3E");
          background-size:52px 90px; opacity:0.055;
        }
        .door-grid {
          position:absolute; top:0; left:0; right:0; bottom:0; opacity:0.09;
        }
        .door-caution-t { position:absolute; top:0; left:0; right:0; height:9px; background:repeating-linear-gradient(90deg,#e8192c 0,#e8192c 16px,#0d0d1a 16px,#0d0d1a 32px); opacity:.5; }
        .door-caution-b { position:absolute; bottom:0; left:0; right:0; height:9px; background:repeating-linear-gradient(90deg,#e8192c 0,#e8192c 16px,#0d0d1a 16px,#0d0d1a 32px); opacity:.5; }

        .door-ring {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          animation:rotateSlow 12s linear infinite;
          opacity:.06;
        }
        .door-ring-inner {
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          animation:rotateSlow 8s linear infinite reverse;
          opacity:.06;
        }
        .door-label-wrap {
          position:absolute; top:0; left:0; right:0; bottom:0;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:12px; pointer-events:none; user-select:none;
        }
        .door-sector-text {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.9vw,.58rem);
          letter-spacing:.6em; text-transform:uppercase;
          color:rgba(232,25,44,.18);
        }
        .door-title-text {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(.85rem,2.2vw,2rem); font-weight:900;
          color:rgba(232,25,44,.09); letter-spacing:.06em;
          animation:pulse 3s ease-in-out infinite;
        }
        .door-divider {
          width:clamp(25px,4.5vw,50px); height:2px; border-radius:1px;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.15),transparent);
        }

        .door-dot {
          position:absolute; width:11px; height:11px; border-radius:50%;
          background:radial-gradient(circle,#3a3a50,#181820);
          border:1px solid rgba(255,255,255,.06);
          animation:cornerBlink 2.5s ease-in-out infinite;
        }
        .door-acc {
          position:absolute; left:8%; right:8%; height:1px;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.13),transparent);
        }

        .bolt {
          position:absolute; top:0; bottom:0; width:clamp(50px,6vw,90px);
          opacity:0; will-change:opacity,transform; transform-origin:top center;
          pointer-events:none; z-index:4;
          display:flex; flex-direction:column; align-items:center; gap:0;
        }
        .bolt-L { left:-1px; }
        .bolt-R { right:-1px; }

        .seam {
          position:absolute; top:0; bottom:0; left:50%;
          transform:translateX(-50%);
          width:3px; opacity:0;
          background:linear-gradient(to bottom,transparent 0%,#ff3347 12%,#ffffff 50%,#ff3347 88%,transparent 100%);
          pointer-events:none; z-index:6;
          will-change:opacity,width,filter;
        }
        .seam-ambient {
          position:absolute; top:0; bottom:0; left:50%;
          transform:translateX(-50%);
          width:120px;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.04),transparent);
          pointer-events:none; z-index:5;
        }

        /* responsive */
        @media(max-width:800px) {
          .panel-inner { grid-template-columns:1fr !important; gap:1.5rem; }
          .svc-grid-3 { grid-template-columns:1fr 1fr !important; }
          .panel-desc { max-width:none; }
        }
        @media(max-width:520px) {
          .svc-grid-2,.svc-grid-3 { grid-template-columns:1fr !important; }
          #svc-stats { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <section id="services" ref={secRef}>
        <div id="svc-sticky">

          {/* ── BG ambient ── */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            background:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(232,25,44,.035) 0%,transparent 70%)' }}/>

          {/* ── Scan line ── */}
          <div style={{ position:'absolute', left:0, right:0, height:'1px', zIndex:30, pointerEvents:'none',
            background:'linear-gradient(to right,transparent,rgba(232,25,44,.12),transparent)',
            animation:'scanLine 9s linear infinite' }}/>

          {/* ══════════════════════════════════════════
              LAYER STACK (bottom → top):
                z=1  INTRO panel
                z=3  DEV content panel
                z=5  DOOR 1
                z=7  DOOR 2 wrapper
                z=9  DESIGN content panel  ← must be above door 2
              ══════════════════════════════════════════ */}

          {/* ── INTRO (z=1) ── */}
          <div id="svc-intro" style={{
            position:'absolute', top:0, left:0, right:0, bottom:0, zIndex:1,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'clamp(1rem,5vw,4rem)',
            opacity:0, willChange:'opacity,transform',
          }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem',
              letterSpacing:'.42em', textTransform:'uppercase',
              color:'#e8192c', marginBottom:'1rem' }}>
              WHAT WE DO
            </p>

            <h2 style={{ fontFamily:"'Cinzel Decorative',serif",
              fontSize:'clamp(2.4rem,6vw,5.2rem)', fontWeight:900, textAlign:'center',
              lineHeight:1.08,
              background:'linear-gradient(160deg,#fff 0%,#f0cb6a 52%,#c9a84c 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              filter:'drop-shadow(0 0 28px rgba(201,168,76,.22))',
              marginBottom:'1.2rem' }}>
              Services
            </h2>

            <p style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:'clamp(.8rem,1.5vw,1.05rem)',
              color:'rgba(244,244,246,.35)', textAlign:'center',
              maxWidth:480, lineHeight:1.65, marginBottom:'2.8rem' }}>
              From big ideas to fine details — we design, build &amp; ship digital products
              that move businesses forward.
            </p>

            <div style={{ width:'clamp(50px,8vw,90px)', height:1, marginBottom:'2.8rem',
              background:'linear-gradient(to right,transparent,rgba(201,168,76,.3),transparent)' }}/>

            {/* STATS */}
            <div id="svc-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
              gap:'clamp(8px,1.5vw,18px)', width:'100%', maxWidth:700 }}>
              {STATS.map((s, i) => (
                <div key={i} id={`stat-${i}`} className="stat-card">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <p style={{ fontFamily:"'JetBrains Mono',monospace",
              fontSize:'.5rem', letterSpacing:'.3em', textTransform:'uppercase',
              color:'rgba(74,74,90,.6)', marginTop:'2.5rem',
              animation:'blink 2.8s ease-in-out infinite' }}>
              ↓ Scroll to explore
            </p>
          </div>

          {/* ── DEV CONTENT (z=3, below door 1) ── */}
          <div id="dev-panel" className="content-panel" style={{ zIndex:3 }}>
            <div className="panel-inner">
              <div className="panel-title-block">
                <p className="panel-num">01 — BUILD</p>
                <h3 className="panel-h3">Develop&shy;ment</h3>
                <div className="panel-rule"/>
                <p className="panel-desc">Engineering solutions that scale with your ambitions.</p>
              </div>
              <div className="svc-grid-2">
                {DEV_SERVICES.map((s, i) => (
                  <div key={i} id={`dev-card-${i}`} className="svc-card">
                    <span className="svc-card-icon">{s.icon}</span>
                    <div>
                      <div className="svc-card-title">{s.title}</div>
                      <div className="svc-card-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── DOOR 1 (z=5) ── */}
          <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, zIndex:5 }}>
            <div id="d1-left" className="door-panel door-panel-L" style={{ transform:'translateX(-104%)' }}>
              <div className="door-hex"/>
              <DoorGrid/>
              <div className="door-caution-t"/>
              <div className="door-caution-b"/>
              <div className="door-dot" style={{ top:18, left:18 }}/>
              <div className="door-dot" style={{ top:18, right:18 }}/>
              <div className="door-dot" style={{ bottom:18, left:18 }}/>
              <div className="door-dot" style={{ bottom:18, right:18 }}/>
              <div className="door-acc" style={{ top:'30%' }}/>
              <div className="door-acc" style={{ top:'55%' }}/>
              <div className="door-acc" style={{ top:'72%' }}/>
              <div className="door-ring">
                <svg width="clamp(120px,18vw,220px)" height="clamp(120px,18vw,220px)" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#e8192c" strokeWidth="1" strokeDasharray="8 6"/>
                  <circle cx="110" cy="110" r="75" fill="none" stroke="#e8192c" strokeWidth=".5" strokeDasharray="4 8"/>
                </svg>
              </div>
              <div className="door-ring-inner">
                <svg width="clamp(70px,10vw,130px)" height="clamp(70px,10vw,130px)" viewBox="0 0 130 130">
                  <circle cx="65" cy="65" r="58" fill="none" stroke="#e8192c" strokeWidth=".8" strokeDasharray="5 5"/>
                </svg>
              </div>
              <div className="door-label-wrap">
                <div className="door-sector-text">SECTOR</div>
                <div className="door-title-text">Development</div>
                <div className="door-divider"/>
              </div>
            </div>

            <div id="d1-right" className="door-panel door-panel-R" style={{ transform:'translateX(104%)' }}>
              <div className="door-hex"/>
              <DoorGrid/>
              <div className="door-caution-t"/>
              <div className="door-caution-b"/>
              <div className="door-dot" style={{ top:18, left:18 }}/>
              <div className="door-dot" style={{ top:18, right:18 }}/>
              <div className="door-dot" style={{ bottom:18, left:18 }}/>
              <div className="door-dot" style={{ bottom:18, right:18 }}/>
              <div className="door-acc" style={{ top:'30%' }}/>
              <div className="door-acc" style={{ top:'55%' }}/>
              <div className="door-acc" style={{ top:'72%' }}/>
              <div className="door-ring">
                <svg width="clamp(120px,18vw,220px)" height="clamp(120px,18vw,220px)" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#e8192c" strokeWidth="1" strokeDasharray="8 6"/>
                  <circle cx="110" cy="110" r="75" fill="none" stroke="#e8192c" strokeWidth=".5" strokeDasharray="4 8"/>
                </svg>
              </div>
              <div className="door-label-wrap">
                <div className="door-sector-text">SECTOR</div>
                <div className="door-title-text">Development</div>
                <div className="door-divider"/>
              </div>
            </div>

            <div id="seam1" className="seam"/>
            <div className="seam-ambient"/>
            <div id="bolt1-L" className="bolt bolt-L"><BoltSVG/></div>
            <div id="bolt1-R" className="bolt bolt-R"><BoltSVG/></div>
          </div>

          {/* ── DOOR 2 (z=7) ── */}
          <div id="d2-wrap" style={{ position:'absolute', top:0, left:0, right:0, bottom:0, zIndex:7, opacity:0 }}>
            <div id="d2-left" className="door-panel door-panel-L">
              <div className="door-hex"/>
              <DoorGrid/>
              <div className="door-caution-t"/>
              <div className="door-caution-b"/>
              <div className="door-dot" style={{ top:18, left:18 }}/>
              <div className="door-dot" style={{ top:18, right:18 }}/>
              <div className="door-dot" style={{ bottom:18, left:18 }}/>
              <div className="door-dot" style={{ bottom:18, right:18 }}/>
              <div className="door-acc" style={{ top:'30%' }}/>
              <div className="door-acc" style={{ top:'55%' }}/>
              <div className="door-acc" style={{ top:'72%' }}/>
              <div className="door-ring">
                <svg width="clamp(120px,18vw,220px)" height="clamp(120px,18vw,220px)" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="8 6"/>
                  <circle cx="110" cy="110" r="75" fill="none" stroke="#c9a84c" strokeWidth=".5" strokeDasharray="4 8"/>
                </svg>
              </div>
              <div className="door-label-wrap">
                <div className="door-sector-text" style={{ color:'rgba(201,168,76,.18)' }}>SECTOR</div>
                <div className="door-title-text" style={{ color:'rgba(201,168,76,.09)' }}>Design</div>
                <div className="door-divider" style={{ background:'linear-gradient(to right,transparent,rgba(201,168,76,.15),transparent)' }}/>
              </div>
            </div>

            <div id="d2-right" className="door-panel door-panel-R">
              <div className="door-hex"/>
              <DoorGrid/>
              <div className="door-caution-t"/>
              <div className="door-caution-b"/>
              <div className="door-dot" style={{ top:18, left:18 }}/>
              <div className="door-dot" style={{ top:18, right:18 }}/>
              <div className="door-dot" style={{ bottom:18, left:18 }}/>
              <div className="door-dot" style={{ bottom:18, right:18 }}/>
              <div className="door-acc" style={{ top:'30%' }}/>
              <div className="door-acc" style={{ top:'55%' }}/>
              <div className="door-acc" style={{ top:'72%' }}/>
              <div className="door-ring">
                <svg width="clamp(120px,18vw,220px)" height="clamp(120px,18vw,220px)" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="100" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="8 6"/>
                </svg>
              </div>
              <div className="door-label-wrap">
                <div className="door-sector-text" style={{ color:'rgba(201,168,76,.18)' }}>SECTOR</div>
                <div className="door-title-text" style={{ color:'rgba(201,168,76,.09)' }}>Design</div>
                <div className="door-divider" style={{ background:'linear-gradient(to right,transparent,rgba(201,168,76,.15),transparent)' }}/>
              </div>
            </div>

            <div id="seam2" className="seam"/>
            <div className="seam-ambient"/>
            <div id="bolt2-L" className="bolt bolt-L"><BoltSVG gold/></div>
            <div id="bolt2-R" className="bolt bolt-R"><BoltSVG gold/></div>
          </div>

          {/* ── DESIGN CONTENT (z=9, ABOVE door 2 so it shows through the open door) ── */}
          <div id="des-panel" className="content-panel" style={{ zIndex:9 }}>
            <div className="panel-inner">
              <div className="panel-title-block">
                <p className="panel-num">02 — CRAFT</p>
                <h3 className="panel-h3">Design</h3>
                <div className="panel-rule"/>
                <p className="panel-desc">Visual language that builds trust and drives action.</p>
              </div>
              <div className="svc-grid-3">
                {DES_SERVICES.map((s, i) => (
                  <div key={i} id={`des-card-${i}`} className="svc-card">
                    <span className="svc-card-icon">{s.icon}</span>
                    <div>
                      <div className="svc-card-title">{s.title}</div>
                      <div className="svc-card-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>{/* /svc-sticky */}
      </section>
    </>
  )
}

/* ── Door circuit grid SVG ── */
function DoorGrid() {
  return (
    <svg className="door-grid" viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}>
      {[15,30,50,70,85].map(x => (
        <line key={`x${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#e8192c" strokeWidth="0.25"/>
      ))}
      {[20,40,60,80].map(y => (
        <line key={`y${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e8192c" strokeWidth="0.25"/>
      ))}
      {[15,85].flatMap(x => [20,60].map(y => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.2" fill="#e8192c" opacity="0.5"/>
      )))}
      <circle cx="50" cy="50" r="2" fill="none" stroke="#e8192c" strokeWidth="0.6" opacity="0.4"/>
      <circle cx="50" cy="50" r="0.8" fill="#e8192c" opacity="0.5"/>
    </svg>
  )
}

/* ── Lightning bolt SVG ── */
function BoltSVG({ gold = false }: { gold?: boolean }) {
  const c = gold ? '#c9a84c' : '#e8192c'
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 400" preserveAspectRatio="none"
      style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}>
      <defs>
        <linearGradient id={`bg${gold?'g':'r'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={c} stopOpacity="0"/>
          <stop offset="20%"  stopColor={c} stopOpacity="0.6"/>
          <stop offset="50%"  stopColor={c} stopOpacity="1"/>
          <stop offset="80%"  stopColor={c} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect x="25" y="0" width="10" height="400" fill={`url(#bg${gold?'g':'r'})`} opacity="0.18"/>
      <polyline
        points="30,0 22,80 38,80 18,200 42,200 20,320 40,320 30,400"
        fill="none" stroke={c} strokeWidth="1.5" opacity="0.55" strokeLinejoin="round"/>
      <polyline
        points="30,0 24,80 36,80 20,200 40,200 22,320 38,320 30,400"
        fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" strokeLinejoin="round"/>
    </svg>
  )
} 
