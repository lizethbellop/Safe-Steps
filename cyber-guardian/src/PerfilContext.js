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
  const [perfilesGuardados, setPerfilesGuardados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar perfil activo y lista de perfiles al iniciar
  useEffect(() => {
    cargarListaPerfiles();
    cargarPerfilActivo();
  }, []);

  // Función para cargar la lista completa de perfiles
  const cargarListaPerfiles = () => {
    try {
      const perfilesJSON = localStorage.getItem('perfilesGuardados');
      if (perfilesJSON) {
        let perfiles = JSON.parse(perfilesJSON);
        
        // Aseguramos que todos los perfiles tengan la propiedad 'puntos' y 'modoEnfoque'
        perfiles = perfiles.map(p => ({
          ...p,
          puntos: p.puntos || 0,
          modoEnfoque: p.modoEnfoque || false,
        }));
        
        setPerfilesGuardados(perfiles);
      }
    } catch (error) {
      console.error('Error al cargar lista de perfiles:', error);
    }
  };

  // Función para cargar el perfil activo desde storage
  const cargarPerfilActivo = () => {
    try {
      const perfilGuardado = sessionStorage.getItem('perfilActivo') || 
                             localStorage.getItem('perfilActivo');
      
      if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
        
        // Inicializamos las propiedades clave si faltan al cargar
        const perfilNormalizado = {
          ...perfil,
          puntos: perfil.puntos || 0,
          modoEnfoque: perfil.modoEnfoque || false,
        };

        setPerfilActivo(perfilNormalizado);
      }
    } catch (error) {
      console.error('Error al cargar perfil activo:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para guardar/actualizar el perfil activo en sessionStorage o localStorage
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

  // Función para agregar un nuevo perfil o actualizar uno existente en la lista
  const agregarPerfil = (nuevoPerfil) => {
    try {
      let perfilesActuales = [...perfilesGuardados];
      
      // Aseguramos que el perfil a guardar tenga puntos y modoEnfoque
      const perfilConDefaults = {
        ...nuevoPerfil,
        puntos: nuevoPerfil.puntos || 0,
        modoEnfoque: nuevoPerfil.modoEnfoque || false,
      };

      // Buscar si el perfil ya existe
      const indiceExistente = perfilesActuales.findIndex(p => p.id === perfilConDefaults.id);
      
      if (indiceExistente !== -1) {
        // Actualizar perfil existente: Sobreescribimos solo los campos actualizados
        perfilesActuales[indiceExistente] = perfilConDefaults;
      } else {
        // Agregar nuevo perfil
        perfilesActuales.push(perfilConDefaults);
      }
      
      // Guardar en localStorage
      localStorage.setItem('perfilesGuardados', JSON.stringify(perfilesActuales));
      
      // Actualizar estado
      setPerfilesGuardados(perfilesActuales);
      
      return true;
    } catch (error) {
      console.error('Error al agregar perfil:', error);
      return false;
    }
  };
  
  // FUNCIÓN AGREGADA: Permite a ManageProfiles llamar a la lógica de actualización
  const editarPerfil = (perfilModificado) => {
    return agregarPerfil(perfilModificado); 
  };


  // Función para eliminar un perfil de la lista
  const eliminarPerfil = (perfilId) => {
    try {
      const perfilesFiltrados = perfilesGuardados.filter(p => p.id !== perfilId);
      
      localStorage.setItem('perfilesGuardados', JSON.stringify(perfilesFiltrados));
      setPerfilesGuardados(perfilesFiltrados);
      
      // Si el perfil eliminado era el activo, cerrar sesión
      if (perfilActivo && perfilActivo.id === perfilId) {
        cerrarSesion();
      }
      
      return true;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return false;
    }
  };

  // Función para seleccionar un perfil de la lista y ponerlo como activo
  const seleccionarPerfil = (perfilId) => {
    const perfil = perfilesGuardados.find(p => p.id === perfilId);
    if (perfil) {
      return guardarPerfil(perfil, false);
    }
    return false;
  };
  
  // Función principal para actualizar cualquier campo del perfil activo
  const actualizarPerfil = (cambios) => {
    if (!perfilActivo) return false;
    
    // Combina el perfil actual con los cambios, asegurando que los campos clave persistan
    const perfilActualizado = {
      ...perfilActivo,
      ...cambios,
      puntos: cambios.puntos !== undefined ? cambios.puntos : perfilActivo.puntos,
      modoEnfoque: cambios.modoEnfoque !== undefined ? cambios.modoEnfoque : perfilActivo.modoEnfoque,
    };
    
    // Actualizar también en la lista de perfiles y luego en el activo
    agregarPerfil(perfilActualizado);
    
    return guardarPerfil(perfilActualizado);
  };

  // Función conveniente para actualizar solo los puntos
  const actualizarPuntos = (puntosNuevos) => {
    return actualizarPerfil({ puntos: puntosNuevos });
  };
  
  // Función conveniente para actualizar solo el modo enfoque
  const actualizarModoEnfoque = (modoEnfoque) => {
    return actualizarPerfil({ modoEnfoque: modoEnfoque });
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
    // Estados
    perfilActivo,
    perfilesGuardados,
    cargando,
    
    // Funciones del perfil activo
    guardarPerfil,
    actualizarPerfil,
    cerrarSesion,
    
    // ⬅️ SOLUCIÓN AL ERROR DE 'tieneSesion is not a function'
    tieneSesion,
    
    // Funciones específicas para campos clave
    actualizarModoEnfoque,
    actualizarPuntos,
    
    // Funciones para gestionar lista de perfiles
    agregarPerfil,
    eliminarPerfil,
    seleccionarPerfil,
    
    // FUNCIÓN EXPUESTA
    editarPerfil, 
  };

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  );
};

export default PerfilContext;