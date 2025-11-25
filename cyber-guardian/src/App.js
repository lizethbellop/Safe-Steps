import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { PerfilProvider, usePerfil } from './PerfilContext';
import './App.css';

import ContenedorJuego from './ContenedorJuego';
import MenuPrueba from './MenuPrueba';
import PerfilSelector from './PerfilSelector';
import AñadirPerfil from './AñadirPerfil';

// Ruta protegida
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

// Menú principal SOLO con el botón arcade
function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="background-image"></div>

      <div className="menu-content">
        <button
          className="play-button"
          onClick={() => navigate('/profiles')}
        >
          ¡JUGAR!
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <PerfilProvider>
      <Router>
        <Routes>

          <Route path="/" element={<MenuPrincipal />} />

          <Route path="/profiles" element={<PerfilSelector />} />

          <Route path="/add-profile" element={<AñadirPerfil />} />

          <Route
            path="/menu-juegos"
            element={
              <ProtectedRoute>
                <MenuPrueba />
              </ProtectedRoute>
            }
          />

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
