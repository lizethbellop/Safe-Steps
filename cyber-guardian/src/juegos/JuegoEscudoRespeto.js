import React, { useState, useEffect, useRef } from 'react';

const JuegoEscudoRespeto = ({ modoEnfoque }) => {
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [playerY, setPlayerY] = useState(350);
  const [isJumping, setIsJumping] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [objetos, setObjetos] = useState([]);
  const [reportes, setReportes] = useState(0);
  const [playerFrame, setPlayerFrame] = useState(0);
  const [combo, setCombo] = useState(0);
  const gameLoopRef = useRef(null);
  const frameCountRef = useRef(0);

  const GROUND_Y = 350;
  const JUMP_HEIGHT = 140;
  const PLAYER_X = 100;
  const GAME_WIDTH = 800;
  const VELOCIDAD_BASE = 4.5;
  const META_REPORTES = 8;

  // OBJETOS MALOS (deben esquivarse o reportarse)
  const objetosMalos = [
    { tipo: 'bully', color: '#e74c3c', nombre: 'Bully', ground: true },
    { tipo: 'troll', color: '#9b59b6', nombre: 'Troll', ground: true },
    { tipo: 'insulto', color: '#e67e22', nombre: 'Insulto', ground: false }, // Vuela alto
    { tipo: 'trampa', color: '#c0392b', nombre: 'Trampa', ground: true }
  ];

  // OBJETOS BUENOS (deben recogerse)
  const objetosBuenos = [
    { tipo: 'corazon', color: '#e91e63', nombre: 'Corazón', puntos: 50 },
    { tipo: 'estrella', color: '#FFD700', nombre: 'Estrella', puntos: 100 },
    { tipo: 'escudo', color: '#2196F3', nombre: 'Escudo', puntos: 30 },
    { tipo: 'libro', color: '#4CAF50', nombre: 'Libro', puntos: 75 }
  ];

  // Animación del personaje
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerFrame(prev => (prev + 1) % 4);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const iniciarJuego = () => {
    setGameState('playing');
    setScore(0);
    setVidas(3);
    setPlayerY(GROUND_Y);
    setObjetos([]);
    setReportes(0);
    setIsJumping(false);
    setHasShield(false);
    setCombo(0);
    frameCountRef.current = 0;
  };

  const saltar = () => {
    if (!isJumping && gameState === 'playing') {
      setIsJumping(true);
      let jumpProgress = 0;
      const jumpInterval = setInterval(() => {
        jumpProgress += 0.06;
        if (jumpProgress < 1) {
          const newY = GROUND_Y - Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;
          setPlayerY(newY);
        } else {
          setPlayerY(GROUND_Y);
          setIsJumping(false);
          clearInterval(jumpInterval);
        }
      }, 20);
    }
  };

  const activarEscudo = () => {
    if (!hasShield && gameState === 'playing') {
      setHasShield(true);
      setTimeout(() => setHasShield(false), 3000);
    }
  };

  const reportar = () => {
    if (gameState !== 'playing') return;
    
    setObjetos(prev => {
      const malosCercanos = prev.filter(obj => 
        obj.esMalo &&
        obj.x < PLAYER_X + 150 && 
        obj.x > PLAYER_X - 50 && 
        !obj.reportado
      );
      
      if (malosCercanos.length > 0) {
        setScore(s => s + malosCercanos.length * 100);
        setReportes(r => r + malosCercanos.length);
        setCombo(c => c + 1);
        
        return prev.map(obj => {
          if (malosCercanos.some(c => c.id === obj.id)) {
            return { ...obj, reportado: true };
          }
          return obj;
        });
      }
      return prev;
    });
  };

  // Game loop principal
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        frameCountRef.current += 1;

        setObjetos(prev => {
          const updated = prev.map(obj => ({
            ...obj,
            x: obj.x - VELOCIDAD_BASE
          })).filter(obj => obj.x > -60);

          updated.forEach(obj => {
            const colisionX = obj.x < PLAYER_X + 35 && obj.x > PLAYER_X - 25;
            const colisionYSuelo = Math.abs(playerY - GROUND_Y) < 20;
            const colisionYSalto = Math.abs(playerY - obj.y) < 45;

            if (obj.esMalo) {
              // OBJETOS MALOS
              if (!obj.reportado && !obj.colisionado) {
                // Si está en el suelo y el jugador también
                if (obj.ground && colisionX && colisionYSuelo) {
                  if (!hasShield) {
                    setVidas(v => v - 1);
                    obj.colisionado = true;
                    setCombo(0);
                  }
                }
                // Si vuela alto y el jugador salta
                else if (!obj.ground && colisionX && colisionYSalto) {
                  if (!hasShield) {
                    setVidas(v => v - 1);
                    obj.colisionado = true;
                    setCombo(0);
                  }
                }
              }
            } else {
              // OBJETOS BUENOS - Se recogen al tocarlos
              if (!obj.recogido && colisionX) {
                const estaEnRango = obj.ground ? colisionYSuelo : colisionYSalto;
                
                if (estaEnRango) {
                  obj.recogido = true;
                  setScore(s => s + obj.puntos);
                  setCombo(c => c + 1);
                  
                  // Efectos especiales
                  if (obj.tipo === 'corazon' && vidas < 3) {
                    setVidas(v => v + 1);
                  } else if (obj.tipo === 'escudo') {
                    activarEscudo();
                  }
                }
              }
            }
          });

          return updated.filter(obj => !obj.recogido);
        });

        // Generar objetos malos (70% probabilidad)
        if (frameCountRef.current % 70 === 0 && Math.random() < 0.7) {
          const objMalo = objetosMalos[Math.floor(Math.random() * objetosMalos.length)];
          const yPos = objMalo.ground ? GROUND_Y : GROUND_Y - 100; // Los que vuelan están más arriba
          
          setObjetos(prev => [...prev, {
            id: Date.now() + Math.random(),
            x: GAME_WIDTH,
            y: yPos,
            ...objMalo,
            esMalo: true,
            colisionado: false,
            reportado: false
          }]);
        }

        // Generar objetos buenos (30% probabilidad, menos frecuente)
        if (frameCountRef.current % 90 === 0 && Math.random() < 0.5) {
          const objBueno = objetosBuenos[Math.floor(Math.random() * objetosBuenos.length)];
          const enAltura = Math.random() > 0.5; // 50% en el aire, 50% en el suelo
          const yPos = enAltura ? GROUND_Y - 80 : GROUND_Y;
          
          setObjetos(prev => [...prev, {
            id: Date.now() + Math.random(),
            x: GAME_WIDTH,
            y: yPos,
            ground: !enAltura,
            ...objBueno,
            esMalo: false,
            recogido: false
          }]);
        }

        // Puntos por tiempo (más lento para balancear)
        if (frameCountRef.current % 90 === 0) {
          setScore(s => s + 5);
        }
      }, 1000 / 60);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameState, playerY, hasShield, vidas]);

  // Verificar condiciones de fin
  useEffect(() => {
    if (vidas <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
    if (reportes >= META_REPORTES && gameState === 'playing') {
      setGameState('win');
    }
  }, [vidas, reportes, gameState]);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'w':
        case 'arrowup':
          e.preventDefault();
          saltar();
          break;
        case 'e':
        case 'shift':
          activarEscudo();
          break;
        case 'r':
        case 'control':
          reportar();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, isJumping, hasShield]);

  const volverAlMenu = () => {
    window.location.href = '/menu';
  };

  // Componente Pixel Player
  const PixelPlayer = () => {
    const running = playerFrame % 2 === 0;
    return (
      <div style={{
        position: 'absolute',
        left: `${PLAYER_X}px`,
        bottom: `${GROUND_Y - playerY + 50}px`,
        width: '40px',
        height: '48px',
        imageRendering: 'pixelated',
        transition: 'bottom 0.02s linear',
        zIndex: 20
      }}>
        {hasShield && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            border: '3px solid #FFD700',
            borderRadius: '50%',
            animation: 'shieldPulse 0.5s infinite'
          }}/>
        )}
        <svg width="40" height="48" viewBox="0 0 10 12">
          <rect x="3" y="0" width="4" height="3" fill="#ffcc99"/>
          <rect x="3.5" y="1" width="1" height="1" fill="#000"/>
          <rect x="5.5" y="1" width="1" height="1" fill="#000"/>
          <rect x="2" y="3" width="6" height="4" fill="#3498db"/>
          <rect x="1" y="4" width="1" height="3" fill="#ffcc99"/>
          <rect x="8" y="4" width="1" height="3" fill="#ffcc99"/>
          <rect x="3" y="7" width="2" height="3" fill="#2c3e50" 
                style={{transform: running ? 'translateX(0.5px)' : 'translateX(-0.5px)'}}/>
          <rect x="5" y="7" width="2" height="3" fill="#2c3e50"
                style={{transform: running ? 'translateX(-0.5px)' : 'translateX(0.5px)'}}/>
          {hasShield && <rect x="8" y="3" width="2" height="3" fill="#FFD700" rx="0.5"/>}
        </svg>
      </div>
    );
  };

  // Componente de Objeto
  const PixelObjeto = ({ obj }) => {
    if (obj.reportado) {
      return (
        <div style={{
          position: 'absolute',
          left: `${obj.x}px`,
          bottom: `${obj.y - GROUND_Y + 50}px`,
          width: '40px',
          height: '48px',
          opacity: 0.3,
          animation: 'fadeOut 0.5s',
          zIndex: 10
        }}>
          <svg width="40" height="48" viewBox="0 0 10 12">
            <text x="5" y="6" fontSize="8" textAnchor="middle" fill="#27ae60">✓</text>
          </svg>
        </div>
      );
    }

    return (
      <div style={{
        position: 'absolute',
        left: `${obj.x}px`,
        bottom: `${GROUND_Y - obj.y + 50}px`,
        width: '40px',
        height: '48px',
        imageRendering: 'pixelated',
        zIndex: 10
      }}>
        <svg width="40" height="48" viewBox="0 0 10 12">
          {obj.esMalo ? (
            // OBJETOS MALOS
            obj.tipo === 'insulto' ? (
              // Nube de insulto (vuela)
              <>
                <ellipse cx="5" cy="4" rx="4" ry="3" fill={obj.color}/>
                <text x="5" y="5" fontSize="2" textAnchor="middle" fill="#fff">!</text>
              </>
            ) : (
              // Bully/Troll/Trampa (suelo)
              <>
                <rect x="3" y="0" width="4" height="3" fill={obj.color}/>
                <rect x="3" y="1" width="1" height="1" fill="#fff"/>
                <rect x="6" y="1" width="1" height="1" fill="#fff"/>
                <rect x="3.5" y="1" width="0.5" height="0.5" fill="#000"/>
                <rect x="6" y="1" width="0.5" height="0.5" fill="#000"/>
                <rect x="3" y="0.5" width="1.5" height="0.5" fill="#000"/>
                <rect x="5.5" y="0.5" width="1.5" height="0.5" fill="#000"/>
                <rect x="2" y="3" width="6" height="4" fill={obj.color}/>
                <rect x="1" y="2" width="1" height="3" fill={obj.color}/>
                <rect x="8" y="2" width="1" height="3" fill={obj.color}/>
                <rect x="3" y="7" width="2" height="3" fill="#555"/>
                <rect x="5" y="7" width="2" height="3" fill="#555"/>
                <rect x="4" y="4.5" width="2" height="1.5" fill="#fff"/>
                <text x="5" y="6" fontSize="2" textAnchor="middle" fill="#000">!</text>
              </>
            )
          ) : (
            // OBJETOS BUENOS
            obj.tipo === 'corazon' ? (
              <>
                <rect x="2" y="3" width="2" height="2" fill={obj.color}/>
                <rect x="6" y="3" width="2" height="2" fill={obj.color}/>
                <rect x="1" y="5" width="8" height="2" fill={obj.color}/>
                <rect x="2" y="7" width="6" height="2" fill={obj.color}/>
                <rect x="3" y="9" width="4" height="1" fill={obj.color}/>
                <rect x="4" y="10" width="2" height="1" fill={obj.color}/>
              </>
            ) : obj.tipo === 'estrella' ? (
              <>
                <rect x="4" y="2" width="2" height="2" fill={obj.color}/>
                <rect x="3" y="4" width="4" height="2" fill={obj.color}/>
                <rect x="2" y="5" width="6" height="2" fill={obj.color}/>
                <rect x="3" y="7" width="4" height="2" fill={obj.color}/>
                <rect x="4" y="9" width="2" height="1" fill={obj.color}/>
                <rect x="1" y="6" width="1" height="1" fill={obj.color}/>
                <rect x="8" y="6" width="1" height="1" fill={obj.color}/>
              </>
            ) : obj.tipo === 'escudo' ? (
              <>
                <rect x="2" y="2" width="6" height="6" fill={obj.color} rx="1"/>
                <rect x="3" y="3" width="4" height="4" fill="#90CAF9" rx="0.5"/>
                <rect x="3" y="8" width="2" height="2" fill={obj.color}/>
                <rect x="5" y="8" width="2" height="2" fill={obj.color}/>
              </>
            ) : (
              // Libro
              <>
                <rect x="2" y="3" width="6" height="7" fill={obj.color}/>
                <rect x="3" y="4" width="4" height="5" fill="#fff"/>
                <rect x="3.5" y="5" width="3" height="0.5" fill="#333"/>
                <rect x="3.5" y="6" width="3" height="0.5" fill="#333"/>
                <rect x="3.5" y="7" width="2" height="0.5" fill="#333"/>
              </>
            )
          )}
        </svg>
      </div>
    );
  };

  const estiloContainer = modoEnfoque ? styles.containerEnfoque : styles.container;

  return (
    <div style={estiloContainer}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>
          {modoEnfoque ? 'ESCUDO DE RESPETO' : '🛡️ ESCUDO DE RESPETO 🛡️'}
        </h1>
        <p style={styles.instrucciones}>
          Esquiva o reporta BULLIES (rojos/morados) y recoge ITEMS BUENOS (corazones/estrellas)
        </p>
      </div>

      {gameState === 'intro' && (
        <div style={styles.pantallaIntro}>
          <div style={styles.pixelArtDemo}>
            <svg width="120" height="120" viewBox="0 0 30 30" style={{imageRendering: 'pixelated'}}>
              <rect x="12" y="8" width="6" height="4" fill="#3498db"/>
              <rect x="10" y="12" width="10" height="8" fill="#3498db"/>
              <rect x="12" y="20" width="2" height="5" fill="#2c3e50"/>
              <rect x="16" y="20" width="2" height="5" fill="#2c3e50"/>
              <rect x="8" y="14" width="3" height="4" fill="#FFD700" rx="1"/>
            </svg>
          </div>
          
          <div style={styles.instruccionesDetalladas}>
            <h2 style={styles.subtitulo}>📚 Sobre el Bullying</h2>
            <p style={styles.textoEducativo}>
              El bullying es cuando alguien te molesta repetidamente. 
              <strong> ¡Reportarlo es valiente!</strong> Habla con adultos de confianza.
            </p>
            
            <h3 style={styles.subtituloControles}>🎮 Cómo Jugar</h3>
            <div style={styles.leyendaObjetos}>
              <div style={styles.objetoInfo}>
                <span style={{color: '#e74c3c'}}>■</span> <strong>MALOS:</strong> Bullies, trolls, insultos
              </div>
              <div style={styles.objetoInfo}>
                <span style={{color: '#e91e63'}}>♥</span> <strong>BUENOS:</strong> Corazones, estrellas, escudos, libros
              </div>
            </div>
            
            <div style={styles.controlsGrid}>
              <div style={styles.controlCard}>
                <div style={styles.tecla}>ESPACIO</div>
                <span>Saltar (esquiva malos, recoge buenos en el aire)</span>
              </div>
              <div style={styles.controlCard}>
                <div style={styles.tecla}>R</div>
                <span>Reportar bullies cercanos</span>
              </div>
              <div style={styles.controlCard}>
                <div style={styles.tecla}>E</div>
                <span>Activar escudo (si tienes)</span>
              </div>
            </div>
            
            <div style={styles.objetivoBox}>
              <strong>🎯 MISIÓN:</strong> Reporta {META_REPORTES} situaciones de bullying para ganar
            </div>
            <div style={styles.tipBox}>
              💡 <strong>Tips:</strong> Salta para esquivar bullies en el suelo y recoger items en el aire. Algunos insultos vuelan alto, ¡cuidado al saltar!
            </div>
          </div>
          <button style={styles.botonIniciar} onClick={iniciarJuego}>
            ▶ JUGAR AHORA
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <div style={styles.infoPanel}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>VIDAS</span>
              <span style={styles.statValue}>{'❤️'.repeat(vidas)}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>PUNTOS</span>
              <span style={styles.statValue}>{score}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>REPORTES</span>
              <span style={styles.statValue}>{reportes}/{META_REPORTES}</span>
            </div>
            {combo > 1 && (
              <div style={styles.statBox}>
                <span style={styles.statCombo}>COMBO x{combo}!</span>
              </div>
            )}
            {hasShield && (
              <div style={styles.statBox}>
                <span style={styles.statEscudo}>🛡️ PROTEGIDO</span>
              </div>
            )}
          </div>

          <div style={styles.gameCanvas}>
            <div style={styles.pixelSky}/>
            <div style={styles.pixelClouds}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  ...styles.pixelCloud,
                  left: `${20 + i * 35}%`,
                  animationDelay: `${i * 2}s`
                }}/>
              ))}
            </div>
            
            <PixelPlayer />
            
            {objetos.map(obj => (
              <PixelObjeto key={obj.id} obj={obj} />
            ))}

            <div style={styles.pixelGround}>
              {[...Array(40)].map((_, i) => (
                <div key={i} style={{
                  ...styles.grassPixel,
                  left: `${i * 20}px`
                }}/>
              ))}
            </div>
          </div>

          <div style={styles.controles}>
            <button 
              style={{
                ...styles.botonControl,
                opacity: isJumping ? 0.5 : 1
              }}
              onClick={saltar}
              disabled={isJumping}
            >
              ⬆️ SALTAR
            </button>
            <button 
              style={{
                ...styles.botonControl,
                backgroundColor: hasShield ? '#95a5a6' : '#f39c12',
                opacity: hasShield ? 0.5 : 1
              }}
              onClick={activarEscudo}
              disabled={hasShield}
            >
              🛡️ ESCUDO
            </button>
            <button 
              style={{
                ...styles.botonControl,
                backgroundColor: '#e74c3c'
              }}
              onClick={reportar}
            >
              📢 REPORTAR
            </button>
          </div>

          <div style={styles.leyendaJuego}>
            <span style={{color: '#e74c3c'}}>■ Malos: Esquiva o reporta</span>
            <span style={{color: '#FFD700'}}>★ Buenos: ¡Recógelos!</span>
          </div>
        </>
      )}

      {gameState === 'gameover' && (
        <div style={styles.pantallaFinal}>
          <div style={styles.pixelIcon}>
            <svg width="100" height="100" viewBox="0 0 25 25" style={{imageRendering: 'pixelated'}}>
              <rect x="5" y="5" width="15" height="15" fill="#e74c3c"/>
              <rect x="8" y="8" width="3" height="9" fill="#fff" transform="rotate(45 12.5 12.5)"/>
              <rect x="8" y="8" width="3" height="9" fill="#fff" transform="rotate(-45 12.5 12.5)"/>
            </svg>
          </div>
          <h2 style={styles.mensajeFinal}>GAME OVER</h2>
          <p style={styles.scoreFinal}>Puntuación: {score}</p>
          <p style={styles.reportesFinal}>Reportes: {reportes}/{META_REPORTES}</p>
          
          <div style={styles.mensajeEducativoLargo}>
            <div style={styles.audioHeader}>
              <h3 style={styles.tituloEducativo}>💬 Mensaje Importante sobre el Bullying</h3>
              <button style={styles.botonAudio} onClick={() => {
                // TODO: Aquí se agregará la funcionalidad de audio
                // const audio = new Audio('/ruta-al-audio-gameover.mp3');
                // audio.play();
                console.log('Reproducir audio de Game Over');
              }}>
                🔊 Escuchar
              </button>
            </div>
            
            <div style={styles.textoEducativoLargo}>
              <p><strong>¡No te desanimes!</strong> Lo importante no es ganar el juego, sino entender un mensaje muy importante:</p>
              
              <p>El <strong>bullying o acoso escolar</strong> es cuando alguien te molesta, te insulta, te empuja o te hace sentir mal de forma repetida. Puede pasar en la escuela, en internet o en cualquier lugar donde estés con otras personas.</p>
              
              <p><strong>¿Qué debes hacer si sufres bullying?</strong></p>
              <ul style={styles.listaEducativa}>
                <li>🗣️ <strong>Habla con un adulto de confianza:</strong> Puede ser tus papás, un maestro, el director o cualquier adulto que te escuche.</li>
                <li>💪 <strong>No estás solo:</strong> Muchos niños pasan por esto. Pedir ayuda no es ser débil, ¡es ser valiente!</li>
                <li>👥 <strong>Apoya a otros:</strong> Si ves que molestan a un compañero, no te quedes callado. Reporta la situación con un adulto.</li>
                <li>📱 <strong>Guarda evidencias:</strong> Si el bullying es por internet, guarda capturas de pantalla o mensajes.</li>
              </ul>
              
              <p><strong>Recuerda:</strong> Reportar el bullying no es "acusar" ni "ser chismoso". Es protegerte a ti mismo y ayudar a que tu escuela sea un lugar seguro para todos. Tú mereces respeto y un ambiente donde puedas aprender y ser feliz. 🛡️✨</p>
            </div>
          </div>
          
          <div style={styles.botonesFinal}>
            <button style={styles.botonSecundario} onClick={iniciarJuego}>
              🔄 REINTENTAR
            </button>
            <button style={styles.botonPrimario} onClick={volverAlMenu}>
              🏠 MENÚ
            </button>
          </div>
        </div>
      )}

      {gameState === 'win' && (
        <div style={styles.pantallaFinal}>
          <div style={styles.pixelIcon}>
            <svg width="100" height="100" viewBox="0 0 25 25" style={{imageRendering: 'pixelated'}}>
              <rect x="5" y="5" width="15" height="15" fill="#27ae60"/>
              <rect x="7" y="12" width="3" height="6" fill="#fff"/>
              <rect x="10" y="15" width="8" height="3" fill="#fff"/>
            </svg>
          </div>
          <h2 style={styles.mensajeVictoria}>¡VICTORIA!</h2>
          <p style={styles.scoreFinal}>Puntuación Final: {score}</p>
          <p style={styles.mensajeEducativo}>
            ¡Excelente! Reportaste {reportes} situaciones de bullying. 
            En la vida real, <strong>reportar es la acción más valiente</strong> que puedes tomar. 
            Ayudas a crear un ambiente seguro para todos. 🛡️✨
          </p>
          <div style={styles.botonesFinal}>
            <button style={styles.botonSecundario} onClick={iniciarJuego}>
              🔄 JUGAR DE NUEVO
            </button>
            <button style={styles.botonPrimario} onClick={volverAlMenu}>
              ✅ CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
    minHeight: '100vh',
    color: 'white',
    fontFamily: '"Press Start 2P", "Courier New", monospace',
    fontSize: '14px'
  },
  containerEnfoque: {
    padding: '20px',
    background: '#e0e0e0',
    minHeight: '100vh',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  titulo: {
    fontSize: '28px',
    margin: '0 0 15px 0',
    textShadow: '4px 4px 0px rgba(0,0,0,0.5)',
    letterSpacing: '2px'
  },
  instrucciones: {
    fontSize: '11px',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
    fontFamily: 'Arial, sans-serif'
  },
  pantallaIntro: {
    textAlign: 'center',
    maxWidth: '750px',
    margin: '30px auto',
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '0px',
    border: '4px solid #000',
    color: '#2c3e50',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)'
  },
  pixelArtDemo: {
    marginBottom: '30px'
  },
  instruccionesDetalladas: {
    marginBottom: '30px',
    textAlign: 'left'
  },
  subtitulo: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#2c3e50',
    fontFamily: 'Arial, sans-serif'
  },
  textoEducativo: {
    fontSize: '14px',
    lineHeight: '1.8',
    marginBottom: '25px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff3cd',
    padding: '15px',
    border: '2px solid #ffc107',
    borderRadius: '5px'
  },
  subtituloControles: {
    fontSize: '16px',
    marginBottom: '15px',
    marginTop: '25px',
    fontFamily: 'Arial, sans-serif'
  },
  leyendaObjetos: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px'
  },
  objetoInfo: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    border: '2px solid #000',
    fontSize: '12px'
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  controlCard: {
    backgroundColor: '#f8f9fa',
    padding: '15px 10px',
    border: '3px solid #000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11px'
  },
  tecla: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '8px 15px',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '9px'
  },
  objetivoBox: {
    padding: '15px',
    backgroundColor: '#d4edda',
    border: '3px solid #28a745',
    marginBottom: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px'
  },
  tipBox: {
    padding: '15px',
    backgroundColor: '#d1ecf1',
    border: '3px solid #17a2b8',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11px',
    lineHeight: '1.6'
  },
  botonIniciar: {
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#27ae60',
    color: 'white',
    border: '4px solid #000',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px #000',
    fontFamily: '"Press Start 2P", monospace',
    transition: 'all 0.1s'
  },
  infoPanel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '950px',
    margin: '0 auto 20px',
    flexWrap: 'wrap'
  },
  statBox: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px 20px',
    border: '3px solid #fff',
    minWidth: '130px',
    textAlign: 'center'
  },
  statLabel: {
    display: 'block',
    fontSize: '10px',
    marginBottom: '5px'
  },
  statValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  statCombo: {
    fontSize: '14px',
    color: '#FFD700',
    animation: 'blink 0.3s infinite'
  },
  statEscudo: {
    fontSize: '12px',
    animation: 'blink 0.5s infinite'
  },
  gameCanvas: {
    position: 'relative',
    width: '100%',
    maxWidth: '800px',
    height: '400px',
    margin: '0 auto 20px',
    backgroundColor: '#87CEEB',
    border: '4px solid #000',
    overflow: 'hidden',
    imageRendering: 'pixelated',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.5)'
  },
  pixelSky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '350px',
    background: 'linear-gradient(180deg, #5b9bd5 0%, #87CEEB 100%)'
  },
  pixelClouds: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px'
  },
  pixelCloud: {
    position: 'absolute',
    top: '50px',
    width: '60px',
    height: '30px',
    backgroundColor: '#fff',
    animation: 'cloudMove 15s infinite linear',
    boxShadow: '0 0 0 8px #fff, 0 0 0 16px #fff'
  },
  pixelGround: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '50px',
    backgroundColor: '#8B4513',
    borderTop: '4px solid #654321'
  },
  grassPixel: {
    position: 'absolute',
    top: '-8px',
    width: '8px',
    height: '8px',
    backgroundColor: '#228B22'
  },
  controles: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    maxWidth: '700px',
    margin: '0 auto 15px',
    flexWrap: 'wrap'
  },
  botonControl: {
    padding: '15px 25px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: '#3498db',
    color: 'white',
    border: '4px solid #000',
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: '4px 4px 0px #000',
    minWidth: '130px',
    transition: 'all 0.1s'
  },
  leyendaJuego: {
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    border: '2px solid #fff',
    fontSize: '10px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    flexWrap: 'wrap'
  },
  pantallaFinal: {
    textAlign: 'center',
    maxWidth: '650px',
    margin: '30px auto',
    backgroundColor: '#fff',
    padding: '40px 30px',
    border: '4px solid #000',
    color: '#2c3e50',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)'
  },
  pixelIcon: {
    marginBottom: '20px'
  },
  mensajeFinal: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#e74c3c',
    textShadow: '2px 2px 0px rgba(0,0,0,0.2)'
  },
  mensajeVictoria: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#27ae60',
    textShadow: '2px 2px 0px rgba(0,0,0,0.2)'
  },
  scoreFinal: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#3498db',
    fontFamily: 'Arial, sans-serif'
  },
  reportesFinal: {
    fontSize: '16px',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  mensajeEducativo: {
    fontSize: '14px',
    marginBottom: '30px',
    lineHeight: '1.8',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff3cd',
    padding: '20px',
    border: '2px solid #ffc107',
    borderRadius: '5px',
    textAlign: 'left'
  },
  mensajeEducativoLargo: {
    marginBottom: '30px',
    backgroundColor: '#f8f9fa',
    border: '3px solid #000',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  audioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#667eea',
    color: 'white',
    gap: '15px',
    flexWrap: 'wrap'
  },
  tituloEducativo: {
    fontSize: '16px',
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    flex: 1
  },
  botonAudio: {
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#FFD700',
    color: '#333',
    border: '3px solid #000',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '3px 3px 0px #000',
    transition: 'all 0.1s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap'
  },
  textoEducativoLargo: {
    padding: '25px',
    fontSize: '14px',
    lineHeight: '1.8',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left',
    color: '#2c3e50'
  },
  listaEducativa: {
    marginLeft: '20px',
    marginTop: '10px',
    marginBottom: '15px',
    lineHeight: '2'
  },
  botonesFinal: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  botonPrimario: {
    padding: '15px 30px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#27ae60',
    color: 'white',
    border: '4px solid #000',
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: '4px 4px 0px #000',
    transition: 'all 0.1s'
  },
  botonSecundario: {
    padding: '15px 30px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: '#3498db',
    color: 'white',
    border: '4px solid #000',
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: '4px 4px 0px #000',
    transition: 'all 0.1s'
  }
};

// Agregar animaciones CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes shieldPulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.1);
      opacity: 0.7;
    }
  }
  
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
  }
  
  @keyframes cloudMove {
    0% { transform: translateX(-100px); }
    100% { transform: translateX(900px); }
  }
  
  @keyframes blink {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.3; }
  }
  
  button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000 !important;
  }
  
  button:active {
    transform: translate(4px, 4px);
    box-shadow: 0px 0px 0px #000 !important;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

if (!document.head.querySelector('style[data-game-styles]')) {
  styleSheet.setAttribute('data-game-styles', 'true');
  document.head.appendChild(styleSheet);
}

export default JuegoEscudoRespeto;