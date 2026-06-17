import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const Progress = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from('test_result')
          .select('*, topics(title), subjects(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [user.id]);

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;

  const totalTests = results.length;
  const avgScore = totalTests > 0 
    ? (results.reduce((acc, r) => acc + (r.score / r.total), 0) / totalTests * 100).toFixed(1) 
    : 0;

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-surface-hover)', minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Менің Прогресім</h2>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '2rem' }}>
          <div className="card">
            <h3>🎯 Жалпы көрсеткіш</h3>
            <p>Тапсырылған тесттер: <strong>{totalTests}</strong></p>
            <p>Орташа нәтиже: <strong>{avgScore}%</strong></p>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '5px', marginTop: '1rem' }}>
              <div style={{ width: `${avgScore}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '5px' }}></div>
            </div>
          </div>
          
          <div className="card">
            <h3>⭐ Жетістіктер (XP)</h3>
            <p>Жинаған ұпай: <strong>{totalTests * 50} XP</strong></p>
            <p>Деңгей: <strong>{totalTests > 10 ? 'Тәжірибелі (2-деңгей)' : 'Талапкер (1-деңгей)'}</strong></p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <span title="Алғашқы тест" style={{ fontSize: '2rem', opacity: totalTests > 0 ? 1 : 0.3 }}>🏆</span>
              <span title="Жүздік балл" style={{ fontSize: '2rem', opacity: results.some(r => r.score === r.total) ? 1 : 0.3 }}>🔥</span>
              <span title="Тұрақтылық" style={{ fontSize: '2rem', opacity: totalTests >= 5 ? 1 : 0.3 }}>🏅</span>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1.5rem' }}>Соңғы тест нәтижелері</h3>
        {results.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Әзірге нәтиже жоқ. Бірінші тестті орындап көріңіз.</p>
            <Link to="/subjects" className="btn btn-primary" style={{ marginTop: '1rem' }}>Пәндерге өту</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(r => (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{r.topics?.title || 'Тест'} ({r.subjects?.name || 'Пән'})</h4>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(r.created_at).toLocaleString('kk-KZ')}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: (r.score / r.total) >= 0.7 ? 'var(--color-accent)' : 'var(--color-warning)' }}>
                  {r.score} / {r.total}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Progress;
