import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { BookOpen, HelpCircle } from 'lucide-react';

const SubjectDetail = () => {
  const { subjectId } = useParams();
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
          // Tests are now grouped by topic_id
          const topicIdsWithTests = new Set(tqRes.data?.map(q => q.topic_id) || []);
          const availableTests = topicsRes.data
            .filter(t => topicIdsWithTests.has(t.id))
            .map(t => ({ id: t.id, title: t.title + ' (Тест)' }));
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

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;
  if (!subject) return <div className="container section" style={{ textAlign: 'center' }}>Пән табылмады.</div>;

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>{subject.icon_url || '📚'}</span>
          <div>
            <h1 style={{ margin: 0 }}>{subject.name}</h1>
            <p style={{ margin: 0 }}>{subject.description}</p>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen /> Тақырыптар</h2>
            {topics.length === 0 ? (
              <div className="card"><p>Бұл пәнге материал әлі қосылмаған.</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topics.map(topic => (
                  <Link to={`/subjects/${subjectId}/topics/${topic.id}`} key={topic.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{topic.title}</h3>
                    <span className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Оқу</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HelpCircle /> Тесттер</h2>
            {tests.length === 0 ? (
              <div className="card"><p>Бұл пән бойынша әзірге тест жоқ.</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tests.map(test => (
                  <div key={test.id} className="card" style={{ backgroundColor: 'var(--bg-surface-hover)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>{test.title}</h3>
                    <Link to={`/tests/${subjectId}/${test.id}`} className="btn btn-primary" style={{ width: '100%' }}>Тестті бастау</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectDetail;
