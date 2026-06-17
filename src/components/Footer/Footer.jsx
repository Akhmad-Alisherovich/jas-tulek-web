import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--bg-surface)', 
      padding: '2rem 0',
      borderTop: '1px solid var(--border-color)',
      marginTop: 'auto'
    }}>
      <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Jas Tulek</h3>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>© 2026 ҰБТ-ға ақылды дайындық платформасы.</p>
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
  );
};

export default Footer;
