/* T.T AI Firm · Sistema interno · datos
   Capa de datos con almacenamiento local. La misma interfaz (TT.api) se conecta después a la base de datos de T.T.
   Semilla (datos iniciales) en semilla.js; ese archivo no se publica. */
window.TT = window.TT || {};
(function () {
  const KEY = 'tt_sistema_v3';
  const HOY = new Date().toISOString().slice(0, 10);

  const SOCIOS = [
    { id: 'carlos', nombre: 'Carlos Martínez', corto: 'Carlos', rol: 'Arquitectura de sistemas y software a la medida', ini: 'CM', color: 'c-carlos' },
    { id: 'alberto', nombre: 'Alberto Navarro', corto: 'Alberto', rol: 'Estrategia comercial, adquisición y marketing con IA', ini: 'AN', color: 'c-alberto' },
    { id: 'franco', nombre: 'Franco Sánchez', corto: 'Franco', rol: 'Dirección comercial y salud privada', ini: 'FS', color: 'c-franco' },
  ];

  const ETAPAS = [
    { id: 'contactado', nombre: 'Contactado' },
    { id: 'reunion', nombre: 'Reunión' },
    { id: 'muestra', nombre: 'Muestra' },
    { id: 'propuesta', nombre: 'Propuesta' },
    { id: 'auditoria', nombre: 'Auditoría' },
    { id: 'continuidad', nombre: 'Continuidad' },
  ];

  function vacio() { return { version: 1, socioActual: 'carlos', clientes: [], proyectos: [], tareas: [], cobros: [], actividad: [], demos: [], solicitudes: [] }; }
  function semilla() { return window.TT_SEMILLA ? window.TT_SEMILLA(HOY) : vacio(); }

  let estado = null;
  function cargar() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const d = JSON.parse(raw); if (d && d.version === 1) { estado = d; estado.demos = estado.demos || []; estado.solicitudes = estado.solicitudes || []; return estado; } }
    } catch (e) { /* almacenamiento no disponible */ }
    estado = semilla(); guardar(); return estado;
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch (e) { /* sin persistencia */ } }
  const uid = (p) => p + '-' + Math.random().toString(36).slice(2, 8);

  /* ---------- nube de T.T (Supabase): misma interfaz, escritura directa ---------- */
  const CFG = window.TT_CONFIG || {};
  const remoto = (CFG.url && CFG.key && window.supabase) ? window.supabase.createClient(CFG.url, CFG.key) : null;
  const ahora = () => new Date().toISOString();
  const aFila = {
    cliente: (c) => ({ id: c.id, nombre: c.nombre, giro: c.giro || '', contacto: c.contacto || '', origen: c.origen || '', etapa: c.etapa, responsable: c.responsable || null, valor: c.valor ?? null, moneda: c.moneda || 'MXN', mensualidad: c.mensualidad || '', siguiente_texto: (c.siguiente && c.siguiente.texto) || '', siguiente_fecha: (c.siguiente && c.siguiente.fecha) || null, notas: c.notas || '', enlaces: c.enlaces || [], creado: c.creado || HOY, actualizado: ahora() }),
    proyecto: (p) => ({ id: p.id, cliente_id: p.clienteId || null, nombre: p.nombre, tipo: p.tipo || 'Proyecto', estado: p.estado || 'activo', responsable: p.responsable || null, entrega: p.entrega || null, fases: p.fases || [], actualizado: ahora() }),
    tarea: (t) => ({ id: t.id, texto: t.texto, socio: t.socio || null, cliente_id: t.clienteId || null, proyecto_id: t.proyectoId || null, vence: t.vence || null, hecha: !!t.hecha, hecha_el: t.hechaEl || null, importante: !!t.importante, notas: t.notas || '' }),
    demo: (d) => ({ id: d.id, cliente_id: d.clienteId || null, nombre: d.nombre, tipo: d.tipo || 'app', url: d.url || '', ruta: d.ruta || '', descripcion: d.descripcion || '', estado: d.estado || 'publicado', publicado: d.publicado || null, orden: d.orden || 0, actualizado: ahora() }),
    cobro: (c) => ({ id: c.id, cliente_id: c.clienteId, concepto: c.concepto, tipo: c.tipo, monto: c.monto, moneda: c.moneda || 'MXN', fecha: c.fecha || null, estado: c.estado, pagado: c.pagado || null, actualizado: ahora() }),
    actividad: (a) => ({ id: a.id, cliente_id: a.clienteId || null, fecha: a.fecha || HOY, socio: a.socio || null, tipo: a.tipo, texto: a.texto }),
    solicitud: (x) => ({ id: x.id, atendida: !!x.atendida, cliente_id: x.clienteId || null }),
  };
  const deFila = {
    cliente: (r) => ({ id: r.id, nombre: r.nombre, giro: r.giro || '', contacto: r.contacto || '', origen: r.origen || '', etapa: r.etapa, responsable: r.responsable, valor: r.valor == null ? null : Number(r.valor), moneda: r.moneda || 'MXN', mensualidad: r.mensualidad || '', siguiente: { texto: r.siguiente_texto || '', fecha: r.siguiente_fecha || null }, notas: r.notas || '', enlaces: r.enlaces || [], creado: r.creado }),
    proyecto: (r) => ({ id: r.id, clienteId: r.cliente_id, nombre: r.nombre, tipo: r.tipo, estado: r.estado, responsable: r.responsable, entrega: r.entrega, fases: r.fases || [] }),
    tarea: (r) => ({ id: r.id, texto: r.texto, socio: r.socio, clienteId: r.cliente_id || undefined, proyectoId: r.proyecto_id || undefined, vence: r.vence, hecha: !!r.hecha, hechaEl: r.hecha_el || undefined, importante: !!r.importante, notas: r.notas || '' }),
    demo: (r) => ({ id: r.id, clienteId: r.cliente_id || null, nombre: r.nombre, tipo: r.tipo, url: r.url || '', ruta: r.ruta || '', descripcion: r.descripcion || '', estado: r.estado, publicado: r.publicado || null, orden: r.orden || 0 }),
    cobro: (r) => ({ id: r.id, clienteId: r.cliente_id, concepto: r.concepto, tipo: r.tipo, monto: Number(r.monto), moneda: r.moneda || 'MXN', fecha: r.fecha, estado: r.estado, pagado: r.pagado || undefined }),
    actividad: (r) => ({ id: r.id, clienteId: r.cliente_id, fecha: r.fecha, socio: r.socio, tipo: r.tipo, texto: r.texto }),
    solicitud: (r) => ({ id: r.id, tipo: r.tipo, nombre: r.nombre, empresa: r.empresa || '', contacto: r.contacto, mensaje: r.mensaje || '', giro: r.giro || '', quiere: r.quiere || [], usuarios: r.usuarios || '', conexiones: r.conexiones || [], plazo: r.plazo || '', estimado: { desde: r.estimado_desde == null ? null : Number(r.estimado_desde), hasta: r.estimado_hasta == null ? null : Number(r.estimado_hasta), mensual: r.estimado_mensual == null ? null : Number(r.estimado_mensual) }, semanas: r.semanas || null, resumen: r.resumen || '', origen: r.origen || '', atendida: !!r.atendida, clienteId: r.cliente_id || null, creado: r.creado }),
  };
  const TABLA = { cliente: 'clientes', proyecto: 'proyectos', tarea: 'tareas', cobro: 'cobros', actividad: 'actividad', demo: 'demos', solicitud: 'solicitudes' };
  async function enviar(tipo, obj) {
    if (!remoto) return;
    const { error } = await remoto.from(TABLA[tipo]).upsert(aFila[tipo](obj));
    if (error) { console.error('nube', tipo, error); TT.onError && TT.onError('No se guardó en la nube: ' + error.message); }
  }
  // La bandeja del sitio. Se lee aparte y con tolerancia: si la tabla no existe todavía,
  // el sistema sigue funcionando igual (solo no hay solicitudes).
  async function traerSolicitudes() {
    if (!remoto) return [];
    const { data, error } = await remoto.from('solicitudes').select('*').order('creado', { ascending: false }).limit(300);
    if (error) { console.warn('solicitudes:', error.message); return []; }
    return data || [];
  }
  async function parchar(tipo, id, campos) {
    if (!remoto) return;
    const { error } = await remoto.from(TABLA[tipo]).update(campos).eq('id', id);
    if (error) { console.error('nube', tipo, error); TT.onError && TT.onError('No se guardó en la nube: ' + error.message); }
  }
  async function borrar(tipo, id) {
    if (!remoto) return; const { error } = await remoto.from(TABLA[tipo]).delete().eq('id', id);
    if (error) { console.error('nube', tipo, error); TT.onError && TT.onError('No se borró en la nube: ' + error.message); }
  }
  async function detalleError(error) {
    try { if (error && error.context && typeof error.context.json === 'function') { const j = await error.context.json(); if (j && j.error) return j.error; } } catch (e) { /* sin detalle */ }
    return (error && error.message) || 'No se pudo conectar con la nube';
  }
  TT.nube = {
    activa: !!remoto,
    tieneSemilla: !!window.TT_SEMILLA,
    async sesion() { if (!remoto) return null; const { data } = await remoto.auth.getSession(); return data.session; },
    async entrar(email, password) { const { data, error } = await remoto.auth.signInWithPassword({ email, password }); if (error) throw error; return data.session; },
    async salir() { if (remoto) await remoto.auth.signOut(); },
    async entrarConPin(socio, pin) {
      const { data, error } = await remoto.functions.invoke('acceso', { body: { accion: 'entrar', socio, pin } });
      if (error) throw new Error(await detalleError(error));
      if (!data || !data.token_hash) throw new Error('El servidor no devolvió el acceso');
      const { data: v, error: e2 } = await remoto.auth.verifyOtp({ token_hash: data.token_hash, type: 'magiclink' });
      if (e2) throw e2;
      return v.session;
    },
    async cambiarPin(socio, pin, pin_nuevo) {
      const { data, error } = await remoto.functions.invoke('acceso', { body: { accion: 'cambiar_pin', socio, pin, pin_nuevo } });
      if (error) throw new Error(await detalleError(error));
      return data;
    },
    async cargar() {
      const q = (t) => remoto.from(t).select('*');
      const res = await Promise.all([q('socios'), q('clientes'), q('proyectos'), q('tareas'), q('cobros'), q('actividad'), q('demos')]);
      const malo = res.find(r => r.error); if (malo) throw malo.error;
      if (!res[0].data || res[0].data.length === 0) { const e = new Error('Tu correo no está en la lista de socios de T.T. Pídele a Carlos que lo agregue.'); e.code = 'no_autorizado'; throw e; }
      const [s, c, p, t, co, a, dm] = res.map(r => r.data || []);
      const sol = await traerSolicitudes();
      s.forEach(r => { const so = SOCIOS.find(x => x.id === r.id); if (so) so.email = r.email || null; });
      estado = { version: 1, socioActual: (estado && estado.socioActual) || 'carlos', clientes: c.map(deFila.cliente), proyectos: p.map(deFila.proyecto), tareas: t.map(deFila.tarea), cobros: co.map(deFila.cobro), actividad: a.map(deFila.actividad).sort((x, y) => String(y.fecha).localeCompare(String(x.fecha))), demos: dm.map(deFila.demo).sort((x, y) => (x.orden - y.orden) || String(x.nombre).localeCompare(String(y.nombre))), solicitudes: sol.map(deFila.solicitud) };
      guardar(); return estado;
    },
    vacia() { return !!estado && estado.clientes.length === 0 && estado.proyectos.length === 0; },
    async sembrar() {
      const sem = semilla();
      for (const c of sem.clientes) await enviar('cliente', c);
      for (const p of sem.proyectos) await enviar('proyecto', p);
      for (const t of sem.tareas) await enviar('tarea', t);
      for (const c of sem.cobros) await enviar('cobro', c);
      for (const a of sem.actividad) await enviar('actividad', a);
      for (const d of (sem.demos || [])) await enviar('demo', d);
      return this.cargar();
    },
    escuchar(fn) {
      if (!remoto) return; let timer;
      remoto.channel('tt-cambios').on('postgres_changes', { event: '*', schema: 'public' }, () => { clearTimeout(timer); timer = setTimeout(async () => { try { await TT.nube.cargar(); fn && fn(); } catch (e) { console.error(e); } }, 400); }).subscribe();
    },
  };

  TT.SOCIOS = SOCIOS; TT.ETAPAS = ETAPAS; TT.HOY = HOY;
  TT.db = () => estado || cargar();
  TT.api = {
    cargar,
    reiniciar() { estado = semilla(); guardar(); return estado; },
    socio(id) { return SOCIOS.find(s => s.id === id) || SOCIOS[0]; },
    setSocioActual(id) { estado.socioActual = id; guardar(); },
    cliente(id) { return estado.clientes.find(c => c.id === id); },
    proyecto(id) { return estado.proyectos.find(p => p.id === id); },
    guardarCliente(c) {
      if (!c.id) { c.id = uid('cli'); c.creado = HOY; estado.clientes.push(c); }
      else { const i = estado.clientes.findIndex(x => x.id === c.id); estado.clientes[i] = c; }
      guardar(); enviar('cliente', c); return c;
    },
    moverEtapa(id, etapa) { const c = this.cliente(id); if (c) { c.etapa = etapa; guardar(); enviar('cliente', c); this.registrar({ clienteId: id, tipo: 'etapa', texto: 'Pasó a ' + (ETAPAS.find(e => e.id === etapa) || {}).nombre }); } },
    registrar(a) { a.id = uid('act'); a.fecha = a.fecha || HOY; a.socio = a.socio || estado.socioActual; estado.actividad.unshift(a); guardar(); enviar('actividad', a); return a; },
    guardarTarea(t) { if (!t.id) { t.id = uid('tar'); estado.tareas.push(t); } else { const i = estado.tareas.findIndex(x => x.id === t.id); if (i >= 0) estado.tareas[i] = t; } guardar(); enviar('tarea', t); return t; },
    tarea(id) { return estado.tareas.find(x => x.id === id); },
    borrarTarea(id) { estado.tareas = estado.tareas.filter(x => x.id !== id); guardar(); borrar('tarea', id); },
    toggleImportante(id) { const t = estado.tareas.find(x => x.id === id); if (t) { t.importante = !t.importante; guardar(); enviar('tarea', t); } return t; },
    demo(id) { return (estado.demos || []).find(x => x.id === id); },
    guardarDemo(d) { estado.demos = estado.demos || []; if (!d.id) { d.id = uid('dm'); estado.demos.push(d); } else { const i = estado.demos.findIndex(x => x.id === d.id); if (i >= 0) estado.demos[i] = d; } guardar(); enviar('demo', d); return d; },
    borrarDemo(id) { estado.demos = (estado.demos || []).filter(x => x.id !== id); guardar(); borrar('demo', id); },
    toggleTarea(id) { const t = estado.tareas.find(x => x.id === id); if (t) { t.hecha = !t.hecha; t.hechaEl = t.hecha ? HOY : undefined; guardar(); enviar('tarea', t); } return t; },
    toggleItem(pid, fi, ii) { const p = this.proyecto(pid); const it = p && p.fases[fi] && p.fases[fi].items[ii]; if (it) { it.ok = !it.ok; it.f = it.ok ? HOY : undefined; guardar(); enviar('proyecto', p); } return it; },
    guardarProyecto(p) { if (!p.id) { p.id = uid('pro'); estado.proyectos.push(p); } guardar(); enviar('proyecto', p); return p; },
    guardarCobro(c) { if (!c.id) { c.id = uid('cob'); estado.cobros.push(c); } else { const i = estado.cobros.findIndex(x => x.id === c.id); estado.cobros[i] = c; } guardar(); enviar('cobro', c); return c; },
    marcarPagado(id) { const c = estado.cobros.find(x => x.id === id); if (c) { c.estado = 'pagado'; c.pagado = HOY; guardar(); enviar('cobro', c); } return c; },

    /* Lo que llega del sitio web */
    solicitud(id) { return (estado.solicitudes || []).find(x => x.id === id); },
    sinAtender() { return (estado.solicitudes || []).filter(s => !s.atendida).length; },
    atenderSolicitud(id, atendida = true) {
      const s = this.solicitud(id); if (!s) return null;
      s.atendida = atendida; guardar(); parchar('solicitud', id, { atendida });
      return s;
    },
    // Una solicitud se vuelve cliente: se abre la ficha y todo lo que escribió queda en su actividad.
    solicitudACliente(id) {
      const s = this.solicitud(id); if (!s || s.clienteId) return null;
      const cliente = this.guardarCliente({
        nombre: s.empresa || s.nombre,
        giro: s.giro || '',
        contacto: `${s.nombre} · ${s.contacto}`,
        origen: 'Sitio web',
        etapa: 'contactado',
        responsable: estado.socioActual,
        valor: (s.estimado && s.estimado.hasta) || null,
        moneda: 'MXN',
        mensualidad: (s.estimado && s.estimado.mensual) ? String(s.estimado.mensual) : '',
        siguiente: { texto: 'Contestar la solicitud del sitio', fecha: HOY },
        notas: s.resumen || '',
        enlaces: [],
      });
      this.registrar({ clienteId: cliente.id, tipo: 'mensaje', texto: s.resumen || (s.mensaje || 'Solicitud desde el sitio') });
      s.clienteId = cliente.id; s.atendida = true;
      guardar(); parchar('solicitud', id, { atendida: true, cliente_id: cliente.id });
      return cliente;
    },
  };
  TT.avance = (p) => { const items = p.fases.flatMap(f => f.items); const ok = items.filter(i => i.ok).length; return items.length ? Math.round(ok / items.length * 100) : 0; };
})();
