import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const TopicDetail = () => {
  const { subjectId, topicId } = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title, content')
          .eq('id', topicId)
          .single();
          
        if (error) throw error;
        if (data) setTopic(data);

      } catch (err) {
        console.error('Error fetching topic:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;
  if (!topic) return <div className="container section" style={{ textAlign: 'center' }}>Тақырып табылмады.</div>;

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to={`/subjects/${subjectId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Пәнге қайту
        </Link>
        
        <div className="card">
          <h1 style={{ marginBottom: '2rem' }}>{topic.title}</h1>
          <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {topic.content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopicDetail;
