/* Tema Alexito FS: aparición suave de los títulos al bajar (no cambia nada si el navegador no lo soporta) */
(function(){
  var h=document.documentElement; h.classList.add('js');
  var els=[].slice.call(document.querySelectorAll('.section-title'));
  if(!('IntersectionObserver' in window)){return;}
  els.forEach(function(e){e.classList.add('reveal');});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  els.forEach(function(e){io.observe(e);});
})();
