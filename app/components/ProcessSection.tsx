'use client'
import { useEffect, useRef } from 'react'

/* ─────────────── STEPS DATA ─────────────── */
const STEPS = [
  {
    num: '01', phase: 'PHASE ONE', title: 'Discovery', sub: '& Strategy',
    desc: 'We start by listening. Deep discovery sessions uncover your goals, audience, and competitive landscape. We map out the full picture before writing a single line of code.',
    details: ['Stakeholder interviews', 'Market & competitor analysis', 'User persona mapping', 'Technical requirements scoping', 'Timeline & milestone planning'],
    icon: 'discover', accent: '#e8192c',
  },
  {
    num: '02', phase: 'PHASE TWO', title: 'Design', sub: '& Wireframing',
    desc: 'Ideas become blueprints. We craft pixel-precise wireframes and high-fidelity mockups that balance beauty with function. Every screen is intentional, every interaction considered.',
    details: ['Information architecture', 'Low & high fidelity wireframes', 'UI component system', 'Prototype & user flow', 'Client review & refinement'],
    icon: 'design', accent: '#c9963b',
  },
  {
    num: '03', phase: 'PHASE THREE', title: 'Development', sub: '& Engineering',
    desc: 'Clean code, bold execution. Our engineers bring designs to life with modern frameworks, scalable architecture, and obsessive attention to performance and accessibility.',
    details: ['Frontend & backend engineering', 'API design & integration', 'Database architecture', 'Performance optimization', 'Code reviews & documentation'],
    icon: 'dev', accent: '#e8192c',
  },
  {
    num: '04', phase: 'PHASE FOUR', title: 'Testing', sub: '& Quality Assurance',
    desc: 'Nothing ships broken. Rigorous QA across devices, browsers, and edge cases ensures your product performs flawlessly when it matters most.',
    details: ['Cross-browser & device testing', 'Performance & load testing', 'Security vulnerability audit', 'Accessibility compliance', 'Bug tracking & resolution'],
    icon: 'test', accent: '#c9963b',
  },
  {
    num: '05', phase: 'PHASE FIVE', title: 'Launch', sub: '& Deployment',
    desc: 'Go live with confidence. We handle every detail of the deployment — domain, hosting, CI/CD pipelines, and monitoring — so your launch is smooth and your uptime rock-solid.',
    details: ['Server & hosting setup', 'CI/CD pipeline configuration', 'DNS & SSL management', 'Analytics & tracking setup', 'Soft launch & go-live support'],
    icon: 'launch', accent: '#e8192c',
  },
  {
    num: '06', phase: 'PHASE SIX', title: 'Growth', sub: '& Ongoing Support',
    desc: "We don't disappear after launch. Continuous monitoring, rapid updates, and strategic improvements keep your product ahead of the curve and your users delighted.",
    details: ['Performance monitoring', 'Feature updates & iterations', 'SEO & conversion optimization', 'Monthly reporting & insights', 'Priority support channel'],
    icon: 'growth', accent: '#c9963b',
  },
]

