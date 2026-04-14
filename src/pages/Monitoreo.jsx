import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { Icon } from 'leaflet'
import FooterComponent from '../components/FooterComponent'
import 'leaflet/dist/leaflet.css'

// Fix del bug clásico de Leaflet con Vite (íconos rotos)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

// con esto te haces unos datos de prueba
const reportesMock = [
  { id: 1, lat: -33.45, lng: -70.65, tipo: 'incendio', nivel: 'alto',    titulo: 'Incendio Cerro San Cristóbal' },
  { id: 2, lat: -33.47, lng: -70.60, tipo: 'humo',     nivel: 'medio',   titulo: 'Columna de humo Lo Barnechea' },
  { id: 3, lat: -33.43, lng: -70.70, tipo: 'incendio', nivel: 'bajo',    titulo: 'Foco menor Pudahuel' },
  { id: 4, lat: -33.46, lng: -70.62, tipo: 'incendio', nivel: 'resuelto', titulo: 'Incendio Resuelto Vitacura' },
]

const coloresPorNivel = { alto: '#ef4444', medio: '#f97316', bajo: '#eadb08', resuelto: '#22c55e' }

export default function MapaIncendios() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[-33.45, -70.65]}   // Santiago
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        {/* con esto imitas el modo oscuro del sosafe*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {reportesMock.map((reporte) => (
          <>
            {/* Círculo de zona de impacto */}
            <Circle
              key={`zona-${reporte.id}`}
              center={[reporte.lat, reporte.lng]}
              radius={500}
              pathOptions={{
                color: coloresPorNivel[reporte.nivel],
                fillColor: coloresPorNivel[reporte.nivel],
                fillOpacity: 0.2,
              }}
            />

            {/* Marcador con popup */}
            <Marker key={`marker-${reporte.id}`} position={[reporte.lat, reporte.lng]}>
              <Popup>
                <strong>{reporte.titulo}</strong>
                <br />
                Nivel: {reporte.nivel}
              </Popup>
            </Marker>
          </>
        ))}
      </MapContainer>
        <FooterComponent />
    </div>
  )
}
