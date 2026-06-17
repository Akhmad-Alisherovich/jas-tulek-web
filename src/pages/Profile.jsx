import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Phone, GraduationCap, BarChart2, Settings, Users, BookOpen } from 'lucide-react';

const Profile = () => {
  const { profile, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{ 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #1c4532', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280', fontWeight: '500' }}>Күте тұрыңыз...</p>
        </div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="container section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fee2e2', padding: '2rem', borderRadius: '16px', color: '#b91c1c', maxWidth: '500px' }}>
          <Shield size={48} style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Қате</h2>
          <p>Профиль деректерін жүктеу мүмкін болмады. Supabase profiles кестесін және RLS policy тексеріңіз.</p>
        </div>
      </div>
    );
  }

  const phone = user?.user_metadata?.phone || 'Көрсетілмеген';
  const grade = user?.user_metadata?.grade || 'Көрсетілмеген';

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    marginBottom: '2rem'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: '1px solid #f3f4f6'
  };

  const iconContainerStyle = {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280'
  };

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '80vh', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', backgroundColor: '#1c4532', color: 'white', padding: '2rem', borderRadius: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eaf2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c4532', flexShrink: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <User size={40} />}
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>{profile.full_name || 'Аты-жөні көрсетілмеген'}</h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                {profile.role === 'admin' ? 'Әкімші' : 'Оқушы'}
              </span>
              <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>ID: {profile.id.substring(0, 8)}...</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Main Info Card */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#111827' }}>Жеке мәліметтер</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={infoItemStyle}>
                <div style={iconContainerStyle}><Mail size={20} /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                  <span style={{ fontWeight: '600', color: '#374151', wordBreak: 'break-all' }}>{profile.email}</span>
                </div>
              </div>

              {profile.role === 'student' && (
                <>
                  <div style={infoItemStyle}>
                    <div style={iconContainerStyle}><Phone size={20} /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Телефон</span>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{phone}</span>
                    </div>
                  </div>
                  
                  <div style={infoItemStyle}>
                    <div style={iconContainerStyle}><GraduationCap size={20} /></div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Сыныбы</span>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{grade}</span>
                    </div>
                  </div>
                </>
              )}

              <div style={infoItemStyle}>
                <div style={iconContainerStyle}><Calendar size={20} /></div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тіркелген күні</span>
                  <span style={{ fontWeight: '600', color: '#374151' }}>{new Date(profile.created_at || new Date()).toLocaleDateString('kk-KZ')}</span>
                </div>
              </div>

              <div style={{ ...infoItemStyle, borderBottom: 'none' }}>
                <div style={{ ...iconContainerStyle, backgroundColor: profile.has_ai_access ? '#dcfce7' : '#fee2e2', color: profile.has_ai_access ? '#166534' : '#991b1b' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Ассистент рұқсаты</span>
                  <span style={{ fontWeight: '600', color: profile.has_ai_access ? '#16a34a' : '#ef4444' }}>
                    {profile.has_ai_access ? 'Рұқсат берілген' : 'Рұқсат жоқ'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={cardStyle}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#111827' }}>Жылдам сілтемелер</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.role === 'admin' ? (
                <>
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#eaf2ec', color: '#1c4532', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', transition: 'background-color 0.2s' }}>
                    <Users size={20} /> Оқушыларды басқару
                  </Link>
                  <Link to="/admin-placeholders" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', transition: 'background-color 0.2s' }}>
                    <Settings size={20} /> Жүйе баптаулары
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/progress" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', transition: 'background-color 0.2s' }}>
                    <BarChart2 size={20} /> Менің прогресім
                  </Link>
                  <Link to="/subjects" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#eaf2ec', color: '#1c4532', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', transition: 'background-color 0.2s' }}>
                    <BookOpen size={20} /> Пәндерге өту
                  </Link>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
