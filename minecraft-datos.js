/* =====================================================================
   FURRYLAND · DATOS DE LA TIENDA (minecraft.html)
   Sacado de la bóveda de Obsidian (Servidor Valdrena) y de E:\ServidorMC.
   Todo lo que se ve en la página sale de aquí: edita textos y precios sin tocar el diseño.

   MATERIALES vanilla del visor 3D: cuero, cadena, hierro, oro, diamante, netherite (o un color "#rrggbb")
   SETS con textura real del server: pon  set:'kitsune'  y usa las capas de minecraft-media/tex/capas
   ARMAS: tex:'nombre'  usa la textura real minecraft-media/tex/items/nombre.png
          o  tipo:'espada'|'hacha'|'arco'|'tridente' + mat  para las vanilla
   PRECIO: número en la moneda de abajo, o null si es gratis / se consigue jugando.
   ===================================================================== */
(function () {
  var TEX = 'minecraft-media/tex/items/';
  var R = 'Raro', E = 'Épico', L = 'Legendario';

  /* ---------- sets de armadura del server (armeria_def.py) ---------- */
  function set(id, nombre, rareza, base, obtener, bonus, ench, extra) {
    ench = ench || {};
    var piezas = {};
    [['casco', 'Casco'], ['pechera', 'Pechera'], ['pantalones', 'Pantalones'], ['botas', 'Botas']].forEach(function (p) {
      piezas[p[0]] = { set: id, nombre: p[1] + ' ' + nombre, icono: TEX + id + '_' + p[0] + '.png', encantamientos: ench[p[0]] || [] };
    });
    var o = { id: id, nombre: 'Armadura ' + nombre, rareza: rareza, base: base, obtener: obtener, bonus: bonus, piezas: piezas, precio: null };
    for (var k in extra) o[k] = extra[k];
    return o;
  }

  window.FURRYLAND = {

    servidor: {
      nombre: 'FURRYLAND',
      autor: 'AlexitoFS',
      logo: '', /* ruta de una imagen de logo, ej. 'minecraft-media/logo-furryland.png'. Vacío = logo en letras */
      ip: '',                                       /* pon aquí la IP pública cuando la tengas (vacío = no se muestra) */
      version: 'Java y Bedrock · Paper 26.3',
      lobby: 'Puerto de Valdrena'
    },

    tienda: {
      moneda: 'MXN',
      simbolo: '$',
      comprarTexto: 'Comprar',
      /* CÓMO SE COMPRA: el botón "Comprar" abre una ventana con 3 pasos (PayPal → ticket en Discord → entrega).
         paypal:  tu usuario de PayPal.me (lo que va después de paypal.me/), ej. 'AlexitoFS'. El link ya lleva el precio.
         discord: link de invitación al Discord (mejor uno que no caduque), ej. 'https://discord.gg/xxxxxx'
         Si alguno está vacío, su botón sale como "pronto". */
      paypal: 'AlexanderM83',
      discord: 'https://discord.gg/HUHpyqYdVD',
      notaCompra: 'Los pagos son por PayPal y se entregan a mano. Si algo falla, avísanos en tu ticket con el comprobante.'
    },

    /* ---------------- CARRUSEL ----------------
       tipo: 'oferta' | 'noticia' | 'actualizacion' | 'evento'
       img: imagen de fondo (se muestra completa a la derecha). Vacío = fondo de color. */
    carrusel: [
      { tipo: 'noticia', titulo: 'Ahora somos FurryLand', texto: 'El server estrenó nombre. El pueblo del lobby sigue siendo el Puerto de Valdrena, con su faro, su casino y sus misiones.', img: 'minecraft-media/vista_novedades.png', boton: { texto: 'Ver rangos', ir: 'rangos' } },
      { tipo: 'actualizacion', titulo: 'Warden Ancestral', texto: 'Un jefe de 4.5 bloques con venas de sculk que brillan. Suelta el Arco de la Tormenta y el Amuleto del Silencio.', img: 'minecraft-media/vista_warden.png', boton: { texto: 'Ver armas', ir: 'armas' } },
      { tipo: 'evento', titulo: 'Bosses con cuerpo 3D', texto: 'Caminan, atacan y se desmoronan al morir. Derrótalos para ganar la Llave de Jefe y sus armas exclusivas.', img: 'minecraft-media/vista_bosses_3d.png', boton: { texto: 'Ver armaduras', ir: 'armaduras' } },
      { tipo: 'oferta', titulo: 'Nuevo: equipo de paga', texto: 'Armadura del Bastión (5 niveles), Mandoble del Berserker (10 niveles) y 18 objetos de utilidad con textura propia. En PvP quedan al nivel normal.', img: 'minecraft-media/vista_paga_utilidad.png', boton: { texto: 'Ver items', ir: 'items' } },
      { tipo: 'oferta', titulo: 'Espíritus de paga', texto: 'Mascotas que brillan en la oscuridad y sueltan partículas. Desde $50 MXN.', img: 'minecraft-media/mascotas.png', boton: { texto: 'Ver items', ir: 'items' } },
      { tipo: 'noticia', titulo: 'Top Donador', texto: 'Dona más de 15 USD y llévate prefijo dorado, colores en el chat y el Kit Top Donador cada 3 días.', img: '', boton: { texto: 'Ver Donadores', ir: 'donadores' } }
    ],

    /* ---------------- RANGOS VIP (dinero real, permanentes) · kits de plugins/Essentials/kits.yml ---------------- */
    rangos: [
      {
        nombre: 'Novato', color: '#c9c3dd', precio: null, gratis: 'Rango inicial',
        descripcion: 'El rango con el que empieza todo el mundo.',
        ventajas: ['2 protecciones', '2 casas', 'Kit diario', '3 subastas a la vez'],
        kit: { arma: { tipo: 'espada', mat: 'hierro', nombre: 'Espada del Novato', encantamientos: [] } },
        tambien: ['Pico del Novato y hacha de hierro', '16 panes y 16 antorchas', '$150 del juego'],
        piel: { pelo: '#f7a8cb', ropa: '#3a3358' }
      },
      {
        nombre: 'Aventurero', color: '#7cf0b8', precio: 50,
        descripcion: 'Tu primera armadura completa y comandos útiles.',
        ventajas: ['5 protecciones', '5 casas', 'Kit diario y semanal', '/hat y /craft', '6 subastas'],
        kit: {
          casco: { mat: 'hierro', encantamientos: ['Irrompibilidad I'] },
          pechera: { mat: 'hierro', encantamientos: ['Irrompibilidad I'] },
          pantalones: { mat: 'hierro', encantamientos: ['Irrompibilidad I'] },
          botas: { mat: 'hierro', encantamientos: ['Irrompibilidad I'] },
          arma: { tipo: 'espada', mat: 'hierro', nombre: 'Espada del Aventurero', encantamientos: ['Filo II', 'Irrompibilidad I'] }
        },
        tambien: ['Pico de hierro (Eficiencia II)', '32 filetes y 8 zanahorias doradas', 'Llave común', 'Poción del minero y estofado del puerto', '$400 del juego'],
        piel: { pelo: '#f7a8cb', ropa: '#2f6b55' }
      },
      {
        nombre: 'Veterano', color: '#5fd3ff', precio: 100,
        descripcion: 'Hierro encantado y espada de diamante.',
        ventajas: ['10 protecciones', '10 casas', 'Kit diario y semanal', '/ec (cofre de ender)', '10 subastas', 'Todo lo de Aventurero'],
        kit: {
          casco: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad II'] },
          pechera: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad II'] },
          pantalones: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad II'] },
          botas: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad II', 'Caída de pluma II'] },
          arma: { tipo: 'espada', mat: 'diamante', nombre: 'Espada del Veterano', encantamientos: ['Filo III', 'Irrompibilidad II'] }
        },
        tambien: ['Pico de diamante (Eficiencia III, Fortuna I)', '3 manzanas de oro', '16 botellas de experiencia', 'Llave poco común', 'Poción de pluma y Elixir del explorador', '$900 del juego'],
        piel: { pelo: '#f7a8cb', ropa: '#24476b' }
      },
      {
        nombre: 'Héroe', color: '#ffb35c', precio: 200, destacado: true,
        descripcion: 'Diamante completo y herramientas de herrería.',
        ventajas: ['15 protecciones', '15 casas', 'Kit cada 2 días y semanal', '/anvil, /grindstone y /smithingtable', '15 subastas', 'Todo lo de Veterano'],
        kit: {
          casco: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad III'] },
          pechera: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad III'] },
          pantalones: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad III'] },
          botas: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad III', 'Caída de pluma III'] },
          arma: { tipo: 'espada', mat: 'diamante', nombre: 'Espada del Héroe', encantamientos: ['Filo IV', 'Botín II', 'Irrompibilidad III'] }
        },
        tambien: ['Pico de diamante (Eficiencia IV, Fortuna II)', '6 manzanas de oro y 8 perlas de ender', '32 botellas de experiencia', 'Llave rara', 'Poción del titán, Varita de curación y Manzana de mithril', '$2,000 del juego'],
        piel: { pelo: '#f7a8cb', ropa: '#5a2a1f' }
      },
      {
        nombre: 'Leyenda', color: '#ff6fae', precio: 350,
        descripcion: 'El rango más alto: Protección IV y la Espada Legendaria.',
        ventajas: ['20 protecciones', '20 casas', 'Kit cada 3 días y semanal', 'Colores en el chat y /nick', '25 subastas', 'Todo lo de Héroe'],
        kit: {
          casco: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
          pechera: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
          pantalones: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
          botas: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Caída de pluma IV'] },
          arma: { tipo: 'espada', mat: 'netherite', nombre: 'Espada Legendaria', encantamientos: ['Filo V', 'Botín III', 'Aspecto ígneo II', 'Irrompibilidad III'] }
        },
        tambien: ['Arco (Poder IV, Infinidad) y pico (Eficiencia V, Fortuna III)', '2 manzanas de Notch y 1 tótem', '64 botellas de experiencia', 'Llave épica', 'Poción del dragón, Varita destello y Manzana de mithril', '$4,500 del juego'],
        piel: { pelo: '#f7a8cb', ropa: '#1f1838' }
      }
    ],

    /* ---------------- ITEMS ----------------
       dePaga: true  = se compra con dinero real (precio en MXN)
       dePaga: false = se consigue jugando (obtener dice cómo)
       img: textura real · sprite: recorte de una imagen · icono: dibujo genérico (gema, estrella, cofre...) */
    items: [
      /* espíritus (mascotas de paga) */
      /* sprite: [columna, fila] en minecraft-media/mascotas.png (renders reales del server) */
      { nombre: 'Conejo Lunar', dePaga: true, precio: 50, sprite: [0, 2], descripcion: 'Suerte II, Salto II, sin daño por caída y +50% de experiencia.' },
      { nombre: 'Rana Esmeralda', dePaga: true, precio: 50, sprite: [1, 2], descripcion: 'Salto II, respiración, Gracia del delfín, sin caída e imán de objetos.' },
      { nombre: 'Mariposa Aurora', dePaga: true, precio: 60, sprite: [2, 2], descripcion: 'Caída lenta, Velocidad I, Regeneración I y sin daño por caída.' },
      { nombre: 'Zorro Espectral', dePaga: true, precio: 60, sprite: [3, 2], descripcion: 'Velocidad II, visión nocturna, imán de objetos y +50% de experiencia.' },
      { nombre: 'Abeja Dorada', dePaga: true, precio: 70, sprite: [4, 2], descripcion: 'Prisa II, te cura 1 corazón cada 15 s y no te da hambre.' },
      { nombre: 'Araña Abisal', dePaga: true, precio: 70, sprite: [0, 3], descripcion: 'Visión nocturna, Fuerza I e inmunidad al veneno y al wither.' },
      { nombre: 'Foquita Glaciar', dePaga: true, precio: 70, sprite: [1, 3], descripcion: 'Respiración acuática IV y Gracia del delfín III: pica, ve y camina bajo el agua sin frenarte.' },
      { nombre: 'Gato Real', dePaga: true, precio: 80, sprite: [2, 3], descripcion: 'Absorción III, Resistencia I, Regeneración I y Suerte I, sin lentitud. Lleva corona.' },
      /* protecciones de paga */
      { nombre: 'Protección Esmeralda', dePaga: true, precio: 80, icono: 'gema', color: 'esmeralda', descripcion: 'Bloque que protege un terreno de 256x256 de arriba a abajo.' },
      { nombre: 'Protección Real', dePaga: true, precio: 150, icono: 'gema', color: 'oro', descripcion: 'Bloque que protege un terreno de 512x512 de arriba a abajo.' },

      /* objetos de utilidad de paga (_scripts/utilidad.py · Pagos.java): ligados al dueño, no se pierden al morir */
      { nombre: 'Casco de Minero', dePaga: true, precio: 60, img: TEX + 'casco_minero.png', descripcion: 'Casco 3D. Bajo tierra te da Visión nocturna y Prisa I, y respiras bajo el agua siempre.' },
      { nombre: 'Escafandra', dePaga: true, precio: 60, img: TEX + 'escafandra.png', descripcion: 'Casco de buzo 3D. Respiración infinita, y bajo el agua ves claro y minas igual de rápido.' },
      { nombre: 'Sombrero de Pescador', dePaga: true, precio: 60, img: TEX + 'sombrero_pescador.png', descripcion: 'Gorro 3D. Los peces pican el doble de rápido y tienes +2 de Suerte para mejor botín de pesca.' },
      { nombre: 'Sombrero de Paja', dePaga: true, precio: 60, img: TEX + 'sombrero_paja.png', descripcion: 'Gorro 3D. Los cultivos a 4 bloques de ti crecen mucho más rápido.' },
      { nombre: 'Goggles de Explorador', dePaga: true, precio: 60, img: TEX + 'goggles_explorador.png', descripcion: 'Gorra 3D con gafas. Ves tus coordenadas en pantalla y los cofres a 8 bloques brillan.' },
      { nombre: 'Paracaídas', dePaga: true, precio: 60, img: TEX + 'paracaidas.png', descripcion: 'En el pecho. Si caes más de 10 bloques se abre solo y bajas lento, sin daño. Se apaga 15 s al pelear contra jugadores.' },
      { nombre: 'Delantal de Herrero', dePaga: true, precio: 60, img: TEX + 'delantal_herrero.png', descripcion: 'En el pecho. El yunque te cuesta 30% menos de niveles.' },
      { nombre: 'Chaleco Salvavidas', dePaga: true, precio: 60, img: TEX + 'chaleco_salvavidas.png', descripcion: 'En el pecho. En el agua flotas y nadas rápido con Gracia del delfín; agáchate para hundirte. Se apaga 15 s al pelear contra jugadores.' },
      { nombre: 'Botas de Rana', dePaga: true, precio: 60, img: TEX + 'botas_rana.png', descripcion: 'Salto III, sin daño en caídas cortas y Agilidad acuática III. Se apaga 15 s al pelear contra jugadores.' },
      { nombre: 'Botas de Magma', dePaga: true, precio: 60, img: TEX + 'botas_magma.png', descripcion: 'Caminas sobre la lava: se enfría bajo tus pies unos segundos (agáchate para no hacerlo). Inmune a los bloques de magma.' },
      { nombre: 'Raquetas de Nieve', dePaga: true, precio: 60, img: TEX + 'raquetas_nieve.png', descripcion: 'Caminas sobre nieve en polvo sin hundirte y vas con Velocidad II sobre hielo.' },
      { nombre: 'Botas de Pluma', dePaga: true, precio: 60, img: TEX + 'botas_pluma.png', descripcion: 'Mantén el salto en el aire para planear. Caída de pluma IV. Se apaga 15 s al pelear contra jugadores.' },
      { nombre: 'Mano de Goma', dePaga: true, precio: 60, img: TEX + 'mano_goma.png', descripcion: 'En la mano izquierda: +6 bloques de alcance para poner y romper bloques (no para pegar).' },
      { nombre: 'Guante de Minero', dePaga: true, precio: 60, img: TEX + 'guante_minero.png', descripcion: 'En la mano izquierda: rompes bloques 25% más rápido.' },
      { nombre: 'Imán', dePaga: true, precio: 60, img: TEX + 'iman.png', descripcion: 'Con traerlo en el inventario atrae objetos y experiencia a 6 bloques. Agáchate para apagarlo.' },
      { nombre: 'Gancho', dePaga: true, precio: 60, img: TEX + 'gancho.png', descripcion: 'Lánzalo a un bloque y recógelo: te jala hacia él (espera de 3 s). También sirve para pescar. Se apaga 15 s al pelear contra jugadores.' },
      { nombre: 'Varita del Constructor', dePaga: true, precio: 60, img: TEX + 'varita_constructor.png', descripcion: 'Clic derecho en un bloque: pone una fila de hasta 8 bloques iguales, tomándolos de tu inventario. Respeta las protecciones.' },
      { nombre: 'Cubeta sin Fondo', dePaga: true, precio: 60, img: TEX + 'cubeta_sin_fondo.png', descripcion: 'Agua infinita: nunca se vacía.' },

      /* mascotas con dinero del juego */
      { nombre: 'Conejo de Pradera', dePaga: false, sprite: [0, 0], obtener: '/mascotas por $8,000 del juego.', descripcion: 'Suerte I.' },
      { nombre: 'Rana del Pantano', dePaga: false, sprite: [1, 0], obtener: '/mascotas por $10,000 del juego.', descripcion: 'Salto II.' },
      { nombre: 'Mariposa Monarca', dePaga: false, sprite: [2, 0], obtener: '/mascotas por $12,000 del juego.', descripcion: 'Caída lenta (si te agachas caes normal).' },
      { nombre: 'Zorro Rosado', dePaga: false, sprite: [3, 0], obtener: '/mascotas por $15,000 del juego.', descripcion: 'Velocidad I.' },
      { nombre: 'Araña de Cueva', dePaga: false, sprite: [4, 0], obtener: '/mascotas por $18,000 del juego.', descripcion: 'Visión nocturna.' },
      { nombre: 'Abeja Obrera', dePaga: false, sprite: [0, 1], obtener: '/mascotas por $20,000 del juego.', descripcion: 'Prisa I.' },
      { nombre: 'Gato Gordo', dePaga: false, sprite: [3, 1], obtener: '/mascotas por $22,000 del juego.', descripcion: 'Lentitud II, pero Absorción II y Resistencia I.' },
      { nombre: 'Guacamaya Escarlata', dePaga: false, sprite: [4, 1], obtener: '/mascotas por $28,000 del juego.', descripcion: 'Tus golpes cuerpo a cuerpo dan Levitación (no afecta a bosses).' },
      { nombre: 'Zorro de Fuego', dePaga: false, sprite: [2, 1], obtener: '/mascotas por $30,000 del juego.', descripcion: 'Resistencia al fuego y tus golpes prenden fuego.' },
      { nombre: 'Zorro Espadachín', dePaga: false, sprite: [1, 1], obtener: '/mascotas por $35,000 del juego.', descripcion: 'Fuerza II, Absorción I y Regeneración I, pero salen más monstruos cerca.' },
      /* tótems */
      { nombre: 'Tótem del Fénix', dePaga: false, img: TEX + 'totem_fenix.png', obtener: '/tiendaespecial por $60,000 del juego, o en botín.', descripcion: 'Te revive con Resistencia al fuego, Regeneración III, Fuerza I y Absorción III.' },
      { nombre: 'Tótem del Viento', dePaga: false, img: TEX + 'totem_viento.png', obtener: '/tiendaespecial por $35,000 del juego.', descripcion: 'Te revive y te teletransporta lejos con Caída lenta y Velocidad II.' },
      { nombre: 'Tótem Guardián', dePaga: false, img: TEX + 'totem_guardian.png', obtener: '/tiendaespecial por $45,000 del juego.', descripcion: 'Te revive con Resistencia IV, Absorción IV y Regeneración II.' },
      { nombre: 'Tótem Kitsune', dePaga: false, img: TEX + 'totem_kitsune.png', obtener: 'Solo lo suelta la Kitsune de las Nueve Colas (20%).', descripcion: 'Te revive invisible, te esconde lejos y te da Velocidad III.' },
      { nombre: 'Tótem del Meteoro', dePaga: false, img: TEX + 'totem_meteoro.png', obtener: 'Crafteo: 1 tótem normal + 4 fragmentos de meteorito.', descripcion: 'Explota y lanza lejos a los monstruos al revivirte.' },
      { nombre: 'Tótem del Minero', dePaga: false, img: TEX + 'totem_minero.png', obtener: '/tiendaespecial por $15,000 del juego.', descripcion: 'Pasivo en la mano izquierda: Prisa II y visión nocturna.' },
      { nombre: 'Tótem del Guerrero', dePaga: false, img: TEX + 'totem_guerrero.png', obtener: '/tiendaespecial por $25,000 del juego.', descripcion: 'Pasivo en la mano izquierda: Fuerza I.' },
      { nombre: 'Tótem del Mar', dePaga: false, img: TEX + 'totem_mar.png', obtener: '/tiendaespecial por $12,000 del juego.', descripcion: 'Pasivo: respiración acuática y Gracia del delfín.' },
      { nombre: 'Tótem de la Fortuna', dePaga: false, img: TEX + 'totem_suerte.png', obtener: '/tiendaespecial por $15,000 del juego.', descripcion: 'Pasivo en la mano izquierda: Suerte II.' },
      { nombre: 'Tótem de la Vida', dePaga: false, img: TEX + 'totem_vida.png', obtener: '/tiendaespecial por $30,000 del juego.', descripcion: 'Pasivo: +2 corazones y Regeneración I.' },
      /* otros */
      { nombre: 'Saco de Diamante', dePaga: false, img: TEX + 'saco_diamante.png', obtener: 'Mesa: Saco de Oro al centro + 8 diamantes.', descripcion: 'Mochila de 5 filas (45 casillas). Hay 5 niveles, desde el Saco de 9 casillas.' },
      { nombre: 'Amuleto del Silencio', dePaga: false, img: TEX + 'amuleto_silencio_3.png', obtener: 'Lo suelta el Warden Ancestral (3 niveles).', descripcion: 'Hace que los mobs te ignoren durante un tiempo.' },
      { nombre: 'Corona del Rey Caído', dePaga: false, img: TEX + 'corona_rey.png', obtener: 'Botín legendario.', descripcion: 'Gorro 3D que da +2 corazones.' },
      { nombre: 'Manzana del Titán', dePaga: false, img: TEX + 'comida_manzana_titan.png', obtener: 'Kits semanales de Héroe y Leyenda, y el Kit Top Donador.', descripcion: 'Una de las manzanas especiales del server.' }
    ],

    /* ---------------- ARMAS del server (no se compran: bosses, estructuras, casino y Llave de Jefe) ---------------- */
    armas: [
      { nombre: 'Filo Solar', tex: 'filo_solar', rareza: R, dano: 7, vel: 1.6, efecto: '+4 de daño contra muertos vivientes.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Daga Sombría', tex: 'daga_sombria', rareza: R, dano: 5, vel: 2.2, efecto: 'Muy rápida; +40% de daño por la espalda.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Aguijón de la Víbora', tex: 'aguijon_vibora', rareza: R, dano: 6.5, vel: 1.6, efecto: '25% de envenenar 3 s.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Colmillo de Escarcha', tex: 'colmillo_escarcha', rareza: E, dano: 7.5, vel: 1.6, efecto: '20% de congelar: Lentitud II 2 s.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Espada de Brasas', tex: 'espada_brasas', rareza: E, dano: 7.5, vel: 1.6, efecto: '30% de prender fuego 3 s; +2 si ya arde.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Hacha del Berserker', tex: 'hacha_berserker', rareza: E, dano: 9, vel: 0.9, efecto: '+0.5 de daño por cada corazón que te falte (máx. +3).', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Guadaña de Almas', tex: 'guadana_almas', rareza: E, dano: 8, vel: 1.2, efecto: 'Roba el 15% del daño como vida.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Martillo del Trueno', tex: 'martillo_trueno', rareza: L, dano: 10, vel: 0.85, efecto: '12% de rayo: 5 de daño en área.', obtener: 'Botín de bosses y estructuras.' },
      { nombre: 'Hoja del Vacío', tex: 'hoja_vacio', rareza: L, dano: 8.5, vel: 1.6, efecto: '15% de cegar y debilitar 3 s.', obtener: 'Solo en el casino.' },
      { nombre: 'Katana de la Tormenta', tex: 'katana_tormenta', rareza: L, dano: 8, vel: 1.8, efecto: '10% de rayo: 4 de daño en área.', obtener: 'Solo en el casino.' },
      { nombre: 'Daga del Eclipse', tex: 'daga_eclipse', rareza: E, dano: 6, vel: 2.3, efecto: 'Roba 10% de vida y +30% por la espalda.', obtener: 'Solo en el casino.' },
      { nombre: 'Hacha Glacial', tex: 'hacha_glacial', rareza: E, dano: 9, vel: 0.95, efecto: '25% de congelar: Lentitud III 2 s.', obtener: 'Solo en el casino.' },
      { nombre: 'Guadaña del Eclipse', tex: 'guadana_eclipse', rareza: L, dano: 8.5, vel: 1.2, efecto: 'Marchita 2 s y roba 12% de vida.', obtener: 'Solo en el casino.' },
      { nombre: 'Martillo Sísmico', tex: 'martillo_sismico', rareza: L, dano: 10, vel: 0.85, efecto: '15% de sacudir el suelo: lanza a los monstruos.', obtener: 'Solo en el casino.' },
      { nombre: 'Lanza del Centinela', tex: 'lanza_centinela', rareza: R, dano: 7, vel: 1.3, efecto: '+1.5 de alcance; 20% de Lentitud II.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Mandoble de Hierro Negro', tex: 'mandoble_hierro', rareza: R, dano: 9.5, vel: 0.95, efecto: 'Barrido del 40% a los de alrededor.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Lanza de Sculk', tex: 'lanza_sculk', rareza: E, dano: 8.5, vel: 1.3, efecto: '+2 de alcance; 25% de rayo sónico (+4 que ignora armadura).', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Mandoble Carmesí', tex: 'mandoble_carmesi', rareza: E, dano: 10.5, vel: 0.95, efecto: 'Barrido del 50% y roba 8% de vida.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Katana Kitsune', tex: 'katana_kitsune', rareza: E, dano: 8.5, vel: 1.9, efecto: '20% de fuego de zorro; al matar, Velocidad II.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Lanza del Leviatán', tex: 'lanza_leviatan', rareza: L, dano: 10, vel: 1.3, efecto: '+2.5 de alcance; 15% de tromba que atrae a los monstruos.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Mandoble del Titán', tex: 'mandoble_titan', rareza: L, dano: 12.5, vel: 0.9, efecto: 'Barrido del 60%; 12% de terremoto.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      { nombre: 'Guadaña del Warden', tex: 'guadana_warden', rareza: L, dano: 9.5, vel: 1.2, efecto: '15% de rayo sónico (+8 que ignora armadura); roba 10% de vida.', obtener: 'Solo en la Caja de Jefe (Llave de Jefe).' },
      /* de paga con niveles (Pagos.java). precio = por nivel */
      { nombre: 'Mandoble del Berserker', tex: 'mandoble_berserker', rareza: L, dano: 10, vel: 0.9, precio: 100, efecto: '10 niveles: el Filo sube de V a X y se suman Botín, Aspecto ígneo, Barrido, Reparación y Castigo. Golpe pesado en área, robo de vida, más daño con poca vida, Tajo sísmico y en el nivel 10 la Furia del Berserker. En PvP: Filo V y sin efectos.', obtener: 'De paga: $100 MXN por nivel (10 niveles). Queda ligado a ti y no se pierde al morir.' },
      /* arcos elementales */
      { nombre: 'Arco Ígneo', tex: 'arco_fuego', rareza: E, efecto: 'Con tensión completa dispara una bola de fuego.', obtener: '/tiendaespecial por $22,000 del juego, botín o Guardián Ígneo (8%).' },
      { nombre: 'Arco Glacial', tex: 'arco_hielo', rareza: E, efecto: 'Lentitud III 4 s y congelado.', obtener: '/tiendaespecial por $18,000 del juego o Iceologer (4%).' },
      { nombre: 'Arco Tejedor', tex: 'arco_telarana', rareza: R, efecto: 'Deja una telaraña donde pega (5 s).', obtener: '/tiendaespecial por $9,000 del juego.' },
      { nombre: 'Arco de la Víbora', tex: 'arco_veneno', rareza: R, efecto: 'Veneno II 5 s.', obtener: '/tiendaespecial por $10,000 del juego.' },
      { nombre: 'Arco de la Tormenta', tex: 'arco_rayo', rareza: L, efecto: 'Con tensión completa cae un rayo: 6 de daño en área.', obtener: '/tiendaespecial por $55,000 del juego o el Warden (8%).' },
      /* herramientas de la Llave de Jefe (encantamientos por encima del máximo) */
      { nombre: 'Pico de Mithril', tex: 'pico_mithril', rareza: R, encantamientos: ['Eficiencia VI', 'Fortuna III', 'Irrompibilidad IV'], obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Hacha del Leñador', tex: 'hacha_lenador', rareza: R, encantamientos: ['Eficiencia VI', 'Irrompibilidad IV'], efecto: 'Tala el árbol entero.', obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Pico del Excavador', tex: 'pico_excavador', rareza: E, encantamientos: ['Eficiencia VII', 'Fortuna III', 'Irrompibilidad V'], efecto: 'Pica en 3x3.', obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Pala Excavadora', tex: 'pala_excavadora', rareza: E, encantamientos: ['Eficiencia VII', 'Irrompibilidad V'], efecto: 'Cava en 3x3.', obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Azada de Inari', tex: 'azada_inari', rareza: E, encantamientos: ['Fortuna IV', 'Irrompibilidad V'], efecto: 'Cosecha en 5x5 y replanta.', obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Pico del Rey Enano', tex: 'pico_rey_enano', rareza: L, encantamientos: ['Eficiencia VIII', 'Fortuna V', 'Irrompibilidad VII', 'Reparación'], efecto: 'Pica en 3x3 y funde los minerales.', obtener: 'Solo en la Caja de Jefe.' },
      { nombre: 'Hacha del Gigante', tex: 'hacha_gigante', rareza: L, encantamientos: ['Eficiencia VIII', 'Filo VI', 'Irrompibilidad VII', 'Reparación'], efecto: 'Tala el árbol entero; 11 de daño.', obtener: 'Solo en la Caja de Jefe.' }
    ],

    /* ---------------- ARMADURAS del server (texturas reales) ---------------- */
    armaduras: [
      set('bastion', 'del Bastión', L, 'diamante', 'De paga: $160 MXN por nivel (5 niveles). Queda ligada a ti y no se pierde al morir. En PvP: Protección IV y sin efectos.', ['Nivel 1: +4 corazones, resistencia al fuego y no te empujan', 'Nivel 2: +6 corazones, Salto I y caída lenta', 'Nivel 3: +8 corazones y visión nocturna', 'Nivel 4: +10 corazones y regeneración con poca vida', 'Nivel 5: +12 corazones, Resistencia I y onda de choque al caer', 'De 6% a 30% menos daño de monstruos'], { casco: ['Protección V → X', 'Espinas II → V', 'Reparación', 'Respiración III'], pechera: ['Protección V → X', 'Espinas II → V', 'Reparación', 'Prot. contra explosiones IV'], pantalones: ['Protección V → X', 'Espinas II → V', 'Reparación', 'Sigilo rápido III'], botas: ['Protección V → X', 'Espinas II → V', 'Reparación', 'Caída de pluma IV'] }, { color: '#46c8d8', precio: 160 }),
      set('kitsune', 'Kitsune', L, 'netherita', 'Solo la suelta la Kitsune de las Nueve Colas (12% por pieza).', ['Velocidad I y Salto I', '15% de esquivar golpes (8% en PvP)', 'Tus golpes queman con fuego de zorro'], { botas: ['Caída de pluma IV'] }, { color: '#e64a63' }),
      set('vikingo', 'Vikingo', E, 'hierro', 'En /tiendaespecial por $12,000 del juego cada pieza, o en botín.', ['+3 corazones y resistencia al empuje', 'Furia: Fuerza I con menos de 4 corazones'], {}, { color: '#c08b5a' }),
      set('caballero', 'del Caballero', E, 'hierro', 'En /tiendaespecial por $12,000 del juego cada pieza, o en botín.', ['+2 corazones y Resistencia I', 'Bloquear con escudo te cura medio corazón'], {}, { color: '#e1b43c' }),
      set('dragon', 'del Dragón', L, 'netherita', 'Botín legendario.', ['+2 corazones y resistencia al fuego', 'Resistencia al empuje'], {}, { color: '#b85cd6' }),
      set('celestial', 'Celestial', L, 'netherita', 'Solo en el casino.', ['+2 corazones y Velocidad I', 'Visión nocturna y caída lenta al agacharte'], { botas: ['Caída de pluma IV'] }, { color: '#f0c850' }),
      set('estelar', 'Estelar', L, 'netherita', 'Solo en el casino.', ['Salto II y Velocidad I', 'Sin daño por caída'], {}, { color: '#78dcff' }),
      set('titan', 'del Titán', L, 'netherita', 'Solo en la Caja de Jefe (Llave de Jefe).', ['+4 corazones y Resistencia I', 'Inmune al empuje', 'Fuerza I con menos de 5 corazones'], { botas: ['Caída de pluma IV'] }, { color: '#f0be3c' }),
      set('sculk', 'de Sculk', E, 'diamante', 'Solo en la Caja de Jefe (Llave de Jefe).', ['Visión nocturna y Velocidad I', 'Inmune a Oscuridad y Ceguera', 'Quien te pega queda en Oscuridad'], { pantalones: ['Sigilo rápido III'] }, { color: '#46ebe1' }),
      set('centinela', 'del Centinela', R, 'hierro', 'Solo en la Caja de Jefe (Llave de Jefe).', ['+2 corazones y Prisa I', 'Las flechas te hacen 30% menos daño'], {}, { color: '#5ac8ff' }),
      set('paladin', 'del Paladín', E, 'hierro', 'Botín épico.', ['+2 corazones', 'Inmune al veneno y al wither'], {}, { color: '#dcaf32' }),
      set('brasas', 'de Brasas', E, 'oro', 'Botín épico.', ['Resistencia al fuego', 'Quema a quien te golpea'], {}, { color: '#f08232' }),
      set('asesino', 'del Asesino', E, 'cota de malla', 'Botín épico.', ['Velocidad I y Salto I', '+25% de daño por la espalda'], { pantalones: ['Sigilo rápido III'] }, { color: '#c8505f' }),
      set('mareas', 'de las Mareas', R, 'cota de malla', 'Botín raro.', ['Respiración acuática siempre', 'En el agua: Gracia del delfín y Conducto'], { casco: ['Afinidad acuática'], botas: ['Agilidad acuática III'] }, { color: '#6ec8d2' }),
      set('explorador', 'del Explorador', R, 'cota de malla', 'Botín raro.', ['Velocidad I y Salto I'], { botas: ['Caída de pluma IV'] }, { color: '#46a05a' })
    ],

    /* ---------------- DONADORES ---------------- */
    donadores: {
      minimo: 15, moneda: 'USD',
      titulo: 'Top Donador',
      texto: 'Si apoyas al server con una donación de más de 15 USD, entras al Top Donador. Se SUMA a tu rango VIP (no lo reemplaza) y tu ayuda paga el server y los eventos.',
      beneficios: [
        'Prefijo dorado [✦ Top Donador] en el chat (se ve encima del de tu rango)',
        'Colores en el chat y /hat',
        'Kit Top Donador cada 3 días',
        'Al reclamar el kit, el server anuncia y agradece tu apoyo en el chat'
      ],
      pasos: [
        'Haz tu donación de más de 15 USD con el botón de abajo.',
        'Manda el comprobante y tu nick de Minecraft a Alexito_VT (por Contacto o en el server).',
        'Alexito te da el rango Top Donador a mano, normalmente el mismo día.',
        'Dentro del server escribe /kits (o el botón KITS de /menu) y reclama el Kit Top Donador, abajo al centro. Se puede volver a reclamar cada 3 días.'
      ],
      kit: {
        casco: { mat: 'netherite', nombre: 'Casco del Top Donador', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        arma: { tipo: 'espada', mat: 'netherite', nombre: 'Espada del Top Donador', encantamientos: ['Filo V', 'Botín III', 'Irrompibilidad III', 'Reparación'] }
      },
      tambien: ['3 manzanas de Notch y 2 tótems', '2 lingotes de netherita', '64 botellas de experiencia y 16 cohetes', '$8,000 del juego', 'Llave Legendaria y Llave de Jefe', 'Sangre de Dragón y Manzana del Titán'],
      piel: { pelo: '#ffe39a', panza: '#fffaf0', ropa: '#5a1d3f' },
      capa: '#f4cf38',
      /* lista del Top (ordénala de mayor a menor): { nick:'Nombre', monto:20 } */
      top: []
    }
  };
})();
