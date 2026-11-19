/* =====================================================================
   FURRYLAND · DATOS DE LA TIENDA (minecraft.html)
   Todo lo que se ve en la página sale de aquí. Edita textos, precios,
   encantamientos y colores sin tocar el diseño.

   MATERIALES que entiende el visor 3D (para armaduras y armas):
     cuero, cadena, hierro, oro, diamante, netherite, esmeralda,
     amatista, rosa, madera, piedra, obsidiana
     ...o un color propio, por ejemplo "#7cf0ff"

   ARMAS (tipo): espada, hacha, arco, tridente

   PIEZAS DE ARMADURA: casco, pechera, pantalones, botas
     Cada pieza: { mat:'diamante', nombre:'(opcional)', encantamientos:['Protección IV', ...] }
     Si una pieza tiene encantamientos, en 3D sale con el brillo morado.

   PRECIO: un número (en la moneda de abajo) o null si es gratis / se consigue jugando.
   ===================================================================== */
window.FURRYLAND = {

  servidor: {
    nombre: 'FURRYLAND',
    autor: 'AlexitoFS',
    logo: 'minecraft-media/logo-furryland.png', /* si no existe la imagen, se muestra el logo en letras */
    ip: 'play.furryland.net',                     /* EJEMPLO: pon la IP real del server */
    version: 'Java y Bedrock · 1.21'
  },

  tienda: {
    moneda: 'USD',
    simbolo: '$',
    comprarUrl: 'contacto.html',   /* a dónde lleva el botón "Comprar" (tu Discord, tu tienda, etc.) */
    comprarTexto: 'Comprar'
  },

  /* ---------------- CARRUSEL: ofertas, noticias, actualizaciones ----------------
     tipo: 'oferta' | 'noticia' | 'actualizacion' | 'evento'
     img: ruta de la imagen (recomendado 1600x700). Si la dejas vacía, sale un fondo de color. */
  carrusel: [
    { tipo: 'oferta', titulo: '-30% en todos los rangos', texto: 'Solo este fin de semana. Sube de rango y llévate tu kit encantado.', img: '', boton: { texto: 'Ver rangos', ir: 'rangos' } },
    { tipo: 'actualizacion', titulo: 'Nueva armadura: Cuarzo Rosa', texto: 'Llega la armadura más bonita del server, con Protección V. Consíguela en la mina profunda.', img: '', boton: { texto: 'Ver armaduras', ir: 'armaduras' } },
    { tipo: 'evento', titulo: 'Evento de Navidad', texto: 'Cofres de regalo cada día, cosméticos de temporada y un jefe final con premio.', img: '' },
    { tipo: 'noticia', titulo: 'Top donadores del mes', texto: 'Dona $15 o más y entra al Top Donador con kit exclusivo y tu nombre en el spawn.', img: '', boton: { texto: 'Ver Donadores', ir: 'donadores' } }
  ],

  /* ---------------- RANGOS: armadura del kit + arma de cada rango ---------------- */
  rangos: [
    {
      nombre: 'Cachorro', color: '#7cf0b8', precio: 5,
      descripcion: 'El primer paso en FurryLand. Ideal para empezar con buen equipo.',
      ventajas: ['Prefijo [Cachorro] en el chat', '2 casas con /sethome', 'Kit cada 3 días', 'Acceso a /craft'],
      kit: {
        casco: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad I'] },
        pechera: { mat: 'hierro', encantamientos: ['Protección II', 'Irrompibilidad I'] },
        pantalones: { mat: 'hierro', encantamientos: ['Protección II'] },
        botas: { mat: 'hierro', encantamientos: ['Protección II', 'Caída de pluma II'] },
        arma: { tipo: 'espada', mat: 'hierro', nombre: 'Espada del Cachorro', encantamientos: ['Filo II', 'Irrompibilidad I'] }
      },
      piel: { pelo: '#f7c6a5', ropa: '#2f6b55' }
    },
    {
      nombre: 'Zorro', color: '#ffb35c', precio: 10, destacado: true,
      descripcion: 'El favorito de la comunidad. Equipo de diamante y más comodidades.',
      ventajas: ['Prefijo [Zorro] en el chat', '5 casas', 'Kit cada 2 días', '/craft y /ec (cofre de ender)', 'Color en el nombre'],
      kit: {
        casco: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad II', 'Respiración I'] },
        pechera: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad II'] },
        pantalones: { mat: 'diamante', encantamientos: ['Protección III', 'Irrompibilidad II'] },
        botas: { mat: 'diamante', encantamientos: ['Protección III', 'Caída de pluma III'] },
        arma: { tipo: 'espada', mat: 'diamante', nombre: 'Colmillo de Zorro', encantamientos: ['Filo III', 'Botín II', 'Irrompibilidad II'] }
      },
      piel: { pelo: '#ff9d5c', panza: '#fff4ea', ropa: '#3a2a5e' }
    },
    {
      nombre: 'Alfa', color: '#ff6fae', precio: 20,
      descripcion: 'El rango más alto. Netherite al máximo y todas las ventajas.',
      ventajas: ['Prefijo [Alfa] animado', 'Casas ilimitadas', 'Kit cada día', '/fly en el lobby', '/nick y /hat', 'Partículas exclusivas'],
      kit: {
        casco: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación', 'Respiración III'] },
        pechera: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación', 'Espinas II'] },
        pantalones: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación'] },
        botas: { mat: 'netherite', encantamientos: ['Protección IV', 'Caída de pluma IV', 'Reparación', 'Agilidad acuática III'] },
        arma: { tipo: 'hacha', mat: 'netherite', nombre: 'Hacha del Alfa', encantamientos: ['Filo V', 'Irrompibilidad III', 'Reparación'] }
      },
      piel: { pelo: '#f7a8cb', ropa: '#1f1838' }
    }
  ],

  /* ---------------- ITEMS ----------------
     dePaga: true  = cosmético que se compra (lleva precio)
     dePaga: false = item gratis del server (dice cómo se consigue)
     icono: gema, pocion, llave, comida, cofre, capa, libro, estrella   (o img:'ruta.png')
     capa: '#color' -> muestra el personaje en 3D usando esa capa */
  items: [
    { nombre: 'Capa Estelar', dePaga: true, precio: 4, capa: '#6b5bff', descripcion: 'Capa animada con brillo de estrellas. Solo se ve bonita, no da ventajas.' },
    { nombre: 'Capa Sakura', dePaga: true, precio: 4, capa: '#ff8fc4', descripcion: 'Capa rosa con flor bordada en la espalda.' },
    { nombre: 'Partículas de corazones', dePaga: true, precio: 3, icono: 'estrella', color: '#ff6fae', descripcion: 'Corazones flotando a tu alrededor al caminar.' },
    { nombre: 'Mascota: Zorrito', dePaga: true, precio: 6, icono: 'gema', color: '#ff9d5c', descripcion: 'Un zorrito que te sigue a todas partes.' },
    { nombre: 'Llave de cofre mítico', dePaga: true, precio: 2, icono: 'llave', color: 'oro', descripcion: 'Abre un cofre mítico en el spawn con premios al azar.' },
    { nombre: 'Kit de bienvenida', dePaga: false, icono: 'cofre', color: 'madera', obtener: 'Escribe /kit inicio al entrar por primera vez.', descripcion: 'Herramientas de piedra, comida y una cama.' },
    { nombre: 'Pan de la abuela', dePaga: false, icono: 'comida', color: '#d9a35b', obtener: 'Lo regalan los aldeanos del spawn cada día.', descripcion: 'Recupera mucha hambre y saturación.' },
    { nombre: 'Poción de velocidad', dePaga: false, icono: 'pocion', color: '#5fd3ff', obtener: 'Premio de la parkour del lobby.', descripcion: 'Velocidad II durante 3 minutos.' },
    { nombre: 'Libro de reglas', dePaga: false, icono: 'libro', color: '#a56cff', obtener: 'Te lo dan al entrar. También con /reglas.', descripcion: 'Todo lo que necesitas saber para jugar tranquilo.' }
  ],

  /* ---------------- ARMAS del server ---------------- */
  armas: [
    { nombre: 'Espada de Diamante', tipo: 'espada', mat: 'diamante', encantamientos: ['Filo V', 'Botín III', 'Aspecto ígneo II', 'Irrompibilidad III'], precio: null, obtener: 'Craftéala y encántala en la mesa del spawn.' },
    { nombre: 'Hoja de Cuarzo Rosa', tipo: 'espada', mat: 'rosa', encantamientos: ['Filo VI', 'Barrido III', 'Reparación'], precio: 8, obtener: 'Arma exclusiva de la tienda.' },
    { nombre: 'Hacha de Netherite', tipo: 'hacha', mat: 'netherite', encantamientos: ['Filo V', 'Eficiencia V', 'Irrompibilidad III'], precio: null, obtener: 'Mejórala en la mesa de herrería.' },
    { nombre: 'Arco del Bosque', tipo: 'arco', mat: 'madera', encantamientos: ['Poder V', 'Llama', 'Infinidad'], precio: null, obtener: 'Premio del evento semanal de tiro.' },
    { nombre: 'Tridente Abisal', tipo: 'tridente', mat: 'esmeralda', encantamientos: ['Lealtad III', 'Canalización', 'Empalamiento V'], precio: 6, obtener: 'Solo en la tienda o en el jefe del océano.' },
    { nombre: 'Espada de Oro Encantada', tipo: 'espada', mat: 'oro', encantamientos: ['Filo IV', 'Saqueo III'], precio: null, obtener: 'Cofres del Nether.' }
  ],

  /* ---------------- ARMADURAS del server ---------------- */
  armaduras: [
    {
      nombre: 'Armadura de Diamante', precio: null, obtener: 'Craftéala con diamantes y encántala en el spawn.',
      piezas: {
        casco: { mat: 'diamante', encantamientos: ['Protección IV', 'Respiración III', 'Afinidad acuática'] },
        pechera: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        pantalones: { mat: 'diamante', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        botas: { mat: 'diamante', encantamientos: ['Protección IV', 'Caída de pluma IV'] }
      }
    },
    {
      nombre: 'Armadura de Cuarzo Rosa', precio: 12, obtener: 'Exclusiva de FurryLand: tienda o mina profunda (muy rara).',
      piezas: {
        casco: { mat: 'rosa', encantamientos: ['Protección V', 'Reparación'] },
        pechera: { mat: 'rosa', encantamientos: ['Protección V', 'Reparación', 'Espinas III'] },
        pantalones: { mat: 'rosa', encantamientos: ['Protección V', 'Reparación'] },
        botas: { mat: 'rosa', encantamientos: ['Protección V', 'Caída de pluma IV', 'Reparación'] }
      },
      piel: { pelo: '#ffffff', panza: '#ffe1ef', ropa: '#3a2450' }
    },
    {
      nombre: 'Armadura de Netherite', precio: null, obtener: 'Mejora tu armadura de diamante con lingotes de netherite.',
      piezas: {
        casco: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        pechera: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        pantalones: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III'] },
        botas: { mat: 'netherite', encantamientos: ['Protección IV', 'Caída de pluma IV'] }
      }
    },
    {
      nombre: 'Armadura de Hierro', precio: null, obtener: 'La más común: craftéala con lingotes de hierro.',
      piezas: {
        casco: { mat: 'hierro', encantamientos: [] },
        pechera: { mat: 'hierro', encantamientos: ['Protección I'] },
        pantalones: { mat: 'hierro', encantamientos: [] },
        botas: { mat: 'hierro', encantamientos: [] }
      },
      piel: { pelo: '#c9a27a', ropa: '#3b4a6b' }
    }
  ],

  /* ---------------- DONADORES ---------------- */
  donadores: {
    minimo: 15,   /* a partir de cuánto entras al Top Donador */
    titulo: 'Top Donador',
    texto: 'Si apoyas al server con $15 USD o más, entras al Top Donador. Tu ayuda paga el hosting y los eventos, y te llevas un kit exclusivo.',
    beneficios: [
      'Prefijo [Top Donador] dorado en el chat y en el tab',
      'Tu nombre en el muro de donadores del spawn',
      'Kit Top Donador cada 7 días',
      'Rol especial en el Discord',
      'Acceso anticipado a las actualizaciones'
    ],
    pasos: [
      'Haz tu donación de $15 USD o más desde el botón de abajo.',
      'Manda el comprobante por Discord en el canal #donaciones junto con tu nick de Minecraft.',
      'Un admin te da el rango en menos de 24 horas.',
      'Dentro del server escribe /kit topdonador para recibir tu kit (se puede usar cada 7 días).'
    ],
    kit: {
      casco: { mat: 'oro', nombre: 'Corona del Donador', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación'] },
      pechera: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación'] },
      pantalones: { mat: 'netherite', encantamientos: ['Protección IV', 'Irrompibilidad III', 'Reparación'] },
      botas: { mat: 'oro', encantamientos: ['Protección IV', 'Caída de pluma IV', 'Velocidad del alma III'] },
      arma: { tipo: 'espada', mat: 'oro', nombre: 'Espada del Mecenas', encantamientos: ['Filo V', 'Botín III', 'Reparación'] }
    },
    piel: { pelo: '#ffe39a', panza: '#fffaf0', ropa: '#5a1d3f' },
    capa: '#f4cf38',
    /* lista del Top (ordénala de mayor a menor) */
    top: [
      { nick: 'EjemploUno', monto: 50 },
      { nick: 'EjemploDos', monto: 35 },
      { nick: 'EjemploTres', monto: 20 }
    ]
  }
};
