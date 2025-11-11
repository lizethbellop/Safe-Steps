import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { PerfilProvider, usePerfil } from './PerfilContext';
import './App.css';

// Importar componentes con los nombres EXACTOS de tus archivos
import ContenedorJuego from './ContenedorJuego';
import MenuPrueba from './MenuPrueba';
import PerfilSelector from './PerfilSelector';   // ← Nombre correcto
import AñadirPerfil from './AñadirPerfil';       // ← Nombre correcto

// Componente para proteger rutas que necesitan perfil
function ProtectedRoute({ children }) {
  const { perfilActivo, cargando } = usePerfil();

  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        fontSize: '2rem'
      }}>
        Cargando...
      </div>
    );
  }

  if (!perfilActivo) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
}

// Tu componente de menú principal
function MenuPrincipal() {
  const navigate = useNavigate();
  
  return (
    <div className="menu-container">
      <div className="background-image"></div>
      
      <div className="menu-content">
        <h1 className="game-title">CYBER GUARDIAN</h1>
        <p className="game-subtitle">Protege el mundo digital</p>
        
        <button 
          className="play-button"
          onClick={() => navigate('/profiles')}
        >
          ¡JUGAR AHORA!
        </button>
      </div>
    </div>
  );
}

// Componente principal con rutas
function App() {
  return (
    <PerfilProvider>
      <Router>
        <Routes>
          {/* Menú principal inicial */}
          <Route path="/" element={<MenuPrincipal />} />
          
          {/* Selección de perfiles - NO protegida */}
          <Route path="/profiles" element={<PerfilSelector />} />
          
          {/* Añadir/Administrar perfil - NO protegida */}
          <Route path="/add-profile" element={<AñadirPerfil />} />
          
          {/* Menú de juegos - PROTEGIDA (necesita perfil) */}
          <Route 
            path="/menu-juegos" 
            element={
              <ProtectedRoute>
                <MenuPrueba />
              </ProtectedRoute>
            } 
          />
          
          {/* Juegos - PROTEGIDA (necesita perfil) */}
          <Route 
            path="/juego/:id" 
            element={
              <ProtectedRoute>
                <ContenedorJuego />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </PerfilProvider>
  );
}

export default App;
