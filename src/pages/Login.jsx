import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const formattedEmail = email.trim().toLowerCase();
    if (!password) {
      setError('Құпиясөз енгізіңіз');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: password
      });

      if (signInError) {
        console.error('Supabase signInWithPassword error:', signInError);
        
        if (signInError.message.includes('Supabase is not configured') || signInError.message.includes('missing env')) {
          throw new Error('Supabase баптауы жоқ');
        } else if (signInError.message === 'Invalid login credentials' || signInError.code === 'invalid_credentials') {
          throw new Error('Email немесе құпиясөз қате');
        } else if (signInError.message === 'Email not confirmed' || signInError.code === 'email_not_confirmed') {
          throw new Error('Email расталмаған');
        } else {
          throw signInError;
        }
      }
      
      // Fetch user profile to route based on role
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Fallback if profile fails
          navigate('/subjects');
        } else {
          if (profile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/subjects');
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '400px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Жүйеге кіру</h2>
          
          {error && <div style={{ backgroundColor: 'var(--color-warning)', color: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Құпиясөз</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? 'Күте тұрыңыз...' : 'Кіру'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
            Аккаунтыңыз жоқ па? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Тіркелу</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
