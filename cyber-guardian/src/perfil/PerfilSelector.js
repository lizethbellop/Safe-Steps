import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePerfil } from './PerfilContext';
import logo from '../assets/images/logo.png'; 
import './PerfilSelector.css';

export default function ProfileSelector() {
  const navigate = useNavigate();
  const { perfilesGuardados, seleccionarPerfil, cerrarSesionTutor, cargando } = usePerfil();

  const handleSelectProfile = (perfil) => {
    const guardadoExitoso = seleccionarPerfil(perfil.id);
    if (guardadoExitoso) {
      navigate('/menu-juegos');
    } else {
      alert('Error al seleccionar el perfil');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Cerrar sesión de tutor?')) {
      await cerrarSesionTutor();
      navigate('/login');
    }
  };

  if (cargando) return <div className="container_PrincipalSelector"><p style={{color:'white'}}>Cargando perfiles...</p></div>;

  return (
    <div className="container_PrincipalSelector">
      <button className="btn_CerrarSesion" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      <div className="content_Selector">
        <img src={logo} alt="logo juego" className="img_LogoSelector" />

        <h2 className="subtitle_Selector">¿Quién eres? Elige tu perfil</h2>

        <div className="container_GridPerfiles">
          {perfilesGuardados.map((perfil) => (
            <div
              key={perfil.id}
              className="card_Perfil"
              onClick={() => handleSelectProfile(perfil)}
            >
              <div
                className="view_AvatarSelector"
                style={{
                  borderColor: perfil.avatarColor || '#3498db',
                  backgroundColor: perfil.avatarColor || '#3498db'
                }}
              >
                <img
                  src={perfil.avatar}
                  alt={perfil.nombre}
                  className="img_AvatarPerfil"
                />
              </div>
              <div className="text_NombrePerfil">{perfil.nombre}</div>
            </div>
          ))}

          {/* Botón para añadir perfil */}
          <div className="card_Perfil" onClick={() => navigate('/add-profile')}>
            <div className="view_AñadirPerfil">
              <div className="icon_Mas">+</div>
            </div>
            <div className="text_NombrePerfil">Añadir perfil</div>
          </div>
        </div>

        {perfilesGuardados.length > 0 && (
          <button className="btn_Administrar" onClick={() => navigate('/manage-profiles')}>
            ADMINISTRAR PERFILES
          </button>
        )}
      </div>
    </div>
  );
}