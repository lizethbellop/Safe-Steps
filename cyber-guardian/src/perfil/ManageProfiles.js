import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext'; 
import { auth, db } from '../config/firebaseConfig';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './ManageProfiles.css'; 

// Importación de imágenes (se mantienen igual)
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

// Variantes (S, Es, Am)
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

const avatars = [
    { id: 1, src: conejoImg, srcS:conejoSImg, srcEs:conejoEsImg, srcAm:conejoAmImg, name: 'Conejo', color: '#3b9cd8ff' }, 
    { id: 2, src: loboImg, srcS:loboSImg, srcEs:loboEsImg, srcAm:loboAmImg, name: 'Lobo', color: '#90ef6dff' },   
    { id: 3, src: toroImg, srcS:toroSImg, srcEs:toroEsImg, srcAm:toroAmImg, name: 'Toro', color: '#6eeceaff' },   
    { id: 4, src: aguijaImg, srcS:aguilaSImg, srcEs:aguilaEsImg, srcAm:aguilaAmImg, name: 'Águila', color: '#cadbeeff' }, 
    { id: 5, src: tiburonImg, srcS:tiburonSImg, srcEs:tiburonEsImg, srcAm:tiburonAmImg, name: 'Tiburón', color: '#f0acf2ff' }, 
    { id: 6, src: tortugaImg, srcS:tortugaSImg, srcEs:tortugaEsImg, srcAm:tortugaAmImg, name: 'Tortuga', color: '#f7f381ff' }, 
    { id: 7, src: dragonImg, srcS:dragonSImg, srcEs:dragonEsImg, srcAm:dragonAmImg, name: 'Dragón', color: '#f4b5cdff' }, 
    { id: 8, src: gatoImg, srcS:gatoSImg, srcEs:gatoEsImg, srcAm:gatoAmImg, name: 'Gato', color: '#f7ceaeff' },   
    { id: 9, src: koalaImg, srcS:koalaSImg, srcEs:koalaEsImg, srcAm:koalaAmImg, name: 'Koala', color: '#b9f9a7ff' },  
    { id: 10, src: leonImg, srcS:leonSImg, srcEs:leonEsImg, srcAm:leonAmImg, name: 'Leon', color: '#cbfcffff' },  
    { id: 11, src: mariposaImg, srcS:mariposaSImg, srcEs:mariposaEsImg, srcAm:mariposaAmImg, name: 'Mariposa', color: '#fff5bdff' }, 
    { id: 12, src: osoImg, srcS:osoSImg, srcEs:osoEsImg, srcAm:osoAmImg, name: 'Oso', color: '#e1d8ffff' },    
    { id: 13, src: kirbyImg, srcS:kirbySImg, srcEs:kirbyEsImg, srcAm:kirbyAmImg, name: 'Kirby', color: '#ffdcf6ff' },
];

