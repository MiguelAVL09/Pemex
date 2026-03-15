import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Lock, KeyRound } from 'lucide-react';

export default function Login({ onVerificar, onLogin, onCrear, error, setError }) {
  const [paso, setPaso] = useState(1);
  const [ficha, setFicha] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // Guardamos temporalmente si el usuario es nuevo para saber qué pantalla mostrar
  const [esPrimerIngreso, setEsPrimerIngreso] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  // --- ACCIONES ---
  const handleSiguiente = (e) => {
    e.preventDefault();
    if (!ficha.trim()) return setError("Ingresa tu número de ficha.");

    const usuario = onVerificar(ficha);
    if (usuario) {
      setNombreUsuario(usuario.nombre);
      // Si no tiene el campo password, es su primer ingreso
      setEsPrimerIngreso(!usuario.password);
      setPaso(2);
    }
  };

  const handleRegresar = () => {
    setPaso(1);
    setPassword('');
    setConfirmarPassword('');
    setError('');
  };

  const handleAcceso = (e) => {
    e.preventDefault();

    if (esPrimerIngreso) {
      if (password.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");
      if (password !== confirmarPassword) return setError("Las contraseñas no coinciden.");
      onCrear(ficha, password); // Guarda y accede
    } else {
      if (!password.trim()) return setError("Ingresa tu contraseña.");
      onLogin(ficha, password); // Solo verifica
    }
  };

  // --- ANIMACIONES ---
  const variantePantalla = {
    entrar: { x: 50, opacity: 0 },
    centro: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    salir: { x: -50, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <div className="card-premium animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2rem', position: 'relative' }}>

        {/* Encabezado fijo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '28px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0, 104, 71, 0.3)' }}>
            P
          </div>
          <h2 style={{ color: 'var(--text-h)', margin: '0', fontSize: '1.8rem' }}>Portal PEMEX</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>Sistema de Evaluación SSPA</p>
        </div>

        {/* Contenedor Animado de los Pasos */}
        <AnimatePresence mode="wait">

          {/* PASO 1: PEDIR FICHA */}
          {paso === 1 && (
            <motion.form key="paso1" variants={variantePantalla} initial="entrar" animate="centro" exit="salir" onSubmit={handleSiguiente} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-h)' }}>
                  <User size={18} /> Número de Ficha
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={ficha}
                  onChange={(e) => { setFicha(e.target.value); setError(''); }}
                  placeholder="Ingresa tu ficha"
                  style={{ marginBottom: '0' }}
                />
              </div>

              {error && <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '600' }}>{error}</div>}

              <button type="submit" className="btn-animated" style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '1.05rem' }}>
                Siguiente
              </button>
            </motion.form>
          )}

          {/* PASO 2: PEDIR O CREAR CONTRASEÑA */}
          {paso === 2 && (
            <motion.form key="paso2" variants={variantePantalla} initial="entrar" animate="centro" exit="salir" onSubmit={handleAcceso} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* Botón Volver y Nombre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-h)', marginBottom: '0.5rem' }}>
                <button type="button" onClick={handleRegresar} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', color: 'var(--accent)' }}>
                  <ArrowLeft size={20} />
                </button>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Hola, {nombreUsuario.split(' ')[0]}</span>
              </div>

              {esPrimerIngreso ? (
                // --- VISTA: CREAR CONTRASEÑA (PRIMER INGRESO) ---
                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '0.5rem' }}>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#166534', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <KeyRound size={16} /> Configura tu contraseña de acceso
                  </p>
                  <input
                    type="password" className="form-input" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Nueva contraseña (mín. 6 caracteres)" style={{ marginBottom: '0.8rem' }}
                  />
                  <input
                    type="password" className="form-input" value={confirmarPassword} onChange={(e) => { setConfirmarPassword(e.target.value); setError(''); }}
                    placeholder="Confirma tu contraseña" style={{ marginBottom: '0' }}
                  />
                </div>
              ) : (
                // --- VISTA: INGRESAR CONTRASEÑA (YA EXISTENTE) ---
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-h)' }}>
                    <Lock size={18} /> Contraseña de Acceso
                  </label>
                  <input
                    type="password" className="form-input" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Ingresa tu contraseña" style={{ marginBottom: '0' }} autoFocus
                  />
                </div>
              )}

              {error && <div style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center', fontWeight: '600' }}>{error}</div>}

              <button type="submit" className="btn-animated" style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '1.05rem' }}>
                {esPrimerIngreso ? 'Guardar y Entrar' : 'Iniciar Sesión'}
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}