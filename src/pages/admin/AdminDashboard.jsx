import { useState } from 'react';
import { LogOut } from 'lucide-react';

export default function AdminDashboard({ admin, usuariosDb, setUsuariosDb, onLogout }) {
  const [nuevaFicha, setNuevaFicha] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoRol, setNuevoRol] = useState('user');
  const [nuevaArea, setNuevaArea] = useState('Operaciones');
  const [modoEdicion, setModoEdicion] = useState(false);

  const guardarUsuario = async (e) => {
    e.preventDefault();
    if (!nuevaFicha || !nuevoNombre) return;

    if (modoEdicion) {
      const usuarioEditado = { id: nuevaFicha, ficha: nuevaFicha, nombre: nuevoNombre, rol: nuevoRol, area: nuevaArea };

      await fetch(`http://localhost:3000/usuarios/${nuevaFicha}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioEditado)
      });

      setUsuariosDb(usuariosDb.map(u => u.ficha === nuevaFicha ? { ...u, ...usuarioEditado } : u));
      setModoEdicion(false);
    } else {
      if (usuariosDb.some(u => u.ficha === nuevaFicha)) return alert("¡Esa ficha ya existe!");

      const nuevoUser = { id: nuevaFicha, ficha: nuevaFicha, nombre: nuevoNombre, rol: nuevoRol, area: nuevaArea };

      await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUser)
      });

      setUsuariosDb([...usuariosDb, { ...nuevoUser, notificacionesLeidas: [] }]);
    }
    // Limpiar formulario
    setNuevaFicha('');
    setNuevoNombre('');
    setNuevoRol('user');
    setNuevaArea('Operaciones');
  };

  const borrarUsuario = async (fichaABorrar) => {
    if (fichaABorrar === admin.ficha) return alert("No te puedes borrar a ti mismo");

    await fetch(`http://localhost:3000/usuarios/${fichaABorrar}`, { method: 'DELETE' });
    setUsuariosDb(usuariosDb.filter(u => u.ficha !== fichaABorrar));
  };

  const prepararEdicion = (usuario) => {
    setNuevaFicha(usuario.ficha);
    setNuevoNombre(usuario.nombre);
    setNuevoRol(usuario.rol);
    setNuevaArea(usuario.area || 'Operaciones');
    setModoEdicion(true);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }} className="animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div>
          <h1 style={{ color: 'var(--text-h)', margin: 0 }}>Panel de Control SSPA (IT)</h1>
          <p style={{ margin: 0, color: '#666' }}>Bienvenido, {admin.nombre}</p>
        </div>
        <button onClick={onLogout} className="btn-outline-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card-premium">
          <h3 style={{ marginTop: 0 }}>{modoEdicion ? 'Editar Usuario' : 'Alta de Nuevo Empleado'}</h3>
          <form onSubmit={guardarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="form-input" placeholder="Número de Ficha" value={nuevaFicha} onChange={(e) => setNuevaFicha(e.target.value)} disabled={modoEdicion} required />
            <input className="form-input" placeholder="Nombre Completo" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required />

            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-h)' }}>Rol en la Plataforma:</label>
            <select className="form-input" value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option value="user">Trabajador (Operativo)</option>
              <option value="rh">Recursos Humanos</option>
            </select>

            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-h)' }}>Área Asignada:</label>
            <select className="form-input" value={nuevaArea} onChange={(e) => setNuevaArea(e.target.value)}>
              <option value="Operaciones">Operaciones</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Perforación">Perforación</option>
              <option value="Seguridad Industrial">Seguridad Industrial</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
            </select>

            <button type="submit" className="btn-animated" style={{ width: '100%', marginTop: '0.5rem' }}>
              {modoEdicion ? 'Actualizar Datos' : 'Registrar Empleado'}
            </button>
            {modoEdicion && (
              <button type="button" onClick={() => { setModoEdicion(false); setNuevaFicha(''); setNuevoNombre(''); }} style={{ width: '100%', background: 'transparent', border: '1px solid #ccc', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}>
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="card-premium">
          <h3 style={{ marginTop: 0 }}>Directorio de Personal</h3>
          <table className="admin-table">
            <thead>
              <tr><th>Ficha</th><th>Nombre / Área</th><th>Rol</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {usuariosDb.map((u) => (
                <tr key={u.ficha}>
                  <td><strong>{u.ficha}</strong></td>
                  <td>
                    {u.nombre}
                    <br /><span style={{ fontSize: '0.8rem', color: '#666' }}>{u.area || 'Sin área'}</span>
                  </td>
                  <td>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', background: u.rol === 'admin' ? '#fee2e2' : u.rol === 'rh' ? '#e0e7ff' : '#f3f4f6' }}>
                      {u.rol === 'admin' ? 'IT' : u.rol === 'rh' ? 'RH' : 'Planta'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => prepararEdicion(u)} className="btn-edit-small">Editar</button>
                    {u.rol !== 'admin' && <button onClick={() => borrarUsuario(u.ficha)} className="btn-danger-small">Baja</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}