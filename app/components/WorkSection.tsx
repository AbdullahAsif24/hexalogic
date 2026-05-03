'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────── DATA ─────────────────── */
const PROJECTS = [
  { id: '01', type: 'RESTAURANT', titleA: 'Ember &', titleB: 'Oak', desc: 'A fine-dining restaurant website with online reservations, seasonal menu showcases, and immersive food photography layouts. Warmth and elegance on every scroll.', tags: ['Next.js', 'Tailwind', 'Framer Motion', 'OpenTable API'], link: '#', accent: '#e8192c', img: '/projects/resturant-website.png' },
  { id: '02', type: 'FITNESS', titleA: 'Iron', titleB: 'Republic', desc: 'A high-energy gym website with class schedules, membership tiers, trainer profiles, and a live booking system. Built to convert visitors into members.', tags: ['React', 'TypeScript', 'Tailwind', 'Stripe'], link: '#', accent: '#c9963b', img: '/projects/iron-republic.png' },
  { id: '03', type: 'REAL ESTATE', titleA: 'Prestige', titleB: 'Properties', desc: 'A luxury real estate agency site with interactive property listings, map integration, and virtual tour support. Turning browsers into buyers.', tags: ['Next.js', 'TypeScript', 'Google Maps', 'Sanity'], link: '#', accent: '#e8192c', img: '/projects/prestige-properties.png' },
  { id: '04', type: 'SALON & SPA', titleA: 'Lumière', titleB: 'Studio', desc: 'An elegant beauty salon website with service menus, stylist portfolios, and a seamless appointment booking flow. Luxury in every pixel.', tags: ['React', 'Tailwind', 'Calendly API', 'Framer Motion'], link: '#', accent: '#c9963b', img: '/projects/salon.png' },
  { id: '05', type: 'LAW FIRM', titleA: 'Vance &', titleB: 'Associates', desc: 'A professional law firm website projecting authority and trust. Practice area pages, attorney bios, consultation forms, and ADA-compliant design throughout.', tags: ['Next.js', 'TypeScript', 'Tailwind', 'HubSpot'], link: '#', accent: '#e8192c', img: '/projects/law-firm.png' },
  { id: '06', type: 'HOTEL', titleA: 'The', titleB: 'Grandview', desc: 'A boutique hotel website with room galleries, availability calendars, local experience guides, and a frictionless direct booking engine.', tags: ['Next.js', 'Tailwind', 'Stripe', 'Cloudinary'], link: '#', accent: '#c9963b', img: '/projects/hotel.png' },
  { id: '07', type: 'E-COMMERCE', titleA: 'Bloom', titleB: 'Botanics', desc: 'A premium plant and floral eCommerce store with curated collections, care guides, subscription boxes, and same-day delivery scheduling.', tags: ['Next.js', 'Shopify', 'TypeScript', 'Tailwind'], link: '#', accent: '#e8192c', img: '/projects/ecommerce.png' },
]

