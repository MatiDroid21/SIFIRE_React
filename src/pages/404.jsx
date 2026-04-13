import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Sello SVG institucional ─────────────────────────────────── */
function SelloInstitucional() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sello SIFIRE"
      style={{ width: 90, height: 90 }}
    >
      {/* Círculo exterior */}
      <circle cx="60" cy="60" r="56" fill="none" stroke="#b22222" strokeWidth="3.5" />
      <circle cx="60" cy="60" r="48" fill="none" stroke="#b22222" strokeWidth="1" strokeDasharray="3 4" />
      {/* Cuerpo del sello */}
      <circle cx="60" cy="60" r="44" fill="#fff8f0" />
      {/* Cruz de bomberos */}
      <rect x="54" y="30" width="12" height="40" rx="3" fill="#b22222" />
      <rect x="30" y="54" width="60" height="12" rx="3" fill="#b22222" />
      {/* Llama pequeña */}
      <path
        d="M60 44 C57 36 63 28 60 22 C58 28 55 32 60 44Z"
        fill="#ff7a00"
        opacity="0.85"
      />
      {/* Texto circular superior */}
      <path id="arcTop" d="M 15,60 A 45,45 0 0,1 105,60" fill="none" />
      <text fontSize="7.5" fontFamily="'Georgia', serif" fill="#7a1a1a" fontWeight="600" letterSpacing="1.5">
        <textPath href="#arcTop" startOffset="8%">SISTEMA INTEGRADO DE INCENDIOS</textPath>
      </text>
      {/* Texto circular inferior */}
      <path id="arcBot" d="M 15,62 A 45,45 0 0,0 105,62" fill="none" />
      <text fontSize="7.5" fontFamily="'Georgia', serif" fill="#7a1a1a" fontWeight="600" letterSpacing="2">
        <textPath href="#arcBot" startOffset="22%">SIFIRE · CHILE</textPath>
      </text>
    </svg>
  );
}

/* ── Membrete de oficio ──────────────────────────────────────── */
function MembreteLinea() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      width: "100%", maxWidth: 540, marginBottom: 4,
    }}>
      <div style={{ flex: 1, height: 2, background: "#b22222" }} />
      <div style={{ width: 8, height: 8, background: "#b22222", borderRadius: "50%" }} />
      <div style={{ flex: 1, height: 2, background: "#b22222" }} />
    </div>
  );
}

