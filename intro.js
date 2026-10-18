/* Animación de entrada de Alexito FS.
   - Se pone en el <head> de cada página:  <script src="intro.js"></script>
   - En index.html sale cada vez que abren la página; en las demás solo la primera vez de la visita.
   - Se salta si el visitante tiene activado "reducir movimiento". Un toque/clic la cierra.
   - Para cambiar el texto, el icono o la duración, edita las 4 variables de abajo. */
(function () {
  var TEXTO_1 = 'ALEXITO', TEXTO_2 = 'FS', SUBTITULO = 'VTuber de variedad', ICONO = 'icono-192.png';
  var DURACION = 2.3; /* segundos que dura en total */

  try { if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) {}
  /* si vienes de otra página del sitio (menú, enlaces, botón Atrás) no se muestra: solo al abrir desde afuera */
  try { if (document.referrer && new URL(document.referrer).origin === location.origin) return; } catch (e) {}
  try { if (sessionStorage.getItem('alexitoTrans') !== null) return; } catch (e) {} /* si llegas desde otra pagina, solo va la transicion */
  var esIndex = /(^|\/)(index\.html)?$/.test(location.pathname);
  try {
    if (!esIndex) {
      if (sessionStorage.getItem('alexitoIntro')) return;
    }
    sessionStorage.setItem('alexitoIntro', '1');
  } catch (e) {}

  var css =
    '#intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;overflow:hidden;' +
    'background:radial-gradient(circle at 50% 42%,#3a1646 0,#1a0d2e 46%,#0d0818 100%);color:#fff;' +
    'animation:introOut .75s cubic-bezier(.77,0,.18,1) ' + (DURACION - .75) + 's forwards}' +
    '#intro.fin{display:none}' +
    '#intro .box{display:grid;justify-items:center;gap:18px;padding:24px}' +
    '#intro .foto{position:relative;width:min(34vw,150px);aspect-ratio:1;border-radius:28%;' +
    'animation:introPop .8s cubic-bezier(.2,1.4,.3,1) .1s both}' +
    '#intro .foto img{display:block;width:100%;height:100%;border-radius:28%;border:3px solid #fff;object-fit:cover;' +
    'box-shadow:0 0 0 6px rgba(255,111,174,.25),0 20px 60px -10px rgba(255,111,174,.65)}' +
    '#intro .foto::after{content:"";position:absolute;inset:-16px;border-radius:50%;border:2px dashed rgba(255,255,255,.45);' +
    'animation:introSpin 6s linear infinite}' +
    '#intro .nom{display:flex;gap:.28em;font:900 clamp(44px,13vw,84px)/.9 "Big Shoulders Display","Arial Narrow",Impact,sans-serif;' +
    'text-transform:uppercase;letter-spacing:.01em;margin:0}' +
    '#intro .nom span{display:block;animation:introUp .7s cubic-bezier(.2,.8,.2,1) both}' +
    '#intro .nom span:first-child{color:rgba(255,255,255,.16);-webkit-text-stroke:2px rgba(255,255,255,.85);animation-delay:.35s}' +
    '#intro .nom span:last-child{color:#ff6fae;animation-delay:.5s}' +
    '#intro .sub{font:500 12px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.28em;text-transform:uppercase;color:#ffa6cd;' +
    'animation:introUp .7s cubic-bezier(.2,.8,.2,1) .7s both}' +
    '#intro .barra{width:min(56vw,240px);height:4px;border-radius:99px;background:rgba(255,255,255,.18);overflow:hidden}' +
    '#intro .barra i{display:block;height:100%;width:100%;border-radius:99px;background:linear-gradient(90deg,#ff6fae,#ffa6cd);' +
    'transform-origin:0 50%;animation:introBar ' + (DURACION - .9) + 's cubic-bezier(.5,0,.2,1) .3s both}' +
    '@keyframes introPop{from{opacity:0;transform:scale(.5) rotate(-12deg)}to{opacity:1;transform:none}}' +
    '@keyframes introUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}' +
    '@keyframes introSpin{to{transform:rotate(360deg)}}' +
    '@keyframes introBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}' +
    '@keyframes introOut{to{clip-path:inset(0 0 100% 0);visibility:hidden}}';

  var st = document.createElement('style'); st.id = 'intro-css'; st.textContent = css;
  var el = document.createElement('div'); el.id = 'intro'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="box"><div class="foto"><img src="' + ICONO + '" alt="" width="150" height="150" decoding="async"></div>' +
    '<p class="nom"><span>' + TEXTO_1 + '</span><span>' + TEXTO_2 + '</span></p>' +
    '<div class="sub">' + SUBTITULO + '</div><div class="barra"><i></i></div></div>';
  var root = document.documentElement;
  root.appendChild(st); root.appendChild(el);

  function quitar() { if (el.parentNode) el.parentNode.removeChild(el); if (st.parentNode) st.parentNode.removeChild(st); }
  el.addEventListener('animationend', function (e) { if (e.animationName === 'introOut') quitar(); });
  el.addEventListener('click', function () { el.style.animation = 'introOut .35s ease forwards'; });
  setTimeout(quitar, DURACION * 1000 + 1500); /* seguro por si algo falla */
})();
