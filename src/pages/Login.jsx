import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Usuarios de prueba por el momento
const USUARIOS_DEMO = [
  { email: 'ciudadano@demo.cl',   password: '12345678', tipo: 'CIUDADANO',   nombre: 'María González' },
  { email: 'brigadista@demo.cl',  password: '12345678', tipo: 'BRIGADISTA',  nombre: 'Carlos Rojas' },
  { email: 'funcionario@demo.cl', password: '12345678', tipo: 'FUNCIONARIO', nombre: 'Ana Martínez' },
];

// A cada rol le corresponde una ruta distinta
const RUTA_POR_ROL = {
  CIUDADANO:   '/reportes',
  BRIGADISTA:  '/monitoreo',
  FUNCIONARIO: '/dashboard',
};

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Muestra banner si viene de registro exitoso
  const registradoOk = location.state?.registrado;

  // Validación básica del formulario
  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Ingresa un correo válido.';
    if (!form.password)
      e.password = 'La contraseña es requerida.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name])  setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError)    setLoginError('');
  };

  // TODO: conectar con POST /api/usuarios/login
  // o eso se supone eso que lo vea el backend, no? xd

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // simula delay visual

    const usuario = USUARIOS_DEMO.find(
      u => u.email === form.email && u.password === form.password
    );

    setLoading(false);

    if (!usuario) {
      setLoginError('Correo o contraseña incorrectos.');
      return;
    }

    // Guarda en sessionStorage para que el layout sepa quién está logueado
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    navigate(RUTA_POR_ROL[usuario.tipo]);
  };

  return (
    <div className="sifire-login-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">

            {/* Cabecera */}
            <div className="text-center mb-4">
              <div className="fs-1 mb-2">🔥</div>
              <h1 className="fs-4 fw-bold text-dark mb-1">SIFIRE</h1>
              <p className="text-muted small">
                Sistema de Gestión de Emergencias — Municipalidad Valle del Sol
              </p>
            </div>

            {/* Banner registro exitoso */}
            {registradoOk && (
              <div className="alert alert-success py-2 small text-center" role="alert">
               Cuenta creada. Ya puedes iniciar sesión.
              </div>
            )}

            {/* Error de credenciales */}
            {loginError && (
              <div className="alert alert-danger py-2 small text-center" role="alert">
                {loginError}
              </div>
            )}

            {/* Formulario */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit} noValidate>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-semibold">
                      Correo electrónico
                    </label>
                    <input
                      id="email" name="email" type="email" autoComplete="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="correo@ejemplo.cl"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small fw-semibold">
                      Contraseña
                    </label>
                    <input
                      id="password" name="password" type="password" autoComplete="current-password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Tu contraseña"
                      value={form.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100 py-2 fw-semibold"
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Ingresando…</>
                      : 'Ingresar'
                    }
                  </button>

                </form>
              </div>
            </div>

            {/* Accesos rápidos demo — solo esta semana */}
            <div className="mt-3 p-3 bg-white rounded-3 border border-secondary-subtle">
              <p className="text-muted small text-center mb-2 fw-semibold">
                Accesos rápidos (demo)
              </p>
              <div className="d-flex flex-column gap-1">
                {USUARIOS_DEMO.map(u => (
                  <button
                    key={u.tipo}
                    type="button"
                    className="btn btn-outline-secondary btn-sm text-start py-1"
                    onClick={() => setForm({ email: u.email, password: u.password })}
                  >
                    {u.tipo === 'CIUDADANO'   && '👤'}
                    {u.tipo === 'BRIGADISTA'  && '🧯'}
                    {u.tipo === 'FUNCIONARIO' && '🏛️'}
                    {' '}{u.nombre} — <span className="text-muted">{u.email}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-muted small mt-4">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-danger text-decoration-none fw-semibold">
                Regístrate
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}