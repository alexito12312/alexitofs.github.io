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

  /* ---------- texturas reales del server (png) ---------- */
  var cacheTex = {};
  function cargarTex(url) {
    if (cacheTex[url]) return cacheTex[url];
    var t = new T.TextureLoader().load(url);
    t.magFilter = T.NearestFilter; t.minFilter = T.NearestFilter; t.generateMipmaps = false;
    return (cacheTex[url] = t);
  }
  /* transparencia de una textura en un punto (para no "tocar" partes vacías de la armadura) */
  var cacheAlfa = new WeakMap();
  function alfa(tex, uv) {
    var img = tex && tex.image; if (!img || !img.width) return 1;
    var d = cacheAlfa.get(img);
    if (!d) { var c = canvas(img.width, img.height), x = c.getContext('2d'); x.drawImage(img, 0, 0); try { d = x.getImageData(0, 0, img.width, img.height); } catch (e) { d = null; } cacheAlfa.set(img, d || 0); }
    if (!d) return 1;
    var px = Math.min(d.width - 1, Math.max(0, Math.floor(uv.x * d.width))), py = Math.min(d.height - 1, Math.max(0, Math.floor((1 - uv.y) * d.height)));
    return d.data[(py * d.width + px) * 4 + 3] / 255;
  }
  /* caja con el mapeo UV de Minecraft (plantilla de 64x32; sirve igual para la de 128x64) */
  function cajaMC(w, h, d, inflar, u, v, tex, espejo, brillo) {
    var g = new T.BoxGeometry(w + inflar * 2, h + inflar * 2, d + inflar * 2), W = 64, H = 32;
    /* orden de caras en three: +x, -x, +y, -y, +z (frente), -z (espalda) */
    var caras = [[u + d + w, v + d, d, h], [u, v + d, d, h], [u + d, v, w, d], [u + d + w, v, w, d], [u + d, v + d, w, h], [u + d + w + d, v + d, w, h]];
    if (espejo) { var tmp = caras[0]; caras[0] = caras[1]; caras[1] = tmp; }
    var uv = g.attributes.uv;
    caras.forEach(function (c, f) {
      var u0 = c[0] / W, u1 = (c[0] + c[2]) / W, vt = 1 - c[1] / H, vb = 1 - (c[1] + c[3]) / H;
      if (espejo) { var s = u0; u0 = u1; u1 = s; }
      uv.setXY(f * 4, u0, vt); uv.setXY(f * 4 + 1, u1, vt); uv.setXY(f * 4 + 2, u0, vb); uv.setXY(f * 4 + 3, u1, vb);
    });
    uv.needsUpdate = true;
    var mat = new T.MeshLambertMaterial({ map: tex, alphaTest: .1, side: T.DoubleSide });
    var m = new T.Mesh(g, mat); m.userData.mats = [mat];
    if (brillo) { var gm = glint(tex); gm.side = T.DoubleSide; var gl = new T.Mesh(g, gm); gl.scale.setScalar(1.006); m.add(gl); }
    return m;
  }
  /* modelos de bloque de Minecraft (json con "elements"): así están hechos los cascos 3D del server.
     Se pone en la cabeza como en el juego: 16 px del modelo = 10 px del jugador, centrado y girado 180°. */
  var cacheJson = {};
  function cargarJson(url) { return cacheJson[url] || (cacheJson[url] = fetch(url).then(function (r) { return r.json(); })); }
  var CARA = { east: 0, west: 1, up: 2, down: 3, south: 4, north: 5 };
  function modeloMC(url, texUrl, brillo, listo) {
    var raiz = new T.Group(), interno = new T.Group();
    var s = 10 / 16; interno.scale.setScalar(s); interno.position.set(0, 4, 0); interno.rotation.y = Math.PI;
    raiz.add(interno);
    cargarJson(url).then(function (j) {
      var tex = cargarTex(texUrl);
      var mat = new T.MeshLambertMaterial({ map: tex, alphaTest: .1, side: T.DoubleSide });
      var gm = brillo ? glint(tex) : null; if (gm) gm.side = T.DoubleSide;
      (j.elements || []).forEach(function (e) {
        var f = e.from, t = e.to, w = Math.max(.001, t[0] - f[0]), h = Math.max(.001, t[1] - f[1]), d = Math.max(.001, t[2] - f[2]);
        var g = new T.BoxGeometry(w, h, d), uv = g.attributes.uv, mats = [];
        for (var k = 0; k < 6; k++) mats.push(INVISIBLE);
        Object.keys(e.faces || {}).forEach(function (nom) {
          var i = CARA[nom], fc = e.faces[nom]; if (i == null) return;
          var u = fc.uv || [0, 0, 16, 16], u0 = u[0] / 16, u1 = u[2] / 16, v0 = 1 - u[1] / 16, v1 = 1 - u[3] / 16;
          var esq = [[u0, v0], [u1, v0], [u0, v1], [u1, v1]];
          var giro = ((fc.rotation || 0) / 90) % 4; /* rotación de la textura en la cara */
          var orden = [[0, 1, 2, 3], [2, 0, 3, 1], [3, 2, 1, 0], [1, 3, 0, 2]][giro];
          for (var q = 0; q < 4; q++) uv.setXY(i * 4 + q, esq[orden[q]][0], esq[orden[q]][1]);
          mats[i] = mat;
        });
        uv.needsUpdate = true;
        var m = new T.Mesh(g, mats); m.userData.mats = [mat];
        m.position.set(f[0] + w / 2 - 8, f[1] + h / 2 - 8, f[2] + d / 2 - 8);
        if (gm) { var gl = new T.Mesh(g, mats.map(function (x) { return x === INVISIBLE ? INVISIBLE : gm; })); gl.scale.setScalar(1.01); m.add(gl); }
        var nodo = m;
        if (e.rotation && e.rotation.angle) {
          var o = e.rotation.origin || [8, 8, 8], piv = new T.Group();
          piv.position.set(o[0] - 8, o[1] - 8, o[2] - 8);
          m.position.sub(piv.position);
          piv.rotation[e.rotation.axis || 'y'] = e.rotation.angle * Math.PI / 180;
          piv.add(m); nodo = piv;
        }
        interno.add(nodo);
      });
      if (listo) listo(raiz);
    }).catch(function () {});
    return raiz;
  }

  function marcar(obj, slot) { obj.traverse(function (o) { o.userData.slot = slot; }); return obj; }

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
    function piezas(slot, m) { marcar(m, slot); (partes[slot] = partes[slot] || []).push(m); }

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
      o.position.set(x, 9.6, -.4); o.rotation.z = x < 0 ? .12 : -.12; o.userData.oreja = true; cab.add(o);
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
    /* sets con textura real del server: capa1 = casco, pechera y botas; capa2 = pantalones */
    function t1(p) { return p.capa1 ? cargarTex(p.capa1) : null; }
    function t2(p) { return p.capa2 ? cargarTex(p.capa2) : null; }
    if (A.casco && A.casco.modelo) {
      cab.children.forEach(function (c) { if (c.userData.oreja) c.visible = false; }); /* el casco tapa las orejas */
      cab.add(modeloMC(A.casco.modelo, A.casco.texModelo, A.casco.brillo, function (g) { piezas('casco', g); }));
      A = Object.assign({}, A, { casco: null });
    }
    if (A.casco && t1(A.casco)) { var hm = cajaMC(8, 8, 8, 1, 0, 0, t1(A.casco), false, A.casco.brillo); hm.position.y = 4; cab.add(hm); piezas('casco', hm); A = Object.assign({}, A, { casco: null }); }
    if (A.pechera && t1(A.pechera)) {
      var pt = t1(A.pechera), pb = A.pechera.brillo;
      var pm = cajaMC(8, 12, 4, 1, 16, 16, pt, false, pb); pm.position.y = 18; root.add(pm); piezas('pechera', pm);
      [brazoD, brazoI].forEach(function (g, k) { var b = cajaMC(4, 12, 4, 1, 40, 16, pt, k === 1, pb); b.position.y = -4; g.add(b); piezas('pechera', b); });
      A = Object.assign({}, A, { pechera: null });
    }
    if (A.pantalones && t2(A.pantalones)) {
      var lt = t2(A.pantalones), lb = A.pantalones.brillo;
      var lm = cajaMC(8, 12, 4, .5, 16, 16, lt, false, lb); lm.position.y = 18; root.add(lm); piezas('pantalones', lm);
      [piernaD, piernaI].forEach(function (g, k) { var p = cajaMC(4, 12, 4, .5, 0, 16, lt, k === 1, lb); p.position.y = -6; g.add(p); piezas('pantalones', p); });
      A = Object.assign({}, A, { pantalones: null });
    }
    if (A.botas && t1(A.botas)) {
      var bt = t1(A.botas), bb = A.botas.brillo;
      [piernaD, piernaI].forEach(function (g, k) { var b = cajaMC(4, 12, 4, 1, 0, 16, bt, k === 1, bb); b.position.y = -6; g.add(b); piezas('botas', b); });
      A = Object.assign({}, A, { botas: null });
    }
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

    root.userData = { cuerpo: [mPelo, mCara, mOreja, mOI, mTor, mRopa, mBrazo, mPierna], cab: cab, cola: cola, brazoD: brazoD, brazoI: brazoI, piernaD: piernaD, piernaI: piernaI, capa: capa, partes: partes, conArma: !!spec.arma };
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
    var g = new T.Group(), tex = spec.tex ? cargarTex(spec.tex) : toTex(spriteCanvas(spec));
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
    var px = 0, ultimoMov = 0, ini = null, bajoCursor = null;
    cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';

    /* qué pieza hay bajo el cursor o el dedo (ignora las partes transparentes de la armadura) */
    var rayo = new T.Raycaster(), ndc = new T.Vector2();
    function piezaEn(e) {
      var r = cv.getBoundingClientRect(); if (!r.width) return null;
      ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      modelo.updateMatrixWorld(true); rayo.setFromCamera(ndc, camara);
      var hits = rayo.intersectObject(modelo, true);
      for (var i = 0; i < hits.length; i++) {
        var h = hits[i], o = h.object, mat = Array.isArray(o.material) ? o.material[h.face.materialIndex] : o.material;
        if (!mat || mat.visible === false) continue;
        if (mat.isShaderMaterial) continue; /* el brillo: se mira la pieza de abajo */
        var tex = mat.map;
        if (tex && (mat.alphaTest > 0) && h.uv && alfa(tex, h.uv) < .1) continue;
        return o.userData.slot || null;
      }
      return null;
    }

    cv.addEventListener('pointerdown', function (e) { v.arrastrando = true; px = e.clientX; ini = { x: e.clientX, y: e.clientY, t: performance.now() }; v.vel = 0; cv.style.cursor = 'grabbing'; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener('pointermove', function (e) {
      if (v.arrastrando) { var d = (e.clientX - px) / 90; px = e.clientX; v.giro += d; v.vel = d * 30; ultimoMov = performance.now(); return; }
      if (e.pointerType !== 'mouse' || !spec.alPasar) return;
      var s = piezaEn(e); cv.style.cursor = s ? 'pointer' : 'grab';
      if (s !== bajoCursor) { bajoCursor = s; spec.alPasar(s); }
    });
    cv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && bajoCursor && spec.alPasar) { bajoCursor = null; spec.alPasar(null); } });
    function soltar(e) {
      v.arrastrando = false; cv.style.cursor = 'grab'; if (performance.now() - ultimoMov > 120) v.vel = 0;
      /* un toque corto sin arrastrar = elegir pieza */
      if (e && e.type === 'pointerup' && ini && Math.abs(e.clientX - ini.x) < 7 && Math.abs(e.clientY - ini.y) < 7 && performance.now() - ini.t < 450 && spec.alTocar) {
        v.vel = 0; spec.alTocar(piezaEn(e), e.pointerType);
      }
      ini = null;
    }
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
        else if (!reducido && !v.resaltado) v.giro += dt * .55; /* se queda quieto mientras ves una pieza */
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
      /* la pieza elegida brilla en turquesa (un color que no usa ninguna armadura) y las demás se oscurecen */
      var pulso = .5 + .5 * Math.sin(t * 5), hay = !!v.resaltado;
      if (u.partes) Object.keys(u.partes).forEach(function (slot) {
        var on = v.resaltado === slot;
        u.partes[slot].forEach(function (m) {
          (m.userData.mats || []).forEach(function (mt) {
            if (mt.emissive) mt.emissive.setRGB(0, on ? .14 + .14 * pulso : 0, on ? .12 + .12 * pulso : 0);
            if (mt.color) { if (on) mt.color.setRGB(.5, 1, .9); else mt.color.setScalar(hay ? .4 : 1); }
          });
          m.scale.setScalar(on ? 1.05 : 1);
        });
      });
      if (u.cuerpo) u.cuerpo.forEach(function (mt) { mt.color.setScalar(hay ? .5 : 1); });

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
