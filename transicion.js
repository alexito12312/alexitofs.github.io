/* Transición corta entre páginas de Alexito FS.
   - Se pone en el <head> de cada página, DESPUÉS de intro.js:  <script src="transicion.js"></script>
   - Al tocar un enlace a otra página del sitio: barrido rosa con tu icono y el nombre de la sección;
     al llegar, el barrido sube y deja ver la página nueva.
   - Se salta si el visitante tiene "reducir movimiento"; funciona con el botón Atrás.
   - Para cambiar nombres, icono o velocidad, edita las variables de abajo. */
(function () {
  var NOMBRES = { 'index': 'Inicio', 'comisiones': 'Comisiones', 'contacto': 'Contacto', 'fanarts': 'Fanarts', 'beneficios': 'Beneficios' };
  var ICONO = 'icono-192.png', ENTRADA = 320; /* ms que tarda en cubrir antes de cambiar de página */

  var reducir = false;
  try { reducir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reducir) { try { sessionStorage.removeItem('alexitoTrans'); } catch (e) {} return; }

  var css =
    '#trans{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;pointer-events:none;' +
    'background:linear-gradient(160deg,#ff6fae,#c04a9a 60%,#7a3bd1);color:#1c0a15}' +
    '#trans .t{display:grid;justify-items:center;gap:12px}' +
    '#trans img{width:64px;height:64px;border-radius:26%;border:3px solid #fff;box-shadow:0 10px 30px -8px rgba(40,0,40,.6);animation:trPop .45s cubic-bezier(.2,1.4,.3,1) both}' +
    '#trans b{font:900 clamp(30px,8vw,48px)/1 "Big Shoulders Display","Arial Narrow",Impact,sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#fff;' +
    'text-shadow:0 3px 0 rgba(60,0,60,.35);animation:trUp .45s cubic-bezier(.2,.8,.2,1) .05s both}' +
    '#trans.entra{pointer-events:auto;animation:trIn ' + ENTRADA + 'ms cubic-bezier(.65,0,.25,1) forwards}' +
    '#trans.sale{animation:trOut .55s cubic-bezier(.65,0,.25,1) .12s forwards}' +
    '@keyframes trIn{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0)}}' +
    '@keyframes trOut{from{clip-path:inset(0)}to{clip-path:inset(0 0 100% 0);visibility:hidden}}' +
    '@keyframes trPop{from{opacity:0;transform:scale(.6) rotate(-10deg)}to{opacity:1;transform:none}}' +
    '@keyframes trUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}';

  var root = document.documentElement, st = null, el = null;
  function crear(nombre) {
    quitar();
    st = document.createElement('style'); st.id = 'trans-css'; st.textContent = css;
    el = document.createElement('div'); el.id = 'trans'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="t"><img src="' + ICONO + '" alt="" width="64" height="64">' + (nombre ? '<b>' + nombre + '</b>' : '') + '</div>';
    root.appendChild(st); root.appendChild(el);
  }
  function quitar() {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (st && st.parentNode) st.parentNode.removeChild(st);
    el = st = null;
  }
  function nombreDe(url) {
    var m = /([^\/]*?)(\.html)?$/.exec(url.pathname);
    var base = (m && m[1]) || 'index';
    return NOMBRES[base || 'index'] || '';
  }

  /* llegada: si venimos de un enlace del sitio, el barrido ya cubre la pantalla y sube */
  var venia = null;
  try { venia = sessionStorage.getItem('alexitoTrans'); sessionStorage.removeItem('alexitoTrans'); } catch (e) {}
  if (venia !== null) {
    crear(venia);
    el.className = 'sale';
    el.addEventListener('animationend', function (e) { if (e.animationName === 'trOut') quitar(); });
    setTimeout(quitar, 1800); /* seguro */
  }

  /* botón Atrás/Adelante: si la página vuelve del caché, quitar cualquier barrido que haya quedado */
  addEventListener('pageshow', function (e) { if (e.persisted) quitar(); });

  /* salida: al tocar un enlace interno */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target || a.hasAttribute('download')) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.protocol !== location.protocol || u.host !== location.host) return;
    if (!/(\.html|\/)$/.test(u.pathname)) return;
    if (u.pathname === location.pathname) return; /* misma página (anclas, etc.) */
    e.preventDefault();
    var nombre = nombreDe(u);
    try { sessionStorage.setItem('alexitoTrans', nombre); } catch (x) {}
    crear(nombre);
    el.className = 'entra';
    setTimeout(function () { location.href = u.href; }, ENTRADA);
  });
})();
