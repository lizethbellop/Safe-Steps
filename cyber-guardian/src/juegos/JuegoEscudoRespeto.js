import React, { useState } from 'react';
import { Shield, Heart, Star, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import { usePerfil } from '../PerfilContext';
import { useNavigate } from 'react-router-dom';

const GAME_CONSTANTS = {
  MAX_SCENARIOS: 5,
  INITIAL_LIVES: 3,
  SCORE_PER_CORRECT_ANSWER: 100,
  
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY, 
  GEMINI_MODEL: 'gemini-2.0-flash',
};

const JuegoEscudoRespeto = () => {
  const { perfilActivo, actualizarPuntos} = usePerfil();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioCount, setScenarioCount] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONSTANTS.INITIAL_LIVES);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [puntosGuardados, setPuntosGuardados] = useState(false);

  const generateScenario = async () => {
    setLoading(true);
    
    // Temas más específicos y variados
    const temas = [
      'ciberacoso_grupal', 'ciberacoso_individual', 'sexting_presion', 'sexting_compartir',
      'grooming_regalos', 'grooming_secretos', 'bullying_exclusion', 'bullying_burlas',
      'phishing_premio', 'robo_cuenta', 'contenido_inapropiado', 'presion_social'
    ];
    
    // Plataformas reales que usan los niños
    const plataformas = [
      'WhatsApp', 'TikTok', 'Instagram', 'Roblox', 'Discord', 'Fortnite',
      'Minecraft', 'YouTube', 'Snapchat', 'Twitch', 'BeReal', 'Telegram'
    ];
    
    // Contextos específicos
    const contextos = [
      'grupo de clase', 'juego en línea', 'red social', 'chat privado',
      'stream en vivo', 'comentarios de video', 'servidor de Discord', 'grupo de fans'
    ];
    
    // Personajes/situaciones
    const personajes = [
      'alguien que dice tener tu edad', 'un "amigo" de internet', 'alguien popular de tu escuela',
      'una persona que dice ser moderador', 'alguien que dice ser YouTuber famoso',
      'un compañero de clase', 'alguien que conociste jugando', 'una cuenta verificada falsa'
    ];

    const temaRandom = temas[Math.floor(Math.random() * temas.length)];
    const plataformaRandom = plataformas[Math.floor(Math.random() * plataformas.length)];
    const contextoRandom = contextos[Math.floor(Math.random() * contextos.length)];
    const personajeRandom = personajes[Math.floor(Math.random() * personajes.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `Crea un escenario educativo de seguridad digital para niños de 8-12 años.

DATOS DEL ESCENARIO:
- Tema principal: ${temaRandom}
- Plataforma: ${plataformaRandom}
- Contexto: ${contextoRandom}
- Personaje involucrado: ${personajeRandom}
- Seed: ${randomSeed}

INSTRUCCIONES:
- La situación debe ser REALISTA y específica (mencionar la plataforma)
- Usa lenguaje que usan los niños (ej: "te dejó en visto", "subió una historia", "te etiquetó")
- La situación debe tener tensión emocional pero ser apropiada para la edad
- UNA SOLA opción debe ser correcta
- Las opciones incorrectas deben ser tentadoras pero claramente malas al reflexionar
- El feedback debe ser educativo y empático

${temaRandom.includes('ciberacoso') ? `
ENFOQUE CIBERACOSO:
- Incluir situaciones de exclusión, rumores, capturas de pantalla compartidas
- Mostrar presión de grupo
- Enseñar a no ser espectador pasivo
` : ''}

${temaRandom.includes('sexting') ? `
ENFOQUE SEXTING:
- Presión para enviar fotos (sin ser explícito)
- Chantaje emocional ("si me quieres...")
- Consecuencias de compartir imágenes de otros
` : ''}

${temaRandom.includes('grooming') ? `
ENFOQUE GROOMING:
- Adulto haciéndose pasar por menor
- Ofrece regalos, dinero, fama
- Pide secretos o que no cuente a padres
- Intenta aislar al niño
` : ''}

${temaRandom.includes('bullying') ? `
ENFOQUE BULLYING:
- Burlas por apariencia, gustos, o habilidades
- Exclusión de grupos
- Apodos hirientes
- Presión para unirse a las burlas
` : ''}

${temaRandom.includes('phishing') || temaRandom.includes('robo') ? `
ENFOQUE SEGURIDAD DE CUENTAS:
- Mensajes falsos de "ganaste un premio"
- Peticiones de contraseña
- Links sospechosos
- Cuentas hackeadas
` : ''}

Responde SOLO con este JSON (sin markdown):
{
  "situacion": "Descripción detallada y realista de la situación (3-4 oraciones, menciona la plataforma específica)",
  "tema": "${temaRandom}",
  "plataforma": "${plataformaRandom}",
  "opciones": [
    {
      "texto": "Opción 1 (tentadora pero incorrecta)",
      "correcta": false,
      "feedback": "Explicación empática de por qué está mal y qué podría pasar (2-3 oraciones)"
    },
    {
      "texto": "Opción 2 (la correcta)",
      "correcta": true,
      "feedback": "Refuerzo positivo y explicación de por qué es la mejor decisión (2-3 oraciones)"
    },
    {
      "texto": "Opción 3 (incorrecta pero comprensible)",
      "correcta": false,
      "feedback": "Explicación de por qué no es suficiente y qué debería hacer en su lugar (2-3 oraciones)"
    }
  ]
}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GAME_CONSTANTS.GEMINI_MODEL}:generateContent?key=${GAME_CONSTANTS.GEMINI_API_KEY}`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
              maxOutputTokens: 600,
              temperature: 1.2
            }
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) throw new Error("No content received from Gemini API.");

      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const scenario = JSON.parse(cleanContent);
      
      scenario.generadoPorIA = true;
      
      setCurrentScenario(scenario);
      setScenarioCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generando escenario:', error);
      
      const fallbackScenarios = [
        {
          situacion: "Estás en un servidor de Discord de tu juego favorito. Alguien que dice tener 12 años te manda mensaje privado diciendo que puede darte skins gratis de Fortnite. Solo necesita que le pases tu usuario y contraseña de Epic Games, y que no le cuentes a nadie porque es un 'truco secreto'.",
          tema: "grooming_regalos",
          plataforma: "Discord",
          opciones: [
            { texto: "Le doy mis datos porque quiero las skins gratis", correcta: false, feedback: "¡Nunca compartas tu contraseña! Las skins gratis no existen así. Esta persona probablemente es un adulto que quiere robarte la cuenta o hacerte daño. Perderías todo tu progreso y dinero invertido." },
            { texto: "No le doy nada, lo bloqueo y le cuento a mis papás", correcta: true, feedback: "¡Excelente decisión! Reconociste las señales de peligro: regalos gratis + pide contraseña + quiere secretos = PELIGRO. Bloquear y contarle a un adulto es siempre lo correcto." },
            { texto: "Le digo que no pero sigo hablando con él porque es amable", correcta: false, feedback: "Aunque no le diste tus datos, mantener contacto con alguien que intentó engañarte es peligroso. Los groomers son pacientes y seguirán intentando. Lo mejor es cortar todo contacto." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "En el grupo de WhatsApp de tu salón, empezaron a circular capturas de pantalla de una conversación privada de tu compañera María donde hablaba de un chico que le gusta. Todos se están riendo y haciendo memes. Te etiquetan para que opines.",
          tema: "ciberacoso_grupal",
          plataforma: "WhatsApp",
          opciones: [
            { texto: "Me río y comparto los memes porque todos lo hacen", correcta: false, feedback: "Participar en las burlas te convierte en parte del problema. María está siendo humillada y esto puede afectarla mucho. Imagina cómo te sentirías tú si compartieran tus conversaciones privadas." },
            { texto: "No participo, salgo del grupo y le cuento a un adulto", correcta: true, feedback: "¡Muy bien! No participar es importante, pero reportarlo es aún mejor. María necesita ayuda y un adulto puede detener esto antes de que empeore. Ser valiente es hacer lo correcto aunque sea difícil." },
            { texto: "No digo nada y solo ignoro los mensajes", correcta: false, feedback: "Ignorar no detiene el acoso. María sigue siendo lastimada mientras tú miras. El silencio de los testigos permite que el bullying continúe. Necesitas actuar para ayudarla." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "Tu crush te manda un TikTok privado y te dice que le gustas mucho. Luego te pide que le mandes una foto tuya en ropa interior. Dice que él/ella ya te mandó una (aunque tú no la pediste) y que si no lo haces es porque no confías en él/ella.",
          tema: "sexting_presion",
          plataforma: "TikTok",
          opciones: [
            { texto: "Le mando la foto porque no quiero que piense que no confío", correcta: false, feedback: "Esto es chantaje emocional. Alguien que te quiere de verdad NUNCA te presionaría así. Esa foto puede terminar en internet para siempre, ser compartida con toda la escuela, o usada para chantajearte después." },
            { texto: "Le digo que no, lo bloqueo y le cuento a un adulto de confianza", correcta: true, feedback: "¡Perfecto! Decir NO es tu derecho y no tienes que dar explicaciones. Esta persona no te respeta. Bloquearla y contarle a un adulto te protege de más presión y chantaje." },
            { texto: "Le digo que no pero no lo bloqueo porque me gusta", correcta: false, feedback: "Alguien que te presiona para mandarte fotos íntimas no te quiere bien, te está manipulando. Si sigues en contacto, seguirá intentándolo. Mereces a alguien que te respete de verdad." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "Recibes un mensaje directo en Instagram de una cuenta verificada que dice ser de MrBeast. Te dice que ganaste un iPhone pero necesitas darle tu contraseña de Instagram para 'verificar que eres real' y recibir el premio.",
          tema: "phishing_premio",
          plataforma: "Instagram",
          opciones: [
            { texto: "Le doy mi contraseña porque está verificado y es MrBeast", correcta: false, feedback: "¡Es una estafa! Los verificados falsos existen y los famosos NUNCA piden contraseñas. Si das tu contraseña, perderás tu cuenta, y podrían usarla para estafar a tus amigos haciéndose pasar por ti." },
            { texto: "Ignoro el mensaje, lo reporto como spam y no doy ningún dato", correcta: true, feedback: "¡Excelente! Reconociste una estafa clásica. Ningún sorteo real pide contraseñas. Reportar ayuda a que Instagram cierre esas cuentas falsas y proteja a otros." },
            { texto: "Le pido más pruebas de que es real antes de darle mis datos", correcta: false, feedback: "Los estafadores son expertos en dar 'pruebas' falsas. No importa qué tan convincentes parezcan, NUNCA debes dar tu contraseña a nadie. La única respuesta segura es ignorar y reportar." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "En Roblox conociste a alguien que dice tener tu edad y se ha vuelto tu 'mejor amigo'. Llevan semanas hablando todos los días. Ahora te dice que quiere conocerte en persona y te pide que no le cuentes a tus papás porque 'no van a entender su amistad'.",
          tema: "grooming_secretos",
          plataforma: "Roblox",
          opciones: [
            { texto: "Acepto verlo porque ya lo conozco bien y es mi amigo", correcta: false, feedback: "¡Peligro! No importa cuánto hayas hablado, NO conoces a esta persona en realidad. Puede ser un adulto mintiendo sobre su edad. Pedir secretos y encuentros es una señal grave de grooming." },
            { texto: "Le digo que no puedo verlo y le cuento todo a mis papás", correcta: true, feedback: "¡Muy bien! Reconociste las señales de peligro. Alguien que te pide secretos y quiere verte a escondidas tiene malas intenciones. Tus papás pueden ayudarte a mantenerte seguro." },
            { texto: "Le digo que no a la reunión pero sigo siendo su amigo en el juego", correcta: false, feedback: "Esta persona ya mostró intenciones peligrosas. Aunque no lo veas en persona, seguir hablando le permite seguir manipulándote. Necesitas cortar contacto y contarle a un adulto todo lo que pasó." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "En el grupo de tu equipo de fútbol en WhatsApp, empezaron a burlarse de Carlos porque falló un penal. Le pusieron un apodo cruel y están haciendo stickers con su cara. Tú también estás en el grupo.",
          tema: "bullying_burlas",
          plataforma: "WhatsApp",
          opciones: [
            { texto: "Me río y uso los stickers porque es solo una broma", correcta: false, feedback: "Para ti es 'broma' pero para Carlos es humillación. Los apodos crueles y burlas constantes son bullying y pueden causarle mucho daño emocional. Participar te hace parte del problema." },
            { texto: "Defiendo a Carlos en el grupo y le aviso al entrenador", correcta: true, feedback: "¡Excelente! Se necesita valor para defender a alguien. Avisarle al entrenador ayuda a que esto pare. Los verdaderos equipos se apoyan, no se burlan de los errores." },
            { texto: "No participo pero tampoco digo nada", correcta: false, feedback: "Tu silencio permite que el acoso continúe. Carlos necesita que alguien lo defienda. Cuando nadie dice nada, los acosadores sienten que está bien lo que hacen." }
          ],
          generadoPorIA: false
        }
      ];
      
      setCurrentScenario(fallbackScenarios[Math.floor(Math.random() * fallbackScenarios.length)]);
      setScenarioCount(prev => prev + 1);
    }
    
    setLoading(false);
  };

  const handleChoice = (option) => {
    setShowFeedback(true);
    setFeedbackData(option);
    
    if (option.correcta) {
      setScore(prev => prev + GAME_CONSTANTS.SCORE_PER_CORRECT_ANSWER);
    } else {
      setLives(prev => prev - 1);
    }
  };

  const nextScenario = () => {
    setShowFeedback(false);
    setFeedbackData(null);
    
    if (lives <= 0 || scenarioCount >= GAME_CONSTANTS.MAX_SCENARIOS) {
      if (!puntosGuardados) {
        const puntosTotales = (perfilActivo?.puntos || 0) + score;
        actualizarPuntos(puntosTotales);
        setPuntosGuardados(true);
      }
      setGameState('end');
    } else {
      generateScenario();
    }
  };

  const restartGame = () => {
    setGameState('intro');
    setCurrentScenario(null);
    setScenarioCount(0);
    setScore(0);
    setLives(GAME_CONSTANTS.INITIAL_LIVES);
    setShowFeedback(false);
    setFeedbackData(null);
    setPuntosGuardados(false);
  };

  const startGame = () => {
    setGameState('playing');
    generateScenario();
  };

  // Función para obtener emoji del tema
  const getTopicEmoji = (tema) => {
    if (!tema) return '🛡️';
    if (tema.includes('ciberacoso') || tema.includes('bullying')) return '😢';
    if (tema.includes('sexting')) return '📵';
    if (tema.includes('grooming')) return '⚠️';
    if (tema.includes('phishing') || tema.includes('robo')) return '🎣';
    return '🛡️';
  };

  // Función para obtener nombre legible del tema
  const getTopicName = (tema) => {
    if (!tema) return 'Seguridad Digital';
    if (tema.includes('ciberacoso')) return 'Ciberacoso';
    if (tema.includes('bullying')) return 'Bullying';
    if (tema.includes('sexting')) return 'Sexting';
    if (tema.includes('grooming')) return 'Grooming';
    if (tema.includes('phishing')) return 'Phishing';
    if (tema.includes('robo')) return 'Robo de Cuenta';
    return 'Seguridad Digital';
  };

  if (loading && !currentScenario) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <Loader className="animate-spin" size={64} color="#fff" />
          <p style={styles.loadingText}>Preparando escenario...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.centerContent}>
            <div style={styles.iconContainer}>
              <Shield size={60} color="#fff" />
            </div>
            <h1 style={styles.title}>Escudo del Respeto</h1>
            <p style={styles.subtitle}>
              Aprende a protegerte en internet. Enfrentarás situaciones reales y deberás tomar la mejor decisión.
            </p>
            
            <div style={styles.rulesBox}>
              <h3 style={styles.rulesTitle}>📋 Reglas del juego</h3>
              <div style={styles.ruleItem}>
                <div style={styles.ruleIcon}>
                  <Heart size={18} color="#ef4444" />
                </div>
                <span>Tienes <strong>3 vidas</strong> - cada error resta una</span>
              </div>
              <div style={styles.ruleItem}>
                <div style={styles.ruleIcon}>
                  <Star size={18} color="#fbbf24" />
                </div>
                <span>Ganas <strong>100 puntos</strong> por respuesta correcta</span>
              </div>
              <div style={styles.ruleItem}>
                <div style={styles.ruleIcon}>
                  <Shield size={18} color="#8b5cf6" />
                </div>
                <span>Completa <strong>5 escenarios</strong> para ganar</span>
              </div>
            </div>

            <div style={styles.topicsPreview}>
              <p style={styles.topicsTitle}>Temas que verás:</p>
              <div style={styles.topicTags}>
                <span style={styles.topicTag}>😢 Ciberacoso</span>
                <span style={styles.topicTag}>📵 Sexting</span>
                <span style={styles.topicTag}>⚠️ Grooming</span>
                <span style={styles.topicTag}>🎣 Phishing</span>
              </div>
            </div>
            
            <button onClick={startGame} style={styles.startButton}>
              ¡Empezar! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    const survived = lives > 0;
    
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.centerContent}>
            <div style={{
              ...styles.iconContainer,
              background: survived 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}>
              {survived ? (
                <CheckCircle size={60} color="#fff" />
              ) : (
                <XCircle size={60} color="#fff" />
              )}
            </div>
            
            <h2 style={{...styles.endTitle, color: survived ? '#10b981' : '#ef4444'}}>
              {survived ? '¡Felicidades! 🎉' : '¡Buen intento! 💪'}
            </h2>
            
            <div style={styles.statsBox}>
              <div style={styles.statItem}>
                <Star size={36} color="#fbbf24" />
                <p style={styles.statValue}>{score}</p>
                <p style={styles.statLabel}>Puntos</p>
              </div>
              <div style={styles.statItem}>
                <Heart size={36} color="#ef4444" />
                <p style={styles.statValue}>{lives}</p>
                <p style={styles.statLabel}>Vidas</p>
              </div>
              <div style={styles.statItem}>
                <CheckCircle size={36} color="#10b981" />
                <p style={styles.statValue}>{score / 100}</p>
                <p style={styles.statLabel}>Correctas</p>
              </div>
            </div>
            
            <div style={styles.messageBox}>
              <p style={styles.endMessage}>
                {survived 
                  ? '¡Excelente trabajo! Demostraste que sabes identificar situaciones peligrosas en internet.' 
                  : 'Recuerda: ante cualquier situación incómoda en internet, siempre puedes hablar con un adulto de confianza.'}
              </p>
            </div>
            
            <button onClick={restartGame} style={styles.primaryButton}>
              🔄 Jugar de nuevo
            </button>
            <button onClick={() => navigate('/menu-juegos')} style={styles.secondaryButton}>
              🏠 Volver al menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentScenario) return null;

  return (
    <div style={styles.container}>
      {/* Header con stats */}
      <div style={styles.header}>
        <div style={styles.livesContainer}>
          {[...Array(GAME_CONSTANTS.INITIAL_LIVES)].map((_, i) => (
            <Heart 
              key={i} 
              size={24} 
              color={i < lives ? '#ef4444' : '#374151'} 
              fill={i < lives ? '#ef4444' : 'none'}
            />
          ))}
        </div>
        
        <div style={styles.progressContainer}>
          <span style={styles.progressText}>{scenarioCount}/{GAME_CONSTANTS.MAX_SCENARIOS}</span>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${(scenarioCount / GAME_CONSTANTS.MAX_SCENARIOS) * 100}%`
            }} />
          </div>
        </div>
        
        <div style={styles.scoreContainer}>
          <Star size={20} color="#fbbf24" fill="#fbbf24" />
          <span style={styles.scoreText}>{score}</span>
        </div>
      </div>

      <div style={styles.card}>
        {!showFeedback ? (
          <>
            {/* Badge del tema */}
            <div style={styles.topicBadge}>
              <span>{getTopicEmoji(currentScenario.tema)}</span>
              <span>{getTopicName(currentScenario.tema)}</span>
              {currentScenario.plataforma && (
                <span style={styles.platformBadge}>{currentScenario.plataforma}</span>
              )}
            </div>

            {/* Situación */}
            <div style={styles.scenarioBox}>
              <p style={styles.scenarioText}>{currentScenario.situacion}</p>
            </div>

            <h3 style={styles.questionTitle}>¿Qué harías tú? 🤔</h3>
            
            {/* Opciones */}
            <div style={styles.optionsContainer}>
              {currentScenario.opciones.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option)}
                  style={styles.optionButton}
                >
                  <span style={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                  <span style={styles.optionText}>{option.texto}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.centerContent}>
            <div style={{
              ...styles.feedbackIcon,
              background: feedbackData.correcta 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}>
              {feedbackData.correcta ? (
                <CheckCircle size={50} color="#fff" />
              ) : (
                <XCircle size={50} color="#fff" />
              )}
            </div>
            
            <h3 style={{
              ...styles.feedbackTitle, 
              color: feedbackData.correcta ? '#10b981' : '#ef4444'
            }}>
              {feedbackData.correcta ? '¡Correcto! 🎉' : '¡Cuidado! 😢'}
            </h3>
            
            <div style={styles.feedbackBox}>
              <p style={styles.feedbackText}>{feedbackData.feedback}</p>
            </div>
            
            {!feedbackData.correcta && lives <= 1 && (
              <div style={styles.warningBox}>
                <AlertTriangle size={20} color="#f59e0b" />
                <span>¡Era tu última vida!</span>
              </div>
            )}
            
            <button onClick={nextScenario} style={styles.continueButton}>
              {scenarioCount >= GAME_CONSTANTS.MAX_SCENARIOS || lives <= (feedbackData.correcta ? 0 : 1)
                ? 'Ver resultados' 
                : 'Siguiente escenario'
              } ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.95)',
    padding: '12px 20px',
    borderRadius: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '500px'
  },
  livesContainer: {
    display: 'flex',
    gap: '4px'
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  progressText: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#6b7280'
  },
  progressBar: {
    width: '80px',
    height: '6px',
    background: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  scoreText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  card: {
    background: 'white',
    borderRadius: '25px',
    padding: '25px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px'
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  iconContainer: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    padding: '20px',
    borderRadius: '50%',
    marginBottom: '20px',
    boxShadow: '0 10px 30px rgba(139,92,246,0.4)'
  },
  title: {
    fontSize: '28px',
    color: '#1f2937',
    marginBottom: '10px',
    fontWeight: '800'
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    marginBottom: '25px',
    lineHeight: 1.6
  },
  rulesBox: {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    width: '100%'
  },
  rulesTitle: {
    fontSize: '16px',
    color: '#1f2937',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#4b5563'
  },
  ruleIcon: {
    width: '32px',
    height: '32px',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  topicsPreview: {
    marginBottom: '20px',
    width: '100%'
  },
  topicsTitle: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '10px'
  },
  topicTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center'
  },
  topicTag: {
    background: '#ede9fe',
    color: '#7c3aed',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  startButton: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px 40px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
    width: '100%'
  },
  topicBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#7c3aed'
  },
  platformBadge: {
    background: '#e0e7ff',
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    marginLeft: 'auto'
  },
  scenarioBox: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    borderLeft: '4px solid #8b5cf6'
  },
  scenarioText: {
    fontSize: '15px',
    color: '#1f2937',
    lineHeight: 1.7,
    margin: 0
  },
  questionTitle: {
    fontSize: '18px',
    color: '#7c3aed',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  optionButton: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    width: '100%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    fontSize: '14px',
    padding: '15px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 0 #1d4ed8',
    transition: 'transform 0.1s'
  },
  optionLetter: {
    background: 'rgba(255,255,255,0.2)',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    flexShrink: 0
  },
  optionText: {
    flex: 1,
    lineHeight: 1.4
  },
  feedbackIcon: {
    padding: '15px',
    borderRadius: '50%',
    marginBottom: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  feedbackTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  feedbackBox: {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    width: '100%'
  },
  feedbackText: {
    fontSize: '14px',
    color: '#1f2937',
    lineHeight: 1.6,
    margin: 0
  },
  warningBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef3c7',
    color: '#92400e',
    padding: '10px 15px',
    borderRadius: '10px',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '600'
  },
  continueButton: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
    width: '100%'
  },
  endTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  statsBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '20px',
    width: '100%'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#7c3aed',
    margin: '8px 0 4px 0'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0
  },
  messageBox: {
    background: '#f3f4f6',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    width: '100%'
  },
  endMessage: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
    lineHeight: 1.6
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '15px',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
    width: '100%',
    marginBottom: '10px'
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
    boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
    width: '100%'
  },
  loadingText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px'
  }
};

export default JuegoEscudoRespeto;