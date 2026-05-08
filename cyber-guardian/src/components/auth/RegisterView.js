import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import './Auth.css';

const RegisterView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "usuarios", user.uid), {
        correo: user.email,
        rol: "tutor",
        fechaRegistro: new Date()
      });
      // -------------------------------------

      console.log("Usuario y expediente creados con éxito");
      navigate('/profiles'); 
    } catch (err) {
      console.error("Error al registrar:", err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error en el registro. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="auth-screen register-theme">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Safe steps</h1>
          <p>Crea tu cuenta de tutor</p>
        </div>
        
        <form className="auth-form" onSubmit={handleRegister}>
          {error && <p className="error-text" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
          
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

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Confirmar contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-auth-primary">REGISTRARSE</button>
        </form>

        <div className="auth-footer">
          <p className='question'>¿Ya tienes cuenta?</p>
          <button onClick={() => navigate('/login')} className="btn-auth-link">
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;