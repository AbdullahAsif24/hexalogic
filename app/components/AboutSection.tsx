'use client'
import { useEffect, useRef, useState } from 'react'

/* ─────────────── DATA ─────────────── */
const STATS = [
  { num: '50', label: 'Projects\nDelivered',  suffix: '+' },
  { num: '98', label: 'Client\nSatisfaction', suffix: '%' },
  { num: '3',  label: 'Years\nBuilding',      suffix: '+' },
  { num: '12', label: 'Industries\nServed',   suffix: '+' },
]

const VALUES = [
  {
    icon: '\u25C8',
    title: 'Craft First',
    desc: 'We obsess over details others overlook. Every pixel, every interaction, every line of code is intentional.',
  },
  {
    icon: '\u2B21',
    title: 'Radical Clarity',
    desc: 'No jargon, no runaround. We communicate with brutal honesty and move with decisive speed.',
  },
  {
    icon: '\u25C9',
    title: 'Built to Last',
    desc: "We engineer for scale, not just for launch. Architecture that holds up years after we're done.",
  },
  {
    icon: '\u25C8',
    title: 'Skin in the Game',
    desc: 'Your success is ours. We treat every project as if our own name is on it — because our reputation is.',
  },
]

const TEAM = [
  {
    name: 'Hamza Raza',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack engineer with a design eye. Ships products that are as beautiful as they are bulletproof.',
    initials: 'HR',
    accent: '#e8192c',
  },
  {
    name: 'Sara Malik',
    role: 'Lead UI/UX Designer',
    bio: 'Crafts interfaces that feel inevitable. Turns complex flows into experiences users never want to leave.',
    initials: 'SM',
    accent: '#c9a84c',
  },
  {
    name: 'Ali Hassan',
    role: 'Backend Engineer',
    bio: 'Architects systems that scale silently. If it runs fast and never breaks, Ali probably built it.',
    initials: 'AH',
    accent: '#e8192c',
  },
]

const DIFFERENTIATORS: Array<[string, string]> = [
  ['\u25C8', 'Senior-only execution — no juniors handed your project'],
  ['\u2B21', 'Strategy + design + dev in one team, zero hand-off lag'],
  ['\u25C9', 'Fixed timelines, transparent pricing, zero scope creep'],
]

const MARQUEE_ITEMS = [
  'Design', 'Development', 'Strategy', 'Automation',
  'Mobile', 'Branding', 'Growth', 'Innovation',
]

const FOUNDER_TAGS = ['Next.js', 'React Native', 'Node.js', 'UI/UX', 'PostgreSQL', 'OpenAI']

