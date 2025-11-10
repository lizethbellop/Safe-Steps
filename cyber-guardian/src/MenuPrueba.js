import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';

function MenuPrueba() {
  const navigate = useNavigate();
  const { perfilActivo, guardarPerfil, actualizarModoEnfoque } = usePerfil();
  const [modoEnfoque, setModoEnfoque] = useState(perfilActivo?.modoEnfoque || false);
  
  const jugar = (juegoId) => {
    // Si no hay perfil, crear uno temporal
    if (!perfilActivo) {
      const perfil = {
        nombre: "Jugador de Prueba",
        modoEnfoque: modoEnfoque
      };
      guardarPerfil(perfil);
    } else {
      // Si ya hay perfil, solo actualizar el modo enfoque si cambió
      if (perfilActivo.modoEnfoque !== modoEnfoque) {
        actualizarModoEnfoque(modoEnfoque);
      }
    }
    
    // Ir al juego
    navigate(`/juego/${juegoId}`);
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>🎮 Juegos Educativos de Seguridad Digital</h1>
      
      {/* Selector de modo */}
      <div style={styles.modoSelector}>
        <label style={styles.labelModo}>
          <input 
            type="checkbox"
            checked={modoEnfoque}
            onChange={(e) => setModoEnfoque(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.textoModo}>
            {modoEnfoque ? '🧠 Modo Mariana (Enfoque/TDAH)' : '🎨 Modo Mario (Normal)'}
          </span>
        </label>
        <p style={styles.descripcionModo}>
          {modoEnfoque 
            ? 'Colores neutros, interfaz simplificada, menos distracciones'
            : 'Colores vibrantes, animaciones, experiencia completa'
          }
        </p>
      </div>
      
      {/* Botones de juegos */}
      <div style={styles.juegosGrid}>
        <div style={styles.tarjetaJuego}>
          <div style={styles.iconoJuego}>💎</div>
          <h2 style={styles.tituloJuego}>Tesoro de Privacidad</h2>
          <p style={styles.descripcion}>
            Arrastra tus datos personales al cofre seguro antes de que lleguen los ladrones
          </p>
          <div style={styles.objetivo}>
            <strong>🎯 Objetivo:</strong> No compartir datos personales
          </div>
          <button 
            onClick={() => jugar('tesoro-privacidad')}
            style={styles.botonJugar}
          >
            ▶️ Jugar Ahora
          </button>
        </div>
        
        <div style={styles.tarjetaJuego}>
          <div style={styles.iconoJuego}>🛡️</div>
          <h2 style={styles.tituloJuego}>Escudo de Respeto</h2>
          <p style={styles.descripcion}>
            Salta, usa tu escudo y reporta situaciones de bullying en este runner 2D
          </p>
          <div style={styles.objetivo}>
            <strong>🎯 Objetivo:</strong> Qué hacer contra el bullying
          </div>
          <button 
            onClick={() => jugar('escudo-respeto')}
            style={styles.botonJugar}
          >
            ▶️ Jugar Ahora
          </button>
        </div>
        
        <div style={styles.tarjetaJuego}>
          <div style={styles.iconoJuego}>🏘️</div>
          <h2 style={styles.tituloJuego}>Aldea de Amigos</h2>
          <p style={styles.descripcion}>
            Revisa perfiles y decide si son seguros o peligrosos. Aprende a detectar señales de riesgo
          </p>
          <div style={styles.objetivo}>
            <strong>🎯 Objetivo:</strong> No aceptar extraños
          </div>
          <button 
            onClick={() => jugar('aldea-amigos')}
            style={styles.botonJugar}
          >
            ▶️ Jugar Ahora
          </button>
        </div>
      </div>
      
      {/* Info adicional */}
      <div style={styles.infoFooter}>
        <p style={styles.textoInfo}>
          💡 <strong>Nota:</strong> Esta versión va directo a los juegos (sin videos/audios introductorios)
        </p>
        <p style={styles.textoInfo}>
          🎮 Todos los juegos son completamente funcionales y educativos
        </p>
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    minHeight: '100vh',
    background: '#87CEEB',
    padding: '40px 20px',
    fontFamily: "'Poppins', -apple-system, sans-serif"
  },
  titulo: {
    color: 'white',
    fontSize: '42px',
    textAlign: 'center',
    marginBottom: '40px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    fontWeight: 'bold'
  },
  modoSelector: {
    maxWidth: '600px',
    margin: '0 auto 50px',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  labelModo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333'
  },
  checkbox: {
    width: '24px',
    height: '24px',
    cursor: 'pointer'
  },
  textoModo: {
    fontSize: '22px'
  },
  descripcionModo: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  },
  juegosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto 40px',
    padding: '0 20px'
  },
  tarjetaJuego: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconoJuego: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  tituloJuego: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '15px',
    textAlign: 'center'
  },
  descripcion: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
    textAlign: 'center',
    flexGrow: 1
  },
  objetivo: {
    backgroundColor: '#f0f0f0',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    width: '100%',
    textAlign: 'center',
    fontSize: '14px',
    color: '#333'
  },
  botonJugar: {
    width: '100%',
    padding: '15px 30px',
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
  infoFooter: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '20px',
    borderRadius: '15px',
    textAlign: 'center'
  },
  textoInfo: {
    margin: '10px 0',
    fontSize: '15px',
    color: '#333'
  }
};

export default MenuPrueba;