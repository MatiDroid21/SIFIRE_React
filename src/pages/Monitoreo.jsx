import React from 'react'
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
  { id: 1, lat: -30.692, lng: -70.962, tipo: 'incendio', nivel: 'alto',     titulo: 'Incendio Sector Carén' },
  { id: 2, lat: -30.701, lng: -70.948, tipo: 'humo',     nivel: 'medio',    titulo: 'Columna de humo Cerro Las Ramadas' },
  { id: 3, lat: -30.685, lng: -70.971, tipo: 'incendio', nivel: 'bajo',     titulo: 'Foco menor El Maitén' },
  { id: 4, lat: -30.710, lng: -70.955, tipo: 'incendio', nivel: 'resuelto', titulo: 'Incendio Resuelto Sector Ponio' },
]
const coloresPorNivel = { alto: '#ef4444', medio: '#f97316', bajo: '#eadb08', resuelto: '#22c55e' }

export default function MapaIncendios() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[-30.695, -70.958]}   // Valle Del Sol está aprox en -30.695, -70.958
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        {/* con esto imitas el modo oscuro del sosafe*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {reportesMock.map((reporte) => (
          <React.Fragment key={reporte.id}>
            {/*Dibujar el circulo de zona de impacto */}
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
          </React.Fragment>
        ))}
      </MapContainer>
      <FooterComponent />
    </div>
  )
}
