'use client'
import { useState, useRef, useCallback } from 'react'

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
  { icon: '◈', title: 'UI/UX Design',      desc: 'Interfaces people love to use' },
  { icon: '⬡', title: 'Logo Design',       desc: 'Marks that define your identity' },
  { icon: '◉', title: 'Web App Design',    desc: 'Complex flows made intuitive' },
  { icon: '◈', title: 'Website Design',    desc: 'Visual stories that convert' },
  { icon: '⬡', title: 'Mobile App Design', desc: 'Thumb-friendly, gorgeous UX' },
  { icon: '◉', title: 'Brand Systems',     desc: 'Cohesive visual language' },
]

export default function ServicesSection() {
  const [tab, setTab]           = useState<'dev' | 'des'>('dev')
  const [phase, setPhase]       = useState<'idle' | 'out' | 'in'>('idle')
  const [rendered, setRendered] = useState<'dev' | 'des'>('dev')
  const busy = useRef(false)

  const switchTab = useCallback((next: 'dev' | 'des') => {
    if (next === tab || busy.current) return
    busy.current = true
    setTab(next)
    setPhase('out')
    setTimeout(() => {
      setRendered(next)
      setPhase('in')
      setTimeout(() => { setPhase('idle'); busy.current = false }, 400)
    }, 180)
  }, [tab])

  const services  = rendered === 'dev' ? DEV_SERVICES : DES_SERVICES
  const isDev     = tab === 'dev'
  const accent    = isDev ? '#e8192c' : '#c9a84c'
  const aRGB      = isDev ? '232,25,44' : '201,168,76'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;700&display=swap');

        @keyframes s-scan   { from{top:-1px} to{top:100%} }
        @keyframes s-blink  { 0%,100%{opacity:.12} 50%{opacity:.45} }
        @keyframes s-in     { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes s-out    { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(-16px) scale(.97)} }
        @keyframes s-fadein { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes s-pop    { from{opacity:0;transform:translateY(14px) scale(.95)} to{opacity:1;transform:none} }
        @keyframes s-ul     { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes s-lbl    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        @keyframes s-rule   { from{width:0;opacity:0} to{opacity:1} }
        @keyframes s-num    { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:none} }

        #svc {
          position:relative; background:#06060a; overflow:hidden;
          padding:clamp(4rem,9vh,7rem) clamp(1.5rem,5vw,5rem);
          background-image:
            radial-gradient(ellipse 65% 50% at 50% 0%,  rgba(232,25,44,0.05) 0%,transparent 70%),
            radial-gradient(ellipse 45% 38% at 80% 95%, rgba(201,168,76,0.04) 0%,transparent 65%);
        }
        #svc::before {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px);
          background-size:28px 28px;
          mask-image:radial-gradient(ellipse 88% 88% at 50% 50%,black 25%,transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 88% 88% at 50% 50%,black 25%,transparent 100%);
        }
        #s-scan {
          position:absolute; left:0; right:0; height:1px; top:0; z-index:2; pointer-events:none;
          background:linear-gradient(to right,transparent,rgba(232,25,44,0.08),transparent);
          animation:s-scan 14s linear infinite;
        }
        .s-cm { position:absolute; width:16px; height:16px; border-color:rgba(232,25,44,0.18); border-style:solid; z-index:3; pointer-events:none; }
        .s-tl { top:1.4rem; left:1.4rem;  border-width:1px 0 0 1px; }
        .s-tr { top:1.4rem; right:1.4rem; border-width:1px 1px 0 0; }
        .s-bl { bottom:1.4rem; left:1.4rem;  border-width:0 0 1px 1px; }
        .s-br { bottom:1.4rem; right:1.4rem; border-width:0 1px 1px 0; }

        #s-inner {
          position:relative; z-index:5; max-width:1100px; margin:0 auto;
          display:flex; flex-direction:column; align-items:center; text-align:center;
        }

        .s-eyebrow {
          display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:.9rem;
          animation:s-lbl .5s cubic-bezier(.16,1,.3,1) both;
        }
        .s-ey-line { width:26px; height:1px; flex-shrink:0; }
        .s-ey-text {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.42rem,.76vw,.58rem); letter-spacing:.5em; text-transform:uppercase;
        }

        .s-h1 {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(2.4rem,5.8vw,5.2rem); font-weight:900; line-height:1.02; letter-spacing:-.01em;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:.7rem; filter:drop-shadow(0 0 32px rgba(201,168,76,0.12));
          animation:s-lbl .5s .05s cubic-bezier(.16,1,.3,1) both;
        }

        .s-sub {
          font-family:'Outfit',sans-serif; font-size:clamp(.72rem,1.1vw,.88rem);
          color:rgba(244,244,246,.28); line-height:1.75; max-width:500px; font-weight:300;
          margin-bottom:2.5rem;
          animation:s-lbl .5s .1s cubic-bezier(.16,1,.3,1) both;
        }

        #s-tabs {
          display:flex; align-items:center; margin-bottom:2.2rem;
          border:1px solid rgba(255,255,255,0.07); border-radius:7px; overflow:hidden;
          background:rgba(255,255,255,0.025); backdrop-filter:blur(10px);
        }
        .s-tab {
          padding:clamp(9px,1.3vw,13px) clamp(22px,3.2vw,40px);
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.42rem,.75vw,.58rem); letter-spacing:.28em; text-transform:uppercase;
          cursor:pointer; border:none; background:transparent; color:rgba(244,244,246,.28);
          transition:background .3s,color .3s; position:relative;
        }
        .s-tab-sep { width:1px; height:24px; flex-shrink:0; background:rgba(255,255,255,0.07); align-self:center; }
        .s-tab.act { color:#fff; }
        .s-tab.t-dev.act { background:rgba(232,25,44,0.12); }
        .s-tab.t-des.act { background:rgba(201,168,76,0.10); }
        .s-tab.act::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
          transform-origin:left; animation:s-ul .4s cubic-bezier(.16,1,.3,1) forwards;
        }
        .s-tab.t-dev.act::after { background:#e8192c; }
        .s-tab.t-des.act::after { background:#c9a84c; }
        .s-tab:not(.act):hover { background:rgba(255,255,255,0.04); color:rgba(244,244,246,.5); }

        .s-meta {
          display:flex; align-items:center; justify-content:center; gap:14px;
          margin-bottom:.5rem; animation:s-lbl .35s cubic-bezier(.16,1,.3,1) both;
        }
        .s-meta-dash { width:20px; height:1px; flex-shrink:0; }
        .s-meta-lbl {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.68vw,.54rem); letter-spacing:.45em; text-transform:uppercase;
        }

        .s-sec-title {
          font-family:'Cinzel Decorative',serif;
          font-size:clamp(1.1rem,2.4vw,2.1rem); font-weight:900;
          background:linear-gradient(160deg,#fff 0%,#f0cb6a 52%,#c9a84c 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:1rem; animation:s-lbl .35s .04s cubic-bezier(.16,1,.3,1) both;
        }

        .s-rule {
          height:2px; border-radius:1px; margin-bottom:2rem;
          animation:s-rule .6s .1s cubic-bezier(.16,1,.3,1) both;
        }

        /* count badge e.g. "08 services" */
        .s-count {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(.38rem,.65vw,.52rem); letter-spacing:.25em; text-transform:uppercase;
          color:rgba(244,244,246,.22); margin-bottom:1.5rem;
          animation:s-num .4s .12s cubic-bezier(.16,1,.3,1) both;
        }
        .s-count span { font-weight:700; }

        /* cards wrapper */
        .s-wrap { width:100%; }
        .s-wrap.out    { animation:s-out    .18s cubic-bezier(.4,0,1,1) forwards; }
        .s-wrap.fadein { animation:s-fadein .38s cubic-bezier(.16,1,.3,1) forwards; }

        /* grid */
        .s-grid {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:clamp(8px,1.1vw,13px);
        }

        /* card */
        .s-card {
          display:flex; gap:11px; align-items:flex-start;
          padding:clamp(12px,1.5vw,18px); border-radius:10px;
          backdrop-filter:blur(12px); text-align:left; cursor:default;
          opacity:0; animation:s-pop .4s cubic-bezier(.16,1,.3,1) forwards;
          transition:border-color .3s,background .3s,box-shadow .3s,transform .28s;
          position:relative; overflow:hidden;
        }
        /* shimmer on hover */
        .s-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.04) 50%,transparent 60%);
          transform:translateX(-100%); transition:transform .5s;
        }
        .s-card:hover::before { transform:translateX(100%); }
        .s-card:hover {
          transform:translateY(-4px) !important;
          box-shadow:0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .s-card:hover .s-icon { transform:scale(1.18) rotate(8deg); }
        .s-card:hover .s-title { color:rgba(244,244,246,1); }

        .s-icon {
          font-size:.9rem; flex-shrink:0; margin-top:2px;
          transition:transform .32s cubic-bezier(.16,1,.3,1);
        }
        .s-title {
          font-family:'Outfit',sans-serif; font-weight:600;
          font-size:clamp(.63rem,1.05vw,.82rem);
          color:rgba(244,244,246,.85); letter-spacing:.01em;
          transition:color .25s;
        }
        .s-desc {
          font-size:clamp(.53rem,.84vw,.68rem);
          color:rgba(244,244,246,.28); margin-top:3px; line-height:1.48;
        }

        /* index number on card */
        .s-card-num {
          position:absolute; top:10px; right:12px;
          font-family:'JetBrains Mono',monospace;
          font-size:.46rem; letter-spacing:.15em; color:rgba(255,255,255,0.07);
          pointer-events:none; user-select:none;
        }

        .s-hint {
          margin-top:3rem;
          font-family:'JetBrains Mono',monospace;
          font-size:.46rem; letter-spacing:.3em; text-transform:uppercase;
          color:rgba(244,244,246,.15); animation:s-blink 3.2s ease-in-out infinite;
        }

        @media(max-width:960px) { .s-grid{grid-template-columns:repeat(3,1fr)!important;} }
        @media(max-width:680px) { .s-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:440px) { .s-grid{grid-template-columns:1fr!important;} }
      `}</style>

      <section id="svc">
        <div id="s-scan"/>
        <div className="s-cm s-tl"/><div className="s-cm s-tr"/>
        <div className="s-cm s-bl"/><div className="s-cm s-br"/>

        <div id="s-inner">

          <div className="s-eyebrow">
            <div className="s-ey-line" style={{ background: accent }}/>
            <span className="s-ey-text" style={{ color: accent }}>What We Do</span>
            <div className="s-ey-line" style={{ background: accent }}/>
          </div>

          <h2 className="s-h1">Services</h2>

          <p className="s-sub">
            From big ideas to fine details — we design, build &amp; ship digital
            products that move businesses forward.
          </p>

          <div id="s-tabs">
            <button
              className={`s-tab t-dev${isDev ? ' act' : ''}`}
              onClick={() => switchTab('dev')}
            >
              ⟨/⟩&nbsp; Development
            </button>
            <div className="s-tab-sep"/>
            <button
              className={`s-tab t-des${!isDev ? ' act' : ''}`}
              onClick={() => switchTab('des')}
            >
              ✦&nbsp; Design
            </button>
          </div>

          <div key={tab + '-meta'} className="s-meta">
            <div className="s-meta-dash" style={{ background: accent }}/>
            <span className="s-meta-lbl" style={{ color: accent }}>
              {isDev ? '01 — Build' : '02 — Craft'}
            </span>
            <div className="s-meta-dash" style={{ background: accent }}/>
          </div>

          <h3 key={tab + '-title'} className="s-sec-title">
            {isDev ? 'Development' : 'Design'}
          </h3>

          <div
            key={tab + '-rule'}
            className="s-rule"
            style={{
              width: '48px',
              background: `linear-gradient(to right,${accent},rgba(201,168,76,0.35))`,
            }}
          />

          <p key={tab + '-count'} className="s-count">
            <span>{String(services.length).padStart(2, '0')}</span> services available
          </p>

          <div className={`s-wrap${phase === 'out' ? ' out' : phase === 'in' ? ' fadein' : ''}`}>
            <div className="s-grid">
              {services.map((s, i) => (
                <div
                  key={`${rendered}-${i}`}
                  className="s-card"
                  style={{
                    animationDelay: `${i * 0.045}s`,
                    border:     `1px solid rgba(${aRGB},0.13)`,
                    background: `rgba(${aRGB},0.04)`,
                  }}
                >
                  <span
                    className="s-icon"
                    style={{
                      color:  accent,
                      filter: `drop-shadow(0 0 5px rgba(${aRGB},0.6))`,
                    }}
                  >
                    {s.icon}
                  </span>
                  <div>
                    <div className="s-title">{s.title}</div>
                    <div className="s-desc">{s.desc}</div>
                  </div>
                  <span className="s-card-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="s-hint">↓ Scroll to explore more</p>

        </div>
      </section>
    </>
  )
}