/* FurryLand · visor 3D de armaduras y armas (usa three.js)
   - No hace falta tocar este archivo: los datos (rangos, armaduras, armas, colores) están en minecraft-datos.js
   - Todos los visores comparten UN solo motor WebGL, así la página no se pone lenta aunque haya muchos modelos.
   - Arrastra un modelo con el ratón o el dedo para girarlo. */
(function () {
  'use strict';
  var MC = window.MC3D = { ok: false, PAL: null, viewer: null, icono: null, matNombre: null };

  /* ---------- colores de cada material: [base, oscuro, claro] ---------- */
  var PAL = MC.PAL = {
    cuero: ['#9a6234', '#6f4520', '#bf8148'],
    cadena: ['#9b9ba3', '#5d5d66', '#cdcdd6'],
    hierro: ['#d4d4d8', '#9e9ea6', '#f5f5f7'],
    oro: ['#f4cf38', '#c4930f', '#fff07f'],
    diamante: ['#43d8d0', '#1f9799', '#a9fff6'],
    netherite: ['#4a4247', '#2b2629', '#706469'],
    esmeralda: ['#3ccf68', '#1d8b3f', '#9effb8'],
    amatista: ['#a56cff', '#6a3cc0', '#d8b9ff'],
    rosa: ['#ff6fae', '#c2407d', '#ffc1dc'],
    madera: ['#a7824f', '#6f5530', '#caa66b'],
    piedra: ['#8e8e8e', '#636363', '#b3b3b3'],
    obsidiana: ['#2b1d44', '#160e26', '#4d3878']
  };
  var NOMBRE_MAT = {
    cuero: 'cuero', cadena: 'cota de malla', hierro: 'hierro', oro: 'oro', diamante: 'diamante',
    netherite: 'netherite', esmeralda: 'esmeralda', amatista: 'amatista', rosa: 'cuarzo rosa',
    madera: 'madera', piedra: 'piedra', obsidiana: 'obsidiana'
  };
  MC.matNombre = function (m) { return NOMBRE_MAT[m] || m; };

  function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function rgb2hex(c) { return '#' + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function shade(h, k) { var c = hex2rgb(h); return rgb2hex(c.map(function (v) { return k < 0 ? v * (1 + k) : v + (255 - v) * k; })); }
  function pal(m) {
    if (PAL[m]) return PAL[m];
    if (typeof m === 'string' && m.charAt(0) === '#') return [m, shade(m, -.32), shade(m, .4)];
    return PAL.hierro;
  }

  /* ---------- iconos 2D en pixel art (para items sin imagen) ---------- */
  var ICONOS = {
    gema: ['....kkkk....', '...kllaak...', '..klaaaadk..', '.klaaaaaadk.', 'kllaaaaaaddk', '.kaaaaaaddk.', '..kaaaaddk..', '...kaaddk...', '....kadk....', '.....kk.....', '............', '............'],
    pocion: ['....kkkk....', '....kwwk....', '.....kk.....', '....kwwk....', '...kwaalk...', '..kaaaaalk..', '..kaaaaaak..', '..kaaaaaak..', '..kdaaaaak..', '...kddaak...', '....kkkk....', '............'],
    llave: ['............', '..kkkk......', '.kllaak.....', '.klk.ak.....', '.kak.ak.....', '.kaaadk.....', '..kkadk.....', '....kadk....', '....kaakk...', '....kadak...', '....kaakk...', '.....kk.....'],
    comida: ['......kk....', '.....kdk....', '...kkkkkk...', '..klaaaaak..', '.klwaaaaaak.', '.klaaaaaaak.', '.kaaaaaaadk.', '.kaaaaaaadk.', '..kaaaaadk..', '..kdaaaddk..', '...kkkkkk...', '............'],
    cofre: ['............', '.kkkkkkkkkk.', '.kllllllllk.', '.kaaaaaaaak.', '.kaaaaaaaak.', '.kkkkwwkkkk.', '.kaaawwaaak.', '.kaaaaaaaak.', '.kaaaaaaaak.', '.kddddddddk.', '.kkkkkkkkkk.', '............'],
    capa: ['..kkkkkkkk..', '.kwwwwwwwwk.', '.kllaaaaaak.', '.klaaaaaaak.', '.klaaaaaaak.', '.kaaaaaaaak.', '.kaaaaaaaak.', '.kaaaaaaadk.', '.kaaaaaaadk.', '.kaaaaaaddk.', '.kdkdkdkddk.', '..k.k.k.kk..'],
    libro: ['............', '..kkkkkkkk..', '.kaaaaaaawk.', '.kalllaaawk.', '.kaaaaaaawk.', '.kalllllawk.', '.kaaaaaaawk.', '.kaaaaaaawk.', '.kdaaaaaawk.', '.kddddddddk.', '..kkkkkkkk..', '............'],
    estrella: ['.....kk.....', '....klak....', '....klak....', 'kkkkkaaakkkk', 'klllaaaaaadk', '.kaaaaaaadk.', '..kaaaaadk..', '..kaaaaaak..', '.kaadkkdaak.', '.kadk..kdak.', 'kddk....kddk', 'kkk......kkk']
  };
  MC.icono = function (canvas, tipo, color) {
    var p = ICONOS[tipo] || ICONOS.gema, c = pal(color || '#ff6fae');
    var map = { a: c[0], d: c[1], l: c[2], w: '#ffffff', k: '#1b1020' };
    var n = p.length; canvas.width = n; canvas.height = n;
    var x = canvas.getContext('2d'); x.clearRect(0, 0, n, n);
    for (var y = 0; y < n; y++) for (var i = 0; i < n; i++) { var ch = p[y].charAt(i); if (map[ch]) { x.fillStyle = map[ch]; x.fillRect(i, y, 1, 1); } }
  };

  if (!window.THREE) return;
  var T = window.THREE;
  MC.ok = true;

  /* ---------- texturas ---------- */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function canvas(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function toTex(c) {
    var t = new T.CanvasTexture(c);
    t.magFilter = T.NearestFilter; t.minFilter = T.NearestFilter; t.generateMipmaps = false;
    return t;
  }
  function ruido(cols, w, h, s, borde) {
    seed = s || 7;
    var c = canvas(w, h), x = c.getContext('2d');
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
      var r = rnd(); x.fillStyle = r < .62 ? cols[0] : r < .82 ? cols[1] : cols[2];
      x.fillRect(i, j, 1, 1);
    }
    if (borde) { x.fillStyle = cols[1]; x.fillRect(0, 0, w, 1); x.fillRect(0, h - 1, w, 1); x.fillRect(0, 0, 1, h); x.fillRect(w - 1, 0, 1, h); }
    return c;
  }
  function lambert(c, extra) {
    var o = { map: toTex(c) }; for (var k in extra) o[k] = extra[k];
    return new T.MeshLambertMaterial(o);
  }

  /* ---------- brillo de encantamiento (shader propio) ---------- */
  var TIEMPO = { value: 0 };
  var GLINT_VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}';
  var GLINT_FS = 'uniform sampler2D mascara;uniform float usaMascara;uniform float tiempo;uniform vec3 color;varying vec2 vUv;' +
    'void main(){float a=usaMascara>0.5?texture2D(mascara,vUv).a:1.0;if(a<0.5)discard;' +
    'float s=pow(sin((vUv.x+vUv.y)*5.0-tiempo*2.2)*0.5+0.5,7.0);' +
    'float s2=pow(sin((vUv.x*1.6-vUv.y)*8.0+tiempo*1.4)*0.5+0.5,9.0);' +
    'float g=0.05+s*0.42+s2*0.26;gl_FragColor=vec4(color*g,1.0);}';
  function glint(mascara) {
    return new T.ShaderMaterial({
      uniforms: { mascara: { value: mascara || null }, usaMascara: { value: mascara ? 1 : 0 }, tiempo: TIEMPO, color: { value: new T.Color(0.62, 0.32, 1.0) } },
      vertexShader: GLINT_VS, fragmentShader: GLINT_FS,
      transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.FrontSide
    });
  }
  var INVISIBLE = new T.MeshBasicMaterial({ visible: false });

  function caja(w, h, d, mats) {
    var m = new T.Mesh(new T.BoxGeometry(w, h, d), mats);
    return m;
  }

  /* ---------- piezas de armadura ---------- */
  function pieza(nombre, w, h, d, cols, s, opciones) {
    opciones = opciones || {};
    var c = ruido(cols, Math.max(4, Math.round(w)), Math.max(4, Math.round(h)), s, true);
    var mat = lambert(c, opciones.frenteHueco ? { alphaTest: .5 } : {});
    var mats = [mat, mat, mat, mat, mat, mat], mascara = null;
    if (opciones.frenteHueco) {
      var f = ruido(cols, 10, 10, s + 3, true), fx = f.getContext('2d');
      fx.clearRect(1, 3, 8, 7);
      var fm = lambert(f, { alphaTest: .5, transparent: false });
      mascara = fm.map;
      mats[4] = fm; mats[3] = INVISIBLE; /* frente con hueco para la cara, sin fondo */
    }
    if (opciones.sinFondo) mats[3] = INVISIBLE;
    var m = caja(w, h, d, mats);
    m.userData.mats = mats.filter(function (x) { return x !== INVISIBLE; });
    if (opciones.brillo) {
      var gm = glint(), gl = [gm, gm, gm, gm, gm, gm];
      if (opciones.frenteHueco) { gl[4] = glint(mascara); gl[3] = INVISIBLE; }
      if (opciones.sinFondo) gl[3] = INVISIBLE;
      var g = caja(w + .06, h + .06, d + .06, gl);
      m.add(g);
    }
    m.name = nombre;
    return m;
  }

  /* ---------- personaje (zorrito/a peludo de FurryLand) ---------- */
  function personaje(spec) {
    var piel = spec.piel || {};
    var fur = [piel.pelo || '#f7a8cb', shade(piel.pelo || '#f7a8cb', -.14), shade(piel.pelo || '#f7a8cb', .18)];
    var panza = piel.panza || '#fff2f8', ojos = piel.ojos || '#3b1b5f', ropa = piel.ropa || '#2a2342';
    var root = new T.Group(), partes = {};
    function piezas(slot, m) { (partes[slot] = partes[slot] || []).push(m); }

    /* cabeza */
    var cab = new T.Group(); cab.position.set(0, 24, 0); root.add(cab);
    var cara = ruido(fur, 8, 8, 11), cx = cara.getContext('2d');
    cx.fillStyle = panza; cx.fillRect(2, 5, 4, 3);
    cx.fillStyle = '#ffffff'; cx.fillRect(1, 3, 1, 2); cx.fillRect(6, 3, 1, 2);
    cx.fillStyle = ojos; cx.fillRect(2, 3, 1, 2); cx.fillRect(5, 3, 1, 2);
    cx.fillStyle = '#5b2241'; cx.fillRect(3, 5, 2, 1);
    cx.fillStyle = '#ff8fbf'; cx.fillRect(1, 5, 1, 1); cx.fillRect(6, 5, 1, 1);
    var mPelo = lambert(ruido(fur, 8, 8, 12)), mCara = lambert(cara);
    var cabeza = caja(8, 8, 8, [mPelo, mPelo, mPelo, mPelo, mCara, mPelo]); cabeza.position.y = 4; cab.add(cabeza);
    var mOreja = lambert(ruido(fur, 2, 4, 13)), oi = ruido([panza, '#ffd7ea', '#ffe6f2'], 2, 4, 14), mOI = lambert(oi);
    [-2.6, 2.6].forEach(function (x) {
      var o = caja(2.4, 4, 1.2, [mOreja, mOreja, mOreja, mOreja, mOI, mOreja]);
      o.position.set(x, 9.6, -.4); o.rotation.z = x < 0 ? .12 : -.12; cab.add(o);
    });

    /* cuerpo */
    var tor = ruido([ropa, shade(ropa, -.2), shade(ropa, .15)], 8, 12, 21), tx = tor.getContext('2d');
    tx.fillStyle = panza; tx.fillRect(2, 0, 4, 3);
    var mTor = lambert(tor), mRopa = lambert(ruido([ropa, shade(ropa, -.2), shade(ropa, .15)], 8, 12, 22));
    var cuerpo = caja(8, 12, 4, [mRopa, mRopa, mRopa, mRopa, mTor, mRopa]); cuerpo.position.y = 18; root.add(cuerpo);

    /* cola */
    var cola = new T.Group(); cola.position.set(0, 13, -2); root.add(cola);
    var c1 = caja(3.2, 3.2, 7, lambert(ruido(fur, 4, 7, 31))); c1.position.z = -3.4; cola.add(c1);
    var c2 = caja(3.4, 3.4, 2.4, lambert(ruido([panza, '#ffe6f2', '#ffffff'], 4, 3, 32))); c2.position.z = -8; cola.add(c2);
    cola.rotation.x = -.55;

    /* brazos y piernas: grupos con el pivote en el hombro/cadera */
    var mBrazo = lambert(ruido(fur, 4, 12, 41)), mPierna = lambert(ruido([ropa, shade(ropa, -.2), shade(ropa, .15)], 4, 12, 51));
    var brazoD = new T.Group(), brazoI = new T.Group(), piernaD = new T.Group(), piernaI = new T.Group();
    brazoD.position.set(-6, 22, 0); brazoI.position.set(6, 22, 0);
    piernaD.position.set(-2, 12, 0); piernaI.position.set(2, 12, 0);
    [brazoD, brazoI].forEach(function (g) { var m = caja(4, 12, 4, mBrazo); m.position.y = -4; g.add(m); root.add(g); });
    [piernaD, piernaI].forEach(function (g) { var m = caja(4, 12, 4, mPierna); m.position.y = -6; g.add(m); root.add(g); });

    /* armadura */
    var A = spec.armadura || {};
    if (A.casco) {
      var hc = pal(A.casco.mat);
      var casco = pieza('casco', 10, 10, 10, hc, 101, { frenteHueco: true, brillo: A.casco.brillo });
      casco.position.y = 4; cab.add(casco); piezas('casco', casco);
    }
    if (A.pechera) {
      var pc = pal(A.pechera.mat);
      var pe = pieza('pechera', 9.6, 12.6, 5.6, pc, 201, { brillo: A.pechera.brillo }); pe.position.y = 18.2; root.add(pe); piezas('pechera', pe);
      [brazoD, brazoI].forEach(function (g, k) {
        var h = pieza('hombrera', 5.6, 6.6, 5.6, pc, 210 + k, { brillo: A.pechera.brillo, sinFondo: false }); h.position.y = -.9; g.add(h); piezas('pechera', h);
      });
    }
    if (A.pantalones) {
      var lc = pal(A.pantalones.mat);
      var cin = pieza('cintura', 9.2, 3.4, 5.2, lc, 301, { brillo: A.pantalones.brillo }); cin.position.y = 13.4; root.add(cin); piezas('pantalones', cin);
      [piernaD, piernaI].forEach(function (g, k) { var p = pieza('pierna', 4.9, 8.4, 4.9, lc, 310 + k, { brillo: A.pantalones.brillo }); p.position.y = -4.2; g.add(p); piezas('pantalones', p); });
    }
    if (A.botas) {
      var bc = pal(A.botas.mat);
      [piernaD, piernaI].forEach(function (g, k) { var b = pieza('bota', 5.4, 4.6, 5.4, bc, 401 + k, { brillo: A.botas.brillo }); b.position.y = -9.9; g.add(b); piezas('botas', b); });
    }

    /* capa (cosmético) */
    var capa = null;
    if (spec.capa) {
      var cc = pal(spec.capa), cv = ruido(cc, 10, 16, 501, true), cvx = cv.getContext('2d');
      cvx.fillStyle = cc[2]; cvx.fillRect(4, 5, 2, 2); cvx.fillRect(3, 6, 4, 2); cvx.fillRect(4, 8, 2, 1);
      capa = new T.Group(); capa.position.set(0, 24, -2.9); root.add(capa);
      var cm = lambert(ruido(cc, 10, 16, 502));
      var cmesh = caja(10, 16, .8, [cm, cm, cm, cm, cm, lambert(cv)]); cmesh.position.y = -8; capa.add(cmesh);
      capa.rotation.x = .12; piezas('capa', cmesh);
      cola.position.z = -3.4;
    }

    /* arma en la mano derecha */
    if (spec.arma) {
      var a = arma3d(spec.arma, true);
      var porta = new T.Group(); porta.position.set(0, -10, 1.2); porta.rotation.y = -Math.PI / 2; porta.add(a);
      a.position.set(5.5, 5.5, 0);
      brazoD.add(porta); brazoD.rotation.x = -.38; piezas('arma', a);
    }

    root.userData = { cab: cab, cola: cola, brazoD: brazoD, brazoI: brazoI, piernaD: piernaD, piernaI: piernaI, capa: capa, partes: partes, conArma: !!spec.arma };
    return root;
  }

  /* ---------- armas: sprite de 16x16 "extruido" en capas ---------- */
  function linea(g, x0, y0, x1, y1, ch) {
    var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (var i = 0; i <= n; i++) { var x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n); if (g[y]) g[y][x] = ch; }
  }
  function vacia() { var g = []; for (var y = 0; y < 16; y++) { g.push([]); for (var x = 0; x < 16; x++) g[y].push('.'); } return g; }
  var FORMAS = {
    espada: ['..............BB', '.............BeB', '............BebB', '...........BebB.', '..........BebB..', '.........BebB...', '........BebB....', '.......BebB.....', '..gg..BebB......', '..gggBebB.......', '...ggebB........', '...hggB.........', '..hHggg.........', '.hH...gg........', 'hH..............', 'H...............'],
    hacha: (function () {
      var g = vacia(), x, y;
      for (y = 0; y < 16; y++) for (x = 0; x < 16; x++) {
        var dx = x - 6, dy = y - 5;
        if (dx * dx / 20 + dy * dy / 14 < 1 && x + y < 15) g[y][x] = 'b';
      }
      var o = g.map(function (r) { return r.slice(); });
      for (y = 0; y < 16; y++) for (x = 0; x < 16; x++) {
        if (g[y][x] !== 'b') continue;
        var borde = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(function (d) { var r = g[y + d[1]]; return !r || r[x + d[0]] !== 'b'; });
        o[y][x] = borde ? 'B' : (x + y < 9 ? 'e' : 'b');
      }
      linea(o, 0, 15, 12, 3, 'h'); linea(o, 1, 15, 13, 3, 'H');
      return o.map(function (r) { return r.join(''); });
    })(),
    arco: (function () {
      var g = vacia(); var prev = null;
      for (var t = 0; t <= 40; t++) {
        var a = t / 40 * Math.PI / 2, x = Math.round(2 + 11 * Math.cos(a)), y = Math.round(13 - 11 * Math.sin(a));
        g[y][x] = (t > 16 && t < 24) ? 'h' : 'B'; if (y + 1 < 16 && x - 1 >= 0 && g[y + 1][x - 1] === '.' && t % 3 === 0) g[y + 1][x - 1] = 'b';
      }
      linea(g, 2, 2, 13, 13, 's');
      return g.map(function (r) { return r.join(''); });
    })(),
    tridente: (function () {
      var g = vacia();
      linea(g, 1, 14, 10, 5, 'h'); linea(g, 2, 14, 10, 6, 'H');
      linea(g, 8, 4, 12, 8, 'B'); linea(g, 8, 3, 13, 8, 'b');
      linea(g, 9, 3, 13, 0, 'e'); linea(g, 10, 4, 15, 1, 'b'); linea(g, 12, 6, 15, 3, 'e');
      linea(g, 8, 3, 8, 0, 'b'); linea(g, 13, 8, 15, 8, 'b');
      return g.map(function (r) { return r.join(''); });
    })()
  };
  function spriteCanvas(spec) {
    var f = FORMAS[spec.tipo] || FORMAS.espada, c = pal(spec.mat || 'hierro');
    var colores = { b: c[0], B: c[1], e: c[2], h: '#7a5531', H: '#4b331b', g: spec.guarda || shade(c[1], -.35), s: '#ecebf2' };
    var cv = canvas(16, 16), x = cv.getContext('2d');
    for (var y = 0; y < 16; y++) for (var i = 0; i < 16; i++) { var ch = (f[y] || '').charAt(i); if (colores[ch]) { x.fillStyle = colores[ch]; x.fillRect(i, y, 1, 1); } }
    return cv;
  }
  function arma3d(spec, enMano) {
    var g = new T.Group(), cv = spriteCanvas(spec), tex = toTex(cv);
    var capas = 12, grosor = 1;
    var mat = new T.MeshLambertMaterial({ map: tex, alphaTest: .5, side: T.DoubleSide });
    var geo = new T.PlaneGeometry(16, 16);
    var mats = [];
    for (var i = 0; i < capas; i++) {
      var m = new T.Mesh(geo, mat); m.position.z = -grosor / 2 + grosor * i / (capas - 1); g.add(m);
    }
    mats.push(mat);
    if (spec.brillo) {
      [-grosor / 2 - .02, grosor / 2 + .02].forEach(function (z) {
        var gm = glint(tex); gm.side = T.DoubleSide;
        var p = new T.Mesh(geo, gm); p.position.z = z; g.add(p);
      });
    }
    g.userData.mats = mats;
    return g;
  }

  /* ---------- sombra suave en el piso ---------- */
  var sombraTex = null;
  function sombra(r) {
    if (!sombraTex) {
      var c = canvas(64, 64), x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 2, 32, 32, 32);
      gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      sombraTex = new T.CanvasTexture(c);
    }
    var m = new T.Mesh(new T.PlaneGeometry(r * 2, r * 2), new T.MeshBasicMaterial({ map: sombraTex, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; return m;
  }

  /* ---------- motor compartido ---------- */
  var R = null, RW = 0, RH = 0, visores = [], corriendo = false;
  var reducido = false; try { reducido = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function motor() {
    if (R) return R;
    try { R = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { MC.ok = false; return null; }
    R.setPixelRatio(1); R.setClearColor(0x000000, 0); R.autoClear = false;
    return R;
  }
  function asegurar(w, h) { if (w > RW || h > RH) { RW = Math.max(w, RW); RH = Math.max(h, RH); R.setSize(RW, RH, false); } }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { var v = e.target.__visor; if (v) v.visible = e.isIntersecting; });
  }, { rootMargin: '120px' }) : null;

  var t0 = performance.now(), ultimo = t0;
  function bucle(ahora) {
    var dt = Math.min(.05, (ahora - ultimo) / 1000); ultimo = ahora;
    var t = (ahora - t0) / 1000;
    TIEMPO.value = reducido ? 1.3 : t;
    if (!document.hidden) visores.forEach(function (v) { if (v.visible && v.vivo) v.dibujar(t, dt); });
    requestAnimationFrame(bucle);
  }

  MC.viewer = function (cv, spec) {
    if (!MC.ok || !motor()) return null;
    var escena = new T.Scene();
    escena.add(new T.AmbientLight(0xffffff, .62));
    var sol = new T.DirectionalLight(0xffffff, .62); sol.position.set(.6, 1, .9); escena.add(sol);
    var rosa = new T.DirectionalLight(0xff8fc4, .38); rosa.position.set(-1, .3, -.8); escena.add(rosa);

    var esArma = spec.modo === 'arma';
    var modelo, camara, centroY;
    if (esArma) {
      modelo = new T.Group(); var a = arma3d(spec.arma); a.rotation.z = spec.arma.tipo === 'tridente' ? 0 : 0; modelo.add(a);
      escena.add(modelo);
      var s = sombra(7); s.position.y = -11; escena.add(s);
      camara = new T.PerspectiveCamera(32, 1, 1, 200); camara.position.set(0, 1.5, 36); camara.lookAt(0, -1, 0);
      centroY = 0;
    } else {
      modelo = personaje(spec); escena.add(modelo);
      var s2 = sombra(10); s2.position.y = .05; escena.add(s2);
      camara = new T.PerspectiveCamera(30, 1, 1, 400); camara.position.set(0, 21, 78); camara.lookAt(0, 17, 0);
    }

    var v = { visible: !io, vivo: true, giro: spec.giroInicial != null ? spec.giroInicial : (esArma ? 0 : -.5), vel: 0, arrastrando: false, resaltado: null };
    var ctx = cv.getContext('2d');

    /* arrastrar para girar */
    var px = 0, ultimoMov = 0;
    cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', function (e) { v.arrastrando = true; px = e.clientX; v.vel = 0; cv.style.cursor = 'grabbing'; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener('pointermove', function (e) { if (!v.arrastrando) return; var d = (e.clientX - px) / 90; px = e.clientX; v.giro += d; v.vel = d * 30; ultimoMov = performance.now(); });
    function soltar() { v.arrastrando = false; cv.style.cursor = 'grab'; if (performance.now() - ultimoMov > 120) v.vel = 0; }
    cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);

    function medir() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w; cv.height = h; camara.aspect = w / h; camara.updateProjectionMatrix();
        /* alejar la cámara lo justo para que el modelo quepa a lo alto y a lo ancho */
        var alto = esArma ? 26 : 46, ancho = esArma ? 26 : 30, tg = Math.tan(camara.fov * Math.PI / 360);
        var dist = Math.max(alto / 2 / tg, ancho / 2 / (tg * camara.aspect));
        if (esArma) { camara.position.set(0, 1.5, dist); camara.lookAt(0, -1, 0); }
        else { camara.position.set(0, 20, dist); camara.lookAt(0, 16.5, 0); }
      }
    }

    v.dibujar = function (t, dt) {
      if (!cv.isConnected) { v.vivo = false; return; }
      medir(); var w = cv.width, h = cv.height; if (w < 4 || h < 4) return;
      if (!v.arrastrando) {
        if (Math.abs(v.vel) > .01) { v.giro += v.vel * dt; v.vel *= Math.pow(.04, dt); }
        else if (!reducido) v.giro += dt * .55;
      }
      modelo.rotation.y = v.giro;
      var u = modelo.userData;
      if (esArma) {
        modelo.position.y = reducido ? 0 : Math.sin(t * 1.6) * .8;
      } else if (!reducido) {
        u.brazoI.rotation.x = Math.sin(t * 1.4) * .08; u.brazoI.rotation.z = .05 + Math.sin(t * 1.1) * .03;
        if (!u.conArma) u.brazoD.rotation.x = -Math.sin(t * 1.4) * .08;
        u.brazoD.rotation.z = -.05 - Math.sin(t * 1.1) * .03;
        u.cab.rotation.y = Math.sin(t * .7) * .18; u.cab.rotation.x = Math.sin(t * 1.4) * .03;
        u.cola.rotation.y = Math.sin(t * 3.2) * .38;
        if (u.capa) u.capa.rotation.x = .14 + Math.sin(t * 1.8) * .05;
      }
      /* resaltar la pieza que el visitante señala en la lista */
      var pulso = .5 + .5 * Math.sin(t * 6);
      if (u.partes) Object.keys(u.partes).forEach(function (slot) {
        var on = v.resaltado === slot;
        u.partes[slot].forEach(function (m) {
          (m.userData.mats || []).forEach(function (mt) { if (mt.emissive) mt.emissive.setRGB(on ? .32 * pulso + .08 : 0, on ? .12 * pulso : 0, on ? .22 * pulso + .05 : 0); });
          m.scale.setScalar(on ? 1.04 : 1);
        });
      });

      asegurar(w, h);
      R.setViewport(0, RH - h, w, h); R.setScissor(0, RH - h, w, h); R.setScissorTest(true);
      R.clear(); R.render(escena, camara);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(R.domElement, 0, 0, w, h, 0, 0, w, h);
    };

    v.resaltar = function (slot) { v.resaltado = slot; };
    cv.__visor = v; if (io) io.observe(cv);
    visores.push(v);
    if (!corriendo) { corriendo = true; requestAnimationFrame(bucle); }
    return v;
  };
})();
