import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Target, BookOpen, Bot, TrendingUp, ChevronRight, MessageSquare, RefreshCw, GraduationCap, Info } from 'lucide-react';

const allFacts = [
  { subject: 'Физика', text: 'Жарық жылы - бұл уақыт бірлігі емес, жарықтың бір жылда жүріп өтетін қашықтығы. Бір жарық жылы шамамен 9,46 триллион километрге тең.', color: '#e0f2fe', icon: '⚛️' },
  { subject: 'Археология', text: 'Ең алғашқы жазу жүйесі шамамен б.з.д. 3500 жылы Месопотамияда шумерлермен ойлап табылды. Бұл клинопись деп аталады.', color: '#fef08a', icon: '🏺' },
  { subject: 'Экология', text: 'Күн энергиясын пайдаланатын фотосинтез процесінде өсімдіктер көмірқышқыл газын сіңіріп, оттегін бөледі. Бұл Жердегі өмірге өте маңызды.', color: '#f3e8ff', icon: '🌱' },
  { subject: 'Биология', text: 'Адамның ДНҚ-сының 50%-ы бананның ДНҚ-сымен сәйкес келеді.', color: '#dcfce7', icon: '🧬' },
  { subject: 'Астрономия', text: 'Күн жүйесіндегі ең үлкен жанартау Марста орналасқан (Олимп тауы), оның биіктігі Эвересттен 3 есе үлкен.', color: '#ffedd5', icon: '🪐' },
  { subject: 'Химия', text: 'Егер сіз бір стақан суға бір уыс тұз салсаңыз, судың көлемі артпайды, керісінше аздап төмендейді.', color: '#fce7f3', icon: '🧪' },
  { subject: 'География', text: 'Тынық мұхиты барлық құрлықтарды қосқандағы жалпы ауданнан үлкенірек.', color: '#e0e7ff', icon: '🌍' },
  { subject: 'Тарих', text: 'Ежелгі римдіктер тіс пастасы ретінде зәрді пайдаланған, өйткені ондағы аммиак тісті ағартады.', color: '#fee2e2', icon: '🏛️' },
  { subject: 'Математика', text: 'Нөл саны ежелгі Үндістанда б.з. 5 ғасырында ойлап табылған.', color: '#cffafe', icon: '➗' },
  { subject: 'Әдебиет', text: 'Әлемдегі ең көп сатылатын кітап - Библия, ал екінші орында "Дон Кихот".', color: '#ffedd5', icon: '📖' },
];

const getRandomFacts = (num) => {
  const shuffled = [...allFacts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const Home = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [facts, setFacts] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setFacts(getRandomFacts(3));
    
    if (user) {
      // Fetch user's test results to calculate progress
      const fetchProgress = async () => {
        try {
          const { data, error } = await supabase
            .from('test_result')
            .select('score, total')
            .eq('user_id', user.id);
            
          if (data && data.length > 0) {
            const avg = data.reduce((acc, r) => acc + (r.score / r.total), 0) / data.length;
            setProgress(Math.round(avg * 100));
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchProgress();
    }
  }, [user]);

  const handleStart = () => {
    if (user) {
      navigate('/subjects');
    } else {
      navigate('/login');
    }
  };

  const refreshFacts = () => {
    setFacts(getRandomFacts(3));
  };

  // If user is LOGGED IN -> Show Dashboard View (like the Android App)
  if (user) {
    return (
      <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', padding: '1.5rem 1rem', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
            ҰБТ дайындық
          </h1>

          {/* Main Welcome Card */}
          <Link to="/subjects" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #1c4532 0%, #b89d3d 100%)',
              borderRadius: '24px',
              padding: '1.5rem',
              color: 'white',
              marginBottom: '1.5rem',
              position: 'relative',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              overflow: 'hidden'
            }}>
              <div style={{ zIndex: 1, maxWidth: '70%' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ҰБТ дайындық <GraduationCap size={20} />
                </h2>
                <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>Сәлем, {profile?.full_name || 'Талапкер'}!</h3>
                <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0', opacity: 0.9 }}>
                  Пәнді таңдап, тақырыптарды жүйелі түрде оқуды жалғастыр.
                </p>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '9999px',
                  fontSize: '0.75rem'
                }}>
                  <Info size={14} /> Бүгінгі мақсат: 1 тақырып оқу
                </div>
              </div>
              
              {/* Circular Progress */}
              <div style={{ zIndex: 1, position: 'relative', width: '80px', height: '80px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${progress}, 100`}
                  />
                </svg>
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: 'bold'
                }}>
                  {progress}%
                  <span style={{ fontSize: '0.5rem', fontWeight: 'normal' }}>Прогресс</span>
                </div>
              </div>
            </div>
          </Link>

          {/* AI Assistant Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)',
            borderRadius: '24px',
            padding: '1.5rem',
            color: 'white',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#1e293b', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' 
              }}>
                <Bot size={32} color="#38bdf8" />
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', marginBottom: '4px' }}>
                  <Bot size={12} /> ChatGPT
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Jas Tulek AI</h3>
                <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>Жалпы тарих бойынша көмекші</p>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Барлық тарихи сұрақтарға жауап беретін ChatGPT негізіндегі ақылды көмекші.
            </p>
            
            <Link to="/ai" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: 'white', color: '#0f766e', padding: '0.875rem', borderRadius: '16px',
              textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <MessageSquare size={18} /> ChatGPT-ге өту
            </Link>
          </div>

          {/* Scientific Facts Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Ғылыми қызықтар</h2>
            <button 
              onClick={refreshFacts}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.25rem', 
                backgroundColor: '#eaf2ec', color: '#1c4532', border: 'none', 
                padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> Жаңарту
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {facts.map((fact, i) => (
              <div key={i} style={{ 
                backgroundColor: fact.color, 
                borderRadius: '16px', 
                padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', color: '#111827' }}>
                    <span style={{ fontSize: '1.2rem' }}>{fact.icon}</span> {fact.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1c4532', backgroundColor: 'white', padding: '2px 8px', borderRadius: '8px' }}>
                    AI дерек
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: '1.5' }}>
                  {fact.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // If user is NOT logged in -> Show Landing Page
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
