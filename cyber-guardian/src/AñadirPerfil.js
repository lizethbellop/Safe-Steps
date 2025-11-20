import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';

// Importar TODAS tus imágenes disponibles
import aguijaImg from './assets/images/aguila.jpeg';
import conejoImg from './assets/images/conejo.jpeg';
import loboImg from './assets/images/lobo.jpeg';
import toroImg from './assets/images/toro.jpeg';
import tiburonImg from './assets/images/tiburon.jpeg';
import tortugaImg from './assets/images/tortuga.jpeg';
import dragonImg from './assets/images/dragon.jpeg';
import gatoImg from './assets/images/gato.jpeg';

export default function AñadirPerfil() {
  const navigate = useNavigate();
  const { agregarPerfil } = usePerfil();
  
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const avatars = [
    // TODAS tus imágenes de animales
    { id: 1, type: 'image', src: conejoImg, name: 'Conejo', color: '#9b59b6' },
    { id: 2, type: 'image', src: loboImg, name: 'Lobo', color: '#3498db' },
    { id: 3, type: 'image', src: toroImg, name: 'Toro', color: '#8b4513' },
    { id: 4, type: 'image', src: aguijaImg, name: 'Águila', color: '#f39c12' },
    { id: 5, type: 'image', src: tiburonImg, name: 'Tiburón', color: '#3498db' },
    { id: 6, type: 'image', src: tortugaImg, name: 'Tortuga', color: '#27ae60' },
    { id: 7, type: 'image', src: dragonImg, name: 'Dragón', color: '#e74c3c' },
    { id: 8, type: 'image', src: gatoImg, name: 'Gato', color: '#e67e22' },
    
    // Emojis adicionales
    { id: 9, emoji: '🦸‍♀️', name: 'Superheroína', color: '#e91e63' },
    { id: 10, emoji: '🥷', name: 'Ninja', color: '#9c27b0' },
    { id: 11, emoji: '👸', name: 'Princesa', color: '#ff69b4' },
    { id: 12, emoji: '🧙‍♂️', name: 'Mago', color: '#3f51b5' },
    { id: 13, emoji: '🤖', name: 'Robot', color: '#607d8b' },
    { id: 14, emoji: '🦸‍♂️', name: 'Superhéroe', color: '#f44336' },
    { id: 15, emoji: '🧚‍♀️', name: 'Hada', color: '#00bcd4' },
    { id: 16, emoji: '🦄', name: 'Unicornio', color: '#e91e63' },
  ];

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
      avatarNombre: avatar.name,
      avatarColor: avatar.color,
      modoEnfoque: false,
      fechaCreacion: new Date().toISOString(),
      nivelActual: 1,
      puntosExperiencia: 0,
    };

    // Guardar perfil en la lista de perfiles
    const guardadoExitoso = agregarPerfil(perfilData);
    
    if (guardadoExitoso) {
      console.log('Perfil creado y guardado:', perfilData);
      // ✅ Volver a la pantalla de selección de perfiles
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
        <p style={styles.subtitle}>Crea un perfil para jugar en Cyber Guardian.</p>

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
          <button style={styles.continueButton} onClick={handleContinue}>
            Continuar
          </button>
          <button style={styles.cancelButton} onClick={handleCancel}>
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
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
    color: '#a0a0a0',
    marginBottom: '40px',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    backgroundColor: '#2a2a3e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px dashed rgba(255, 255, 255, 0.3)',
  },
  placeholderText: {
    fontSize: '4rem',
    color: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
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
    color: '#a0a0a0',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    backgroundColor: '#555',
    color: 'white',
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
    backgroundColor: 'white',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s',
    flex: 1,
  },
  cancelButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s',
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
    maxHeight: '80vh',
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