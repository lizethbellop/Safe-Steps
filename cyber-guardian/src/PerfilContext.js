import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const PerfilContext = createContext();

// Hook personalizado para usar el perfil en cualquier componente
export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil debe usarse dentro de un PerfilProvider');
  }
  return context;
};

// Provider que envuelve tu aplicación
export const PerfilProvider = ({ children }) => {
  const [perfilActivo, setPerfilActivo] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar perfil al iniciar
  useEffect(() => {
    cargarPerfil();
  }, []);

  // Función para cargar el perfil desde storage
  const cargarPerfil = () => {
    try {
      const perfilGuardado = sessionStorage.getItem('perfilActivo') || 
                             localStorage.getItem('perfilActivo');
      
      if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
        setPerfilActivo(perfil);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para guardar/actualizar el perfil
  const guardarPerfil = (perfil, usarLocalStorage = false) => {
    try {
      const perfilJSON = JSON.stringify(perfil);
      
      if (usarLocalStorage) {
        localStorage.setItem('perfilActivo', perfilJSON);
        sessionStorage.removeItem('perfilActivo');
      } else {
        sessionStorage.setItem('perfilActivo', perfilJSON);
        localStorage.removeItem('perfilActivo');
      }
      
      setPerfilActivo(perfil);
      return true;
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      return false;
    }
  };

  // Función para actualizar solo el modo enfoque
  const actualizarModoEnfoque = (modoEnfoque) => {
    if (!perfilActivo) return false;
    
    const perfilActualizado = {
      ...perfilActivo,
      modoEnfoque: modoEnfoque
    };
    
    return guardarPerfil(perfilActualizado);
  };

  // Función para actualizar cualquier campo del perfil
  const actualizarPerfil = (cambios) => {
    if (!perfilActivo) return false;
    
    const perfilActualizado = {
      ...perfilActivo,
      ...cambios
    };
    
    return guardarPerfil(perfilActualizado);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    sessionStorage.removeItem('perfilActivo');
    localStorage.removeItem('perfilActivo');
    setPerfilActivo(null);
  };

  // Función para verificar si hay sesión activa
  const tieneSesion = () => {
    return perfilActivo !== null;
  };

  // Valores y funciones disponibles en toda la app
  const value = {
    perfilActivo,
    cargando,
    guardarPerfil,
    actualizarModoEnfoque,
    actualizarPerfil,
    cerrarSesion,
    tieneSesion,
    cargarPerfil
  };

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  );
};

export default PerfilContext;