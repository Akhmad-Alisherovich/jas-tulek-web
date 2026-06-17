import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) {
      navigate('/subjects');
    } else {
      navigate('/login');
    }
  };

  const features = [
    { title: 'Жеке оқу траекториясы', desc: 'Сіздің деңгейіңізге бейімделетін жеке жоспар', icon: '🎯' },
    { title: 'Тесттер мен конспекттер', desc: 'Жаңа форматтағы сұрақтар мен қысқаша материалдар', icon: '📚' },
    { title: 'AI көмекші', desc: 'Кез келген сұраққа 24/7 жауап беретін ақылды көмекші', icon: '🤖' },
    { title: 'Прогресс бақылау', desc: 'Күнделікті дамуыңызды қадағалап, мотивация алыңыз', icon: '📈' }
  ];

  return (
    <>
      <section className="section hero">
        <div className="container">
          <h1>Jas Tulek — ҰБТ-ға ақылды дайындық платформасы</h1>
          <p>Жеке оқу траекториясы мен жасанды интеллекттің көмегімен жоғары балл жинауға қол жеткізіңіз.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleStart}>Дайындықты бастау</button>
            <button className="btn btn-secondary" onClick={handleStart}>Пәндерді көру</button>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Біздің артықшылықтар</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {features.map((feature, idx) => (
              <div className="card" key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
