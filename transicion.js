/* Transición corta entre páginas de Alexito FS.
   - Se pone en el <head> de cada página, DESPUÉS de intro.js:  <script src="transicion.js"></script>
   - Al tocar un enlace a otra página del sitio: barrido rosa con tu icono y el nombre de la sección;
     al llegar, el barrido sube y deja ver la página nueva.
   - Se salta si el visitante tiene "reducir movimiento"; funciona con el botón Atrás.
   - Para cambiar nombres, icono o velocidad, edita las variables de abajo. */
(function () {
  var NOMBRES = { 'index': 'Inicio', 'comisiones': 'Comisiones', 'contacto': 'Contacto', 'fanarts': 'Fanarts', 'beneficios': 'Beneficios' };
  var SIN_EFECTO = '__inicio';
  var ICONO = 'icono-192.png', ENTRADA = 260; /* ms que tarda en cubrir antes de cambiar de página */

  var reducir = false;
  try { reducir = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reducir) { try { sessionStorage.removeItem('alexitoTrans'); } catch (e) {} return; }

  var css =
    '#trans{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;pointer-events:none;opacity:1;' +
    'background:radial-gradient(circle at 50% 42%,#33154a 0,#190c2a 55%,#0f0819 100%);color:#fff}' +
    '#trans .t{display:grid;justify-items:center;gap:10px}' +
    '#trans img{width:56px;height:56px;border-radius:26%;border:2px solid #fff;box-shadow:0 0 0 5px rgba(255,111,174,.22),0 14px 40px -8px rgba(255,111,174,.6);animation:trPop .5s cubic-bezier(.2,1.2,.3,1) both}' +
    '#trans b{font:800 clamp(26px,7vw,38px)/1 "Big Shoulders Display","Arial Narrow",Impact,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#ffb3d6;animation:trUp .5s ease .05s both}' +
    '#trans.entra{pointer-events:auto;animation:trIn ' + ENTRADA + 'ms ease-out both}' +
    '#trans.sale{animation:trOut .6s ease forwards}' +
    '@keyframes trIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes trOut{from{opacity:1}to{opacity:0;visibility:hidden}}' +
    '@keyframes trPop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}' +
    '@keyframes trUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}';

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

  /* llegada: la pantalla sigue tapada hasta que la pagina esta lista (si no, en paginas pesadas el efecto se pierde) */
  var venia = null;
  try { venia = sessionStorage.getItem('alexitoTrans'); sessionStorage.removeItem('alexitoTrans'); } catch (e) {}
  if (venia !== null && venia !== SIN_EFECTO) {
    crear(venia);
    el.className = 'entra';
    el.style.animation = 'none'; /* ya esta tapada: no repetir el fundido de entrada */
    var inicio = Date.now(), destapado = false;
    var destapar = function () {
      if (destapado || !el) return; destapado = true;
      var espera = Math.max(0, 260 - (Date.now() - inicio)); /* se ve al menos un momento */
      setTimeout(function () {
        if (!el) return;
        el.style.animation = ''; el.className = 'sale';
        el.addEventListener('animationend', function (e) { if (e.animationName === 'trOut') quitar(); });
      }, espera);
    };
    if (document.readyState !== 'loading') requestAnimationFrame(destapar);
    else document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(function () { requestAnimationFrame(destapar); }); });
    setTimeout(destapar, 2500);   /* por si la pagina tarda demasiado */
    setTimeout(quitar, 5000);     /* seguro */
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
    if (nombreDe(u) === 'Inicio') { try { sessionStorage.setItem('alexitoTrans', SIN_EFECTO); } catch (x) {} return; } /* a Inicio: sin efecto */
    e.preventDefault();
    var nombre = nombreDe(u);
    try { sessionStorage.setItem('alexitoTrans', nombre); } catch (x) {}
    crear(nombre);
    el.className = 'entra';
    setTimeout(function () { location.href = u.href; }, ENTRADA);
  });
})();
