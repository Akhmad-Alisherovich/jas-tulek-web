import React from 'react';

const Progress = () => {
  return (
    <section className="section" id="progress" style={{ backgroundColor: 'var(--bg-surface-hover)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Менің Прогресім</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card">
            <h3>🎯 ҰБТ мақсатым</h3>
            <p>Қазіргі нәтиже: <strong>85 балл</strong></p>
            <p>Мақсат: <strong>110 балл</strong></p>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', marginTop: '1rem' }}>
              <div style={{ width: '77%', height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '5px' }}></div>
            </div>
          </div>
          
          <div className="card">
            <h3>⭐ Жетістіктер (XP)</h3>
            <p>Жинаған ұпай: <strong>1250 XP</strong></p>
            <p>Деңгей: <strong>Талапкер (5-деңгей)</strong></p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <span title="Алғашқы тест" style={{ fontSize: '2rem' }}>🏆</span>
              <span title="Жүздік балл" style={{ fontSize: '2rem' }}>🔥</span>
              <span title="Қатесіз апта" style={{ fontSize: '2rem', opacity: 0.3 }}>🏅</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Progress;
