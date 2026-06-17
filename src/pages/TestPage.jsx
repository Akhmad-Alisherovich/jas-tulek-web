import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const TestPage = () => {
  const { subjectId, testId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .single();
          
        if (error) throw error;
        if (data) setTest(data);
      } catch (err) {
        console.error('Error fetching test:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  const handleSelectOption = (qIdx, optIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentQ < test.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    let currentScore = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    
    // Save to test_results
    if (user) {
      try {
        await supabase.from('test_results').insert([
          {
            user_id: user.id,
            subject_id: subjectId,
            test_id: testId,
            score: currentScore,
            total_questions: test.questions.length
          }
        ]);
      } catch (err) {
        console.error('Error saving result:', err);
      }
    }
    
    setFinished(true);
    setSaving(false);
  };

  if (loading) return <div className="container section" style={{ textAlign: 'center' }}>Күте тұрыңыз...</div>;
  if (!test) return <div className="container section" style={{ textAlign: 'center' }}>Тест табылмады.</div>;

  if (finished) {
    return (
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
          <h2>Тест аяқталды!</h2>
          <p style={{ fontSize: '1.25rem', margin: '2rem 0' }}>
            Сіздің нәтижеңіз: <strong>{score} / {test.questions.length}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/subjects/${subjectId}`} className="btn btn-secondary">Пәнге оралу</Link>
            <Link to="/progress" className="btn btn-primary">Прогрессті көру</Link>
          </div>
        </div>
      </section>
    );
  }

  const question = test.questions[currentQ];

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to={`/subjects/${subjectId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Тесттен шығу
          </Link>
          <div style={{ fontWeight: 'bold' }}>
            Сұрақ {currentQ + 1} / {test.questions.length}
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>{question.question}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {question.options.map((opt, idx) => (
              <label 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  border: `2px solid ${answers[currentQ] === idx ? 'var(--color-primary)' : 'var(--border-color)'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: answers[currentQ] === idx ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                  transition: 'all var(--transition-speed)'
                }}
              >
                <input 
                  type="radio" 
                  name={`question-${currentQ}`} 
                  checked={answers[currentQ] === idx}
                  onChange={() => handleSelectOption(currentQ, idx)}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontSize: '1.125rem' }}>{opt}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
            {currentQ < test.questions.length - 1 ? (
              <button 
                className="btn btn-primary" 
                disabled={answers[currentQ] === undefined} 
                onClick={handleNext}
              >
                Келесі сұрақ
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                disabled={answers[currentQ] === undefined || saving} 
                onClick={handleFinish}
              >
                {saving ? 'Сақталуда...' : 'Аяқтау'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestPage;
