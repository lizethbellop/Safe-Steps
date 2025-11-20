import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../PerfilContext';
import { Loader, Shield, Trash2, Heart, Star, Clock, Target, HelpCircle } from 'lucide-react';

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
  const [pantalla, setPantalla] = useState('intro'); // Ahora empieza en intro
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [posicionJugador, setPosicionJugador] = useState(460); 
  const [objetosCayendo, setObjetosCayendo] = useState([]);
  const [vidas, setVidas] = useState(3);
  const [puntos, setPuntos] = useState(0);
  const [datosAtrapados, setDatosAtrapados] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(120);
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

  // API Config - ✅ ACTUALIZADO
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_MODEL = 'gemini-2.0-flash';

  // Personajes
  const personajes = [
    { id: 'dragon', nombre: 'Dragoncito', emoji: '🐉', sprite: draggleSprite, scale: 1 },
    { id: 'gato', nombre: 'Gatito', emoji: '🐱', sprite: kittySprite, scale: 1 },
    { id: 'vaca', nombre: 'Vaquita', emoji: '🐮', sprite: cowSprite, scale: 1 },
    { id: 'pollo', nombre: 'Pollito', emoji: '🐔', sprite: chickenSprite, scale: 1 }
  ];

  // 🤖 FUNCIÓN: Generar Objetos con Gemini - PROMPT MEJORADO
  const generarObjetosIA = async () => {
    setLoading(true);
    
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `Genera objetos para un juego educativo de privacidad digital para niños de 8-12 años.

CONTEXTO: Los niños deben aprender qué información es PRIVADA (debe protegerse) vs PÚBLICA (se puede compartir).

SEED: ${randomSeed}

Necesito 2 listas en formato JSON:

1. "buenos" (DATOS PRIVADOS - 18 items): Información que NUNCA se debe compartir en internet
   - Contraseñas y PINs
   - Datos de ubicación (dirección, escuela, ruta a casa)
   - Información familiar (nombres de padres, trabajo de padres)
   - Datos financieros (tarjetas, cuentas bancarias)
   - Fotos personales/íntimas
   - Números de teléfono
   - Conversaciones privadas
   - Datos médicos
   - Documentos de identidad

2. "malos" (DATOS PÚBLICOS - 18 items): Información que es segura compartir
   - Gustos generales (color favorito, comida favorita)
   - Información general del clima
   - Contenido viral/memes
   - Opiniones sobre películas/juegos
   - Hobbies generales
   - Nombre de mascota (sin apellido)
   - Edad general
   - Ciudad (sin dirección específica)

REGLAS:
- Usa emojis relevantes y variados
- Los nombres deben ser cortos (máximo 2-3 palabras)
- Sé creativo y específico
- Mezcla ejemplos obvios con algunos más sutiles

Responde SOLO con este JSON (sin markdown):
{
  "buenos": [{"emoji": "🔑", "nombre": "Mi Contraseña"}, {"emoji": "🏠", "nombre": "Mi Dirección"}, ...],
  "malos": [{"emoji": "🎨", "nombre": "Color Favorito"}, {"emoji": "☀️", "nombre": "El Clima"}, ...]
}`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, 
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { 
                  maxOutputTokens: 800,
                  temperature: 1.0
                }
              }),
            }
        );

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (content) {
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            const objetosGenerados = JSON.parse(cleanContent);
            
            const buenos = objetosGenerados.buenos.map(o => ({ ...o, puntos: 10, esIA: true }));
            const malos = objetosGenerados.malos.map(o => ({ ...o, puntos: 0, esIA: true }));
            
            setPoolObjetos({ buenos, malos });
        } else {
            throw new Error("No content");
        }
    } catch (error) {
        console.error("Error IA, usando fallback", error);
        // Fallback extenso
        setPoolObjetos({
            buenos: [
                { emoji: '🔑', nombre: 'Mi Contraseña', puntos: 10, esIA: false },
                { emoji: '📱', nombre: 'Mi Teléfono', puntos: 10, esIA: false },
                { emoji: '🏠', nombre: 'Mi Dirección', puntos: 10, esIA: false },
                { emoji: '📸', nombre: 'Foto Personal', puntos: 10, esIA: false },
                { emoji: '🆔', nombre: 'Mi INE/ID', puntos: 10, esIA: false },
                { emoji: '💳', nombre: 'Tarjeta Bancaria', puntos: 10, esIA: false },
                { emoji: '🔐', nombre: 'PIN del Banco', puntos: 10, esIA: false },
                { emoji: '📧', nombre: 'Mi Email', puntos: 10, esIA: false },
                { emoji: '🏫', nombre: 'Mi Escuela', puntos: 10, esIA: false },
                { emoji: '💬', nombre: 'Chat Privado', puntos: 10, esIA: false },
                { emoji: '👨‍👩‍👧', nombre: 'Nombre de Mamá', puntos: 10, esIA: false },
                { emoji: '💼', nombre: 'Trabajo de Papá', puntos: 10, esIA: false },
                { emoji: '🗺️', nombre: 'Ruta a Casa', puntos: 10, esIA: false },
                { emoji: '🏥', nombre: 'Datos Médicos', puntos: 10, esIA: false },
                { emoji: '📍', nombre: 'Ubicación GPS', puntos: 10, esIA: false }
            ],
            malos: [
                { emoji: '🎨', nombre: 'Color Favorito', puntos: 0, esIA: false },
                { emoji: '☀️', nombre: 'El Clima', puntos: 0, esIA: false },
                { emoji: '😂', nombre: 'Meme Viral', puntos: 0, esIA: false },
                { emoji: '🍕', nombre: 'Pizza Favorita', puntos: 0, esIA: false },
                { emoji: '⚽', nombre: 'Mi Deporte', puntos: 0, esIA: false },
                { emoji: '🎮', nombre: 'Juego Favorito', puntos: 0, esIA: false },
                { emoji: '🎵', nombre: 'Mi Canción', puntos: 0, esIA: false },
                { emoji: '🎬', nombre: 'Peli Favorita', puntos: 0, esIA: false },
                { emoji: '📚', nombre: 'Libro Favorito', puntos: 0, esIA: false },
                { emoji: '🐕', nombre: 'Nombre Mascota', puntos: 0, esIA: false },
                { emoji: '🌮', nombre: 'Comida Favorita', puntos: 0, esIA: false },
                { emoji: '🎤', nombre: 'Cantante Fav', puntos: 0, esIA: false },
                { emoji: '📺', nombre: 'Serie Favorita', puntos: 0, esIA: false },
                { emoji: '🦸', nombre: 'Superhéroe Fav', puntos: 0, esIA: false },
                { emoji: '🏖️', nombre: 'Lugar Favorito', puntos: 0, esIA: false }
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

  // Ir a selección de personaje
  const irASeleccion = () => {
    setPantalla('seleccion');
  };

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
  }, [pantalla]);

  // Spawner (Generar objetos cayendo)
  useEffect(() => {
    if (pantalla !== 'jugando') return;
    if (poolObjetos.buenos.length === 0 || poolObjetos.malos.length === 0) return;

    const spawnObject = () => {
      const esBueno = Math.random() > 0.35; 
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

    spawnObject();
    spawnTimerRef.current = setInterval(spawnObject, 1400);

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
  }, [pantalla, posicionJugador]);

  // Timer
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
    setTiempoRestante(120);
    generarObjetosIA(); 
  };

  const formatearTiempo = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // PANTALLA DE CARGA
  if (loading) {
      return (
        <div style={styles.loadingContainer}>
            <Loader className="animate-spin" size={64} color="#4CAF50" />
            <h2 style={styles.loadingText}>Preparando datos privados...</h2>
        </div>
      );
  }

  // PANTALLA: Intro/Instrucciones
  if (pantalla === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.introCard}>
          <div style={styles.introIconContainer}>
            <Shield size={50} color="#fff" />
          </div>
          
          <h1 style={styles.introTitle}>Lluvia de Datos</h1>
          <p style={styles.introSubtitle}>
            Aprende a proteger tu información personal en internet
          </p>

          <div style={styles.instructionsBox}>
            <h3 style={styles.instructionsTitle}>📋 Cómo jugar</h3>
            
            <div style={styles.instructionItem}>
              <div style={styles.instructionIcon}>
                <Shield size={20} color="#4CAF50" />
              </div>
              <div style={styles.instructionText}>
                <strong>Atrapa los VERDES</strong> - Son datos privados que debes proteger (contraseñas, dirección, fotos personales)
              </div>
            </div>
            
            <div style={styles.instructionItem}>
              <div style={styles.instructionIcon}>
                <Trash2 size={20} color="#f44336" />
              </div>
              <div style={styles.instructionText}>
                <strong>Evita los ROJOS</strong> - Son datos públicos que no importa compartir (color favorito, clima)
              </div>
            </div>
            
            <div style={styles.instructionItem}>
              <div style={styles.instructionIcon}>
                <Target size={20} color="#2196F3" />
              </div>
              <div style={styles.instructionText}>
                <strong>Meta:</strong> Atrapa {META_DATOS} datos privados antes de que se acabe el tiempo
              </div>
            </div>
          </div>

          <div style={styles.controlsBox}>
            <h3 style={styles.controlsTitle}>🎮 Controles</h3>
            <div style={styles.controlsGrid}>
              <div style={styles.controlItem}>
                <span style={styles.controlKey}>←</span>
                <span>Izquierda</span>
              </div>
              <div style={styles.controlItem}>
                <span style={styles.controlKey}>→</span>
                <span>Derecha</span>
              </div>
              <div style={styles.controlItem}>
                <span style={styles.controlKey}>A</span>
                <span>Izquierda</span>
              </div>
              <div style={styles.controlItem}>
                <span style={styles.controlKey}>D</span>
                <span>Derecha</span>
              </div>
            </div>
          </div>

          <div style={styles.rulesBox}>
            <div style={styles.ruleItem}>
              <Heart size={18} color="#ef4444" />
              <span>3 vidas - Pierdes una al atrapar basura</span>
            </div>
            <div style={styles.ruleItem}>
              <Clock size={18} color="#f59e0b" />
              <span>2 minutos para completar la misión</span>
            </div>
            <div style={styles.ruleItem}>
              <Star size={18} color="#fbbf24" />
              <span>+10 pts por dato protegido, -5 si se cae</span>
            </div>
          </div>

          <button style={styles.startButton} onClick={irASeleccion}>
            ¡Empezar! 🚀
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA: Selección
  if (pantalla === 'seleccion') {
    return (
      <div style={styles.container}>
        <div style={styles.seleccionCard}>
          <h2 style={styles.seleccionTitle}>Elige tu protector</h2>
          <p style={styles.seleccionSubtitle}>¿Quién te ayudará a proteger tus datos?</p>
          
          <div style={styles.personajesGrid}>
            {personajes.map(p => (
              <div 
                key={p.id} 
                style={styles.tarjetaPersonaje} 
                onClick={() => seleccionarPersonaje(p)}
              >
                <img 
                  src={p.sprite} 
                  alt={p.nombre} 
                  style={styles.personajeImg} 
                />
                <p style={styles.nombrePersonaje}>
                  {p.emoji} {p.nombre}
                </p>
              </div>
            ))}
          </div>
          
          <button 
            style={styles.backButton} 
            onClick={() => setPantalla('intro')}
          >
            ← Volver a instrucciones
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA: Jugando
  if (pantalla === 'jugando') {
    return (
      <div style={styles.gameContainer}>
        {/* Header mejorado */}
        <div style={styles.gameHeader}>
          <div style={styles.headerStat}>
            <Clock size={20} color="#f59e0b" />
            <span style={styles.headerStatText}>{formatearTiempo(tiempoRestante)}</span>
          </div>
          
          <div style={styles.headerStat}>
            <div style={styles.livesContainer}>
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={20} 
                  color={i < vidas ? '#ef4444' : '#374151'} 
                  fill={i < vidas ? '#ef4444' : 'none'}
                />
              ))}
            </div>
          </div>
          
          <div style={styles.headerStat}>
            <Target size={20} color="#10b981" />
            <span style={styles.headerStatText}>{datosAtrapados}/{META_DATOS}</span>
          </div>
          
          <div style={styles.headerStat}>
            <Star size={20} color="#fbbf24" fill="#fbbf24" />
            <span style={styles.headerStatText}>{puntos}</span>
          </div>
        </div>

        {/* Área de juego */}
        <div style={{
          ...styles.areaJuego, 
          backgroundImage: `url(${fondoJuego})`, 
          backgroundSize: 'cover'
        }}>
          {objetosCayendo.map((obj) => (
            <div key={obj.id} style={{
                ...styles.objetoCayendo,
                left: `${obj.x}px`, 
                top: `${obj.y}px`,
                backgroundColor: obj.esBueno ? '#dcfce7' : '#fee2e2',
                borderColor: obj.esBueno ? '#22c55e' : '#ef4444',
              }}>
              <span style={styles.objetoEmoji}>{obj.emoji}</span>
              <span style={{
                ...styles.objetoTexto,
                color: obj.esBueno ? '#166534' : '#991b1b'
              }}>{obj.nombre}</span>
            </div>
          ))}

          {/* Jugador */}
          {personajeSeleccionado && (
            <div style={{
                position: 'absolute', 
                left: `${posicionJugador}px`, 
                bottom: '20px',
                width: `${TAMANO_JUGADOR}px`, 
                height: `${TAMANO_JUGADOR}px`, 
                transition: 'left 0.08s linear'
              }}>
              <img 
                src={personajeSeleccionado.sprite} 
                alt="Jugador" 
                style={{width:'100%', height:'100%', objectFit:'contain'}} 
              />
            </div>
          )}
          
          {/* Leyenda */}
          <div style={styles.legend}>
            <span style={styles.legendGood}>🟢 Proteger</span>
            <span style={styles.legendBad}>🔴 Evitar</span>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Victoria/Derrota
  if (pantalla === 'victoria' || pantalla === 'derrota') {
      const esVictoria = pantalla === 'victoria';
      return (
        <div style={styles.container}>
          <div style={styles.finalCard}>
            <div style={{
              ...styles.finalIcon,
              background: esVictoria 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            }}>
              {esVictoria ? '🏆' : '💪'}
            </div>
            
            <h1 style={{
              ...styles.finalTitle,
              color: esVictoria ? '#10b981' : '#f59e0b'
            }}>
                {esVictoria ? '¡Victoria!' : '¡Buen intento!'}
            </h1>
            
            <p style={styles.finalMessage}>
              {esVictoria 
                ? '¡Excelente! Protegiste tus datos privados como un experto.' 
                : 'Recuerda: los datos privados siempre deben protegerse.'}
            </p>
            
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <Star size={32} color="#fbbf24" />
                <span style={styles.statValue}>{puntos}</span>
                <span style={styles.statLabel}>Puntos</span>
              </div>
              <div style={styles.statBox}>
                <Shield size={32} color="#10b981" />
                <span style={styles.statValue}>{datosAtrapados}</span>
                <span style={styles.statLabel}>Protegidos</span>
              </div>
              <div style={styles.statBox}>
                <Heart size={32} color="#ef4444" />
                <span style={styles.statValue}>{vidas}</span>
                <span style={styles.statLabel}>Vidas</span>
              </div>
            </div>
            
            <div style={styles.finalButtons}>
              <button style={styles.primaryButton} onClick={reiniciar}>
                🔄 Jugar de nuevo
              </button>
              <button style={styles.secondaryButton} onClick={() => navigate('/menu-juegos')}>
                🏠 Volver al menú
              </button>
            </div>
          </div>
        </div>
      );
  }

  return null;
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: 'white',
    marginTop: '20px',
    fontSize: '18px'
  },
  
  // Intro
  introCard: {
    background: 'white',
    borderRadius: '25px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  introIconContainer: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 10px 30px rgba(76,175,80,0.4)'
  },
  introTitle: {
    fontSize: '28px',
    color: '#1f2937',
    marginBottom: '8px',
    fontWeight: '800'
  },
  introSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '25px'
  },
  instructionsBox: {
    background: '#f3f4f6',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  instructionsTitle: {
    fontSize: '16px',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  instructionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  },
  instructionIcon: {
    width: '36px',
    height: '36px',
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  instructionText: {
    fontSize: '13px',
    color: '#4b5563',
    lineHeight: 1.4
  },
  controlsBox: {
    marginBottom: '20px'
  },
  controlsTitle: {
    fontSize: '14px',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: 'bold'
  },
  controlsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  controlItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#6b7280'
  },
  controlKey: {
    background: '#e5e7eb',
    padding: '6px 10px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  rulesBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: '#6b7280'
  },
  startButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 4px 15px rgba(76,175,80,0.4)'
  },
  
  // Selección
  seleccionCard: {
    background: 'white',
    borderRadius: '25px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  seleccionTitle: {
    fontSize: '24px',
    color: '#1f2937',
    marginBottom: '8px',
    fontWeight: 'bold'
  },
  seleccionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '25px'
  },
  personajesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  tarjetaPersonaje: {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '3px solid transparent'
  },
  personajeImg: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    marginBottom: '10px'
  },
  nombrePersonaje: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  backButton: {
    background: 'transparent',
    color: '#6b7280',
    fontSize: '14px',
    padding: '10px',
    border: 'none',
    cursor: 'pointer'
  },
  
  // Juego
  gameContainer: {
    minHeight: '100vh',
    background: '#1f2937',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif"
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.95)',
    padding: '12px 20px',
    borderRadius: '15px',
    marginBottom: '15px',
    maxWidth: '1000px',
    margin: '0 auto 15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  headerStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerStatText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  livesContainer: {
    display: 'flex',
    gap: '4px'
  },
  areaJuego: {
    width: '100%',
    maxWidth: '1000px',
    height: '650px',
    position: 'relative',
    backgroundColor: '#87CEEB',
    borderRadius: '15px',
    overflow: 'hidden',
    margin: '0 auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  objetoCayendo: {
    position: 'absolute',
    width: '85px',
    padding: '8px 5px',
    borderRadius: '10px',
    border: '3px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  objetoEmoji: {
    fontSize: '24px'
  },
  objetoTexto: {
    fontSize: '9px',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 1.2
  },
  legend: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(255,255,255,0.9)',
    padding: '8px 12px',
    borderRadius: '8px',
    display: 'flex',
    gap: '15px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  legendGood: {
    color: '#166534'
  },
  legendBad: {
    color: '#991b1b'
  },
  
  // Final
  finalCard: {
    background: 'white',
    borderRadius: '25px',
    padding: '30px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  finalIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  finalTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  finalMessage: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '25px'
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '25px'
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f3f4f6',
    padding: '15px 20px',
    borderRadius: '12px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '8px 0 4px'
  },
  statLabel: {
    fontSize: '11px',
    color: '#6b7280'
  },
  finalButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '15px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(76,175,80,0.4)'
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '15px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(59,130,246,0.4)'
  }
};

export default JuegoTesoroPrivacidad;