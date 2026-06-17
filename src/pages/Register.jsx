import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, GraduationCap, User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Құпиясөздер сәйкес келмейді.');
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            grade: grade
          }
        }
      });

      if (signUpError) throw signUpError;
      
      navigate('/subjects');
    } catch (err) {
      if (err.message?.includes('Supabase is not configured') || err.message?.includes('missing env')) {
        setError('Supabase баптауы табылмады.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '0.25rem',
    transition: 'border-color 0.2s',
  };

  const iconStyle = {
    color: '#9ca3af',
    marginLeft: '1rem',
    marginRight: '0.5rem',
  };

  const inputStyle = {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    color: '#374151',
    fontSize: '0.95rem',
  };

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* Header / Top bar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem', paddingTop: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1c4532', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
      </div>

      <div style={{ maxWidth: '450px', margin: '0 auto' }}>
        {/* Logo and Welcome Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', marginLeft: '1rem' }}>
          <div style={{ 
            backgroundColor: '#eaf2ec', 
            borderRadius: '50%', 
            width: '60px', 
            height: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <GraduationCap size={32} color="#1c4532" />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', color: '#1c4532', fontSize: '1.75rem', fontWeight: 'bold' }}>Jas Tülek</h1>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', fontWeight: '600' }}>ҰБТ-ға дайындықты бүгіннен бастаңыз</p>
            <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>Аккаунт ашып, тақырыптарды оқып, тест тапсырып, жеке прогресіңізді бақылаңыз.</p>
          </div>
        </div>

        {/* Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '2rem 1.5rem', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
        }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.5rem' }}>Тіркелу</h2>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '2rem' }}>Жеке кабинетке кіру үшін мәліметтерді толтырыңыз</p>
          
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={inputContainerStyle}>
              <User size={20} style={iconStyle} />
              <input 
                type="text" 
                placeholder="Аты-жөні"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <Mail size={20} style={iconStyle} />
              <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <Phone size={20} style={iconStyle} />
              <input 
                type="tel" 
                placeholder="Телефон нөмірі"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <GraduationCap size={20} style={iconStyle} />
              <input 
                type="text" 
                placeholder="Сыныбы"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={inputStyle}
              />
            </div>
            
            <div style={inputContainerStyle}>
              <Lock size={20} style={iconStyle} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Құпия сөз"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                style={inputStyle}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem', color: '#9ca3af' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div style={inputContainerStyle}>
              <Lock size={20} style={iconStyle} />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Құпия сөзді қайталау"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                style={inputStyle}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem', color: '#9ca3af' }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                padding: '1rem', 
                marginTop: '1rem',
                backgroundColor: '#7b9c8b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              <UserPlus size={20} />
              {loading ? 'Күте тұрыңыз...' : 'Аккаунт жасау'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
          Аккаунтыңыз бар ма? <Link to="/login" style={{ color: '#1c4532', textDecoration: 'none', fontWeight: 'bold' }}>Кіру</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
