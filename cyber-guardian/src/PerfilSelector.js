import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';

// Importar imágenes desde assets
import conejoImg from './assets/images/conejo.jpeg';
import loboImg from './assets/images/lobo.jpeg'; // Asegúrate de tener esta imagen

export default function ProfileSelector() {
  const navigate = useNavigate();
  const { guardarPerfil } = usePerfil();

  const perfiles = [
    {
      id: 1,
      nombre: 'Mariana',
      apodo: 'Warrior',
      avatar: conejoImg,
      color: '#9b59b6'
    },
    {
      id: 2,
      nombre: 'Mario',
      apodo: 'Shadow',
      avatar: loboImg,
      color: '#3498db'
    }
  ];

  const handleSelectProfile = (perfil) => {
    // Guardar el perfil en el contexto
    const perfilData = {
      id: perfil.id,
      nombre: perfil.nombre,
      apodo: perfil.apodo,
      avatar: perfil.avatar,
      modoEnfoque: false,
      fechaCreacion: new Date().toISOString(),
      nivelActual: 1,
      puntosExperiencia: 0,
    };

    const guardadoExitoso = guardarPerfil(perfilData, false);
    
    if (guardadoExitoso) {
      console.log('Perfil guardado:', perfilData);
      // Navegar a tu pantalla principal del juego
      // Ajusta esta ruta según tu App.js
      navigate('/menu-juego'); 
    } else {
      alert('Error al guardar el perfil');
    }
  };

  const handleAddProfile = () => {
    navigate('/add-profile');
  };

  const handleManageProfiles = () => {
    navigate('/manage-profiles');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>CYBER GUARDIAN</h1>
        <h2 style={styles.subtitle}>¿Quién eres? Elige tu perfil</h2>

        <div style={styles.profilesContainer}>
          {perfiles.map((perfil) => (
            <div
              key={perfil.id}
              style={styles.profileCard}
              onClick={() => handleSelectProfile(perfil)}
            >
              <div
                style={{
                  ...styles.profileAvatar,
                  borderColor: perfil.color
                }}
              >
                <img
                  src={perfil.avatar}
                  alt={perfil.nombre}
                  style={styles.avatarImage}
                />
              </div>
              <div style={styles.profileName}>{perfil.nombre}</div>
            </div>
          ))}

          <div style={styles.profileCard} onClick={handleAddProfile}>
            <div style={styles.addProfile}>
              <div style={styles.addIcon}>+</div>
            </div>
            <div style={styles.profileName}>Añadir perfil</div>
          </div>
        </div>

        <button style={styles.manageButton} onClick={handleManageProfiles}>
          ADMINISTRAR PERFILES
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    textAlign: 'center',
    maxWidth: '1200px',
    width: '100%',
  },
  title: {
    fontSize: '3.5rem',
    color: 'white',
    marginBottom: '1rem',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: '2rem',
    color: 'white',
    marginBottom: '3rem',
    fontWeight: '400',
  },
  profilesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  profileCard: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  profileAvatar: {
    width: '180px',
    height: '180px',
    borderRadius: '10px',
    border: '4px solid',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  profileName: {
    fontSize: '1.3rem',
    color: '#e0e0e0',
    fontWeight: '500',
  },
  addProfile: {
    width: '180px',
    height: '180px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '2px dashed rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  addIcon: {
    fontSize: '5rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  manageButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
};