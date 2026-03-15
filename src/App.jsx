import { useState, useEffect } from 'react';
import './index.css';

import Login from './pages/usuarios/Login';
import Dashboard from './pages/usuarios/Dashboard';
import Examen from './pages/usuarios/Examen';
import AdminDashboard from './pages/admin/AdminDashboard';
import RHDashboard from './pages/admin/RHDashboard';

function App() {
  const [usuariosDb, setUsuariosDb] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [errorLogin, setErrorLogin] = useState('');
  const [haciendoExamen, setHaciendoExamen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/usuarios')
      .then(res => res.json())
      .then(datos => setUsuariosDb(datos));
  }, []);

  const verificarFicha = (fichaIngresada) => {
    const usuario = usuariosDb.find(u => u.ficha === fichaIngresada);
    if (!usuario) { setErrorLogin('Ficha no encontrada en el sistema.'); return null; }
    setErrorLogin(''); return usuario;
  };

  const intentarLogin = (fichaIngresada, passwordIngresada) => {
    const usuario = usuariosDb.find(u => u.ficha === fichaIngresada);
    if (usuario.password === passwordIngresada) {
      setUsuarioActual(usuario); setErrorLogin('');
    } else { setErrorLogin('Contraseña incorrecta.'); }
  };

  const crearPassword = async (fichaIngresada, nuevaPassword) => {
    const usuario = usuariosDb.find(u => u.ficha === fichaIngresada);
    const usuarioActualizado = { ...usuario, password: nuevaPassword, notificacionesLeidas: [] };
    await fetch(`http://localhost:3000/usuarios/${fichaIngresada}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(usuarioActualizado)
    });
    setUsuariosDb(usuariosDb.map(u => u.ficha === fichaIngresada ? usuarioActualizado : u));
    setUsuarioActual(usuarioActualizado);
  };

  // --- NUEVA FUNCIÓN: MARCAR AVISO COMO LEÍDO ---
  const marcarNotificacionLeida = async (idNotificacion) => {
    const nuevasLeidas = [...usuarioActual.notificacionesLeidas, idNotificacion];
    const usuarioActualizado = { ...usuarioActual, notificacionesLeidas: nuevasLeidas };

    // Le avisamos al backend (SQLite) que actualice a este trabajador
    await fetch(`http://localhost:3000/usuarios/${usuarioActual.ficha}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuarioActualizado)
    });

    setUsuariosDb(usuariosDb.map(u => u.ficha === usuarioActual.ficha ? usuarioActualizado : u));
    setUsuarioActual(usuarioActualizado);
  };

  const cerrarSesion = () => { setUsuarioActual(null); setHaciendoExamen(false); };

  if (!usuarioActual) return <Login onVerificar={verificarFicha} onLogin={intentarLogin} onCrear={crearPassword} error={errorLogin} setError={setErrorLogin} />;
  if (usuarioActual.rol === 'admin') return <AdminDashboard admin={usuarioActual} usuariosDb={usuariosDb} setUsuariosDb={setUsuariosDb} onLogout={cerrarSesion} />;
  if (usuarioActual.rol === 'rh') return <RHDashboard rh={usuarioActual} onLogout={cerrarSesion} />;
  if (haciendoExamen) return <Examen usuario={usuarioActual.nombre} numeroControl={usuarioActual.ficha} onFinalizar={() => setHaciendoExamen(false)} />;

  // Le pasamos la nueva función al Dashboard del trabajador
  return <Dashboard usuario={usuarioActual} onLogout={cerrarSesion} onIniciarExamen={() => setHaciendoExamen(true)} marcarNotificacionLeida={marcarNotificacionLeida} />;
}

export default App;