import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext'; 
import './AnadirPerfil.css'; 

// Importación de imágenes
import aguijaImg from '../assets/images/fenixC.png';
import conejoImg from '../assets/images/conejoC.png';
import loboImg from '../assets/images/loboC.png';
import toroImg from '../assets/images/vacaC.png';
import tiburonImg from '../assets/images/tiburonC.png';
import tortugaImg from '../assets/images/tortugaC.png';
import dragonImg from '../assets/images/dragonC.png';
import gatoImg from '../assets/images/gatoC.png';
import koalaImg from '../assets/images/koalaC.png';
import leonImg from '../assets/images/leonC.png';
import mariposaImg from '../assets/images/mariposaC.png';
import osoImg from '../assets/images/osoC.png';
import kirbyImg from '../assets/images/kirbyC.png';

// Importación de variantes (S, Es, Am) se mantienen igual en tu carpeta assets...
import aguilaSImg from '../assets/images/fenixS.png';
import conejoSImg from '../assets/images/conejoS.png';
import loboSImg from '../assets/images/perroS.png';
import toroSImg from '../assets/images/vacaS.png';
import tiburonSImg from '../assets/images/tiburonS.png';
import tortugaSImg from '../assets/images/tortugaS.png';
import dragonSImg from '../assets/images/dragonS.png';
import gatoSImg from '../assets/images/gatoS.png';
import koalaSImg from '../assets/images/koalaS.png';
import leonSImg from '../assets/images/leonS.png';
import mariposaSImg from '../assets/images/mariposaS.png';
import osoSImg from '../assets/images/osoS.png';
import kirbySImg from '../assets/images/kirbyS.png';
import aguilaEsImg from '../assets/images/aguilaEs.png';
import conejoEsImg from '../assets/images/conejoEs.png';
import loboEsImg from '../assets/images/loboEs.png';
import toroEsImg from '../assets/images/vacaEs.png';
import tiburonEsImg from '../assets/images/tiburonEs.png';
import tortugaEsImg from '../assets/images/tortugaEs.png';
import dragonEsImg from '../assets/images/dragonEs.png';
import gatoEsImg from '../assets/images/gatoEs.png';
import koalaEsImg from '../assets/images/koalaEs.png';
import leonEsImg from '../assets/images/leonEs.png';
import mariposaEsImg from '../assets/images/mariposaEs.png';
import osoEsImg from '../assets/images/osoEs.png';
import kirbyEsImg from '../assets/images/kirbuEs.png';
import aguilaAmImg from '../assets/images/aguilaAm.png';
import conejoAmImg from '../assets/images/conejoAm.png';
import loboAmImg from '../assets/images/loboAm.png';
import toroAmImg from '../assets/images/toroAm.png';
import tiburonAmImg from '../assets/images/tiburonAm.png';
import tortugaAmImg from '../assets/images/tortugaAm.png';
import dragonAmImg from '../assets/images/dragonAm.png';
import gatoAmImg from '../assets/images/gatoAm.png';
import koalaAmImg from '../assets/images/koalaAm.png';
import leonAmImg from '../assets/images/leonAm.png';
import mariposaAmImg from '../assets/images/mariposaAm.png';
import osoAmImg from '../assets/images/osoAm.png';
import kirbyAmImg from '../assets/images/kirbyAm.png';

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

  const handleContinue = async () => {
    if (!name.trim() || !nickname.trim() || !selectedAvatar) {
      alert('Por favor completa todos los campos y selecciona un avatar');
      return;
    }

    const avatar = avatars.find(a => a.id === selectedAvatar);
    
    // Los datos que se guardarán en Firestore
    const perfilData = {
      nombre: name.trim(),
      apodo: nickname.trim(),
      avatar: avatar.src,
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

    // Usamos agregarPerfil del contexto, que ya tiene la lógica de Firestore
    const exito = await agregarPerfil(perfilData);
    
    if (exito) {
      console.log("Perfil guardado con éxito");
      navigate('/profiles');
    } else {
      alert("Hubo un problema al guardar el perfil. Intenta de nuevo.");
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Seguro que quieres cancelar?')) {
      navigate('/profiles');
    }
  };

  const selectedAvatarData = avatars.find(a => a.id === selectedAvatar);

  return (
    <div className="container_Principal">
      <div className="content_Area">
        <h1 className="title_Encabezado">Añadir perfil</h1>
        <p className="subtitle_Descripcion">Crea un perfil para jugar en Safe Steps.</p>

        <div className="container_Formulario">
          <div className="section_Avatar">
            <div className="container_AvatarSeleccionado">
              {selectedAvatar ? (
                <div 
                  className="view_Avatar" 
                  style={{ backgroundColor: selectedAvatarData.color }}
                  onClick={() => setShowModal(true)}
                >
                  <img 
                    src={selectedAvatarData.src} 
                    alt={selectedAvatarData.name}
                    className="img_Avatar"
                  />
                </div>
              ) : (
                <div className="placeholder_Avatar" onClick={() => setShowModal(true)}>
                  <span className="text_Placeholder">?</span>
                </div>
              )}
            </div>

            <button className="btn_ElegirAvatar" onClick={() => setShowModal(true)}>
              Elegir Avatar
            </button>
          </div>

          <div className="section_Campo">
            <label className="lbl_Etiqueta">Nombre</label>
            <input
              type="text"
              className="txt_Entrada"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              maxLength={20}
            />
          </div>

          <div className="section_Campo">
            <label className="lbl_Etiqueta">Apodo</label>
            <input
              type="text"
              className="txt_Entrada"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Apodo"
              maxLength={15}
            />
          </div>
        </div>

        <div className="container_Acciones">
          <button className="btn_Continuar" onClick={handleContinue}>
            Continuar
          </button>

          <button className="btn_Cancelar" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal_Fondo" onClick={() => setShowModal(false)}>
          <div className="modal_Contenido" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal_Titulo">Selecciona tu avatar</h2>
            <div className="grid_Avatares">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="option_Avatar"
                  style={{
                    backgroundColor: avatar.color,
                    border: selectedAvatar === avatar.id ? '4px solid white' : '4px solid transparent'
                  }}
                  onClick={() => { setSelectedAvatar(avatar.id); setShowModal(false); }}
                >
                  <img 
                    src={avatar.src} 
                    alt={avatar.name}
                    className="img_OpcionAvatar"
                  />
                </div>
              ))}
            </div>
            <button className="btn_CerrarModal" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}