"use client";
import { useEffect, useRef, useState } from "react";
import ServicesSection from "./components/ServicesSection";
import WorkSection from "./components/WorkSection";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const kbHangerRef = useRef<HTMLDivElement>(null);
  const kbSceneRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const logoEl = logoRef.current;
    const overlay = overlayRef.current;
    const navbar = navbarRef.current;
    if (!logoEl || !overlay || !navbar) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const T = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.push(t);
      return t;
    };

    // ── Intro: fade in logo
    T(() => {
      logoEl.style.transition = "opacity 0.9s ease";
      logoEl.style.opacity = "1";
    }, 200);

    // ── Intro: fly logo to nav position
    T(() => {
      logoEl.style.transition = [
        "opacity 1s ease",
        "transform 1.2s cubic-bezier(0.4,0,0.2,1)",
        "font-size 1.2s cubic-bezier(0.4,0,0.2,1)",
        "letter-spacing 1.2s ease",
        "filter 1s ease",
      ].join(",");
      logoEl.style.transform = "translateY(-82vh) translateX(-38vw)";
      logoEl.style.fontSize = "clamp(0.82rem,1.9vw,1.25rem)";
      logoEl.style.letterSpacing = "0.14em";
      logoEl.style.filter = "drop-shadow(0 0 8px rgba(201,168,76,0.3))";
    }, 1050);

    // ── Reveal navbar, dissolve overlay
    T(() => {
      navbar.classList.add("visible");
      overlay.style.transition = "opacity 0.8s ease";
      overlay.style.opacity = "0";
      T(() => {
        overlay.style.display = "none";
      }, 850);
    }, 2150);

    // ── Start keyboard float
    T(() => {
      kbHangerRef.current?.classList.add("afloat");
    }, 5800);

    // ── Key light-up: H→E→X→A→L→O→G→I→C then loop
    const seq = ["H", "E", "X", "A", "L", "O", "G", "I", "C"];
    const keyId: Record<string, string> = {
      H: "key-H",
      E: "key-E",
      X: "key-X",
      A: "key-A",
      L: "key-L",
      O: "key-O",
      G: "key-G",
      I: "key-I",
      C: "key-C",
    };
    const GAP = 450;
    const HOLD = 1800;
    const T0 = 5500;

    const runSeq = (delay: number, loop: boolean) => {
      seq.forEach((ltr, i) => {
        const el = document.getElementById(keyId[ltr]);
        if (!el) return;
        T(
          () => {
            el.classList.add("lit");
            if (i === 0) kbSceneRef.current?.classList.add("glowing");
          },
          delay + i * GAP,
        );
        if (loop) {
          T(
            () => {
              el.classList.remove("lit");
              if (i === seq.length - 1)
                kbSceneRef.current?.classList.remove("glowing");
            },
            delay + i * GAP + HOLD,
          );
        }
      });
    };

    runSeq(T0, false);

    const firstEnd = T0 + (seq.length - 1) * GAP + 1200;
    const loopPeriod = seq.length * GAP + HOLD + 600;

    T(() => {
      seq.forEach((l) =>
        document.getElementById(keyId[l])?.classList.remove("lit"),
      );
      kbSceneRef.current?.classList.remove("glowing");
      const loop = () => {
        runSeq(0, true);
        T(loop, loopPeriod);
      };
      loop();
    }, firstEnd + 400);

    // ── Active nav on scroll
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              navLinks.forEach((a) => a.classList.remove("active"));
              document
                .querySelector<HTMLAnchorElement>(
                  `.nav-link[href="#${e.target.id}"]`,
                )
                ?.classList.add("active");
            }
          });
        },
        { threshold: 0.4 },
      );
      obs.observe(s);
      observers.push(obs);
    });

    return () => {
      timers.forEach(clearTimeout);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <>
      {/* ── INTRO OVERLAY ── */}
      <div id="intro-overlay" ref={overlayRef}>
        <div id="logo-intro" ref={logoRef}>
          HEXALOGIC
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav id="navbar" ref={navbarRef}>
        <a href="#home" className="nav-logo">
          Hexalogic
        </a>

        <div className="nav-pill">
          <a href="#services" className="nav-link">
            Services
          </a>
          <a href="#work" className="nav-link">
            Work
          </a>
          <a href="#process" className="nav-link">
            Process
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </div>

        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div id="mobile-menu" className={menuOpen ? "open" : ""}>
        <button className="menu-close" onClick={closeMenu} aria-label="Close">
          ✕
        </button>
        {["home", "services", "work", "process", "about", "contact"].map(
          (id) => (
            <a key={id} href={`#${id}`} onClick={closeMenu}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ),
        )}
      </div>

      {/* ── HERO ── */}
      <section id="home">
        <p className="hero-tag">Website Proposal Specialists</p>
        <h1 className="hero-h1">We Build Your Digital World.</h1>

        {/* KB SCENE */}
        <div id="kb-scene" ref={kbSceneRef}>
          <div id="kb-hanger" ref={kbHangerRef}>
            {/* ROPES */}
            <div className="ropes-wrap">
              <div className="rope" />
              <div className="rope" />
            </div>

            {/* KEYBOARD */}
            <div id="kb-wrap">
              <div className="keyboard">
                {/* F-ROW */}
                <div
                  className="key-row"
                  style={{ marginBottom: "clamp(4px,0.9vw,8px)" }}
                >
                  <div className="key fn kw12">
                    <div className="kf">Esc</div>
                  </div>
                  <div
                    className="key fn"
                    style={{ marginLeft: "clamp(4px,0.8vw,8px)" }}
                  >
                    <div className="kf">F1</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F2</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F3</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F4</div>
                  </div>
                  <div
                    className="key fn"
                    style={{ marginLeft: "clamp(3px,0.6vw,6px)" }}
                  >
                    <div className="kf">F5</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F6</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F7</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F8</div>
                  </div>
                  <div
                    className="key fn"
                    style={{ marginLeft: "clamp(3px,0.6vw,6px)" }}
                  >
                    <div className="kf">F9</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F10</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F11</div>
                  </div>
                  <div className="key fn">
                    <div className="kf">F12</div>
                  </div>
                </div>

                {/* NUMBER ROW */}
                <div className="key-row">
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">~</span>
                        <span className="sb">`</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">!</span>
                        <span className="sb">1</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">@</span>
                        <span className="sb">2</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">#</span>
                        <span className="sb">3</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">$</span>
                        <span className="sb">4</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">%</span>
                        <span className="sb">5</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">^</span>
                        <span className="sb">6</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">&amp;</span>
                        <span className="sb">7</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">*</span>
                        <span className="sb">8</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">(</span>
                        <span className="sb">9</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">)</span>
                        <span className="sb">0</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">_</span>
                        <span className="sb">-</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">+</span>
                        <span className="sb">=</span>
                      </div>
                    </div>
                  </div>
                  <div className="key kw18">
                    <div className="kf">⌫</div>
                  </div>
                </div>

                {/* QWERTY */}
                <div className="key-row">
                  <div className="key kw15">
                    <div className="kf">Tab</div>
                  </div>
                  <div className="key" id="key-Q">
                    <div className="kf">Q</div>
                  </div>
                  <div className="key" id="key-W">
                    <div className="kf">W</div>
                  </div>
                  <div className="key" id="key-E">
                    <div className="kf">E</div>
                  </div>
                  <div className="key" id="key-R">
                    <div className="kf">R</div>
                  </div>
                  <div className="key" id="key-T">
                    <div className="kf">T</div>
                  </div>
                  <div className="key" id="key-Y">
                    <div className="kf">Y</div>
                  </div>
                  <div className="key" id="key-U">
                    <div className="kf">U</div>
                  </div>
                  <div className="key" id="key-I">
                    <div className="kf">I</div>
                  </div>
                  <div className="key" id="key-O">
                    <div className="kf">O</div>
                  </div>
                  <div className="key" id="key-P">
                    <div className="kf">P</div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">{"{"}</span>
                        <span className="sb">[</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">{"}"}</span>
                        <span className="sb">]</span>
                      </div>
                    </div>
                  </div>
                  <div className="key kw15">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">|</span>
                        <span className="sb">\</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ASDF */}
                <div className="key-row">
                  <div className="key kw18">
                    <div className="kf">Caps</div>
                  </div>
                  <div className="key" id="key-A">
                    <div className="kf">A</div>
                  </div>
                  <div className="key" id="key-S">
                    <div className="kf">S</div>
                  </div>
                  <div className="key" id="key-D">
                    <div className="kf">D</div>
                  </div>
                  <div className="key" id="key-F">
                    <div className="kf">F</div>
                  </div>
                  <div className="key" id="key-G">
                    <div className="kf">G</div>
                  </div>
                  <div className="key" id="key-H">
                    <div className="kf">H</div>
                  </div>
                  <div className="key" id="key-J">
                    <div className="kf">J</div>
                  </div>
                  <div className="key" id="key-K">
                    <div className="kf">K</div>
                  </div>
                  <div className="key" id="key-L">
                    <div className="kf">L</div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">:</span>
                        <span className="sb">;</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">&quot;</span>
                        <span className="sb">&apos;</span>
                      </div>
                    </div>
                  </div>
                  <div className="key kw25">
                    <div className="kf">Enter</div>
                  </div>
                </div>

                {/* ZXCV */}
                <div className="key-row">
                  <div className="key kw25">
                    <div className="kf">Shift</div>
                  </div>
                  <div className="key" id="key-Z">
                    <div className="kf">Z</div>
                  </div>
                  <div className="key" id="key-X">
                    <div className="kf">X</div>
                  </div>
                  <div className="key" id="key-C">
                    <div className="kf">C</div>
                  </div>
                  <div className="key" id="key-V">
                    <div className="kf">V</div>
                  </div>
                  <div className="key" id="key-B">
                    <div className="kf">B</div>
                  </div>
                  <div className="key" id="key-N">
                    <div className="kf">N</div>
                  </div>
                  <div className="key" id="key-M">
                    <div className="kf">M</div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">&lt;</span>
                        <span className="sb">,</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">&gt;</span>
                        <span className="sb">.</span>
                      </div>
                    </div>
                  </div>
                  <div className="key">
                    <div className="kf">
                      <div className="ks">
                        <span className="st">?</span>
                        <span className="sb">/</span>
                      </div>
                    </div>
                  </div>
                  <div className="key kw25">
                    <div className="kf">Shift</div>
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="key-row">
                  <div className="key kw15">
                    <div className="kf">Ctrl</div>
                  </div>
                  <div className="key kw12">
                    <div className="kf">Win</div>
                  </div>
                  <div className="key kw15">
                    <div className="kf">Alt</div>
                  </div>
                  <div className="key ksp">
                    <div className="kf" />
                  </div>
                  <div className="key kw15">
                    <div className="kf">Alt</div>
                  </div>
                  <div className="key kw12">
                    <div className="kf">Fn</div>
                  </div>
                  <div className="key kw15">
                    <div className="kf">Ctrl</div>
                  </div>
                </div>
              </div>
              {/* /keyboard */}
            </div>
            {/* /kb-wrap */}
          </div>
          {/* /kb-hanger */}
        </div>
        {/* /kb-scene */}

        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── OTHER SECTIONS ── */}
      <ServicesSection />
      <WorkSection />

      {[
        { id: "process", tag: "How We Build", title: "Process" },
        { id: "about", tag: "Who We Are", title: "About" },
        { id: "contact", tag: "Let's Talk", title: "Contact" },
      ].map((s) => (
        <section key={s.id} id={s.id} className="page">
          <div style={{ textAlign: "center" }}>
            <p className="page-tag">{s.tag}</p>
            <h2 className="page-title">{s.title}</h2>
          </div>
        </section>
      ))}
    </>
  );
}
