import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar assets
import fondoJuego from '../assets/images/juego1.jpg';
import draggleSprite from '../assets/images/draggleSprite.png';
import kittySprite from '../assets/images/kitty.png';
import cowSprite from '../assets/images/cow.png';
import chickenSprite from '../assets/images/chicken.png';

const JuegoTesoroPrivacidad = ({ modoEnfoque }) => {
  const navigate = useNavigate();
  
  // Estados del juego
  const [pantalla, setPantalla] = useState('seleccion'); // seleccion, jugando, victoria, derrota
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [posicionJugador, setPosicionJugador] = useState(460); // Posición X del jugador (centrado en 1000px)
  const [objetosCayendo, setObjetosCayendo] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [datosAtrapados, setDatosAtrapados] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(180); // 3 minutos = 180 segundos
  
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const timerRef = useRef(null);

  // Configuración del juego
  const ANCHO_JUEGO = 1000;
  const ALTO_JUEGO = 700;
  const TAMANO_JUGADOR = 80;
  const VELOCIDAD_JUGADOR = 45;
  const VELOCIDAD_OBJETOS = 3;
  const META_DATOS = 15;

  // Personajes disponibles - cada uno usa UNA sola imagen
  const personajes = [
    { id: 'dragon', nombre: '🐉 Dragoncito', sprite: draggleSprite, scale: 1 },
    { id: 'gato', nombre: '🐱 Gatito', sprite: kittySprite, scale: 1 },
    { id: 'vaca', nombre: '🐮 Vaquita', sprite: cowSprite, scale: 1 },
    { id: 'pollo', nombre: '🐔 Pollito', sprite: chickenSprite, scale: 1 }
  ];

  // Tipos de objetos que caen
  const tiposObjetos = {
    buenos: [
      { emoji: '🔑', nombre: 'Contraseña', puntos: 10 },
      { emoji: '📱', nombre: 'Teléfono', puntos: 10 },
      { emoji: '💳', nombre: 'Tarjeta', puntos: 10 },
      { emoji: '🏠', nombre: 'Dirección', puntos: 10 },
      { emoji: '📸', nombre: 'Fotos', puntos: 10 },
      { emoji: '👤', nombre: 'Nombre', puntos: 10 },
      { emoji: '🎂', nombre: 'Cumpleaños', puntos: 10 },
      { emoji: '🆔', nombre: 'ID', puntos: 10 },
      { emoji: '📧', nombre: 'Email', puntos: 10 },
      { emoji: '🔐', nombre: 'PIN', puntos: 10 }
    ],
    malos: [
      { emoji: '🗑️', nombre: 'Basura', puntos: 0 },
      { emoji: '😊', nombre: 'Color favorito', puntos: 0 },
      { emoji: '⚽', nombre: 'Deporte', puntos: 0 },
      { emoji: '🎮', nombre: 'Videojuego', puntos: 0 },
      { emoji: '🍕', nombre: 'Comida', puntos: 0 },
      { emoji: '🎵', nombre: 'Música', puntos: 0 },
      { emoji: '📚', nombre: 'Libro', puntos: 0 },
      { emoji: '🎬', nombre: 'Película', puntos: 0 }
    ]
  };

  // Seleccionar personaje
  const seleccionarPersonaje = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setPantalla('jugando');
  };

  // Mover jugador con teclado
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    const manejarTecla = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPosicionJugador(prev => Math.max(0, prev - VELOCIDAD_JUGADOR));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPosicionJugador(prev => Math.min(ANCHO_JUEGO - TAMANO_JUGADOR, prev + VELOCIDAD_JUGADOR));
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [pantalla]);

  // Generar objetos que caen
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    spawnTimerRef.current = setInterval(() => {
      const esBueno = Math.random() > 0.3; // 70% buenos, 30% malos
      const listaObjetos = esBueno ? tiposObjetos.buenos : tiposObjetos.malos;
      const objeto = listaObjetos[Math.floor(Math.random() * listaObjetos.length)];

      const nuevoObjeto = {
        id: Date.now() + Math.random(),
        x: Math.random() * (ANCHO_JUEGO - 50),
        y: -50,
        esBueno: esBueno,
        ...objeto
      };

      setObjetosCayendo(prev => [...prev, nuevoObjeto]);
    }, 1500); // Cada 1.5 segundos aparece un nuevo objeto

    return () => clearInterval(spawnTimerRef.current);
  }, [pantalla]);

  // Game loop - mover objetos y detectar colisiones
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    gameLoopRef.current = setInterval(() => {
      setObjetosCayendo(prev => {
        const objetosActualizados = prev
          .map(obj => ({ ...obj, y: obj.y + VELOCIDAD_OBJETOS }))
          .filter(obj => {
            // Verificar colisión con jugador
            const colisiona = 
              obj.x < posicionJugador + TAMANO_JUGADOR &&
              obj.x + 50 > posicionJugador &&
              obj.y < ALTO_JUEGO - 100 &&
              obj.y + 50 > ALTO_JUEGO - 100 - TAMANO_JUGADOR;

            if (colisiona) {
              if (obj.esBueno) {
                setPuntos(p => p + obj.puntos);
                setDatosAtrapados(d => d + 1);
              } else {
                setVidas(v => v - 1);
              }
              return false; // Eliminar objeto
            }

            // Eliminar objetos que salieron de la pantalla
            return obj.y < ALTO_JUEGO;
          });

        return objetosActualizados;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoopRef.current);
  }, [pantalla, posicionJugador]);

  // Timer del juego
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          setPantalla('derrota');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [pantalla]);

  // Verificar condiciones de victoria/derrota
  useEffect(() => {
    if (pantalla === 'jugando') {
      if (vidas <= 0) {
        setPantalla('derrota');
      } else if (datosAtrapados >= META_DATOS) {
        setPantalla('victoria');
      }
    }
  }, [vidas, datosAtrapados, pantalla]);

  // Reiniciar juego
  const reiniciar = () => {
    setPantalla('seleccion');
    setPersonajeSeleccionado(null);
    setPosicionJugador(460);
    setObjetosCayendo([]);
    setVidas(3);
    setPuntos(0);
    setDatosAtrapados(0);
    setTiempoRestante(180);
  };

  // Formatear tiempo
  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs.toString().padStart(2, '0')}`;
  };

  const estiloBase = modoEnfoque ? styles.containerEnfoque : styles.container;

  // PANTALLA: Selección de personaje
  if (pantalla === 'seleccion') {
    return (
      <div style={{
        ...estiloBase,
        backgroundImage: `url(${fondoJuego})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={styles.pantallaSeleccion}>
          <h1 style={styles.titulo}>🔒 Protege tus Datos Personales</h1>
          <p style={styles.instrucciones}>
            ¡Ayuda a tu personaje a <strong>PROTEGER</strong> sus datos sensibles!
          </p>
          <p
            style={{
              ...styles.instrucciones,
              fontSize: '18px',
              marginTop: '-20px',
              marginBottom: '30px',
            }}
          >
            Atrapa todo lo que sea <strong>PRIVADO</strong> y evita lo que es{' '}
            <strong>PÚBLICO</strong> (basura).
          </p>

          <h2 style={styles.subtitulo}>Elige tu personaje:</h2>
          
          <div style={styles.personajesGrid}>
            {personajes.map(personaje => (
              <div
                key={personaje.id}
                style={styles.tarjetaPersonaje}
                onClick={() => seleccionarPersonaje(personaje)}
              >
                <img 
                  src={personaje.sprite} 
                  alt={personaje.nombre}
                  style={{
                    width: '80px',
                    height: '80px',
                    imageRendering: 'pixelated',
                    objectFit: 'contain'
                  }}
                />
                <p style={styles.nombrePersonaje}>{personaje.nombre}</p>
              </div>
            ))}
          </div>

          <div style={styles.instruccionesJuego}>
            <h3>📋 Cómo jugar:</h3>
            <ul style={styles.lista}>
              <li>⬅️ ➡️ Usa las flechas o A/D para moverte</li>
              <li>
                ✅ <strong>Atrapa datos PRIVADOS:</strong> <br />
                (Ej: 🔑 Contraseña, 💳 Tarjeta, 🏠 Dirección)
              </li>
              <li>
                ❌ <strong>Evita datos PÚBLICOS (basura):</strong> <br />
                (Ej: 🍕 Comida, ⚽ Deporte, 😊 Color)
              </li>
              <li>🎯 Meta: Proteger {META_DATOS} datos en 3 minutos</li>
              <li>❤️ Tienes 3 vidas</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Jugando
  if (pantalla === 'jugando') {
    return (
      <div style={{
        ...estiloBase,
        backgroundImage: `url(${fondoJuego})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={styles.juegoContainer}>
          {/* Header con info */}
          <div style={styles.header}>
            <div style={styles.stat}>
              ⏱️ {formatearTiempo(tiempoRestante)}
            </div>
            <div style={styles.stat}>
              ❤️ {vidas > 0 ? Array(vidas).fill('❤️').join('') : '💔'}
            </div>
            <div style={styles.stat}>
              ✅ {datosAtrapados}/{META_DATOS}
            </div>
            <div style={styles.stat}>
              ⭐ {puntos} pts
            </div>
          </div>

          {/* Área de juego */}
          <div 
            style={{
              ...styles.areaJuego,
              backgroundImage: `url(${fondoJuego})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Objetos cayendo */}
            {objetosCayendo.map((objeto) => (
              <div
                key={objeto.id}
                style={{
                  ...styles.objetoCayendo,
                  left: `${objeto.x}px`,
                  top: `${objeto.y}px`,
                  backgroundColor: objeto.esBueno ? '#d6f5d6' : '#f5d6d6',
                  borderColor: objeto.esBueno ? '#5a9c5a' : '#c57474',
                }}
              >
                <span style={styles.objetoEmoji}>{objeto.emoji}</span>
                <span style={styles.objetoTexto}>{objeto.nombre}</span>
              </div>
            ))}

            {/* Jugador */}
            {personajeSeleccionado && (
              <div
                style={{
                  position: 'absolute',
                  left: `${posicionJugador}px`,
                  bottom: '20px',
                  width: `${TAMANO_JUGADOR}px`,
                  height: `${TAMANO_JUGADOR}px`,
                  transition: 'left 0.1s linear'
                }}
              >
                <img
                  src={personajeSeleccionado.sprite}
                  alt={personajeSeleccionado.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    imageRendering: 'pixelated',
                    transform: `scale(${personajeSeleccionado.scale})`,
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                  }}
                />
              </div>
            )}
          </div>

          {/* Instrucciones en pantalla */}
          <div style={styles.controles}>
            <span>⬅️ A / ←</span>
            <span>Muévete para atrapar</span>
            <span>D / → ➡️</span>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Victoria
  if (pantalla === 'victoria') {
    return (
      <div style={{
        ...estiloBase,
        backgroundImage: `url(${fondoJuego})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={styles.pantallaFinal}>
          <h1 style={styles.mensajeVictoria}>🎉 ¡VICTORIA!</h1>
          <p style={styles.mensajeFinal}>
            ¡Excelente trabajo protegiendo tus datos personales!
          </p>
          
          <div style={styles.estadisticasFinales}>
            <div style={styles.estadItem}>
              <span style={styles.estadIcono}>⭐</span>
              <span style={styles.estadValor}>{puntos}</span>
              <span style={styles.estadLabel}>Puntos</span>
            </div>
            <div style={styles.estadItem}>
              <span style={styles.estadIcono}>✅</span>
              <span style={styles.estadValor}>{datosAtrapados}</span>
              <span style={styles.estadLabel}>Datos protegidos</span>
            </div>
            <div style={styles.estadItem}>
              <span style={styles.estadIcono}>⏱️</span>
              <span style={styles.estadValor}>{formatearTiempo(tiempoRestante)}</span>
              <span style={styles.estadLabel}>Tiempo restante</span>
            </div>
          </div>

          <div style={styles.mensajeEducativo}>
            <h3>🎓 Aprendiste que:</h3>
            <p>
              Los datos personales como contraseñas, teléfonos, direcciones y fotos 
              deben ser protegidos. ¡Nunca los compartas con extraños en internet!
            </p>
          </div>

          <div style={styles.botonesFinal}>
            <button style={styles.botonSecundario} onClick={reiniciar}>
              🔄 Jugar de Nuevo
            </button>
            <button style={styles.botonPrimario} onClick={() => navigate('/menu-juegos')}>
              ✅ Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Derrota
  if (pantalla === 'derrota') {
    return (
      <div style={{
        ...estiloBase,
        backgroundImage: `url(${fondoJuego})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={styles.pantallaFinal}>
          <h1 style={styles.mensajeDerrota}>😢 ¡Intenta de nuevo!</h1>
          <p style={styles.mensajeFinal}>
            {vidas <= 0 
              ? 'Atrapaste demasiada basura. ¡Ten más cuidado!'
              : 'Se acabó el tiempo. ¡Sé más rápido la próxima vez!'}
          </p>
          
          <div style={styles.estadisticasFinales}>
            <div style={styles.estadItem}>
              <span style={styles.estadIcono}>⭐</span>
              <span style={styles.estadValor}>{puntos}</span>
              <span style={styles.estadLabel}>Puntos</span>
            </div>
            <div style={styles.estadItem}>
              <span style={styles.estadIcono}>✅</span>
              <span style={styles.estadValor}>{datosAtrapados}/{META_DATOS}</span>
              <span style={styles.estadLabel}>Datos protegidos</span>
            </div>
          </div>

          <div style={styles.mensajeEducativo}>
            <h3>💡 Consejo:</h3>
            <p>
              Concéntrate en atrapar solo los datos personales (🔑📱💳🏠📸👤). 
              ¡Evita todo lo demás!
            </p>
          </div>

          <div style={styles.botonesFinal}>
            <button style={styles.botonSecundario} onClick={reiniciar}>
              🔄 Reintentar
            </button>
            <button style={styles.botonPrimario} onClick={() => navigate('/menu-juegos')}>
              🏠 Menú Principal
            </button>
          </div>
        </div>
      </div>
    );
  }
};

// Estilos
const styles = {
  container: {
    minHeight: '100vh',
    background: '#87CEEB',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
    color: 'white'
  },
  containerEnfoque: {
    minHeight: '100vh',
    background: 'transparent',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333'
  },
  pantallaSeleccion: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  titulo: {
    fontSize: '42px',
    marginBottom: '20px',
    color: '#2d5016',
    textShadow: 'none'
  },
  instrucciones: {
    fontSize: '20px',
    marginBottom: '40px',
    color: '#333'
  },
  subtitulo: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#2d5016'
  },
  personajesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  tarjetaPersonaje: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '30px',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '3px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px'
  },
  nombrePersonaje: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  instruccionesJuego: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'left',
    maxWidth: '600px',
    margin: '0 auto',
    color: '#333',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  lista: {
    fontSize: '16px',
    lineHeight: '2',
    listStyle: 'none',
    padding: 0,
    color: '#333'
  },
  juegoContainer: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  stat: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d5016'
  },
  areaJuego: {
    width: '1000px',
    height: '700px',
    position: 'relative',
    backgroundColor: '#87CEEB',
    borderRadius: '15px',
    overflow: 'hidden',
    border: '4px solid #fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  objetoCayendo: {
    position: 'absolute',
    width: '100px',
    padding: '8px',
    borderRadius: '8px',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'none'
  },
  objetoEmoji: {
    fontSize: '32px'
  },
  objetoTexto: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  controles: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '20px',
    fontSize: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '15px',
    borderRadius: '10px',
    color: '#2d5016',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  pantallaFinal: {
    maxWidth: '700px',
    margin: '50px auto',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '50px',
    borderRadius: '20px',
    textAlign: 'center',
    color: '#333'
  },
  mensajeVictoria: {
    fontSize: '48px',
    color: '#4CAF50',
    marginBottom: '20px'
  },
  mensajeDerrota: {
    fontSize: '48px',
    color: '#ff9800',
    marginBottom: '20px'
  },
  mensajeFinal: {
    fontSize: '20px',
    marginBottom: '30px',
    lineHeight: '1.6'
  },
  estadisticasFinales: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '30px',
    gap: '20px',
    flexWrap: 'wrap'
  },
  estadItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  estadIcono: {
    fontSize: '48px'
  },
  estadValor: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2196F3'
  },
  estadLabel: {
    fontSize: '14px',
    color: '#666'
  },
  mensajeEducativo: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  botonesFinal: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  botonPrimario: {
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  botonSecundario: {
    padding: '15px 40px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  }
};

export default JuegoTesoroPrivacidad;