/* ── Componente principal ────────────────────────────────────── */
export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(12);
  const [stamp, setStamp] = useState(false);

  /* Cuenta regresiva */
  useEffect(() => {
    if (count <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  /* Animación del sello al montar */
  useEffect(() => {
    const t = setTimeout(() => setStamp(true), 600);
    return () => clearTimeout(t);
  }, []);

  const today = new Date().toLocaleDateString("es-CL", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Inter:wght@400;500;600&display=swap');

        .muni-root {
          min-height: 100dvh;
          background: #f5f0e8;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(180,140,100,0.07) 28px),
            repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(180,140,100,0.07) 28px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Inter', sans-serif;
        }

        .muni-oficio {
          background: #fffdf7;
          border: 1px solid #d4b896;
          border-top: 5px solid #b22222;
          box-shadow:
            0 2px 8px rgba(0,0,0,0.10),
            0 12px 40px rgba(0,0,0,0.07),
            inset 0 0 0 6px rgba(178,34,34,0.03);
          width: 100%;
          max-width: 620px;
          padding: 2.5rem 2.8rem 2rem;
          position: relative;
          animation: aparece 0.5s ease both;
        }

        @keyframes aparece {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Marca de agua */
        .muni-oficio::before {
          content: 'SIFIRE';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 7rem;
          font-family: 'IM Fell English', serif;
          color: rgba(178,34,34,0.055);
          pointer-events: none;
          letter-spacing: 0.15em;
          white-space: nowrap;
          font-weight: 700;
          user-select: none;
        }

        .muni-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.4rem;
          gap: 1rem;
        }

        .muni-header-left {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .muni-org {
          font-family: 'IM Fell English', serif;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a1a1a;
        }

        .muni-titulo {
          font-family: 'IM Fell English', serif;
          font-size: 1.05rem;
          color: #2c1a1a;
          font-weight: 700;
          line-height: 1.3;
        }

        .muni-folio {
          font-size: 0.7rem;
          color: #9a7060;
          letter-spacing: 0.06em;
          margin-top: 0.25rem;
        }

        /* Sello con efecto stamp */
        .muni-sello-wrap {
          transition: transform 0.4s cubic-bezier(0.23,1.5,0.32,1), opacity 0.3s ease;
          transform: scale(${stamp ? "1" : "0.3"}) rotate(${stamp ? "-12" : "0"}deg);
          opacity: ${stamp ? "1" : "0"};
          flex-shrink: 0;
        }
        .muni-sello-wrap.visible {
          transform: scale(1) rotate(-12deg);
          opacity: 1;
        }

        .muni-divisor {
          height: 1px;
          background: linear-gradient(to right, #b22222, #d4b896 60%, transparent);
          margin: 0.8rem 0 1.2rem;
        }

        .muni-asunto-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9a7060;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .muni-asunto-valor {
          font-family: 'IM Fell English', serif;
          font-size: 1.0rem;
          color: #2c1a1a;
          margin-bottom: 1.2rem;
        }

        .muni-codigo {
          display: inline-block;
          background: #b22222;
          color: #fff;
          font-family: 'IM Fell English', serif;
          font-size: 4.5rem;
          line-height: 1;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.6rem;
          margin-bottom: 0.3rem;
        }

        .muni-cuerpo {
          font-size: 0.92rem;
          color: #3c2a1a;
          line-height: 1.75;
          margin-bottom: 1.4rem;
          border-left: 3px solid rgba(178,34,34,0.2);
          padding-left: 1rem;
        }

        .muni-cuerpo strong {
          color: #b22222;
        }

        .muni-tabla {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-bottom: 1.6rem;
          color: #4a3020;
        }
        .muni-tabla th {
          text-align: left;
          padding: 0.4rem 0.6rem;
          background: rgba(178,34,34,0.06);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.68rem;
          border-bottom: 1px solid #d4b896;
        }
        .muni-tabla td {
          padding: 0.4rem 0.6rem;
          border-bottom: 1px solid rgba(212,184,150,0.5);
        }
        .muni-tabla tr:last-child td { border-bottom: none; }

        .muni-countdown-label {
          font-size: 0.72rem;
          color: #9a7060;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.35rem;
          display: flex;
          justify-content: space-between;
        }

        .muni-barra-bg {
          height: 5px;
          background: rgba(178,34,34,0.1);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .muni-barra-fill {
          height: 100%;
          background: linear-gradient(90deg, #b22222, #e05020);
          border-radius: 999px;
          transition: width 0.95s linear;
        }

        .muni-acciones {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .muni-btn {
          padding: 0.55rem 1.3rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          font-family: 'Inter', sans-serif;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          letter-spacing: 0.02em;
        }
        .muni-btn:hover  { transform: translateY(-1px); }
        .muni-btn:active { transform: translateY(0); }

        .muni-btn-primary {
          background: #b22222;
          color: #fff;
          box-shadow: 0 2px 10px rgba(178,34,34,0.35);
        }
        .muni-btn-primary:hover { background: #8b1a1a; box-shadow: 0 4px 16px rgba(178,34,34,0.5); }

        .muni-btn-ghost {
          background: transparent;
          color: #7a4030;
          border: 1px solid #d4b896;
        }
        .muni-btn-ghost:hover { background: rgba(178,34,34,0.06); border-color: #b22222; }

        .muni-firma {
          margin-top: 1.8rem;
          font-size: 0.72rem;
          color: #9a8070;
          border-top: 1px solid #d4b896;
          padding-top: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 520px) {
          .muni-oficio { padding: 1.6rem 1.4rem 1.4rem; }
          .muni-codigo { font-size: 3rem; }
          .muni-header { flex-direction: column-reverse; align-items: flex-start; }
          .muni-sello-wrap { align-self: flex-end; }
        }
      `}</style>

      <div className="muni-root">
        <article className="muni-oficio" role="main">

          {/* ── Encabezado tipo membrete ── */}
          <div className="muni-header">
            <div className="muni-header-left">
              <span className="muni-org">República de Chile · SIFIRE</span>
              <span className="muni-titulo">Sistema Integrado de<br />Gestión de Incendios Forestales</span>
              <span className="muni-folio">Folio: ERR-404 · {today}</span>
            </div>
            <div className={`muni-sello-wrap${stamp ? " visible" : ""}`}>
              <SelloInstitucional />
            </div>
          </div>

          <MembreteLinea />

          {/* ── Asunto ── */}
          <div className="muni-asunto-label">Materia del documento</div>
          <div className="muni-asunto-valor">
            Notificación de recurso no localizado en el sistema
          </div>

          {/* ── Código de error ── */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span className="muni-codigo" aria-label="Error 404">404</span>
          </div>

          <div className="muni-divisor" />

          {/* ── Cuerpo del oficio ── */}
          <p className="muni-cuerpo">
            Por medio del presente, el sistema <strong>SIFIRE</strong> informa a quien
            corresponda que la ruta solicitada <strong>no fue hallada</strong> en los
            registros del servidor institucional. La página o recurso indicado no
            existe, fue removido o se encuentra fuera de la jurisdicción de este
            sistema. Se recomienda verificar la URL ingresada o retornar al inicio.
          </p>

          {/* ── Tabla de diagnóstico ── */}
          <table className="muni-tabla" aria-label="Detalles del error">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Código HTTP</td>
                <td>404 Not Found</td>
              </tr>
              <tr>
                <td>Clasificación</td>
                <td>Recurso inexistente o ruta inválida</td>
              </tr>
              <tr>
                <td>Sistema afectado</td>
                <td>Frontend SIFIRE — módulo de navegación</td>
              </tr>
              <tr>
                <td>Resolución sugerida</td>
                <td>Retornar al inicio o revisar la URL</td>
              </tr>
            </tbody>
          </table>

          {/* ── Barra de cuenta regresiva ── */}
          <div className="muni-countdown-label">
            <span>Redirigiendo al inicio automáticamente</span>
            <span>{count}s</span>
          </div>
          <div className="muni-barra-bg">
            <div
              className="muni-barra-fill"
              style={{ width: `${(count / 12) * 100}%` }}
            />
          </div>

          {/* ── Botones ── */}
          <div className="muni-acciones">
            <button className="muni-btn muni-btn-primary" onClick={() => navigate("/")}>
              🏠 Volver al Inicio
            </button>
            <button className="muni-btn muni-btn-ghost" onClick={() => navigate(-1)}>
              ← Página Anterior
            </button>
          </div>

          {/* ── Firma institucional ── */}
          <div className="muni-firma">
            <div>
              <div style={{ fontWeight: 600, color: "#5a3020" }}>Secretaría Técnica — SIFIRE</div>
              <div>Gestión de Emergencias e Incendios Forestales</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>Generado automáticamente</div>
              <div style={{ fontSize: "0.65rem" }}>Este documento no requiere firma ni timbre</div>
            </div>
          </div>

        </article>
      </div>
    </>
  );
}
