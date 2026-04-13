import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Reportes from './pages/Reportes'
import Monitoreo from './pages/Monitoreo'
import Alertas from './pages/Alertas'
import Registro from './pages/Registro'
import NotFound from './pages/404'

function App() {
  return (
    <div className="app-shell">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/monitoreo" element={<Monitoreo />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default App