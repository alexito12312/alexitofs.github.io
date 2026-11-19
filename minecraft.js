/* FurryLand · arma la página de Minecraft con los datos de minecraft-datos.js
   (no hace falta tocar este archivo para cambiar textos o precios) */
(function () {
  'use strict';
  var D = window.FURRYLAND || {}, MC = window.MC3D || {}, S = D.servidor || {}, TI = D.tienda || {};
  var TEXDIR = 'minecraft-media/tex/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function dinero(p, mon) { return esc(TI.simbolo || '$') + esc(Number(p).toLocaleString('es-MX')) + '<small>' + esc(mon || TI.moneda || 'MXN') + '</small>'; }
  function precio(p, gratis) { return p == null ? '<span class="mc-free">' + esc(gratis || 'Gratis · se consigue jugando') + '</span>' : '<div class="mc-price">' + dinero(p) + '</div>'; }
  function comprar(nombre, texto) { return '<a class="btn btn-primary" href="' + esc(TI.comprarUrl || 'contacto.html') + '" data-item="' + esc(nombre) + '">' + esc(texto || TI.comprarTexto || 'Comprar') + '</a>'; }
  function colorMat(m) { var p = (MC.PAL && MC.PAL[m]) || null; return p ? p[0] : (m && m.charAt && m.charAt(0) === '#' ? m : '#d4d4d8'); }
  function chips(en) { return en && en.length ? en.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join('') : '<span class="none">Sin encantamientos</span>'; }
  var RAREZA = { 'Raro': 'raro', 'Épico': 'epico', 'Legendario': 'legendario' };
  var tactil = matchMedia('(hover: none)').matches;

  /* ---------- logo + IP ---------- */
  (function () {
    var nombre = S.nombre || 'FURRYLAND', box = $('#logo');
    var mitad = Math.ceil(nombre.length * 5 / 9);
    var texto = '<h1 class="mc-wordmark">' + esc(nombre.slice(0, mitad)) + '<span>' + esc(nombre.slice(mitad)) + '</span></h1>';
    box.innerHTML = texto;
    if (S.logo) { var img = new Image(); img.alt = nombre; img.onload = function () { box.innerHTML = ''; box.appendChild(img); }; img.src = S.logo; }
    $('#autor').textContent = S.autor || 'AlexitoFS';
    if (S.version) $('#version').textContent = S.version + (S.lobby ? ' · Lobby: ' + S.lobby : '');
    if (S.ip) {
      $('#ip').textContent = S.ip;
      $('#copiar').addEventListener('click', function () {
        var b = this; (navigator.clipboard ? navigator.clipboard.writeText(S.ip) : Promise.reject()).then(function () { b.textContent = '¡Copiada!'; }, function () { b.textContent = S.ip; });
        setTimeout(function () { b.textContent = 'Copiar'; }, 1800);
      });
    } else $('#ipbox').hidden = true;
  })();

  /* ---------- carrusel ---------- */
  (function () {
    var datos = D.carrusel || [], track = $('#track'), dots = $('#dots'), car = $('#car');
    if (!datos.length) { car.hidden = true; return; }
    var COL = { oferta: ['#ff6fae', '#7a1f52', 'Oferta'], noticia: ['#5fb8ff', '#1d3d7a', 'Noticia'], actualizacion: ['#7cf0b8', '#145a45', 'Actualización'], evento: ['#ffd34d', '#7a4a10', 'Evento'] };
    datos.forEach(function (s, i) {
      var c = COL[s.tipo] || COL.noticia;
      var fondo = s.img ? '--img:url(\'' + encodeURI(s.img) + '\');--c:' + c[0] : 'background:radial-gradient(80% 90% at 85% 10%,' + c[0] + '66,transparent 60%),linear-gradient(135deg,' + c[1] + ',#1a0d2e)';
      var sl = el('<div class="mc-sl' + (s.img ? ' con-img' : '') + '" role="group" aria-roledescription="diapositiva" aria-label="' + (i + 1) + ' de ' + datos.length + '" style="' + fondo + '">' +
        (s.img ? '<div class="pic"></div>' : '<div class="pat"></div>') +
        '<div class="txt"><span class="tag" style="background:' + c[0] + '">' + esc(s.etiqueta || c[2]) + '</span><h3>' + esc(s.titulo) + '</h3><p>' + esc(s.texto || '') + '</p>' +
        (s.boton ? '<a class="btn btn-primary" href="' + (s.boton.ir ? '#' + esc(s.boton.ir) : esc(s.boton.url || '#')) + '">' + esc(s.boton.texto) + '</a>' : '') + '</div></div>');
      track.appendChild(sl);
      var d = el('<button type="button" aria-label="Ir a la diapositiva ' + (i + 1) + '"></button>');
      d.addEventListener('click', function () { ir(i); reiniciar(); }); dots.appendChild(d);
    });
    var n = datos.length, actual = 0, timer = null;
    var reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function ir(i) {
      actual = (i + n) % n; track.style.transform = 'translateX(' + (-100 * actual) + '%)';
      [].forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === actual); d.setAttribute('aria-current', k === actual ? 'true' : 'false'); });
      [].forEach.call(track.children, function (s, k) { s.setAttribute('aria-hidden', k === actual ? 'false' : 'true'); s.querySelectorAll('a').forEach(function (a) { a.tabIndex = k === actual ? 0 : -1; }); });
    }
    function reiniciar() { clearInterval(timer); if (!reducido && n > 1) timer = setInterval(function () { ir(actual + 1); }, 7000); }
    $('#prev').addEventListener('click', function () { ir(actual - 1); reiniciar(); });
    $('#next').addEventListener('click', function () { ir(actual + 1); reiniciar(); });
    car.addEventListener('mouseenter', function () { clearInterval(timer); });
    car.addEventListener('mouseleave', reiniciar);
    var x0 = null;
    car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); reiniciar(); } x0 = null; });
    if (n < 2) { $('#prev').hidden = $('#next').hidden = true; dots.hidden = true; }
    ir(0); reiniciar();
  })();

  /* =====================================================================
     ENFOQUE DE PIEZAS: al pasar el cursor (o tocar en el celular) una pieza,
     el fondo se difumina y salen sus encantamientos.
     ===================================================================== */
  var velo = el('<div class="mc-veil" aria-hidden="true"></div>'); document.body.appendChild(velo);
  var foco = null; /* { card, slot, fijo } */
  var quitarT = null;
  function enfocar(card, slot, fijo) {
    clearTimeout(quitarT);
    if (!slot) { if (!fijo) desenfocarPronto(); else desenfocar(); return; }
    if (foco && foco.card !== card) limpiar(foco.card);
    var p = card.__piezas && card.__piezas[slot]; if (!p) return;
    foco = { card: card, slot: slot, fijo: !!fijo || (foco && foco.card === card && foco.fijo && foco.slot === slot) };
    card.classList.add('foco');
    [].forEach.call(card.querySelectorAll('.mc-pieces li'), function (li) { li.classList.toggle('on', li.dataset.slot === slot); li.setAttribute('aria-expanded', li.dataset.slot === slot); });
    var pop = card.querySelector('.mc-pop');
    pop.innerHTML = '<div class="hd">' + (p.icono ? '<img src="' + esc(p.icono) + '" alt="">' : '<i style="background:' + esc(p.color) + '"></i>') +
      '<div><small>' + esc(p.tipo) + '</small><b>' + esc(p.nombre) + '</b></div>' +
      '<button type="button" class="x" aria-label="Cerrar">×</button></div>' +
      '<h5>Encantamientos</h5><div class="mc-ench grande">' + chips(p.encantamientos) + '</div>' +
      (p.extra ? '<p class="ex">' + esc(p.extra) + '</p>' : '');
    pop.classList.toggle('arriba', slot === 'pantalones' || slot === 'botas'); /* que no tape la pieza */
    pop.hidden = false; pop.classList.remove('in'); void pop.offsetWidth; pop.classList.add('in');
    pop.querySelector('.x').addEventListener('click', function (e) { e.stopPropagation(); desenfocar(); });
    velo.classList.add('on'); velo.classList.toggle('fijo', foco.fijo);
    if (card.__visor) card.__visor.resaltar(slot);
  }
  function limpiar(card) {
    card.classList.remove('foco');
    var pop = card.querySelector('.mc-pop'); if (pop) pop.hidden = true;
    [].forEach.call(card.querySelectorAll('.mc-pieces li.on'), function (li) { li.classList.remove('on'); li.setAttribute('aria-expanded', 'false'); });
    if (card.__visor) card.__visor.resaltar(null);
  }
  function desenfocar() { clearTimeout(quitarT); if (foco) limpiar(foco.card); foco = null; velo.classList.remove('on', 'fijo'); }
  function desenfocarPronto() { clearTimeout(quitarT); if (foco && foco.fijo) return; quitarT = setTimeout(desenfocar, 140); }
  velo.addEventListener('click', desenfocar);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') desenfocar(); });

  /* ---------- piezas ---------- */
  var SLOTS = [['casco', 'Casco'], ['pechera', 'Pechera'], ['pantalones', 'Pantalones'], ['botas', 'Botas']];
  function datosPiezas(set, extra) {
    var out = {};
    SLOTS.forEach(function (s) {
      var p = set[s[0]]; if (!p) return;
      out[s[0]] = { nombre: p.nombre || s[1] + ' de ' + MC.matNombre(p.mat), tipo: s[1], icono: p.icono || null, color: p.color || colorMat(p.mat), encantamientos: p.encantamientos || [], extra: p.extra || extra || '' };
    });
    if (set.arma) { var a = set.arma; out.arma = { nombre: a.nombre || a.tipo + ' de ' + MC.matNombre(a.mat), tipo: 'Arma', icono: a.tex ? TEXDIR + 'items/' + a.tex + '.png' : null, color: colorMat(a.mat), encantamientos: a.encantamientos || [], extra: '' }; }
    return out;
  }
  function listaPiezas(info) {
    var h = '<ul class="mc-pieces">';
    ['casco', 'pechera', 'pantalones', 'botas', 'arma'].forEach(function (slot) {
      var p = info[slot]; if (!p) return;
      var n = p.encantamientos.length;
      h += '<li tabindex="0" role="button" aria-expanded="false" data-slot="' + slot + '"><span class="ic">' + (p.icono ? '<img src="' + esc(p.icono) + '" alt="">' : '<i style="background:' + esc(p.color) + '"></i>') + '</span>' +
        '<span class="nm"><b>' + esc(p.nombre) + '</b><em>' + esc(p.tipo) + '</em></span>' +
        '<span class="cnt' + (n ? ' si' : '') + '">' + (n ? n + (n === 1 ? ' encant.' : ' encants.') : 'sin encant.') + '</span></li>';
    });
    return h + '</ul>';
  }
  function specPersonaje(set, piel, capa) {
    var arm = {};
    SLOTS.forEach(function (s) {
      var p = set[s[0]]; if (!p) return;
      arm[s[0]] = { mat: p.mat, brillo: !!(p.encantamientos && p.encantamientos.length) };
      if (p.set) {
        arm[s[0]].capa1 = TEXDIR + 'capas/' + p.set + '.png'; arm[s[0]].capa2 = TEXDIR + 'capas2/' + p.set + '.png';
        if (s[0] === 'casco') { arm.casco.modelo = TEXDIR + 'cascos/' + p.set + '.json'; arm.casco.texModelo = TEXDIR + 'cascos/' + p.set + '_casco_3d.png'; }
      }
    });
    var spec = { modo: 'personaje', armadura: arm, piel: piel || {}, capa: capa || null };
    if (set.arma) spec.arma = { tipo: set.arma.tipo, mat: set.arma.mat, tex: set.arma.tex ? TEXDIR + 'items/' + set.arma.tex + '.png' : null, brillo: !!(set.arma.encantamientos && set.arma.encantamientos.length) };
    return spec;
  }

  /* los visores se crean cuando su pestaña se abre (antes no tienen tamaño) */
  var pendientes = {};
  function visor(panelId, stage, spec, card) {
    (pendientes[panelId] = pendientes[panelId] || []).push(function () {
      var cv = stage.querySelector('canvas');
      if (card) {
        spec.alPasar = function (slot) { if (slot) enfocar(card, slot, false); else desenfocarPronto(); };
        spec.alTocar = function (slot, tipo) { if (slot) enfocar(card, slot, tipo !== 'mouse' || tactil); else desenfocar(); };
      }
      var v = MC.viewer ? MC.viewer(cv, spec) : null;
      if (!v) { stage.insertAdjacentHTML('beforeend', '<div class="mc-sin3d">Tu navegador no puede mostrar el modelo 3D.</div>'); cv.remove(); return; }
      if (card) card.__visor = v;
    });
  }
  function engancharLista(card) {
    [].forEach.call(card.querySelectorAll('.mc-pieces li'), function (li) {
      var slot = li.dataset.slot;
      li.addEventListener('mouseenter', function () { if (!tactil) enfocar(card, slot, false); });
      li.addEventListener('mouseleave', function () { if (!tactil) desenfocarPronto(); });
      li.addEventListener('focus', function () { if (!tactil) enfocar(card, slot, false); });
      li.addEventListener('blur', function () { if (!tactil) desenfocarPronto(); });
      li.addEventListener('click', function () { if (foco && foco.card === card && foco.slot === slot && foco.fijo) desenfocar(); else enfocar(card, slot, true); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); } });
    });
  }

  function tarjetaGrande(panelId, o) {
    var info = datosPiezas(o.set, o.extraPieza);
    var c = el('<article class="mc-big' + (o.destacado ? ' dest' : '') + '" style="--c:' + esc(o.color || '#ff6fae') + '">' +
      '<div class="mc-stage">' + (o.ribbon ? '<span class="ribbon">' + esc(o.ribbon) + '</span>' : '') + '<canvas aria-label="Modelo 3D de ' + esc(o.nombre) + '" role="img"></canvas>' +
      '<span class="hint">' + (tactil ? 'Arrastra para girar · toca una pieza' : 'Arrastra para girar · pasa el cursor por una pieza') + '</span><div class="mc-pop" role="dialog" aria-live="polite" hidden></div></div>' +
      '<div class="mc-info"><div class="mc-top"><div><span class="eyebrow">' + esc(o.eyebrow || '') + '</span><h3>' + esc(o.nombre) + '</h3></div>' + (o.sinPrecio ? '' : precio(o.precio, o.gratis)) + '</div>' +
      (o.descripcion ? '<p>' + esc(o.descripcion) + '</p>' : '') +
      (o.ventajas && o.ventajas.length ? '<h4>Ventajas</h4><ul class="mc-perks">' + o.ventajas.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      (o.bonus && o.bonus.length ? '<h4>Bonus con las 4 piezas</h4><ul class="mc-perks bonus">' + o.bonus.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      '<h4>' + esc(o.tituloPiezas || 'Piezas') + ' <span class="tip">' + (tactil ? '· toca una para ver sus encantamientos' : '· pasa el cursor para ver sus encantamientos') + '</span></h4>' + listaPiezas(info) +
      (o.tambien && o.tambien.length ? '<h4>También trae</h4><ul class="mc-perks soft">' + o.tambien.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      (o.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(o.obtener) + '</div>' : '') +
      (o.precio != null && !o.sinPrecio ? '<div class="mc-actions">' + comprar(o.nombre, o.textoBoton) + '</div>' : (o.accion || '')) +
      '</div></article>');
    c.__piezas = info;
    engancharLista(c);
    visor(panelId, c.querySelector('.mc-stage'), specPersonaje(o.set, o.piel, o.capa), c);
    return c;
  }

  /* ---------- pestañas ---------- */
  var CATS = [
    { id: 'rangos', nombre: 'Rangos', icono: 'estrella', color: '#ff6fae' },
    { id: 'items', nombre: 'Items', img: TEXDIR + 'items/totem_fenix.png' },
    { id: 'armas', nombre: 'Armas', img: TEXDIR + 'items/katana_kitsune.png' },
    { id: 'armaduras', nombre: 'Armaduras', img: TEXDIR + 'items/kitsune_pechera.png' },
    { id: 'donadores', nombre: 'Donadores', icono: 'cofre', color: 'oro' }
  ];
  var tabs = $('#tabs'), panels = $('#panels'), creados = {};
  CATS.forEach(function (c) {
    var b = el('<button type="button" role="tab" id="tab-' + c.id + '" aria-controls="p-' + c.id + '" aria-selected="false" tabindex="-1">' + (c.img ? '<img src="' + esc(c.img) + '" alt="">' : '<canvas width="12" height="12"></canvas>') + esc(c.nombre) + '</button>');
    if (!c.img && MC.icono) MC.icono(b.querySelector('canvas'), c.icono, c.color);
    b.addEventListener('click', function () { abrir(c.id, true); });
    tabs.appendChild(b);
    panels.appendChild(el('<section class="mc-panel" role="tabpanel" id="p-' + c.id + '" aria-labelledby="tab-' + c.id + '" hidden></section>'));
  });
  tabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var bs = [].slice.call(tabs.children), i = bs.indexOf(document.activeElement); if (i < 0) return;
    var j = (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length; bs[j].focus(); bs[j].click(); e.preventDefault();
  });

  function abrir(id, desdeClic) {
    if (!CATS.some(function (c) { return c.id === id; })) id = 'rangos';
    desenfocar();
    CATS.forEach(function (c) {
      var on = c.id === id, b = $('#tab-' + c.id), p = $('#p-' + c.id);
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; p.hidden = !on;
    });
    if (!creados[id]) { creados[id] = true; CONSTRUIR[id]($('#p-' + id)); }
    (pendientes['p-' + id] || []).splice(0).forEach(function (f) { f(); });
    if (desdeClic) {
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
      var y = tabs.getBoundingClientRect().top + scrollY - 90;
      if (scrollY > y + 10 || desdeClic === 'link') scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /* recorte de una mascota en la imagen vista_mascotas.png (5 columnas x 2 filas) */
  function sprite(sp) {
    var W = 1300, H = 690, w = 210, h = 230, x = sp[0] * 260 + 25, y = sp[1] ? 400 : 82;
    return '<div class="spr" style="background-image:url(minecraft-media/vista_mascotas.png);background-size:' + (W / w * 100) + '% auto;background-position:' + (x / (W - w) * 100) + '% ' + (y / (H - h) * 100) + '%"></div>';
  }

  var CONSTRUIR = {
    rangos: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Rangos</h2><p class="lede">Rangos VIP permanentes, con dinero real en pesos mexicanos. Cada uno trae su kit con armadura y arma. ' + (tactil ? 'Toca' : 'Pasa el cursor por') + ' una pieza (en el modelo o en la lista) para ver sus encantamientos.</p>';
      (D.rangos || []).forEach(function (r) {
        p.appendChild(tarjetaGrande('p-rangos', {
          nombre: r.nombre, color: r.color, precio: r.precio, gratis: r.gratis, descripcion: r.descripcion, ventajas: r.ventajas, tambien: r.tambien,
          set: r.kit || {}, piel: r.piel, capa: r.capa, destacado: r.destacado, ribbon: r.destacado ? 'Más popular' : '',
          eyebrow: 'Rango VIP', tituloPiezas: 'Kit del rango', textoBoton: 'Comprar ' + r.nombre
        }));
      });
    },
    items: function (p) {
      var lista = D.items || [];
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Items</h2><p class="lede">Los de paga se compran con dinero real (MXN). Los gratis se consiguen jugando, con el dinero del juego o en botín.</p>' +
        '<div class="mc-filter" role="group" aria-label="Filtrar items"><button type="button" data-f="todos" aria-pressed="true">Todos</button><button type="button" data-f="pago" aria-pressed="false">De paga</button><button type="button" data-f="gratis" aria-pressed="false">Gratis</button></div><div class="mc-grid"></div>';
      var g = p.querySelector('.mc-grid');
      lista.forEach(function (it) {
        var es3d = !!it.capa;
        var vis = es3d ? '<canvas role="img" aria-label="Vista 3D de ' + esc(it.nombre) + '"></canvas>' : it.sprite ? sprite(it.sprite) : it.img ? '<img src="' + esc(it.img) + '" alt="">' : '<canvas></canvas>';
        var c = el('<article class="mc-card" data-tipo="' + (it.dePaga ? 'pago' : 'gratis') + '" style="--c:' + esc(colorMat(it.capa || it.color || '#ff6fae')) + '">' +
          '<div class="mc-stage' + (es3d ? '' : ' ico') + (it.img && /vista_/.test(it.img) ? ' foto' : '') + '">' + vis + '</div>' +
          '<div class="body"><div class="row"><span class="mc-badge ' + (it.dePaga ? 'pago">De paga' : 'gratis">Gratis') + '</span>' + (it.dePaga && it.precio != null ? '<div class="mc-price">' + dinero(it.precio) + '</div>' : '') + '</div>' +
          '<h3>' + esc(it.nombre) + '</h3><p>' + esc(it.descripcion || '') + '</p>' +
          (it.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(it.obtener) + '</div>' : '') +
          (it.dePaga ? '<div class="mc-actions">' + comprar(it.nombre) + '</div>' : '') + '</div></article>');
        if (es3d) visor('p-items', c.querySelector('.mc-stage'), { modo: 'personaje', capa: it.capa, piel: it.piel || {}, giroInicial: Math.PI * .85 });
        else if (!it.img && !it.sprite && MC.icono) MC.icono(c.querySelector('canvas'), it.icono, it.color);
        g.appendChild(c);
      });
      p.querySelector('.mc-filter').addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', x === b); });
        [].forEach.call(g.children, function (card) { card.hidden = b.dataset.f !== 'todos' && card.dataset.tipo !== b.dataset.f; });
      });
    },
    armas: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Armas</h2><p class="lede">Las armas no se compran: salen de bosses, estructuras difíciles, el casino y la Llave de Jefe. Contra jugadores sus efectos son más suaves.</p>' +
        '<div class="mc-filter" role="group" aria-label="Filtrar armas"><button type="button" data-f="todos" aria-pressed="true">Todas</button><button type="button" data-f="arma" aria-pressed="false">Armas</button><button type="button" data-f="arco" aria-pressed="false">Arcos</button><button type="button" data-f="herr" aria-pressed="false">Herramientas</button></div><div class="mc-grid"></div>';
      var g = p.querySelector('.mc-grid');
      (D.armas || []).forEach(function (a) {
        var en = a.encantamientos || [], tipo = /^arco/.test(a.tex || '') ? 'arco' : en.length ? 'herr' : 'arma';
        var rz = RAREZA[a.rareza] || 'raro';
        var c = el('<article class="mc-card" data-tipo="' + tipo + '" style="--c:var(--rz-' + rz + ')"><div class="mc-stage"><canvas role="img" aria-label="Modelo 3D de ' + esc(a.nombre) + '"></canvas><span class="hint">Arrastra para girar</span></div>' +
          '<div class="body"><div class="row"><span class="mc-rz ' + rz + '">' + esc(a.rareza || '') + '</span>' + (a.precio != null ? '<div class="mc-price">' + dinero(a.precio) + '</div>' : '') + '</div>' +
          '<h3>' + esc(a.nombre) + '</h3>' +
          (a.dano ? '<div class="mc-stats"><span><b>' + esc(a.dano) + '</b> daño</span><span><b>' + esc(a.vel) + '</b> velocidad</span></div>' : '') +
          (a.efecto ? '<p>' + esc(a.efecto) + '</p>' : '') +
          (en.length ? '<div class="mc-ench">' + chips(en) + '</div>' : '') +
          (a.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(a.obtener) + '</div>' : '') +
          (a.precio != null ? '<div class="mc-actions">' + comprar(a.nombre) + '</div>' : '') + '</div></article>');
        visor('p-armas', c.querySelector('.mc-stage'), { modo: 'arma', arma: { tex: a.tex ? TEXDIR + 'items/' + a.tex + '.png' : null, tipo: a.tipo, mat: a.mat, brillo: en.length > 0 } });
        g.appendChild(c);
      });
      p.querySelector('.mc-filter').addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', x === b); });
        [].forEach.call(g.children, function (card) { card.hidden = b.dataset.f !== 'todos' && card.dataset.tipo !== b.dataset.f; });
      });
    },
    armaduras: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Armaduras</h2><p class="lede">Los sets del server, con su textura real. El bonus se activa con las 4 piezas puestas. ' + (tactil ? 'Toca' : 'Pasa el cursor por') + ' una pieza para ver sus encantamientos; las que brillan en morado están encantadas.</p>';
      (D.armaduras || []).forEach(function (a) {
        p.appendChild(tarjetaGrande('p-armaduras', {
          nombre: a.nombre, color: a.color, precio: a.precio, set: a.piezas || {}, piel: a.piel, bonus: a.bonus,
          descripcion: a.descripcion || ('Rareza ' + (a.rareza || '').toLowerCase() + ' · base de ' + a.base + '.'),
          obtener: a.obtener, eyebrow: a.rareza || 'Armadura', gratis: 'Se consigue jugando', tituloPiezas: 'Piezas',
          extraPieza: a.bonus && a.bonus.length ? 'Bonus del set (4 piezas): ' + a.bonus.join(' · ') : ''
        }));
      });
    },
    donadores: function (p) {
      var d = D.donadores || {}, min = d.minimo || 15, sim = TI.simbolo || '$', mon = d.moneda || 'USD';
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Donadores</h2>' +
        '<div class="mc-meta"><div class="big">+' + esc(sim + min) + '<small>' + esc(mon) + '</small></div><p><b>' + esc(d.titulo || 'Top Donador') + '.</b> ' + esc(d.texto || '') + '</p></div>' +
        '<div class="mc-don"><div class="mc-box"><h3>Qué te llevas</h3><ul class="mc-list">' + (d.beneficios || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="mc-box"><h3>Top donadores</h3>' + ((d.top || []).length ? '<ol class="mc-rank">' + d.top.map(function (t, i) { return '<li><span class="pos">' + (i + 1) + '</span><b>' + esc(t.nick) + '</b><span>' + esc(sim + t.monto) + '</span></li>'; }).join('') + '</ol>' : '<p class="vacio">Todavía no hay nadie en el Top.<br><b>¡Puedes ser el primero!</b></p>') + '</div></div>';
      p.appendChild(tarjetaGrande('p-donadores', {
        nombre: 'Kit Top Donador', color: '#f4cf38', set: d.kit || {}, piel: d.piel, capa: d.capa, sinPrecio: true, tambien: d.tambien,
        eyebrow: 'Exclusivo · cada 3 días', ribbon: 'Kit exclusivo', tituloPiezas: 'Equipo del kit',
        descripcion: 'Se reclama en el menú /kits una vez que tienes el rango Top Donador.',
        accion: '<div class="mc-actions">' + comprar('Top Donador', 'Donar más de ' + sim + min + ' ' + mon) + '</div>'
      }));
      p.appendChild(el('<div class="mc-box" style="margin-top:22px"><h3>Cómo conseguir el kit</h3><ol class="mc-steps">' + (d.pasos || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>'));
    }
  };

  /* enlaces internos #rangos, #armas... (del carrusel o compartidos) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1); if (!CATS.some(function (c) { return c.id === id; })) return;
    e.preventDefault(); abrir(id, 'link');
  });
  addEventListener('hashchange', function () { abrir(location.hash.slice(1)); });
  abrir((location.hash || '#rangos').slice(1), false);
})();
