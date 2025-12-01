import React, { createContext, useContext, useState, useEffect } from 'react';

const PerfilContext = createContext();
export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) throw new Error('usePerfil debe usarse dentro de un PerfilProvider');
  return context;
};

export const PerfilProvider = ({ children }) => {
  const [perfilActivo, setPerfilActivo] = useState(null);
  const [perfilesGuardados, setPerfilesGuardados] = useState([]);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    cargarListaPerfiles();
    cargarPerfilActivo();
  }, []);

  const cargarListaPerfiles = () => {
    try {
      const perfilesJSON = localStorage.getItem('perfilesGuardados');
      if (perfilesJSON) {
        let perfiles = JSON.parse(perfilesJSON);
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

  const cargarPerfilActivo = () => {
    try {
      const perfilGuardado =
        sessionStorage.getItem('perfilActivo') || localStorage.getItem('perfilActivo');
      if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
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

  // Gestión de perfil activo 
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

  const actualizarPerfil = (cambios) => {
    if (!perfilActivo) return false;
    const perfilActualizado = {
      ...perfilActivo,
      ...cambios,
      puntos: cambios.puntos !== undefined ? cambios.puntos : perfilActivo.puntos,
      modoEnfoque:
        cambios.modoEnfoque !== undefined ? cambios.modoEnfoque : perfilActivo.modoEnfoque,
    };
    agregarPerfil(perfilActualizado);
    return guardarPerfil(perfilActualizado);
  };

  const actualizarPuntos = (puntosNuevos) => actualizarPerfil({ puntos: puntosNuevos });
  const actualizarModoEnfoque = (modoEnfoque) => actualizarPerfil({ modoEnfoque });
  const cerrarSesion = () => {
    sessionStorage.removeItem('perfilActivo');
    localStorage.removeItem('perfilActivo');
    setPerfilActivo(null);
  };
  const tieneSesion = () => perfilActivo !== null;

  // Gestión de lista de perfiles 
  const agregarPerfil = (nuevoPerfil) => {
    try {
      const perfilConDefaults = {
        ...nuevoPerfil,
        puntos: nuevoPerfil.puntos || 0,
        modoEnfoque: nuevoPerfil.modoEnfoque || false,
      };
      const perfilesActuales = [...perfilesGuardados];
      const indiceExistente = perfilesActuales.findIndex(p => p.id === perfilConDefaults.id);
      if (indiceExistente !== -1) {
        perfilesActuales[indiceExistente] = perfilConDefaults;
      } else {
        perfilesActuales.push(perfilConDefaults);
      }
      localStorage.setItem('perfilesGuardados', JSON.stringify(perfilesActuales));
      setPerfilesGuardados(perfilesActuales);
      return true;
    } catch (error) {
      console.error('Error al agregar perfil:', error);
      return false;
    }
  };

  const editarPerfil = (perfilModificado) => agregarPerfil(perfilModificado);

  const eliminarPerfil = (perfilId) => {
    try {
      const perfilesFiltrados = perfilesGuardados.filter(p => p.id !== perfilId);
      localStorage.setItem('perfilesGuardados', JSON.stringify(perfilesFiltrados));
      setPerfilesGuardados(perfilesFiltrados);
      if (perfilActivo && perfilActivo.id === perfilId) cerrarSesion();
      return true;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return false;
    }
  };

  const seleccionarPerfil = (perfilId) => {
    const perfil = perfilesGuardados.find(p => p.id === perfilId);
    return perfil ? guardarPerfil(perfil, false) : false;
  };

  const value = {
    perfilActivo,
    perfilesGuardados,
    cargando,
    guardarPerfil,
    actualizarPerfil,
    cerrarSesion,
    tieneSesion,
    actualizarModoEnfoque,
    actualizarPuntos,
    agregarPerfil,
    eliminarPerfil,
    seleccionarPerfil,
    editarPerfil,
  };

  return <PerfilContext.Provider value={value}>{children}</PerfilContext.Provider>;
};

export default PerfilContext;
