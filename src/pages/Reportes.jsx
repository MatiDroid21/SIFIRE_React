import { useState } from 'react'
import FooterComponent from '../components/FooterComponent'

// todo esto es una demo, despues reemplazar por datos reales de GET /api/reportes
const reportesMock = [
  { id: 1, titulo: 'Incendio Cerro San Cristóbal', nivel: 'ALTO',  estado: 'EN_PROCESO', fecha: '15/04/2026', origen: 'FUNCIONARIO' },
  { id: 2, titulo: 'Foco Lo Barnechea',            nivel: 'MEDIO', estado: 'PENDIENTE',  fecha: '15/04/2026', origen: 'CIUDADANO'   },
  { id: 3, titulo: 'Humo sector Pudahuel',         nivel: 'BAJO',  estado: 'PENDIENTE',  fecha: '15/04/2026', origen: 'BRIGADISTA'  },
]

// Colores para estados y niveles, para mostrar en la tabla a nivel de prueba
const coloresEstado = {
  PENDIENTE:   { bg: '#fef9c3', text: '#854d0e' },
  EN_PROCESO:  { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO:  { bg: '#dcfce7', text: '#166534' },
  CERRADO:     { bg: '#f1f5f9', text: '#475569' },
}
const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308' }

const initialForm = { titulo: '', descripcion: '', nivel: 'MEDIO', latitud: '', longitud: '' }

export default function Reportes() {
  const [reportes, setReportes]   = useState(reportesMock)
  const [form, setForm]           = useState(initialForm)
  const [showForm, setShowForm]   = useState(false)
  const [exito, setExito]         = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevo = {
      id: reportes.length + 1,
      titulo: form.titulo,
      nivel: form.nivel,
      estado: 'PENDIENTE',
      fecha: new Date().toLocaleDateString('es-CL'),
      origen: 'CIUDADANO',
    }
    setReportes([nuevo, ...reportes])
    setForm(initialForm)
    setShowForm(false)
    setExito(true)
    setTimeout(() => setExito(false), 3000)
    // TODO: reemplazar por axios.post('/api/reportes', form)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>🔥 Reportes de Incendio</h1>
          <p style={{ color: '#64748b', margin: '0.3rem 0 0' }}>Gestión de focos activos y su historial</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
        >
          {showForm ? '✕ Cancelar' : '+ Nuevo Reporte'}
        </button>
      </div>

      {/* Alerta éxito */}
      {exito && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 500 }}>
           Reporte enviado correctamente
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginTop: 0 }}>Nuevo Reporte</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Título del reporte *</label>
                <input name="titulo" value={form.titulo} onChange={handleChange} required
                  placeholder="Ej: Incendio en Cerro San Cristóbal"
                  style={inputStyle} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                  placeholder="Describe lo que estás viendo..."
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <div>
                <label style={labelStyle}>Nivel de Riesgo *</label>
                <select name="nivel" value={form.nivel} onChange={handleChange} style={inputStyle}>
                  <option value="BAJO">Bajo</option>
                  <option value="MEDIO">Medio</option>
                  <option value="ALTO">Alto</option>
                  <option value="CRITICO"> Crítico</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={labelStyle}>Latitud</label>
                  <input name="latitud" value={form.latitud} onChange={handleChange}
                    placeholder="-33.45" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Longitud</label>
                  <input name="longitud" value={form.longitud} onChange={handleChange}
                    placeholder="-70.65" style={inputStyle} />
                </div>
              </div>

            </div>
            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
              <button type="submit" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Enviar Reporte
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['#', 'Título', 'Nivel', 'Estado', 'Origen', 'Fecha'].map(h => (
                <th key={h} style={{ padding: '0.8rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportes.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>#{r.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#1e293b' }}>{r.titulo}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ color: coloresNivel[r.nivel], fontWeight: 700, fontSize: '0.85rem' }}>● {r.nivel}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ backgroundColor: coloresEstado[r.estado].bg, color: coloresEstado[r.estado].text, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {r.estado.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{r.origen}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{r.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }