import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';
import { Volume2, Music, Eye, Lock } from 'lucide-react'; 

// Importar sprites de avatares ACTUALIZADOS
import aguilaSprite from '../assets/images/aguila.png';
import conejoSprite from '../assets/images/conejo.png'; 
import loboSprite from '../assets/images/lobo.png'; 
import tiburonSprite from '../assets/images/tiburon.png'; 
import toroSprite from '../assets/images/toro.png'; 
import tortugaSprite from '../assets/images/tortuga.png'; 
import dragonSprite from '../assets/images/dragon.png'; 

const PUNTAJE_DESBLOQUEO = 3000;

const Configuracion = () => {
  const navigate = useNavigate();
  const { 
    perfilActivo, 
    actualizarPerfil 
  } = usePerfil();

  if (!perfilActivo) return null; 

  const [avatarSeleccionado, setAvatarSeleccionado] = useState(perfilActivo?.avatar || 'conejo');
  const [modoEnfoque, setModoEnfoque] = useState(perfilActivo?.modoEnfoque || false);
  const [volumenSonido, setVolumenSonido] = useState(perfilActivo?.volumenSonido || 50);
  const [volumenMusica, setVolumenMusica] = useState(perfilActivo?.volumenMusica || 50);
  const [musicaPreferida, setMusicaPreferida] = useState(perfilActivo?.musicaPreferida || 'jazz');

  // Avatares disponibles 
  const avatares = [
    { id: 'conejo', nombre: 'Conejo', sprite: conejoSprite, emoji: '🐇', desbloqueado: true },
    { id: 'lobo', nombre: 'Lobo', sprite: loboSprite, emoji: '🐺', desbloqueado: true },
    { id: 'tiburon', nombre: 'Tiburón', sprite: tiburonSprite, emoji: '🦈', desbloqueado: true },
    { id: 'toro', nombre: 'Toro', sprite: toroSprite, emoji: '🐂', desbloqueado: true },
    { id: 'tortuga', nombre: 'Tortuga', sprite: tortugaSprite, emoji: '🐢', desbloqueado: true },
    { id: 'aguila', nombre: 'Águila', sprite: aguilaSprite, emoji: '🦅', desbloqueado: perfilActivo.puntos >= PUNTAJE_DESBLOQUEO },
    { id: 'dragon', nombre: 'Dragón', sprite: dragonSprite, emoji: '🐉', desbloqueado: perfilActivo.puntos >= PUNTAJE_DESBLOQUEO },
  ];

  const opcionesMusica = [
    { id: 'jazz', nombre: 'Jazz Suave', emoji: '🎷' },
    { id: 'cristhians', nombre: 'Ritmos Pop', emoji: '🎤' }
  ];

  useEffect(() => {
    if (modoEnfoque) {
      setVolumenSonido(0);
      setVolumenMusica(0);
    } 
  }, [modoEnfoque]);

  // Nanejo de avatar
  const handleSelectAvatar = (avatar) => {
    if (avatar.desbloqueado) {
      setAvatarSeleccionado(avatar.id);
    } else {
      alert(`🔒 Necesitas ${PUNTAJE_DESBLOQUEO} puntos para desbloquear el avatar de ${avatar.nombre}. ¡Sigue jugando!`);
    }
  };

  const guardarCambios = () => {
    actualizarPerfil({
      avatar: avatarSeleccionado,
      modoEnfoque: modoEnfoque,
      volumenSonido: modoEnfoque ? 0 : volumenSonido,
      volumenMusica: modoEnfoque ? 0 : volumenMusica,
      musicaPreferida: musicaPreferida
    });
    alert('✅ Configuración guardada correctamente');
    navigate('/menu-juegos');
  };

  const avatarActual = avatares.find(a => a.id === avatarSeleccionado);
  
  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>⚙️ Configuración del Perfil ({perfilActivo.nombre})</h1>

      <div style={styles.contenido}>
        {/* LADO IZQUIERDO */}
        <div style={styles.ladoIzquierdo}>
          <h2 style={styles.subtitulo}>Mi Avatar (Puntos: {perfilActivo.puntos || 0})</h2>
          
          {/* Grid de avatares */}
          <div style={styles.gridAvatares}>
            {avatares.map(avatar => (
              <div
                key={avatar.id}
                style={{
                  ...styles.tarjetaAvatar,
                  border: avatarSeleccionado === avatar.id 
                    ? '4px solid #3b82f6' 
                    : '2px solid #ddd',
                  opacity: avatar.desbloqueado ? 1 : 0.5,
                  position: 'relative'
                }}
                onClick={() => handleSelectAvatar(avatar)}
              >
                {avatar.desbloqueado ? (
                  <div style={styles.emojiAvatar}>{avatar.emoji}</div>
                ) : (
                  <Lock size={30} color="#333" />
                )}
              </div>
            ))}
          </div>

          {/* Avatar grande */}
          <div style={{...styles.avatarGrande, border: '3px solid #3b82f6'}}>
            <img
              src={avatarActual.sprite}
              alt={avatarActual.nombre}
              style={styles.imagenAvatarGrande}
            />
            <p style={styles.nombreAvatar}>
              {avatarActual.emoji} {avatarActual.nombre}
            </p>
          </div>
        </div>

        {/* LADO DERECHO: Configuraciones */}
        <div style={styles.ladoDerecho}>
          {/* Modo Enfoque (TEA) */}
          <div style={{...styles.seccionConfig, backgroundColor: modoEnfoque ? '#e6f7ff' : '#fff'}}>
            <h3 style={styles.tituloSeccion}><Eye style={{marginRight: 5}} size={20} /> Modo Enfoque (TEA)</h3>
            <label style={styles.switchContainer}>
              <input
                type="checkbox"
                checked={modoEnfoque}
                onChange={(e) => setModoEnfoque(e.target.checked)}
                style={styles.inputCheckboxHidden} 
              />
              <div style={styles.switchSlider(modoEnfoque)}>
                <div style={styles.switchCircle(modoEnfoque)}></div>
              </div>
              <span style={styles.textoSwitch}>
                {modoEnfoque ? 'Activado (Paleta calmada, sin ruidos)' : 'Desactivado (Experiencia completa)'}
              </span>
            </label>
            <p style={styles.descripcion}>
              **Diseñado para niños con TEA:** Desactiva sonidos, música y animaciones complejas para una mejor concentración y menor sobrecarga sensorial.
            </p>
          </div>

          {/* Volumen Sonido */}
          <div style={styles.seccionConfig}>
            <h3 style={styles.tituloSeccion}>
              <Volume2 style={{marginRight: 5}} size={20} /> Volumen Sonido
            </h3>
            <input
              type="range"
              min="0"
              max="100"
              value={volumenSonido}
              onChange={(e) => setVolumenSonido(Number(e.target.value))}
              disabled={modoEnfoque}
              style={{
                ...styles.slider,
                opacity: modoEnfoque ? 0.4 : 1,
                cursor: modoEnfoque ? 'not-allowed' : 'pointer'
              }}
            />
            <div style={styles.valorVolumen}>{volumenSonido}% {modoEnfoque && '(Fijo por Modo Enfoque)'}</div>
          </div>

          {/* Volumen Música */}
          <div style={styles.seccionConfig}>
            <h3 style={styles.tituloSeccion}>
              <Music style={{marginRight: 5}} size={20} /> Volumen Música
            </h3>
            <input
              type="range"
              min="0"
              max="100"
              value={volumenMusica}
              onChange={(e) => setVolumenMusica(Number(e.target.value))}
              disabled={modoEnfoque}
              style={{
                ...styles.slider,
                opacity: modoEnfoque ? 0.4 : 1,
                cursor: modoEnfoque ? 'not-allowed' : 'pointer'
              }}
            />
            <div style={styles.valorVolumen}>{volumenMusica}% {modoEnfoque && '(Fijo por Modo Enfoque)'}</div>
          </div>

          {/* Elegir Música Preferida */}
          <div style={styles.seccionConfig}>
            <h3 style={styles.tituloSeccion}>
              🎶 Elegir Música Preferida
            </h3>
            <div style={styles.opcionesMusica}>
              {opcionesMusica.map(musica => (
                <div
                  key={musica.id}
                  style={{
                    ...styles.tarjetaMusica,
                    backgroundColor: musicaPreferida === musica.id 
                      ? '#e8f5e9' 
                      : 'white',
                    border: musicaPreferida === musica.id 
                      ? '3px solid #3b82f6' 
                      : '2px solid #ddd'
                  }}
                  onClick={() => setMusicaPreferida(musica.id)}
                >
                  <div style={styles.emojiMusica}>{musica.emoji}</div>
                  <div style={styles.nombreMusica}>{musica.nombre}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div style={styles.botones}>
        <button 
          style={styles.botonCancelar}
          onClick={() => navigate('/menu-juegos')}
        >
          ❌ Cancelar
        </button>
        <button 
          style={styles.botonGuardar}
          onClick={guardarCambios}
        >
          ✅ Guardar Cambios
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#E0F7FA',
    padding: '40px 20px',
    fontFamily: "'Poppins', sans-serif"
  },
  titulo: {
    fontSize: '48px',
    textAlign: 'center',
    color: '#0288d1',
    marginBottom: '40px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  },
  contenido: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '40px',
    marginBottom: '40px'
  },
  ladoIzquierdo: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  ladoDerecho: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  subtitulo: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#1565c0', 
    textAlign: 'center'
  },
  gridAvatares: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: '15px',
    marginBottom: '30px'
  },
  tarjetaAvatar: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emojiAvatar: {
    fontSize: '50px'
  },
  avatarGrande: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    border: '3px solid #3b82f6'
  },
  imagenAvatarGrande: {
    width: '150px',
    height: '150px',
    objectFit: 'cover', 
    borderRadius: '50%',
    border: '5px solid white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  nombreAvatar: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginTop: '15px',
    color: '#333'
  },
  seccionConfig: {
    marginBottom: '35px',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #e0e0e0'
  },
  tituloSeccion: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#1565c0',
    display: 'flex',
    alignItems: 'center'
  },
  inputCheckboxHidden: { 
    opacity: 0,
    width: 0,
    height: 0,
    position: 'absolute'
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px',
    cursor: 'pointer'
  },
  switchSlider: (checked) => ({
    display: 'inline-block',
    width: '60px',
    height: '30px',
    backgroundColor: checked ? '#3b82f6' : '#9ca3af',
    borderRadius: '30px',
    position: 'relative',
    transition: 'background-color 0.3s'
  }),
  switchCircle: (checked) => ({
    position: 'absolute',
    top: '3px',
    left: checked ? '33px' : '3px',
    width: '24px',
    height: '24px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'left 0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
  }),
  textoSwitch: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555'
  },
  descripcion: {
    fontSize: '14px',
    color: '#4b5563',
    fontStyle: 'italic',
    marginTop: '8px'
  },
  slider: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: '#e0e0e0',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  valorVolumen: {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  opcionesMusica: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px'
  },
  tarjetaMusica: {
    padding: '20px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  emojiMusica: {
    fontSize: '40px'
  },
  nombreMusica: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  botones: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    gap: '20px',
    justifyContent: 'center'
  },
  botonCancelar: {
    padding: '18px 50px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  },
  botonGuardar: {
    padding: '18px 50px',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease'
  }
};

export default Configuracion;