/* ─────────────────── PARTICLE BG ─────────────────── */
function ParticleBg() {
  const cvs = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!

    type P = { x: number; y: number; baseY: number; r: number; spd: number; ph: number; col: string; depth: number; vx: number; vy: number }
    let W = 0, H = 0, pts: P[] = [], t = 0

    const init = () => {
      W = canvas.width = canvas.offsetWidth * Math.min(devicePixelRatio, 2)
      H = canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2)
      pts = []
      /* ↑ many more particles — 1 per 2200px² */
      const n = Math.floor(W * H / 2200)
      for (let i = 0; i < n; i++) {
        const d = Math.random()
        const by = H * (.38 + Math.sin(d * Math.PI) * .32) + (Math.random() - .5) * H * .55
        const isRed = Math.random() > .68
        pts.push({
          x: Math.random() * W, y: by, baseY: by,
          r: .4 + d * 3.4, spd: .003 + d * .02, ph: Math.random() * Math.PI * 2,
          col: isRed
            ? `rgba(232,25,44,${(.1 + d * .62).toFixed(2)})`
            : `rgba(201,150,59,${(.08 + d * .52).toFixed(2)})`,
          depth: d, vx: 0, vy: 0,
        })
      }
    }

    const draw = () => {
      t++
      ctx.clearRect(0, 0, W, H)

      /* deep glow */
      const bg = ctx.createRadialGradient(W * .5, H * .44, 0, W * .5, H * .44, W * .62)
      bg.addColorStop(0, 'rgba(175,8,20,0.22)'); bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      /* secondary glow bottom-right */
      const bg2 = ctx.createRadialGradient(W * .85, H * .75, 0, W * .85, H * .75, W * .4)
      bg2.addColorStop(0, 'rgba(201,150,59,0.06)'); bg2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H)

      /* wave bands */
      for (let w = 0; w < 6; w++) {
        const yc = H * (.34 + w * .055), amp = H * (.038 + w * .013), frq = .0038 + w * .0008, spd = t * (.011 + w * .003)
        ctx.beginPath()
        for (let x = 0; x <= W; x += 5) {
          const y = yc + Math.sin(x * frq + spd) * amp + Math.sin(x * frq * 1.9 + spd * .65) * amp * .38
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(232,25,44,${.065 - w * .008})`
        ctx.lineWidth = Math.max(.4, 1.8 - w * .25); ctx.stroke()
      }

      /* particles */
      const mx = mouse.current.x * Math.min(devicePixelRatio, 2)
      const my = mouse.current.y * Math.min(devicePixelRatio, 2)

      pts.forEach(p => {
        p.y = p.baseY
          + Math.sin(t * p.spd + p.ph) * (16 + p.depth * 34)
          + Math.cos(t * p.spd * .6 + p.ph * 1.4) * (7 + p.depth * 13)
        p.x += p.spd * 18; if (p.x > W + 10) p.x = -10

        const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx * dx + dy * dy), zone = 180 + p.depth * 90
        if (dist < zone && dist > 0) {
          const f = (1 - dist / zone) * 4 * (0.35 + p.depth * .65)
          p.vx += (dx / dist) * f; p.vy += (dy / dist) * f
        }
        p.vx *= .8; p.vy *= .8; p.x += p.vx; p.y += p.vy

        if (p.depth > .5) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8)
          g.addColorStop(0, p.col.replace(/[\d.]+\)$/, '0.18)')); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2); ctx.fill()
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.col; ctx.fill()
      })

      /* connections */
      const near = pts.filter(p => p.depth > .58)
      for (let i = 0; i < near.length; i++) for (let j = i + 1; j < near.length; j++) {
        const dx = near[i].x - near[j].x, dy = near[i].y - near[j].y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 95) {
          ctx.beginPath(); ctx.moveTo(near[i].x, near[i].y); ctx.lineTo(near[j].x, near[j].y)
          ctx.strokeStyle = `rgba(232,25,44,${((1 - d / 95) * .2).toFixed(3)})`
          ctx.lineWidth = .5; ctx.stroke()
        }
      }
      raf.current = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top } }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    const onResize = () => init()

    init(); raf.current = requestAnimationFrame(draw)
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave) }
  }, [])

  return <canvas ref={cvs} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
}

/* ─────────────────── PROJECT IMAGE ─────────────────── */
function ProjectImage({ img, accent, active, dir }: { img: string; accent: string; active: boolean; dir: number }) {
  const [hasImg, setHasImg] = useState(true)
  const [loaded, setLoaded] = useState(false)
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(1rem,2vw,2rem)',          // ← reduced padding = image fills more space
      opacity: active ? 1 : 0,
      transform: active ? 'none' : `translateX(${dir * 55}px) scale(0.93)`,
      transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1),transform 0.55s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents: active ? 'auto' : 'none',
    }}>
      <div style={{
        width: '100%', maxWidth: 720,           // ← was 560, now wider
        aspectRatio: '16/10', position: 'relative',
        borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${accent}2e`,
        boxShadow: `0 0 70px ${accent}1a,0 40px 100px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}>
        {hasImg && (
          <img
            src={img}
            alt=""
            onLoad={() => setLoaded(true)}
            onError={() => setHasImg(false)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          />
        )}
        {(!hasImg || !loaded) && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,#0d0d16 0%,#141420 50%,#0d0d16 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            {/* Browser chrome mockup */}
            <div style={{ width: '72%', background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ height: 28, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(232,25,44,0.4)' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(201,150,59,0.3)' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1, height: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 3, marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.38rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '.1em' }}>
                    hexalogic.co/{img.split('/').pop()?.replace('.png', '') ?? 'project'}
                  </span>
                </div>
              </div>
              <div style={{ height: 90, background: 'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,transparent 100%)', display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 14px' }}>
                <div style={{ width: '55%', height: 8, borderRadius: 3, background: `${accent}22` }} />
                <div style={{ width: '38%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ width: '70%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.04)', marginTop: 4 }} />
                <div style={{ width: '50%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.42rem', letterSpacing: '.28em', textTransform: 'uppercase', color: `${accent}55` }}>
              add image → /public{img}
            </span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(135deg,rgba(255,255,255,0.03) 0%,transparent 50%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top,rgba(6,6,8,0.65),transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right,${accent},transparent)` }} />
      </div>
    </div>
  )
}

