import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, FileText, LogOut, Bell, Check, Layers, Activity, BookOpen } from 'lucide-react';

import CatalogoCursos from './CatalogoCursos';
import SalaEstudio from './SalaEstudio';
import Loader from '../../components/Loader';

export default function Dashboard({ usuario, onLogout, onIniciarExamen, marcarNotificacionLeida }) {
  const [pestañaActiva, setPestañaActiva] = useState('inicio');
  const [cursoActivo, setCursoActivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const leidas = usuario.notificacionesLeidas || [];

  useEffect(() => {
    fetch('/notificaciones') // Recuerda que ya quitamos el localhost:3000 para producción
      .then(res => res.json())
      .then(data => {
        setNotificaciones(data);
        const misNotifs = data.filter(n => n.area === 'Todas' || n.area === usuario.area);
        if (misNotifs.filter(n => !leidas.includes(n.id)).length > 0) {
          setMostrarToast(true);
        }
      })
      .catch(error => console.error("Error cargando notificaciones:", error));
  }, [usuario.area, leidas]);

  const misNotificaciones = notificaciones.filter(n => n.area === 'Todas' || n.area === usuario.area).reverse();
  const noLeidas = misNotificaciones.filter(n => !leidas.includes(n.id)).length;
  const avisoActual = misNotificaciones.find(n => !leidas.includes(n.id));

  const animacionPestaña = {
    oculto: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    salida: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  const cambiarPestaña = (pestaña) => {
    if (pestaña === pestañaActiva) return;
    setCargando(true);
    setTimeout(() => {
      setPestañaActiva(pestaña);
      setCargando(false);
    }, 600);
  };

  if (cursoActivo) {
    return <SalaEstudio curso={cursoActivo} onVolver={() => setCursoActivo(null)} onIrAExamen={() => onIniciarExamen(cursoActivo)} />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', position: 'relative' }}>

      {/* --- LOADER DE CARGA --- */}
      <AnimatePresence>
        {cargando && <Loader />}
      </AnimatePresence>

      {/* --- TOAST FLOTANTE --- */}
      <AnimatePresence>
        {mostrarToast && noLeidas > 0 && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, background: 'var(--card-bg)', borderLeft: '5px solid #f59e0b', padding: '1.2rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: '340px' }}>

            {noLeidas > 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: '#fef3c7', padding: '0.6rem', borderRadius: '50%', color: '#d97706' }}><Layers size={24} /></div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1rem' }}>Múltiples Avisos</h4>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>Tienes <strong>{noLeidas} notificaciones nuevas</strong> de RH.</p>
                  <button onClick={() => { setMostrarToast(false); setPanelAbierto(true); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', padding: 0, cursor: 'pointer', fontSize: '0.9rem' }}>Ver bandeja ↗</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#fef3c7', padding: '0.6rem', borderRadius: '50%', color: '#d97706' }}><Bell size={20} /></div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-h)', fontSize: '0.95rem' }}>Aviso ({avisoActual?.fecha})</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.4' }}>{avisoActual?.mensaje}</p>
                  </div>
                </div>
                <button onClick={() => { marcarNotificacionLeida(avisoActual.id); setMostrarToast(false); }} style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#b45309', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                  Marcar de Enterado
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER (Ahora usa la clase responsiva) --- */}
      <header className="dashboard-header" style={{ position: 'relative', background: 'rgba(255, 255, 255, 0.9)', padding: '1rem 2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '50%', color: 'white' }}><User size={24} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-h)' }}>{usuario.nombre}</h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Área: {usuario.area || 'Operaciones'} | Ficha: {usuario.ficha}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>

          {/* BOTÓN DE CAMPANITA Y PANEL */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => { setPanelAbierto(!panelAbierto); setMostrarToast(false); }} style={{ position: 'relative', background: panelAbierto ? '#f3f4f6' : 'white', border: '1px solid #eee', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} color="var(--text)" />
              {noLeidas > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold', border: '2px solid white' }}>{noLeidas}</span>}
            </button>

            <AnimatePresence>
              {panelAbierto && (
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  style={{ position: 'absolute', top: '55px', right: '0', width: '350px', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid #e5e7eb', zIndex: 2000, overflow: 'hidden' }}>
                  <div style={{ background: '#f9fafb', padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-h)' }}>Buzón de Avisos</h3>
                    {noLeidas > 0 && <span style={{ fontSize: '0.8rem', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{noLeidas} nuevos</span>}
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {misNotificaciones.length === 0 ? (
                      <p style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', margin: 0 }}>No tienes avisos en tu bandeja.</p>
                    ) : (
                      misNotificaciones.map(notif => {
                        const esNueva = !leidas.includes(notif.id);
                        return (
                          <div key={notif.id} style={{ padding: '1.2rem', borderBottom: '1px solid #f3f4f6', background: esNueva ? '#f0fdf4' : 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ flexGrow: 1 }}>
                              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 'bold' }}>{notif.fecha} • De: RH</p>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.4' }}>{notif.mensaje}</p>
                            </div>
                            {esNueva && (
                              <button onClick={() => marcarNotificacionLeida(notif.id)} title="Marcar como leída" style={{ flexShrink: 0, background: 'white', border: '1px solid #d1d5db', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent)', transition: '0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--accent)'; }}>
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={onLogout} className="btn-logout">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* --- ESTRUCTURA PRINCIPAL (Ahora usa dashboard-layout) --- */}
      <div className="dashboard-layout">

        {/* Menú Lateral (Ahora usa nav-menu) */}
        <motion.nav className="nav-menu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <BotonMenu activo={pestañaActiva === 'inicio'} onClick={() => cambiarPestaña('inicio')} icono={<Activity size={20} />} texto="Resumen" />
          <BotonMenu activo={pestañaActiva === 'capacitacion'} onClick={() => cambiarPestaña('capacitacion')} icono={<BookOpen size={20} />} texto="Centro de Aprendizaje" />
          <BotonMenu activo={pestañaActiva === 'documentos'} onClick={() => cambiarPestaña('documentos')} icono={<FileText size={20} />} texto="Expediente" />
        </motion.nav>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', minHeight: '400px' }}>
          <AnimatePresence mode="wait">

            {pestañaActiva === 'inicio' && (
              <motion.div key="inicio" variants={animacionPestaña} initial="oculto" animate="visible" exit="salida">
                <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Estado de {usuario.nombre.split(' ')[0]}</h2>
                {/* Cuadrícula (Ahora usa grid-2-cols) */}
                <div className="grid-2-cols">
                  <TarjetaInfo titulo="Días sin accidentes" valor="342" color="#059669" />
                  <TarjetaInfo titulo="Cursos Aprobados" valor="0" color="#2563eb" />
                </div>
              </motion.div>
            )}

            {pestañaActiva === 'capacitacion' && (
              <motion.div key="capacitacion" variants={animacionPestaña} initial="oculto" animate="visible" exit="salida">
                <h2 style={{ color: 'var(--text-h)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={24} /> Catálogo de Capacitación
                </h2>
                <CatalogoCursos onSeleccionarCurso={setCursoActivo} />
              </motion.div>
            )}

            {pestañaActiva === 'documentos' && (
              <motion.div key="documentos" variants={animacionPestaña} initial="oculto" animate="visible" exit="salida">
                <h2>Recursos Humanos</h2>
                <p style={{ color: '#666' }}>No hay constancias generadas aún.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function BotonMenu({ activo, icono, texto, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', border: 'none', background: activo ? 'var(--accent)' : 'transparent', color: activo ? 'white' : 'var(--text)', borderRadius: '8px', cursor: 'pointer', fontWeight: activo ? 'bold' : 'normal', transition: 'all 0.2s', textAlign: 'left' }}>
      {icono} {texto}
    </button>
  );
}

function TarjetaInfo({ titulo, valor, color }) {
  return (
    <div style={{ padding: '1.5rem', borderRadius: '12px', border: `1px solid ${color}30`, background: `${color}05` }}>
      <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{titulo}</p>
      <p style={{ margin: 0, color: color, fontSize: '2rem', fontWeight: 'bold' }}>{valor}</p>
    </div>
  );
}