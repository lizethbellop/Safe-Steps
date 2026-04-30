import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterView = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Registrando:", formData);
    navigate('/login'); 
  };

  return (
    <div className="auth-screen register-theme">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Safe steps</h1>
          <p>Registro de Nuevo Tutor</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              name="nombre"
              placeholder="Nombre completo" 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              name="password"
              placeholder="Contraseña" 
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirmar contraseña" 
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="btn-auth-primary">CREAR CUENTA</button>
        </form>

        <div className="auth-footer">
          <p className='question'>¿Ya tienes una cuenta?</p>
          <button onClick={() => navigate('/login')} className="btn-auth-link">
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;