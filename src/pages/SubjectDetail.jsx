import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, HelpCircle, ArrowLeft, PlayCircle, BookMarked, Globe, Map, Landmark, Calculator } from 'lucide-react';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [subRes, topicsRes, tqRes] = await Promise.all([
          supabase.from('subjects').select('*').eq('id', subjectId).single(),
          supabase.from('topics').select('*').eq('subject_id', subjectId).order('order_index', { ascending: true }),
          supabase.from('test_questions').select('topic_id').eq('subject_id', subjectId)
        ]);
        
        if (subRes.data) setSubject(subRes.data);
        if (topicsRes.data) {
          setTopics(topicsRes.data);
          
          const topicIdsWithTests = new Set(tqRes.data?.map(q => q.topic_id) || []);
          const availableTests = topicsRes.data
            .filter(t => topicIdsWithTests.has(t.id))
            .map(t => ({ id: t.id, title: t.title }));
          setTests(availableTests);
        }
      } catch (err) {
        console.error('Error fetching subject details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [subjectId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Күте тұрыңыз...</div>;
  if (!subject) return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>Пән табылмады.</div>;

  // Image mapping for topics
  const getTopicImage = (subjectName, index) => {
    const lowerName = subjectName.toLowerCase();
    
    if (lowerName.includes('қазақстан тарихы')) {
      const files = [
        'kaz_01_ancient_period.webp', 'kaz_02_medieval_period.webp', 'kaz_03_new_age.webp', 
        'kaz_04_first_half_20th_century.webp', 'kaz_05_second_half_20th_21st_century.webp', 
        'kaz_06_cultural_development.webp', 'kaz_07_context_tasks.webp'
      ];
      if (index < files.length) return `/assets/images/kazakhstan_history/${files[index]}`;
    }
    
    if (lowerName.includes('дүниежүзі')) {
      const files = [
        'world_01_ancient_civilizations.webp', 'world_02_middle_ages.webp', 'world_03_great_geographical_discoveries.webp',
        'world_04_modern_age.webp', 'world_05_world_war_1.webp', 'world_06_interwar_world.webp',
        'world_07_world_war_2.webp', 'world_08_world_second_half_20th.webp', 'world_09_ancient_culture.webp',
        'world_10_medieval_culture.webp', 'world_11_modern_culture.webp', 'world_12_20_21_century_culture_science.webp',
        'world_13_context_tasks.webp'
      ];
      if (index < files.length) return `/assets/images/world_history/${files[index]}`;
    }
    
    if (lowerName.includes('география')) {
      const files = [
        '01_geographical_research_methods.png', '02_cartography_geoinformatics.png', '03_physical_geography_geoecology.png',
        '04_social_geography.png', '05_economic_geography_geoeconomics.png', '06_country_political_geography_geopolitics.png',
        '07_global_problems.png'
      ];
      if (index < files.length) return `/assets/images/geography_section_avatars_numbered/${files[index]}`;
    }
    
    return null;
  };

  // Helper to get fallback generic icon based on subject
  const getSubjectIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('қазақстан тарихы')) return <Landmark size={32} color="#1c4532" />;
    if (lowerName.includes('дүниежүзі')) return <Globe size={32} color="#1c4532" />;
    if (lowerName.includes('география')) return <Map size={32} color="#1c4532" />;
    if (lowerName.includes('мат')) return <Calculator size={32} color="#1c4532" />;
    return <BookOpen size={32} color="#1c4532" />;
  };

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button onClick={() => navigate('/subjects')} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', color: '#1c4532', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', color: '#111827', fontSize: '2rem' }}>{subject.name}</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem' }}>{subject.description}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Topics Column */}
          <div style={{ flex: '2', minWidth: '300px' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c4532', fontSize: '1.5rem' }}>
              <BookMarked size={28} /> Конспекттер (Тақырыптар)
            </h2>
            
            {topics.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center', color: '#6b7280', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                Бұл пәнге материал әлі қосылмаған.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topics.map((topic, index) => {
                  const imgPath = getTopicImage(subject.name, index);
                  return (
                    <Link 
                      to={`/subjects/${subjectId}/topics/${topic.id}`} 
                      key={topic.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '1.25rem',
                        padding: '1.25rem',
                        backgroundColor: 'white', 
                        borderRadius: '20px', 
                        textDecoration: 'none', 
                        color: 'inherit',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div style={{ 
                        width: '70px', 
                        height: '70px', 
                        borderRadius: '16px', 
                        backgroundColor: '#eaf2ec', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {imgPath ? (
                          <img src={imgPath} alt={topic.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          getSubjectIcon(subject.name)
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', color: '#111827', lineHeight: '1.4' }}>{topic.title}</h3>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Тақырып {index + 1}</span>
                      </div>
                      <div style={{ backgroundColor: '#7b9c8b', color: 'white', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600' }}>
                        Оқу
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tests Column */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1c4532', fontSize: '1.5rem' }}>
              <HelpCircle size={28} /> Тесттер
            </h2>
            
            {tests.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center', color: '#6b7280', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                Бұл пән бойынша әзірге тест жоқ.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tests.map((test, index) => {
                  const imgPath = getTopicImage(subject.name, topics.findIndex(t => t.id === test.id) || index);
                  return (
                    <div key={test.id} style={{ 
                      backgroundColor: 'white', 
                      borderRadius: '20px', 
                      padding: '1.5rem',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eaf2ec', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                           {imgPath ? (
                             <img src={imgPath} alt="Test" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           ) : (
                             <HelpCircle color="#1c4532" size={24} />
                           )}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#111827', lineHeight: '1.4' }}>{test.title}</h3>
                      </div>
                      
                      <Link 
                        to={`/tests/${subjectId}/${test.id}`} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem',
                          backgroundColor: '#1c4532', 
                          color: 'white', 
                          padding: '0.875rem', 
                          borderRadius: '12px', 
                          textDecoration: 'none', 
                          fontWeight: '600',
                          width: '100%',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#153626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c4532'}
                      >
                        <PlayCircle size={20} />
                        Тестті бастау
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
