import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JuegoAldeaAmigos = ({ modoEnfoque }) => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); // intro, playing, gameover, win
  const [perfilActual, setPerfilActual] = useState(null);
  const [perfilesRestantes, setPerfilesRestantes] = useState([]);
  const [decisionesCorrectas, setDecisionesCorrectas] = useState(0);
  const [decisionesIncorrectas, setDecisionesIncorrectas] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [mostrandoResultado, setMostrandoResultado] = useState(false);

  // Base de datos de perfiles
  const perfilesBase = [
    {
      id: 1,
      nombre: 'Alex',
      avatar: '🧑',
      edad: '12 años',
      ubicacion: 'Ciudad conocida',
      descripcion: 'Me gusta Minecraft y los videojuegos',
      fotos: ['🎮', '🏠', '📚'],
      esSeguro: true,
      razon: 'Perfil completo y apropiado para su edad. No solicita información privada.'
    },
    {
      id: 2,
      nombre: 'Desconocido',
      avatar: '❓',
      edad: 'No especifica',
      ubicacion: 'No especifica',
      descripcion: 'Quiero ser tu amigo, dime dónde vives',
      fotos: ['⚠️'],
      esSeguro: false,
      razon: '¡PELIGRO! Solicita información personal sin dar datos propios. Perfil sospechoso.'
    },
    {
      id: 3,
      nombre: 'María',
      avatar: '👧',
      edad: '11 años',
      ubicacion: 'Tu ciudad',
      descripcion: 'Amo los animales y dibujar',
      fotos: ['🐕', '🎨', '🌸'],
      esSeguro: true,
      razon: 'Perfil transparente con intereses comunes y apropiados.'
    },
    {
      id: 4,
      nombre: 'Usuario777',
      avatar: '😎',
      edad: '10 años',
      ubicacion: 'En todas partes',
      descripcion: 'Te doy diamantes gratis, solo dime tu contraseña',
      fotos: ['💎', '💰'],
      esSeguro: false,
      razon: '¡ESTAFA! Nunca compartas contraseñas. Los diamantes gratis no existen.'
    },
    {
      id: 5,
      nombre: 'Carlos',
      avatar: '👦',
      edad: '13 años',
      ubicacion: 'España',
      descripcion: 'Jugador de Minecraft desde 2015',
      fotos: ['⛏️', '🏰', '🐉'],
      esSeguro: true,
      razon: 'Perfil legítimo de jugador con información coherente.'
    },
    {
      id: 6,
      nombre: 'Adulto Amigable',
      avatar: '🧔',
      edad: '35 años',
      ubicacion: 'Tu vecindario',
      descripcion: 'Hola niños, quiero jugar con ustedes. Envíenme fotos.',
      fotos: ['📸', '⚠️'],
      esSeguro: false,
      razon: '¡PELIGRO EXTREMO! Adulto intentando contactar menores. Reportar inmediatamente.'
    },
    {
      id: 7,
      nombre: 'Luna',
      avatar: '👩',
      edad: '12 años',
      ubicacion: 'México',
      descripcion: 'Streamer de Minecraft. ¡Sígueme!',
      fotos: ['🎥', '⭐', '🎮'],
      esSeguro: true,
      razon: 'Perfil público apropiado. Compartir contenido es seguro.'
    },
    {
      id: 8,
      nombre: 'OfertasGratis',
      avatar: '🎁',
      edad: 'No especifica',
      ubicacion: 'Internet',
      descripcion: 'Haz clic en este enlace para robux/pavos gratis',
      fotos: ['💸', '🔗', '⚠️'],
      esSeguro: false,
      razon: '¡PHISHING! Enlaces sospechosos. Nunca hagas clic en links desconocidos.'
    },
    {
      id: 9,
      nombre: 'Diego',
      avatar: '🧒',
      edad: '11 años',
      ubicacion: 'Colombia',
      descripcion: 'Constructor en Minecraft. Comparto mis creaciones.',
      fotos: ['🏗️', '🎨', '🌍'],
      esSeguro: true,
      razon: 'Perfil creativo y seguro. Compartir construcciones es parte del juego.'
    },
    {
      id: 10,
      nombre: 'SecretoAdmin',
      avatar: '👤',
      edad: 'Administrador',
      ubicacion: 'Servidor oficial',
      descripcion: 'Soy admin, dame tu cuenta para verificarla',
      fotos: ['🔒', '⚙️'],
      esSeguro: false,
      razon: '¡SUPLANTACIÓN! Los administradores reales NUNCA piden contraseñas.'
    }
  ];

  // Iniciar juego
  const iniciarJuego = () => {
    // Mezclar perfiles aleatoriamente
    const perfilesMezclados = [...perfilesBase].sort(() => Math.random() - 0.5);
    setPerfilesRestantes(perfilesMezclados);
    setPerfilActual(perfilesMezclados[0]);
    setGameState('playing');
    setDecisionesCorrectas(0);
    setDecisionesIncorrectas(0);
    setMensaje('');
    setMostrandoResultado(false);
  };

  // Manejar decisión del jugador
  const tomarDecision = (aceptar) => {
    if (mostrandoResultado || !perfilActual) return;

    const decisionCorrecta = aceptar === perfilActual.esSeguro;

    if (decisionCorrecta) {
      setDecisionesCorrectas(prev => prev + 1);
      setMensaje(`✅ ¡Correcto! ${perfilActual.razon}`);
    } else {
      setDecisionesIncorrectas(prev => prev + 1);
      setMensaje(`❌ Incorrecto. ${perfilActual.razon}`);
    }

    setMostrandoResultado(true);

    // Después de 3 segundos, mostrar siguiente perfil
    setTimeout(() => {
      const siguientesPerfiles = perfilesRestantes.slice(1);
      
      if (siguientesPerfiles.length === 0) {
        // Fin del juego
        setGameState('gameover');
      } else {
        setPerfilesRestantes(siguientesPerfiles);
        setPerfilActual(siguientesPerfiles[0]);
        setMensaje('');
        setMostrandoResultado(false);
      }
    }, 3000);
  };

  const reiniciarJuego = () => {
    iniciarJuego();
  };

  const volverAlMenu = () => {
    navigate('/menu');
  };

  // Calcular porcentaje de aciertos
  const totalDecisiones = decisionesCorrectas + decisionesIncorrectas;
  const porcentajeAciertos = totalDecisiones > 0 
    ? Math.round((decisionesCorrectas / totalDecisiones) * 100) 
    : 0;

  const estiloContainer = modoEnfoque ? styles.containerEnfoque : styles.container;

  return (
    <div style={estiloContainer}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>
          {modoEnfoque ? '👥 Aldea de Amigos' : '🏘️ Aldea Minecraft: Filtra a tus Amigos'}
        </h1>
        <p style={styles.instrucciones}>
          {modoEnfoque 
            ? 'Revisa cada perfil y decide si es seguro aceptarlo como amigo'
            : 'No todos los que quieren ser tus amigos son seguros. ¡Aprende a identificar perfiles sospechosos!'
          }
        </p>
      </div>

      {gameState === 'intro' && (
        <div style={styles.pantallaIntro}>
          <div style={styles.infoIntro}>
            <h2>🎯 Objetivo del Juego</h2>
            <p style={styles.textoIntro}>
              Revisa {perfilesBase.length} perfiles y decide si cada uno es <strong>seguro</strong> o <strong>peligroso</strong>.
            </p>
            <div style={styles.advertencia}>
              <strong>⚠️ Recuerda:</strong>
              <ul style={styles.lista}>
                <li>Nunca aceptes a desconocidos que piden información personal</li>
                <li>Desconfía de ofertas "gratis" o "demasiado buenas"</li>
                <li>Los adultos no deben contactar a niños en juegos</li>
                <li>Nadie legítimo te pedirá tu contraseña</li>
              </ul>
            </div>
          </div>
          <button style={styles.botonIniciar} onClick={iniciarJuego}>
            🎮 Comenzar
          </button>
        </div>
      )}

      {gameState === 'playing' && perfilActual && (
        <>
          {/* Panel de progreso */}
          <div style={styles.progreso}>
            <div style={styles.stat}>
              ✅ Correctas: {decisionesCorrectas}
            </div>
            <div style={styles.stat}>
              ❌ Incorrectas: {decisionesIncorrectas}
            </div>
            <div style={styles.stat}>
              📊 Perfiles restantes: {perfilesRestantes.length}
            </div>
          </div>

          {/* Tarjeta de perfil */}
          <div style={modoEnfoque ? styles.tarjetaPerfilEnfoque : styles.tarjetaPerfil}>
            <div style={styles.avatarGrande}>
              {perfilActual.avatar}
            </div>

            <h2 style={styles.nombrePerfil}>{perfilActual.nombre}</h2>

            <div style={styles.infoPerfil}>
              <div style={styles.infoItem}>
                <strong>👤 Edad:</strong> {perfilActual.edad}
              </div>
              <div style={styles.infoItem}>
                <strong>📍 Ubicación:</strong> {perfilActual.ubicacion}
              </div>
            </div>

            <div style={styles.descripcionPerfil}>
              <strong>📝 Descripción:</strong>
              <p style={styles.textoDescripcion}>{perfilActual.descripcion}</p>
            </div>

            <div style={styles.fotosContainer}>
              <strong>📸 Fotos del perfil:</strong>
              <div style={styles.fotos}>
                {perfilActual.fotos.map((foto, idx) => (
                  <span key={idx} style={styles.foto}>{foto}</span>
                ))}
              </div>
            </div>

            {/* Mensaje de resultado */}
            {mostrandoResultado && (
              <div style={
                decisionesCorrectas > decisionesCorrectas - decisionesIncorrectas
                  ? styles.mensajeExito 
                  : styles.mensajeError
              }>
                {mensaje}
              </div>
            )}

            {/* Botones de decisión */}
            {!mostrandoResultado && (
              <div style={styles.botonesDecision}>
                <button 
                  style={styles.botonRechazar}
                  onClick={() => tomarDecision(false)}
                >
                  ❌ Rechazar
                </button>
                <button 
                  style={styles.botonAceptar}
                  onClick={() => tomarDecision(true)}
                >
                  ✅ Aceptar
                </button>
              </div>
            )}
          </div>

          {modoEnfoque && (
            <div style={styles.ayudaEnfoque}>
              <p><strong>💡 Consejo:</strong> Lee cada detalle cuidadosamente antes de decidir.</p>
            </div>
          )}
        </>
      )}

      {gameState === 'gameover' && (
        <div style={styles.pantallaFinal}>
          <h2 style={porcentajeAciertos >= 70 ? styles.mensajeVictoria : styles.mensajeFinal}>
            {porcentajeAciertos >= 70 ? '🎉 ¡Excelente Trabajo!' : '📚 Sigue Aprendiendo'}
          </h2>

          <div style={styles.resultados}>
            <div style={styles.resultadoItem}>
              <span style={styles.iconoGrande}>✅</span>
              <span style={styles.numeroGrande}>{decisionesCorrectas}</span>
              <span>Correctas</span>
            </div>
            <div style={styles.resultadoItem}>
              <span style={styles.iconoGrande}>❌</span>
              <span style={styles.numeroGrande}>{decisionesIncorrectas}</span>
              <span>Incorrectas</span>
            </div>
            <div style={styles.resultadoItem}>
              <span style={styles.iconoGrande}>📊</span>
              <span style={styles.numeroGrande}>{porcentajeAciertos}%</span>
              <span>Aciertos</span>
            </div>
          </div>

          <div style={styles.evaluacion}>
            {porcentajeAciertos >= 90 && (
              <p style={styles.evaluacionTexto}>
                🌟 ¡Eres un experto en seguridad online! Sabes identificar perfectamente los perfiles peligrosos.
              </p>
            )}
            {porcentajeAciertos >= 70 && porcentajeAciertos < 90 && (
              <p style={styles.evaluacionTexto}>
                👍 ¡Muy bien! Tienes buen criterio para identificar perfiles sospechosos.
              </p>
            )}
            {porcentajeAciertos >= 50 && porcentajeAciertos < 70 && (
              <p style={styles.evaluacionTexto}>
                📖 Vas por buen camino. Practica más para mejorar tu seguridad online.
              </p>
            )}
            {porcentajeAciertos < 50 && (
              <p style={styles.evaluacionTexto}>
                ⚠️ Necesitas practicar más. Recuerda siempre desconfiar de desconocidos y ofertas sospechosas.
              </p>
            )}
          </div>

          <div style={styles.botonesFinal}>
            <button style={styles.botonSecundario} onClick={reiniciarJuego}>
              🔄 Jugar de Nuevo
            </button>
            <button style={styles.botonPrimario} onClick={volverAlMenu}>
              {porcentajeAciertos >= 70 ? '✅ Continuar' : '🏠 Menú Principal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos
const styles = {
  container: {
    padding: '20px',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    minHeight: '100vh',
    color: '#333',
    fontFamily: "'Poppins', sans-serif"
  },
  containerEnfoque: {
    padding: '20px',
    background: '#fafaf8',
    minHeight: '100vh',
    color: '#333',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    color: 'white'
  },
  titulo: {
    fontSize: '32px',
    margin: '0 0 10px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  instrucciones: {
    fontSize: '16px',
    maxWidth: '700px',
    margin: '0 auto',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
  },
  pantallaIntro: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  infoIntro: {
    marginBottom: '30px'
  },
  textoIntro: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '20px'
  },
  advertencia: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #ffc107'
  },
  lista: {
    textAlign: 'left',
    marginTop: '10px',
    lineHeight: '1.8'
  },
  botonIniciar: {
    width: '100%',
    padding: '15px',
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  progreso: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '800px',
    margin: '0 auto 30px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '10px'
  },
  stat: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    padding: '8px 15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px'
  },
  tarjetaPerfil: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    border: '3px solid #ddd'
  },
  tarjetaPerfilEnfoque: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '2px solid #999'
  },
  avatarGrande: {
    fontSize: '100px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  nombrePerfil: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50'
  },
  infoPerfil: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '20px'
  },
  infoItem: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '16px'
  },
  descripcionPerfil: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px'
  },
  textoDescripcion: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginTop: '10px'
  },
  fotosContainer: {
    marginBottom: '25px'
  },
  fotos: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '10px'
  },
  foto: {
    fontSize: '48px'
  },
  mensajeExito: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #c3e6cb'
  },
  mensajeError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #f5c6cb'
  },
  botonesDecision: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center'
  },
  botonAceptar: {
    flex: '1',
    padding: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  botonRechazar: {
    flex: '1',
    padding: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  ayudaEnfoque: {
    maxWidth: '600px',
    margin: '20px auto 0',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '16px'
  },
  pantallaFinal: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    color: '#333'
  },
  mensajeFinal: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#ff9800'
  },
  mensajeVictoria: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#4CAF50'
  },
  resultados: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '30px'
  },
  resultadoItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px'
  },
  iconoGrande: {
    fontSize: '48px'
  },
  numeroGrande: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  evaluacion: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    border: '2px solid #2196F3'
  },
  evaluacionTexto: {
    fontSize: '18px',
    lineHeight: '1.6',
    margin: '0',
    textAlign: 'center'
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
    borderRadius: '12px',
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
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  }
};

export default JuegoAldeaAmigos;