/* ─────────────── 3D BG OBJECTS CANVAS ─────────────── */
function BgObjects({ stepIdx }: { stepIdx: number }) {
  const cvs = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const t   = useRef(0)
  const mx  = useRef(0.5)
  const my  = useRef(0.5)
  const smx = useRef(0.5) // smoothed mouse
  const smy = useRef(0.5)

  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth  * Math.min(devicePixelRatio, 2)
      H = canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      mx.current = e.clientX / window.innerWidth
      my.current = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouse)

    /* ── 3D maths ── */
    const rot3 = (x: number, y: number, z: number, rx: number, ry: number) => {
      // Y-axis
      const x1 =  x * Math.cos(ry) + z * Math.sin(ry)
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
      // X-axis
      const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx)
      return { x: x1, y: y2, z: z2 }
    }
    const proj = (x: number, y: number, z: number, cx: number, cy: number, fov = 420) => {
      const d = fov / (fov + z + 200)
      return { px: cx + x * d, py: cy + y * d, d }
    }

    // object definitions — each has position, scale, type, speed, phase offset
    const objects = [
      { ox: -0.35, oy: -0.22, type: 'torus',       scale: 0.28, speed: 0.006, phase: 0,    tiltX: 0.4, tiltY: 0.6 },
      { ox:  0.38, oy:  0.18, type: 'icosahedron',  scale: 0.22, speed: 0.008, phase: 1.2,  tiltX: 0.3, tiltY: 0.5 },
      { ox: -0.28, oy:  0.32, type: 'octahedron',   scale: 0.18, speed: 0.005, phase: 2.4,  tiltX: 0.5, tiltY: 0.4 },
      { ox:  0.30, oy: -0.30, type: 'cube',         scale: 0.20, speed: 0.007, phase: 3.6,  tiltX: 0.4, tiltY: 0.7 },
      { ox: -0.42, oy:  0.05, type: 'tetrahedron',  scale: 0.16, speed: 0.009, phase: 0.8,  tiltX: 0.6, tiltY: 0.3 },
      { ox:  0.44, oy: -0.05, type: 'diamond',      scale: 0.19, speed: 0.006, phase: 4.8,  tiltX: 0.35, tiltY: 0.55 },
    ]

    const drawTorus = (ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, r: number, rx: number, ry: number, col: string, alpha: number) => {
      const SO = 36, SI = 18
      const pts: Array<{px:number,py:number,z:number,fi:number}> = []
      for (let i = 0; i < SO; i++) {
        const u = (i / SO) * Math.PI * 2
        for (let j = 0; j < SI; j++) {
          const v  = (j / SI) * Math.PI * 2
          const x0 = (R + r * Math.cos(v)) * Math.cos(u)
          const y0 = (R + r * Math.cos(v)) * Math.sin(u)
          const z0 = r * Math.sin(v)
          const p  = rot3(x0, y0, z0, rx, ry)
          const pp = proj(p.x, p.y, p.z, cx, cy)
          pts.push({ px: pp.px, py: pp.py, z: pp.d, fi: i / SO })
        }
      }
      pts.sort((a, b) => a.z - b.z)
      pts.forEach(({ px, py, z, fi }) => {
        const bright = (z - 0.5) * 1.6
        const sz     = Math.max(0.3, z * 2.5)
        ctx.beginPath()
        ctx.arc(px, py, sz, 0, Math.PI * 2)
        ctx.fillStyle = fi < 0.5 ? `${col}${Math.floor(Math.max(0.05, bright) * alpha * 255).toString(16).padStart(2,'0')}`
                                  : `rgba(255,255,255,${Math.max(0.02, bright * 0.3 * alpha)})`
        ctx.fill()
      })
    }

    const drawPoly = (ctx: CanvasRenderingContext2D, cx: number, cy: number, verts: number[][], faces: number[][], rx: number, ry: number, col: string, alpha: number) => {
      const pverts = verts.map(([x,y,z]) => {
        const p  = rot3(x, y, z, rx, ry)
        return proj(p.x, p.y, p.z, cx, cy)
      })
      faces
        .map(f => ({ f, avgZ: f.reduce((s,i) => s + pverts[i].d, 0) / f.length }))
        .sort((a,b) => a.avgZ - b.avgZ)
        .forEach(({ f, avgZ }) => {
          const bright = Math.max(0, (avgZ - 0.7) * 3)
          const pts2 = f.map(i => pverts[i])
          ctx.beginPath()
          ctx.moveTo(pts2[0].px, pts2[0].py)
          pts2.slice(1).forEach(p => ctx.lineTo(p.px, p.py))
          ctx.closePath()
          ctx.fillStyle   = `${col}${Math.floor((0.04 + bright * 0.12) * alpha * 255).toString(16).padStart(2,'0')}`
          ctx.strokeStyle = `${col}${Math.floor((0.15 + bright * 0.35) * alpha * 255).toString(16).padStart(2,'0')}`
          ctx.lineWidth   = 0.8
          ctx.fill(); ctx.stroke()
        })
    }

    const icosaVerts = (() => {
      const phi = (1 + Math.sqrt(5)) / 2
      const raw = [[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]]
      return raw.map(([x,y,z]) => { const l=Math.sqrt(x*x+y*y+z*z); return [x/l,y/l,z/l] })
    })()
    const icosaFaces = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]]

    const octaVerts = [[0,-1,0],[0,1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]]
    const octaFaces = [[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,4,2],[1,3,4],[1,5,3],[1,2,5]]

    const cubeVerts = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]
    const cubeFaces = [[0,1,2,3],[4,7,6,5],[0,4,5,1],[2,6,7,3],[0,3,7,4],[1,5,6,2]]

    const tetraVerts = [[0,1,0],[-0.816,-0.333,0.471],[0.816,-0.333,0.471],[0,-0.333,-0.943]]
    const tetraFaces = [[0,1,2],[0,2,3],[0,3,1],[1,3,2]]

    const diamondVerts = [[0,1.3,0],[0,-1.3,0],[0.9,0,0.4],[-0.9,0,0.4],[0.9,0,-0.4],[-0.9,0,-0.4]]
    const diamondFaces = [[0,2,3],[0,3,5],[0,5,4],[0,4,2],[1,3,2],[1,5,3],[1,4,5],[1,2,4]]

    /* accent color per step */
    const ACCENTS = STEPS.map(s => s.accent)

    const draw = () => {
      t.current += 1
      const T = t.current

      // smooth mouse
      smx.current += (mx.current - smx.current) * 0.04
      smy.current += (my.current - smy.current) * 0.04

      ctx.clearRect(0, 0, W, H)

      const stepAcc = ACCENTS[stepIdx] ?? '#e8192c'
      const isGold  = stepAcc === '#c9963b'

      objects.forEach((obj, oi) => {
        const CX = W * (0.5 + obj.ox)
        const CY = H * (0.5 + obj.oy)
        const S  = Math.min(W, H) * obj.scale
        const RX = T * obj.speed * obj.tiltX + obj.phase + (smy.current - 0.5) * 0.5
        const RY = T * obj.speed * obj.tiltY + obj.phase + (smx.current - 0.5) * 0.5

        // alternating accent per object
        const acc = oi % 2 === 0 ? '#e8192c' : '#c9963b'
        // alpha fades in on mount, breathes gently
        const alpha = 0.5 + Math.sin(T * 0.015 + oi * 1.1) * 0.12

        // subtle outer glow
        const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, S * 1.6)
        grd.addColorStop(0, acc + '10')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(CX - S*2, CY - S*2, S*4, S*4)

        if (obj.type === 'torus') {
          drawTorus(ctx, CX, CY, S * 0.7, S * 0.28, RX, RY, acc, alpha)
        } else if (obj.type === 'icosahedron') {
          drawPoly(ctx, CX, CY, icosaVerts.map(([x,y,z]) => [x*S,y*S,z*S]), icosaFaces, RX, RY, acc, alpha)
        } else if (obj.type === 'octahedron') {
          drawPoly(ctx, CX, CY, octaVerts.map(([x,y,z]) => [x*S,y*S,z*S]), octaFaces, RX, RY, acc, alpha)
        } else if (obj.type === 'cube') {
          drawPoly(ctx, CX, CY, cubeVerts.map(([x,y,z]) => [x*S,y*S,z*S]), cubeFaces, RX, RY, acc, alpha)
        } else if (obj.type === 'tetrahedron') {
          drawPoly(ctx, CX, CY, tetraVerts.map(([x,y,z]) => [x*S,y*S,z*S]), tetraFaces, RX, RY, acc, alpha)
        } else if (obj.type === 'diamond') {
          drawPoly(ctx, CX, CY, diamondVerts.map(([x,y,z]) => [x*S,y*S,z*S]), diamondFaces, RX, RY, acc, alpha)
        }
      })

      raf.current = requestAnimationFrame(draw)
    }

    raf.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [stepIdx])

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
        opacity: 0.55,
        transition: 'opacity 1s ease',
      }}
    />
  )
}

