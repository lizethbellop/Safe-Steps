import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext'; 

// Importar TODAS tus imágenes disponibles (Necesarias para el modal y la selección)
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


// Definición de avatares (copiado de AñadirPerfil para consistencia)
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

export default function ManageProfiles() {
    const navigate = useNavigate();
    const { perfilesGuardados, editarPerfil, eliminarPerfil } = usePerfil();

    // Estado para el perfil que está siendo editado
    const [perfilSeleccionado, setPerfilSeleccionado] = useState(null);
    
    // Estados para los datos del formulario
    const [nombreInput, setNombreInput] = useState('');
    const [apodoInput, setApodoInput] = useState('');
    
    // Estado para gestionar el cambio de avatar ANTES de guardar
    const [newSelectedAvatarId, setNewSelectedAvatarId] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    // Seleccionar el primer perfil y sincronizar inputs al cargar o cambiar de lista
    useEffect(() => {
        if (!perfilSeleccionado && perfilesGuardados.length > 0) {
            setPerfilSeleccionado(perfilesGuardados[0]);
        }
    }, [perfilesGuardados]);

    // Sincronizar inputs y resetear selección de avatar cuando cambia el perfil
    useEffect(() => {
        if (perfilSeleccionado) {
            setNombreInput(perfilSeleccionado.nombre);
            setApodoInput(perfilSeleccionado.apodo || '');
            
            // Determinar el ID del avatar actual para precargar en el modal
            const currentAvatarData = avatars.find(a => a.src === perfilSeleccionado.avatar);
            setNewSelectedAvatarId(currentAvatarData ? currentAvatarData.id : null);
        } else {
            setNombreInput('');
            setApodoInput('');
            setNewSelectedAvatarId(null);
        }
    }, [perfilSeleccionado]);

    // Manejador para seleccionar un perfil de la lista
    const handleSelectProfile = (perfil) => {
        setPerfilSeleccionado(perfil);
    };
    
    // Manejador para la selección dentro del modal
    const handleAvatarSelect = (avatarId) => {
        setNewSelectedAvatarId(avatarId);
        setShowAvatarModal(false);
    };

    // Manejador para guardar los cambios
    const handleGuardar = () => {
        if (!perfilSeleccionado) return;

        // Validación
        if (!nombreInput.trim()) {
            alert('El nombre del perfil no puede estar vacío.'); 
            return;
        }
        
        // 🟢 Aseguramos que editarPerfil exista
        if (typeof editarPerfil !== 'function') {
            alert("Error interno: La función de edición no está disponible.");
            return;
        }

        let newAvatarData = null;
        if (newSelectedAvatarId) {
            newAvatarData = avatars.find(a => a.id === newSelectedAvatarId);
        }

        const datosActualizados = {
            ...perfilSeleccionado,
            nombre: nombreInput.trim(),
            apodo: apodoInput.trim(),
            // Actualizar el avatar y color si se seleccionó uno nuevo
            ...(newAvatarData && {
                avatar: newAvatarData.src,
                avatarColor: newAvatarData.color,
                avatarSrcS: newAvatarData.srcS,
                avatarEs: newAvatarData.srcEs,
                avatarAm: newAvatarData.srcAm,
                avatarNombre: newAvatarData.name,
            }),
        };

        const guardadoExitoso = editarPerfil(datosActualizados);

        if (guardadoExitoso) {
            alert(`Perfil '${nombreInput.trim()}' guardado exitosamente.`);
            setPerfilSeleccionado(datosActualizados); 
        } else {
            alert('Error al guardar el perfil. Revisa el PerfilContext.');
        }
    };

    // Manejador para cancelar la edición
    const handleCancelar = () => {
        navigate('/profiles'); // Volver a la pantalla de selección de perfiles
    };
    
    // Manejador para eliminar el perfil
    const handleEliminar = () => {
        if (!perfilSeleccionado) return;
        
        if (window.confirm(`¿Estás seguro de que quieres eliminar el perfil de ${perfilSeleccionado.nombre}? Esta acción es irreversible.`)) {
            const eliminacionExitosa = eliminarPerfil(perfilSeleccionado.id);
            
            if (eliminacionExitosa) {
                console.log(`Perfil de ${perfilSeleccionado.nombre} eliminado.`);
                setPerfilSeleccionado(null); // Deseleccionar
            } else {
                console.error('Error al eliminar el perfil.');
            }
        }
    };

    // Obtener los datos del avatar que se muestran actualmente (incluyendo la preselección del modal)
    const avatarDataToShow = newSelectedAvatarId 
        ? avatars.find(a => a.id === newSelectedAvatarId)
        : perfilSeleccionado ? avatars.find(a => a.src === perfilSeleccionado.avatar) : null;
        
    const finalAvatarSrc = avatarDataToShow ? avatarDataToShow.src : (perfilSeleccionado?.avatar || null);
    const finalAvatarColor = avatarDataToShow ? avatarDataToShow.color : (perfilSeleccionado?.avatarColor || '#3498db');


    return (
        <div style={styles.container}>
            <div style={styles.manageContainer}>
                
                <h2 style={styles.title}>Administrar Perfiles</h2>

                <div style={styles.mainContent}>
                    
                    {/* Columna Izquierda: Menú de Perfiles */}
                    <div style={styles.profileList}>
                        <div style={styles.listHeader}>Selecciona un perfil:</div>
                        <div style={styles.profileListScroll}>
                            {perfilesGuardados.map((perfil) => (
                                <div
                                    key={perfil.id}
                                    style={{
                                        ...styles.profileListItem,
                                        ...(perfilSeleccionado?.id === perfil.id ? styles.profileListItemActive : {})
                                    }}
                                    onClick={() => handleSelectProfile(perfil)}
                                >
                                    <div 
                                        style={{ 
                                            ...styles.profileAvatarMini,
                                            backgroundColor: perfil.avatarColor || '#3498db',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <img 
                                            src={perfil.avatar} // Usamos la URL guardada del perfil
                                            alt={perfil.nombre}
                                            style={styles.avatarImageMini}
                                        />
                                    </div>
                                    <div style={styles.profileText}>
                                        <div style={styles.profileName}>{perfil.nombre}</div>
                                        <div style={styles.profileApodo}>{perfil.apodo || 'Sin apodo'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Espacio azul en la parte inferior */}
                        <div style={styles.blueSpace}></div>
                    </div>
                    
                    {/* Columna Derecha: Formulario de Edición */}
                    <div style={styles.profileDetails}>
                        
                        {perfilSeleccionado ? (
                            <>
                                {/* Avatar grande y botón de edición */}
                                <div style={styles.avatarSection}>
                                    <div
                                        style={{
                                            ...styles.profileAvatarBig,
                                            backgroundColor: finalAvatarColor,
                                            borderColor: finalAvatarColor,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img 
                                            src={finalAvatarSrc} // Usamos la imagen del avatar seleccionado o el nuevo
                                            alt={perfilSeleccionado.nombre}
                                            style={styles.avatarImageBig}
                                        />
                                    </div>
                                    <div 
                                        style={styles.editIcon} 
                                        onClick={() => setShowAvatarModal(true)}
                                    >
                                        ✏️
                                    </div>
                                </div>

                                {/* Campos de Input */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nombre:</label>
                                    <input
                                        type="text"
                                        value={nombreInput}
                                        onChange={(e) => setNombreInput(e.target.value)}
                                        style={styles.input}
                                        placeholder="Input"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Apodo:</label>
                                    <input
                                        type="text"
                                        value={apodoInput}
                                        onChange={(e) => setApodoInput(e.target.value)}
                                        style={styles.input}
                                        placeholder="Input"
                                    />
                                </div>
                                
                                {/* Botones de acción (Eliminar, Guardar, Cancelar) */}
                                <div style={styles.buttonGroup}>
                                    <button 
                                        style={styles.deleteButton} 
                                        onClick={handleEliminar}
                                    >
                                        Eliminar Perfil
                                    </button>
                                    <button 
                                        style={styles.guardarButton} 
                                        onClick={handleGuardar}
                                    >
                                        Guardar
                                    </button>
                                    <button 
                                        style={styles.cancelarButton} 
                                        onClick={handleCancelar}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={styles.placeholder}>
                                {perfilesGuardados.length === 0 
                                    ? 'No hay perfiles guardados para administrar.'
                                    : 'Selecciona un perfil a la izquierda para editar sus datos.'
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modal de Selección de Avatar */}
            {showAvatarModal && (
                <div style={styles.modal} onClick={() => setShowAvatarModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Selecciona un nuevo personaje</h2>
                        <div style={styles.avatarGrid}>
                            {avatars.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    style={{
                                        ...styles.avatarOption,
                                        backgroundColor: avatar.color,
                                        border: newSelectedAvatarId === avatar.id ? '4px solid #4fa8c8ff' : '4px solid transparent'
                                    }}
                                    onClick={() => handleAvatarSelect(avatar.id)}
                                >
                                    <img 
                                        src={avatar.src} 
                                        alt={avatar.name}
                                        style={styles.avatarOptionImage}
                                    />
                                </div>
                            ))}
                        </div>
                        <button 
                            style={styles.closeModalButton}
                            onClick={() => setShowAvatarModal(false)}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos
const styles = {
    // Heredados del ProfileSelector y ajustados para no sobrepasar la pantalla
    container: {
        // Usamos 100vh, asumiendo que el App.css global corregirá el desbordamiento.
        height: '100vh', 
        background: 'linear-gradient(135deg, #0c0077ff 0%, #7152b3ff 50%, #fb9b1dff 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        fontSize: '2.5rem',
        color: 'white',
        marginBottom: '20px',
        fontWeight: '700',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    manageContainer: {
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '95vh', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
    },
    mainContent: {
        display: 'flex',
        backgroundColor: '#f1f1f1ff',
        borderRadius: '10px',
        overflow: 'hidden',
        flexGrow: 1,
    },
    profileList: {
        width: '300px', 
        minWidth: '250px',
        backgroundColor: 'white',
        borderRight: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    profileListScroll: {
        flexGrow: 1,
        overflowY: 'auto',
    },
    listHeader: {
        padding: '15px',
        fontSize: '1.1rem',
        fontWeight: '600',
        backgroundColor: '#e0e0e0',
        color: '#333',
        borderBottom: '1px solid #ccc',
        flexShrink: 0,
    },
    profileListItem: {
        padding: '15px', 
        paddingLeft: '15px',
        borderLeft: '4px solid transparent', 
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderBottom: '1px solid #eee',
        backgroundColor: '#ffffff',
    },
    profileListItemActive: {
        backgroundColor: '#ddedf9',
        borderLeft: '4px solid #3498db',
    },
    profileAvatarMini: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
    },
    avatarImageMini: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        borderRadius: '50%',
    },
    profileText: {
        display: 'flex',
        flexDirection: 'column',
    },
    profileName: {
        fontWeight: '600',
        color: '#333',
    },
    profileApodo: {
        fontSize: '0.85rem',
        color: '#666',
    },
    blueSpace: {
        flexShrink: 0,
        height: '50px',
        backgroundColor: '#3498db',
    },

    // Columna Derecha: Detalles del Perfil (Edición)
    profileDetails: {
        flexGrow: 1,
        padding: '30px',
        backgroundColor: '#f1f1f1ff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
    },
    placeholder: {
        marginTop: '100px',
        fontSize: '1.2rem',
        color: '#777',
        textAlign: 'center',
    },
    
    // Sección del Avatar Grande y Botón de Edición
    avatarSection: {
        position: 'relative',
        marginBottom: '40px',
        marginTop: '20px',
    },
    profileAvatarBig: {
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        border: '6px solid', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    avatarImageBig: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        borderRadius: '50%',
    },
    editIcon: {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        width: '40px',
        height: '40px',
        backgroundColor: '#fff8dfff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#ffecd1ff',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        zIndex: 10,
        transition: 'transform 0.2s',
        // Nota: Los pseudo-selectores como '&:hover' solo funcionan con librerías como styled-components o Emotion.
        // Aquí los dejamos como referencia, pero se recomienda usar CSS externo o JS para el hover.
        '&:hover': {
            transform: 'scale(1.1)',
        }
    },

    // Campos de Input (sin cambios significativos)
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '400px',
    },
    label: {
        fontSize: '1.1rem',
        fontWeight: '600',
        marginRight: '10px',
        width: '80px',
        textAlign: 'right',
        color: '#444',
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
    },

    // 🌟 ESTILOS DE BOTONES BONITOS Y FUNCIONALES 🌟
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        width: '100%',
        maxWidth: '400px',
        marginTop: '40px',
        marginBottom: '20px',
    },
    guardarButton: {
        padding: '10px 30px',
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #4fa8c8ff, #0439b6ff)', // Gradiente del botón ADMINISTRAR PERFILES
        color: 'white',
        border: 'none',
        borderRadius: '50px', // Más redondeado
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 4px 10px rgba(40, 4, 111, 0.4)',
        transition: 'all 0.25s',
    },
    cancelarButton: {
        padding: '10px 30px',
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #ffcf70ff, #eb7f03ff)',
        color: 'white',
        border: 'none',
        borderRadius: '50px', // Más redondeado
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 4px 10px rgba(162, 162, 162, 0.4)',
        transition: 'all 0.25s',
    },
    deleteButton: {
        padding: '10px 30px',
        fontSize: '1rem',
        backgroundColor: '#dc3545', // Rojo para eliminar
        color: 'white',
        border: 'none',
        borderRadius: '50px', // Más redondeado
        cursor: 'pointer',
        fontWeight: '700',
        marginRight: 'auto',
        boxShadow: '0 4px 10px rgba(220, 53, 69, 0.4)',
        transition: 'all 0.25s',
    },
    // Estilos del Modal... 
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