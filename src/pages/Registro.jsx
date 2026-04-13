import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../assets/Registro.css';

const TIPOS_USUARIO = [
  { value: 'CIUDADANO',   label: 'Ciudadano',             icon: '👤' },
  { value: 'BRIGADISTA',  label: 'Brigadista Forestal',   icon: '🧯' },
  { value: 'FUNCIONARIO', label: 'Funcionario Municipal', icon: '🏛️' },
];

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo_usuario: '',
    password: '',
    confirmar_password: '',
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())
      e.nombre = 'El nombre es requerido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Ingresa un correo válido.';
    if (form.telefono && !/^\+?56?[\s-]?9[\s-]?\d{4}[\s-]?\d{4}$/.test(form.telefono))
      e.telefono = 'Formato inválido. Ej: +56 9 1234 5678';
    if (!form.tipo_usuario)
      e.tipo_usuario = 'Selecciona tu tipo de usuario.';
    if (form.password.length < 8)
      e.password = 'Mínimo 8 caracteres.';
    if (form.password !== form.confirmar_password)
      e.confirmar_password = 'Las contraseñas no coinciden.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTipo = (value) => {
    setForm(prev => ({ ...prev, tipo_usuario: value }));
    if (errors.tipo_usuario) setErrors(prev => ({ ...prev, tipo_usuario: '' }));
  };

  // TODO: conectar con POST /api/usuarios/crear
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simula delay visual
    setLoading(false);
    navigate('/login', { state: { registrado: true } });
  };

  return (
    <div className="sifire-registro-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">

            {/* Cabecera */}
            <div className="text-center mb-4">
              <div className="sifire-logo-mark mb-3">🔥</div>
              <h1 className="fs-4 fw-bold text-dark mb-1">Crear cuenta</h1>
              <p className="text-muted small">
                Sistema de Gestión de Emergencias — Municipalidad Valle del Sol
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* Tipo de usuario */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted text-uppercase mb-2">
                  Soy…
                </label>
                <div className="d-flex gap-2">
                  {TIPOS_USUARIO.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleTipo(value)}
                      className={`sifire-tipo-btn flex-fill py-3 px-2 rounded-3 border text-center
                        ${form.tipo_usuario === value
                          ? 'border-danger bg-danger text-white'
                          : 'border-secondary-subtle bg-white text-dark'
                        }`}
                    >
                      <div className="fs-5 mb-1">{icon}</div>
                      <div className="small lh-1">{label}</div>
                    </button>
                  ))}
                </div>
                {errors.tipo_usuario && (
                  <div className="text-danger small mt-1">{errors.tipo_usuario}</div>
                )}
              </div>

              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label small fw-semibold">
                  Nombre completo
                </label>
                <input
                  id="nombre" name="nombre" type="text" autoComplete="name"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: María González"
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

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

              {/* Teléfono */}
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label small fw-semibold">
                  Teléfono <span className="text-muted fw-normal">(opcional)</span>
                </label>
                <input
                  id="telefono" name="telefono" type="tel" autoComplete="tel"
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  placeholder="+56 9 1234 5678"
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label small fw-semibold">
                  Contraseña
                </label>
                <input
                  id="password" name="password" type="password" autoComplete="new-password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Confirmar contraseña */}
              <div className="mb-4">
                <label htmlFor="confirmar_password" className="form-label small fw-semibold">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmar_password" name="confirmar_password"
                  type="password" autoComplete="new-password"
                  className={`form-control ${errors.confirmar_password ? 'is-invalid' : ''}`}
                  placeholder="Repite tu contraseña"
                  value={form.confirmar_password}
                  onChange={handleChange}
                />
                {errors.confirmar_password && (
                  <div className="invalid-feedback">{errors.confirmar_password}</div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-danger w-100 py-2 fw-semibold"
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creando cuenta…</>
                  : 'Crear cuenta'
                }
              </button>

            </form>

            <p className="text-center text-muted small mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-danger text-decoration-none fw-semibold">
                Iniciar sesión
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}