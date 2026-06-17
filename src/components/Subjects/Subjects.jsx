import React from 'react';

const Subjects = () => {
  const subjects = [
    { name: 'Қазақстан тарихы', color: 'var(--color-primary)' },
    { name: 'Дүниежүзі тарихы', color: 'var(--color-secondary)' },
    { name: 'География', color: 'var(--color-accent)' },
    { name: 'Оқу сауаттылығы', color: 'var(--color-warning)' },
    { name: 'Математикалық сауаттылық', color: 'var(--color-danger)' }
  ];

  return (
    <section className="section" id="subjects" style={{ backgroundColor: 'var(--bg-surface-hover)' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Пәндер</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {subjects.map((sub, idx) => (
            <div className="card" key={idx} style={{ borderTop: `4px solid ${sub.color}`, textAlign: 'center' }}>
              <h3 style={{ marginTop: '1rem' }}>{sub.name}</h3>
              <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>Оқу</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subjects;
