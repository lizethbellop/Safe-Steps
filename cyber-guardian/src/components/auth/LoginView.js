import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Acceso concedido para:", email);
      navigate('/profiles'); 
    } catch (err) {
      console.error("Error en login:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error al intentar entrar. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="auth-screen login-theme">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Safe steps</h1>
          <p>Ingresa para proteger tus pasos</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
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