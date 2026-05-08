// src/perfil/PerfilContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { collection, query, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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

  // Escucha cambios en la autenticación del tutor y carga sus perfiles
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, "usuarios", user.uid, "perfiles"));
        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const perfiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPerfilesGuardados(perfiles);
          setCargando(false);
        });
        return () => unsubscribeFirestore();
      } else {
        // Al cerrar sesión del tutor, limpiamos todo
        setPerfilesGuardados([]);
        setPerfilActivo(null);
        setCargando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- NUEVA FUNCIÓN: Solo quita el niño activo, mantiene al padre logueado ---
  const deseleccionarPerfil = () => {
    setPerfilActivo(null);
  };

  // Actualiza datos (como modo enfoque o puntos) en el documento del niño
  const actualizarPerfil = async (cambios) => {
    if (!perfilActivo || !auth.currentUser) return;
    try {
      const perfilRef = doc(db, "usuarios", auth.currentUser.uid, "perfiles", perfilActivo.id);
      await updateDoc(perfilRef, cambios);
      
      setPerfilActivo(prev => ({ ...prev, ...cambios }));
      return true;
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return false;
    }
  };

  const agregarPerfil = async (nuevoPerfil) => {
    if (!auth.currentUser) return false;
    try {
      await addDoc(collection(db, "usuarios", auth.currentUser.uid, "perfiles"), nuevoPerfil);
      return true;
    } catch (error) {
      return false;
    }
  };

  const seleccionarPerfil = (perfilId) => {
    const perfil = perfilesGuardados.find(p => p.id === perfilId);
    if (perfil) {
      setPerfilActivo(perfil);
      return true;
    }
    return false;
  };

  const cerrarSesionTutor = () => signOut(auth);

  const tieneSesion = () => !!perfilActivo;

  const value = {
    perfilActivo,
    perfilesGuardados,
    cargando,
    seleccionarPerfil,
    deseleccionarPerfil, // <-- Exportada para usar en el botón 👋 del menú
    cerrarSesionTutor,
    agregarPerfil,
    actualizarPerfil, 
    setPerfilActivo,
    tieneSesion
  };

  return <PerfilContext.Provider value={value}>{children}</PerfilContext.Provider>;
};

export default PerfilContext;