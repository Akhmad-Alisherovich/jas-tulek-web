import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Target, BookOpen, Bot, TrendingUp, ChevronRight } from 'lucide-react';

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
    { 
      title: 'Жеке оқу траекториясы', 
      desc: 'Сіздің деңгейіңізге бейімделетін жеке жоспар құрып, мақсатыңызға тез жетуге көмектеседі', 
      icon: <Target size={40} color="#10b981" />,
      bg: '#d1fae5'
    },
    { 
      title: 'Тесттер мен конспекттер', 
      desc: 'Жаңа форматтағы сұрақтар мен қысқаша, нақты жазылған материалдар арқылы дайындалыңыз', 
      icon: <BookOpen size={40} color="#3b82f6" />,
      bg: '#dbeafe'
    },
    { 
      title: 'AI көмекші', 
      desc: 'Кез келген сұраққа 24/7 жауап беретін ақылды жасанды интеллект көмекшісі', 
      icon: <Bot size={40} color="#8b5cf6" />,
      bg: '#ede9fe'
    },
    { 
      title: 'Прогресс бақылау', 
      desc: 'Күнделікті дамуыңызды қадағалап, мотивация алып отырыңыз', 
      icon: <TrendingUp size={40} color="#f59e0b" />,
      bg: '#fef3c7'
    }
  ];

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1rem 4rem', 
        textAlign: 'center',
        background: 'radial-gradient(circle at 80% 20%, rgba(28, 69, 50, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', backgroundColor: '#eaf2ec', color: '#1c4532', borderRadius: '9999px', fontWeight: '600', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            2026 жылғы ҰБТ-ға дайындық
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: '800', 
            color: '#111827', 
            lineHeight: '1.2', 
            margin: '0 0 1.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            ҰБТ-ға <span style={{ color: '#1c4532' }}>ақылды</span> дайындық платформасы
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: '#6b7280', 
            margin: '0 auto 2.5rem auto',
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Жеке оқу траекториясы мен жасанды интеллекттің көмегімен жоғары балл жинауға қол жеткізіңіз.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleStart}
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#1c4532', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(28, 69, 50, 0.3)',
                transition: 'transform 0.2s, background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#153626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c4532'}
            >
              Дайындықты бастау <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '800', color: '#111827', margin: '0 0 1rem 0' }}>Біздің артықшылықтар</h2>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Тиімді оқуға арналған барлық құралдар бір жерде</p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '2.5rem 2rem', 
                  borderRadius: '24px', 
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                }}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: feature.bg, 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
