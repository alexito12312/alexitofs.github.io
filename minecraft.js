/* FurryLand · arma la página de Minecraft con los datos de minecraft-datos.js
   (no hace falta tocar este archivo para cambiar textos o precios) */
(function () {
  'use strict';
  var D = window.FURRYLAND || {}, MC = window.MC3D || {}, S = D.servidor || {}, TI = D.tienda || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function precio(p) { return p == null ? '<span class="mc-free">Gratis · en el server</span>' : '<div class="mc-price">' + esc(TI.simbolo || '$') + esc(p) + '<small>' + esc(TI.moneda || 'USD') + '</small></div>'; }
  function comprar(nombre, extra) {
    return '<a class="btn btn-primary" href="' + esc(TI.comprarUrl || 'contacto.html') + '" data-item="' + esc(nombre) + '">' + esc(extra || TI.comprarTexto || 'Comprar') + '</a>';
  }
  function colorMat(m) { var p = (MC.PAL && MC.PAL[m]) || null; return p ? p[0] : (m && m.charAt && m.charAt(0) === '#' ? m : '#d4d4d8'); }

  /* ---------- logo + IP ---------- */
  (function () {
    var nombre = S.nombre || 'FURRYLAND', box = $('#logo');
    var mitad = Math.ceil(nombre.length * 5 / 9);
    var texto = '<h1 class="mc-wordmark">' + esc(nombre.slice(0, mitad)) + '<span>' + esc(nombre.slice(mitad)) + '</span></h1>';
    if (S.logo) {
      var img = new Image(); img.alt = nombre;
      img.onload = function () { box.innerHTML = ''; box.appendChild(img); };
      img.onerror = function () { box.innerHTML = texto; };
      box.innerHTML = texto; img.src = S.logo;
    } else box.innerHTML = texto;
    $('#autor').textContent = S.autor || 'AlexitoFS';
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
      var fondo = s.img ? 'background-image:url(\'' + encodeURI(s.img) + '\')' : 'background:radial-gradient(80% 90% at 85% 10%,' + c[0] + '66,transparent 60%),linear-gradient(135deg,' + c[1] + ',#1a0d2e)';
      var sl = el('<div class="mc-sl" role="group" aria-roledescription="diapositiva" aria-label="' + (i + 1) + ' de ' + datos.length + '" style="' + fondo + '">' +
        (s.img ? '' : '<div class="pat"></div>') +
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
    function reiniciar() { clearInterval(timer); if (!reducido && n > 1) timer = setInterval(function () { ir(actual + 1); }, 6500); }
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

  /* ---------- piezas con sus encantamientos ---------- */
  var SLOTS = [['casco', 'Casco'], ['pechera', 'Pechera'], ['pantalones', 'Pantalones'], ['botas', 'Botas']];
  function listaPiezas(set, conArma) {
    var h = '<ul class="mc-pieces">';
    SLOTS.forEach(function (s) {
      var p = set[s[0]]; if (!p) return;
      h += pz(s[0], p.nombre || s[1] + ' de ' + MC.matNombre(p.mat), s[1], p);
    });
    if (conArma && set.arma) { var a = set.arma; h += pz('arma', a.nombre || a.tipo + ' de ' + MC.matNombre(a.mat), 'Arma', a); }
    return h + '</ul>';
  }
  function pz(slot, nombre, tipo, p) {
    var en = p.encantamientos || [];
    return '<li tabindex="0" data-slot="' + slot + '"><div class="pz"><i style="background:' + colorMat(p.mat) + '"></i>' + esc(nombre) + '<em>' + esc(tipo) + '</em></div>' +
      '<div class="mc-ench">' + (en.length ? en.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join('') : '<span class="none">Sin encantamientos</span>') + '</div></li>';
  }
  function specPersonaje(set, piel, capa) {
    var arm = {};
    SLOTS.forEach(function (s) { var p = set[s[0]]; if (p) arm[s[0]] = { mat: p.mat, brillo: !!(p.encantamientos && p.encantamientos.length) }; });
    var spec = { modo: 'personaje', armadura: arm, piel: piel || {}, capa: capa || null };
    if (set.arma) spec.arma = { tipo: set.arma.tipo, mat: set.arma.mat, brillo: !!(set.arma.encantamientos && set.arma.encantamientos.length) };
    return spec;
  }

  /* los visores se crean cuando su pestaña se abre (antes no tienen tamaño) */
  var pendientes = {};
  function visor(panelId, stage, spec, lista) {
    (pendientes[panelId] = pendientes[panelId] || []).push(function () {
      var cv = stage.querySelector('canvas');
      var v = MC.viewer ? MC.viewer(cv, spec) : null;
      if (!v) { stage.innerHTML = '<div class="mc-sin3d" style="position:absolute;inset:0">Tu navegador no puede mostrar el modelo 3D.</div>'; return; }
      if (lista) [].forEach.call(lista.querySelectorAll('[data-slot]'), function (li) {
        function on() { v.resaltar(li.dataset.slot); li.classList.add('on'); }
        function off() { v.resaltar(null); li.classList.remove('on'); }
        li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
        li.addEventListener('focus', on); li.addEventListener('blur', off);
        li.addEventListener('click', on);
      });
    });
  }

  function tarjetaGrande(panelId, o) {
    var c = el('<article class="mc-big' + (o.destacado ? ' dest' : '') + '" style="--c:' + esc(o.color || '#ff6fae') + '">' +
      '<div class="mc-stage">' + (o.ribbon ? '<span class="ribbon">' + esc(o.ribbon) + '</span>' : '') + '<canvas aria-label="Modelo 3D de ' + esc(o.nombre) + '" role="img"></canvas><span class="hint">Arrastra para girar</span></div>' +
      '<div class="mc-info"><div class="mc-top"><div><span class="eyebrow">' + esc(o.eyebrow || '') + '</span><h3>' + esc(o.nombre) + '</h3></div>' + (o.sinPrecio ? '' : precio(o.precio)) + '</div>' +
      (o.descripcion ? '<p>' + esc(o.descripcion) + '</p>' : '') +
      (o.ventajas && o.ventajas.length ? '<h4>Ventajas</h4><ul class="mc-perks">' + o.ventajas.map(function (v) { return '<li>' + esc(v) + '</li>'; }).join('') + '</ul>' : '') +
      '<h4>' + esc(o.tituloPiezas || 'Piezas y encantamientos') + '</h4>' + listaPiezas(o.set, true) +
      (o.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(o.obtener) + '</div>' : '') +
      (o.precio != null && !o.sinPrecio ? '<div class="mc-actions">' + comprar(o.nombre, o.textoBoton) + '</div>' : (o.accion || '')) +
      '</div></article>');
    visor(panelId, c.querySelector('.mc-stage'), specPersonaje(o.set, o.piel, o.capa), c.querySelector('.mc-pieces'));
    return c;
  }

  /* ---------- pestañas ---------- */
  var CATS = [
    { id: 'rangos', nombre: 'Rangos', icono: 'estrella', color: '#ff6fae' },
    { id: 'items', nombre: 'Items', icono: 'gema', color: 'diamante' },
    { id: 'armas', nombre: 'Armas', icono: 'espada' },
    { id: 'armaduras', nombre: 'Armaduras', icono: 'capa', color: 'hierro' },
    { id: 'donadores', nombre: 'Donadores', icono: 'cofre', color: 'oro' }
  ];
  var tabs = $('#tabs'), panels = $('#panels'), creados = {};
  CATS.forEach(function (c) {
    var b = el('<button type="button" role="tab" id="tab-' + c.id + '" aria-controls="p-' + c.id + '" aria-selected="false" tabindex="-1"><canvas width="12" height="12"></canvas>' + esc(c.nombre) + '</button>');
    var ic = b.querySelector('canvas');
    if (c.icono === 'espada') { MC.icono && MC.icono(ic, 'estrella', '#43d8d0'); dibujaEspadita(ic); } else if (MC.icono) MC.icono(ic, c.icono, c.color);
    b.addEventListener('click', function () { abrir(c.id, true); });
    tabs.appendChild(b);
    var p = el('<section class="mc-panel" role="tabpanel" id="p-' + c.id + '" aria-labelledby="tab-' + c.id + '" hidden></section>');
    panels.appendChild(p);
  });
  function dibujaEspadita(cv) {
    var f = ['..........kk', '.........kek', '........kebk', '.......kebk.', '......kebk..', '.k...kebk...', '.kk.kebk....', '..kkebk.....', '...kkk......', '..khkkk.....', '.khk..k.....', 'kk..........'];
    cv.width = cv.height = 12; var x = cv.getContext('2d'); x.clearRect(0, 0, 12, 12);
    var m = { k: '#1b1020', e: '#a9fff6', b: '#43d8d0', h: '#7a5531' };
    f.forEach(function (r, y) { for (var i = 0; i < 12; i++) { var ch = r.charAt(i); if (m[ch]) { x.fillStyle = m[ch]; x.fillRect(i, y, 1, 1); } } });
  }
  tabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var bs = [].slice.call(tabs.children), i = bs.indexOf(document.activeElement); if (i < 0) return;
    var j = (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length; bs[j].focus(); bs[j].click(); e.preventDefault();
  });

  function abrir(id, desdeClic) {
    if (!CATS.some(function (c) { return c.id === id; })) id = 'rangos';
    CATS.forEach(function (c) {
      var on = c.id === id, b = $('#tab-' + c.id), p = $('#p-' + c.id);
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; p.hidden = !on;
    });
    if (!creados[id]) { creados[id] = true; CONSTRUIR[id]($('#p-' + id)); }
    (pendientes['p-' + id] || []).splice(0).forEach(function (f) { f(); });
    if (desdeClic) {
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
      var t = $('#tabs'); var y = t.getBoundingClientRect().top + scrollY - 90;
      if (scrollY > y + 10 || desdeClic === 'link') scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  var CONSTRUIR = {
    rangos: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Rangos</h2><p class="lede">Cada rango trae su kit: armadura completa y arma, con sus encantamientos. Pasa el ratón por una pieza para verla brillar en el modelo.</p>';
      (D.rangos || []).forEach(function (r) {
        p.appendChild(tarjetaGrande('p-rangos', {
          nombre: r.nombre, color: r.color, precio: r.precio, descripcion: r.descripcion, ventajas: r.ventajas,
          set: r.kit || {}, piel: r.piel, capa: r.capa, destacado: r.destacado, ribbon: r.destacado ? 'Más popular' : '',
          eyebrow: 'Rango', tituloPiezas: 'Kit del rango', textoBoton: 'Comprar ' + r.nombre
        }));
      });
    },
    items: function (p) {
      var lista = D.items || [];
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Items</h2><p class="lede">Los cosméticos de paga solo cambian cómo te ves. Los items gratis se consiguen jugando en el server.</p>' +
        '<div class="mc-filter" role="group" aria-label="Filtrar items"><button type="button" data-f="todos" aria-pressed="true">Todos</button><button type="button" data-f="pago" aria-pressed="false">Cosméticos de paga</button><button type="button" data-f="gratis" aria-pressed="false">Gratis</button></div><div class="mc-grid"></div>';
      var g = p.querySelector('.mc-grid');
      lista.forEach(function (it) {
        var es3d = !!it.capa;
        var c = el('<article class="mc-card" data-tipo="' + (it.dePaga ? 'pago' : 'gratis') + '" style="--c:' + esc(colorMat(it.capa || it.color || '#ff6fae')) + '">' +
          '<div class="mc-stage' + (es3d ? '' : ' ico') + '">' + (es3d ? '<canvas role="img" aria-label="Vista 3D de ' + esc(it.nombre) + '"></canvas>' : (it.img ? '<img src="' + esc(it.img) + '" alt="">' : '<canvas></canvas>')) + '</div>' +
          '<div class="body"><div class="row"><span class="mc-badge ' + (it.dePaga ? 'pago">De paga' : 'gratis">Gratis') + '</span>' + (it.dePaga ? precio(it.precio) : '') + '</div>' +
          '<h3>' + esc(it.nombre) + '</h3><p>' + esc(it.descripcion || '') + '</p>' +
          (!it.dePaga && it.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(it.obtener) + '</div>' : '') +
          (it.dePaga ? '<div class="mc-actions">' + comprar(it.nombre) + '</div>' : '') + '</div></article>');
        if (es3d) visor('p-items', c.querySelector('.mc-stage'), { modo: 'personaje', capa: it.capa, piel: it.piel || {}, giroInicial: Math.PI * .85 });
        else if (!it.img && MC.icono) MC.icono(c.querySelector('canvas'), it.icono, it.color);
        g.appendChild(c);
      });
      p.querySelector('.mc-filter').addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', x === b); });
        [].forEach.call(g.children, function (card) { card.hidden = b.dataset.f !== 'todos' && card.dataset.tipo !== b.dataset.f; });
      });
    },
    armas: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Armas</h2><p class="lede">Las armas que hay en FurryLand, con sus encantamientos. Algunas se consiguen jugando y otras solo en la tienda.</p><div class="mc-grid"></div>';
      var g = p.querySelector('.mc-grid');
      (D.armas || []).forEach(function (a) {
        var en = a.encantamientos || [];
        var c = el('<article class="mc-card" style="--c:' + esc(colorMat(a.mat)) + '"><div class="mc-stage"><canvas role="img" aria-label="Modelo 3D de ' + esc(a.nombre) + '"></canvas><span class="hint">Arrastra para girar</span></div>' +
          '<div class="body"><div class="row"><span class="mc-badge ' + (a.precio != null ? 'pago">Tienda' : 'gratis">En el server') + '</span>' + (a.precio != null ? precio(a.precio) : '') + '</div>' +
          '<h3>' + esc(a.nombre) + '</h3><div class="mc-ench">' + (en.length ? en.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join('') : '<span class="none">Sin encantamientos</span>') + '</div>' +
          (a.obtener ? '<div class="mc-obt"><b>Cómo se consigue:</b> ' + esc(a.obtener) + '</div>' : '') +
          (a.precio != null ? '<div class="mc-actions">' + comprar(a.nombre) + '</div>' : '') + '</div></article>');
        visor('p-armas', c.querySelector('.mc-stage'), { modo: 'arma', arma: { tipo: a.tipo, mat: a.mat, brillo: en.length > 0 } });
        g.appendChild(c);
      });
    },
    armaduras: function (p) {
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Armaduras</h2><p class="lede">Todas las armaduras del server. Cada pieza muestra sus propios encantamientos; las que brillan en morado están encantadas.</p>';
      (D.armaduras || []).forEach(function (a) {
        var col = a.color || colorMat((a.piezas && (a.piezas.pechera || a.piezas.casco) || {}).mat);
        p.appendChild(tarjetaGrande('p-armaduras', {
          nombre: a.nombre, color: col, precio: a.precio, descripcion: a.descripcion, set: a.piezas || {}, piel: a.piel,
          obtener: a.obtener, eyebrow: a.precio != null ? 'Tienda' : 'Se consigue jugando'
        }));
      });
    },
    donadores: function (p) {
      var d = D.donadores || {}, min = d.minimo || 15, sim = TI.simbolo || '$';
      p.innerHTML = '<span class="eyebrow">Categoría</span><h2>Donadores</h2>' +
        '<div class="mc-meta"><div class="big">' + esc(sim + min) + '<small>' + esc(TI.moneda || 'USD') + ' o más</small></div><p><b>' + esc(d.titulo || 'Top Donador') + '.</b> ' + esc(d.texto || '') + '</p></div>' +
        '<div class="mc-don"><div class="mc-box"><h3>Qué te llevas</h3><ul class="mc-list">' + (d.beneficios || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="mc-box"><h3>Top donadores</h3>' + ((d.top || []).length ? '<ol class="mc-rank">' + d.top.map(function (t, i) { return '<li><span class="pos">' + (i + 1) + '</span><b>' + esc(t.nick) + '</b><span>' + esc(sim + t.monto) + '</span></li>'; }).join('') + '</ol>' : '<p class="lede">Todavía no hay nadie. ¡Sé el primero!</p>') + '</div></div>';
      p.appendChild(tarjetaGrande('p-donadores', {
        nombre: 'Kit Top Donador', color: '#f4cf38', set: d.kit || {}, piel: d.piel, capa: d.capa, sinPrecio: true,
        eyebrow: 'Exclusivo', ribbon: 'Kit exclusivo', tituloPiezas: 'Contenido del kit',
        descripcion: 'Se entrega con /kit topdonador una vez que tienes el rango.',
        accion: '<div class="mc-actions">' + comprar('Top Donador', 'Donar ' + sim + min + ' o más') + '</div>'
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
