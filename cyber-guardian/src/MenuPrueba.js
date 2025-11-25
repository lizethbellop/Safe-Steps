import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';
import fondoTesoro from './assets/images/fondoTesoro.png';
import fondoAldea from './assets/images/fondoAmigos.png';
import fondoEscudo from './assets/images/fondoEscudo.png';
import iconoTesoro from './assets/images/tesoroIcono.png'; 
import iconoEscudo from './assets/images/escudoIcono.png'; 
import iconoAldea from './assets/images/amigosIcono.png';

const styles = {
  contenedor: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: "'Poppins', system-ui, sans-serif",
    overflow: 'hidden',
  },

  // --- COLUMNA IZQUIERDA (Sidebar) ---
  columnaIzquierda: {
    width: '340px',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20, 
    boxShadow: '5px 0 25px rgba(0,0,0,0.05)', 
    transition: 'background-color 0.3s ease'
  },

  infoUsuario: {
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    transition: 'background 0.3s ease'
  },

  imagenPerfil: {
    width: '110px', height: '110px', objectFit: 'cover', borderRadius: '50%', marginBottom: '15px', border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', objectPosition: 'center top',
  },
  
  placeholderImagen: {
    width: '110px', height: '110px', backgroundColor: '#f0f2f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', color: '#cbd5e0', fontWeight: 'bold', fontSize: '14px',
  },

  datosUsuario: { textAlign: 'center' },
  nombreUsuario: { fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' },
  apodoUsuario: { fontSize: '15px', fontWeight: '500' },

  // Toggle
  contenedorModo: {
    marginTop: '20px', padding: '8px 16px', borderRadius: '30px', transition: 'all 0.3s ease',
  },
  labelModo: {
    display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: '#ffffffff', fontSize: '17px', fontWeight: '600',
  },
  checkbox: { cursor: 'pointer', accentColor: '#4299e1' },

  // Lista
  listaJuegos: {
    flex: 1, flexDirection: 'column', overflowY: 'auto', padding: '20px',
  },
  
  // Footer
  pieLateral: {
    height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #ffdc9aff', background: '#fafbfc',
  },
  circulo: {
    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e4fffdff', color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #edf2f7', boxShadow: '0 4px 12px rgba(0,0,0,.8)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
  },
};

// Función para resaltar palabras clave
const highlightKeywords = (text, keywords, color) => {
  if (!keywords || !text) return text;
  
  let parts = [text];
  keywords.forEach((keyword, index) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return [part];
      return part.split(regex).map((sub, subIndex) => {
        if (sub.toLowerCase() === keyword.toLowerCase()) {
          return <span key={`${index}-${subIndex}`} style={{ color: color, fontWeight: '800', textShadow: '0 0 1px #fff' }}>{sub}</span>;
        }
        return sub; 
      });
    });
  });
  return parts;
};