export default function ManageProfiles() {
    const navigate = useNavigate();
    const { perfilesGuardados } = usePerfil();

    const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
    const [nombreInput, setNombreInput] = useState('');
    const [apodoInput, setApodoInput] = useState('');
    const [newSelectedAvatarId, setNewSelectedAvatarId] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    useEffect(() => {
        if (!perfilSeleccionado && perfilesGuardados.length > 0) {
            setPerfilSeleccionado(perfilesGuardados[0]);
        }
    }, [perfilesGuardados]);

    useEffect(() => {
        if (perfilSeleccionado) {
            setNombreInput(perfilSeleccionado.nombre);
            setApodoInput(perfilSeleccionado.apodo || '');
            const currentAvatarData = avatars.find(a => a.src === perfilSeleccionado.avatar);
            setNewSelectedAvatarId(currentAvatarData ? currentAvatarData.id : null);
        }
    }, [perfilSeleccionado]);

    const handleGuardar = async () => {
        if (!perfilSeleccionado || !auth.currentUser) return;
        if (!nombreInput.trim()) { alert('El nombre no puede estar vacío.'); return; }

        const avatarData = avatars.find(a => a.id === newSelectedAvatarId);
        
        try {
            const perfilRef = doc(db, "usuarios", auth.currentUser.uid, "perfiles", perfilSeleccionado.id);
            await updateDoc(perfilRef, {
                nombre: nombreInput.trim(),
                apodo: apodoInput.trim(),
                avatar: avatarData.src,
                avatarColor: avatarData.color,
                avatarSrcS: avatarData.srcS,
                avatarEs: avatarData.srcEs,
                avatarAm: avatarData.srcAm,
                avatarNombre: avatarData.name,
            });
            alert('Perfil actualizado correctamente.');
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert('Error al guardar los cambios.');
        }
    };

    const handleEliminar = async () => {
        if (!perfilSeleccionado || !auth.currentUser) return;
        
        if (window.confirm(`¿Eliminar permanentemente a ${perfilSeleccionado.nombre}?`)) {
            try {
                await deleteDoc(doc(db, "usuarios", auth.currentUser.uid, "perfiles", perfilSeleccionado.id));
                setPerfilSeleccionado(null);
                alert('Perfil eliminado.');
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const avatarToShow = avatars.find(a => a.id === newSelectedAvatarId) || {};

    return (
        <div className="container_Principal">
            <div className="container_Gestion">
                <h2 className="title_Encabezado">Administrar Perfiles</h2>

                <div className="content_Principal">
                    <div className="view_ListaPerfiles">
                        <div className="header_Lista">Selecciona un perfil:</div>
                        <div className="scroll_ListaPerfiles">
                            {perfilesGuardados.map((perfil) => (
                                <div
                                    key={perfil.id}
                                    className={`item_PerfilLista ${perfilSeleccionado?.id === perfil.id ? 'item_PerfilLista_Activo' : ''}`}
                                    onClick={() => setPerfilSeleccionado(perfil)}
                                >
                                    <div className="avatar_Mini" style={{ backgroundColor: perfil.avatarColor }}>
                                        <img src={perfil.avatar} alt={perfil.nombre} className="img_AvatarMini" />
                                    </div>
                                    <div className="text_PerfilInfo">
                                        <div className="text_Nombre">{perfil.nombre}</div>
                                        <div className="text_Apodo">{perfil.apodo || 'Sin apodo'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="space_AzulInferior"></div>
                    </div>
                    
                    <div className="view_DetallesPerfil">
                        {perfilSeleccionado ? (
                            <>
                                <div className="section_AvatarGrande">
                                    <div className="avatar_Grande" style={{ backgroundColor: avatarToShow.color, borderColor: avatarToShow.color }}>
                                        <img src={avatarToShow.src} alt="avatar" className="img_AvatarGrande" />
                                    </div>
                                    <div className="icon_Editar" onClick={() => setShowAvatarModal(true)}>✏️</div>
                                </div>

                                <div className="group_Input">
                                    <label className="lbl_Etiqueta">Nombre:</label>
                                    <input className="txt_Entrada" type="text" value={nombreInput} onChange={(e) => setNombreInput(e.target.value)} />
                                </div>
                                <div className="group_Input">
                                    <label className="lbl_Etiqueta">Apodo:</label>
                                    <input className="txt_Entrada" type="text" value={apodoInput} onChange={(e) => setApodoInput(e.target.value)} />
                                </div>
                                
                                <div className="container_Botones">
                                    <button className="btn_Eliminar" onClick={handleEliminar}>Eliminar Perfil</button>
                                    <button className="btn_Guardar" onClick={handleGuardar}>Guardar</button>
                                    <button className="btn_Cancelar" onClick={() => navigate('/profiles')}>Cancelar</button>
                                </div>
                            </>
                        ) : (
                            <div className="text_Placeholder">Selecciona un perfil para editar.</div>
                        )}
                    </div>
                </div>
            </div>

            {showAvatarModal && (
                <div className="modal_Fondo" onClick={() => setShowAvatarModal(false)}>
                    <div className="modal_Contenido" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal_Titulo">Selecciona un nuevo personaje</h2>
                        <div className="grid_Avatares">
                            {avatars.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    className="option_Avatar"
                                    style={{ backgroundColor: avatar.color, outline: newSelectedAvatarId === avatar.id ? '4px solid #4fa8c8ff' : 'none' }}
                                    onClick={() => { setNewSelectedAvatarId(avatar.id); setShowAvatarModal(false); }}
                                >
                                    <img src={avatar.src} alt={avatar.name} className="img_OpcionAvatar" />
                                </div>
                            ))}
                        </div>
                        <button className="btn_CerrarModal" onClick={() => setShowAvatarModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}