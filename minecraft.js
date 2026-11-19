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
  /* botón que abre la ventana de compra (PayPal + ticket de Discord) */
  function comprar(nombre, texto, monto, moneda, donacion) {
    return '<button type="button" class="btn btn-primary mc-comprar" data-item="' + esc(nombre) + '" data-monto="' + esc(monto == null ? '' : monto) + '" data-moneda="' + esc(moneda || TI.moneda || 'MXN') + '"' + (donacion ? ' data-donacion="1"' : '') + '>' + esc(texto || TI.comprarTexto || 'Comprar') + '</button>';
  }
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
    var c = el('<article class="mc-big' + (o.destacado ? ' dest' : '') + (o.rango ? ' rango' : '') + '" style="--c:' + esc(o.color || '#ff6fae') + '">' +
      '<div class="mc-stage">' + (o.ribbon ? '<span class="ribbon">' + esc(o.ribbon) + '</span>' : '') + '<canvas aria-label="Modelo 3D de ' + esc(o.nombre) + '" role="img"></canvas>' +
      '<span class="hint">' + (tactil ? 'Arrastra para girar · toca una pieza' : 'Arrastra para girar · pasa el cursor por una pieza') + '</span><div class="mc-pop" role="dialog" aria-live="polite" hidden></div></div>' +
      '<div class="mc-info"><div class="mc-top"><div><span class="eyebrow">' + esc(o.eyebrow || '') + '</span><h3>' + esc(o.nombre) + '</h3></div>' + (o.sinPrecio ? '' : precio(o.precio, o.gratis)) + '</div>' +
      (o.descripcion ? '<p>' + esc(o.descripcion) + '</p>' : '') +
      (o.ventajas && o.ventajas.length ? '<h4>Ventajas</h4><ul class="mc-perks">' + o.ventajas.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      (o.bonus && o.bonus.length ? '<h4>Bonus con las 4 piezas</h4><ul class="mc-perks bonus">' + o.bonus.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      '<h4>' + esc(o.tituloPiezas || 'Piezas') + ' <span class="tip">' + (tactil ? '· toca una para ver sus encantamientos' : '· pasa el cursor para ver sus encantamientos') + '</span></h4>' + listaPiezas(info) +
      (o.tambien && o.tambien.length ? '<h4>También trae</h4><ul class="mc-perks soft">' + o.tambien.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      (o.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(o.obtener) + '</div>' : '') +
      (o.precio != null && !o.sinPrecio ? '<div class="mc-actions">' + comprar(o.nombre, o.textoBoton, o.precio) + '</div>' : (o.accion || '')) +
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

  /* recorte de una mascota en minecraft-media/mascotas.png (renders del server: 5 columnas x 4 filas de 200 px) */
  function sprite(sp) {
    var W = 1000, H = 800, w = 200, h = 200, x = sp[0] * w, y = sp[1] * h;
    return '<div class="spr" style="background-image:url(minecraft-media/mascotas.png);background-size:' + (W / w * 100) + '% auto;background-position:' + (x / (W - w) * 100) + '% ' + (y / (H - h) * 100) + '%"></div>';
  }

  var CONSTRUIR = {
    rangos: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Rangos</h2><p class="lede">Rangos VIP permanentes, con dinero real en pesos mexicanos. Cada uno trae su kit con armadura y arma. ' + (tactil ? 'Toca' : 'Pasa el cursor por') + ' una pieza (en el modelo o en la lista) para ver sus encantamientos.</p>';
      (D.rangos || []).forEach(function (r) {
        p.appendChild(tarjetaGrande('p-rangos', {
          nombre: r.nombre, color: r.color, precio: r.precio, gratis: r.gratis, descripcion: r.descripcion, ventajas: r.ventajas, tambien: r.tambien,
          set: r.kit || {}, piel: r.piel, capa: r.capa, destacado: r.destacado, ribbon: r.destacado ? 'Más popular' : '',
          eyebrow: 'Rango VIP', tituloPiezas: 'Kit del rango', textoBoton: 'Comprar ' + r.nombre, rango: true
        }));
      });
    },
    items: function (p) {
      var lista = D.items || [];
      var nPago = lista.filter(function (i) { return i.dePaga; }).length, nGratis = lista.length - nPago;
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Items</h2>' +
        '<nav class="mc-saltos" aria-label="Secciones de items"><a href="#items-pago" class="pago"><b>De paga</b><small>' + nPago + ' items · dinero real</small></a><a href="#items-gratis" class="gratis"><b>Gratis</b><small>' + nGratis + ' items · se consiguen jugando</small></a></nav>' +
        '<section class="mc-sec pago" id="items-pago"><div class="mc-sec-hd"><span class="mc-badge pago">De paga</span><h3>Tienda</h3><p>Se compran con dinero real (MXN): pagas por PayPal y abres un ticket en Discord para que te lo entreguen.</p></div><div class="mc-grid"></div></section>' +
        '<section class="mc-sec gratis" id="items-gratis"><div class="mc-sec-hd"><span class="mc-badge gratis">Gratis</span><h3>Se consiguen jugando</h3><p>No cuestan dinero real: se compran con el dinero del juego, se craftean o salen en botín y bosses.</p></div><div class="mc-grid"></div></section>';
      var gPago = p.querySelector('#items-pago .mc-grid'), gGratis = p.querySelector('#items-gratis .mc-grid');
      [].forEach.call(p.querySelectorAll('.mc-saltos a'), function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); var t = p.querySelector(a.getAttribute('href')); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 150, behavior: 'smooth' }); });
      });
      lista.forEach(function (it) {
        var g = it.dePaga ? gPago : gGratis;
        var es3d = !!it.capa;
        var vis = es3d ? '<canvas role="img" aria-label="Vista 3D de ' + esc(it.nombre) + '"></canvas>' : it.sprite ? sprite(it.sprite) : it.img ? '<img src="' + esc(it.img) + '" alt="">' : '<canvas></canvas>';
        var c = el('<article class="mc-card" data-tipo="' + (it.dePaga ? 'pago' : 'gratis') + '" style="--c:' + esc(colorMat(it.capa || it.color || '#ff6fae')) + '">' +
          '<div class="mc-stage' + (es3d ? '' : ' ico') + (it.img && /vista_/.test(it.img) ? ' foto' : '') + '">' + vis + '</div>' +
          '<div class="body"><div class="row"><span class="mc-badge ' + (it.dePaga ? 'pago">De paga' : 'gratis">Gratis') + '</span>' + (it.dePaga && it.precio != null ? '<div class="mc-price">' + dinero(it.precio) + '</div>' : '') + '</div>' +
          '<h3>' + esc(it.nombre) + '</h3><p>' + esc(it.descripcion || '') + '</p>' +
          (it.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(it.obtener) + '</div>' : '') +
          (it.dePaga ? '<div class="mc-actions">' + comprar(it.nombre, null, it.precio) + '</div>' : '') + '</div></article>');
        if (es3d) visor('p-items', c.querySelector('.mc-stage'), { modo: 'personaje', capa: it.capa, piel: it.piel || {}, giroInicial: Math.PI * .85 });
        else if (!it.img && !it.sprite && MC.icono) MC.icono(c.querySelector('canvas'), it.icono, it.color);
        g.appendChild(c);
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
          (a.precio != null ? '<div class="mc-actions">' + comprar(a.nombre, null, a.precio) + '</div>' : '') + '</div></article>');
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
        accion: '<div class="mc-actions">' + comprar('Top Donador', 'Donar más de ' + sim + min + ' ' + mon, min, mon, true) + '</div>'
      }));
      p.appendChild(el('<div class="mc-box" style="margin-top:22px"><h3>Cómo conseguir el kit</h3><ol class="mc-steps">' + (d.pasos || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div>'));
    }
  };

  /* =====================================================================
     VENTANA DE COMPRA: 1) pagar por PayPal  2) abrir ticket en Discord  3) recibirlo en el server
     Los links salen de tienda.paypal y tienda.discord en minecraft-datos.js
     ===================================================================== */
  var compra = el('<div class="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mcm-t" hidden><div class="box">' +
    '<button type="button" class="x" aria-label="Cerrar">×</button>' +
    '<span class="eyebrow" id="mcm-tipo">Comprar</span><h3 id="mcm-t"></h3><div class="mcm-precio" id="mcm-precio"></div>' +
    '<label class="mcm-nick"><span>Tu nick de Minecraft</span><input id="mcm-nick" type="text" autocomplete="off" spellcheck="false" maxlength="32" placeholder="Ej. Alexito_VT"><small>Los de Bedrock: con el punto delante (.Pepe)</small></label>' +
    '<ol class="mcm-pasos">' +
    '<li><div><b>Paga por PayPal</b><p id="mcm-p1"></p></div><a class="btn btn-primary" id="mcm-paypal" target="_blank" rel="noopener">Pagar con PayPal</a></li>' +
    '<li><div><b>Abre un ticket en Discord</b><p>Entra al Discord, abre un ticket y pega este mensaje con tu comprobante de PayPal (captura o ID de la transacción):</p>' +
    '<pre id="mcm-msg"></pre><div class="mcm-acc"><button type="button" class="btn" id="mcm-copiar">Copiar mensaje</button><a class="btn btn-primary" id="mcm-discord" target="_blank" rel="noopener">Abrir Discord</a></div></div></li>' +
    '<li><div><b>Recíbelo en el server</b><p id="mcm-p3">Un admin revisa el pago y te lo entrega en el server, normalmente el mismo día.</p></div></li>' +
    '</ol><p class="mcm-nota" id="mcm-nota"></p></div></div>');
  document.body.appendChild(compra);
  var actual = null, ultimoBoton = null;
  function linkPaypal(monto, mon) {
    var u = (TI.paypal || '').replace(/^https?:\/\/(www\.)?(paypal\.me|paypal\.com\/paypalme)\//i, '').replace(/\/.*$/, '');
    if (!u) return '';
    return 'https://www.paypal.com/paypalme/' + encodeURIComponent(u) + (monto ? '/' + encodeURIComponent(monto) + encodeURIComponent(mon || '') : '');
  }
  function mensaje() {
    var nick = $('#mcm-nick').value.trim() || '(tu nick)';
    var precioTxt = actual.monto ? (actual.donacion ? 'más de ' : '') + (TI.simbolo || '$') + actual.monto + ' ' + actual.moneda : '';
    $('#mcm-msg').textContent = (actual.donacion ? 'Donación: Top Donador' : 'Compra: ' + actual.item) + (precioTxt ? ' (' + precioTxt + ')' : '') +
      '\nNick de Minecraft: ' + nick + '\nJava o Bedrock: ' + '\nID de la transacción de PayPal: ' + '\n(adjunto la captura del pago)';
  }
  function setLink(a, url, textoSin) {
    if (url) { a.href = url; a.removeAttribute('aria-disabled'); a.classList.remove('off'); a.dataset.t && (a.textContent = a.dataset.t); }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.classList.add('off'); a.dataset.t = a.dataset.t || a.textContent; a.textContent = textoSin; }
  }
  function abrirCompra(b) {
    desenfocar();
    ultimoBoton = b;
    actual = { item: b.dataset.item, monto: b.dataset.monto, moneda: b.dataset.moneda || TI.moneda || 'MXN', donacion: !!b.dataset.donacion };
    $('#mcm-tipo').textContent = actual.donacion ? 'Donar' : 'Comprar';
    $('#mcm-t').textContent = actual.donacion ? 'Top Donador' : actual.item;
    $('#mcm-precio').innerHTML = actual.monto ? (actual.donacion ? '<small>más de</small> ' : '') + dinero(actual.monto, actual.moneda) : '';
    $('#mcm-p1').innerHTML = actual.donacion
      ? 'Dona <b>más de ' + esc((TI.simbolo || '$') + actual.monto + ' ' + actual.moneda) + '</b> (puedes cambiar la cantidad en PayPal). En la nota del pago escribe tu nick.'
      : 'El link ya trae el precio (' + esc((TI.simbolo || '$') + actual.monto + ' ' + actual.moneda) + '). En la nota del pago escribe tu nick y lo que compras.';
    setLink($('#mcm-paypal'), linkPaypal(actual.monto, actual.moneda), 'PayPal: pronto');
    setLink($('#mcm-discord'), TI.discord || '', 'Discord: pronto');
    $('#mcm-p3').textContent = actual.donacion ? 'Alexito te da el rango Top Donador a mano y reclamas tu kit en /kits.' : 'Un admin revisa el pago y te lo entrega en el server, normalmente el mismo día.';
    $('#mcm-nota').textContent = TI.notaCompra || '';
    mensaje();
    compra.hidden = false; document.documentElement.classList.add('mc-sin-scroll');
    setTimeout(function () { $('#mcm-nick').focus(); }, 50);
  }
  function cerrarCompra() { compra.hidden = true; document.documentElement.classList.remove('mc-sin-scroll'); if (ultimoBoton) ultimoBoton.focus(); }
  $('#mcm-nick').addEventListener('input', mensaje);
  try { $('#mcm-nick').value = localStorage.getItem('mcNick') || ''; } catch (e) {}
  $('#mcm-nick').addEventListener('change', function () { try { localStorage.setItem('mcNick', this.value.trim()); } catch (e) {} });
  $('#mcm-copiar').addEventListener('click', function () {
    var b = this, txt = $('#mcm-msg').textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.textContent = '¡Copiado!'; }, function () {
      var r = document.createRange(); r.selectNodeContents($('#mcm-msg')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selecciónalo y copia';
    });
    setTimeout(function () { b.textContent = 'Copiar mensaje'; }, 1800);
  });
  compra.querySelector('.x').addEventListener('click', cerrarCompra);
  compra.addEventListener('click', function (e) { if (e.target === compra) cerrarCompra(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !compra.hidden) cerrarCompra(); });
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.mc-comprar'); if (b) abrirCompra(b); });

  /* enlaces internos #rangos, #armas... (del carrusel o compartidos) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1); if (!CATS.some(function (c) { return c.id === id; })) return;
    e.preventDefault(); abrir(id, 'link');
  });
  addEventListener('hashchange', function () { abrir(location.hash.slice(1)); });
  abrir((location.hash || '#rangos').slice(1), false);
})();
