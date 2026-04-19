import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'


// fix bug leaflet + vite
const iconDefault = L.icon({ iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] })

const reportesMock = [
  { id: 1, titulo: 'Incendio Cerro San Cristóbal', nivel: 'ALTO',  estado: 'EN_CURSO',  fecha: '15-04-2026', origen: 'FUNCIONARIO', descripcion: 'Se reporta un incendio activo con gran cantidad de humo visible desde varios puntos de la ciudad.' },
  { id: 2, titulo: 'Foco Lo Barnechea',            nivel: 'MEDIO', estado: 'PENDIENTE', fecha: '15-04-2026', origen: 'CIUDADANO',   descripcion: 'Vecinos reportan un posible foco de incendio en el sector de Lo Barnechea.' },
  { id: 3, titulo: 'Humo sector Pudahuel',         nivel: 'BAJO',  estado: 'PENDIENTE', fecha: '15-04-2026', origen: 'BRIGADISTA',  descripcion: 'Se observa humo en el sector de Pudahuel, pero no se han confirmado llamas.' },
]

const coloresEstado = {
  PENDIENTE:  { bg: '#fef9c3', text: '#854d0e' },
  EN_CURSO:   { bg: '#fee2e2', text: '#991b1b' },
  CONTROLADO: { bg: '#dcfce7', text: '#166534' },
  CERRADO:    { bg: '#f1f5f9', text: '#475569' },
}
const coloresNivel = { ALTO: '#ef4444', MEDIO: '#f97316', BAJO: '#eab308', CRITICO: '#7f1d1d' }

const initialForm = { titulo: '', descripcion: '', nivel: 'MEDIO', latitud: '', longitud: '' }

function SelectorUbicacion({ onSeleccionar }) {
  useMapEvents({
    click(e) {
      onSeleccionar(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6))
    }
  })
  return null
}

export default function Reportes() {
  const [reportes, setReportes] = useState(reportesMock)
  const [form, setForm]         = useState(initialForm)
  const [showForm, setShowForm] = useState(false)
  const [exito, setExito]       = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUbicacion = (lat, lng) => {
    setForm(prev => ({ ...prev, latitud: lat, longitud: lng }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevo = {
      id: reportes.length + 1,
      titulo: form.titulo,
      nivel: form.nivel,
      estado: 'PENDIENTE',
      fecha: new Date().toLocaleDateString('es-CL'),
      origen: 'CIUDADANO',
      descripcion: form.descripcion,
    }
    setReportes([nuevo, ...reportes])
    setForm(initialForm)
    setShowForm(false)
    setExito(true)
    setTimeout(() => setExito(false), 3000)
    // TODO: axios.post('/bff/reportes', { ...nuevo, latitud: form.latitud, longitud: form.longitud })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Reportes de Incendio</h1>
          <p style={{ color: '#64748b', margin: '0.3rem 0 0' }}>Gestión de focos activos y su historial</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Nuevo Reporte'}
        </button>
      </div>

      {/* Alerta éxito */}
      {exito && (
        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.8rem 1.2rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 500 }}>
          ✓ Reporte enviado correctamente
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
                  placeholder="Ej: Incendio en Cerro San Cristóbal" style={inputStyle} />
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
                  <option value="CRITICO">Crítico</option>
                </select>
              </div>

              {/* Coordenadas — solo lectura, se llenan desde el mapa */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Latitud</label>
                  <input value={form.latitud} readOnly placeholder="Haz click en el mapa"
                    style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Longitud</label>
                  <input value={form.longitud} readOnly placeholder="Haz click en el mapa"
                    style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b' }} />
                </div>
              </div>

              {/* Mapa selector */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>
                  Ubicación del foco
                  <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: '0.4rem' }}>
                    — haz click en el mapa para marcar el lugar
                  </span>
                </label>
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '280px' }}>
                  <MapContainer center={[-33.45, -70.65]} zoom={11} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    />
                    <SelectorUbicacion onSeleccionar={handleUbicacion} />
                    {form.latitud && form.longitud && (
                      <Marker
                        position={[parseFloat(form.latitud), parseFloat(form.longitud)]}
                        icon={iconDefault}
                      />
                    )}
                  </MapContainer>
                </div>
                {form.latitud && (
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                    📍 Ubicación seleccionada: {form.latitud}, {form.longitud}
                  </p>
                )}
              </div>

            </div>

            <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
              <button type="submit"
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Enviar Reporte
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(initialForm) }}
                style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de reportes */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['#', 'Título', 'Nivel', 'Estado', 'Origen', 'Descripción', 'Fecha'].map(h => (
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
                  <span style={{ color: coloresNivel[r.nivel] ?? '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>
                    ● {r.nivel}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{
                    backgroundColor: (coloresEstado[r.estado] ?? coloresEstado.CERRADO).bg,
                    color: (coloresEstado[r.estado] ?? coloresEstado.CERRADO).text,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {r.estado.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{r.origen}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem', maxWidth: '200px' }}>{r.descripcion}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.85rem' }}>{r.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none',
}
const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '0.4rem',
}
