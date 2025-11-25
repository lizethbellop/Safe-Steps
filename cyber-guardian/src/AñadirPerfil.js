import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';

// Importar TODAS tus imágenes disponibles
import aguijaImg from './assets/images/fenixC.png';
import conejoImg from './assets/images/conejoC.png';
import loboImg from './assets/images/loboC.png';
import toroImg from './assets/images/vacaC.png';
import tiburonImg from './assets/images/tiburonC.png';
import tortugaImg from './assets/images/tortugaC.png';
import dragonImg from './assets/images/dragonC.png';
import gatoImg from './assets/images/gatoC.png';
import koalaImg from './assets/images/koalaC.png';
import leonImg from './assets/images/leonC.png';
import mariposaImg from './assets/images/mariposaC.png';
import osoImg from './assets/images/osoC.png';
import kirbyImg from './assets/images/kirbyC.png';
// saludo
import aguilaSImg from './assets/images/fenixS.png';
import conejoSImg from './assets/images/conejoS.png';
import loboSImg from './assets/images/perroS.png';
import toroSImg from './assets/images/vacaS.png';
import tiburonSImg from './assets/images/tiburonS.png';
import tortugaSImg from './assets/images/tortugaS.png';
import dragonSImg from './assets/images/dragonS.png';
import gatoSImg from './assets/images/gatoS.png';
import koalaSImg from './assets/images/koalaS.png';
import leonSImg from './assets/images/leonS.png';
import mariposaSImg from './assets/images/mariposaS.png';
import osoSImg from './assets/images/osoS.png';
import kirbySImg from './assets/images/kirbyS.png';
// escudo
import aguilaEsImg from './assets/images/aguilaEs.png';
import conejoEsImg from './assets/images/conejoEs.png';
import loboEsImg from './assets/images/loboEs.png';
import toroEsImg from './assets/images/vacaEs.png';
import tiburonEsImg from './assets/images/tiburonEs.png';
import tortugaEsImg from './assets/images/tortugaEs.png';
import dragonEsImg from './assets/images/dragonEs.png';
import gatoEsImg from './assets/images/gatoEs.png';
import koalaEsImg from './assets/images/koalaEs.png';
import leonEsImg from './assets/images/leonEs.png';
import mariposaEsImg from './assets/images/mariposaEs.png';
import osoEsImg from './assets/images/osoEs.png';
import kirbyEsImg from './assets/images/kirbuEs.png';
// amigo
import aguilaAmImg from './assets/images/aguilaAm.png';
import conejoAmImg from './assets/images/conejoAm.png';
import loboAmImg from './assets/images/loboAm.png';
import toroAmImg from './assets/images/toroAm.png';
import tiburonAmImg from './assets/images/tiburonAm.png';
import tortugaAmImg from './assets/images/tortugaAm.png';
import dragonAmImg from './assets/images/dragonAm.png';
import gatoAmImg from './assets/images/gatoAm.png';
import koalaAmImg from './assets/images/koalaAm.png';
import leonAmImg from './assets/images/leonAm.png';
import mariposaAmImg from './assets/images/mariposaAm.png';
import osoAmImg from './assets/images/osoAm.png';
import kirbyAmImg from './assets/images/kirbyAm.png';

