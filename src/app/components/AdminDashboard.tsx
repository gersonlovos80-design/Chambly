import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Shield, LogOut, Plus, Check, X } from 'lucide-react';

interface AdminDashboardProps {
    userData: any;
    onLogout: () => void;
}
export function AdminDashboard({ userData, onLogout }: AdminDashboardProps) {
    const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'clientes' | 'profesionales'>('todos');
    const [perfilSeleccionado, setPerfilSeleccionado] = useState<any>(null);
    const [mostrarDecision, setMostrarDecision] = useState(false);
    const [accionDecision, setAccionDecision] = useState<'aprobar' | 'rechazar'>('aprobar');
    const [motivo, setMotivo] = useState('');
    const [sugerencia, setSugerencia] = useState('');
    const [procesandoDecision, setProcesandoDecision] = useState(false);
    const [pendientes, setPendientes] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [stats, setStats] = useState({ clientes: 0, profesionales: 0, pendientes: 0 });
    const [mostrarCrearAdmin, setMostrarCrearAdmin] = useState(false);
    const [nuevoAdmin, setNuevoAdmin] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        permisos: 'moderador'
    });
    const [mensaje, setMensaje] = useState('');

    const API = 'http://localhost/chambly_api';
    const puedeGestionarProfesionales =
        userData?.permisos === 'superadmin' || userData?.permisos === 'moderador';
    const mediaUrl = (path: string) =>
        /^(https?:|data:)/i.test(path) ? path : `${API}/${path.replace(/^\/+/, '')}`;

    // Cargar datos al iniciar
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const res = await fetch(`${API}/admin_datos.php`, { credentials: 'include' });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data.mensaje || 'No se pudieron cargar los datos administrativos');
            }
            setPendientes(data.pendientes || []);
            setUsuarios(data.usuarios || []);
            setStats(data.stats || { clientes: 0, profesionales: 0, pendientes: 0 });
        } catch (error) {
            console.error(error);
            setMensaje(error instanceof Error ? error.message : 'Error al cargar los datos administrativos');
        }
    };

    const abrirDecision = (perfil: any, accion: 'aprobar' | 'rechazar') => {
        setPerfilSeleccionado(perfil);
        setAccionDecision(accion);
        setMotivo('');
        setSugerencia('');
        setMostrarDecision(true);
    };

    const confirmarDecision = async () => {
        const profesionalId = Number(perfilSeleccionado?.id);
        if (!Number.isInteger(profesionalId) || profesionalId <= 0) {
            setMensaje('No se pudo identificar al profesional. Cierra el perfil y vuelve a abrirlo desde Pendientes.');
            return;
        }
        if (!motivo.trim()) {
            setMensaje('Debes escribir el motivo de la decisión');
            return;
        }
        if (accionDecision === 'rechazar' && !sugerencia.trim()) {
            setMensaje('Debes indicar qué cambios debe realizar el profesional');
            return;
        }

        setProcesandoDecision(true);
        try {
            const res = await fetch(`${API}/admin_aprobar.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: profesionalId,
                    accion: accionDecision,
                    motivo: motivo.trim(),
                    sugerencia: sugerencia.trim()
                })
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data.mensaje || 'No se pudo guardar la decisión');
            }
            setMensaje(data.mensaje);
            setPerfilSeleccionado(null);
            setMostrarDecision(false);
            await cargarDatos();
        } catch (error) {
            console.error(error);
            setMensaje(error instanceof Error ? error.message : 'Error al guardar la decisión');
        } finally {
            setProcesandoDecision(false);
        }
    };

    const crearAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/admin_crear.php`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoAdmin)
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data.mensaje || 'No se pudo crear el administrador');
            }
            setMensaje(data.mensaje);
            setMostrarCrearAdmin(false);
            setNuevoAdmin({ nombre: '', apellido: '', correo: '', password: '', permisos: 'moderador' });
            await cargarDatos();
        } catch (error) {
            console.error(error);
            setMensaje(error instanceof Error ? error.message : 'Error al crear el administrador');
        }
    };

    const usuariosFiltrados = usuarios.filter((usuario) => {
        if (filtro === 'clientes') return usuario.rol === 'cliente';
        if (filtro === 'profesionales') return usuario.rol === 'profesional';
        if (filtro === 'pendientes') return usuario.rol === 'profesional' && usuario.estado === 'pendiente';
        return true;
    });
    const mostrarPendientes = filtro === 'todos' || filtro === 'pendientes';
    const mostrarUsuarios = filtro !== 'pendientes';

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-red-600 px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-500">Chambly Admin</h1>
                    <p className="text-sm text-zinc-400">
                        {userData?.nombre} ({userData?.permisos || 'superadmin'})
                    </p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium"
                >
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-8">

                {/* Mensaje */}
                {mensaje && (
                    <div className="bg-zinc-800 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                        {mensaje}
                        <button onClick={() => setMensaje('')} className="float-right text-white">×</button>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => setFiltro('clientes')} className={`bg-zinc-900 border rounded-xl p-5 text-left transition ${filtro === 'clientes' ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-500'}`}>
                        <div className="flex items-center gap-3">
                            <Users className="text-red-500" size={28} />
                            <div>
                                <p className="text-zinc-400 text-sm">Clientes</p>
                                <p className="text-3xl font-bold">{stats.clientes}</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => setFiltro('profesionales')} className={`bg-zinc-900 border rounded-xl p-5 text-left transition ${filtro === 'profesionales' ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-500'}`}>
                        <div className="flex items-center gap-3">
                            <UserCheck className="text-red-500" size={28} />
                            <div>
                                <p className="text-zinc-400 text-sm">Profesionales</p>
                                <p className="text-3xl font-bold">{stats.profesionales}</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => setFiltro('pendientes')} className={`bg-zinc-900 border rounded-xl p-5 text-left transition ${filtro === 'pendientes' ? 'border-red-500' : 'border-zinc-700 hover:border-red-600'}`}>
                        <div className="flex items-center gap-3">
                            <UserX className="text-red-500" size={28} />
                            <div>
                                <p className="text-zinc-400 text-sm">Pendientes</p>
                                <p className="text-3xl font-bold text-red-500">{stats.pendientes}</p>
                            </div>
                        </div>
                    </button>
                </div>
                {mostrarPendientes && (
                    <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-500">Profesionales Pendientes de Aprobación</h2>
                        {!puedeGestionarProfesionales && (
                            <p className="mb-4 rounded-lg border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-200">
                                Tu cuenta tiene permiso de solo lectura. Para aprobar o rechazar profesionales, inicia sesión con una cuenta Moderador o Super Admin.
                            </p>
                        )}

                        {pendientes.length === 0 ? (
                            <p className="text-zinc-500">No hay profesionales pendientes.</p>
                        ) : (
                            <div className="space-y-3">
                                {pendientes.map((p) => (
                                    <div key={p.id} className="bg-black border border-zinc-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                        <button
                                            onClick={() => setPerfilSeleccionado(p)}
                                            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-sm"
                                        >
                                            Ver perfil
                                        </button>
                                        <div>
                                            <p className="font-semibold">{p.nombre} {p.apellido}</p>
                                            <p className="text-sm text-zinc-400">{p.correo} · {p.telefono}</p>
                                            <p className="text-sm text-zinc-500">
                                                Experiencia: {p.anos_experiencia || 0} años · {p.departamento}
                                            </p>
                                        </div>
                                        {puedeGestionarProfesionales && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => abrirDecision(p, 'aprobar')}
                                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                                                >
                                                    <Check size={16} /> Aprobar
                                                </button>
                                                <button
                                                    onClick={() => abrirDecision(p, 'rechazar')}
                                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                                                >
                                                    <X size={16} /> Rechazar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
                {/* Modal perfil */}
                {perfilSeleccionado && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-red-500">
                                    {perfilSeleccionado.nombre} {perfilSeleccionado.apellido}
                                </h3>
                                <button onClick={() => { setPerfilSeleccionado(null); setMostrarDecision(false); }} className="text-zinc-400 hover:text-white text-2xl">×</button>
                            </div>

                            {perfilSeleccionado.foto_perfil && (
                                <img
                                    src={mediaUrl(perfilSeleccionado.foto_perfil)}
                                    alt={`Foto de perfil de ${perfilSeleccionado.nombre}`}
                                    className="w-28 h-28 rounded-full object-cover mb-4"
                                />
                            )}
                            <div className="space-y-2 text-sm text-zinc-300 mb-6">
                                <p><span className="text-zinc-500">Correo:</span> {perfilSeleccionado.correo}</p>
                                <p><span className="text-zinc-500">Teléfono:</span> {perfilSeleccionado.telefono}</p>
                                <p><span className="text-zinc-500">DUI:</span> {perfilSeleccionado.dui}</p>
                                <p><span className="text-zinc-500">Edad:</span> {perfilSeleccionado.edad}</p>
                                <p><span className="text-zinc-500">Dirección:</span> {perfilSeleccionado.direccion}</p>
                                <p><span className="text-zinc-500">Departamento:</span> {perfilSeleccionado.departamento}</p>
                                <p><span className="text-zinc-500">Experiencia:</span> {perfilSeleccionado.anos_experiencia} años</p>
                                <p><span className="text-zinc-500">Educación:</span> {perfilSeleccionado.tipo_educacion}</p>
                                <p><span className="text-zinc-500">Categorías:</span> {(perfilSeleccionado.categorias || []).join(', ') || 'Ninguna'}</p>
                                <p><span className="text-zinc-500">Métodos de pago:</span> {(perfilSeleccionado.metodos_pago || []).join(', ') || 'Ninguno'}</p>
                            </div>
                            {perfilSeleccionado.fotos?.length > 0 && (
                                <section className="mb-6">
                                    <h4 className="font-semibold text-white mb-3">Portafolio</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {perfilSeleccionado.fotos.map((foto: { url_imagen: string; descripcion?: string }, index: number) => (
                                            <figure key={`${foto.url_imagen}-${index}`}>
                                                <img
                                                    src={mediaUrl(foto.url_imagen)}
                                                    alt={foto.descripcion || `Trabajo ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                {foto.descripcion && <figcaption className="mt-1 text-xs text-zinc-400">{foto.descripcion}</figcaption>}
                                            </figure>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {!puedeGestionarProfesionales ? (
                                <p className="rounded-lg border border-amber-700 bg-amber-950/40 p-3 text-sm text-amber-200">
                                    Esta cuenta solo puede consultar perfiles. Para aprobar o rechazar, inicia sesión como Moderador o Super Admin.
                                </p>
                            ) : !mostrarDecision ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => abrirDecision(perfilSeleccionado, 'aprobar')}
                                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => abrirDecision(perfilSeleccionado, 'rechazar')}
                                        className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 border-t border-zinc-700 pt-4">
                                    <p className="font-medium text-red-400">
                                        {accionDecision === 'aprobar' ? 'Motivo de aprobación (obligatorio)' : 'Motivo de rechazo (obligatorio)'}
                                    </p>
                                    <textarea
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        placeholder={accionDecision === 'aprobar' ? 'Ej: Documentación completa...' : 'Ej: Faltan fotos de trabajos...'}
                                        className="w-full bg-black border border-zinc-600 rounded-lg p-3 text-sm text-white"
                                        rows={3}
                                        required
                                    />
                                    {accionDecision === 'rechazar' && (
                                        <>
                                            <p className="font-medium text-zinc-400">Sugerencia de cambios (obligatoria)</p>
                                            <textarea
                                                value={sugerencia}
                                                onChange={(e) => setSugerencia(e.target.value)}
                                                placeholder="Ej: Sube al menos 3 fotos claras de trabajos realizados..."
                                                className="w-full bg-black border border-zinc-600 rounded-lg p-3 text-sm text-white"
                                                rows={3}
                                                required
                                            />
                                        </>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={confirmarDecision}
                                            disabled={procesandoDecision}
                                            className={`flex-1 py-2 rounded-lg disabled:opacity-50 ${accionDecision === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        >
                                            {procesandoDecision ? 'Guardando...' : `Confirmar ${accionDecision === 'aprobar' ? 'aprobación' : 'rechazo'}`}
                                        </button>
                                        <button
                                            onClick={() => setMostrarDecision(false)}
                                            className="px-4 py-2 bg-zinc-700 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Crear Admin */}
                <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-red-500 flex items-center gap-2">
                            <Shield size={22} /> Administradores
                        </h2>
                        {userData?.permisos === 'superadmin' && (
                            <button
                                onClick={() => setMostrarCrearAdmin(!mostrarCrearAdmin)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                            >
                                <Plus size={16} /> Nuevo Admin
                            </button>
                        )}
                    </div>

                    {mostrarCrearAdmin && (
                        <form onSubmit={crearAdmin} className="bg-black border border-zinc-700 rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={nuevoAdmin.nombre}
                                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })}
                                className="bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                value={nuevoAdmin.apellido}
                                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, apellido: e.target.value })}
                                className="bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo"
                                value={nuevoAdmin.correo}
                                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, correo: e.target.value })}
                                className="bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={nuevoAdmin.password}
                                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })}
                                className="bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                                required
                            />
                            <select
                                value={nuevoAdmin.permisos}
                                onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, permisos: e.target.value })}
                                className="bg-zinc-900 border border-zinc-600 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="moderador">Moderador (solo aprobar profesionales)</option>
                                <option value="soporte">Soporte (solo ver información)</option>
                                <option value="superadmin">Super Admin (todo)</option>
                            </select>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 rounded-lg py-2 font-medium">
                                Crear Administrador
                            </button>
                        </form>
                    )}
                </section>

                {/* Lista de usuarios */}
                {mostrarUsuarios && (
                    <section className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-500">
                            {filtro === 'clientes' ? 'Clientes' : filtro === 'profesionales' ? 'Profesionales' : 'Todos los Usuarios'}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-zinc-400 border-b border-zinc-700">
                                        <th className="pb-2">Nombre</th>
                                        <th className="pb-2">Correo</th>
                                        <th className="pb-2">Rol</th>
                                        <th className="pb-2">Estado</th>
                                        <th className="pb-2">Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuariosFiltrados.map((u) => (
                                        <tr key={u.id} className="border-b border-zinc-800">
                                            <td className="py-3">{u.nombre} {u.apellido}</td>
                                            <td className="py-3 text-zinc-400">{u.correo}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${u.rol === 'admin' ? 'bg-red-900 text-red-300' :
                                                    u.rol === 'profesional' ? 'bg-blue-900 text-blue-300' :
                                                        'bg-zinc-700 text-zinc-300'
                                                    }`}>
                                                    {u.rol}{u.permisos ? ` (${u.permisos})` : ''}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {u.estado || '—'}
                                            </td>
                                            <td className="py-3 text-zinc-500">{u.fecha_registro?.slice(0, 10)}</td>
                                        </tr>
                                    ))}
                                    {usuariosFiltrados.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-5 text-center text-zinc-500">No hay usuarios para este filtro.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}