/* ─────────────── STEP CANVAS VISUALS ─────────────── */
function StepCanvas({ icon, accent, visible }: { icon: string; accent: string; visible: boolean }) {
  const cvs = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const t   = useRef(0)

  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth  * Math.min(devicePixelRatio, 2)
      H = canvas.height = canvas.offsetHeight * Math.min(devicePixelRatio, 2)
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas)

    const r2h = (hex: string) => {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
      return `${r},${g},${b}`
    }
    const rgb = r2h(accent)

    const draw = () => {
      t.current++
      const T = t.current
      // guard: skip frame if canvas not yet sized
      if (W < 4 || H < 4) { raf.current = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2

      if (icon === 'discover') {
        for (let i = 4; i >= 1; i--) {
          const r = (W * 0.38) * (i / 4)
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${rgb},${0.08 + (i===4?0.06:0)})`
          ctx.lineWidth = i === 4 ? 1.5 : 0.8; ctx.stroke()
        }
        const angle = (T * 0.025) % (Math.PI * 2)
        ctx.save(); ctx.translate(cx, cy)
        for (let a = 0; a < 60; a++) {
          const ang = angle - (a / 60) * (Math.PI * 0.7)
          const op  = (1 - a / 60) * 0.3
          ctx.beginPath(); ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(ang) * W * 0.38, Math.sin(ang) * W * 0.38)
          ctx.strokeStyle = `rgba(${rgb},${op})`; ctx.lineWidth = 2.5; ctx.stroke()
        }
        ctx.restore()
        ctx.beginPath(); ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * W * 0.38, cy + Math.sin(angle) * W * 0.38)
        ctx.strokeStyle = `rgba(${rgb},0.9)`; ctx.lineWidth = 1.5; ctx.stroke()
        ;(([[0.6,0.3],[0.2,0.6],[0.78,0.65]] as Array<[number,number]>)).forEach(([bx,by],i) => {
          const bpx = cx+(bx-0.5)*W*0.7, bpy = cy+(by-0.5)*H*0.7
          const pulse = Math.sin(T*0.08+i*2)*0.5+0.5
          const gd = ctx.createRadialGradient(bpx,bpy,0,bpx,bpy,12+pulse*8)
          gd.addColorStop(0,`rgba(${rgb},0.9)`); gd.addColorStop(1,'transparent')
          ctx.fillStyle=gd; ctx.beginPath(); ctx.arc(bpx,bpy,12+pulse*8,0,Math.PI*2); ctx.fill()
          ctx.beginPath(); ctx.arc(bpx,bpy,3,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},1)`; ctx.fill()
        })
        const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,10)
        cg.addColorStop(0,`rgba(${rgb},1)`); cg.addColorStop(1,'transparent')
        ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fill()
      }

      else if (icon === 'design') {
        const cols=7,rows=5,gw=W*0.72/cols,gh=H*0.72/rows
        const ox=(W-gw*cols)/2,oy=(H-gh*rows)/2
        for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
          const wave=Math.sin(T*0.04+c*0.6+r*0.8)*0.5+0.5
          const sz=gw*0.35*(0.3+wave*0.7)
          const px=ox+c*gw+gw/2,py=oy+r*gh+gh/2
          ctx.save(); ctx.translate(px,py); ctx.rotate(T*0.008+c*0.15+r*0.1)
          ctx.fillStyle=`rgba(${rgb},${0.05+wave*0.22})`
          ctx.strokeStyle=`rgba(${rgb},${0.1+wave*0.45})`; ctx.lineWidth=0.8
          ctx.fillRect(-sz/2,-sz/2,sz,sz); ctx.strokeRect(-sz/2,-sz/2,sz,sz)
          ctx.restore()
        }
        const cx2=cx+Math.sin(T*0.025)*W*0.18,cy2=cy+Math.cos(T*0.018)*H*0.14
        if (Math.sin(T*0.12)>0) { ctx.fillStyle=`rgba(${rgb},0.9)`; ctx.fillRect(cx2,cy2-14,2,28) }
        ctx.beginPath(); ctx.strokeStyle=`rgba(${rgb},0.12)`; ctx.lineWidth=1
        let sr=8
        for (let a=0;a<Math.PI*8;a+=0.06) {
          const sx=cx+Math.cos(a+T*0.005)*sr,sy=cy+Math.sin(a+T*0.005)*sr
          a===0?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy); sr+=0.9
        }
        ctx.stroke()
      }

      else if (icon === 'dev') {
        if (W < 10 || H < 10) { raf.current = requestAnimationFrame(draw); return }
        const cols2=Math.floor(W/22)
        for (let c=0;c<cols2;c++) {
          const yOff=((T*(0.8+(c%3)*0.4)+c*47)%(H+200))-100
          const chars=['0','1','{','}','<','>','/','=',';','(',')','.']
          for (let r=0;r<12;r++) {
            const alpha=(1-r/12)*0.55,ch=chars[(T+c*3+r*7)%chars.length]
            ctx.font=`${11*Math.min(devicePixelRatio,2)}px 'JetBrains Mono',monospace`
            ctx.fillStyle=r===0?`rgba(255,255,255,0.9)`:`rgba(${rgb},${alpha})`
            ctx.fillText(ch,c*22,yOff-r*18)
          }
        }
        const fw=W*0.7,fh=H*0.55,fx=(W-fw)/2,fy=(H-fh)/2
        if (fh < 80) { raf.current = requestAnimationFrame(draw); return }
        ctx.strokeStyle=`rgba(${rgb},0.3)`; ctx.lineWidth=1.2; ctx.strokeRect(fx,fy,fw,fh)
        ctx.fillStyle=`rgba(6,6,8,0.75)`; ctx.fillRect(fx,fy,fw,fh)
        ctx.fillStyle=`rgba(${rgb},0.18)`; ctx.fillRect(fx,fy,fw,22)
        const termDots: Array<[number,string]> = [[10,'232,25,44'],[24,'201,150,59'],[38,'80,200,80']]
        termDots.forEach(([x,col])=>{
          ctx.beginPath(); ctx.arc(fx+x,fy+11,5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${col},0.7)`; ctx.fill()
        })
        const lineY=fy+50+((T*0.4)%Math.max(1, fh-70))
        ctx.fillStyle=`rgba(${rgb},0.8)`
        ctx.fillRect(fx+16,lineY,Math.min(W*0.25+Math.sin(T*0.06)*W*0.08,fw-30),1.5)
        if (Math.sin(T*0.1)>0) {
          ctx.fillStyle=`rgba(${rgb},0.9)`
          ctx.fillRect(fx+16+Math.min(W*0.25+Math.sin(T*0.06)*W*0.08,fw-30),lineY-12,2,14)
        }
      }

      else if (icon === 'test') {
        for (let i=0;i<5;i++) {
          const delay=i*35,age=(T-delay+500)%200,prog=age/200,r=prog*W*0.42,op=(1-prog)*0.4
          ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
          ctx.strokeStyle=`rgba(${rgb},${op})`; ctx.lineWidth=1.5; ctx.stroke()
        }
        ctx.save(); ctx.translate(cx,cy)
        const sh=H*0.32,sw=sh*0.75
        ctx.beginPath(); ctx.moveTo(0,-sh)
        ctx.bezierCurveTo(sw,-sh,sw,0,0,sh*0.9); ctx.bezierCurveTo(-sw,0,-sw,-sh,0,-sh)
        ctx.strokeStyle=`rgba(${rgb},0.45)`; ctx.lineWidth=1.5; ctx.stroke()
        ctx.fillStyle=`rgba(${rgb},0.06)`; ctx.fill()
        const ck=Math.min(1,(T%180)/90)
        if (ck>0) {
          ctx.beginPath(); ctx.moveTo(-sw*0.35,0)
          const ex1=-sw*0.35+(sw*0.28)*Math.min(1,ck*2),ey1=(sh*0.25)*Math.min(1,ck*2)
          ctx.lineTo(ex1,ey1)
          if (ck>0.5) { const p2=(ck-0.5)*2; ctx.lineTo(ex1+(sw*0.55)*p2,ey1-(sh*0.5)*p2) }
          ctx.strokeStyle=`rgba(${rgb},0.9)`; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke()
        }
        ctx.restore()
      }

      else if (icon === 'launch') {
        if (W < 10 || H < 10) { raf.current = requestAnimationFrame(draw); return }
        const rx=cx+Math.sin(T*0.018)*W*0.08,ry=cy-H*0.08+Math.cos(T*0.014)*H*0.04
        for (let i=0;i<28;i++) {
          const age=((T+i*7)%90)/90,spread=age*W*0.12
          const px=rx+(Math.random()-0.5)*spread*2,py=ry+age*H*0.38
          const sz=Math.max(0.1,(1-age)*6)
          const g2=ctx.createRadialGradient(px,py,0,px,py,sz*3)
          g2.addColorStop(0,`rgba(${rgb},${(1-age)*0.8})`); g2.addColorStop(1,'transparent')
          ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(px,py,sz*3,0,Math.PI*2); ctx.fill()
        }
        ctx.save(); ctx.translate(rx,ry); ctx.rotate(Math.sin(T*0.018)*0.15)
        ctx.beginPath(); ctx.moveTo(0,-H*0.12)
        ctx.quadraticCurveTo(W*0.04,0,W*0.03,H*0.08); ctx.lineTo(-W*0.03,H*0.08)
        ctx.quadraticCurveTo(-W*0.04,0,0,-H*0.12)
        ctx.fillStyle=`rgba(244,244,246,0.15)`; ctx.fill()
        ctx.strokeStyle=`rgba(${rgb},0.6)`; ctx.lineWidth=1.2; ctx.stroke()
        ctx.beginPath(); ctx.arc(0,-H*0.02,Math.max(1,W*0.018),0,Math.PI*2)
        ctx.strokeStyle=`rgba(${rgb},0.8)`; ctx.lineWidth=1; ctx.stroke()
        const pulse2=Math.sin(T*0.08)*0.5+0.5
        ctx.fillStyle=`rgba(${rgb},${0.3+pulse2*0.5})`; ctx.fill()
        ctx.restore()
        ctx.beginPath(); ctx.ellipse(cx,cy+H*0.18,W*0.36,H*0.1,0,0,Math.PI*2)
        ctx.strokeStyle=`rgba(${rgb},0.12)`; ctx.lineWidth=1; ctx.stroke()
        const starPositions: Array<[number,number]> = [[.15,.18],[.82,.12],[.68,.78],[.22,.72],[.9,.5]]
        starPositions.forEach(([sx,sy],i)=>{
          const twink=Math.sin(T*0.07+i*1.8)*0.5+0.5
          ctx.beginPath(); ctx.arc(sx*W,sy*H,1.5+twink,0,Math.PI*2)
          ctx.fillStyle=`rgba(255,255,255,${0.3+twink*0.6})`; ctx.fill()
        })
      }

      else if (icon === 'growth') {
        const bars=[0.45,0.62,0.38,0.75,0.55,0.88,0.7]
        const bw=W*0.08,gap=W*0.032,totalW=bars.length*(bw+gap)-gap
        const startX=(W-totalW)/2,baseY=H*0.72
        bars.forEach((h,i)=>{
          const animated=h*Math.min(1,(T-i*8)/60),barH=animated*H*0.5,bx=startX+i*(bw+gap)
          const bg2=ctx.createLinearGradient(0,baseY-barH,0,baseY)
          bg2.addColorStop(0,`rgba(${rgb},0.5)`); bg2.addColorStop(1,`rgba(${rgb},0.05)`)
          ctx.fillStyle=bg2; ctx.fillRect(bx,baseY-barH,bw,barH)
          ctx.strokeStyle=`rgba(${rgb},0.4)`; ctx.lineWidth=.8; ctx.strokeRect(bx,baseY-barH,bw,barH)
          const cg2=ctx.createLinearGradient(0,baseY-barH-4,0,baseY-barH+4)
          cg2.addColorStop(0,'transparent'); cg2.addColorStop(.5,`rgba(${rgb},0.9)`); cg2.addColorStop(1,'transparent')
          ctx.fillStyle=cg2; ctx.fillRect(bx-2,baseY-barH-2,bw+4,4)
        })
        const pts2=bars.map((h,i)=>({x:startX+i*(bw+gap)+bw/2,y:baseY-h*H*0.5}))
        ctx.beginPath(); pts2.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y))
        ctx.strokeStyle=`rgba(${rgb},0.55)`; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([])
        const idx2=((T*0.04)%(bars.length-1)),idxF=Math.floor(idx2),frac=idx2-idxF
        if (pts2[idxF]&&pts2[idxF+1]) {
          const mx2=pts2[idxF].x+(pts2[idxF+1].x-pts2[idxF].x)*frac
          const my2=pts2[idxF].y+(pts2[idxF+1].y-pts2[idxF].y)*frac
          const dg2=ctx.createRadialGradient(mx2,my2,0,mx2,my2,16)
          dg2.addColorStop(0,`rgba(${rgb},0.8)`); dg2.addColorStop(1,'transparent')
          ctx.fillStyle=dg2; ctx.beginPath(); ctx.arc(mx2,my2,16,0,Math.PI*2); ctx.fill()
          ctx.beginPath(); ctx.arc(mx2,my2,4,0,Math.PI*2); ctx.fillStyle=`rgba(${rgb},1)`; ctx.fill()
        }
        const ax=cx,ay=H*0.14,pulse3=Math.sin(T*0.06)*0.5+0.5
        ctx.beginPath()
        ctx.moveTo(ax,ay); ctx.lineTo(ax-10,ay+18); ctx.lineTo(ax-4,ay+14)
        ctx.lineTo(ax-4,ay+40); ctx.lineTo(ax+4,ay+40); ctx.lineTo(ax+4,ay+14); ctx.lineTo(ax+10,ay+18); ctx.closePath()
        ctx.fillStyle=`rgba(${rgb},${0.4+pulse3*0.5})`; ctx.fill()
      }

      raf.current = requestAnimationFrame(draw)
    }

    if (visible) { t.current = 0; raf.current = requestAnimationFrame(draw) }
    else cancelAnimationFrame(raf.current)
    return () => { cancelAnimationFrame(raf.current); ro.disconnect() }
  }, [icon, accent, visible])

  return <canvas ref={cvs} style={{ position:'absolute',inset:0,width:'100%',height:'100%',display:'block' }}/>
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */
export default function ProcessSection() {
  const secRef   = useRef<HTMLElement>(null)
  const raf      = useRef<number>(0)
  const lastStep = useRef(-1)

  useEffect(() => {
    const tick = () => {
      const sec = secRef.current; if (!sec) { raf.current = requestAnimationFrame(tick); return }
      const rect  = sec.getBoundingClientRect()
      const total = sec.offsetHeight - window.innerHeight
      const p     = Math.max(0, Math.min(1, -rect.top / total))

      const stepP   = p * STEPS.length
      const stepIdx = Math.min(Math.floor(stepP), STEPS.length - 1)
      const stepFrac = stepP - Math.floor(stepP)

      if (stepIdx !== lastStep.current) {
        lastStep.current = stepIdx

        STEPS.forEach((_, i) => {
          const panel = document.getElementById(`proc-panel-${i}`)
          const dot   = document.getElementById(`proc-dot-${i}`)
          if (panel) {
            if (i === stepIdx) {
              panel.style.opacity      = '1'
              panel.style.transform    = 'translateY(0px) scale(1)'
              panel.style.pointerEvents = 'auto'
            } else {
              panel.style.opacity      = '0'
              panel.style.transform    = `translateY(${i < stepIdx ? '-28px' : '28px'}) scale(0.98)`
              panel.style.pointerEvents = 'none'
            }
          }
          if (dot) {
            dot.style.background     = i <= stepIdx ? 'var(--red)' : 'rgba(255,255,255,0.1)'
            dot.style.boxShadow      = i <= stepIdx ? '0 0 8px rgba(232,25,44,0.7)' : 'none'
            dot.style.transform      = i === stepIdx ? 'translate(-50%,-50%) scale(1.5)' : 'translate(-50%,-50%) scale(1)'
          }
        })

        // update step counter
        const ctr = document.getElementById('proc-step-ctr')
        if (ctr) ctr.textContent = String(stepIdx + 1).padStart(2,'0')
        // update bg accent class
        const sticky = document.getElementById('proc-sticky')
        if (sticky) {
          const acc = STEPS[stepIdx].accent
          sticky.style.setProperty('--current-accent', acc)
        }
      }

      // progress line
      const line = document.getElementById('proc-line-fill')
      if (line) {
        const pct = (stepIdx / (STEPS.length - 1)) * 100 + (stepFrac / (STEPS.length - 1)) * 100
        line.style.height = `${Math.min(pct, 100)}%`
      }

      // ghost number opacity
      const ghost = document.getElementById(`proc-ghost-${stepIdx}`)
      if (ghost) ghost.style.opacity = (0.04 + stepFrac * 0.06).toFixed(3)

      // scroll hint
      const si = document.getElementById('proc-scroll-hint')
      if (si) {
        const endFade = p > 0.88 ? 1 - (p - 0.88) / 0.12 : 1
        si.style.opacity = (p < 0.04 ? p / 0.04 : endFade).toFixed(3)
      }

      // progress bar
      const pf = document.getElementById('proc-prog-fill')
      if (pf) pf.style.width = `${((stepIdx + 1) / STEPS.length) * 100}%`

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <>
      <style>{`
        @keyframes procScan  { from{top:-2px} to{top:100%} }
        @keyframes procBlink { 0%,100%{opacity:.2} 50%{opacity:.65} }
        @keyframes accentPop { from{transform:scaleX(0)} to{transform:scaleX(1)} }

        :root { --red:#e8192c; --gold:#c9963b; }

        /* ── panel transition ── */
        .proc-panel {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          padding:clamp(1rem,4vw,4rem);
          opacity:0;
          transform:translateY(28px) scale(0.98);
          transition:
            opacity .6s cubic-bezier(.16,1,.3,1),
            transform .6s cubic-bezier(.16,1,.3,1);
          pointer-events:none;
        }

        /* ── detail items ── */
        .proc-detail-item {
          display:flex; align-items:center; gap:10px;
          padding:9px 0;
          border-bottom:1px solid rgba(255,255,255,0.04);
          color:rgba(244,244,246,0.38);
          font-family:'Outfit',sans-serif;
          font-size:clamp(.62rem,.9vw,.76rem);
          cursor:default;
          transition:color .3s, padding-left .3s, background .3s;
          border-radius:4px;
        }
        .proc-detail-item:last-child { border-bottom:none; }
        .proc-detail-item:hover {
          color:rgba(244,244,246,0.88);
          padding-left:8px;
          background:rgba(255,255,255,0.025);
        }
        .proc-detail-item:hover .proc-det-icon {
          filter:drop-shadow(0 0 5px currentColor);
          transform:scale(1.2) rotate(15deg);
        }
        .proc-det-icon {
          font-size:.65rem; flex-shrink:0;
          transition:filter .3s, transform .3s;
        }

        /* ── rule animation ── */
        .proc-rule {
          height:2px; width:45%; margin-bottom:clamp(.8rem,1.8vh,1.4rem);
          border-radius:1px; transform-origin:left;
          transition:width .5s cubic-bezier(.16,1,.3,1);
        }
        .proc-panel[style*="opacity: 1"] .proc-rule { animation:accentPop .7s .15s cubic-bezier(.16,1,.3,1) both; }

        /* ── canvas visual ring hover ── */
        .proc-canvas-wrap {
          position:relative; aspect-ratio:1/1;
          max-width:380px; width:100%; margin:0 auto;
          transition:transform .5s cubic-bezier(.16,1,.3,1);
        }
        .proc-canvas-wrap:hover { transform:scale(1.03) rotate(1deg); }
        .proc-canvas-wrap:hover .proc-ring-outer { border-color:rgba(232,25,44,0.35) !important; }

        /* ── phase label hover ── */
        .proc-phase-label {
          display:flex; align-items:center; gap:12px;
          margin-bottom:clamp(.6rem,1.4vh,1.2rem);
          transition:gap .3s;
        }
        .proc-phase-label:hover { gap:18px; }
        .proc-phase-line {
          height:1px; flex-shrink:0;
          transition:width .4s cubic-bezier(.16,1,.3,1);
          width:26px;
        }
        .proc-phase-label:hover .proc-phase-line { width:40px; }

        /* ── dot timeline dot pulse ── */
        #proc-dot-0,#proc-dot-1,#proc-dot-2,#proc-dot-3,#proc-dot-4,#proc-dot-5 {
          transition:background .4s ease, box-shadow .4s ease, transform .4s cubic-bezier(.16,1,.3,1);
        }

        @media(max-width:860px){
          .proc-inner{ grid-template-columns:1fr !important; }
          .proc-right{ display:none; }
          .proc-timeline{ display:none !important; }
        }
        @media(max-width:540px){
          .proc-panel{ padding:4.5rem 1.2rem 5rem; }
        }
      `}</style>

      <section id="process" ref={secRef} style={{ height:`${STEPS.length * 100}vh`, position:'relative' }}>
        <div id="proc-sticky" style={{
          position:'sticky', top:0, height:'100vh', overflow:'hidden', background:'#060608',
          '--current-accent': '#e8192c',
        } as React.CSSProperties}>

          {/* ── 3D BG OBJECTS ── */}
          <BgObjects stepIdx={0} />

          {/* ── ambient bg glow (transitions with accent) ── */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
            background:'radial-gradient(ellipse 60% 55% at 50% 50%,rgba(232,25,44,0.04) 0%,transparent 70%)' }}/>

          {/* ── grain texture ── */}
          <div style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none', opacity:.038,
            backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize:'200px 200px' }}/>

          {/* ── scan line ── */}
          <div style={{ position:'absolute', left:0, right:0, height:1, top:0, zIndex:6, pointerEvents:'none',
            background:'linear-gradient(to right,transparent,rgba(232,25,44,0.09),transparent)',
            animation:'procScan 12s linear infinite' }}/>

          {/* ── corners ── */}
          {[{top:'1.4rem',left:'1.4rem',borderWidth:'1px 0 0 1px'},{top:'1.4rem',right:'1.4rem',borderWidth:'1px 1px 0 0'},
            {bottom:'1.4rem',left:'1.4rem',borderWidth:'0 0 1px 1px'},{bottom:'1.4rem',right:'1.4rem',borderWidth:'0 1px 1px 0'}].map((s,i)=>(
            <div key={i} style={{ position:'absolute', ...s as React.CSSProperties, width:18, height:18,
              borderColor:'rgba(232,25,44,0.18)', borderStyle:'solid', zIndex:10, pointerEvents:'none' }}/>
          ))}

          {/* ── TOPBAR ── */}
          <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:10,
            display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center',
            padding:'clamp(.9rem,2vw,1.6rem) clamp(1.2rem,3.5vw,3rem)',
            borderBottom:'1px solid rgba(255,255,255,0.032)',
            backdropFilter:'blur(2px)', pointerEvents:'none' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'clamp(.42rem,.72vw,.56rem)',
                letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(201,150,59,0.36)' }}>How We Work</span>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(.54rem,.9vw,.68rem)',
                color:'rgba(244,240,232,0.18)' }}>End-to-end excellence</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <span style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'clamp(.82rem,1.7vw,1.05rem)', fontWeight:700,
                background:'linear-gradient(135deg,#fff 0%,#f0cb6a 50%,#c9a84c 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Process</span>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(.54rem,.9vw,.68rem)',
                color:'rgba(244,240,232,0.18)', textAlign:'center' }}>6 phases · zero shortcuts</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2 }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'clamp(.42rem,.72vw,.56rem)',
                letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(201,150,59,0.36)' }}>Hexalogic</span>
              <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(.54rem,.9vw,.68rem)',
                color:'rgba(244,240,232,0.18)' }}>Est. 2021</span>
            </div>
          </div>

          {/* ── VERTICAL TIMELINE ── */}
          <div className="proc-timeline" style={{ position:'absolute', left:'clamp(1.6rem,3.5vw,4rem)',
            top:'12%', bottom:'12%', zIndex:8, display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ position:'relative', flex:1, width:2, background:'rgba(255,255,255,0.06)', borderRadius:1 }}>
              <div id="proc-line-fill" style={{ position:'absolute', top:0, left:0, right:0, height:'0%',
                background:'linear-gradient(to bottom,#e8192c,#c9963b)', borderRadius:1,
                transition:'height .3s ease', boxShadow:'0 0 10px rgba(232,25,44,0.5)' }}/>
              {STEPS.map((_,i)=>(
                <div key={i} id={`proc-dot-${i}`} style={{
                  position:'absolute', left:'50%', transform:'translate(-50%,-50%)',
                  top:`${(i/(STEPS.length-1))*100}%`,
                  width:10, height:10, borderRadius:'50%',
                  background:'rgba(255,255,255,0.1)', border:'1px solid rgba(232,25,44,0.3)',
                  zIndex:2,
                }}/>
              ))}
            </div>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ position:'absolute', top:`${(i/(STEPS.length-1))*100}%`,
                transform:'translateY(-50%)', left:16,
                fontFamily:"'JetBrains Mono',monospace", fontSize:'.46rem', letterSpacing:'.3em',
                color:'rgba(201,150,59,0.3)', whiteSpace:'nowrap' }}>{s.num}</div>
            ))}
          </div>

          {/* ── GHOST NUMBERS ── */}
          {STEPS.map((s,i)=>(
            <div key={i} id={`proc-ghost-${i}`} style={{
              position:'absolute', right:'-2%', top:'50%', transform:'translateY(-58%)',
              fontFamily:"'Cinzel Decorative',serif", fontSize:'clamp(9rem,20vw,18rem)', fontWeight:900, lineHeight:.85,
              color:'transparent', WebkitTextStroke:'1px rgba(201,150,59,0.09)',
              opacity:.04, pointerEvents:'none', userSelect:'none', transition:'opacity .5s ease', zIndex:4,
            }}>{s.num}</div>
          ))}

          {/* ── STEP PANELS ── */}
          {STEPS.map((s,i)=>(
            <div key={i} id={`proc-panel-${i}`} className="proc-panel"
              style={{ '--red':s.accent, '--acc':s.accent, zIndex:5 } as React.CSSProperties}>
              <div className="proc-inner" style={{
                display:'grid', gridTemplateColumns:'1fr 1fr',
                gap:'clamp(2rem,5vw,7rem)', maxWidth:980, width:'100%', alignItems:'center',
                paddingLeft:'clamp(2rem,5vw,6rem)',
              }}>

                {/* LEFT: text */}
                <div>
                  <div className="proc-phase-label">
                    <div className="proc-phase-line" style={{ background:s.accent }}/>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace",
                      fontSize:'clamp(.44rem,.76vw,.58rem)', letterSpacing:'.38em',
                      textTransform:'uppercase', color:s.accent }}>{s.phase}</span>
                  </div>

                  <h3 style={{ fontFamily:"'Cinzel Decorative',serif",
                    fontSize:'clamp(1.8rem,4vw,3.8rem)', fontWeight:900, lineHeight:1.04,
                    marginBottom:'.2rem',
                    background:'linear-gradient(160deg,#fff 0%,#f0cb6a 55%,#c9a84c 100%)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    {s.title}
                  </h3>
                  <h4 style={{ fontFamily:"'Cinzel Decorative',serif",
                    fontSize:'clamp(.9rem,2vw,1.8rem)', fontWeight:700, lineHeight:1.2,
                    color:s.accent, marginBottom:'clamp(.8rem,1.8vh,1.4rem)', fontStyle:'italic' }}>
                    {s.sub}
                  </h4>

                  <div className="proc-rule" style={{ background:`linear-gradient(to right,${s.accent},transparent)` }}/>

                  <p style={{ fontFamily:"'Outfit',sans-serif",
                    fontSize:'clamp(.68rem,.95vw,.84rem)', color:'rgba(244,244,246,0.32)',
                    lineHeight:1.9, maxWidth:400, marginBottom:'clamp(.8rem,1.8vh,1.5rem)', fontWeight:300 }}>
                    {s.desc}
                  </p>

                  <div style={{ borderLeft:`1.5px solid ${s.accent}33`, paddingLeft:'clamp(.8rem,1.5vw,1.2rem)' }}>
                    {s.details.map((d,di)=>(
                      <div key={di} className="proc-detail-item">
                        <span className="proc-det-icon" style={{ color:`${s.accent}88` }}>✦</span>
                        {d}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: canvas visual */}
                <div className="proc-right proc-canvas-wrap">
                  <div style={{ position:'absolute', inset:'-10%', borderRadius:'50%',
                    background:`radial-gradient(ellipse,${s.accent}08,transparent 70%)`, pointerEvents:'none' }}/>
                  <StepCanvas icon={s.icon} accent={s.accent} visible={true}/>
                  <div className="proc-ring-outer" style={{ position:'absolute', inset:0, borderRadius:'50%',
                    border:`1px solid ${s.accent}18`, pointerEvents:'none',
                    transition:'border-color .4s' }}/>
                  <div style={{ position:'absolute', inset:'8%', borderRadius:'50%',
                    border:`1px solid ${s.accent}09`, pointerEvents:'none' }}/>
                </div>
              </div>
            </div>
          ))}

          {/* ── SCROLL HINT ── */}
          <div id="proc-scroll-hint" style={{ position:'absolute', bottom:'clamp(1.2rem,2.5vh,2rem)',
            left:'50%', transform:'translateX(-50%)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:6,
            opacity:0, transition:'opacity .5s', zIndex:10, pointerEvents:'none' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.5rem',
              letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(74,74,90,0.5)',
              animation:'procBlink 2.5s ease-in-out infinite' }}>↓ Scroll through</span>
            <div style={{ width:1, height:26, background:'linear-gradient(to bottom,rgba(232,25,44,0.5),transparent)',
              animation:'procBlink 2.5s ease-in-out infinite' }}/>
          </div>

          {/* ── STEP COUNTER ── */}
          <div style={{ position:'absolute', right:'clamp(1.4rem,3vw,3rem)', bottom:'clamp(1.4rem,2.8vh,2.4rem)',
            zIndex:10, fontFamily:"'JetBrains Mono',monospace",
            color:'rgba(201,150,59,0.26)', fontSize:'.78rem', letterSpacing:'.06em',
            userSelect:'none', textAlign:'right' }}>
            <span style={{ fontFamily:"'Cinzel Decorative',serif",
              fontSize:'clamp(1.3rem,2.6vw,1.9rem)', color:'rgba(244,240,232,0.52)',
              display:'block', lineHeight:1, transition:'all .3s' }} id="proc-step-ctr">01</span>
            /{String(STEPS.length).padStart(2,'0')}
          </div>

          {/* ── PROGRESS BAR ── */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, zIndex:10,
            background:'rgba(255,255,255,0.04)' }}>
            <div id="proc-prog-fill" style={{ height:'100%', width:'0%',
              background:'linear-gradient(to right,#e8192c,#c9963b)',
              transition:'width .3s ease', boxShadow:'0 0 12px rgba(232,25,44,0.4)' }}/>
          </div>

        </div>
      </section>
    </>
  )
}