import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react';

// Batería de preguntas SSPA (Seguridad, Salud y Protección Ambiental)
const PREGUNTAS = [
  {
    id: 1,
    texto: "¿Cuál es el EPP (Equipo de Protección Personal) básico y obligatorio en áreas operativas?",
    opciones: [
      "Solo casco y botas con casquillo.",
      "Casco, lentes de seguridad, ropa de algodón (overol), botas con casquillo y protección auditiva.",
      "Ropa cómoda, casco y guantes de carnaza."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 2,
    texto: "¿Qué establece la regla de 'Tolerancia Cero' en PEMEX?",
    opciones: [
      "La prohibición estricta de retardos en el turno.",
      "El despido inmediato por no llenar la bitácora.",
      "La cero tolerancia al incumplimiento de reglas críticas de seguridad que salvan vidas (ej. alcohol, drogas, brincar bloqueos)."
    ],
    respuestaCorrecta: 2
  },
  {
    id: 3,
    texto: "¿Qué es un 'Acto Inseguro'?",
    opciones: [
      "Una falla mecánica en una bomba centrífuga.",
      "La violación u omisión de una norma o procedimiento por parte del trabajador que aumenta el riesgo de accidente.",
      "Una condición del clima como lluvia o tormenta eléctrica."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 4,
    texto: "¿Qué gas es conocido como el asesino silencioso, huele a huevo podrido y es letal en altas concentraciones?",
    opciones: [
      "Ácido Sulfhídrico (H2S)",
      "Monóxido de Carbono (CO)",
      "Gas Natural (Metano)"
    ],
    respuestaCorrecta: 0
  },
  {
    id: 5,
    texto: "Antes de intervenir un equipo eléctrico, ¿qué procedimiento es obligatorio?",
    opciones: [
      "Avisar al supervisor por radio.",
      "Etiquetado y Candadeo (LOTO) para asegurar el aislamiento de energía.",
      "Usar guantes de látex."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 6,
    texto: "¿Qué tipo de fuego es el 'Clase B'?",
    opciones: [
      "Equipos eléctricos energizados.",
      "Líquidos y gases inflamables (gasolina, diésel, gas LP).",
      "Materiales sólidos comunes (madera, papel)."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 7,
    texto: "Para ingresar a un Espacio Confinado (ej. interior de un tanque), ¿qué es indispensable?",
    opciones: [
      "Permiso de trabajo peligroso, medición de gases, guardia en el exterior y equipo de respiración.",
      "Llevar una linterna y entrar rápido.",
      "Ir acompañado de al menos dos compañeros."
    ],
    respuestaCorrecta: 0
  },
  {
    id: 8,
    texto: "¿Qué hacer inmediatamente si escuchas la alarma general de evacuación?",
    opciones: [
      "Terminar el trabajo que estaba haciendo.",
      "Suspender labores, asegurar el área si es posible y dirigirse al punto de reunión marcado.",
      "Correr hacia la salida principal de la planta."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 9,
    texto: "Al usar un extintor, ¿hacia dónde debe dirigirse la descarga?",
    opciones: [
      "Hacia las llamas más altas.",
      "Hacia la base del fuego en forma de barrido.",
      "Al centro del fuego directamente."
    ],
    respuestaCorrecta: 1
  },
  {
    id: 10,
    texto: "¿Cuándo se debe reportar un incidente o 'casi-accidente'?",
    opciones: [
      "Solo si hay lesionados.",
      "Al final del mes en la junta de seguridad.",
      "Inmediatamente al supervisor, sin importar si hubo o no daños."
    ],
    respuestaCorrecta: 2
  }
];

export default function Examen({ usuario, numeroControl, onFinalizar }) {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [examenTerminado, setExamenTerminado] = useState(false);
  const [calificacion, setCalificacion] = useState(0);

  const seleccionarRespuesta = (indiceOpcion) => {
    setRespuestasUsuario({
      ...respuestasUsuario,
      [preguntaActual]: indiceOpcion
    });
  };

  const avanzarPregunta = () => {
    if (preguntaActual < PREGUNTAS.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      evaluarExamen();
    }
  };

  const evaluarExamen = () => {
    let aciertos = 0;
    PREGUNTAS.forEach((preg, index) => {
      if (respuestasUsuario[index] === preg.respuestaCorrecta) {
        aciertos++;
      }
    });
    const calificacionFinal = (aciertos / PREGUNTAS.length) * 100;
    setCalificacion(calificacionFinal);
    setExamenTerminado(true);
  };

  // Progreso de la barra
  const porcentajeProgreso = ((preguntaActual + 1) / PREGUNTAS.length) * 100;

  // --- VISTA DE RESULTADOS ---
  if (examenTerminado) {
    const aprobado = calificacion >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}
        className="card-premium"
      >
        <div style={{ marginBottom: '2rem' }}>
          {aprobado ? (
            <Award size={80} color="#059669" style={{ margin: '0 auto' }} />
          ) : (
            <AlertTriangle size={80} color="#dc2626" style={{ margin: '0 auto' }} />
          )}
        </div>
        <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: aprobado ? '#059669' : '#dc2626' }}>
          {aprobado ? '¡Certificación Aprobada!' : 'Evaluación Reprobada'}
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text)' }}>
          Trabajador: <strong>{usuario}</strong> (Ficha: {numeroControl})
        </p>
        <div style={{ margin: '2rem 0', padding: '2rem', background: '#f3f4f6', borderRadius: '16px' }}>
          <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Calificación Final</p>
          <p style={{ margin: 0, fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent)' }}>{calificacion}%</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Se requiere un 80% mínimo para laborar en planta.
          </p>
        </div>
        <button onClick={onFinalizar} className="btn-animated" style={{ width: '100%', padding: '1rem' }}>
          Regresar al Panel Principal
        </button>
      </motion.div>
    );
  }

  // --- VISTA DEL CUESTIONARIO ---
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }} className="animate-slide-up">

      {/* Encabezado e Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-h)' }}>Módulo SSPA</h2>
          <p style={{ margin: 0, color: '#666' }}>Evaluación Teórica Obligatoria</p>
        </div>
        <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
          Pregunta {preguntaActual + 1} de {PREGUNTAS.length}
        </div>
      </div>

      {/* Barra de Progreso */}
      <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${porcentajeProgreso}%` }}
          style={{ height: '100%', background: 'var(--accent)' }}
        />
      </div>

      {/* Tarjeta de la Pregunta */}
      <div className="card-premium" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={preguntaActual}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ flexGrow: 1 }}
          >
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '2rem', lineHeight: '1.4' }}>
              {PREGUNTAS[preguntaActual].texto}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {PREGUNTAS[preguntaActual].opciones.map((opcion, index) => {
                const isSelected = respuestasUsuario[preguntaActual] === index;
                return (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={index}
                    onClick={() => seleccionarRespuesta(index)}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '12px',
                      border: `2px solid ${isSelected ? 'var(--accent)' : '#e5e7eb'}`,
                      background: isSelected ? 'var(--accent-bg)' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--accent)' : '#ccc'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <div style={{ width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '50%' }} />}
                    </div>
                    <span style={{ fontSize: '1.05rem', color: isSelected ? 'var(--accent)' : 'var(--text)', fontWeight: isSelected ? '600' : 'normal' }}>
                      {opcion}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botón Inferior */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <button
            onClick={avanzarPregunta}
            disabled={respuestasUsuario[preguntaActual] === undefined}
            className="btn-animated"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              opacity: respuestasUsuario[preguntaActual] === undefined ? 0.5 : 1,
              cursor: respuestasUsuario[preguntaActual] === undefined ? 'not-allowed' : 'pointer'
            }}
          >
            {preguntaActual === PREGUNTAS.length - 1 ? 'Finalizar Examen' : 'Siguiente Pregunta'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}