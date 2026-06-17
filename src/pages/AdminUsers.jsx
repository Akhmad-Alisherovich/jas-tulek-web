import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Shield, Calendar, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const toggleAiAccess = async (userId, currentStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ has_ai_access: !currentStatus })
      .eq('id', userId);
    
    if (!error) {
      fetchUsers();
    }
  };

  if (profile?.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Сізге бұл бетке кіруге рұқсат жоқ.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1c4532' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, color: '#1c4532' }}>Оқушыларды басқару</h1>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Жүктелуде...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                      {new Date(u.created_at).toLocaleDateString('kk-KZ')}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      backgroundColor: u.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                      color: u.role === 'admin' ? '#92400e' : '#4b5563'
                    }}>
                      {u.role === 'admin' ? 'Әкімші' : 'Оқушы'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => toggleAiAccess(u.id, u.has_ai_access)}
                      style={{ 
                        background: u.has_ai_access ? '#1c4532' : '#f3f4f6', 
                        color: u.has_ai_access ? 'white' : '#6b7280',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Shield size={16} />
                      {u.has_ai_access ? 'Қосулы' : 'Өшірулі'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
