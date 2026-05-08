import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { PerfilProvider, usePerfil } from './perfil/PerfilContext';
import './App.css';

import ContenedorJuego from './ContenedorJuego';
import MenuPrueba from './menu/Menu';
import PerfilSelector from './perfil/PerfilSelector';
import AñadirPerfil from './perfil/AñadirPerfil';
import ManageProfiles from './perfil/ManageProfiles';
import LoginView from './components/auth/LoginView';
import RegisterView from './components/auth/RegisterView';

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

function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="background-image"></div>

      <div className="menu-content">
        <button
          className="play-button"
          onClick={() => navigate('/login')}
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

          <Route path="/login" element={<LoginView />} />

          <Route path="/register" element={<RegisterView />} />

          <Route path="/" element={<MenuPrincipal />} />

          <Route path="/profiles" element={<PerfilSelector />} />

          <Route path="/add-profile" element={<AñadirPerfil />} />

          <Route path="/manage-profiles" element={<ManageProfiles />} />

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
