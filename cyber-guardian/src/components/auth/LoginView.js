import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login con:", email);
    navigate('/profiles'); 
  };

  return (
    <div className="auth-screen login-theme">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Safe steps</h1>
          <p>Ingresa para proteger tus pasos</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Correo del tutor" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-auth-primary">ENTRAR</button>
        </form>

        <div className="auth-footer">
          <p className='question'>¿No tienes cuenta?</p>
          <button onClick={() => navigate('/register')} className="btn-auth-link">
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;