import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bell, LogOut } from 'lucide-react';

import GestorCursos from './GestorCursos';

export default function RHDashboard({ rh, onLogout }) {
    const [pestañaActual, setPestañaActual] = useState('cursos');
    const [nuevoAviso, setNuevoAviso] = useState('');
    const [areaDestino, setAreaDestino] = useState('Todas');

    const enviarNotificacion = async (e) => {
        e.preventDefault();
        if (!nuevoAviso.trim()) return;

        const notificacion = {
            id: `n_${Date.now()}`,
            mensaje: nuevoAviso,
            fecha: new Date().toLocaleDateString(),
            area: areaDestino
        };

        try {
            await fetch('/notificaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificacion)
            });

            alert(`¡Aviso enviado exitosamente a: ${areaDestino}!`);
            setNuevoAviso('');
        } catch (error) {
            console.error("Error al enviar:", error);
            alert("Hubo un error de conexión.");
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }} className="animate-slide-up">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div>
                    <h1 style={{ color: 'var(--text-h)', margin: 0 }}>Gestión de Capacitación y RH</h1>
                    <p style={{ margin: 0, color: '#666' }}>Bienvenido, {rh.nombre} | Área: {rh.area}</p>
                </div>
                <button onClick={onLogout} className="btn-outline-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Salir
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setPestañaActual('cursos')} style={{ padding: '1rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: pestañaActual === 'cursos' ? 'var(--accent)' : 'white', color: pestañaActual === 'cursos' ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <BookOpen size={20} /> Contenido SSPA
                </button>
                <button onClick={() => setPestañaActual('avisos')} style={{ padding: '1rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: pestañaActual === 'avisos' ? 'var(--accent)' : 'white', color: pestañaActual === 'avisos' ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <Bell size={20} /> Difusión y Avisos
                </button>
            </div>

            {pestañaActual === 'cursos' ? (
                <GestorCursos />
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium">
                    <h3 style={{ marginTop: 0, color: 'var(--text-h)' }}>Panel de Difusión Masiva</h3>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Los trabajadores del área seleccionada verán este aviso al ingresar a la plataforma.</p>

                    <form onSubmit={enviarNotificacion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontWeight: 'bold', color: 'var(--text-h)' }}>Área Destino:</label>
                        <select className="form-input" value={areaDestino} onChange={(e) => setAreaDestino(e.target.value)} style={{ padding: '0.8rem', background: '#f9fafb' }}>
                            <option value="Todas">Todas las áreas (Toda la planta)</option>
                            <option value="Operaciones">Operaciones</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Perforación">Perforación</option>
                            <option value="Seguridad Industrial">Seguridad Industrial</option>
                        </select>

                        <label style={{ fontWeight: 'bold', color: 'var(--text-h)', marginTop: '0.5rem' }}>Mensaje del Aviso:</label>
                        <textarea className="form-input" rows="4" placeholder="Escribe el aviso aquí..." value={nuevoAviso} onChange={(e) => setNuevoAviso(e.target.value)} required style={{ resize: 'vertical' }} />

                        <button type="submit" className="btn-animated" style={{ alignSelf: 'flex-start', padding: '0.8rem 2rem', marginTop: '0.5rem' }}>
                            Enviar Notificación
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    );
}