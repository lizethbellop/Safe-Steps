import React, { useState, useEffect } from 'react';
import { Shield, Heart, Star, CheckCircle, XCircle, Loader } from 'lucide-react';
import { usePerfil } from '../PerfilContext';

const GAME_CONSTANTS = {
  MAX_SCENARIOS: 5,
  INITIAL_LIVES: 3,
  SCORE_PER_CORRECT_ANSWER: 100,
  TOPICS: ['bullying', 'ciberacoso', 'sexting', 'grooming'],
  
  GEMINI_API_KEY: 'AIzaSyA3EQMAn-Qa26125Mjm3qCBt4fUeJrZmD4', 
  GEMINI_MODEL: 'gemini-1.5-flash',
};

const JuegoEscudoRespeto = () => {
  const { perfilActivo, actualizarPuntos } = usePerfil();

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
    const topic = GAME_CONSTANTS.TOPICS[Math.floor(Math.random() * GAME_CONSTANTS.TOPICS.length)];
    
    const prompt = `Eres un experto en educación infantil y seguridad digital. Crea un escenario de juego educativo para niños de 8-12 años sobre ${topic}.

El escenario debe:
- Ser una situación realista que un niño podría enfrentar en internet o redes sociales
- Ser apropiado para la edad (sin contenido explícito, pero realista)
- Tener un tono amigable pero serio sobre el tema
- Incluir 3 opciones de respuesta donde SOLO UNA sea la correcta

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON válido y nada más. No uses markdown.
{
  "situacion": "Descripción de la situación (2-3 oraciones)",
  "tema": "${topic}",
  "opciones": [
    {
      "texto": "Opción 1",
      "correcta": false,
      "feedback": "Explicación amigable de por qué está mal (2 oraciones)"
    },
    {
      "texto": "Opción 2",
      "correcta": true,
      "feedback": "Explicación positiva de por qué está bien (2 oraciones)"
    },
    {
      "texto": "Opción 3",
      "correcta": false,
      "feedback": "Explicación amigable de por qué está mal (2 oraciones)"
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
            generationConfig: { maxOutputTokens: 500 }
          }),
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) throw new Error("No content received from Gemini API.");

      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const scenario = JSON.parse(cleanContent);
      
      // ✅ MARCA DE IA
      scenario.generadoPorIA = true;
      
      setCurrentScenario(scenario);
      setScenarioCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generando escenario:', error);
      
      const fallbackScenarios = [
        {
          situacion: "Estás chateando con alguien que conociste en un juego online. Esta persona te dice que tiene tu edad y quiere ser tu amigo. Te pide que le envíes fotos tuyas y tu número de teléfono.",
          tema: "grooming",
          opciones: [
            { texto: "Le envío las fotos y mi número porque parece buena onda", correcta: false, feedback: "¡Alto! Nunca compartas fotos personales o tu teléfono con desconocidos. Las personas en internet no siempre son quienes dicen ser." },
            { texto: "No le doy nada y le cuento a un adulto de confianza", correcta: true, feedback: "¡Perfecto! Esa es la mejor decisión. Cuando alguien desconocido te pide información personal, siempre es mejor no compartir nada y hablar con un adulto." },
            { texto: "Le envío fotos de mis mascotas en lugar de mías", correcta: false, feedback: "Aunque no enviaste tus fotos, mantener la conversación con desconocidos que piden este tipo de cosas es arriesgado. Lo mejor es cortar el contacto." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "Un compañero de clase creó un grupo de WhatsApp donde están compartiendo memes burlándose de otro estudiante. Te invitaron al grupo.",
          tema: "bullying",
          opciones: [
            { texto: "Me uno al grupo y comparto los memes porque todos lo hacen", correcta: false, feedback: "Participar en burlas hace que el problema sea peor. Aunque todos lo hagan, no está bien y puede lastimar mucho a la otra persona." },
            { texto: "No me uno y le digo a un adulto lo que está pasando", correcta: true, feedback: "¡Excelente decisión! No participar en el bullying y reportarlo es lo correcto. Así ayudas a detener una situación dañina." },
            { texto: "Me uno pero no comparto nada, solo veo los memes", correcta: false, feedback: "Ver sin hacer nada también es ser parte del problema. El bullying se detiene cuando alguien tiene el valor de no participar y reportarlo." }
          ],
          generadoPorIA: false
        },
        {
          situacion: "Tu crush te manda un mensaje diciendo que le gustas mucho y te pide que le envíes una foto tuya sin ropa. Dice que si no lo haces, ya no te va a hablar.",
          tema: "sexting",
          opciones: [
            { texto: "Le envío la foto porque no quiero que se enoje", correcta: false, feedback: "¡Nunca! Nadie que realmente te quiera te presionaría así. Esto es chantaje y las fotos pueden terminar en manos de muchas personas." },
            { texto: "Le digo que no y bloqueo a esa persona", correcta: true, feedback: "¡Perfecto! Decir NO es tu derecho. Alguien que te presiona así no te respeta. Bloquearlo y contarle a un adulto es lo más seguro." },
            { texto: "Le envío la foto pero le pido que la borre después", correcta: false, feedback: "Una vez que envías una foto, pierdes el control de ella. Puede ser guardada, compartida o usada para hacerte daño. Nunca envíes ese tipo de fotos." }
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

  if (loading && !currentScenario) {
    return (
      <div style={styles.container}>
        <div style={styles.centerContent}>
          <Loader className="animate-spin" size={64} color="#8b5cf6" />
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
            <Shield size={80} color="#8b5cf6" style={{marginBottom: 20}} />
            <h1 style={styles.title}>🛡️ Escudo del Respeto</h1>
            <p style={styles.subtitle}>¡Aprende a protegerte en línea! Enfrentarás diferentes situaciones y deberás elegir la mejor respuesta.</p>
            
            <div style={styles.rulesBox}>
              <h3 style={styles.rulesTitle}>Reglas del juego:</h3>
              <div style={styles.ruleItem}>
                <Heart size={20} color="#ef4444" />
                <span>Tienes <strong>3 vidas</strong></span>
              </div>
              <div style={styles.ruleItem}>
                <Star size={20} color="#fbbf24" />
                <span>Cada respuesta correcta suma <strong>100 puntos</strong></span>
              </div>
              <div style={styles.ruleItem}>
                <Shield size={20} color="#8b5cf6" />
                <span>Completa <strong>5 escenarios</strong> para terminar</span>
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
            {survived ? (
              <CheckCircle size={100} color="#10b981" style={{marginBottom: 20}} />
            ) : (
              <XCircle size={100} color="#ef4444" style={{marginBottom: 20}} />
            )}
            
            <h2 style={{...styles.endTitle, color: survived ? '#10b981' : '#ef4444'}}>
              {survived ? '¡Felicidades! 🎉' : '¡Buen intento! 💪'}
            </h2>
            
            <div style={styles.statsBox}>
              <div style={styles.statItem}>
                <Star size={40} color="#fbbf24" />
                <p style={styles.statValue}>{score}</p>
                <p style={styles.statLabel}>Puntos</p>
              </div>
              <div style={styles.statItem}>
                <Heart size={40} color="#ef4444" />
                <p style={styles.statValue}>{lives}</p>
                <p style={styles.statLabel}>Vidas</p>
              </div>
            </div>
            
            <p style={styles.endMessage}>
              {survived 
                ? '¡Excelente trabajo! Demostraste que sabes cómo protegerte en línea.' 
                : 'Recuerda siempre pedir ayuda a un adulto de confianza cuando algo no se sienta bien.'}
            </p>
            
            <button onClick={restartGame} style={styles.button}>
              🔄 Jugar de nuevo
            </button>
            <button onClick={() => window.location.href = '/menu-juegos'} style={{...styles.button, background: '#3b82f6', marginTop: 10}}>
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
      <div style={styles.header}>
        <div style={styles.statDisplay}>
          <Heart size={24} color="#ef4444" />
          <span style={styles.statText}>x{lives}</span>
        </div>
        
        <div style={styles.statDisplay}>
          <Shield size={24} color="#8b5cf6" />
          <span style={styles.statText}>{scenarioCount}/{GAME_CONSTANTS.MAX_SCENARIOS}</span>
        </div>
        
        <div style={styles.statDisplay}>
          <Star size={24} color="#fbbf24" />
          <span style={styles.statText}>{score}</span>
        </div>
      </div>

      <div style={styles.card}>
        {!showFeedback ? (
          <>
            <div style={styles.scenarioBox}>
              <p style={styles.scenarioText}>{currentScenario.situacion}</p>
            </div>

            <h3 style={styles.questionTitle}>¿Qué harías? 🤔</h3>
            
            {currentScenario.opciones.map((option, index) => (
              <button
                key={index}
                onClick={() => handleChoice(option)}
                style={styles.optionButton}
              >
                <span style={styles.optionLetter}>{String.fromCharCode(65 + index)})</span>
                {option.texto}
              </button>
            ))}
          </>
        ) : (
          <div style={styles.centerContent}>
            {feedbackData.correcta ? (
              <CheckCircle size={80} color="#10b981" style={{marginBottom: 20}} />
            ) : (
              <XCircle size={80} color="#ef4444" style={{marginBottom: 20}} />
            )}
            
            <h3 style={{...styles.feedbackTitle, color: feedbackData.correcta ? '#10b981' : '#ef4444'}}>
              {feedbackData.correcta ? '¡Correcto! 🎉' : '¡Ups! 😢'}
            </h3>
            
            <div style={styles.feedbackBox}>
              <p style={styles.feedbackText}>{feedbackData.feedback}</p>
            </div>
            
            <button onClick={nextScenario} style={styles.button}>
              Continuar ➡️
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
    justifyContent: 'space-around',
    background: 'rgba(255,255,255,0.95)',
    padding: '15px',
    borderRadius: '15px',
    marginBottom: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '600px'
  },
  statDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  card: {
    background: 'white',
    borderRadius: '25px',
    padding: '30px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '600px'
  },
  centerContent: {
    textAlign: 'center'
  },
  title: {
    fontSize: '36px',
    color: '#8b5cf6',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
    lineHeight: 1.6
  },
  rulesBox: {
    background: '#f0f9ff',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '30px',
    textAlign: 'left'
  },
  rulesTitle: {
    fontSize: '20px',
    color: '#3b82f6',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#333'
  },
  startButton: {
    background: '#8b5cf6',
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
    padding: '15px 40px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
    transition: 'transform 0.2s'
  },
  scenarioBox: {
    background: 'linear-gradient(135deg, #f3e7ff 0%, #e9d5ff 100%)',
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px'
  },
  scenarioText: {
    fontSize: '18px',
    color: '#333',
    lineHeight: 1.8,
    margin: 0
  },
  questionTitle: {
    fontSize: '22px',
    color: '#8b5cf6',
    marginBottom: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  optionButton: {
    width: '100%',
    background: '#3b82f6',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    padding: '18px 20px',
    border: 'none',
    borderRadius: '15px',
    marginBottom: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 3px 10px rgba(59,130,246,0.3)',
    transition: 'transform 0.2s'
  },
  optionLetter: {
    fontSize: '20px',
    marginRight: '12px',
    fontWeight: 'bold'
  },
  feedbackTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  feedbackBox: {
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '15px',
    marginBottom: '25px'
  },
  feedbackText: {
    fontSize: '16px',
    color: '#333',
    lineHeight: 1.6,
    margin: 0
  },
  button: {
    background: '#8b5cf6',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '15px 35px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
    width: '100%'
  },
  endTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '25px'
  },
  statsBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    background: 'linear-gradient(135deg, #f3e7ff 0%, #e9d5ff 100%)',
    padding: '25px',
    borderRadius: '15px',
    marginBottom: '25px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#8b5cf6',
    margin: '10px 0 5px 0'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  endMessage: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '25px',
    lineHeight: 1.6
  },
  loadingText: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
    marginTop: 20
  }
};

export default JuegoEscudoRespeto;