import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';

import JuegoTesoroPrivacidad from './juegos/JuegoTesoroPrivacidad';
import JuegoEscudoRespeto from './juegos/JuegoEscudoRespeto';
import JuegoAldeaAmigos from './juegos/JuegoAldeaAmigos';

const ContenedorJuego = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { perfilActivo, cargando, tieneSesion } = usePerfil();

  React.useEffect(() => {
    if (!cargando && !tieneSesion()) {
      navigate('/'); 
    }
  }, [cargando, tieneSesion, navigate]);

  const obtenerComponenteJuego = () => {
    const modoEnfoque = perfilActivo?.modoEnfoque || false;

    switch (id) {
      case 'tesoro-privacidad':
        return <JuegoTesoroPrivacidad modoEnfoque={modoEnfoque} />;
      case 'escudo-respeto':
        return <JuegoEscudoRespeto modoEnfoque={modoEnfoque} />;
      case 'aldea-amigos':
        return <JuegoAldeaAmigos modoEnfoque={modoEnfoque} />;
      default:
        return (
          <div style={styles.error}>
            <h2>❌ Juego no encontrado</h2>
            <p>El juego "{id}" no existe.</p>
            <button 
              style={styles.botonVolver}
              onClick={() => navigate('/menu')}
            >
              🏠 Volver al Menú
            </button>
          </div>
        );
    }
  };

  if (cargando) {
    return (
      <div style={styles.loading}>
        <p>⏳ Cargando juego...</p>
      </div>
    );
  }

  if (!perfilActivo) {
    return null;
  }

  return (
    <div style={perfilActivo.modoEnfoque ? styles.containerEnfoque : styles.containerStandard}>
      <div style={styles.juegoContainer}>
        {obtenerComponenteJuego()}
      </div>
    </div>
  );
};

// Estilos
const styles = {
  containerStandard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif"
  },
  containerEnfoque: {
    minHeight: '100vh',
    background: '#f5f5f0',
    padding: '20px',
    fontFamily: "'Arial', sans-serif"
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '24px',
    color: '#333',
    backgroundColor: '#f5f5f5'
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#333',
    textAlign: 'center',
    padding: '20px'
  },
  botonVolver: {
    marginTop: '20px',
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  juegoContainer: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  }
};

export default ContenedorJuego;