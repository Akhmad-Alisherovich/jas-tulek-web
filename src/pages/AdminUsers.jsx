import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Shield, Calendar, Mail, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { profile, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && profile?.role === 'admin') {
      fetchUsers();
    }
  }, [authLoading, profile]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin users:', error);
        setError('Қолданушыларды жүктеу мүмкін болмады. Admin RLS policy тексеріңіз.');
      } else if (data) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Күтпеген қате орын алды.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAiAccess = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ has_ai_access: !currentStatus })
        .eq('id', userId);
      
      if (!error) {
        fetchUsers();
      } else {
        console.error('Error toggling AI access:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'student' : 'admin';
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (!error) {
        fetchUsers();
      } else {
        console.error('Error toggling role:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1c4532', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280', fontWeight: '500' }}>Күте тұрыңыз...</p>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fee2e2', padding: '2rem', borderRadius: '16px', color: '#b91c1c', maxWidth: '500px' }}>
          <ShieldAlert size={48} style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Қате</h2>
          <p>Бұл бөлімге тек әкімші кіре алады.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1c4532' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, color: '#1c4532' }}>Оқушыларды басқару</h1>
      </div>

      {error ? (
        <div style={{ backgroundColor: '#fee2e2', padding: '1.5rem', borderRadius: '12px', color: '#b91c1c', marginBottom: '2rem' }}>
          {error}
        </div>
      ) : null}

      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #1c4532', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            Жүктелуде...
          </div>
        ) : (
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '1rem', color: '#4b5563', fontWeight: '600' }}>Пайдаланушы</th>
                <th style={{ padding: '1rem', color: '#4b5563', fontWeight: '600' }}>Байланыс</th>
                <th style={{ padding: '1rem', color: '#4b5563', fontWeight: '600' }}>Тіркелді</th>
                <th style={{ padding: '1rem', color: '#4b5563', fontWeight: '600' }}>Рөл</th>
                <th style={{ padding: '1rem', color: '#4b5563', fontWeight: '600', textAlign: 'center' }}>AI Рұқсаты</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eaf2ec', color: '#1c4532', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.full_name ? u.full_name.charAt(0).toUpperCase() : <User size={18} />}
                      </div>
                      <span style={{ fontWeight: '500', color: '#111827' }}>{u.full_name || 'Белгісіз'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      <Mail size={14} />
                      {u.email}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} />
                      {new Date(u.created_at || new Date()).toLocaleDateString('kk-KZ')}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleRole(u.id, u.role)}
                      style={{ 
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: u.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                        color: u.role === 'admin' ? '#92400e' : '#4b5563'
                      }}>
                      {u.role === 'admin' ? 'Әкімші' : 'Оқушы'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleAiAccess(u.id, !!u.has_ai_access)}
                      style={{
                        background: !!u.has_ai_access ? '#dcfce7' : '#fee2e2',
                        color: !!u.has_ai_access ? '#166534' : '#991b1b',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <Shield size={16} />
                      {!!u.has_ai_access ? 'Қосылған' : 'Өшірулі'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && !error && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    Қолданушылар табылмады.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