/* ─────────────────── SLICE TRANSITION ─────────────────── */
function SliceTransition({ active, dir }: { active: boolean; dir: number }) {
  const slices = 8
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
      {Array.from({ length: slices }).map((_, i) => (
        <div key={i} style={{
          flex: 1,
          background: 'rgba(6,6,8,0.96)',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: i % 2 === 0 ? 'left' : 'right',
          transition: active
            ? `transform 0.18s cubic-bezier(0.76,0,0.24,1) ${i * 18}ms`
            : `transform 0.22s cubic-bezier(0.16,1,0.3,1) ${(slices - 1 - i) * 14 + 160}ms`,
        }} />
      ))}
    </div>
  )
}

/* ─────────────────── MAIN ─────────────────── */
export default function WorkSection() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [sliceIn, setSliceIn] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [direction, setDirection] = useState(1)
  const [hoverTitle, setHoverTitle] = useState(false)
  const wheelLock = useRef(false)
  const touchY = useRef(0)

  const goTo = useCallback((idx: number, dir = 1) => {
    if (transitioning || idx === current) return
    setDirection(dir); setTransitioning(true); setPhase('out'); setSliceIn(true)
    setTimeout(() => {
      setCurrent(idx); setPhase('in')
      setTimeout(() => { setSliceIn(false) }, 80)
      setTimeout(() => { setPhase('idle'); setTransitioning(false) }, 640)
    }, 300)
  }, [transitioning, current])

  const next = useCallback(() => goTo((current + 1) % PROJECTS.length, 1), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + PROJECTS.length) % PROJECTS.length, -1), [current, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next(); if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev() }
    const onWheel = (e: WheelEvent) => { if (wheelLock.current) return; wheelLock.current = true; setTimeout(() => { wheelLock.current = false }, 900); if (e.deltaY > 30) next(); if (e.deltaY < -30) prev() }
    const onTS = (e: TouchEvent) => { touchY.current = e.touches[0].clientY }
    const onTE = (e: TouchEvent) => { const dy = touchY.current - e.changedTouches[0].clientY; if (dy > 50) next(); if (dy < -50) prev() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchend', onTE, { passive: true })
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', onTS); window.removeEventListener('touchend', onTE) }
  }, [next, prev])

  const proj = PROJECTS[current]
  const progress = ((current + 1) / PROJECTS.length) * 100

  const anim = (delay = '0s') => ({
    animation: phase === 'out'
      ? `wsOut .3s cubic-bezier(0.4,0,1,1) ${delay} forwards`
      : phase === 'in'
        ? `wsIn .6s cubic-bezier(0.16,1,0.3,1) ${delay} forwards`
        : 'none',
    opacity: phase === 'in' ? 0 : 1,
  })

  return (
    <>
      <style>{`
        #ws-root{
          position:relative;width:100%;height:100vh;
          background:#060608;overflow:hidden;
          font-family:'Outfit',sans-serif;
        }

        /* morph */
        @keyframes wsOut{ from{opacity:1;transform:translateY(0)}    to{opacity:0;transform:translateY(-20px)} }
        @keyframes wsIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)}     }

        /* grain */
        #ws-grain{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:.038;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;}

        /* scan */
        #ws-scan{position:absolute;left:0;right:0;height:1px;top:0;z-index:6;pointer-events:none;
          background:linear-gradient(to right,transparent,rgba(232,25,44,0.09),transparent);
          animation:wsScan 14s linear infinite;}
        @keyframes wsScan{from{top:-2px}to{top:100%}}

        /* corners */
        .ws-c{position:absolute;width:18px;height:18px;border-color:rgba(232,25,44,0.18);border-style:solid;z-index:10;pointer-events:none;}
        .ws-c-tl{top:1.4rem;left:1.4rem;border-width:1px 0 0 1px}
        .ws-c-tr{top:1.4rem;right:1.4rem;border-width:1px 1px 0 0}
        .ws-c-bl{bottom:1.4rem;left:1.4rem;border-width:0 0 1px 1px}
        .ws-c-br{bottom:1.4rem;right:1.4rem;border-width:0 1px 1px 0}

        /* ── TOPBAR — three equal columns so center is truly centred ── */
        #ws-top{
          position:absolute;top:0;left:0;right:0;z-index:10;
          display:grid;grid-template-columns:1fr auto 1fr;
          align-items:center;
          padding:clamp(.9rem,2vw,1.6rem) clamp(1.2rem,3.5vw,3rem);
          border-bottom:1px solid rgba(255,255,255,0.032);
          backdrop-filter:blur(2px);
          pointer-events:none;
        }
        .ws-top-left{display:flex;flex-direction:column;gap:2px;justify-self:start;}
        .ws-top-center{display:flex;flex-direction:column;align-items:center;gap:2px;justify-self:center;}
        .ws-top-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;justify-self:end;}
        .ws-label{font-family:'JetBrains Mono',monospace;font-size:clamp(.42rem,.72vw,.56rem);letter-spacing:.42em;text-transform:uppercase;color:rgba(201,150,59,0.36);}
        .ws-brand{font-family:'Cinzel Decorative',serif;font-size:clamp(.82rem,1.7vw,1.05rem);font-weight:700;
          background:linear-gradient(135deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .ws-sub{font-family:'Outfit',sans-serif;font-size:clamp(.54rem,.9vw,.68rem);color:rgba(244,240,232,0.18);letter-spacing:.04em;}

        /* divider */
        .ws-vdiv{position:absolute;left:50%;top:10%;bottom:10%;width:1px;z-index:8;pointer-events:none;
          background:linear-gradient(to bottom,transparent,rgba(201,150,59,0.08) 30%,rgba(201,150,59,0.08) 70%,transparent);}

        /* grid */
        #ws-grid{position:absolute;inset:0;z-index:7;display:grid;grid-template-columns:1fr 1fr;}

        /* left */
        .ws-left{
          position:relative;display:flex;flex-direction:column;justify-content:center;
          padding:clamp(4rem,9vh,8rem) clamp(1.5rem,2.5vw,3.5rem) clamp(4rem,9vh,8rem) clamp(1.5rem,6vw,7rem);
          overflow:hidden;
        }
        .ws-ghost{
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(5rem,12vw,10rem);font-weight:900;line-height:.85;
          color:transparent;-webkit-text-stroke:1px rgba(201,150,59,0.07);
          position:absolute;left:clamp(.8rem,2.5vw,3vw);top:50%;transform:translateY(-58%);
          user-select:none;pointer-events:none;
        }

        /* badge */
        .ws-badge{display:flex;align-items:center;gap:11px;margin-bottom:clamp(.7rem,1.4vh,1.3rem);}
        .ws-badge-line{width:26px;height:1px;background:#c9963b;flex-shrink:0;}
        .ws-badge-txt{font-family:'JetBrains Mono',monospace;font-size:clamp(.48rem,.78vw,.58rem);letter-spacing:.4em;text-transform:uppercase;color:#c9963b;}

        /* ── TITLE HOVER ── */
        .ws-title{
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.6rem,3.6vw,3.6rem);font-weight:900;line-height:1.06;
          color:#f4f0e8;letter-spacing:-.01em;
          margin-bottom:clamp(.7rem,1.4vh,1.3rem);
          cursor:default;position:relative;display:inline-block;
        }
        .ws-title em{font-style:italic;color:#c9963b;transition:color .3s,text-shadow .3s;}
        .ws-title:hover em{color:#f0cb6a;text-shadow:0 0 24px rgba(240,203,106,0.5);}
        .ws-ch{display:inline-block;transition:transform .22s cubic-bezier(0.34,1.56,0.64,1),color .22s;}
        .ws-title:hover .ws-ch{transform:translateY(-4px);color:#fff;}
        .ws-title-bar{
          position:absolute;bottom:-3px;left:0;height:1.5px;width:0;
          background:linear-gradient(to right,#e8192c,rgba(201,150,59,0.5),transparent);
          border-radius:1px;transition:width .4s cubic-bezier(0.16,1,0.3,1);
        }
        .ws-title:hover .ws-title-bar{width:80%;}

        /* rule */
        .ws-rule{height:2px;margin-bottom:clamp(.7rem,1.4vh,1.3rem);width:0;
          background:linear-gradient(to right,#e8192c,rgba(201,150,59,.3),transparent);
          border-radius:1px;transition:width .85s .18s cubic-bezier(0.16,1,0.3,1);}
        .ws-rule.on{width:46%;}

        /* desc */
        .ws-desc{font-size:clamp(.68rem,.92vw,.82rem);color:rgba(244,240,232,0.3);line-height:1.9;max-width:370px;margin-bottom:clamp(.7rem,1.4vh,1.3rem);font-weight:300;}

        /* tags */
        .ws-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:clamp(.9rem,1.8vh,1.7rem);}
        .ws-tag{font-family:'JetBrains Mono',monospace;font-size:clamp(.42rem,.7vw,.52rem);letter-spacing:.18em;text-transform:uppercase;padding:5px 12px;border-radius:3px;border:1px solid rgba(232,25,44,0.18);color:rgba(244,240,232,0.34);background:rgba(232,25,44,0.03);transition:all .25s;cursor:default;}
        .ws-tag:hover{border-color:rgba(201,150,59,0.5);color:rgba(244,240,232,0.82);background:rgba(201,150,59,0.07);}

        /* cta */
        .ws-cta{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:clamp(.48rem,.76vw,.58rem);letter-spacing:.28em;text-transform:uppercase;color:rgba(244,240,232,0.68);padding:11px 22px;border:1px solid rgba(232,25,44,0.26);position:relative;overflow:hidden;transition:all .35s;width:fit-content;}
        .ws-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(232,25,44,0.1),transparent 70%);transform:translateX(-100%);transition:transform .55s cubic-bezier(0.4,0,0.2,1);}
        .ws-cta:hover::before{transform:translateX(100%);}
        .ws-cta:hover{border-color:#c9963b;color:#c9963b;box-shadow:0 0 26px rgba(201,150,59,0.1);}
        .ws-arr{transition:transform .3s;display:inline-block;}
        .ws-cta:hover .ws-arr{transform:translate(3px,-3px);}

        /* right */
        .ws-right{position:relative;overflow:hidden;}

        /* ── NAV ── */
        #ws-nav{position:absolute;bottom:clamp(1.4rem,2.8vh,2.4rem);left:50%;transform:translateX(-50%);z-index:10;display:flex;align-items:center;gap:16px;}
        .ws-btn{
          width:40px;height:40px;border-radius:50%;
          border:1px solid rgba(201,150,59,0.2);background:rgba(6,6,8,0.65);
          color:rgba(244,240,232,0.48);font-size:1rem;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all .3s;backdrop-filter:blur(8px);position:relative;overflow:hidden;
        }
        .ws-btn::after{content:'';position:absolute;inset:0;border-radius:50%;background:rgba(232,25,44,0);transition:background .3s;}
        .ws-btn:hover::after{background:rgba(232,25,44,0.12);}
        .ws-btn:hover{border-color:rgba(201,150,59,0.55);color:rgba(201,150,59,0.9);box-shadow:0 0 16px rgba(201,150,59,0.12);}
        .ws-btn:active{transform:scale(0.9);}

        .ws-dots{display:flex;align-items:center;gap:7px;}
        .ws-dot{width:5px;height:5px;border-radius:3px;background:rgba(244,240,232,0.1);border:1px solid rgba(201,150,59,0.14);transition:all .42s cubic-bezier(0.16,1,0.3,1);cursor:pointer;}
        .ws-dot.on{background:#e8192c;width:20px;box-shadow:0 0 10px rgba(232,25,44,0.5);}
        .ws-dot:hover:not(.on){background:rgba(201,150,59,0.28);}

        /* counter */
        #ws-ctr{position:absolute;right:clamp(1.4rem,3vw,3rem);bottom:clamp(1.4rem,2.8vh,2.4rem);z-index:10;font-family:'JetBrains Mono',monospace;color:rgba(201,150,59,0.26);font-size:.78rem;letter-spacing:.06em;user-select:none;text-align:right;}
        .ws-ctr-big{font-family:'Cinzel Decorative',serif;font-size:clamp(1.3rem,2.6vw,1.9rem);color:rgba(244,240,232,0.52);display:block;line-height:1;}

        /* progress */
        #ws-prog{position:absolute;bottom:0;left:0;right:0;height:2px;z-index:10;background:rgba(255,255,255,0.04);}
        .ws-prog-fill{height:100%;background:linear-gradient(to right,#e8192c,#c9963b);transition:width .6s cubic-bezier(0.16,1,0.3,1);box-shadow:0 0 12px rgba(232,25,44,0.38);}

        /* ── RESPONSIVE ── */
        @media(max-width:900px){#ws-grid{grid-template-columns:1fr;}.ws-right,.ws-vdiv{display:none;}.ws-ghost{display:none;}}
        @media(max-width:600px){.ws-left{padding:5rem 1.5rem 7rem;}#ws-top{padding:1rem 1.4rem;}.ws-sub{display:none;}#ws-ctr{right:1.4rem;bottom:2rem;}#ws-nav{bottom:1.8rem;}.ws-top-center{display:none;}}
      `}</style>

      <section id="work">
        <div id="ws-root">

          {/* ── PARTICLE BG ── */}
          <ParticleBg />

          {/* per-project ambient */}
          {PROJECTS.map((p, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: i % 2 === 0
                ? 'radial-gradient(ellipse 80% 60% at 68% 50%,rgba(232,25,44,0.06) 0%,transparent 70%)'
                : 'radial-gradient(ellipse 80% 60% at 68% 50%,rgba(201,150,59,0.08) 0%,transparent 70%)',
              opacity: i === current ? 1 : 0, transition: 'opacity 1.1s ease',
            }} />
          ))}

          {/* grain */}
          <div id="ws-grain" />
          {/* scan */}
          <div id="ws-scan" />
          {/* corners */}
          <div className="ws-c ws-c-tl" /><div className="ws-c ws-c-tr" />
          <div className="ws-c ws-c-bl" /><div className="ws-c ws-c-br" />

          {/* ── TOPBAR — true 3-col grid ── */}
          <div id="ws-top">
            <div className="ws-top-left">
              <span className="ws-label">Selected Work</span>
              <span className="ws-sub">Crafted with precision</span>
            </div>

            <div className="ws-top-center">
              <span className="ws-brand">Projects</span>
              <span className="ws-sub" style={{ textAlign: 'center' }}>
                {PROJECTS.length} builds &amp; counting
              </span>
            </div>

            <div className="ws-top-right">
              <span className="ws-label">Est. 2021</span>
              <span className="ws-sub">Hexalogic Studio</span>
            </div>
          </div>

          {/* ── SLICE TRANSITION ── */}
          <SliceTransition active={sliceIn} dir={direction} />

          {/* divider */}
          <div className="ws-vdiv" />

          {/* ── MAIN GRID ── */}
          <div id="ws-grid">

            {/* LEFT */}
            <div className="ws-left">
              <div className="ws-ghost">{proj.id}</div>

              {/* badge */}
              <div style={anim('0s')}>
                <div className="ws-badge">
                  <div className="ws-badge-line" />
                  <span className="ws-badge-txt">{proj.type}</span>
                </div>
              </div>

              {/* title */}
              <div style={anim('0.09s')}>
                <h2
                  className="ws-title"
                  onMouseEnter={() => setHoverTitle(true)}
                  onMouseLeave={() => setHoverTitle(false)}
                >
                  {proj.titleA.split('').map((c, i) => (
                    <span key={i} className="ws-ch" style={{ transitionDelay: `${i * 26}ms`, color: hoverTitle ? '#fff' : 'inherit' }}>{c}</span>
                  ))}
                  <br />
                  <em>
                    {proj.titleB.split('').map((c, i) => (
                      <span key={i} className="ws-ch" style={{ transitionDelay: `${(proj.titleA.length + i) * 26}ms` }}>{c}</span>
                    ))}
                  </em>
                  <div className="ws-title-bar" />
                </h2>
              </div>

              {/* rule */}
              <div className={`ws-rule${phase !== 'out' ? ' on' : ''}`} />

              {/* desc */}
              <div style={anim('0.2s')}>
                <p className="ws-desc">{proj.desc}</p>
              </div>

              {/* tags */}
              <div style={anim('0.3s')}>
                <div className="ws-tags">
                  {proj.tags.map((tg, i) => <span key={i} className="ws-tag">{tg}</span>)}
                </div>
              </div>

              {/* cta */}
              <div style={anim('0.4s')}>
                <a href={proj.link} className="ws-cta" target="_blank" rel="noopener noreferrer">
                  View Project <span className="ws-arr">↗</span>
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="ws-right">
              {PROJECTS.map((p, i) => (
                <ProjectImage key={i} img={p.img} accent={p.accent} active={i === current} dir={direction} />
              ))}
            </div>
          </div>

          {/* ── NAV ── */}
          <div id="ws-nav">
            <button className="ws-btn" onClick={prev}>←</button>
            <div className="ws-dots">
              {PROJECTS.map((_, i) => (
                <div key={i} className={`ws-dot${i === current ? ' on' : ''}`} onClick={() => goTo(i, i > current ? 1 : -1)} />
              ))}
            </div>
            <button className="ws-btn" onClick={next}>→</button>
          </div>

          {/* counter */}
          <div id="ws-ctr">
            <span className="ws-ctr-big">{String(current + 1).padStart(2, '0')}</span>
            /{String(PROJECTS.length).padStart(2, '0')}
          </div>

          {/* progress */}
          <div id="ws-prog">
            <div className="ws-prog-fill" style={{ width: `${progress}%` }} />
          </div>

        </div>
      </section>
    </>
  )
}