import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from '../perfil/PerfilContext'; 
import './Menu.css';

// Importación de imágenes (Rutas relativas desde src/menu)
import fondoTesoro from '../assets/images/fondoTesoro.png';
import fondoAldea from '../assets/images/fondoAmigos.png';
import fondoEscudo from '../assets/images/fondoEscudo.png';
import iconoTesoro from '../assets/images/tesoroIcono.png'; 
import iconoEscudo from '../assets/images/escudoIcono.png'; 
import iconoAldea from '../assets/images/amigosIcono.png';

export default function Menu() {
  const navigate = useNavigate();
  const { perfilActivo, actualizarPerfil, cerrarSesionTutor } = usePerfil();
  
  // Estado local para el switch, sincronizado con la BD
  const [modoEnfoque, setModoEnfoque] = useState(perfilActivo?.modoEnfoque || false);

  const juegos = [
    {
      id: "tesoro-privacidad",
      titulo: "Tesoro de Privacidad",
      descripcion: "Protege tus datos más valiosos arrastrándolos al cofre de seguridad.",
      objetivo: "Aprender a identificar datos sensibles.",
      icono: iconoTesoro,
      fondo: fondoTesoro,
      theme: {
        bgGradient: 'linear-gradient(135deg, #bd693fff 30%, #fcff58ff 100%)', 
        primary: '#7b3500ff', accent: '#c94000ff',      
        buttonBg: 'linear-gradient(to right, #ffe368ff 0%, #ef6b00ff 100%)', 
        buttonShadow: '0 10px 20px rgba(79, 172, 254, 0.6)', 
        colorDesc: '#ffffff', colorObj: '#330700ff', 
      },
      focusTheme: {
        bgGradient: '#fff9ebff', 
        primary: '#373700ff', accent: '#704d00ff',
        buttonBg: '#dfdc13ff', 
        buttonShadow: 'none',
        colorDesc: '#1f0c02ff', colorObj: '#211000ff',
        keywords: ['Protege', 'datos', 'valiosos', 'arrastrándolos', 'cofre de seguridad'],
      }
    },
    {
      id: "escudo-respeto",
      titulo: "Escudo de Respeto",
      descripcion: "Elige estrategias para defenderte del ciberacoso.",
      objetivo: "Aprender estrategias contra el bullying.",
      icono: iconoEscudo,
      fondo: fondoEscudo, 
      theme: {
        bgGradient: 'linear-gradient(135deg, #7858d2ff 0%, #bce8f9ff 100%)', 
        primary: '#16004cff', accent: '#054789ff',      
        buttonBg: 'linear-gradient(to right, #83fff1ff 0%, #ad36fcff 100%)', 
        buttonShadow: '0 10px 20px rgba(221, 36, 118, 0.4)', 
        colorDesc: '#ffffff', colorObj: '#000000ff',    
      },
      focusTheme: {
        bgGradient: '#d9fbf3ff', 
        primary: '#010c2cff', accent: '#0b8779ff',
        buttonBg: '#1efff4ff',
        buttonShadow: 'none',
        colorDesc: '#040c38ff', colorObj: '#000937ff',
        keywords: ['Elige', 'estrategias', 'defenderte', 'ciberacoso'], 
      }
    },
    {
      id: "aldea-amigos",
      titulo: "Aldea de Amigos",
      descripcion: "Evalúa perfiles en la red social y detecta quién es confiable.",
      objetivo: "Aprender a identificar perfiles peligrosos.",
      icono: iconoAldea,
      fondo: fondoAldea,
      theme: {
        bgGradient: 'linear-gradient(135deg, #203b00ff 0%, #dfffa7ff 100%)', 
        primary: '#004219ff', accent: '#006a05ff',      
        buttonBg: 'linear-gradient(to right, #a3ff8eff 0%, #057564ff 100%)', 
        buttonShadow: '0 10px 20px rgba(183, 33, 255, 0.4)', 
        colorDesc: '#ffffff', colorObj: '#210e56ff', 
      },
      focusTheme: {
        bgGradient: '#e5ffdeff',
        primary: '#042807ff', accent: '#008b05ff',
        buttonBg: '#62d033ff',
        buttonShadow: 'none',
        colorDesc: '#003004ff', colorObj: '#062d00ff',
        keywords: ['Evalúa perfiles', 'red social', 'confiable', 'detecta'], 
      }
    },
  ];

  const [juegoSeleccionado, setJuegoSeleccionado] = useState(juegos[0]);

  // CORRECCIÓN: Función de resaltado limpia que no concatena erróneamente
  const highlightKeywords = (text, keywords, color) => {
    if (!keywords || !text) return text;
    // Creamos un regex que busque todas las palabras a la vez
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      keywords.some(kw => kw.toLowerCase() === part.toLowerCase()) 
        ? <span key={i} style={{ color: color, fontWeight: '800' }}>{part}</span> 
        : part
    );
  };

  const toggleModoEnfoque = async (e) => {
    const nuevoEstado = e.target.checked;
    setModoEnfoque(nuevoEstado);
    if (perfilActivo) {
      await actualizarPerfil({ modoEnfoque: nuevoEstado });
    }
  };

  const temaActual = modoEnfoque ? juegoSeleccionado.focusTheme : juegoSeleccionado.theme;

  return (
    <div className="contenedor_Menu">
      
      {/* COLUMNA IZQUIERDA */}
      <div className="columna_Sidebar" style={{backgroundColor: modoEnfoque ? '#f5f5f5' : '#FFFFFF'}}>
        
        <div className="view_InfoUsuario" style={{
          background: modoEnfoque ? '#209589ff' : 'linear-gradient(to bottom, #2ae4fdff 0%, #f8f9fa 100%)'
        }}>
          <img src={perfilActivo?.avatarSrcS} alt="Avatar" className="img_Perfil" />
          <div className="text_NombreUsuario" style={{color: modoEnfoque ? '#fff' : '#2d3748'}}>{perfilActivo?.nombre}</div>
          <div className="text_ApodoUsuario" style={{color: modoEnfoque ? '#cfd8dc' : '#33435bff'}}>@{perfilActivo?.apodo}</div>
          
          <div className="container_ModoToggle" style={{backgroundColor: modoEnfoque ? '#05573cff' : '#ffcc00ff'}}>
            <label className="lbl_ModoEnfoque">
              <input type="checkbox" checked={modoEnfoque} onChange={toggleModoEnfoque} />
              <span>{modoEnfoque ? "🧘 Modo Enfoque ON" : "🧠 Modo Enfoque OFF"}</span>
            </label>
          </div>
        </div>

        <div className="lista_JuegosArea">
          {juegos.map((j) => {
            const isSelected = juegoSeleccionado.id === j.id;
            return (
              <div 
                key={j.id} 
                className={`item_Juego ${isSelected ? 'item_Juego_Activo' : ''}`}
                onClick={() => setJuegoSeleccionado(j)}
                style={{
                  backgroundColor: isSelected ? (modoEnfoque ? '#b0bec5' : `${j.theme.accent}20`) : 'transparent',
                  border: `1px solid ${isSelected ? (modoEnfoque ? '#546e7a' : j.theme.accent) : 'rgba(0,0,0,0.1)'}`,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <span style={{color: isSelected ? (modoEnfoque ? '#000' : j.theme.primary) : '#4a5568', fontWeight: isSelected ? '700' : '500'}}>
                  {j.titulo}
                </span>
                <img src={j.icono} alt="ico" className="img_IconoJuego" style={{
                   filter: isSelected ? (modoEnfoque ? 'none' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))') : 'grayscale(20%) opacity(0.8)',
                   transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                }} />
              </div>
            );
          })}
        </div>

        <div className="view_PiePagina">
          <div className="btn_CerrarSesionCirculo" onClick={() => { cerrarSesionTutor(); navigate('/profiles'); }}>
            <span style={{ fontSize: '24px' }}>👋</span>
          </div>
        </div>
      </div>

      {/* DERECHA (CONTENIDO) */}
      <div className="view_ContenidoJuego" style={{ background: temaActual.bgGradient }}>
        <img 
          src={juegoSeleccionado.fondo} 
          className={`img_FondoFlotante ${modoEnfoque ? '' : 'animacion_flotar'}`}
          style={{ opacity: modoEnfoque ? 0.5 : 0.9 }}
          alt="fondo"
        />

        <div className="container_TextoInformativo">
          <div className="view_TituloHeader" style={{
            background: modoEnfoque ? '#fff' : 'rgba(255, 255, 255, 0.6)', 
            backdropFilter: modoEnfoque ? 'none' : 'blur(10px)',
            borderTop: modoEnfoque ? '1px solid #ccc' : '1px solid rgba(255, 255, 255, 0.4)',
            borderBottom: modoEnfoque ? '1px solid #ccc' : '1px solid rgba(255, 255, 255, 0.4)',
            borderLeft: modoEnfoque ? '1px solid #ccc' : '1px solid rgba(255, 255, 255, 0.4)',
            borderRight: 'none'
          }}>
            <h1 style={{ margin: 0, fontSize: '36px', color: temaActual.primary }}>{juegoSeleccionado.titulo}</h1>
          </div>

          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <div style={{ flex: 1, maxWidth: '50%', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <p className="text_DescripcionJuego" style={{ color: temaActual.colorDesc }}>
                {modoEnfoque 
                  ? highlightKeywords(juegoSeleccionado.descripcion, temaActual.keywords, temaActual.accent) 
                  : juegoSeleccionado.descripcion
                }
              </p>
              
              <div className="card_Objetivo" style={{
                background: modoEnfoque ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                borderLeft: `5px solid ${temaActual.accent}`
              }}>
                <div style={{ fontSize: '14px', color: temaActual.accent, fontWeight: '800' }}>🎯 Objetivo</div>
                <div style={{ fontSize: '18px', color: temaActual.colorObj, fontWeight: '600' }}>{juegoSeleccionado.objetivo}</div>
              </div>
            </div>
          </div>

          <button 
            className="btn_JugarAhora"
            onClick={() => navigate(`/juego/${juegoSeleccionado.id}`)}
            style={{
              background: temaActual.buttonBg,
              color: modoEnfoque ? '#000' : 'white', 
              border: modoEnfoque ? '2px solid #fff' : 'none',
              boxShadow: temaActual.buttonShadow,
              transform: modoEnfoque ? 'none' : undefined
            }}
          >
            ¡Jugar Ahora!
          </button>
        </div>
      </div>
    </div>
  );
}