function MenuPrueba() {
  const navigate = useNavigate();
  const { perfilActivo, actualizarModoEnfoque, cerrarSesion } = usePerfil();
  const [modoEnfoque, setModoEnfoque] = useState(perfilActivo?.modoEnfoque || false);

  // --- CONFIGURACIÓN DE TEMAS POR JUEGO ---
  const juegos = [
    {
      id: "tesoro-privacidad",
      titulo: "Tesoro de Privacidad",
      descripcion: "Protege tus datos más valiosos arrastrándolos al cofre de seguridad.",
      objetivo: "Aprender a identificar datos sensibles.",
      icono: iconoTesoro,
      fondo: fondoTesoro,
      // TEMA NORMAL
      theme: {
        bgGradient: 'linear-gradient(135deg, #bd693fff 30%, #fcff58ff 100%)', 
        primary: '#7b3500ff', accent: '#c94000ff',      
        buttonBg: 'linear-gradient(to right, #ffe368ff 0%, #ef6b00ff 100%)', 
        buttonShadow: '0 10px 20px rgba(79, 172, 254, 0.6)', 
        colorDescripcion: '#ffffff', colorObjetivo: '#330700ff', 
      },
      // TEMA MODO ENFOQUE
      focusTheme: {
        bgGradient: '#fff9ebff', 
        primary: '#373700ff', accent: '#704d00ff',
        buttonBg: '#dfdc13ff', 
        buttonShadow: 'none',
        colorDescripcion: '#1f0c02ff',
        colorObjetivo: '#211000ff',
        focusKeywords: ['Protege', 'datos', 'arrastrándolos','cofre de seguridad', 'valiosos'],
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
        colorDescripcion: '#ffffffff', colorObjetivo: '#000000ff',    
      },
      focusTheme: {
        bgGradient: '#d9fbf3ff', 
        primary: '#010c2cff', accent: '#0b8779ff',
        buttonBg: '#1efff4ff',
        buttonShadow: 'none',
        colorDescripcion: '#040c38ff',
        colorObjetivo: '#000937ff',
        focusKeywords: ['Elige', 'estrategias', 'defenderte'], 
      }
    },
    {
      id: "aldea-amigos",
      titulo: "Aldea de Amigos",
      descripcion: "Evalúa perfiles en la red social y detecta quién es confiable.",
      objetivo: "Aprender a dentificar perfiles peligrosos.",
      icono: iconoAldea,
      fondo: fondoAldea,
      theme: {
        bgGradient: 'linear-gradient(135deg, #203b00ff 0%, #dfffa7ff 100%)', 
        primary: '#004219ff', accent: '#006a05ff',      
        buttonBg: 'linear-gradient(to right, #a3ff8eff 0%, #057564ff 100%)', 
        buttonShadow: '0 10px 20px rgba(183, 33, 255, 0.4)', 
        colorDescripcion: '#ffffffff', colorObjetivo: '#210e56ff', 
      },
      focusTheme: {
        bgGradient: '#e5ffdeff',
        primary: '#042807ff', accent: '#008b05ff',
        buttonBg: '#62d033ff',
        buttonShadow: 'none',
        colorDescripcion: '#003004ff',
        colorObjetivo: '#062d00ff',
        focusKeywords: ['Evalúa perfiles', 'red social', 'confiable', 'detecta'], 
      }
    },
  ];

  const [juegoSeleccionado, setJuegoSeleccionado] = useState(juegos[0]);

  const jugar = () => {
    if (!juegoSeleccionado) return;
    if (perfilActivo && perfilActivo.modoEnfoque !== modoEnfoque) {
      actualizarModoEnfoque(modoEnfoque);
    }
    navigate(`/juego/${juegoSeleccionado.id}`);
  };

  const handleCerrarSesion = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      cerrarSesion();
      navigate('/profiles');
    }
  };

  // LÓGICA: Seleccionar tema
  const temaActual = modoEnfoque ? juegoSeleccionado.focusTheme : juegoSeleccionado.theme;

  // Variables dinámicas para Sidebar
  const bgHeaderSidebar = modoEnfoque ? '#209589ff' : 'linear-gradient(to bottom, #2ae4fdff 0%, #f8f9fa 100%)';
  const colorTextoSidebar = modoEnfoque ? '#ffffff' : '#2d3748';
  const bgToggle = modoEnfoque ? '#05573cff' : '#ffcc00ff';

  return (
    <div style={styles.contenedor}>
      
      <style>{`
        /* Animación para la IMAGEN flotante */
        @keyframes flotarImagen {
          0% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-53%) translateX(5px); }
          100% { transform: translateY(-50%) translateX(0px); }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      `}</style>

      {/* === IZQUIERDA === */}
      <div style={{...styles.columnaIzquierda, backgroundColor: modoEnfoque ? '#f5f5f5' : '#FFFFFF'}}>
        
        <div style={{...styles.infoUsuario, background: bgHeaderSidebar}}>
          {perfilActivo?.avatarSrcS ? (
            <img src={perfilActivo.avatarSrcS} alt="Avatar" style={styles.imagenPerfil} />
          ) : (
            <div style={styles.placeholderImagen}>No Image</div>
          )}
          <div style={styles.datosUsuario}>
            <div style={{...styles.nombreUsuario, color: colorTextoSidebar}}>{perfilActivo?.nombre || "Jugador"}</div>
            <div style={{...styles.apodoUsuario, color: modoEnfoque ? '#cfd8dc' : '#33435bff'}}>@{perfilActivo?.apodo || "apodo"}</div>
          </div>
          
          <div style={{...styles.contenedorModo, backgroundColor: bgToggle}}>
            <label style={styles.labelModo}>
              <input 
                type="checkbox" 
                checked={modoEnfoque} 
                onChange={(e) => setModoEnfoque(e.target.checked)} 
                style={styles.checkbox} 
              />
              <span>{modoEnfoque ? "🧘 Modo Enfoque ON" : "🧠 Modo Enfoque OFF"}</span>
            </label>
          </div>
        </div>

        <div style={styles.listaJuegos}>
          {juegos.map((juego) => {
            const isSelected = juegoSeleccionado.id === juego.id;
            
            const itemBg = isSelected ? (modoEnfoque ? '#b0bec5' : `${juego.theme.accent}20`) : 'transparent';
            const itemBorder = isSelected 
                ? (modoEnfoque ? '#546e7a' : juego.theme.accent) 
                : 'rgba(0,0,0,0.1)'; 

            const itemText = isSelected ? (modoEnfoque ? '#000' : juego.theme.primary) : '#4a5568';

            return (
              <div
                key={juego.id}
                onClick={() => setJuegoSeleccionado(juego)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '15px 20px', cursor: 'pointer', borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  backgroundColor: itemBg, 
                  border: `1px solid ${itemBorder}`,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  marginBottom: '15px' 
                }}
              >
                <span style={{
                  fontSize: '16px', fontWeight: isSelected ? '700' : '500',
                  color: itemText, transition: 'color 0.3s ease'
                }}>
                  {juego.titulo}
                </span>
                
                <img 
                  src={juego.icono} 
                  alt="icono"
                  style={{
                    // REVERSIÓN DE TAMAÑO: 55px x 55px
                    width: '70px', 
                    height: '70px',
                    objectFit: 'contain',
                    alignSelf: 'flex-end',
                    // REVERSIÓN DE MARGEN: -15px (ajuste original para el tamaño 55px)
                    marginBottom: '-30px', 
                    marginRight: '-10px',
                    filter: isSelected ? (modoEnfoque ? 'none' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))') : 'grayscale(20%) opacity(0.8)',
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={styles.pieLateral}>
          <div 
            style={styles.circulo} onClick={handleCerrarSesion}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
          >
            <span style={{ fontSize: '24px' }}>👋</span>
          </div>
        </div>
      </div>

      {/* === DERECHA (Contenido) === */}
      <div style={{
        flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', position: 'relative',
        background: temaActual.bgGradient, 
        overflow: 'hidden', 
        transition: 'background 0.5s ease'
      }}>
        
        {/* IMAGEN DE FONDO FLOTANTE (A la DERECHA) */}
        <img 
          src={juegoSeleccionado.fondo} 
          alt="Fondo juego"
          style={{
            position: 'absolute',
            right: '-25%', 
            top: '50%', transform: 'translateY(-50%)',
            width: '110%', height: 'auto', maxHeight: '120%',   
            objectFit: 'contain', zIndex: 0, 
            opacity: modoEnfoque ? 0.5 : 0.9, 
            mixBlendMode: modoEnfoque ? 'normal' : 'multiply', 
            pointerEvents: 'none', 
            
            // LÓGICA: Si modoEnfoque es true, animación 'none', si no, flota.
            animation: modoEnfoque ? 'none' : 'flotarImagen 6s ease-in-out infinite',
            transition: 'all 0.5s ease'
          }}
        />

        {/* CONTENEDOR DE TEXTO */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* === TÍTULO (A la Derecha) === */}
          <div style={{
            alignSelf: 'flex-end', marginRight: '-50px',  
            background: modoEnfoque ? '#fff' : 'rgba(255, 255, 255, 0.6)', 
            backdropFilter: modoEnfoque ? 'none' : 'blur(10px)',
            padding: '15px 35px',
            borderRadius: '20px 0 0 20px', 
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            border: modoEnfoque ? '1px solid #ccc' : '1px solid rgba(255, 255, 255, 0.4)',
            borderRight: 'none', 
            marginBottom: '40px',
            maxWidth: '500px',
            textAlign: 'right',
            transition: 'all 0.3s ease'
          }}>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', color: temaActual.primary, letterSpacing: '-1px' }}>
              {juegoSeleccionado.titulo}
            </h1>
          </div>

          {/* Cuerpo */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            {/* TEXTO A LA IZQUIERDA */}
            <div style={{ flex: 1, maxWidth: '50%', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Descripción */}
              <p style={{ 
                fontSize: '22px', 
                lineHeight: '1.6', 
                color: temaActual.colorDescripcion, 
                fontWeight: '500',
                textShadow: modoEnfoque ? 'none' : '0 1px 0 rgba(255,255,255,0.5)' 
              }}>
                {/* LÓGICA CLAVE: Resaltar palabras si modoEnfoque es ON */}
                {modoEnfoque 
                    ? highlightKeywords(
                        juegoSeleccionado.descripcion, 
                        juegoSeleccionado.focusTheme.focusKeywords, 
                        juegoSeleccionado.focusTheme.accent
                      )
                    : juegoSeleccionado.descripcion
                }
              </p>

              {/* Objetivo */}
              <div style={{
                background: modoEnfoque ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                padding: '20px',
                borderRadius: '15px',
                borderLeft: `5px solid ${temaActual.accent}`
              }}>
                <div style={{ fontSize: '14px', textTransform: 'uppercase', color: temaActual.accent, fontWeight: '800', letterSpacing: '1px' }}>
                  🎯 Objetivo
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  color: temaActual.colorObjetivo,
                  fontWeight: '600', 
                  marginTop: '5px' 
                }}>
                  {juegoSeleccionado.objetivo}
                </div>
              </div>

            </div>
            
            {/* Espacio vacío a la derecha */}
            <div style={{ flex: 1 }}></div>
          </div>

          {/* Botón de Acción */}
          <div style={{ position: 'absolute', bottom: '50px', right: '80px' }}>
            <button 
              onClick={jugar}
              onMouseOver={(e) => { if(!modoEnfoque) e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
              onMouseOut={(e) => { if(!modoEnfoque) e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              onMouseDown={(e) => { if(!modoEnfoque) e.currentTarget.style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { if(!modoEnfoque) e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
              style={{
                background: temaActual.buttonBg,
                color: modoEnfoque ? '#000' : 'white', 
                border: modoEnfoque ? '2px solid #fff' : 'none',
                padding: '20px 50px',
                fontSize: '20px',
                fontWeight: '800',
                letterSpacing: '1px',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: temaActual.buttonShadow,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                textTransform: 'uppercase',
                transform: modoEnfoque ? 'none' : undefined
              }}
            >
              ¡Jugar Ahora!
            </button>
          </div>
          
        </div> {/* Fin contenedor contenido */}

      </div>
    </div>
  );
}

export default MenuPrueba;