import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, AlertCircle } from 'lucide-react';

export default function CatalogoCursos({ onSeleccionarCurso }) {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/cursos')
            .then(res => res.json())
            .then(data => setCursos(data));
    }, []);

    const getColorPrioridad = (prioridad) => {
        if (prioridad === 'obligatorio') return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
        if (prioridad === 'opcional') return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' };
        return { bg: '#f3f4f6', text: '#4b5563', border: '#d1d5db' };
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {cursos.map((curso, index) => {
                const colores = getColorPrioridad(curso.prioridad);

                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                        key={curso.id}
                        className="card-premium"
                        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderTop: `4px solid ${colores.border}` }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <span style={{ background: colores.bg, color: colores.text, padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {curso.prioridad === 'obligatorio' && <AlertCircle size={12} />}
                                {curso.prioridad.toUpperCase()}
                            </span>
                        </div>

                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-h)', fontSize: '1.2rem' }}>{curso.titulo}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', flexGrow: 1, marginBottom: '1.5rem' }}>{curso.descripcion}</p>

                        <button
                            onClick={() => onSeleccionarCurso(curso)}
                            className="btn-animated"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)' }}
                        >
                            <PlayCircle size={18} /> Iniciar Curso
                        </button>
                    </motion.div>
                );
            })}
        </div>
    );
}