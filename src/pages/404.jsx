import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Particle spark ─────────────────────────────────────────── */
function useFireCanvas(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ember particles */
    const embers = Array.from({ length: 120 }, () => spawn(canvas));

    function spawn(c, fromBottom = false) {
      const x = Math.random() * c.width;
      return {
        x,
        y: fromBottom ? c.height + 10 : Math.random() * c.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 2.5 + 1),
        size: Math.random() * 3 + 1,
        life: Math.random(),
        maxLife: Math.random() * 0.6 + 0.4,
        hue: Math.random() * 40 + 10, // 10-50 → orange-yellow
      };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embers.forEach((e, i) => {
        e.x  += e.vx;
        e.y  += e.vy;
        e.vy -= 0.03; // accelerate upward
        e.vx += (Math.random() - 0.5) * 0.15;
        e.life += 0.008;

        if (e.life > e.maxLife || e.y < -10) {
          embers[i] = spawn(canvas, true);
          return;
        }

        const alpha = 1 - e.life / e.maxLife;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, ${60 + alpha * 30}%, ${alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 60%, ${alpha * 0.8})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

/* ── Animated 404 digits ─────────────────────────────────────── */
function BurningDigit({ char, delay = 0 }) {
  return (
    <span
      className="burning-digit"
      style={{ animationDelay: `${delay}s` }}
    >
      {char}
    </span>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function NotFound() {
  const canvasRef = useRef(null);
  const navigate  = useNavigate();
  const [count, setCount] = useState(8);

  useFireCanvas(canvasRef);

  /* countdown to redirect */
  useEffect(() => {
    if (count <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <>
      {/* ── inline styles (no Tailwind dependency for this page) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600&display=swap');

        .nf-root {
          position: relative;
          min-height: 100dvh;
          background: #0a0501;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          color: #f5e6d0;
        }

        /* ember canvas */
        .nf-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* radial glow floor */
        .nf-root::before {
          content: '';
          position: absolute;
          bottom: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 80vw;
          height: 40vh;
          background: radial-gradient(ellipse at center bottom,
            rgba(255,100,10,0.35) 0%,
            rgba(200,40,0,0.15) 40%,
            transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 2.5s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          from { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
          to   { opacity: 1;   transform: translateX(-50%) scaleX(1.08); }
        }

        /* ── content wrapper ── */
        .nf-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
          padding: 2rem;
        }

        /* ── 404 heading ── */
        .nf-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(7rem, 22vw, 16rem);
          line-height: 0.9;
          letter-spacing: 0.05em;
          background: linear-gradient(180deg,
            #fff8e1 0%,
            #ffcc44 25%,
            #ff7a00 55%,
            #cc2200 80%,
            #5a0a00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(255,120,0,0.6))
                  drop-shadow(0 0 60px rgba(255,60,0,0.35));
          display: flex;
          gap: 0.05em;
          user-select: none;
        }

        /* each digit: shimmer + flicker */
        .burning-digit {
          display: inline-block;
          animation: flicker 1.8s ease-in-out infinite alternate,
                     shimmer 3s ease-in-out infinite;
        }

        @keyframes flicker {
          0%   { filter: brightness(1)   drop-shadow(0 0 20px rgba(255,140,0,0.9)); }
          25%  { filter: brightness(1.1) drop-shadow(0 0 35px rgba(255,80,0,1)); }
          50%  { filter: brightness(0.9) drop-shadow(0 0 15px rgba(200,40,0,0.7)); }
          75%  { filter: brightness(1.2) drop-shadow(0 0 40px rgba(255,160,0,1)); }
          100% { filter: brightness(1)   drop-shadow(0 0 25px rgba(255,100,0,0.8)); }
        }

        @keyframes shimmer {
          0%, 100% { background-position: center top; }
          50%       { background-position: center 30%; }
        }

        /* ── fire SVG waves at bottom of the 404 text ── */
        .nf-flames {
          width: clamp(300px, 60vw, 700px);
          margin-top: -2.5rem;
          filter: drop-shadow(0 0 12px rgba(255,100,0,0.7));
          animation: swayFlames 2s ease-in-out infinite alternate;
        }

        @keyframes swayFlames {
          from { transform: scaleX(1)    scaleY(1); }
          to   { transform: scaleX(1.04) scaleY(1.03); }
        }

        /* ── subtitle ── */
        .nf-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #d4956a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          animation: fadeUp 0.8s ease both;
          animation-delay: 0.3s;
        }

        .nf-body {
          max-width: 38ch;
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          color: #9a7060;
          line-height: 1.6;
          animation: fadeUp 0.8s ease both;
          animation-delay: 0.5s;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── countdown bar ── */
        .nf-countdown-wrap {
          width: clamp(200px, 40vw, 340px);
          animation: fadeUp 0.8s ease both;
          animation-delay: 0.7s;
        }

        .nf-countdown-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #7a5040;
          margin-bottom: 0.4rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .nf-bar-bg {
          height: 6px;
          background: rgba(255,255,255,0.07);
          border-radius: 999px;
          overflow: hidden;
        }

        .nf-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff4500, #ffbb00);
          box-shadow: 0 0 8px rgba(255,100,0,0.7);
          transition: width 0.9s linear;
        }

        /* ── buttons ── */
        .nf-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.8s ease both;
          animation-delay: 0.9s;
        }

        .nf-btn {
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .nf-btn:hover  { transform: translateY(-2px); }
        .nf-btn:active { transform: translateY(0); }

        .nf-btn-primary {
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          color: #fff;
          box-shadow: 0 4px 20px rgba(255,80,0,0.45);
        }
        .nf-btn-primary:hover {
          box-shadow: 0 6px 28px rgba(255,80,0,0.65);
        }

        .nf-btn-ghost {
          background: rgba(255,255,255,0.05);
          color: #c8896a;
          border: 1px solid rgba(255,120,0,0.2);
        }
        .nf-btn-ghost:hover {
          background: rgba(255,120,0,0.1);
          border-color: rgba(255,120,0,0.4);
        }

        /* ── smoke wisps at top ── */
        .nf-smoke {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 35%;
          background: linear-gradient(to bottom,
            rgba(10,5,1,0.9) 0%,
            transparent 100%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="nf-root">
        <canvas ref={canvasRef} className="nf-canvas" />
        <div className="nf-smoke" />

        <div className="nf-content">
          {/* ── big 404 ── */}
          <div className="nf-headline" aria-label="404">
            <BurningDigit char="4" delay={0} />
            <BurningDigit char="0" delay={0.25} />
            <BurningDigit char="4" delay={0.5} />
          </div>

          {/* inline SVG fire waves */}
          <svg
            className="nf-flames"
            viewBox="0 0 700 80"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fg1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffdd44" stopOpacity="0.9"/>
                <stop offset="60%" stopColor="#ff5500" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#cc1100" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="fg2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fff0a0" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#ff8800" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#cc1100" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* back flame layer */}
            <path
              fill="url(#fg1)"
              d="M0,80 C30,40 60,10 90,35 C120,60 150,5 180,30
                 C210,55 240,0  270,25 C300,50 330,5  360,30
                 C390,55 420,0  450,25 C480,50 510,10 540,35
                 C570,60 600,5  630,30 C660,55 680,20 700,40 L700,80 Z"
            />
            {/* front flame layer */}
            <path
              fill="url(#fg2)"
              d="M0,80 C20,55 50,20 80,45 C110,70 140,15 170,40
                 C200,65 230,10 260,35 C290,60 320,15 350,40
                 C380,65 410,10 440,35 C470,60 500,20 530,45
                 C560,70 590,15 620,40 C650,65 675,30 700,50 L700,80 Z"
            />
          </svg>

          <p className="nf-subtitle">Página no encontrada</p>
          <p className="nf-body">
            Esta ruta se incendió antes de que pudieras llegar.
            El sistema SIFIRE no pudo localizar lo que buscas.
          </p>

          {/* countdown */}
          <div className="nf-countdown-wrap">
            <div className="nf-countdown-label">
              <span>Redirigiendo al inicio</span>
              <span>{count}s</span>
            </div>
            <div className="nf-bar-bg">
              <div
                className="nf-bar-fill"
                style={{ width: `${(count / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* actions */}
          <div className="nf-actions">
            <button className="nf-btn nf-btn-primary" onClick={() => navigate("/")}>
              🏠 Volver al inicio
            </button>
            <button className="nf-btn nf-btn-ghost" onClick={() => navigate(-1)}>
              ← Página anterior
            </button>
          </div>
        </div>
      </div>
    </>
  );
}