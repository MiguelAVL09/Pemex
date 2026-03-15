import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare, BookOpen, PlayCircle, AlertCircle } from 'lucide-react';
import YouTube from 'react-youtube';

export default function SalaEstudio({ curso, onVolver, onIrAExamen }) {
    const [materialRevisado, setMaterialRevisado] = useState(false);
    const [advertenciaTrampa, setAdvertenciaTrampa] = useState(false);

    // 1. EXTRAER EL ID DEL VIDEO (Magia de expresiones regulares)
    // Convierte "https://www.youtube.com/embed/dQw4w9WgXcQ" a "dQw4w9WgXcQ"
    const obtenerIdYouTube = (url) => {
        if (!url) return "dQw4w9WgXcQ";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : "dQw4w9WgXcQ";
    };

    const videoId = obtenerIdYouTube(curso.videoUrl);

    // 2. CONFIGURACIÓN DEL REPRODUCTOR ANTI-TRAMPAS
    const opcionesYouTube = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 0,      // Oculta la barra de progreso (¡No pueden adelantar!)
            disablekb: 1,     // Bloquea atajos de teclado (como las flechas para adelantar)
            rel: 0,           // Evita que salgan videos recomendados de otros canales al final
            modestbranding: 1 // Oculta el logo de YouTube lo más posible
        },
    };

    // 3. EVENTO: EL VIDEO TERMINÓ LEGALMENTE
    const videoTermino = () => {
        setMaterialRevisado(true);
        setAdvertenciaTrampa(false);
    };

    // 4. EVENTO: INTENTAN HACER CLIC EN EL CHECKBOX
    const intentoDeTrampa = (e) => {
        e.preventDefault(); // Evita que se marque manualmente
        if (!materialRevisado) {
            setAdvertenciaTrampa(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}
        >
            <button
                onClick={onVolver}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem' }}
            >
                <ArrowLeft size={20} /> Volver al Catálogo
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Contenedor del Reproductor Inteligente */}
                <div className="card-premium" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <PlayCircle size={28} color="var(--accent)" />
                        <h2 style={{ margin: 0, color: 'var(--text-h)' }}>{curso.titulo}</h2>
                    </div>

                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                        <YouTube
                            videoId={videoId}
                            opts={opcionesYouTube}
                            onEnd={videoTermino}
                            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                            iframeClassName="youtube-iframe"
                        />
                    </div>
                    <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{curso.descripcion}</p>
                </div>

                {/* Panel lateral: Progreso Bloqueado */}
                <div className="card-premium" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginTop: 0 }}>
                        <BookOpen size={20} /> Progreso del Curso
                    </h3>

                    <div style={{ flexGrow: 1, marginTop: '1rem' }}>
                        {/* El div ahora tiene un onClick para interceptar clics manuales */}
                        <div
                            onClick={intentoDeTrampa}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', cursor: materialRevisado ? 'default' : 'not-allowed', background: materialRevisado ? 'var(--accent-bg)' : '#f9fafb', padding: '1rem', borderRadius: '8px', border: `1px solid ${materialRevisado ? 'var(--accent)' : '#e5e7eb'}`, transition: 'all 0.2s' }}
                        >
                            <input
                                type="checkbox"
                                checked={materialRevisado}
                                readOnly // Lo hace de solo lectura
                                style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', marginTop: '2px', pointerEvents: 'none' }}
                            />
                            <span style={{ fontSize: '0.95rem', color: materialRevisado ? 'var(--text-h)' : '#4b5563', fontWeight: materialRevisado ? '600' : 'normal' }}>
                                He visualizado la totalidad del material audiovisual.
                            </span>
                        </div>

                        {advertenciaTrampa && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem', padding: '0.8rem', background: '#fee2e2', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#dc2626', fontSize: '0.85rem' }}>
                                <AlertCircle size={16} /> Debes reproducir el video completo. El sistema lo marcará automáticamente al finalizar.
                            </motion.div>
                        )}
                    </div>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <button
                            onClick={onIrAExamen}
                            disabled={!materialRevisado}
                            className="btn-animated"
                            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: materialRevisado ? 1 : 0.5, cursor: materialRevisado ? 'pointer' : 'not-allowed' }}
                        >
                            <CheckSquare size={20} /> Iniciar Evaluación
                        </button>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}