import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { PerfilProvider } from './PerfilContext';  // ← Con mayúsculas
import './App.css';
import menuBackground from './assets/images/menu-background.jpg';

// Importar componentes de los juegos
import ContenedorJuego from './ContenedorJuego';  // ← Con mayúsculas
import MenuPrueba from './MenuPrueba';            // ← Con mayúsculas

// Tu componente de menú principal
function MenuPrincipal() {
  const navigate = useNavigate();
  
  return (
    <div className="menu-container">
      {/* Fondo con tu imagen */}
      <div className="background-image"></div>
      
      {/* Contenido del menú */}
      <div className="menu-content">
        <h1 className="game-title">CYBER GUARDIAN</h1>
        <p className="game-subtitle"> Protege el mundo digital </p>
        
        <button 
          className="play-button"
          onClick={() => navigate('/menu-juegos')}
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
          {/* Tu menú principal */}
          <Route path="/" element={<MenuPrincipal />} />
          
          {/* Menú de prueba de juegos educativos */}
          <Route path="/menu-juegos" element={<MenuPrueba />} />
          
          {/* Rutas de los juegos */}
          <Route path="/juego/:id" element={<ContenedorJuego />} />
        </Routes>
      </Router>
    </PerfilProvider>
  );
}

export default App;
