import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Brain, BarChart2 } from 'lucide-react';

const MainLayout = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container flex justify-between items-center">
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} /> Jas Tulek
          </Link>
          
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {user ? (
              <>
                <Link to="/subjects" style={{ color: 'var(--text-secondary)' }}>Пәндер</Link>
                <Link to="/ai" style={{ color: 'var(--text-secondary)' }}>AI Ассистент</Link>
                <Link to="/progress" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart2 size={18}/> Прогресс</Link>
                <Link to="/profile" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={18}/> Профиль</Link>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogOut size={16} /> Шығу
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Кіру</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Тіркелу</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ 
        backgroundColor: 'var(--bg-surface)', 
        padding: '2rem 0',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} /> Jas Tulek
            </h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>© 2026 ҰБТ-ға ақылды дайындық платформасы.</p>
          </div>
          <div>
            <a 
              href="https://t.me/jas_tulek" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Telegram арнамыз
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