export default function AñadirPerfil() {
  const navigate = useNavigate();
  const { agregarPerfil } = usePerfil();
  
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const avatars = [
    { id: 1, type: 'image', src: conejoImg, srcS:conejoSImg, srcEs:conejoEsImg, srcAm:conejoAmImg, name: 'Conejo', color: '#3b9cd8ff' }, 
    { id: 2, type: 'image', src: loboImg, srcS:loboSImg, srcEs:loboEsImg, srcAm:loboAmImg, name: 'Lobo', color: '#90ef6dff' },   
    { id: 3, type: 'image', src: toroImg, srcS:toroSImg, srcEs:toroEsImg, srcAm:toroAmImg, name: 'Toro', color: '#6eeceaff' },   
    { id: 4, type: 'image', src: aguijaImg, srcS:aguilaSImg, srcEs:aguilaEsImg, srcAm:aguilaAmImg, name: 'Águila', color: '#cadbeeff' }, 
    { id: 5, type: 'image', src: tiburonImg, srcS:tiburonSImg, srcEs:tiburonEsImg, srcAm:tiburonAmImg, name: 'Tiburón', color: '#f0acf2ff' }, 
    { id: 6, type: 'image', src: tortugaImg, srcS:tortugaSImg, srcEs:tortugaEsImg, srcAm:tortugaAmImg, name: 'Tortuga', color: '#f7f381ff' }, 
    { id: 7, type: 'image', src: dragonImg, srcS:dragonSImg, srcEs:dragonEsImg, srcAm:dragonAmImg, name: 'Dragón', color: '#f4b5cdff' }, 
    { id: 8, type: 'image', src: gatoImg, srcS:gatoSImg, srcEs:gatoEsImg, srcAm:gatoAmImg, name: 'Gato', color: '#f7ceaeff' },   
    { id: 9, type: 'image', src: koalaImg, srcS:koalaSImg, srcEs:koalaEsImg, srcAm:koalaAmImg, name: 'Koala', color: '#b9f9a7ff' },  
    { id: 10, type: 'image', src: leonImg, srcS:leonSImg, srcEs:leonEsImg, srcAm:leonAmImg, name: 'Leon', color: '#cbfcffff' },  
    { id: 11, type: 'image', src: mariposaImg, srcS:mariposaSImg, srcEs:mariposaEsImg, srcAm:mariposaAmImg, name: 'Mariposa', color: '#fff5bdff' }, 
    { id: 12, type: 'image', src: osoImg, srcS:osoSImg, srcEs:osoEsImg, srcAm:osoAmImg, name: 'Oso', color: '#e1d8ffff' },    
    { id: 13, type: 'image', src: kirbyImg, srcS:kirbySImg, srcEs:kirbyEsImg, srcAm:kirbyAmImg, name: 'Kirby', color: '#ffdcf6ff' },
  ];

  const buttonHover = {
    transform: 'scale(1.08)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
  };

  const handleContinue = () => {
    if (!name.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    if (!nickname.trim()) {
      alert('Por favor ingresa un apodo');
      return;
    }

    if (!selectedAvatar) {
      alert('Por favor selecciona un avatar');
      return;
    }

    const avatar = avatars.find(a => a.id === selectedAvatar);
    
    const perfilData = {
      id: Date.now(),
      nombre: name.trim(),
      apodo: nickname.trim(),
      avatar: avatar.src || avatar.emoji,
      avatarSrcS: avatar.srcS,
      avatarEs: avatar.srcEs,
      avatarAm: avatar.srcAm,
      avatarNombre: avatar.name,
      avatarColor: avatar.color,
      modoEnfoque: false,
      fechaCreacion: new Date().toISOString(),
      nivelActual: 1,
      puntosExperiencia: 0,
    };

    const guardadoExitoso = agregarPerfil(perfilData);
    
    if (guardadoExitoso) {
      navigate('/profiles');
    } else {
      alert('Error al guardar el perfil. Por favor intenta de nuevo.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Seguro que quieres cancelar?')) {
      navigate('/profiles');
    }
  };

  const selectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
    setShowModal(false);
  };

  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Añadir perfil</h1>
        <p style={styles.subtitle}>Crea un perfil para jugar en Safe Steps.</p>

        <div style={styles.formContainer}>
          {/* Avatar Selection */}
          <div style={styles.avatarSection}>
            <div style={styles.selectedAvatarContainer}>
              {selectedAvatar ? (
                <div 
                  style={{
                    ...styles.selectedAvatar,
                    backgroundColor: selectedAvatarData.color
                  }}
                  onClick={() => setShowModal(true)}
                >
                  {selectedAvatarData.type === 'image' ? (
                    <img 
                      src={selectedAvatarData.src} 
                      alt={selectedAvatarData.name}
                      style={styles.selectedAvatarImage}
                    />
                  ) : (
                    <span style={styles.selectedAvatarEmoji}>
                      {selectedAvatarData.emoji}
                    </span>
                  )}
                </div>
              ) : (
                <div 
                  style={styles.selectedAvatarPlaceholder}
                  onClick={() => setShowModal(true)}
                >
                  <span style={styles.placeholderText}>?</span>
                </div>
              )}
            </div>

            <button 
              style={styles.chooseAvatarButton} 
              onClick={() => setShowModal(true)}
            >
              Elegir Avatar
            </button>
          </div>

          {/* Name Input */}
          <div style={styles.inputSection}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              style={styles.input}
              maxLength={20}
            />
          </div>

          {/* Nickname Input */}
          <div style={styles.inputSection}>
            <label style={styles.label}>Apodo</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Apodo"
              style={styles.input}
              maxLength={15}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.continueButton}
            onClick={handleContinue}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseLeave={(e) => {
              e.target.style.transform = styles.continueButton.transform || "scale(1)";
              e.target.style.boxShadow = styles.continueButton.boxShadow;
            }}
          >
            Continuar
          </button>

          <button
            style={styles.cancelButton}
            onClick={handleCancel}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
            onMouseLeave={(e) => {
              e.target.style.transform = styles.cancelButton.transform || "scale(1)";
              e.target.style.boxShadow = styles.cancelButton.boxShadow;
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Selecciona tu avatar</h2>
            <div style={styles.avatarGrid}>
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  style={{
                    ...styles.avatarOption,
                    backgroundColor: avatar.color,
                    border: selectedAvatar === avatar.id ? '4px solid white' : '4px solid transparent'
                  }}
                  onClick={() => selectAvatar(avatar.id)}
                >
                  {avatar.type === 'image' ? (
                    <img 
                      src={avatar.src} 
                      alt={avatar.name}
                      style={styles.avatarOptionImage}
                    />
                  ) : (
                    <span style={styles.avatarEmoji}>{avatar.emoji}</span>
                  )}
                </div>
              ))}
            </div>
            <button 
              style={styles.closeModalButton}
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #ffac5eff 0%, #ff7f1eff 50%, #ae19d7ff 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    fontSize: '3rem',
    color: 'white',
    marginBottom: '10px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#ffffffff',
    marginBottom: '40px',
  },
  formContainer: {
    backgroundColor: 'rgba(27, 19, 19, 0.06)',
    borderRadius: '10px',
    padding: '40px',
    marginBottom: '30px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '30px',
  },
  selectedAvatarContainer: {
    flexShrink: 0,
  },
  selectedAvatar: {
    width: '150px',
    height: '150px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    overflow: 'hidden',
  },
  selectedAvatarPlaceholder: {
    width: '150px',
    height: '150px',
    borderRadius: '10px',
    backgroundColor: '#2a0747ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px dashed rgba(255, 255, 255, 0.3)',
  },
  placeholderText: {
    fontSize: '4rem',
    color: 'rgba(255, 255, 255, 1)',
  },
  selectedAvatarEmoji: {
    fontSize: '5rem',
  },
  selectedAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    borderRadius: '10px',
  },
  chooseAvatarButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: 'rgba(146, 137, 137, 0.5)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontWeight: '500',
  },
  inputSection: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    color: '#ffffffff',
    fontSize: '1 rem',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    backgroundColor: '#ffffffff',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    outline: 'none',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  continueButton: {
      padding: '15px 40px',
      fontSize: '1.2rem',
      background: 'linear-gradient(135deg, #7cdafcff, #1f87ccff)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',     // ← MÁS REDONDEADO
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      flex: 1,
      margin: 0,                // ← SIN MARGEN
  },
  cancelButton: {
      padding: '15px 40px',
      fontSize: '1.2rem',
      background: 'linear-gradient(135deg, #ff8064ff, #d91031ff)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',      // ← MÁS REDONDEADO
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      margin: 0,                 // ← SIN MARGEN
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    padding: '40px',
    borderRadius: '15px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '2rem',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  avatarOption: {
    width: '100px',
    height: '100px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: '3rem',
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  closeModalButton: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};