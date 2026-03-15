import express from 'express';
import sqlite3Pkg from 'sqlite3';
import cors from 'cors';

const sqlite3 = sqlite3Pkg.verbose();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 1. CONEXIÓN A LA BASE DE DATOS
const db = new sqlite3.Database('./pemex.db', (err) => {
    if (!err) {
        console.log('✅ Conectado a SQLite (pemex.db)');
        db.serialize(() => {
            // TABLA USUARIOS
            db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        ficha TEXT PRIMARY KEY, nombre TEXT, rol TEXT, password TEXT, notificacionesLeidas TEXT, area TEXT
      )`);

            // TABLA CURSOS
            db.run(`CREATE TABLE IF NOT EXISTS cursos (
        id TEXT PRIMARY KEY, titulo TEXT, prioridad TEXT, descripcion TEXT, videoUrl TEXT
      )`);

            // TABLA NOTIFICACIONES
            db.run(`CREATE TABLE IF NOT EXISTS notificaciones (
        id TEXT PRIMARY KEY, mensaje TEXT, fecha TEXT, area TEXT
      )`);

            // USUARIOS POR DEFECTO
            db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
                if (row.count === 0) {
                    db.run(`INSERT INTO usuarios (ficha, nombre, rol, password, notificacionesLeidas, area) VALUES ('admin123', 'IT Admin', 'admin', 'admin', '[]', 'Sistemas')`);
                    db.run(`INSERT INTO usuarios (ficha, nombre, rol, password, notificacionesLeidas, area) VALUES ('rh123', 'Recursos Humanos', 'rh', 'rh', '[]', 'Recursos Humanos')`);
                }
            });
        });
    }
});

// --- RUTAS DE USUARIOS ---
app.get('/usuarios', (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        res.json(rows.map(u => ({ ...u, notificacionesLeidas: JSON.parse(u.notificacionesLeidas || '[]') })));
    });
});

app.post('/usuarios', (req, res) => {
    const { ficha, nombre, rol, password, notificacionesLeidas, area } = req.body;
    db.run(`INSERT INTO usuarios (ficha, nombre, rol, password, notificacionesLeidas, area) VALUES (?, ?, ?, ?, ?, ?)`,
        [ficha, nombre, rol, password || '', JSON.stringify(notificacionesLeidas || []), area || 'General'],
        () => res.json(req.body));
});

app.put('/usuarios/:ficha', (req, res) => {
    const { nombre, rol, password, notificacionesLeidas, area } = req.body;
    db.run(`UPDATE usuarios SET nombre=?, rol=?, password=?, notificacionesLeidas=?, area=? WHERE ficha=?`,
        [nombre, rol, password, JSON.stringify(notificacionesLeidas || []), area, req.params.ficha],
        () => res.json({ message: "OK" }));
});

// --- RUTAS DE NOTIFICACIONES ---
app.get('/notificaciones', (req, res) => {
    db.all("SELECT * FROM notificaciones", [], (err, rows) => res.json(rows));
});

app.post('/notificaciones', (req, res) => {
    const { id, mensaje, fecha, area } = req.body;
    db.run(`INSERT INTO notificaciones (id, mensaje, fecha, area) VALUES (?, ?, ?, ?)`,
        [id, mensaje, fecha, area], () => res.json(req.body));
});

// --- RUTAS DE CURSOS ---
app.get('/cursos', (req, res) => {
    db.all("SELECT * FROM cursos", [], (err, rows) => res.json(rows));
});

app.post('/cursos', (req, res) => {
    const { id, titulo, prioridad, descripcion, videoUrl } = req.body;
    db.run(`INSERT INTO cursos (id, titulo, prioridad, descripcion, videoUrl) VALUES (?, ?, ?, ?, ?)`,
        [id, titulo, prioridad, descripcion, videoUrl], () => res.json(req.body));
});

app.delete('/cursos/:id', (req, res) => {
    db.run(`DELETE FROM cursos WHERE id = ?`, [req.params.id], () => res.json({ message: "Curso eliminado" }));
});

// --- INICIAR SERVIDOR ---
app.listen(port, () => console.log(`🚀 Backend en puerto ${port}`));