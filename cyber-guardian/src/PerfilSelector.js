import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';
import logo from './assets/images/logo.png';   
import ManageProfiles from './ManageProfiles';

export default function ProfileSelector() {
  const navigate = useNavigate();
  const { perfilesGuardados, seleccionarPerfil } = usePerfil();

  const handleSelectProfile = (perfil) => {
    const guardadoExitoso = seleccionarPerfil(perfil.id);

    if (guardadoExitoso) {
      console.log('Perfil seleccionado:', perfil);
      navigate('/menu-juegos');
    } else {
      alert('Error al seleccionar el perfil');
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

        {/* LOGO DEL JUEGO */}
        <img
          src={logo}
          alt="logo juego"
          style={styles.logo}
        />

        <h2 style={styles.subtitle}>¿Quién eres? Elige tu perfil</h2>

        <div style={styles.profilesContainer}>
          {perfilesGuardados.map((perfil) => (
            <div
              key={perfil.id}
              style={styles.profileCard}
              onClick={() => handleSelectProfile(perfil)}
            >
              <div
                style={{
                  ...styles.profileAvatar,
                  borderColor: perfil.avatarColor || '#3498db',
                  backgroundColor: perfil.avatarColor || '#3498db'
                }}
              >
                {typeof perfil.avatar === 'string' && perfil.avatar.startsWith('data:') ? (
                  <img
                    src={perfil.avatar}
                    alt={perfil.nombre}
                    style={styles.avatarImage}
                  />
                ) : typeof perfil.avatar === 'string' && perfil.avatar.length <= 4 ? (
                  <span style={styles.avatarEmoji}>{perfil.avatar}</span>
                ) : (
                  <img
                    src={perfil.avatar}
                    alt={perfil.nombre}
                    style={styles.avatarImage}
                  />
                )}
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

        {perfilesGuardados.length > 0 && (
          <button style={styles.manageButton} onClick={handleManageProfiles}>
            ADMINISTRAR PERFILES
          </button>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0c0077ff 0%, #7152b3ff 50%, #9f1dfbff 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    textAlign: 'center',
    maxWidth: '900px',
    width: '100%',
  },
  logo: {
    width: '180px',
    height: 'auto',
    marginBottom: '20px',
    filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.4))'
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
  avatarEmoji: {
    fontSize: '5rem',
  },
  profileName: {
    fontSize: '1.3rem',
    color: '#f1f1f1ff',
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
    color: 'rgba(255, 255, 255, 0.75)',
  },
  manageButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    background: 'linear-gradient(135deg, #4fa8c8ff, #28046fff)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontWeight: '700',
    letterSpacing: '0.5px',
    margin: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
};
