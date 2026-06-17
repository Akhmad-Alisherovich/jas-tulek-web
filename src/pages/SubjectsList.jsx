import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SubjectsList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .order('order_index', { ascending: true });
          
        if (error) throw error;
        if (data) setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-surface-hover)', minHeight: '80vh' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Пәндер</h2>
        
        {subjects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Әзірге пәндер қосылмаған.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {subjects.map((sub) => (
              <Link to={`/subjects/${sub.id}`} className="card" key={sub.id} style={{ borderTop: `4px solid ${sub.color || 'var(--color-primary)'}`, textAlign: 'center', display: 'block' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{sub.icon}</div>
                <h3 style={{ marginTop: '1rem' }}>{sub.title}</h3>
                <p style={{ fontSize: '0.875rem' }}>{sub.description}</p>
                <div className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>Оқуды бастау</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SubjectsList;
