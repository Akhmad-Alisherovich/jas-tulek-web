import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PlaceholderAdminPage = ({ title }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (profile?.role !== 'admin') {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Сізге бұл бетке кіруге рұқсат жоқ.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1c4532' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, color: '#1c4532' }}>{title}</h1>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Construction size={64} color="#7b9c8b" />
        <h2 style={{ margin: 0, color: '#111827' }}>Бұл бөлім жасалу үстінде</h2>
        <p style={{ color: '#6b7280', margin: 0, maxWidth: '400px' }}>
          Бұл парақша әзірлеу сатысында. Жақын арада {title.toLowerCase()} қолжетімді болады.
        </p>
      </div>
    </div>
  );
};

export const AdminSubjects = () => <PlaceholderAdminPage title="Пәндер мен тақырыптар" />;
export const AdminSettings = () => <PlaceholderAdminPage title="Жүйе баптаулары" />;
