import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Brain, BarChart2, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname.startsWith(path);

  // Reusable Nav Links
  const NavLinks = ({ mobile }) => {
    const linkStyle = mobile ? {
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#334155',
      fontWeight: '500',
      borderBottom: '1px solid #f1f5f9',
      textDecoration: 'none'
    } : {
      color: '#334155',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none'
    };

    if (user) {
      return (
        <>
          <Link to="/subjects" onClick={closeMenu} style={{ ...linkStyle, color: isActive('/subjects') ? '#4f46e5' : '#334155' }}>
            <BookOpen size={18} /> Пәндер
          </Link>
          <Link to="/ai" onClick={closeMenu} style={{ ...linkStyle, color: isActive('/ai') ? '#4f46e5' : '#334155' }}>
            <Brain size={18} /> AI Ассистент
          </Link>
          <Link to="/progress" onClick={closeMenu} style={{ ...linkStyle, color: isActive('/progress') ? '#4f46e5' : '#334155' }}>
            <BarChart2 size={18} /> Прогресс
          </Link>
          {profile?.role === 'admin' && (
            <Link to="/admin" onClick={closeMenu} style={{ ...linkStyle, color: isActive('/admin') ? '#ef4444' : '#334155' }}>
              <User size={18} /> Басқару
            </Link>
          )}
          <Link to="/profile" onClick={closeMenu} style={{ ...linkStyle, color: isActive('/profile') ? '#4f46e5' : '#334155' }}>
            <User size={18} /> Профиль
          </Link>
          
          {mobile ? (
            <button onClick={handleLogout} style={{ ...linkStyle, borderBottom: 'none', color: '#ef4444', justifyContent: 'flex-start' }}>
              <LogOut size={18} /> Шығу
            </button>
          ) : (
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '8px' }}>
              <LogOut size={16} /> Шығу
            </button>
          )}
        </>
      );
    }

    return (
      <>
        <Link to="/login" onClick={closeMenu} style={linkStyle}>Кіру</Link>
        {mobile ? (
          <Link to="/register" onClick={closeMenu} style={{ ...linkStyle, color: '#4f46e5', fontWeight: 'bold', borderBottom: 'none' }}>Тіркелу</Link>
        ) : (
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Тіркелу</Link>
        )}
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#faf9f5' }}>
      
      {/* Header */}
      <header style={{ 
        padding: '1rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Logo */}
          <Link to="/" style={{ fontWeight: '800', fontSize: '1.5rem', color: '#1c4532', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#1c4532', color: 'white', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <BookOpen size={24} /> 
            </div>
            Jas Tulek
          </Link>
          
          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }}>
            <NavLinks mobile={false} />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            style={{ display: 'block', padding: '0.5rem', color: '#1c4532', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '73px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 49,
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid #f1f5f9'
        }}>
          <NavLinks mobile={true} />
        </div>
      )}
      
      <main style={{ flex: 1, position: 'relative' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'white', 
        padding: '2.5rem 1rem',
        borderTop: '1px solid #f1f5f9',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1c4532', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <BookOpen size={20} /> Jas Tulek
            </h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              © 2026 ҰБТ-ға ақылды дайындық платформасы.
            </p>
          </div>
          <div>
            <a 
              href="https://t.me/jas_tulek" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#eaf2ec', 
                color: '#1c4532',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Telegram арнамыз
            </a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default MainLayout;
