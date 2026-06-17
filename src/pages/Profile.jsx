import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield, Clock } from 'lucide-react';

const Profile = () => {
  const { profile } = useAuth();

  if (!profile) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Жеке кабинет</h2>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <User size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{profile.full_name || 'Аты-жөні көрсетілмеген'}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{profile.role === 'admin' ? 'Әкімші' : 'Оқушы'}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail color="var(--text-secondary)" size={20} />
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</span>
                <span style={{ fontWeight: '500' }}>{profile.email}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar color="var(--text-secondary)" size={20} />
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Тіркелген күні</span>
                <span style={{ fontWeight: '500' }}>{new Date(profile.created_at).toLocaleDateString('kk-KZ')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Shield color={profile.has_ai_access ? "var(--color-primary)" : "var(--text-secondary)"} size={20} />
              <div>
                <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>AI Ассистент рұқсаты</span>
                <span style={{ fontWeight: '500', color: profile.has_ai_access ? 'var(--color-primary)' : 'inherit' }}>
                  {profile.has_ai_access ? 'Қосылған' : 'Өшірулі'}
                </span>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Profile;
