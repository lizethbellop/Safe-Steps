import React from 'react';
import './App.css';
import menuBackground from './assets/images/menu-background.jpg';

function App() {
  return (
    <div className="menu-container">
      {/* Fondo con tu imagen */}
      <div className="background-image"></div>
      
      {/* Contenido del menú */}
      <div className="menu-content">
        <h1 className="game-title">CYBER GUARDIAN</h1>
        <p className="game-subtitle"> Protege el mundo digital </p>
        
        <button className="play-button">
          ¡JUGAR AHORA!
        </button>
      </div>
    </div>
  );
}

export default App;
