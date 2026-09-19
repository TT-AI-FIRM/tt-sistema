/* T.T AI Firm · Sistema interno · interfaz */
(function () {
  const api = TT.api; let db = api.cargar();
  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- iconos ---------- */
  const P = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
  const ICONS = {
    home: P('<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),
    users: P('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M17.5 14a6 6 0 0 1 4 6"/>'),
    folder: P('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    wallet: P('<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1"/>'),
    team: P('<circle cx="12" cy="7" r="3"/><circle cx="5" cy="10" r="2.2"/><circle cx="19" cy="10" r="2.2"/><path d="M7 20a5 5 0 0 1 10 0"/><path d="M1.5 18a3.5 3.5 0 0 1 4-3.4"/><path d="M22.5 18a3.5 3.5 0 0 0-4-3.4"/>'),
    search: P('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.8-3.8"/>'),
    bell: P('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    out: P('<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m15 8 4 4-4 4"/><path d="M19 12H9"/>'),
    x: P('<path d="m6 6 12 12M18 6 6 18"/>'),
    plus: P('<path d="M12 5v14M5 12h14"/>'),
    more: P('<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>'),
    check: P('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    arrow: P('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
    clock: P('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    link: P('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>'),
    doc: P('<path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>'),
    spark: P('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>'),
    calendar: P('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    edit: P('<path d="m4 20 4-1L19.5 7.5a2 2 0 0 0-3-3L5 16z"/>'),
    recent: P('<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/><path d="M12 8v4l3 2"/>'),
    star: P('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    box: P('<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4M12 11v10"/>'),
    gift: P('<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1s6 1 6 1c2-4 6-4 6-1s-6 1-6 1"/>'),
    chat: P('<path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 4z"/>'),
    bank: P('<path d="M3 10 12 4l9 6H3z"/><path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/>'),
  };
  function iconos(root = document) { $$('[data-icon]', root).forEach(el => { if (!el.innerHTML) el.innerHTML = ICONS[el.dataset.icon] || ''; }); }
  const ic = (n) => `<span class="ic">${ICONS[n] || ''}</span>`;

  /* ---------- formato ---------- */
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const money = (n, m = 'MXN') => n == null ? '—' : '$' + Number(n).toLocaleString('es-MX') + (m === 'USD' ? ' USD' : '');
  const fdate = (s) => { if (!s) return '—'; const [y, mo, d] = s.split('-').map(Number); return `${d} ${MESES[mo - 1]}` + (y !== new Date().getFullYear() ? ` ${y}` : ''); };
  const dias = (s) => Math.round((new Date(s + 'T12:00') - new Date(TT.HOY + 'T12:00')) / 86400000);
  const rel = (s) => { if (!s) return 'sin fecha'; const d = dias(s); if (d === 0) return 'hoy'; if (d === 1) return 'mañana'; if (d < 0) return `vencida hace ${-d} d`; return `en ${d} d`; };
  const etapaN = (id) => (TT.ETAPAS.find(e => e.id === id) || { nombre: id }).nombre;
  const socioN = (id) => api.socio(id);
  const av = (s) => `<span class="avatar ${s.color}" title="${esc(s.nombre)}">${s.ini}</span>`;
  const avCli = (c) => `<span class="avatar c-cli">${esc(c.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase())}</span>`;
  const chipEstado = (e) => ({ propuesta: '<span class="chip gray">Propuesta</span>', programado: '<span class="chip blue">Programado</span>', vencido: '<span class="chip red">Vencido</span>', pagado: '<span class="chip green">Pagado</span>' }[e] || esc(e));
  const chipTipo = (t) => ({ anticipo: 'Anticipo', hito: 'Hito', mensualidad: 'Mensualidad' }[t] || t);
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.hidden = false; requestAnimationFrame(() => t.classList.add('is-on')); clearTimeout(toast._t); toast._t = setTimeout(() => { t.classList.remove('is-on'); setTimeout(() => t.hidden = true, 220); }, 2200); };

  /* ---------- cálculos ---------- */
  const abiertas = (sid) => db.tareas.filter(t => !t.hecha && (!sid || t.socio === sid));
  const vencidas = (sid) => abiertas(sid).filter(t => t.vence && dias(t.vence) < 0);
  const cobroEstado = (c) => (c.estado === 'programado' && c.fecha && dias(c.fecha) < 0) ? 'vencido' : c.estado;
  const totales = () => {
    const t = { propuesto: 0, porCobrar: 0, vencido: 0, pagado: 0 };
    db.cobros.forEach(c => { const e = cobroEstado(c); if (e === 'propuesta') t.propuesto += c.monto; else if (e === 'programado') t.porCobrar += c.monto; else if (e === 'vencido') { t.porCobrar += c.monto; t.vencido += c.monto; } else if (e === 'pagado') t.pagado += c.monto; });
    return t;
  };
  const pipeline = () => db.clientes.filter(c => c.valor).reduce((s, c) => s + c.valor, 0);
  const avanceGlobal = () => { const items = db.proyectos.filter(p => p.estado !== 'espera').flatMap(p => p.fases.flatMap(f => f.items)); const ok = items.filter(i => i.ok).length; return { ok, total: items.length, pct: items.length ? Math.round(ok / items.length * 100) : 0 }; };

  /* ---------- gráfica ---------- */
  function serieDias(n) {
    const out = []; for (let i = n - 1; i >= 0; i--) { const d = new Date(TT.HOY + 'T12:00'); d.setDate(d.getDate() - i); out.push(d.toISOString().slice(0, 10)); } return out;
  }
  function chart() {
    const dd = serieDias(14);
    const act = dd.map(d => db.actividad.filter(a => a.fecha === d).length);
    const ent = dd.map(d => db.proyectos.flatMap(p => p.fases.flatMap(f => f.items)).filter(i => i.ok && i.f === d).length);
    const tar = dd.map(d => db.tareas.filter(t => t.hecha && t.hechaEl === d).length);
    const W = 560, H = 150, pad = 8, max = Math.max(3, ...act, ...ent, ...tar);
    const x = (i) => pad + i * (W - pad * 2) / (dd.length - 1), y = (v) => H - pad - v * (H - pad * 2) / max;
    const path = (arr) => { const pts = arr.map((v, i) => [x(i), y(v)]); let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; } return d; };
    const grid = [0.25, 0.5, 0.75].map(f => `<line class="gridline" x1="${pad}" x2="${W - pad}" y1="${y(max * f)}" y2="${y(max * f)}"/>`).join('') + dd.map((_, i) => i % 2 ? '' : `<line class="gridline" y1="${pad}" y2="${H - pad}" x1="${x(i)}" x2="${x(i)}"/>`).join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Actividad de los últimos 14 días">${grid}
      <path class="area" d="${path(act)} L${x(dd.length - 1)},${H - pad} L${x(0)},${H - pad}Z" fill="var(--accent)"/>
      <path class="line" data-draw d="${path(act)}" stroke="var(--accent)"/>
      <path class="line" data-draw d="${path(ent)}" stroke="var(--blue)"/>
      <path class="line" data-draw d="${path(tar)}" stroke="var(--amber)"/></svg>
      <div class="legend"><span><i style="background:var(--accent)"></i>Actividad con clientes</span><span><i style="background:var(--blue)"></i>Entregables listos</span><span><i style="background:var(--amber)"></i>Tareas cerradas</span></div>`;
  }
  let chartDibujada = false;
  function animarChart(root) {
    if (chartDibujada || matchMedia('(prefers-reduced-motion: reduce)').matches) return; chartDibujada = true;
    $$('[data-draw]', root).forEach((p, i) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 900, delay: i * 120, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'forwards' }); });
  }

  /* ---------- vistas ---------- */
  const yo = () => socioN(db.socioActual);
  let filtroHoy = 'mios';

  const TIPOS_DEMO = { landing: 'Landing', app: 'App', sistema: 'Sistema', documento: 'Documento' };
  const ordenTarea = (a, b) => ((b.importante ? 1 : 0) - (a.importante ? 1 : 0)) || (a.vence || '9').localeCompare(b.vence || '9');
  function tarjetaDemo(d) {
    const c = d.clienteId ? api.cliente(d.clienteId) : null; const cls = d.tipo === 'documento' ? 'gray' : d.tipo === 'sistema' ? 'green' : d.tipo === 'landing' ? 'accent' : 'blue';
    return `<div class="demo"><div class="demo-top"><span class="chip ${cls}">${TIPOS_DEMO[d.tipo] || esc(d.tipo)}</span>${d.estado !== 'publicado' ? `<span class="chip amber">${d.estado === 'borrador' ? 'Borrador' : 'En pausa'}</span>` : ''}</div><div class="demo-name">${esc(d.nombre)}</div><div class="demo-sub">${esc(c ? c.nombre : 'T.T AI Firm')}${d.publicado ? ' · ' + fdate(d.publicado) : ''}</div>${d.descripcion ? `<div class="demo-desc">${esc(d.descripcion)}</div>` : ''}<div class="demo-acts">${d.url ? `<a class="btn sm primary" href="${esc(d.url)}" target="_blank" rel="noopener">${ic('link')}Abrir</a><button class="btn sm" data-copy="${esc(d.url)}">Copiar enlace</button>` : ''}${d.ruta ? `<button class="btn sm" data-copy="${esc(d.ruta)}" title="${esc(d.ruta)}">${ic('doc')}Copiar ruta</button>` : ''}<button class="icon-btn" style="width:34px;height:34px;margin-left:auto" data-edit-demo="${d.id}" aria-label="Editar">${ic('edit')}</button></div></div>`;
  }
  function vInicio() {
    const s = yo(); const t = totales(); const misHoy = abiertas(db.socioActual).filter(x => !x.vence || dias(x.vence) <= 0).sort(ordenTarea); const venc = vencidas(null);
    const prox = db.clientes.filter(c => c.siguiente?.fecha).sort((a, b) => a.siguiente.fecha.localeCompare(b.siguiente.fecha)).slice(0, 4);
    const demos = (db.demos || []).filter(d => d.estado === 'publicado' && d.url).slice(0, 6);
    const acts = [...db.actividad].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 7);
    const porEtapa = TT.ETAPAS.map(e => ({ e, n: db.clientes.filter(c => c.etapa === e.id).length }));
    return `<div class="hero-line"><div><div class="eyebrow">${fdate(TT.HOY)}</div><h2>Hola, ${esc(s.corto)}</h2></div><div class="chips-row"><span class="chip ${misHoy.length ? 'accent' : 'gray'}">${misHoy.length} para hoy</span>${venc.length ? `<span class="chip red">${venc.length} vencida${venc.length === 1 ? '' : 's'} del equipo</span>` : ''}<span class="chip">${db.clientes.filter(c => c.etapa === 'propuesta').length} en propuesta</span><button class="btn primary sm" data-action="registrar-actividad">${ic('plus')}Registrar actividad</button></div></div>
    <div class="grid">
      <section class="card col-4"><div class="card-head"><h3>Mis pendientes</h3><button class="row-btn" data-view-go="pendientes">Todos</button></div>
        <form data-form="tarea" class="quick"><input type="hidden" name="socio" value="${db.socioActual}"><input type="hidden" name="vence" value="${TT.HOY}"><input class="input" name="texto" placeholder="Agregar pendiente para hoy…" required><button class="icon-btn" type="submit" aria-label="Agregar">${ic('plus')}</button></form>
        <div class="list stagger">${misHoy.length ? misHoy.slice(0, 8).map((x, i) => filaTarea(x, i)).join('') : '<div class="empty">Nada pendiente para hoy.</div>'}</div></section>
      <section class="card col-4"><div class="card-head"><h3>Pipeline</h3><button class="row-btn" data-view-go="clientes">Embudo</button></div><div class="kpi small">${money(pipeline())}</div><div class="muted small">${db.clientes.length} cuentas · valor propuesto sin IVA</div>
        <div class="etapas">${porEtapa.map(x => `<div class="et"><span>${esc(x.e.nombre)}</span><i style="--w:${db.clientes.length ? (x.n / db.clientes.length).toFixed(3) : 0}"></i><b>${x.n}</b></div>`).join('')}</div>
        <div class="section-title" style="margin-top:16px">Siguientes pasos</div><div class="list">${prox.map(c => `<div class="row clickable" data-open="cliente" data-id="${c.id}">${avCli(c)}<div class="grow"><div class="title"><span class="t">${esc(c.nombre)}</span></div><div class="sub">${esc(c.siguiente.texto)}</div></div><span class="chip ${dias(c.siguiente.fecha) < 0 ? 'red' : 'gray'}">${rel(c.siguiente.fecha)}</span></div>`).join('') || '<div class="empty">Sin fechas.</div>'}</div></section>
      <section class="col-4" style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="card-head"><h3>Equipo</h3><button class="row-btn" data-view-go="equipo">Ver</button></div><div class="list">${TT.SOCIOS.map(so => { const ab = abiertas(so.id), ve = vencidas(so.id); return `<div class="row">${av(so)}<div class="grow"><div class="title"><span class="t">${esc(so.corto)}</span></div><div class="sub">${ab.length} pendiente${ab.length === 1 ? '' : 's'}${ve.length ? ` · <span style="color:var(--red)">${ve.length} vencida${ve.length === 1 ? '' : 's'}</span>` : ''}</div></div>${so.id === db.socioActual ? '<span class="chip accent">Tú</span>' : ''}</div>`; }).join('')}</div></div>
        <div class="card wallet"><div class="card-head" style="margin-bottom:0"><span class="chip">${ic('wallet')} Cobranza</span><button class="icon-btn" style="width:36px;height:36px" data-view-go="cobranza" title="Ver cobranza">${ic('arrow')}</button></div><div><div class="muted small">Por cobrar</div><div class="kpi">${money(t.porCobrar)}</div><div class="small muted" style="margin-top:6px">${t.vencido ? `<b style="color:var(--red)">${money(t.vencido)} vencido</b> · ` : ''}Propuesto sin firmar: <b style="color:var(--text)">${money(t.propuesto)}</b></div></div></div></section>
      <section class="card col-8"><div class="card-head"><h3>Demos y páginas</h3><button class="row-btn" data-view-go="demos">Ver todos · ${(db.demos || []).length}</button></div><div class="demo-grid">${demos.map(tarjetaDemo).join('') || '<div class="empty">Sin demos publicados.</div>'}</div></section>
      <section class="card col-4"><div class="card-head"><h3>Actividad reciente</h3></div><ul class="timeline">${acts.map(a => { const c = a.clienteId ? api.cliente(a.clienteId) : null; return `<li><span class="d">${fdate(a.fecha)}</span><div>${esc(a.texto)}<div class="who">${c ? esc(c.nombre) + ' · ' : ''}${socioN(a.socio).corto}</div></div></li>`; }).join('') || '<li><span class="d"></span><span class="muted">Nada todavía.</span></li>'}</ul></section>
    </div>`;
  }
  function filaTarea(x, i = 0, full = false) {
    const s = socioN(x.socio); const ref = x.clienteId ? api.cliente(x.clienteId)?.nombre : x.proyectoId ? api.proyecto(x.proyectoId)?.nombre : '';
    const venc = x.vence && dias(x.vence) < 0 && !x.hecha;
    return `<div class="row tarea ${x.importante ? 'imp' : ''}" style="--i:${i}"><button class="check ${x.hecha ? 'on' : ''}" data-toggle-tarea="${x.id}" aria-label="Marcar">${ICONS.check}</button><div class="grow clickable" data-edit-tarea="${x.id}"><div class="title"><span class="t" ${x.hecha ? 'style="text-decoration:line-through;color:var(--muted)"' : ''}>${esc(x.texto)}</span></div><div class="sub">${esc(ref || 'General')} · ${s.corto} · <span style="color:${venc ? 'var(--red)' : 'inherit'}">${x.hecha && x.hechaEl ? 'hecha ' + fdate(x.hechaEl) : rel(x.vence)}</span>${x.notas ? ' · ' + esc(x.notas) : ''}</div></div>${full ? av(s) : ''}<button class="star ${x.importante ? 'on' : ''}" data-importante="${x.id}" aria-label="Importante">${ICONS.star}</button></div>`;
  }
  function botonEtapa(c) {
    const i = TT.ETAPAS.findIndex(e => e.id === c.etapa); const sig = TT.ETAPAS[i + 1];
    return sig ? `<button class="row-btn" data-etapa="${c.id}:${sig.id}" title="Pasar a ${esc(sig.nombre)}">Avanzar</button>` : `<span class="chip green">Activo</span>`;
  }

  let etapaIdx = 0;
  const esMovil = () => matchMedia('(max-width:900px)').matches;
  const kcardHTML = (c) => `<div class="kcard" data-open="cliente" data-id="${c.id}"><div class="name">${esc(c.nombre)}</div><div class="meta">${esc(c.giro)}</div><div class="foot"><span class="small" style="color:var(--text-2)">${c.valor ? money(c.valor) : '<span class="muted">sin precio</span>'}</span>${av(socioN(c.responsable))}</div>${c.siguiente?.fecha ? `<div class="meta" style="margin-top:8px">${ic('clock')} ${esc(rel(c.siguiente.fecha))}</div>` : ''}</div>`;
  function vClientes() {
    const head = `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Embudo</div><h2 style="margin-top:4px">${db.clientes.length} cuentas · ${money(pipeline())} propuestos</h2></div><button class="btn primary" data-action="nuevo-cliente">${ic('plus')}Nuevo cliente</button></div>`;
    if (!esMovil()) return head + `<div class="kanban">${TT.ETAPAS.map(e => { const cs = db.clientes.filter(c => c.etapa === e.id); return `<div class="kcol"><h4>${esc(e.nombre)}<span class="chip gray" style="height:22px">${cs.length}</span></h4>${cs.map(kcardHTML).join('') || '<div class="empty" style="padding:18px 8px">Vacío</div>'}</div>`; }).join('')}</div>`;
    // celular: una etapa a la vez, con flechas, puntos y deslizamiento lateral (sin scroll horizontal)
    etapaIdx = Math.max(0, Math.min(TT.ETAPAS.length - 1, etapaIdx)); const e = TT.ETAPAS[etapaIdx]; const cs = db.clientes.filter(c => c.etapa === e.id);
    return head + `<div class="pager"><button class="icon-btn" data-etapa-nav="-1" aria-label="Etapa anterior"><span class="ic" style="transform:rotate(180deg)">${ICONS.arrow}</span></button><div class="pager-title"><div class="eyebrow">Etapa ${etapaIdx + 1} de ${TT.ETAPAS.length}</div><h3 style="font-size:18px;margin-top:2px">${esc(e.nombre)} <span class="chip gray" style="height:22px;vertical-align:3px">${cs.length}</span></h3></div><button class="icon-btn" data-etapa-nav="1" aria-label="Etapa siguiente">${ic('arrow')}</button></div>
      <div class="dots" aria-hidden="true">${TT.ETAPAS.map((x, k) => `<button class="${k === etapaIdx ? 'on' : ''}" data-etapa-go="${k}" title="${esc(x.nombre)}"></button>`).join('')}</div>
      <div class="kpage"><div class="kcol">${cs.map(kcardHTML).join('') || '<div class="empty" style="padding:26px 8px">Nadie en esta etapa.</div>'}</div></div>
      <p class="muted small" style="text-align:center;margin-top:10px">Desliza a los lados o usa las flechas para cambiar de etapa.</p>`;
  }

  function vProyectos() {
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Proyectos</div><h2 style="margin-top:4px">${db.proyectos.filter(p => p.estado === 'activo').length} activos</h2></div><button class="btn" data-action="nuevo-proyecto">${ic('plus')}Nuevo proyecto</button></div>
    <div class="grid">${db.proyectos.map(p => { const pct = TT.avance(p); const cli = p.clienteId ? api.cliente(p.clienteId) : null; const sig = p.fases.flatMap(f => f.items).find(i => !i.ok); return `<div class="card col-6 kcard" style="margin:0;border-radius:var(--r-lg)" data-open="proyecto" data-id="${p.id}">
      <div class="card-head" style="margin-bottom:8px"><div><div class="muted small">${esc(cli ? cli.nombre : 'Interno')} · ${esc(p.tipo)}</div><h3 style="font-size:18px;margin-top:2px">${esc(p.nombre)}</h3></div>${p.estado === 'activo' ? '<span class="chip green">Activo</span>' : p.estado === 'espera' ? '<span class="chip amber">En espera</span>' : '<span class="chip gray">Listo</span>'}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin:12px 0 8px"><div class="progress" style="flex:1"><i style="--p:${(pct / 100).toFixed(3)}"></i></div><b class="small">${pct}%</b></div>
      <div class="small muted">${sig ? 'Siguiente: ' + esc(sig.t) : 'Todo entregado'}${p.entrega ? ` · entrega ${fdate(p.entrega)}` : ''}</div></div>`; }).join('')}</div>`;
  }

  function vCobranza() {
    const t = totales(); const filas = [...db.cobros].sort((a, b) => (a.fecha || '9').localeCompare(b.fecha || '9'));
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Cobranza</div><h2 style="margin-top:4px">Lo programado, lo vencido y lo propuesto</h2></div><button class="btn" data-action="nuevo-cobro">${ic('plus')}Nuevo cobro</button></div>
    <div class="grid" style="margin-bottom:16px">${[['Por cobrar', t.porCobrar, ''], ['Vencido', t.vencido, t.vencido ? 'color:var(--red)' : ''], ['Pagado', t.pagado, t.pagado ? 'color:var(--green)' : ''], ['Propuesto sin firmar', t.propuesto, 'color:var(--muted)']].map(([l, v, st]) => `<div class="card col-3"><div class="muted small">${l}</div><div class="kpi small" style="margin-top:8px;${st}">${money(v)}</div></div>`).join('')}</div>
    <div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Cliente</th><th>Concepto</th><th>Tipo</th><th>Fecha</th><th class="num">Monto</th><th>Estado</th><th></th></tr></thead><tbody>
    ${filas.map(c => { const cli = api.cliente(c.clienteId); const e = cobroEstado(c); return `<tr><td>${esc(cli ? cli.nombre : '—')}</td><td>${esc(c.concepto)}</td><td><span class="chip gray">${chipTipo(c.tipo)}</span></td><td>${c.fecha ? fdate(c.fecha) : '<span class="muted">al firmar</span>'}</td><td class="num">${money(c.monto, c.moneda)}</td><td>${chipEstado(e)}</td><td style="text-align:right">${e === 'pagado' ? '' : e === 'propuesta' ? `<button class="row-btn" data-programar="${c.id}">Programar</button>` : `<button class="row-btn" data-pagado="${c.id}">Marcar pagado</button>`}</td></tr>`; }).join('') || '<tr><td colspan="7"><div class="empty">Sin cobros registrados.</div></td></tr>'}
    </tbody></table></div></div>`;
  }

  function vEquipo() {
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Equipo</div><h2 style="margin-top:4px">Tres socios, un solo tablero</h2></div><button class="btn" data-action="nuevo-tarea">${ic('plus')}Nueva tarea</button></div>
    <div class="grid">${TT.SOCIOS.map(s => { const ab = abiertas(s.id); const ve = vencidas(s.id); const cli = db.clientes.filter(c => c.responsable === s.id); return `<div class="card col-4">
      <div style="display:flex;gap:14px;align-items:center">${av(s).replace('class="avatar', 'style="width:52px;height:52px;font-size:16px" class="avatar')}<div><h3 style="font-size:18px">${esc(s.nombre)}</h3><div class="muted small">${esc(s.rol)}</div></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 12px"><span class="chip">${ab.length} pendientes</span>${ve.length ? `<span class="chip red">${ve.length} vencidas</span>` : ''}<span class="chip">${cli.length} cuenta${cli.length === 1 ? '' : 's'}</span></div>
      <div class="list stagger">${ab.slice(0, 6).map((x, i) => filaTarea(x, i)).join('') || '<div class="empty">Sin pendientes.</div>'}</div></div>`; }).join('')}</div>`;
  }

  let filtroDemo = 'todos';
  function vDemos() {
    const ds = db.demos || []; const cli = [{ id: 'tt', nombre: 'T.T AI Firm' }, ...db.clientes.filter(c => ds.some(d => d.clienteId === c.id))];
    const de = (c) => ds.filter(d => c.id === 'tt' ? !d.clienteId : d.clienteId === c.id);
    const grupos = cli.filter(c => filtroDemo === 'todos' || filtroDemo === c.id).map(c => ({ c, items: de(c) })).filter(g => g.items.length);
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Demos y páginas</div><h2 style="margin-top:4px">${ds.filter(d => d.estado === 'publicado').length} publicados · ${ds.filter(d => d.estado !== 'publicado').length} en borrador</h2></div><button class="btn primary" data-action="nuevo-demo">${ic('plus')}Agregar</button></div>
    <div class="seg" style="flex-wrap:wrap;height:auto;margin-bottom:16px"><button class="${filtroDemo === 'todos' ? 'is-on' : ''}" data-fd="todos">Todos</button>${cli.map(c => `<button class="${filtroDemo === c.id ? 'is-on' : ''}" data-fd="${c.id}">${esc(c.nombre)}</button>`).join('')}</div>
    ${grupos.map(g => `<div class="section-title" style="margin:6px 0 10px">${esc(g.c.nombre)} · ${g.items.length}</div><div class="demo-grid" style="margin-bottom:18px">${g.items.map(tarjetaDemo).join('')}</div>`).join('') || '<div class="empty">Nada con ese filtro.</div>'}
    <p class="muted small">Los enlaces abren en una pestaña nueva. Los documentos que viven en la Mac de Carlos traen su ruta para copiarla.</p>`;
  }
  let filtroPend = { socio: 'todos', hechas: false };
  function vPendientes() {
    const todas = db.tareas.filter(t => filtroPend.socio === 'todos' || t.socio === filtroPend.socio); const ab = todas.filter(t => !t.hecha).sort(ordenTarea); const hechas = todas.filter(t => t.hecha).sort((a, b) => (b.hechaEl || '').localeCompare(a.hechaEl || '')).slice(0, 15);
    const g = { venc: ab.filter(t => t.vence && dias(t.vence) < 0), hoy: ab.filter(t => t.vence && dias(t.vence) === 0), sem: ab.filter(t => t.vence && dias(t.vence) > 0 && dias(t.vence) <= 7), desp: ab.filter(t => t.vence && dias(t.vence) > 7), sin: ab.filter(t => !t.vence) };
    const bloque = (titulo, arr, cls) => arr.length ? `<div class="section-title" style="margin-top:16px;display:flex;align-items:center;gap:8px">${titulo} <span class="chip ${cls || 'gray'}" style="height:22px">${arr.length}</span></div><div class="list stagger">${arr.map((x, i) => filaTarea(x, i, true)).join('')}</div>` : '';
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Pendientes</div><h2 style="margin-top:4px">${ab.length} abierto${ab.length === 1 ? '' : 's'}${g.venc.length ? ` · <span style="color:var(--red)">${g.venc.length} vencido${g.venc.length === 1 ? '' : 's'}</span>` : ''}</h2></div><button class="btn primary" data-action="nuevo-tarea">${ic('plus')}Nueva tarea</button></div>
    <div class="card"><form data-form="tarea" class="quick"><input class="input" name="texto" placeholder="Qué hay que hacer…" required><select class="input" name="socio" style="width:auto;flex:none">${TT.SOCIOS.map(s => `<option value="${s.id}" ${s.id === db.socioActual ? 'selected' : ''}>${s.corto}</option>`).join('')}</select><input class="input" type="date" name="vence" value="${TT.HOY}" style="width:auto;flex:none"><button class="btn primary" type="submit">Agregar</button></form>
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div class="seg"><button class="${filtroPend.socio === 'todos' ? 'is-on' : ''}" data-pf="todos">Todos</button>${TT.SOCIOS.map(s => `<button class="${filtroPend.socio === s.id ? 'is-on' : ''}" data-pf="${s.id}">${s.corto}</button>`).join('')}</div><button class="row-btn" data-action="toggle-hechas">${filtroPend.hechas ? 'Ocultar hechas' : 'Ver hechas'}</button></div>
      ${bloque('Vencidas', g.venc, 'red')}${bloque('Hoy', g.hoy, 'accent')}${bloque('Esta semana', g.sem)}${bloque('Después', g.desp)}${bloque('Sin fecha', g.sin)}${!ab.length ? '<div class="empty" style="margin-top:14px">Todo al día.</div>' : ''}${filtroPend.hechas ? bloque('Hechas', hechas, 'green') : ''}</div>`;
  }
  function vMas() {
    const tiles = [['bell', 'Notificaciones', 'data-view-go="avisos"'], ['folder', 'Proyectos', 'data-view-go="proyectos"'], ['wallet', 'Cobranza', 'data-view-go="cobranza"'], ['team', 'Equipo', 'data-view-go="equipo"'], ['chat', 'Registrar actividad', 'data-action="registrar-actividad"'], ['search', 'Buscar', 'data-action="buscar"']].concat(TT.nube.activa ? [['edit', 'Cambiar mi PIN', 'data-action="cambiar-pin"']] : []).concat([['out', TT.nube.activa ? 'Salir' : 'Cambiar de socio', 'data-action="salir"']]);
    return `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Más</div><h2 style="margin-top:4px">Otras secciones</h2></div></div><div class="tiles" style="grid-template-columns:1fr 1fr">${tiles.map(([i2, l, a]) => `<button class="tile" ${a}>${ic(i2)}${l}</button>`).join('')}</div><p class="muted small" style="margin-top:14px">${TT.nube.activa ? 'Conectado a la nube de T.T: lo que guardes lo ven los tres socios al instante.' : 'Los datos se guardan en este dispositivo.'}</p>`;
  }
  const TIPO_SOL = { demo: 'Quiere un demo', auditoria: 'Quiere una auditoría', contacto: 'Quiere que lo contacten' };
  const COLOR_SOL = { demo: 'blue', auditoria: 'green', contacto: 'gray' };
  function lineasSol(s) {
    const l = [];
    if (s.giro) l.push(['Giro', s.giro]);
    if (s.usuarios) l.push(['Tamaño', s.usuarios]);
    if (s.quiere && s.quiere.length) l.push([s.tipo === 'auditoria' ? 'Lo que más le cuesta' : 'Quiere construir', s.quiere.join(', ')]);
    if (s.conexiones && s.conexiones.length) l.push([s.tipo === 'auditoria' ? 'Hoy trabajan con' : 'Se conecta con', s.conexiones.join(', ')]);
    if (s.plazo) l.push(['Cuándo', s.plazo]);
    if (s.mensaje) l.push(['Dijo', s.mensaje]);
    if (s.estimado && s.estimado.desde) l.push(['Estimado', money(s.estimado.desde) + ' a ' + money(s.estimado.hasta) + (s.semanas ? ' · ' + s.semanas + ' semanas' : '')]);
    return l;
  }
  function tarjetaSol(s) {
    const fecha = String(s.creado || '').slice(0, 10);
    return `<div class="card" style="margin-bottom:12px">
      <div class="card-head" style="align-items:flex-start">
        <div><span class="chip ${COLOR_SOL[s.tipo] || 'gray'}">${TIPO_SOL[s.tipo] || s.tipo}</span>
          <div class="title" style="margin-top:8px"><span class="t" style="font-size:17px">${esc(s.nombre)}</span></div>
          <div class="sub">${esc(s.empresa || 'Sin empresa')} · ${fecha ? fdate(fecha) : ''}</div></div>
        <button class="row-btn" data-copy="${esc(s.contacto)}">${ic('link')}${esc(s.contacto)}</button>
      </div>
      <div class="list" style="margin-top:10px">${lineasSol(s).map(([k, v]) => `<div class="row"><div class="grow"><div class="sub">${k}</div><div class="title"><span class="t">${esc(v)}</span></div></div></div>`).join('')}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        ${s.clienteId ? `<button class="btn" data-open="cliente" data-id="${s.clienteId}">Ver su ficha</button>`
                      : `<button class="btn primary" data-action="solicitud-cliente" data-id="${s.id}">${ic('plus')}Volverlo cliente</button>`}
        <button class="btn" data-action="${s.atendida ? 'desatender' : 'atender'}" data-id="${s.id}">${s.atendida ? 'Marcar sin atender' : 'Marcar atendida'}</button>
      </div>
    </div>`;
  }
  function vAvisos() {
    const todas = (db.solicitudes || []);
    const nuevas = todas.filter(s => !s.atendida);
    const vistas = todas.filter(s => s.atendida);
    const cabeza = `<div class="card-head" style="margin-bottom:16px"><div><div class="eyebrow">Notificaciones</div><h2 style="margin-top:4px">Quién nos está buscando</h2><p class="muted small" style="margin-top:6px">Todo lo que llega del sitio: quien pide un demo, quien pide una auditoría y quien quiere que lo contactemos.</p></div>${nuevas.length ? `<span class="chip red">${nuevas.length} sin atender</span>` : ''}</div>`;
    if (!todas.length) return cabeza + `<div class="empty">Nada por ahora. Cuando alguien llene el formulario del sitio, aparece aquí.</div>`;
    return cabeza
      + (nuevas.length ? `<div class="section-title" style="margin:6px 0 10px">Sin atender</div>${nuevas.map(tarjetaSol).join('')}` : '')
      + (vistas.length ? `<div class="section-title" style="margin:18px 0 10px">Ya atendidas</div>${vistas.map(tarjetaSol).join('')}` : '');
  }

  const VISTAS = { inicio: vInicio, avisos: vAvisos, clientes: vClientes, demos: vDemos, pendientes: vPendientes, proyectos: vProyectos, cobranza: vCobranza, equipo: vEquipo, mas: vMas };
  let vistaActual = 'inicio';
  function render(v = vistaActual) {
    vistaActual = v; const el = $('#view');
    $$('.nav-item').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
    el.classList.add('is-switching');
    setTimeout(() => { el.innerHTML = VISTAS[v](); el.dataset.current = v; iconos(el); animarChart(el); el.classList.remove('is-switching'); }, 90);
    actualizarCabecera();
  }
  function actualizarCabecera() {
    const s = yo(); $('#whoAvatar').textContent = s.ini; $('#whoAvatar').className = 'avatar ' + s.color; $('#whoName').textContent = s.corto;
    const sinAtender = api.sinAtender ? api.sinAtender() : 0;
    $('#alertDot').hidden = vencidas(null).length === 0 && sinAtender === 0;
    const marca = document.querySelector('.nav-item[data-view="avisos"] .cuenta');
    if (marca) { marca.textContent = sinAtender; marca.hidden = !sinAtender; }
  }

  /* ---------- panel ---------- */
  const panel = $('#panel'), overlay = $('#overlay');
  function abrirPanel(eyebrow, titulo, html) {
    $('#panelEyebrow').textContent = eyebrow; $('#panelTitle').textContent = titulo; $('#panelBody').innerHTML = html; iconos(panel);
    overlay.hidden = false; requestAnimationFrame(() => { overlay.classList.add('is-on'); panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); });
    document.body.style.overflow = 'hidden';
  }
  function cerrarPanel() { overlay.classList.remove('is-on'); panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; setTimeout(() => { overlay.hidden = true; }, 220); }

  function fichaCliente(id) {
    const c = api.cliente(id); if (!c) return; const s = socioN(c.responsable);
    const acts = db.actividad.filter(a => a.clienteId === id).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const tareas = db.tareas.filter(t => t.clienteId === id && !t.hecha); const cobros = db.cobros.filter(x => x.clienteId === id); const proys = db.proyectos.filter(p => p.clienteId === id);
    abrirPanel(esc(c.giro), c.nombre, `
      <div class="seg" style="flex-wrap:wrap;height:auto" data-etapas="${c.id}">${TT.ETAPAS.map(e => `<button class="${e.id === c.etapa ? 'is-on' : ''}" data-e="${e.id}">${e.nombre}</button>`).join('')}</div>
      <div><div class="section-title">Ficha</div><dl class="kv"><dt>Contacto</dt><dd>${esc(c.contacto)}</dd><dt>Origen</dt><dd>${esc(c.origen)}</dd><dt>Responsable</dt><dd style="display:flex;align-items:center;gap:8px">${av(s)} ${esc(s.corto)}</dd><dt>Valor propuesto</dt><dd>${c.valor ? money(c.valor, c.moneda) + ' + IVA' : '<span class="muted">sin definir</span>'}</dd><dt>Mensualidad</dt><dd>${esc(c.mensualidad || '—')}</dd><dt>En el sistema desde</dt><dd>${fdate(c.creado)}</dd></dl></div>
      <div class="card soft"><div class="section-title">Siguiente paso</div><div style="display:flex;gap:10px;align-items:flex-start"><span class="chip ${c.siguiente?.fecha && dias(c.siguiente.fecha) < 0 ? 'red' : 'accent'}">${ic('clock')} ${esc(rel(c.siguiente?.fecha))}</span><div>${esc(c.siguiente?.texto || 'Sin siguiente paso')}</div></div>
        <form data-form="siguiente" data-id="${c.id}" class="form-grid" style="margin-top:12px"><div class="field span2"><input class="input" name="texto" placeholder="Nuevo siguiente paso" value="${esc(c.siguiente?.texto || '')}"></div><div class="field"><input class="input" type="date" name="fecha" value="${esc(c.siguiente?.fecha || '')}"></div><div style="display:flex;align-items:flex-end"><button class="btn block" type="submit">Actualizar</button></div></form></div>
      ${c.notas ? `<div><div class="section-title">Notas</div><p style="margin:0;color:var(--text-2)">${esc(c.notas)}</p></div>` : ''}
      ${c.enlaces?.length ? `<div><div class="section-title">Enlaces</div><div class="links">${c.enlaces.map(l => `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener">${ic('link')}${esc(l.titulo)}</a>`).join('')}</div></div>` : ''}
      ${proys.length ? `<div><div class="section-title">Proyectos</div><div class="list">${proys.map(p => `<div class="row clickable" data-open="proyecto" data-id="${p.id}"><div class="grow"><div class="title"><span class="t">${esc(p.nombre)}</span></div><div class="sub">${TT.avance(p)}% · ${esc(p.tipo)}</div></div>${ic('arrow')}</div>`).join('')}</div></div>` : ''}
      ${cobros.length ? `<div><div class="section-title">Cobros</div><div class="list">${cobros.map(x => `<div class="row"><div class="grow"><div class="title"><span class="t">${esc(x.concepto)}</span></div><div class="sub">${x.fecha ? fdate(x.fecha) : 'al firmar'} · ${chipTipo(x.tipo)}</div></div><b class="small mono">${money(x.monto, x.moneda)}</b>${chipEstado(cobroEstado(x))}</div>`).join('')}</div></div>` : ''}
      <div><div class="section-title">Pendientes · ${tareas.length}</div><div class="list">${tareas.map((x, i) => filaTarea(x, i)).join('') || '<div class="empty">Sin pendientes.</div>'}</div>
        <form data-form="tarea" class="form-grid" style="margin-top:10px"><input type="hidden" name="clienteId" value="${c.id}"><div class="field span2"><input class="input" name="texto" placeholder="Agregar pendiente" required></div><div class="field"><input class="input" type="date" name="vence" value="${TT.HOY}"></div><div class="field"><select class="input" name="socio">${TT.SOCIOS.map(s2 => `<option value="${s2.id}" ${s2.id === db.socioActual ? 'selected' : ''}>${s2.corto}</option>`).join('')}</select></div><div class="span2" style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Agregar</button></div></form></div>
      <div><div class="section-title">Actividad</div><ul class="timeline">${acts.map(a => `<li><span class="d">${fdate(a.fecha)}</span><div>${esc(a.texto)}<div class="who">${socioN(a.socio).corto} · ${esc(a.tipo)}</div></div></li>`).join('') || '<li><span class="d"></span><span class="muted">Sin actividad todavía.</span></li>'}</ul>
        <form data-form="actividad" class="form-grid" style="margin-top:10px"><input type="hidden" name="clienteId" value="${c.id}"><input type="hidden" name="socio" value="${db.socioActual}"><input type="hidden" name="fecha" value="${TT.HOY}"><div class="field"><select class="input" name="tipo"><option value="mensaje">Mensaje</option><option value="llamada">Llamada</option><option value="reunion">Reunión</option><option value="propuesta">Propuesta</option><option value="entrega">Entrega</option><option value="nota">Nota</option></select></div><div class="field"><input class="input" name="texto" placeholder="Qué pasó" required></div><div class="span2" style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Registrar</button></div></form></div>
      <div style="display:flex;gap:10px"><button class="btn" data-action="editar-cliente" data-id="${c.id}">${ic('edit')}Editar ficha</button></div>`);
  }

  function fichaProyecto(id) {
    const p = api.proyecto(id); if (!p) return; const cli = p.clienteId ? api.cliente(p.clienteId) : null; const pct = TT.avance(p);
    const tareas = db.tareas.filter(t => t.proyectoId === id && !t.hecha);
    abrirPanel(`${cli ? esc(cli.nombre) : 'Interno'} · ${esc(p.tipo)}`, p.nombre, `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><div class="progress" style="flex:1"><i style="--p:${(pct / 100).toFixed(3)}"></i></div><b>${pct}%</b></div>
      <dl class="kv"><dt>Responsable</dt><dd>${socioN(p.responsable).corto}</dd><dt>Estado</dt><dd>${p.estado}</dd><dt>Entrega</dt><dd>${p.entrega ? fdate(p.entrega) + ' · ' + rel(p.entrega) : 'sin fecha'}</dd></dl>
      <div>${p.fases.map((f, fi) => { const ok = f.items.filter(i => i.ok).length; return `<div class="phase"><div class="ph"><h3>${esc(f.nombre)}</h3><span class="chip ${ok === f.items.length ? 'green' : 'gray'}">${ok}/${f.items.length}</span></div><ul>${f.items.map((it, ii) => `<li><button class="check ${it.ok ? 'on' : ''}" data-toggle-item="${p.id}:${fi}:${ii}" aria-label="Marcar">${ICONS.check}</button><span ${it.ok ? 'style="color:var(--muted)"' : ''}>${esc(it.t)}</span>${it.f ? `<span class="faint small" style="margin-left:auto">${fdate(it.f)}</span>` : ''}</li>`).join('')}</ul></div>`; }).join('')}</div>
      <div><div class="section-title">Pendientes · ${tareas.length}</div><div class="list">${tareas.map((x, i) => filaTarea(x, i)).join('') || '<div class="empty">Sin pendientes ligados.</div>'}</div>
        <form data-form="tarea" class="form-grid" style="margin-top:10px"><input type="hidden" name="proyectoId" value="${p.id}"><div class="field span2"><input class="input" name="texto" placeholder="Agregar pendiente" required></div><div class="field"><input class="input" type="date" name="vence" value="${TT.HOY}"></div><div class="field"><select class="input" name="socio">${TT.SOCIOS.map(s2 => `<option value="${s2.id}" ${s2.id === db.socioActual ? 'selected' : ''}>${s2.corto}</option>`).join('')}</select></div><div class="span2" style="display:flex;justify-content:flex-end"><button class="btn" type="submit">Agregar</button></div></form></div>`);
  }

  function formCliente(c) {
    c = c || { etapa: 'contactado', responsable: db.socioActual, moneda: 'MXN', enlaces: [] };
    abrirPanel(c.id ? 'Editar' : 'Nuevo', c.id ? c.nombre : 'Nuevo cliente', `<form data-form="cliente" data-id="${c.id || ''}" class="form-grid">
      <div class="field span2"><label>Nombre o empresa</label><input class="input" name="nombre" value="${esc(c.nombre || '')}" required></div>
      <div class="field span2"><label>Giro</label><input class="input" name="giro" value="${esc(c.giro || '')}" placeholder="Ej. Clínica dental · 3 sucursales"></div>
      <div class="field"><label>Contacto</label><input class="input" name="contacto" value="${esc(c.contacto || '')}"></div>
      <div class="field"><label>Origen</label><input class="input" name="origen" value="${esc(c.origen || '')}" placeholder="Quién lo trajo"></div>
      <div class="field"><label>Etapa</label><select class="input" name="etapa">${TT.ETAPAS.map(e => `<option value="${e.id}" ${e.id === c.etapa ? 'selected' : ''}>${e.nombre}</option>`).join('')}</select></div>
      <div class="field"><label>Responsable</label><select class="input" name="responsable">${TT.SOCIOS.map(s => `<option value="${s.id}" ${s.id === c.responsable ? 'selected' : ''}>${s.corto}</option>`).join('')}</select></div>
      <div class="field"><label>Valor propuesto (MXN, sin IVA)</label><input class="input" type="number" name="valor" value="${c.valor ?? ''}" min="0" step="1000"></div>
      <div class="field"><label>Mensualidad (texto)</label><input class="input" name="mensualidad" value="${esc(c.mensualidad || '')}"></div>
      <div class="field span2"><label>Siguiente paso</label><input class="input" name="sig_texto" value="${esc(c.siguiente?.texto || '')}"></div>
      <div class="field"><label>Fecha del siguiente paso</label><input class="input" type="date" name="sig_fecha" value="${esc(c.siguiente?.fecha || '')}"></div>
      <div class="field span2"><label>Notas</label><textarea class="input" name="notas">${esc(c.notas || '')}</textarea></div>
      <div class="field span2"><label>Enlaces (uno por línea: título | url)</label><textarea class="input" name="enlaces">${esc((c.enlaces || []).map(l => l.titulo + ' | ' + l.url).join('\n'))}</textarea></div>
      <div class="span2" style="display:flex;justify-content:flex-end;gap:10px"><button class="btn primary" type="submit">Guardar</button></div></form>`);
  }
  function formProyecto() {
    abrirPanel('Nuevo', 'Nuevo proyecto', `<form data-form="proyecto" class="form-grid">
      <div class="field span2"><label>Nombre</label><input class="input" name="nombre" required></div>
      <div class="field"><label>Cliente</label><select class="input" name="clienteId"><option value="">Interno</option>${db.clientes.map(c => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Tipo</label><input class="input" name="tipo" placeholder="Sistema, campaña, auditoría…"></div>
      <div class="field"><label>Responsable</label><select class="input" name="responsable">${TT.SOCIOS.map(s => `<option value="${s.id}" ${s.id === db.socioActual ? 'selected' : ''}>${s.corto}</option>`).join('')}</select></div>
      <div class="field"><label>Entrega</label><input class="input" type="date" name="entrega"></div>
      <div class="field span2"><label>Entregables de la primera fase (uno por línea)</label><textarea class="input" name="items" placeholder="Muestra&#10;Auditoría&#10;Propuesta"></textarea></div>
      <div class="span2" style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Crear</button></div></form>`);
  }
  function formCobro(id) {
    const c = id ? db.cobros.find(x => x.id === id) : { tipo: 'hito', moneda: 'MXN', estado: 'programado' };
    abrirPanel(c.id ? 'Programar cobro' : 'Nuevo cobro', c.concepto || 'Nuevo cobro', `<form data-form="cobro" data-id="${c.id || ''}" class="form-grid">
      <div class="field span2"><label>Cliente</label><select class="input" name="clienteId">${db.clientes.map(x => `<option value="${x.id}" ${x.id === c.clienteId ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select></div>
      <div class="field span2"><label>Concepto</label><input class="input" name="concepto" value="${esc(c.concepto || '')}" required></div>
      <div class="field"><label>Tipo</label><select class="input" name="tipo">${['anticipo', 'hito', 'mensualidad'].map(t => `<option value="${t}" ${t === c.tipo ? 'selected' : ''}>${chipTipo(t)}</option>`).join('')}</select></div>
      <div class="field"><label>Monto (sin IVA)</label><input class="input" type="number" name="monto" value="${c.monto ?? ''}" min="0" step="100" required></div>
      <div class="field"><label>Fecha de cobro</label><input class="input" type="date" name="fecha" value="${esc(c.fecha || '')}" required></div>
      <div class="field"><label>Moneda</label><select class="input" name="moneda"><option ${c.moneda === 'MXN' ? 'selected' : ''}>MXN</option><option ${c.moneda === 'USD' ? 'selected' : ''}>USD</option></select></div>
      <div class="span2" style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Guardar</button></div></form>`);
  }
  function formTarea(t) {
    t = t || {};
    abrirPanel(t.id ? 'Editar' : 'Nueva', t.id ? 'Editar pendiente' : 'Nueva tarea', `<form data-form="tarea" data-id="${t.id || ''}" class="form-grid">
      <div class="field span2"><label>Qué hay que hacer</label><input class="input" name="texto" value="${esc(t.texto || '')}" required></div>
      <div class="field"><label>Para</label><select class="input" name="socio">${TT.SOCIOS.map(s => `<option value="${s.id}" ${s.id === (t.socio || db.socioActual) ? 'selected' : ''}>${s.corto}</option>`).join('')}</select></div>
      <div class="field"><label>Vence</label><input class="input" type="date" name="vence" value="${esc(t.vence || TT.HOY)}"></div>
      <div class="field"><label>Cliente (opcional)</label><select class="input" name="clienteId"><option value="">Ninguno</option>${db.clientes.map(c => `<option value="${c.id}" ${c.id === t.clienteId ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Proyecto (opcional)</label><select class="input" name="proyectoId"><option value="">Ninguno</option>${db.proyectos.map(p => `<option value="${p.id}" ${p.id === t.proyectoId ? 'selected' : ''}>${esc(p.nombre)}</option>`).join('')}</select></div>
      <div class="field span2"><label>Notas</label><textarea class="input" name="notas">${esc(t.notas || '')}</textarea></div>
      <div class="field span2"><label class="chk"><input type="checkbox" name="importante" ${t.importante ? 'checked' : ''}> Importante (sube al principio de la lista)</label></div>
      <div class="span2" style="display:flex;justify-content:space-between;gap:10px">${t.id ? `<button class="btn danger" type="button" data-action="borrar-tarea" data-id="${t.id}">Borrar</button>` : '<span></span>'}<button class="btn primary" type="submit">${t.id ? 'Guardar' : 'Crear'}</button></div></form>`);
  }
  function formDemo(d) {
    d = d || { tipo: 'app', estado: 'publicado', publicado: TT.HOY };
    abrirPanel(d.id ? 'Editar' : 'Nuevo', d.id ? d.nombre : 'Agregar demo o página', `<form data-form="demo" data-id="${d.id || ''}" class="form-grid">
      <div class="field span2"><label>Nombre</label><input class="input" name="nombre" value="${esc(d.nombre || '')}" required></div>
      <div class="field"><label>Cliente</label><select class="input" name="clienteId"><option value="">T.T AI Firm</option>${db.clientes.map(c => `<option value="${c.id}" ${c.id === d.clienteId ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Tipo</label><select class="input" name="tipo">${Object.entries(TIPOS_DEMO).map(([k, v]) => `<option value="${k}" ${k === d.tipo ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="field span2"><label>Enlace (https)</label><input class="input" name="url" value="${esc(d.url || '')}" placeholder="https://…"></div>
      <div class="field span2"><label>Ruta en la Mac (documentos)</label><input class="input" name="ruta" value="${esc(d.ruta || '')}" placeholder="/Users/…"></div>
      <div class="field span2"><label>Descripción</label><textarea class="input" name="descripcion">${esc(d.descripcion || '')}</textarea></div>
      <div class="field"><label>Estado</label><select class="input" name="estado">${[['publicado', 'Publicado'], ['borrador', 'Borrador'], ['pausa', 'En pausa']].map(([k, v]) => `<option value="${k}" ${k === d.estado ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="field"><label>Fecha</label><input class="input" type="date" name="publicado" value="${esc(d.publicado || '')}"></div>
      <div class="span2" style="display:flex;justify-content:space-between;gap:10px">${d.id ? `<button class="btn danger" type="button" data-action="borrar-demo" data-id="${d.id}">Borrar</button>` : '<span></span>'}<button class="btn primary" type="submit">Guardar</button></div></form>`);
  }
  function formActividad(clienteId) {
    abrirPanel('Registrar', 'Registrar actividad', `<form data-form="actividad" class="form-grid"><input type="hidden" name="cerrar" value="1">
      <div class="field span2"><label>Cliente</label><select class="input" name="clienteId">${db.clientes.map(c => `<option value="${c.id}" ${c.id === clienteId ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}</select></div>
      <div class="field"><label>Tipo</label><select class="input" name="tipo"><option value="mensaje">Mensaje</option><option value="llamada">Llamada</option><option value="reunion">Reunión</option><option value="propuesta">Propuesta</option><option value="entrega">Entrega</option><option value="nota">Nota</option></select></div>
      <div class="field"><label>Fecha</label><input class="input" type="date" name="fecha" value="${TT.HOY}"></div>
      <div class="field span2"><label>Qué pasó</label><input class="input" name="texto" placeholder="Ej. Le mandé la propuesta y quedó de contestar el viernes" required></div>
      <div class="field span2"><label>Registra</label><select class="input" name="socio">${TT.SOCIOS.map(s => `<option value="${s.id}" ${s.id === db.socioActual ? 'selected' : ''}>${s.corto}</option>`).join('')}</select></div>
      <div class="span2" style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Guardar</button></div></form>`);
  }
  function accesos(tipo) {
    const demos = db.clientes.flatMap(c => (c.enlaces || []).map(l => ({ ...l, cli: c.nombre }))).filter(l => /demo/i.test(l.titulo));
    const docs = [{ titulo: 'Acta Cero T.T', url: 'https://claude.ai/code/artifact/441c67df-b0fd-4c57-a931-bafc44299f76', cli: 'T.T' }, { titulo: 'Presentación (celular)', url: 'https://claude.ai/code/artifact/d76aa236-2b91-4f14-9704-afd142dfa2bf', cli: 'T.T' }, { titulo: 'Contrato marco y anexos (Word y PDF)', url: 'file:///Users/cam/TT%20FIRM%20AI/', cli: 'T.T · carpeta local' }];
    const lista = tipo === 'demos' ? demos : docs;
    abrirPanel('Accesos', tipo === 'demos' ? 'Demos publicados' : 'Documentos', `<div class="list">${lista.map(l => `<a class="row clickable" href="${esc(l.url)}" target="_blank" rel="noopener">${ic('link')}<div class="grow"><div class="title"><span class="t">${esc(l.titulo)}</span></div><div class="sub">${esc(l.cli)}</div></div>${ic('arrow')}</a>`).join('') || '<div class="empty">Nada por aquí.</div>'}</div>`);
  }
  function panelVencidas() {
    const v = vencidas(null); abrirPanel('Pendientes', v.length ? `${v.length} vencida${v.length === 1 ? '' : 's'}` : 'Nada vencido', `<div class="list stagger">${v.map((x, i) => filaTarea(x, i)).join('') || '<div class="empty">Todo al día.</div>'}</div>`);
  }
  function formCambiarPin() {
    const s = yo();
    abrirPanel('Acceso', 'Cambiar mi PIN', `<form data-form="pin" class="form-grid">
      <p class="muted small span2" style="margin:0">Socio: <b>${esc(s.nombre)}</b>. El PIN son 4 dígitos; se verifica en el servidor y nunca se guarda en claro.</p>
      <div class="field span2"><label>PIN actual</label><input class="input" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" name="pin" autocomplete="off" required></div>
      <div class="field"><label>PIN nuevo</label><input class="input" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" name="nuevo" autocomplete="off" required></div>
      <div class="field"><label>Repetir PIN nuevo</label><input class="input" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" name="nuevo2" autocomplete="off" required></div>
      <div class="span2" style="display:flex;justify-content:flex-end"><button class="btn primary" type="submit">Cambiar PIN</button></div></form>`);
  }
  function menuNuevo() {
    abrirPanel('Crear', '¿Qué quieres registrar?', `<div class="tiles" style="grid-template-columns:1fr 1fr">
      <button class="tile" data-action="nuevo-cliente">${ic('users')}Cliente</button><button class="tile" data-action="nuevo-proyecto">${ic('folder')}Proyecto</button>
      <button class="tile" data-action="nuevo-tarea">${ic('check')}Tarea</button><button class="tile" data-action="nuevo-cobro">${ic('wallet')}Cobro</button>
      <button class="tile" data-action="nuevo-demo">${ic('spark')}Demo o página</button><button class="tile" data-action="registrar-actividad">${ic('chat')}Actividad</button></div>
      ${TT.nube.activa ? `<p class="muted small" style="margin-top:14px">Conectado a la nube de T.T: lo que guardes lo ven los tres socios.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn sm" data-action="cambiar-pin">Cambiar mi PIN</button>${(TT.nube.vacia() && TT.nube.tieneSemilla) ? '<button class="btn primary sm" data-action="sembrar">Cargar datos iniciales en la nube</button>' : ''}</div>` : `<p class="muted small" style="margin-top:14px">Los datos se guardan en este dispositivo. Cuando se conecte la base de datos de T.T, se comparten entre los tres socios.</p>${TT.nube.tieneSemilla ? '<button class="btn danger sm" data-action="reiniciar" style="margin-top:8px">Restaurar datos iniciales</button>' : ''}`}`);
  }

  /* ---------- buscador y selector ---------- */
  const search = $('#search'), ovS = $('#overlaySearch'), inp = $('#searchInput');
  function abrirBusqueda() { ovS.hidden = false; search.hidden = false; requestAnimationFrame(() => { ovS.classList.add('is-on'); search.classList.add('is-open'); }); inp.value = ''; resultados(''); inp.focus(); }
  function cerrarBusqueda() { ovS.classList.remove('is-on'); search.classList.remove('is-open'); setTimeout(() => { ovS.hidden = true; search.hidden = true; }, 170); }
  function resultados(q) {
    q = q.trim().toLowerCase(); const r = [];
    db.clientes.forEach(c => { if (!q || (c.nombre + ' ' + c.giro + ' ' + c.contacto).toLowerCase().includes(q)) r.push({ k: 'cliente', id: c.id, t: c.nombre, s: etapaN(c.etapa) + ' · ' + c.giro }); });
    db.proyectos.forEach(p => { if (!q || p.nombre.toLowerCase().includes(q)) r.push({ k: 'proyecto', id: p.id, t: p.nombre, s: TT.avance(p) + '% · ' + p.tipo }); });
    (db.demos || []).forEach(d => { if (!q || (d.nombre + ' ' + (d.descripcion || '')).toLowerCase().includes(q)) { const c = d.clienteId ? api.cliente(d.clienteId) : null; r.push({ k: 'demo', id: d.id, t: d.nombre, s: 'Demo · ' + (c ? c.nombre : 'T.T') }); } });
    if (q) db.tareas.forEach(t => { if (t.texto.toLowerCase().includes(q)) r.push({ k: 'tarea', id: t.id, t: t.texto, s: 'Tarea · ' + socioN(t.socio).corto + ' · ' + rel(t.vence) }); });
    $('#searchResults').innerHTML = r.slice(0, 12).map(x => `<div class="row clickable" data-open="${x.k}" data-id="${x.id}">${ic(x.k === 'cliente' ? 'users' : x.k === 'proyecto' ? 'folder' : x.k === 'demo' ? 'spark' : 'check')}<div class="grow"><div class="title"><span class="t">${esc(x.t)}</span></div><div class="sub">${esc(x.s)}</div></div></div>`).join('') || '<div class="empty">Sin resultados.</div>';
    iconos($('#searchResults'));
  }
  const modalQ = $('#modalQuien'), ovQ = $('#overlayQuien');
  function abrirQuien() { $('#quienList').innerHTML = TT.SOCIOS.map(s => `<button class="row clickable" data-quien="${s.id}" style="width:100%;text-align:left">${av(s)}<div class="grow"><div class="title"><span class="t">${esc(s.nombre)}</span></div><div class="sub">${esc(s.rol)}</div></div>${s.id === db.socioActual ? '<span class="chip accent">Tú</span>' : ''}</button>`).join(''); ovQ.hidden = false; modalQ.hidden = false; requestAnimationFrame(() => { ovQ.classList.add('is-on'); modalQ.classList.add('is-open'); }); }
  function cerrarQuien() { ovQ.classList.remove('is-on'); modalQ.classList.remove('is-open'); setTimeout(() => { ovQ.hidden = true; modalQ.hidden = true; }, 190); }

  /* ---------- eventos ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.nav-item[data-view], [data-view-go], [data-open], [data-action], [data-etapa], [data-toggle-tarea], [data-toggle-item], [data-programar], [data-pagado], [data-quien], [data-e], [data-f], [data-importante], [data-edit-tarea], [data-edit-demo], [data-copy], [data-fd], [data-pf], [data-etapa-nav], [data-etapa-go]');
    if (!t) return;
    if (t.classList.contains('nav-item')) { render(t.dataset.view); return; }
    if (t.dataset.viewGo) { cerrarPanel(); render(t.dataset.viewGo); return; }
    if (t.dataset.f) { filtroHoy = t.dataset.f; render('inicio'); return; }
    if (t.dataset.open) { const k = t.dataset.open, id = t.dataset.id; cerrarBusqueda(); if (k === 'cliente') fichaCliente(id); else if (k === 'proyecto') fichaProyecto(id); else if (k === 'accesos') accesos(id); else if (k === 'demo') { const d = api.demo(id); if (d && d.url) window.open(d.url, '_blank', 'noopener'); else if (d) formDemo(d); } else if (k === 'tarea') { const x = api.tarea(id); if (x) formTarea(x); else render('pendientes'); } return; }
    if (t.dataset.etapaNav) { etapaIdx = (etapaIdx + Number(t.dataset.etapaNav) + TT.ETAPAS.length) % TT.ETAPAS.length; render('clientes'); return; }
    if (t.dataset.etapaGo != null) { etapaIdx = Number(t.dataset.etapaGo); render('clientes'); return; }
    if (t.dataset.importante) { api.toggleImportante(t.dataset.importante); render(); return; }
    if (t.dataset.editTarea) { const x = api.tarea(t.dataset.editTarea); if (x) formTarea(x); return; }
    if (t.dataset.editDemo) { const d = api.demo(t.dataset.editDemo); if (d) formDemo(d); return; }
    if (t.dataset.copy != null) { const txt = t.dataset.copy; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast('Copiado'), () => toast(txt)); else toast(txt); return; }
    if (t.dataset.fd) { filtroDemo = t.dataset.fd; render('demos'); return; }
    if (t.dataset.pf) { filtroPend.socio = t.dataset.pf; render('pendientes'); return; }
    if (t.dataset.etapa) { e.stopPropagation(); const [id, et] = t.dataset.etapa.split(':'); api.moverEtapa(id, et); toast('Cliente movido a ' + etapaN(et)); render(); return; }
    if (t.dataset.e) { const id = t.closest('[data-etapas]').dataset.etapas; api.moverEtapa(id, t.dataset.e); fichaCliente(id); render(); return; }
    if (t.dataset.toggleTarea) { const x = api.toggleTarea(t.dataset.toggleTarea); if (!x) return; if (vistaActual === 'pendientes') { setTimeout(() => render(), 160); } t.classList.toggle('on', x.hecha); const tt = t.parentElement.querySelector('.t'); if (tt) tt.style.cssText = x.hecha ? 'text-decoration:line-through;color:var(--muted)' : ''; actualizarCabecera(); return; }
    if (t.dataset.toggleItem) { const [pid, fi, ii] = t.dataset.toggleItem.split(':'); const it = api.toggleItem(pid, +fi, +ii); t.classList.toggle('on', it.ok); fichaProyecto(pid); return; }
    if (t.dataset.programar) { formCobro(t.dataset.programar); return; }
    if (t.dataset.pagado) { api.marcarPagado(t.dataset.pagado); toast('Cobro marcado como pagado'); render('cobranza'); return; }
    if (t.dataset.quien) { api.setSocioActual(t.dataset.quien); cerrarQuien(); toast('Hola, ' + socioN(t.dataset.quien).corto); render(); return; }
    const a = t.dataset.action;
    if (a === 'nuevo-cliente') formCliente(); else if (a === 'editar-cliente') formCliente(api.cliente(t.dataset.id)); else if (a === 'nuevo-proyecto') formProyecto(); else if (a === 'nuevo-cobro') formCobro(); else if (a === 'nuevo-tarea') formTarea(); else if (a === 'menu-nuevo') menuNuevo(); else if (a === 'buscar') abrirBusqueda(); else if (a === 'cambiar-pin') formCambiarPin();
    else if (a === 'nuevo-demo') formDemo(); else if (a === 'registrar-actividad') formActividad(t.dataset.id);
    else if (a === 'atender') { api.atenderSolicitud(t.dataset.id, true); toast('Marcada como atendida'); render('avisos'); }
    else if (a === 'desatender') { api.atenderSolicitud(t.dataset.id, false); render('avisos'); }
    else if (a === 'solicitud-cliente') { const c = api.solicitudACliente(t.dataset.id); if (c) { toast('Ya es cliente: ' + c.nombre); fichaCliente(c.id); render('avisos'); } }
    else if (a === 'toggle-hechas') { filtroPend.hechas = !filtroPend.hechas; render('pendientes'); }
    else if (a === 'borrar-tarea') { if (confirm('¿Borrar este pendiente?')) { api.borrarTarea(t.dataset.id); cerrarPanel(); render(); toast('Pendiente borrado'); } }
    else if (a === 'borrar-demo') { if (confirm('¿Quitar este demo de la lista?')) { api.borrarDemo(t.dataset.id); cerrarPanel(); render('demos'); toast('Demo quitado'); } }
    else if (a === 'salir') { (async () => { if (TT.nube.activa) { await TT.nube.salir(); mostrarLogin('Sesión cerrada.'); } else abrirQuien(); })(); }
    else if (a === 'reiniciar') { if (confirm('¿Restaurar los datos iniciales? Se pierden los cambios hechos en este dispositivo.')) { db = api.reiniciar(); cerrarPanel(); render(); toast('Datos restaurados'); } }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault();
    const d = Object.fromEntries(new FormData(f).entries()); const k = f.dataset.form;
    if (k === 'actividad') { api.registrar({ clienteId: d.clienteId, tipo: d.tipo, texto: d.texto.trim(), fecha: d.fecha || TT.HOY, socio: d.socio }); toast('Actividad registrada'); if (d.cerrar) { cerrarPanel(); render(); } else if (f.closest('#panel')) fichaCliente(d.clienteId); else render(); }
    else if (k === 'tarea') { const prev = f.dataset.id ? { ...api.tarea(f.dataset.id) } : {}; const tieneChk = !!f.querySelector('[name=importante]'); const t = Object.assign(prev, { texto: d.texto.trim(), socio: d.socio || prev.socio || db.socioActual, vence: d.vence || null, hecha: !!prev.hecha, clienteId: (d.clienteId != null ? d.clienteId : prev.clienteId) || undefined, proyectoId: (d.proyectoId != null ? d.proyectoId : prev.proyectoId) || undefined, notas: d.notas != null ? d.notas.trim() : (prev.notas || ''), importante: tieneChk ? ('importante' in d) : !!prev.importante }); api.guardarTarea(t); toast(f.dataset.id ? 'Pendiente actualizado' : 'Pendiente agregado'); if (f.closest('#panel')) { if (!f.dataset.id && t.clienteId) fichaCliente(t.clienteId); else if (!f.dataset.id && t.proyectoId) fichaProyecto(t.proyectoId); else cerrarPanel(); } else f.reset(); render(); }
    else if (k === 'demo') { const prev = f.dataset.id ? { ...api.demo(f.dataset.id) } : {}; api.guardarDemo(Object.assign(prev, { nombre: d.nombre.trim(), clienteId: d.clienteId || null, tipo: d.tipo, url: d.url.trim(), ruta: d.ruta.trim(), descripcion: d.descripcion.trim(), estado: d.estado, publicado: d.publicado || null, orden: prev.orden || 0 })); toast('Demo guardado'); cerrarPanel(); render('demos'); }
    else if (k === 'siguiente') { const c = api.cliente(f.dataset.id); c.siguiente = { texto: d.texto.trim(), fecha: d.fecha || null }; api.guardarCliente(c); toast('Siguiente paso actualizado'); fichaCliente(c.id); render(); }
    else if (k === 'cliente') {
      const c = f.dataset.id ? { ...api.cliente(f.dataset.id) } : {};
      Object.assign(c, { nombre: d.nombre.trim(), giro: d.giro.trim(), contacto: d.contacto.trim(), origen: d.origen.trim(), etapa: d.etapa, responsable: d.responsable, valor: d.valor ? Number(d.valor) : null, moneda: c.moneda || 'MXN', mensualidad: d.mensualidad.trim(), notas: d.notas.trim(), siguiente: { texto: d.sig_texto.trim(), fecha: d.sig_fecha || null }, enlaces: d.enlaces.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [titulo, url] = l.split('|').map(x => x.trim()); return { titulo, url: url || titulo }; }) });
      const g = api.guardarCliente(c); toast(f.dataset.id ? 'Ficha actualizada' : 'Cliente creado'); fichaCliente(g.id); render();
    }
    else if (k === 'proyecto') { api.guardarProyecto({ nombre: d.nombre.trim(), clienteId: d.clienteId || null, tipo: d.tipo.trim() || 'Proyecto', estado: 'activo', responsable: d.responsable, entrega: d.entrega || null, fases: [{ nombre: 'Fase 1', items: d.items.split('\n').map(x => x.trim()).filter(Boolean).map(t => ({ t, ok: false })) }] }); toast('Proyecto creado'); cerrarPanel(); render('proyectos'); }
    else if (k === 'pin') { if (d.nuevo !== d.nuevo2) { toast('Los PIN nuevos no coinciden'); return; } const btn = f.querySelector('button[type=submit]'); btn.disabled = true; TT.nube.cambiarPin(db.socioActual, d.pin, d.nuevo).then(() => { cerrarPanel(); toast('PIN cambiado'); }).catch(err => { toast(err.message || String(err)); btn.disabled = false; }); }
    else if (k === 'cobro') { const c = f.dataset.id ? { ...db.cobros.find(x => x.id === f.dataset.id) } : {}; Object.assign(c, { clienteId: d.clienteId, concepto: d.concepto.trim(), tipo: d.tipo, monto: Number(d.monto), fecha: d.fecha, moneda: d.moneda, estado: 'programado' }); api.guardarCobro(c); toast('Cobro programado'); cerrarPanel(); render('cobranza'); }
  });
  let swipe = null;
  $('#view').addEventListener('touchstart', (e) => { if (vistaActual !== 'clientes' || !e.target.closest('.kpage')) { swipe = null; return; } const t = e.touches[0]; swipe = { x: t.clientX, y: t.clientY }; }, { passive: true });
  $('#view').addEventListener('touchend', (e) => { if (!swipe) return; const t = e.changedTouches[0]; const dx = t.clientX - swipe.x, dy = t.clientY - swipe.y; swipe = null; if (Math.abs(dx) > 48 && Math.abs(dy) < 40) { etapaIdx = (etapaIdx + (dx < 0 ? 1 : -1) + TT.ETAPAS.length) % TT.ETAPAS.length; render('clientes'); } }, { passive: true });
  matchMedia('(max-width:900px)').addEventListener('change', () => { if (vistaActual === 'clientes') render('clientes'); });
  $('#panelClose').addEventListener('click', cerrarPanel); overlay.addEventListener('click', cerrarPanel);
  $('#btnBuscar').addEventListener('click', abrirBusqueda); ovS.addEventListener('click', cerrarBusqueda); inp.addEventListener('input', () => resultados(inp.value));
  $('#btnQuien').addEventListener('click', () => { if (TT.nube.activa) { toast('Tu perfil viene de tu PIN. Para cambiar de socio, sal y entra con otro PIN.'); return; } abrirQuien(); }); ovQ.addEventListener('click', cerrarQuien);
  $('#btnSalir').addEventListener('click', async () => { if (TT.nube.activa) { await TT.nube.salir(); mostrarLogin('Sesión cerrada.'); } else abrirQuien(); });
  $('#btnAlertas').addEventListener('click', panelVencidas);
  document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrirBusqueda(); } if (e.key === 'Escape') { cerrarBusqueda(); cerrarQuien(); if (panel.classList.contains('is-open')) cerrarPanel(); } });

  /* ---------- acceso a la nube: socio + PIN ---------- */
  const modalL = $('#modalLogin'), ovL = $('#overlayLogin');
  let loginSocio = null, pinBuf = '', pinOcupado = false, escuchando = false;
  const dotsEl = () => $('#pinDots');
  function pintarSocios() {
    $('#loginSocios').innerHTML = TT.SOCIOS.map(s => { const [n, ...ap] = s.nombre.split(' '); return `<button class="socio-btn" data-socio="${s.id}"><span class="avatar ${s.color}">${s.ini}</span><b>${esc(n)}</b><span class="muted small">${esc(ap.join(' '))}</span></button>`; }).join('');
  }
  function pintarDots() { document.querySelectorAll('#pinDots i').forEach((d, i) => d.classList.toggle('on', i < pinBuf.length)); }
  function pasoSocios(msg) { loginSocio = null; pinBuf = ''; pintarDots(); $('#loginPaso1').hidden = false; $('#loginPaso2').hidden = true; $('#loginMsg').textContent = msg || ''; }
  function pasoPin(id) {
    const s = socioN(id); loginSocio = id; pinBuf = ''; pintarDots(); dotsEl().classList.remove('is-error');
    const av = $('#loginAvatar'); av.className = 'avatar ' + s.color; av.textContent = s.ini; $('#loginNombre').textContent = 'Hola, ' + s.corto;
    $('#loginPaso1').hidden = true; $('#loginPaso2').hidden = false; $('#loginMsg').textContent = '';
  }
  function mostrarLogin(msg) { pintarSocios(); pasoSocios(msg); ovL.hidden = false; modalL.hidden = false; requestAnimationFrame(() => { ovL.classList.add('is-on'); modalL.classList.add('is-open'); }); }
  function ocultarLogin() { ovL.classList.remove('is-on'); modalL.classList.remove('is-open'); setTimeout(() => { ovL.hidden = true; modalL.hidden = true; }, 190); }
  function tecla(k) {
    if (pinOcupado || !loginSocio) return;
    if (k === 'cambiar') { pasoSocios(); return; }
    if (k === 'borrar') { pinBuf = pinBuf.slice(0, -1); pintarDots(); dotsEl().classList.remove('is-error'); return; }
    if (!/^\d$/.test(k) || pinBuf.length >= 4) return;
    pinBuf += k; pintarDots(); dotsEl().classList.remove('is-error');
    if (pinBuf.length === 4) enviarPin();
  }
  async function enviarPin() {
    pinOcupado = true; const dots = dotsEl(), pad = $('#keypad'); dots.classList.add('is-busy'); pad.setAttribute('aria-disabled', 'true'); $('#loginMsg').textContent = 'Verificando…';
    try { const ses = await TT.nube.entrarConPin(loginSocio, pinBuf); pinBuf = ''; await despuesDeEntrar(ses); }
    catch (err) {
      $('#loginMsg').textContent = err.message || String(err);
      dots.classList.add('is-error'); dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      setTimeout(() => { pinBuf = ''; pintarDots(); }, 350);
    }
    finally { pinOcupado = false; dots.classList.remove('is-busy'); pad.removeAttribute('aria-disabled'); }
  }
  modalL.addEventListener('click', (e) => { const so = e.target.closest('[data-socio]'); if (so) { pasoPin(so.dataset.socio); return; } const k = e.target.closest('[data-k]'); if (k) tecla(k.dataset.k); });
  document.addEventListener('keydown', (e) => { if (modalL.hidden || !loginSocio) return; if (/^\d$/.test(e.key)) tecla(e.key); else if (e.key === 'Backspace') tecla('borrar'); else if (e.key === 'Escape') pasoSocios(); });
  async function despuesDeEntrar(ses) {
    try { db = await TT.nube.cargar(); }
    catch (e) {
      if (e && e.code === 'no_autorizado') { await TT.nube.salir(); render('inicio'); mostrarLogin(e.message); return; }
      toast('No se pudo leer la nube: ' + (e.message || e)); db = TT.db();
    }
    const correo = (ses && ses.user && ses.user.email || '').toLowerCase();
    const so = TT.SOCIOS.find(s => s.email && s.email.toLowerCase() === correo);
    if (so) api.setSocioActual(so.id); else if (loginSocio) api.setSocioActual(loginSocio);
    ocultarLogin(); render('inicio'); toast('Hola, ' + yo().corto);
    if (TT.nube.vacia()) { toast('La nube está vacía todavía.'); }
    if (!escuchando) { escuchando = true; TT.nube.escuchar(() => { db = TT.db(); render(vistaActual); }); }
  }
  TT.onError = toast;
  document.addEventListener('click', async (e) => { const b = e.target.closest('[data-action="sembrar"]'); if (!b) return; b.disabled = true; toast('Cargando datos iniciales en la nube…'); try { db = await TT.nube.sembrar(); cerrarPanel(); render(); toast('Datos iniciales cargados'); } catch (err) { toast('Error: ' + (err.message || err)); b.disabled = false; } });

  async function iniciar() {
    iconos();
    if (!TT.nube.activa) { render('inicio'); return; }
    let ses = null; try { ses = await TT.nube.sesion(); } catch (e) { /* sin sesión */ }
    if (!ses) { render('inicio'); mostrarLogin(); return; }
    await despuesDeEntrar(ses);
  }
  iniciar();
})();
