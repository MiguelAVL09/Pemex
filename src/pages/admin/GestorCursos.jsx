import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GestorCursos() {
    const [cursos, setCursos] = useState([]);
    const [nuevoTitulo, setNuevoTitulo] = useState('');
    const [nuevaPrioridad, setNuevaPrioridad] = useState('obligatorio');
    const [nuevaDesc, setNuevaDesc] = useState('');

    // Cargar cursos desde la BD
    useEffect(() => {
        fetch('http://localhost:3000/cursos')
            .then(res => res.json())
            .then(data => setCursos(data));
    }, []);

    const guardarCurso = async (e) => {
        e.preventDefault();
        const idUnico = `c_${Date.now()}`;
        const nuevoCurso = {
            id: idUnico, titulo: nuevoTitulo, prioridad: nuevaPrioridad, descripcion: nuevaDesc, videoUrl: ""
        };

        await fetch('http://localhost:3000/cursos', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoCurso)
        });
        setCursos([...cursos, nuevoCurso]);
        setNuevoTitulo(''); setNuevaDesc('');
    };

    const borrarCurso = async (id) => {
        await fetch(`http://localhost:3000/cursos/${id}`, { method: 'DELETE' });
        setCursos(cursos.filter(c => c.id !== id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card-premium" style={{ marginBottom: '2rem' }}>
                <h3>Crear Nuevo Curso</h3>
                <form onSubmit={guardarCurso} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className="form-input" placeholder="Título del Curso" value={nuevoTitulo} onChange={e => setNuevoTitulo(e.target.value)} required />
                    <select className="form-input" value={nuevaPrioridad} onChange={e => setNuevaPrioridad(e.target.value)}>
                        <option value="obligatorio">Obligatorio (Rojo)</option>
                        <option value="opcional">Opcional (Amarillo)</option>
                        <option value="menor">Prioridad Menor (Gris)</option>
                    </select>
                    <textarea className="form-input" placeholder="Descripción breve..." value={nuevaDesc} onChange={e => setNuevaDesc(e.target.value)} required />
                    <button type="submit" className="btn-animated">Publicar Curso</button>
                </form>
            </div>

            <div className="card-premium">
                <h3>Cursos Activos en Plataforma</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {cursos.map(curso => (
                        <li key={curso.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{curso.titulo}</strong>
                                <span style={{
                                    marginLeft: '10px', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                    background: curso.prioridad === 'obligatorio' ? '#fee2e2' : curso.prioridad === 'opcional' ? '#fef3c7' : '#f3f4f6',
                                    color: curso.prioridad === 'obligatorio' ? '#dc2626' : curso.prioridad === 'opcional' ? '#d97706' : '#4b5563'
                                }}>
                                    {curso.prioridad.toUpperCase()}
                                </span>
                            </div>
                            <button onClick={() => borrarCurso(curso.id)} className="btn-danger-small">Eliminar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}