/* ─────────────── HELPERS ─────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

/* ─────────────── ANIMATED COUNTER ─────────────── */
function AnimCounter({
  target, suffix, active,
}: { target: string; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState('0')
  const rafRef   = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const numTarget = parseFloat(target)
  const DURATION  = 1400

  useEffect(() => {
    if (!active) return
    startRef.current = null
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed  = now - startRef.current
      const progress = clamp(elapsed / DURATION)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(numTarget * eased).toString())
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(target)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, numTarget])

  return <>{display}{suffix}</>
}

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function AboutSection() {
  const secRef       = useRef<HTMLElement>(null)
  const rafRef       = useRef<number>(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef     = useRef<HTMLDivElement>(null)

  /* scroll RAF (kept for future parallax use) */
  useEffect(() => {
    const tick = () => { rafRef.current = requestAnimationFrame(tick) }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* stats counter trigger */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes scanAbout { from{top:-2px} to{top:100%} }
        @keyframes rotSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes marquee   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes tagPop    { from{opacity:0;transform:scale(.88) translateY(8px)} to{opacity:1;transform:none} }

        #about-sec {
          background:#06060a; position:relative; overflow:hidden;
        }
        .ab-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(232,25,44,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(232,25,44,0.03) 1px,transparent 1px);
          background-size:48px 48px;
        }
        .ab-scan {
          position:absolute; left:0; right:0; height:1px;
          pointer-events:none; z-index:2;
          background:linear-gradient(to right,transparent,rgba(232,25,44,.1),transparent);
          animation:scanAbout 14s linear infinite;
        }

        /* HERO */
        .ab-hero {
          position:relative; z-index:5;
          padding:clamp(5rem,10vh,9rem) clamp(1.5rem,6vw,7rem) clamp(3rem,6vh,6rem);
          display:grid; grid-template-columns:1fr auto;
          gap:clamp(2rem,4vw,5rem); align-items:end;
          border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .ab-eyebrow {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.42rem,.78vw,.58rem);
          letter-spacing:.55em; text-transform:uppercase;
          color:#e8192c; margin-bottom:1.2rem;
          display:flex; align-items:center; gap:12px;
        }
        .ab-eyebrow-line { display:inline-block; width:30px; height:1px; background:#e8192c; }
        .ab-headline {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2.8rem,7.5vw,7.5rem);
          font-weight:900; line-height:.95; letter-spacing:-.01em;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 48%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin:0;
        }
        .ab-headline-outline {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2.8rem,7.5vw,7.5rem);
          font-weight:900; line-height:.95; letter-spacing:-.01em;
          color:transparent;
          -webkit-text-stroke:1px rgba(201,168,76,0.25);
          display:block;
        }
        .ab-hero-right {
          display:flex; flex-direction:column; align-items:flex-end; gap:1.5rem; padding-bottom:.5rem;
        }
        .ab-hero-desc {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.72rem,1.1vw,.9rem);
          color:rgba(244,244,246,.35); line-height:1.8;
          max-width:320px; text-align:right; font-weight:300;
        }
        .ab-since {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.55rem,.9vw,.7rem);
          letter-spacing:.3em; color:rgba(201,168,76,.4); text-transform:uppercase;
        }

        /* MARQUEE */
        .ab-marquee-wrap {
          position:relative; overflow:hidden; z-index:5;
          border-top:1px solid rgba(255,255,255,0.04);
          border-bottom:1px solid rgba(255,255,255,0.04);
          padding:14px 0; background:rgba(232,25,44,0.03);
        }
        .ab-marquee-track {
          display:flex; white-space:nowrap;
          animation:marquee 22s linear infinite; width:max-content;
        }
        .ab-marquee-item {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.5rem,.82vw,.65rem);
          letter-spacing:.35em; text-transform:uppercase;
          color:rgba(201,168,76,.3);
          padding:0 clamp(1.5rem,3vw,3.5rem);
          display:flex; align-items:center; gap:clamp(1.5rem,3vw,3.5rem);
        }
        .ab-marquee-dot { width:4px; height:4px; border-radius:50%; background:#e8192c; opacity:.5; flex-shrink:0; }

        /* STORY */
        .ab-story {
          position:relative; z-index:5;
          display:grid; grid-template-columns:1fr 1fr; min-height:60vh;
        }
        .ab-story-left {
          padding:clamp(3rem,7vh,7rem) clamp(1.5rem,6vw,7rem);
          border-right:1px solid rgba(255,255,255,0.04);
          display:flex; flex-direction:column; justify-content:center; position:relative;
        }
        .ab-story-num {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(7rem,18vw,16rem); font-weight:900; line-height:1;
          color:transparent; -webkit-text-stroke:1px rgba(232,25,44,0.08);
          position:absolute; right:-0.1em; top:50%; transform:translateY(-50%);
          pointer-events:none; user-select:none; z-index:0;
        }
        .ab-story-label {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.4rem,.72vw,.55rem);
          letter-spacing:.5em; text-transform:uppercase;
          color:#e8192c; margin-bottom:1.5rem; position:relative; z-index:1;
        }
        .ab-story-title {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.6rem,3.5vw,3.2rem); font-weight:900; line-height:1.06;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 55%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:1.5rem; position:relative; z-index:1;
        }
        .ab-story-rule {
          height:2px; width:48px; margin-bottom:1.5rem;
          background:linear-gradient(to right,#e8192c,transparent);
          border-radius:1px; position:relative; z-index:1;
        }
        .ab-story-body {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.7rem,1.05vw,.86rem);
          color:rgba(244,244,246,.35); line-height:1.9;
          font-weight:300; position:relative; z-index:1; max-width:480px;
        }
        .ab-story-body strong { color:rgba(244,244,246,.7); font-weight:600; }
        .ab-story-right {
          padding:clamp(3rem,7vh,7rem) clamp(1.5rem,6vw,7rem);
          display:flex; flex-direction:column; gap:2rem; justify-content:center;
        }

        /* STATS */
        .ab-stats-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:1px; background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.04);
        }
        .ab-stat-cell {
          background:#06060a;
          padding:clamp(1.5rem,3vh,3rem) clamp(1rem,2.5vw,2.5rem);
          position:relative; overflow:hidden;
          transition:background .35s; cursor:default;
        }
        .ab-stat-cell::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(232,25,44,0.06) 0%,transparent 60%);
          opacity:0; transition:opacity .35s;
        }
        .ab-stat-cell:hover { background:rgba(232,25,44,0.04); }
        .ab-stat-cell:hover::before { opacity:1; }
        .ab-stat-cell:hover .ab-stat-num { filter:drop-shadow(0 0 20px rgba(232,25,44,0.4)); }
        .ab-stat-num {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.8rem,4vw,3.6rem); font-weight:900;
          background:linear-gradient(135deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          line-height:1; margin-bottom:.5rem; transition:filter .35s;
        }
        .ab-stat-label {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.66vw,.52rem);
          letter-spacing:.22em; text-transform:uppercase;
          color:rgba(244,244,246,.28); white-space:pre-line; line-height:1.5;
        }
        .ab-stat-accent-line {
          position:absolute; bottom:0; left:0; right:0; height:2px;
          background:linear-gradient(to right,#e8192c,transparent);
          transform:scaleX(0); transform-origin:left;
          transition:transform .5s cubic-bezier(.16,1,.3,1);
        }
        .ab-stat-cell:hover .ab-stat-accent-line { transform:scaleX(1); }

        /* VALUES */
        .ab-values {
          position:relative; z-index:5;
          padding:clamp(3rem,7vh,7rem) clamp(1.5rem,6vw,7rem);
          border-top:1px solid rgba(255,255,255,0.04);
        }
        .ab-values-header {
          display:grid; grid-template-columns:1fr 1fr;
          gap:2rem; margin-bottom:clamp(2.5rem,5vh,5rem); align-items:end;
        }
        .ab-values-headline {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.4rem,3vw,2.8rem); font-weight:900;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 55%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          line-height:1.06;
        }
        .ab-values-sub {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.68rem,1vw,.84rem);
          color:rgba(244,244,246,.3); line-height:1.75; font-weight:300;
        }
        .ab-values-grid {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:1px; background:rgba(255,255,255,0.04);
        }
        .ab-value-card {
          background:#06060a;
          padding:clamp(1.5rem,3vh,2.8rem) clamp(1rem,2vw,2rem);
          position:relative; overflow:hidden;
          transition:background .4s,transform .4s cubic-bezier(.16,1,.3,1);
          cursor:default;
        }
        .ab-value-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
          background:linear-gradient(to right,#e8192c,rgba(201,168,76,.5),transparent);
          transform:scaleX(0); transform-origin:left;
          transition:transform .5s cubic-bezier(.16,1,.3,1);
        }
        .ab-value-card:hover { background:rgba(232,25,44,0.04); transform:translateY(-4px); }
        .ab-value-card:hover::after { transform:scaleX(1); }
        .ab-value-card:hover .ab-value-icon { transform:scale(1.2) rotate(15deg); filter:drop-shadow(0 0 8px rgba(232,25,44,.7)); }
        .ab-value-icon {
          font-size:1.2rem; color:#e8192c; margin-bottom:1.2rem; display:block;
          transition:transform .4s,filter .4s; filter:drop-shadow(0 0 4px rgba(232,25,44,.4));
        }
        .ab-value-title {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(.75rem,1.3vw,1rem); font-weight:700;
          color:rgba(244,244,246,.85); margin-bottom:.8rem; line-height:1.2;
        }
        .ab-value-desc {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.62rem,.92vw,.76rem);
          color:rgba(244,244,246,.32); line-height:1.7; font-weight:300;
        }

        /* FOUNDER */
        .ab-founder {
          position:relative; z-index:5;
          border-top:1px solid rgba(255,255,255,0.04);
          display:grid; grid-template-columns:1fr 1fr;
        }
        .ab-founder-left {
          padding:clamp(3rem,7vh,7rem) clamp(1.5rem,6vw,7rem);
          border-right:1px solid rgba(255,255,255,0.04);
          display:flex; flex-direction:column; justify-content:center;
          background:rgba(232,25,44,0.02);
        }
        .ab-avatar-wrap {
          width:clamp(80px,12vw,140px); height:clamp(80px,12vw,140px);
          position:relative; margin-bottom:2rem; flex-shrink:0;
        }
        .ab-avatar {
          width:100%; height:100%; border-radius:50%;
          background:linear-gradient(135deg,rgba(232,25,44,0.3),rgba(201,168,76,0.2));
          border:1.5px solid rgba(232,25,44,0.3);
          display:flex; align-items:center; justify-content:center;
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.2rem,2.5vw,2rem); font-weight:900;
          color:rgba(244,244,246,.5); position:relative; z-index:1;
          transition:border-color .4s,box-shadow .4s;
        }
        .ab-avatar-ring {
          position:absolute; inset:-8px; border-radius:50%;
          border:1px solid rgba(232,25,44,0.2);
          animation:rotSlow 12s linear infinite;
        }
        .ab-avatar-wrap:hover .ab-avatar {
          border-color:rgba(232,25,44,0.7); box-shadow:0 0 30px rgba(232,25,44,0.25);
        }
        .ab-founder-name {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.4rem,3vw,2.6rem); font-weight:900;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 55%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:.3rem;
        }
        .ab-founder-role {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.42rem,.75vw,.58rem);
          letter-spacing:.3em; text-transform:uppercase;
          color:#e8192c; margin-bottom:1.5rem;
        }
        .ab-founder-bio {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.7rem,1.05vw,.86rem);
          color:rgba(244,244,246,.35); line-height:1.85;
          font-weight:300; max-width:440px;
        }
        .ab-founder-bio strong { color:rgba(244,244,246,.65); font-weight:500; }
        .ab-founder-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:1.8rem; }
        .ab-founder-tag {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.68vw,.52rem);
          letter-spacing:.12em; text-transform:uppercase;
          padding:5px 13px; border-radius:100px;
          border:1px solid rgba(232,25,44,.2);
          color:rgba(244,244,246,.4); background:rgba(232,25,44,.03);
          opacity:0; animation:tagPop .4s cubic-bezier(.16,1,.3,1) forwards;
          transition:border-color .3s,background .3s,color .3s,transform .25s; cursor:default;
        }
        .ab-founder-tag:hover {
          border-color:rgba(232,25,44,.7); background:rgba(232,25,44,.1);
          color:rgba(244,244,246,.85); transform:translateY(-2px);
        }
        .ab-founder-right {
          padding:clamp(3rem,7vh,7rem) clamp(1.5rem,6vw,7rem);
          display:flex; flex-direction:column; gap:clamp(1.5rem,3vh,3rem); justify-content:center;
        }

        /* TEAM CARDS */
        .ab-team-card {
          display:flex; gap:clamp(1rem,2vw,1.8rem); align-items:flex-start;
          padding:clamp(1rem,2vh,1.8rem) clamp(1rem,2vw,1.8rem);
          border:1px solid rgba(255,255,255,0.05); border-radius:8px;
          background:rgba(255,255,255,0.015);
          transition:border-color .35s,background .35s,transform .35s cubic-bezier(.16,1,.3,1);
          cursor:default;
        }
        .ab-team-card:hover {
          border-color:rgba(232,25,44,.3); background:rgba(232,25,44,.04); transform:translateX(6px);
        }
        .ab-team-avatar {
          width:clamp(36px,5vw,52px); height:clamp(36px,5vw,52px);
          border-radius:50%; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(.6rem,1.1vw,.85rem); font-weight:700;
          color:rgba(244,244,246,.6); border:1px solid rgba(232,25,44,.25);
          transition:border-color .35s;
        }
        .ab-team-card:hover .ab-team-avatar { border-color:rgba(232,25,44,.6); }
        .ab-team-name {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(.75rem,1.3vw,1rem); font-weight:700;
          color:rgba(244,244,246,.8); margin-bottom:.25rem;
        }
        .ab-team-role {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.65vw,.5rem);
          letter-spacing:.28em; text-transform:uppercase;
          color:rgba(232,25,44,.7); margin-bottom:.5rem;
        }
        .ab-team-bio {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.6rem,.9vw,.74rem);
          color:rgba(244,244,246,.28); line-height:1.65; font-weight:300;
        }

        /* CTA */
        .ab-cta {
          position:relative; z-index:5;
          border-top:1px solid rgba(255,255,255,0.04);
          padding:clamp(4rem,10vh,9rem) clamp(1.5rem,6vw,7rem);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          text-align:center; overflow:hidden;
        }
        .ab-cta-bg {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(232,25,44,0.06) 0%,transparent 70%);
        }
        .ab-cta-label {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.4rem,.75vw,.56rem);
          letter-spacing:.5em; text-transform:uppercase;
          color:rgba(232,25,44,.55); margin-bottom:1.2rem; position:relative; z-index:1;
        }
        .ab-cta-headline {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2rem,5.5vw,5rem); font-weight:900;
          line-height:.95; letter-spacing:-.01em;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:1.5rem; position:relative; z-index:1;
        }
        .ab-cta-sub {
          font-family:'Outfit',sans-serif;
          font-size:clamp(.7rem,1.1vw,.88rem);
          color:rgba(244,244,246,.3); line-height:1.7;
          max-width:480px; margin-bottom:3rem; font-weight:300; position:relative; z-index:1;
        }
        .ab-cta-btns { display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; position:relative; z-index:1; }
        .ab-btn-primary {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.48rem,.88vw,.66rem);
          letter-spacing:.3em; text-transform:uppercase;
          padding:clamp(13px,1.6vw,17px) clamp(24px,3.5vw,40px);
          background:#e8192c; color:#fff; border:none; border-radius:3px;
          cursor:pointer; text-decoration:none; position:relative; overflow:hidden;
          transition:box-shadow .35s,transform .25s;
        }
        .ab-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
          transform:translateX(-100%); transition:transform .5s;
        }
        .ab-btn-primary:hover { box-shadow:0 0 40px rgba(232,25,44,0.5); transform:translateY(-2px); }
        .ab-btn-primary:hover::before { transform:translateX(100%); }
        .ab-btn-secondary {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.48rem,.88vw,.66rem);
          letter-spacing:.3em; text-transform:uppercase;
          padding:clamp(13px,1.6vw,17px) clamp(24px,3.5vw,40px);
          background:transparent; color:rgba(244,244,246,.65);
          border:1px solid rgba(232,25,44,.3); border-radius:3px;
          cursor:pointer; text-decoration:none; position:relative; overflow:hidden;
          transition:border-color .35s,color .35s,box-shadow .35s,transform .25s;
        }
        .ab-btn-secondary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(232,25,44,0.1),transparent);
          transform:translateX(-100%); transition:transform .5s;
        }
        .ab-btn-secondary:hover {
          border-color:rgba(232,25,44,.8); color:#fff;
          box-shadow:0 0 24px rgba(232,25,44,0.15); transform:translateY(-2px);
        }
        .ab-btn-secondary:hover::before { transform:translateX(100%); }

        /* CORNER MARKS */
        .ab-corner {
          position:absolute; width:16px; height:16px;
          border-color:rgba(232,25,44,.2); border-style:solid; pointer-events:none;
        }

        /* DIFFERENTIATOR ROWS */
        .ab-diff-row {
          display:flex; align-items:center; gap:1rem;
          background:#06060a; cursor:default;
          transition:background .3s,padding-left .3s;
        }
        .ab-diff-row:hover { background:rgba(232,25,44,0.04); padding-left:1.5rem; }

        /* RESPONSIVE */
        @media(max-width:900px) {
          .ab-hero { grid-template-columns:1fr !important; }
          .ab-hero-right { align-items:flex-start; }
          .ab-hero-desc { text-align:left; }
          .ab-story { grid-template-columns:1fr !important; }
          .ab-story-left { border-right:none; border-bottom:1px solid rgba(255,255,255,0.04); }
          .ab-values-grid { grid-template-columns:1fr 1fr !important; }
          .ab-values-header { grid-template-columns:1fr !important; }
          .ab-founder { grid-template-columns:1fr !important; }
          .ab-founder-left { border-right:none; border-bottom:1px solid rgba(255,255,255,0.04); }
        }
        @media(max-width:580px) {
          .ab-values-grid { grid-template-columns:1fr !important; }
          .ab-stats-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      <section id="about-sec" ref={secRef}>

        <div className="ab-grid-bg"/>
        <div className="ab-scan"/>

        {/* ══ HERO ══ */}
        <div className="ab-hero">
          <div className="ab-corner" style={{ top:'1.4rem', left:'1.4rem', borderWidth:'1.5px 0 0 1.5px' }}/>
          <div className="ab-corner" style={{ top:'1.4rem', right:'1.4rem', borderWidth:'1.5px 1.5px 0 0' }}/>

          <div>
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line"/>
              About Hexalogic
            </div>
            <h2 className="ab-headline">
              We Build<br/>
              <span className="ab-headline-outline">Things That</span>
              Matter.
            </h2>
          </div>

          <div className="ab-hero-right">
            <p className="ab-hero-desc">
              A boutique digital studio obsessed with craft, speed, and outcomes.
              We don&apos;t just deliver — we architect experiences that outlast trends.
            </p>
            <span className="ab-since">Est. 2021 &middot; Karachi, PK</span>
          </div>
        </div>

        {/* ══ MARQUEE ══ */}
        <div className="ab-marquee-wrap">
          <div className="ab-marquee-track">
            {[...Array(2)].map((_, di) =>
              MARQUEE_ITEMS.map((item, i) => (
                <span key={`${di}-${i}`} className="ab-marquee-item">
                  {item}
                  <span className="ab-marquee-dot"/>
                </span>
              ))
            )}
          </div>
        </div>

        {/* ══ STORY + STATS ══ */}
        <div className="ab-story">
          <div className="ab-story-left">
            <div className="ab-story-num">06</div>
            <div className="ab-story-label">Our Story</div>
            <h3 className="ab-story-title">
              Born from<br/>frustration.<br/>Built with purpose.
            </h3>
            <div className="ab-story-rule"/>
            <p className="ab-story-body">
              Hexalogic started because we kept seeing the same problem —
              <strong> businesses with great ideas</strong> being let down by
              slow agencies, bloated teams, and work that looked good in decks
              but fell apart in production.
              <br/><br/>
              We built something different. A lean, senior-only studio where
              <strong> every project gets our full attention</strong>, strategy
              and execution live under one roof, and the work we ship is
              something we&apos;re genuinely proud to put our name on.
              <br/><br/>
              Three years in, over 50 projects across 12 industries —
              and we&apos;re still only taking on work we believe in.
            </p>
          </div>

          <div className="ab-story-right">
            <div ref={statsRef} className="ab-stats-grid">
              {STATS.map((s, i) => (
                <div key={i} className="ab-stat-cell">
                  <div className="ab-stat-num">
                    <AnimCounter target={s.num} suffix={s.suffix} active={statsVisible}/>
                  </div>
                  <div className="ab-stat-label">{s.label}</div>
                  <div className="ab-stat-accent-line"/>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(255,255,255,0.04)' }}>
              {DIFFERENTIATORS.map(([icon, text], i) => (
                <div key={i} className="ab-diff-row"
                  style={{ padding:'clamp(.8rem,1.5vh,1.3rem) clamp(1rem,2vw,1.8rem)' }}>
                  <span style={{ color:'#e8192c', fontSize:'.85rem', flexShrink:0,
                    filter:'drop-shadow(0 0 4px rgba(232,25,44,.5))' }}>{icon}</span>
                  <span style={{ fontFamily:"'Outfit',sans-serif",
                    fontSize:'clamp(.62rem,.92vw,.76rem)',
                    color:'rgba(244,244,246,.38)', fontWeight:300, lineHeight:1.5 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ VALUES ══ */}
        <div className="ab-values">
          <div className="ab-values-header">
            <h3 className="ab-values-headline">
              What We<br/>Stand For
            </h3>
            <p className="ab-values-sub">
              Four principles that shape every decision we make — from
              how we scope a project to how we handle a 2am bug report.
            </p>
          </div>
          <div className="ab-values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="ab-value-card">
                <span className="ab-value-icon">{v.icon}</span>
                <div className="ab-value-title">{v.title}</div>
                <p className="ab-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FOUNDER + TEAM ══ */}
        <div className="ab-founder">
          <div className="ab-founder-left">
            <div className="ab-avatar-wrap">
              <div className="ab-avatar-ring"/>
              <div className="ab-avatar">HR</div>
            </div>
            <div className="ab-founder-role">Founder &amp; Lead Developer</div>
            <div className="ab-founder-name">Hamza Raza</div>
            <p className="ab-founder-bio">
              Started coding at 16, obsessed with the gap between
              <strong> good-looking things</strong> and
              <strong> things that actually work</strong>.
              Built Hexalogic to close that gap permanently.
              <br/><br/>
              Full-stack across React, Next.js, Node, and everything in between.
              Believes the best digital product is one that feels so
              natural, the user never thinks about it.
            </p>
            <div className="ab-founder-tags">
              {FOUNDER_TAGS.map((tag, i) => (
                <span key={i} className="ab-founder-tag"
                  style={{ animationDelay:`${0.1 + i * 0.06}s` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="ab-founder-right">
            <div style={{ marginBottom:'clamp(.5rem,1vh,1rem)' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",
                fontSize:'clamp(.4rem,.72vw,.55rem)', letterSpacing:'.5em',
                textTransform:'uppercase', color:'rgba(232,25,44,.5)', marginBottom:'.6rem' }}>
                The Team
              </div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif",
                fontSize:'clamp(1rem,2.2vw,1.8rem)', fontWeight:900,
                background:'linear-gradient(160deg,#fff 0%,#f0cb6a 55%,#c9a84c 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Small by Design.<br/>Mighty by Choice.
              </div>
            </div>

            {TEAM.map((m, i) => (
              <div key={i} className="ab-team-card">
                <div className="ab-team-avatar"
                  style={{ background:`linear-gradient(135deg,${m.accent}33,${m.accent}0a)` }}>
                  {m.initials}
                </div>
                <div>
                  <div className="ab-team-name">{m.name}</div>
                  <div className="ab-team-role">{m.role}</div>
                  <div className="ab-team-bio">{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CTA ══ */}
        <div className="ab-cta">
          <div className="ab-cta-bg"/>
          <div className="ab-corner" style={{ top:'1.4rem', left:'1.4rem', borderWidth:'1.5px 0 0 1.5px' }}/>
          <div className="ab-corner" style={{ top:'1.4rem', right:'1.4rem', borderWidth:'1.5px 1.5px 0 0' }}/>
          <div className="ab-corner" style={{ bottom:'1.4rem', left:'1.4rem', borderWidth:'0 0 1.5px 1.5px' }}/>
          <div className="ab-corner" style={{ bottom:'1.4rem', right:'1.4rem', borderWidth:'0 1.5px 1.5px 0' }}/>

          <div className="ab-cta-label">Ready to Build?</div>
          <h2 className="ab-cta-headline">
            Let&apos;s Make<br/>Something Real.
          </h2>
          <p className="ab-cta-sub">
            No lengthy proposals. No endless meetings. Just a quick conversation
            about what you&apos;re building — and whether we&apos;re the right team to build it.
          </p>
          <div className="ab-cta-btns">
            <a href="#contact" className="ab-btn-primary">Start a Project &#8599;</a>
            <a href="#work" className="ab-btn-secondary">See Our Work</a>
          </div>
        </div>

      </section>
    </>
  )
}