import { useState } from 'react'
import FooterComponent from '../components/FooterComponent'

const alertasMock = [
  { id: 1, titulo: 'Evacuación Cerro San Cristóbal', mensaje: 'Se ordena evacuación preventiva del sector norte.', canal: 'SMS',   estado: 'ENVIADA',   fecha: '15/04/2026 21:10' },
  { id: 2, titulo: 'Alerta Lo Barnechea',            mensaje: 'Foco activo en sector oriente. Evite la zona.',   canal: 'EMAIL', estado: 'ENVIADA',   fecha: '15/04/2026 20:45' },
  { id: 3, titulo: 'Aviso Pudahuel',                 mensaje: 'Foco menor detectado. Equipos en camino.',        canal: 'PUSH',  estado: 'PENDIENTE', fecha: '15/04/2026 20:30' },
  { id: 4, titulo: 'Alerta fallida Las Condes',      mensaje: 'Error en envío por canal SMS.',                   canal: 'SMS',   estado: 'FALLIDA',   fecha: '15/04/2026 19:55' },
]

const coloresEstado = {
  ENVIADA:   { bg: '#dcfce7', text: '#166534', icono: '✅' },
  PENDIENTE: { bg: '#fef9c3', text: '#854d0e', icono: '⏳' },
  FALLIDA:   { bg: '#fee2e2', text: '#991b1b', icono: '❌' },
}

const coloresCanal = {
  SMS:   { bg: '#eff6ff', text: '#1d4ed8' },
  EMAIL: { bg: '#f5f3ff', text: '#6d28d9' },
  PUSH:  { bg: '#fff7ed', text: '#c2410c' },
}

export default function Alertas() {
  const [alertas] = useState(alertasMock)
  const [filtro, setFiltro] = useState('TODOS')

  const alertasFiltradas = filtro === 'TODOS' ? alertas : alertas.filter(a => a.estado === filtro)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>🔔 Alertas a la Comunidad</h1>
        <p style={{ color: '#64748b', margin: '0.3rem 0 0' }}>Historial de alertas oficiales emitidas por el sistema</p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['TODOS', 'ENVIADA', 'PENDIENTE', 'FALLIDA'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            backgroundColor: filtro === f ? '#1e293b' : '#fff',
            color: filtro === f ? '#fff' : '#64748b',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Cards de alertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alertasFiltradas.map((alerta) => (
          <div key={alerta.id} style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.2rem 1.5rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderLeft: `5px solid ${coloresEstado[alerta.estado].text}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{coloresEstado[alerta.estado].icono}</span>
                <strong style={{ color: '#1e293b', fontSize: '1rem' }}>{alerta.titulo}</strong>
                <span style={{ backgroundColor: coloresCanal[alerta.canal].bg, color: coloresCanal[alerta.canal].text, padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {alerta.canal}
                </span>
              </div>
              <p style={{ color: '#64748b', margin: '0 0 0.4rem', fontSize: '0.9rem' }}>{alerta.mensaje}</p>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>📅 {alerta.fecha}</span>
            </div>
            <span style={{
              backgroundColor: coloresEstado[alerta.estado].bg,
              color: coloresEstado[alerta.estado].text,
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              {alerta.estado}
            </span>
          </div>
        ))}
      </div>

      <FooterComponent />
    </div>
  )
}