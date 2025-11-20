import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../PerfilContext';
import { Loader } from 'lucide-react';

// Importar assets
import fondoJuego from '../assets/images/juego1.jpg';
import draggleSprite from '../assets/images/draggleSprite.png';
import kittySprite from '../assets/images/kitty.png';
import cowSprite from '../assets/images/cow.png';
import chickenSprite from '../assets/images/chicken.png';

const JuegoTesoroPrivacidad = () => {
  const navigate = useNavigate();
  const { perfilActivo, actualizarPuntos } = usePerfil();
  
  const modoEnfoque = perfilActivo?.modoEnfoque || false;

  // Estados del juego
  const [pantalla, setPantalla] = useState('seleccion'); 
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [posicionJugador, setPosicionJugador] = useState(460); 
  const [objetosCayendo, setObjetosCayendo] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [datosAtrapados, setDatosAtrapados] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(180);
  const [loading, setLoading] = useState(false);
  
  // Estado para los objetos generados por la IA
  const [poolObjetos, setPoolObjetos] = useState({ buenos: [], malos: [] });
  
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const timerRef = useRef(null);

  // Configuración
  const ANCHO_JUEGO = 1000;
  const ALTO_JUEGO = 700;
  const TAMANO_JUGADOR = 80;
  const VELOCIDAD_JUGADOR = 45;
  const VELOCIDAD_OBJETOS = 4;
  const META_DATOS = 15;
  const PENALIZACION_CAIDA = 5;

  // API Config
  const GEMINI_API_KEY = 'AIzaSyA3EQMAn-Qa26125Mjm3qCBt4fUeJrZmD4';
  const GEMINI_MODEL = 'gemini-1.5-flash';

  // Personajes
  const personajes = [
    { id: 'dragon', nombre: '🐉 Dragoncito', sprite: draggleSprite, scale: 1 },
    { id: 'gato', nombre: '🐱 Gatito', sprite: kittySprite, scale: 1 },
    { id: 'vaca', nombre: '🐮 Vaquita', sprite: cowSprite, scale: 1 },
    { id: 'pollo', nombre: '🐔 Pollito', sprite: chickenSprite, scale: 1 }
  ];

  // 🤖 FUNCIÓN: Generar Objetos con Gemini
  const generarObjetosIA = async () => {
    setLoading(true);
    const prompt = `Genera una lista de objetos para un juego de privacidad digital para niños.
    Necesito 2 listas en formato JSON:
    1. "buenos": 15 ejemplos de DATOS PRIVADOS que se deben proteger (ej: Contraseña, Dirección, Foto íntima, Chat privado).
    2. "malos": 15 ejemplos de DATOS PÚBLICOS o BASURA que no importa compartir (ej: Color favorito, Clima, Meme viral, Nombre de mascota).
    
    Formato JSON requerido (solo JSON):
    {
      "buenos": [{"emoji": "🔑", "nombre": "Contraseña"}, ...],
      "malos": [{"emoji": "🌧️", "nombre": "Clima"}, ...]
    }`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, 
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 600 } // ✅ CORREGIDO: era "config"
              }),
            }
        );

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (content) {
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            const objetosGenerados = JSON.parse(cleanContent);
            
            // Añadimos puntos base a los objetos
            const buenos = objetosGenerados.buenos.map(o => ({ ...o, puntos: 10, esIA: true }));
            const malos = objetosGenerados.malos.map(o => ({ ...o, puntos: 0, esIA: true }));
            
            setPoolObjetos({ buenos, malos });
        }
    } catch (error) {
        console.error("Error IA, usando fallback", error);
        // Fallback
        setPoolObjetos({
            buenos: [
                { emoji: '🔑', nombre: 'Contraseña', puntos: 10, esIA: false },
                { emoji: '📱', nombre: 'Teléfono', puntos: 10, esIA: false },
                { emoji: '🏠', nombre: 'Dirección', puntos: 10, esIA: false },
                { emoji: '📸', nombre: 'Fotos', puntos: 10, esIA: false },
                { emoji: '🆔', nombre: 'ID', puntos: 10, esIA: false },
                { emoji: '💳', nombre: 'Tarjeta', puntos: 10, esIA: false },
                { emoji: '🔐', nombre: 'PIN', puntos: 10, esIA: false },
                { emoji: '📧', nombre: 'Email', puntos: 10, esIA: false },
                { emoji: '👤', nombre: 'Perfil', puntos: 10, esIA: false },
                { emoji: '💬', nombre: 'Chat', puntos: 10, esIA: false }
            ],
            malos: [
                { emoji: '🗑️', nombre: 'Basura', puntos: 0, esIA: false },
                { emoji: '⚽', nombre: 'Deporte', puntos: 0, esIA: false },
                { emoji: '🎮', nombre: 'Juego', puntos: 0, esIA: false },
                { emoji: '🍕', nombre: 'Pizza', puntos: 0, esIA: false },
                { emoji: '🌧️', nombre: 'Clima', puntos: 0, esIA: false },
                { emoji: '🎵', nombre: 'Música', puntos: 0, esIA: false }
            ]
        });
    } finally {
        setLoading(false);
    }
  };

  // Cargar objetos al montar el componente
  useEffect(() => {
      generarObjetosIA();
  }, []);

  // Seleccionar personaje
  const seleccionarPersonaje = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setPantalla('jugando');
  };

  // Input Jugador
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    const manejarTecla = (e) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        setPosicionJugador(prev => Math.max(0, prev - VELOCIDAD_JUGADOR));
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        setPosicionJugador(prev => Math.min(ANCHO_JUEGO - TAMANO_JUGADOR, prev + VELOCIDAD_JUGADOR));
      }
    };

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [pantalla, ANCHO_JUEGO, TAMANO_JUGADOR, VELOCIDAD_JUGADOR]);

  // Spawner (Generar objetos cayendo)
  useEffect(() => {
    if (pantalla !== 'jugando') return;
    if (poolObjetos.buenos.length === 0 || poolObjetos.malos.length === 0) return;

    const spawnObject = () => {
      const esBueno = Math.random() > 0.3; 
      const lista = esBueno ? poolObjetos.buenos : poolObjetos.malos;
      const objetoBase = lista[Math.floor(Math.random() * lista.length)];

      const nuevoObjeto = {
        id: Date.now() + Math.random(),
        x: Math.random() * (ANCHO_JUEGO - 80),
        y: -60,
        esBueno: esBueno,
        ...objetoBase
      };

      setObjetosCayendo(prev => [...prev, nuevoObjeto]);
    };

    // Spawner inicial inmediato
    spawnObject();
    
    spawnTimerRef.current = setInterval(spawnObject, 1500);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [pantalla, poolObjetos.buenos.length, poolObjetos.malos.length]);

  // 🚀 GAME LOOP PRINCIPAL
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    gameLoopRef.current = setInterval(() => {
      setObjetosCayendo(prev => {
        return prev
          .map(obj => ({ ...obj, y: obj.y + VELOCIDAD_OBJETOS }))
          .filter(obj => {
            // 1. Detectar Colisión con Jugador
            const colisiona = 
              obj.x < posicionJugador + TAMANO_JUGADOR &&
              obj.x + 60 > posicionJugador &&
              obj.y < ALTO_JUEGO - 100 &&
              obj.y + 60 > ALTO_JUEGO - 100 - TAMANO_JUGADOR;

            if (colisiona) {
              if (obj.esBueno) {
                setPuntos(p => p + obj.puntos);
                setDatosAtrapados(d => d + 1);
              } else {
                setVidas(v => v - 1);
              }
              return false;
            }

            // 2. Objeto cae fuera de pantalla
            if (obj.y >= ALTO_JUEGO) {
                if (obj.esBueno) {
                    setPuntos(p => Math.max(0, p - PENALIZACION_CAIDA));
                }
                return false;
            }

            return true;
          });
      });
    }, 1000 / 60); 

    return () => clearInterval(gameLoopRef.current);
  }, [pantalla, posicionJugador, VELOCIDAD_OBJETOS, ALTO_JUEGO, TAMANO_JUGADOR, PENALIZACION_CAIDA]);

  // Timer y Condiciones de Fin
  useEffect(() => {
    if (pantalla !== 'jugando') return;

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
            clearInterval(timerRef.current);
            finalizarJuego(false);
            return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [pantalla]);

  // Verificar condiciones de victoria/derrota
  useEffect(() => {
    if (pantalla !== 'jugando') return;
    
    if (vidas <= 0) {
      finalizarJuego(false);
    } else if (datosAtrapados >= META_DATOS) {
      finalizarJuego(true);
    }
  }, [vidas, datosAtrapados, pantalla]);

  // 💾 Función para guardar y cambiar pantalla
  const finalizarJuego = (victoria) => {
      const puntosTotales = (perfilActivo?.puntos || 0) + puntos;
      actualizarPuntos(puntosTotales);
      setPantalla(victoria ? 'victoria' : 'derrota');
  };

  const reiniciar = () => {
    setPantalla('seleccion');
    setPersonajeSeleccionado(null);
    setPosicionJugador(460);
    setObjetosCayendo([]);
    setVidas(3);
    setPuntos(0);
    setDatosAtrapados(0);
    setTiempoRestante(180);
    generarObjetosIA(); 
  };

  // Renders auxiliares
  const formatearTiempo = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const estiloBase = modoEnfoque ? styles.containerEnfoque : styles.container;

  // PANTALLA DE CARGA
  if (loading) {
      return (
        <div style={{...styles.container, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <Loader className="animate-spin" size={64} color="white" />
            <h2 style={{color:'white', marginTop: 20}}>Buscando tesoros en la red...</h2>
        </div>
      );
  }

  // PANTALLA: Selección
  if (pantalla === 'seleccion') {
    return (
      <div style={{...estiloBase, backgroundImage: `url(${fondoJuego})`, backgroundSize: 'cover'}}>
        <div style={styles.pantallaSeleccion}>
          <h1 style={styles.titulo}>🔒 Lluvia de Datos</h1>
          <p style={styles.instrucciones}>
            Atrapa los <strong>DATOS PRIVADOS</strong> y evita la <strong>BASURA PÚBLICA</strong>.
          </p>
          <h2 style={styles.subtitulo}>Elige tu personaje:</h2>
          
          <div style={styles.personajesGrid}>
            {personajes.map(p => (
              <div key={p.id} style={styles.tarjetaPersonaje} onClick={() => seleccionarPersonaje(p)}>
                <img src={p.sprite} alt={p.nombre} style={{width: '80px', height: '80px', objectFit: 'contain'}} />
                <p style={styles.nombrePersonaje}>{p.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Jugando
  if (pantalla === 'jugando') {
    return (
      <div style={{...estiloBase, backgroundImage: `url(${fondoJuego})`, backgroundSize: 'cover'}}>
        <div style={styles.juegoContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.stat}>⏱️ {formatearTiempo(tiempoRestante)}</div>
            <div style={styles.stat}>❤️ {vidas > 0 ? Array(vidas).fill('❤️').join('') : '💔'}</div>
            <div style={styles.stat}>✅ {datosAtrapados}/{META_DATOS}</div>
            <div style={styles.stat}>⭐ {puntos} pts</div>
          </div>

          {/* Área de juego */}
          <div style={{...styles.areaJuego, backgroundImage: `url(${fondoJuego})`, backgroundSize: 'cover'}}>
            {objetosCayendo.map((obj) => (
              <div key={obj.id} style={{
                  ...styles.objetoCayendo,
                  left: `${obj.x}px`, top: `${obj.y}px`,
                  backgroundColor: obj.esBueno ? '#d6f5d6' : '#f5d6d6',
                  borderColor: obj.esBueno ? '#5a9c5a' : '#c57474',
                }}>
                <span style={styles.objetoEmoji}>{obj.emoji}</span>
                <span style={styles.objetoTexto}>{obj.nombre}</span>
              </div>
            ))}

            {/* Jugador */}
            {personajeSeleccionado && (
              <div style={{
                  position: 'absolute', left: `${posicionJugador}px`, bottom: '20px',
                  width: `${TAMANO_JUGADOR}px`, height: `${TAMANO_JUGADOR}px`, transition: 'left 0.08s linear'
                }}>
                <img src={personajeSeleccionado.sprite} alt="P" style={{width:'100%', height:'100%', objectFit:'contain'}} />
              </div>
            )}
            
            <div style={{position:'absolute', bottom: 10, right: 10, color: 'red', fontWeight:'bold', fontSize:14, background:'rgba(255,255,255,0.8)', padding:5, borderRadius:5}}>
               ¡No dejes caer los verdes! (-{PENALIZACION_CAIDA} pts)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Victoria/Derrota
  if (pantalla === 'victoria' || pantalla === 'derrota') {
      const esVictoria = pantalla === 'victoria';
      return (
        <div style={{...estiloBase, backgroundImage: `url(${fondoJuego})`, backgroundSize: 'cover'}}>
          <div style={styles.pantallaFinal}>
            <h1 style={esVictoria ? styles.mensajeVictoria : styles.mensajeDerrota}>
                {esVictoria ? '🎉 ¡VICTORIA!' : '😢 ¡Intenta de nuevo!'}
            </h1>
            <div style={styles.estadisticasFinales}>
              <div style={styles.estadItem}>
                <span style={styles.estadIcono}>💰</span>
                <span style={styles.estadValor}>{puntos}</span>
                <span style={styles.estadLabel}>Puntos Guardados</span>
              </div>
            </div>
            <div style={styles.botonesFinal}>
              <button style={styles.botonSecundario} onClick={reiniciar}>🔄 Jugar de Nuevo</button>
              <button style={styles.botonPrimario} onClick={() => navigate('/menu-juegos')}>🏠 Menú</button>
            </div>
          </div>
        </div>
      );
  }

  // ✅ IMPORTANTE: Retorno por defecto
  return null;
};

// Estilos
const styles = {
  container: {
    minHeight: '100vh', background: '#87CEEB', padding: '20px', fontFamily: "'Poppins', sans-serif", color: 'white'
  },
  containerEnfoque: {
    minHeight: '100vh', background: '#f0f0f0', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333'
  },
  pantallaSeleccion: {
    maxWidth: '800px', margin: '0 auto', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  titulo: { fontSize: '42px', marginBottom: '20px', color: '#2d5016' },
  instrucciones: { fontSize: '20px', marginBottom: '30px', color: '#333' },
  subtitulo: { fontSize: '28px', marginBottom: '30px', color: '#2d5016' },
  personajesGrid: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' },
  tarjetaPersonaje: {
    backgroundColor: 'white', padding: '20px', borderRadius: '15px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '120px'
  },
  nombrePersonaje: { fontSize: '16px', fontWeight: 'bold', color: '#333', margin: 0 },
  juegoContainer: { maxWidth: '1000px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '15px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  stat: { fontSize: '20px', fontWeight: 'bold', color: '#2d5016' },
  areaJuego: {
    width: '100%', height: '650px', position: 'relative', backgroundColor: '#87CEEB',
    borderRadius: '15px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  objetoCayendo: {
    position: 'absolute', width: '90px', padding: '5px', borderRadius: '8px', border: '2px solid',
    display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', background: 'white'
  },
  objetoEmoji: { fontSize: '28px' },
  objetoTexto: { fontSize: '10px', fontWeight: 'bold', color: '#333', textAlign: 'center' },
  pantallaFinal: {
    maxWidth: '600px', margin: '50px auto', backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '40px', borderRadius: '20px', textAlign: 'center', color: '#333'
  },
  mensajeVictoria: { fontSize: '40px', color: '#4CAF50', marginBottom: '20px' },
  mensajeDerrota: { fontSize: '40px', color: '#ff9800', marginBottom: '20px' },
  estadisticasFinales: { display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '30px' },
  estadItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  estadIcono: { fontSize: '40px' },
  estadValor: { fontSize: '28px', fontWeight: 'bold', color: '#2196F3' },
  estadLabel: { fontSize: '14px', color: '#666' },
  botonesFinal: { display: 'flex', gap: '15px', justifyContent: 'center' },
  botonPrimario: {
    padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#4CAF50',
    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer'
  },
  botonSecundario: {
    padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#2196F3',
    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer'
  }
};

export default JuegoTesoroPrivacidad;