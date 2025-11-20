import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../PerfilContext'; 
import { User, MapPin, FileText, Image as ImageIcon, Loader } from 'lucide-react';
import { AVATAR_MAPPER } from '../assets/pfps/AvatarMapper'; 

// 🎯 CONSTANTES
const GAME_CONSTANTS = {
  NUM_PROFILES: 10,
  SCORE_PER_CORRECT_ANSWER: 100,
  
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY, 
  GEMINI_MODEL: 'gemini-2.0-flash',
};

const JuegoAldeaAmigos = () => {
  const navigate = useNavigate();
  const { perfilActivo, actualizarPuntos } = usePerfil();
  
  const [gameState, setGameState] = useState('intro'); 
  const [perfilActual, setPerfilActual] = useState(null);
  const [perfilesRestantes, setPerfilesRestantes] = useState([]);
  const [decisionesCorrectas, setDecisionesCorrectas] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [mostrandoResultado, setMostrandoResultado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [puntosPartida, setPuntosPartida] = useState(0);
  
  // ✅ useRef para tracking síncrono de avatares
  const avataresUsadosRef = useRef({
    GIRL: [],
    BOY: [],
    WARNING: []
  });

  const getRandomAvatar = (esSeguro, genero) => {
    let categoria = '';
    let list = [];

    if (!esSeguro) {
        categoria = 'WARNING';
        list = AVATAR_MAPPER.WARNING;
    } else {
        if (genero === 'niña') {
            categoria = 'GIRL';
            list = AVATAR_MAPPER.GIRL;
        } else {
            categoria = 'BOY';
            list = AVATAR_MAPPER.BOY;
        }
    }

    if (!list || list.length === 0) return 'https://via.placeholder.com/150';
    
    // ✅ Usar el ref (síncrono)
    const usados = avataresUsadosRef.current[categoria];
    const disponibles = list.filter(avatar => !usados.includes(avatar));
    
    // Si ya se usaron todos, resetear esa categoría
    let listaFinal = disponibles;
    if (disponibles.length === 0) {
        avataresUsadosRef.current[categoria] = [];
        listaFinal = list;
    }
    
    // Elegir uno aleatorio
    const randomIndex = Math.floor(Math.random() * listaFinal.length);
    const avatarElegido = listaFinal[randomIndex];
    
    // ✅ Actualizar sincrónicamente
    avataresUsadosRef.current[categoria].push(avatarElegido);
    
    return avatarElegido;
  };

  const generateProfile = async () => {
    // Arrays de opciones para máxima variedad
    const artistasFavoritos = [
      // Pop/Urbano actual
      'Olivia Rodrigo', 'Bad Bunny', 'Cris MJ', 'Taylor Swift', 'Peso Pluma', 
      'Feid', 'Karol G', 'Dua Lipa', 'Bizarrap', 'Quevedo', 'Shakira',
      'Rauw Alejandro', 'Maria Becerra', 'Billie Eilish', 'Duki', 'Tini', 'Aitana', 'Álvaro Díaz',
      // K-pop
      'BTS', 'BLACKPINK', 'Stray Kids', 'NewJeans', 'TWICE', 'Babymonster', 'Exo',
      // Para niños más pequeños (8-9 años)
      'Lara Campos', 'Luli Pampin', 'Karol Sevilla', 'Elenco de Soy Luna',
      'Elenco de Violetta', 'Sebastián Yatra', 'Lasso', 'Mau y Ricky'
    ];
    
    const peliculas = [
      // Animadas variadas
      'Encanto', 'Coco', 'Spider-Man: Across the Spider-Verse', 'Mario Bros',
      'Intensamente', 'Mi Villano Favorito', 'Kung Fu Panda', 'Shrek', 'La familia Mitchel',
      // No Disney
      'Hotel Transylvania', 'Coraline', 'ParaNorman', 'Kubo',
      'Star Wars', 'Harry Potter', 'Jurassic World', 'Transformers', 'El cadaver de la novia',
      // Más actuales
      'Barbie', 'Wonka', 'FNAF la Película', 
      'Demon Slayer: Mugen Train', 'Sonic la Película', 'Wicked', 'Thunderbolts'
    ];
    
    const series = [
      'Stranger Things', 'Wednesday', 'One Piece', 'Demon Slayer', 
      'My Hero Academia', 'Naruto', 'Dragon Ball', 'Bluey', 'Ladybug',
      'Los Simpsons', 'Bob Esponja', 'Gravity Falls', 'Avatar La Leyenda de Aang',
      'Cobra Kai', 'Heartstopper', 'Squid Game', 'The Mandalorian'
    ];
    
    const personajes = [
      // Superhéroes
      'Spider-Man', 'Batman', 'Superman', 'Wonder Woman', 'Iron Man', 'Capitan America',
      // Anime/Series actuales
      'Tanjiro', 'Nezuko', 'Goku', 'Naruto', 'Deku',
      // Infantiles actuales
      'Bluey', 'Bingo', 'Ladybug', 'Cat Noir', 'Wednesday', 'Princesita Sofia',
      // Clásicos queridos
      'Stitch', 'Pikachu', 'Charmander'
    ];
    
    const hobbies = [
      'dibujar anime', 'hacer TikToks', 'jugar fútbol', 'tocar guitarra',
      'bailar K-pop', 'hacer slime', 'coleccionar cartas Pokémon', 
      'patinar', 'nadar', 'hacer parkour', 'cocinar postres',
      'construir con LEGO', 'hacer manualidades', 'leer manga',
      'ver streams de Twitch', 'jugar basquetbol', 'hacer gimnasia', 'jugar Volleyball', 'ver YouTube'
    ];
    
    const ciudadesMX = [
      'CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León',
      'Cancún', 'Mérida', 'Querétaro', 'Aguascalientes', 'Oaxaca',
      'Veracruz', 'Chihuahua', 'Morelia', 'Toluca', 'San Luis Potosí', 'Magdalena Chichicaspa', 'Campeche', 'Saltillo'
    ];
    
    const juegos = [
      'Minecraft', 'Roblox', 'Fortnite', 'Among Us', 'FIFA', 'GTA',
      'Valorant', 'League of Legends', 'Genshin Impact', 'Brawl Stars',
      'Clash Royale', 'Call of Duty', 'Rocket League', 'Fall Guys',
      'Stumble Guys', 'Free Fire', 'PUBG', 'Apex Legends'
    ];

    // Tipos de perfiles peligrosos más variados
    const tiposPeligrosos = [
      'pide_whatsapp', 'ofrece_robux', 'pide_fotos', 'adulto_mentor',
      'pide_contraseña', 'quiere_privado', 'ofrece_dinero', 'pide_direccion',
      'falso_youtuber', 'falso_moderador', 'pide_tiktok', 'hacer_racha_tiktok'
    ];

    // Seleccionar elementos aleatorios
    const artistaRandom = artistasFavoritos[Math.floor(Math.random() * artistasFavoritos.length)];
    const peliRandom = peliculas[Math.floor(Math.random() * peliculas.length)];
    const serieRandom = series[Math.floor(Math.random() * series.length)];
    const personajeRandom = personajes[Math.floor(Math.random() * personajes.length)];
    const hobbyRandom = hobbies[Math.floor(Math.random() * hobbies.length)];
    const ciudadRandom = ciudadesMX[Math.floor(Math.random() * ciudadesMX.length)];
    const juegoRandom = juegos[Math.floor(Math.random() * juegos.length)];
    const peligroRandom = tiposPeligrosos[Math.floor(Math.random() * tiposPeligrosos.length)];
    
    const esSeguro = Math.random() > 0.4; // 60% seguros, 40% peligrosos
    const esNiña = Math.random() > 0.5;
    const randomSeed = Math.random().toString(36).substring(7);
    
    const prompt = `Genera UN perfil ÚNICO de usuario para un videojuego infantil.

DATOS PARA USAR (elige algunos, no todos):
- Artista favorito: ${artistaRandom}
- Película favorita: ${peliRandom}
- Serie favorita: ${serieRandom}
- Personaje favorito: ${personajeRandom}
- Hobby: ${hobbyRandom}
- Ciudad: ${ciudadRandom}
- Juego favorito: ${juegoRandom}
- Seed: ${randomSeed}

TIPO DE PERFIL: ${esSeguro ? 'SEGURO' : 'PELIGROSO'}
GÉNERO: ${esNiña ? 'niña' : 'niño'}
${!esSeguro ? `TIPO DE PELIGRO: ${peligroRandom}` : ''}

${esSeguro ? `
PERFIL SEGURO - Debe incluir:
- Username creativo relacionado con sus gustos
- Edad entre 8-13 años
- Descripción mencionando 2-3 de sus gustos (artista, peli, hobby, etc.)
- Emojis relacionados con sus intereses
- Sin información personal sensible
` : `
PERFIL PELIGROSO (${peligroRandom}) - Debe incluir señales de alerta como:
${peligroRandom === 'pide_whatsapp' ? '- Pide número de WhatsApp o redes sociales privadas' : ''}
${peligroRandom === 'ofrece_robux' ? '- Ofrece Robux/V-Bucks/skins gratis a cambio de algo' : ''}
${peligroRandom === 'pide_fotos' ? '- Pide fotos o videollamadas privadas' : ''}
${peligroRandom === 'adulto_mentor' ? '- Adulto que quiere ser "mentor" o "amigo especial"' : ''}
${peligroRandom === 'pide_contraseña' ? '- Pide contraseñas prometiendo regalos' : ''}
${peligroRandom === 'quiere_privado' ? '- Insiste en hablar en privado, sin que sepan los papás' : ''}
${peligroRandom === 'ofrece_dinero' ? '- Ofrece dinero o regalos costosos' : ''}
${peligroRandom === 'pide_direccion' ? '- Pide dirección o escuela donde estudia' : ''}
${peligroRandom === 'falso_youtuber' ? '- Se hace pasar por YouTuber/streamer famoso' : ''}
${peligroRandom === 'falso_moderador' ? '- Finge ser moderador del juego pidiendo datos' : ''}
${peligroRandom === 'pide_tiktok' ? '- Pide ver los videos privados de tiktok' : ''}
${peligroRandom === 'hacer_racha_tiktok' ? '- No te conoce y quiere iniciar racha en tiktok' : ''}
- Edad adulta o "no dice"
- Ubicación vaga o sospechosa
`}

Responde SOLO con este JSON:
{
  "nombre": "Username único y creativo",
  "genero": "${esNiña ? 'niña' : 'niño'}",
  "edad": "edad apropiada",
  "ubicacion": "lugar",
  "descripcion": "Bio detallada con gustos específicos o señales de peligro",
  "fotos_emoji": ["emoji1", "emoji2", "emoji3"],
  "esSeguro": ${esSeguro},
  "razon": "Explicación educativa de por qué es seguro o qué señales de peligro tiene"
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
              maxOutputTokens: 500, 
              temperature: 1.3
            }
          }),
        }
      );

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No candidates in response");
      }

      const content = data.candidates[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error("No content");
      }

      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const profileData = JSON.parse(cleanContent);

      if (!profileData.nombre || !profileData.descripcion) {
        throw new Error("Invalid profile data");
      }

      const avatarPath = getRandomAvatar(profileData.esSeguro, profileData.genero);

      return { ...profileData, avatarPath, generadoPorIA: true };

    } catch (error) {
      console.error("Error AI completo:", error);
      
      const fallbackProfiles = [
        {
          nombre: "GamerKid2012",
          genero: "niño",
          edad: "11 años",
          ubicacion: "Ciudad de México",
          descripcion: "Me encanta jugar Minecraft y construir castillos. Mi personaje favorito es Steve.",
          fotos_emoji: ["🎮", "🏰", "⛏️"],
          esSeguro: true,
          razon: "Es un niño con intereses normales y no pide información personal.",
          avatarPath: getRandomAvatar(true, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "SuperAdult99",
          genero: "niño",
          edad: "35 años",
          ubicacion: "No dice",
          descripcion: "Hola niños, quiero ser su amigo. Les puedo dar robux gratis si me dan su contraseña.",
          fotos_emoji: ["💰", "🎁", "⚠️"],
          esSeguro: false,
          razon: "Es un adulto que ofrece regalos a cambio de información personal. ¡Muy peligroso!",
          avatarPath: getRandomAvatar(false, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "Princess_Luna",
          genero: "niña",
          edad: "10 años",
          ubicacion: "Guadalajara",
          descripcion: "Me gusta dibujar y jugar Roblox con mis amigas. Colecciono unicornios.",
          fotos_emoji: ["🦄", "🎨", "👑"],
          esSeguro: true,
          razon: "Es una niña con intereses apropiados para su edad.",
          avatarPath: getRandomAvatar(true, "niña"),
          generadoPorIA: false
        },
        {
          nombre: "xXx_DarkLord_xXx",
          genero: "niño",
          edad: "No dice",
          ubicacion: "No dice",
          descripcion: "Agregame y te envío mi WhatsApp. Puedo darte todo lo que quieras si me mandas fotos.",
          fotos_emoji: ["📱", "🚨", "⛔"],
          esSeguro: false,
          razon: "Pide datos de contacto y fotos. Es muy sospechoso y peligroso.",
          avatarPath: getRandomAvatar(false, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "BuilderBoy",
          genero: "niño",
          edad: "12 años",
          ubicacion: "Monterrey",
          descripcion: "Soy fan de Fortnite y me gusta hacer mapas creativos. Juego después de la escuela.",
          fotos_emoji: ["🎯", "🏗️", "🎮"],
          esSeguro: true,
          razon: "Comparte intereses normales sin pedir información sensible.",
          avatarPath: getRandomAvatar(true, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "CuteKitty88",
          genero: "niña",
          edad: "9 años",
          ubicacion: "Puebla",
          descripcion: "Amo a los gatos y jugar Among Us. Tengo 3 gatitos en casa.",
          fotos_emoji: ["🐱", "🎮", "🌸"],
          esSeguro: true,
          razon: "Perfil infantil apropiado sin señales de peligro.",
          avatarPath: getRandomAvatar(true, "niña"),
          generadoPorIA: false
        },
        {
          nombre: "FreeGifts4U",
          genero: "niño",
          edad: "No dice",
          ubicacion: "Desconocida",
          descripcion: "Te doy skins gratis de Fortnite. Solo necesito tu usuario y contraseña. También puedo darte V-Bucks.",
          fotos_emoji: ["💎", "🎁", "⚠️"],
          esSeguro: false,
          razon: "Intento de estafa. Nunca compartas tu contraseña con nadie.",
          avatarPath: getRandomAvatar(false, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "SportsFan123",
          genero: "niño",
          edad: "11 años",
          ubicacion: "Querétaro",
          descripcion: "Me gusta el fútbol y jugar FIFA. Mi equipo favorito es el Barcelona.",
          fotos_emoji: ["⚽", "🎮", "🏆"],
          esSeguro: true,
          razon: "Intereses deportivos normales para su edad.",
          avatarPath: getRandomAvatar(true, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "Mystery_Adult",
          genero: "niño",
          edad: "28 años",
          ubicacion: "No dice",
          descripcion: "Quiero conocer niños para jugar. Puedo ser tu mentor. Hablemos en privado, no le digas a tus papás.",
          fotos_emoji: ["🎮", "🚨", "⛔"],
          esSeguro: false,
          razon: "Adulto que busca contacto privado con menores. Extremadamente peligroso.",
          avatarPath: getRandomAvatar(false, "niño"),
          generadoPorIA: false
        },
        {
          nombre: "ArtistGirl",
          genero: "niña",
          edad: "12 años",
          ubicacion: "Tijuana",
          descripcion: "Me encanta dibujar anime y hacer videos de TikTok. Sueño con ser animadora.",
          fotos_emoji: ["🎨", "✨", "📱"],
          esSeguro: true,
          razon: "Intereses creativos apropiados para su edad.",
          avatarPath: getRandomAvatar(true, "niña"),
          generadoPorIA: false
        }
      ];
      
      return fallbackProfiles[Math.floor(Math.random() * fallbackProfiles.length)];
    }
  };

  const iniciarJuego = async () => {
    setLoading(true);
    setPuntosPartida(0);
    setDecisionesCorrectas(0);
    setMostrandoResultado(false);
    setMensaje('');
    
    // ✅ Resetear el ref sincrónicamente
    avataresUsadosRef.current = {
        GIRL: [],
        BOY: [],
        WARNING: []
    };
    
    try {
      const promises = Array(GAME_CONSTANTS.NUM_PROFILES).fill().map(() => generateProfile());
      const perfilesGenerados = await Promise.all(promises);
      
      setPerfilesRestantes(perfilesGenerados.slice(1));
      setPerfilActual(perfilesGenerados[0]);
      setGameState('playing');
    } catch (error) {
      console.error("Error al iniciar juego:", error);
      const perfilesGenerados = await Promise.all(
        Array(GAME_CONSTANTS.NUM_PROFILES).fill().map(() => generateProfile())
      );
      setPerfilesRestantes(perfilesGenerados.slice(1));
      setPerfilActual(perfilesGenerados[0]);
      setGameState('playing');
    } finally {
      setLoading(false);
    }
  };

  const tomarDecision = (esAceptar) => {
    if (mostrandoResultado) return;

    const acerto = (esAceptar === perfilActual.esSeguro);

    if (acerto) {
        setMensaje(`✅ ¡Bien hecho! ${perfilActual.razon}`);
        setDecisionesCorrectas(prev => prev + 1);
        setPuntosPartida(prev => prev + GAME_CONSTANTS.SCORE_PER_CORRECT_ANSWER);
    } else {
        setMensaje(`❌ ¡Cuidado! ${perfilActual.razon}`);
    }

    setMostrandoResultado(true);

    setTimeout(() => {
        if (perfilesRestantes.length > 0) {
            setPerfilActual(perfilesRestantes[0]);
            setPerfilesRestantes(prev => prev.slice(1));
            setMostrandoResultado(false);
            setMensaje('');
        } else {
            finalizarPartida();
        }
    }, 3500);
  };

  const finalizarPartida = () => {
      const puntosTotales = (perfilActivo?.puntos || 0) + puntosPartida;
      actualizarPuntos(puntosTotales);
      setGameState('end');
  };

  if (loading) return (
    <div style={styles.centerContainer}>
        <Loader className="animate-spin" size={48} color="#4CAF50" />
        <p style={{marginTop: 20, fontFamily: 'Poppins'}}>Buscando perfiles en la red...</p>
    </div>
  );

  return (
    <div style={styles.container}>
        <div style={styles.header}>
            <h1 style={{margin: 0, fontSize: '28px'}}>🏘️ Aldea de Amigos</h1>
            <p style={{opacity: 0.9}}>Decide quién entra a tu círculo de confianza.</p>
        </div>

        {gameState === 'playing' && perfilActual && (
            <div style={styles.cardContainer}>
                
                {perfilActual.generadoPorIA && (
                    <div style={styles.iaBadge}>
                        🤖 Generado por IA
                    </div>
                )}
                
                {!perfilActual.generadoPorIA && (
                    <div style={styles.fallbackBadge}>
                        💾 Perfil de respaldo
                    </div>
                )}
                
                <div style={styles.avatarContainer}>
                    <img src={perfilActual.avatarPath} alt="Avatar" style={styles.avatarImg} />
                </div>

                <h2 style={styles.username}>{perfilActual.nombre}</h2>

                <div style={styles.infoGrid}>
                    <div style={styles.infoBox}>
                        <User size={16} color="#555" /> <strong>Edad:</strong> {perfilActual.edad}
                    </div>
                    <div style={styles.infoBox}>
                        <MapPin size={16} color="#555" /> <strong>Ubicación:</strong> {perfilActual.ubicacion}
                    </div>
                </div>

                <div style={styles.descBox}>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', marginBottom:'5px', color:'#333'}}>
                        <FileText size={16} /> <strong>Descripción:</strong>
                    </div>
                    <p style={{margin:0, fontSize:'15px', color:'#444'}}>{perfilActual.descripcion}</p>
                </div>

                <div style={{marginTop: '15px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'5px', marginBottom:'5px', fontSize:'14px', fontWeight:'bold', color:'#333'}}>
                        <ImageIcon size={16} /> Fotos del perfil:
                    </div>
                    <div style={{display:'flex', gap:'10px', fontSize:'24px'}}>
                        {perfilActual.fotos_emoji && perfilActual.fotos_emoji.map((e, i) => <span key={i}>{e}</span>)}
                    </div>
                </div>

                {mostrandoResultado && (
                    <div style={styles.feedbackOverlay}>
                        <div style={{
                            background: 'white', padding: '20px', borderRadius: '15px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxWidth: '90%'
                        }}>
                            <p style={{fontSize:'18px', fontWeight:'bold', color: '#333', margin: 0}}>{mensaje}</p>
                        </div>
                    </div>
                )}

                <div style={styles.buttonGroup}>
                    <button 
                        style={{...styles.btn, backgroundColor: '#dc3545', boxShadow: '0 4px 0 #c82333'}} 
                        onClick={() => tomarDecision(false)}
                        disabled={mostrandoResultado}
                    >
                        ❌ Rechazar
                    </button>
                    <button 
                        style={{...styles.btn, backgroundColor: '#28a745', boxShadow: '0 4px 0 #218838'}} 
                        onClick={() => tomarDecision(true)}
                        disabled={mostrandoResultado}
                    >
                        ✅ Aceptar
                    </button>
                </div>
            </div>
        )}

        {gameState === 'intro' && (
            <div style={styles.cardContainer}>
                <h2 style={{color: '#2c3e50'}}>¡Filtra tus solicitudes!</h2>
                <p style={{lineHeight: 1.6}}>Te llegarán solicitudes de amistad. Revisa sus fotos, descripción y edad.</p>
                <div style={{background: '#fff3cd', padding: '15px', borderRadius: '10px', margin: '15px 0', borderLeft: '4px solid #ffc107'}}>
                    <p style={{margin: 0, fontSize: '14px'}}><strong>Tip:</strong> Si algo se ve raro (piden datos, son adultos, o fotos extrañas), recházalo.</p>
                </div>
                <button style={styles.btnStart} onClick={iniciarJuego}>🎮 Empezar</button>
            </div>
        )}

        {gameState === 'end' && (
            <div style={styles.cardContainer}>
                <h2 style={{color: '#2c3e50'}}>¡Partida Terminada!</h2>
                <p>Aciertos: <strong>{decisionesCorrectas}</strong> / {GAME_CONSTANTS.NUM_PROFILES}</p>
                <div style={styles.scoreBox}>
                    💰 +{puntosPartida} Puntos guardados
                </div>
                <button style={styles.btnStart} onClick={() => navigate('/menu-juegos')}>🏠 Volver al Menú</button>
                <button style={{...styles.btnStart, marginTop:'10px', background:'#2196F3', boxShadow: '0 4px 0 #1976D2'}} onClick={iniciarJuego}>🔄 Jugar otra vez</button>
            </div>
        )}
    </div>
  );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #43e97b 0%, #38f9d7 100%)',
        fontFamily: "'Poppins', sans-serif",
        padding: '20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    centerContainer: {
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8'
    },
    header: {
        color: 'white', textAlign: 'center', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    cardContainer: {
        background: 'white', width: '100%', maxWidth: '400px', borderRadius: '25px', padding: '30px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.15)', textAlign: 'left', position: 'relative', overflow: 'hidden'
    },
    avatarContainer: {
        display: 'flex', justifyContent: 'center', marginBottom: '15px'
    },
    avatarImg: {
        width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #f8f9fa', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    },
    username: {
        textAlign: 'center', color: '#2c3e50', margin: '0 0 20px 0', fontSize: '26px', fontWeight: '800'
    },
    infoGrid: {
        display: 'flex', gap: '10px', marginBottom: '15px'
    },
    infoBox: {
        flex: 1, background: '#f8f9fa', padding: '12px', borderRadius: '12px', fontSize: '14px',
        display: 'flex', alignItems: 'center', gap: '8px', color: '#555'
    },
    descBox: {
        background: '#e9ecef', padding: '15px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5'
    },
    buttonGroup: {
        display: 'flex', gap: '15px', marginTop: '25px'
    },
    btn: {
        flex: 1, padding: '15px', border: 'none', borderRadius: '15px', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.1s'
    },
    btnStart: {
        width: '100%', padding: '16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '15px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 0 #388E3C'
    },
    feedbackOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 20, animation: 'fadeIn 0.2s'
    },
    scoreBox: {
        background: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginTop: '15px', border: '2px dashed #ffeeba'
    },
    iaBadge: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '15px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(102,126,234,0.4)'
    },
    fallbackBadge: {
        background: '#ff9800',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '15px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(255,152,0,0.4)'
    }
};

export default JuegoAldeaAmigos;