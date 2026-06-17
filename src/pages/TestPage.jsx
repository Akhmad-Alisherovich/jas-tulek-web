import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const TestPage = () => {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('test_questions')
          .select('*')
          .eq('subject_id', subjectId)
          .eq('is_active', true)
          .order('order_index', { ascending: true });
          
        if (error) throw error;
        if (data) {
          // Map to format that is easy to render
          const formattedQuestions = data.map(q => ({
            id: q.id,
            question: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correctAnswer: q.correct_answer,
            topicId: q.topic_id
          }));
          setQuestions(formattedQuestions);
        }
      } catch (err) {
        console.error('Error fetching test questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectId]);

  const handleSelectOption = (qIdx, selectedText) => {
    setAnswers(prev => ({ ...prev, [qIdx]: selectedText }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    let currentScore = 0;
    questions.forEach((q, idx) => {
      // In the database, correct_answer usually matches exactly the text of one of the options
      // or it might be 'A', 'B', 'C', 'D'. Let's assume it matches the exact text based on common schema,
      // but if it's A/B/C/D, we should check differently.
      // Wait, let's assume it matches the text exactly.
      if (answers[idx] === q.correctAnswer) {
        currentScore++;
      } else if (q.correctAnswer.length === 1) { // Fallback if it's A, B, C, D
        const optIndex = ['A', 'B', 'C', 'D'].indexOf(q.correctAnswer.toUpperCase());
        if (optIndex >= 0 && answers[idx] === q.options[optIndex]) {
          currentScore++;
        }
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
            score: currentScore,
            total_questions: questions.length,
            correct_answers: currentScore,
            wrong_answers: questions.length - currentScore,
            percentage: questions.length > 0 ? Math.round((currentScore / questions.length) * 100) : 0,
            created_at: new Date().toISOString()
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
  if (questions.length === 0) return <div className="container section" style={{ textAlign: 'center' }}>Сұрақтар табылмады.</div>;

  if (finished) {
    return (
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
          <h2>Тест аяқталды!</h2>
          <p style={{ fontSize: '1.25rem', margin: '2rem 0' }}>
            Сіздің нәтижеңіз: <strong>{score} / {questions.length}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/subjects/${subjectId}`} className="btn btn-secondary">Пәнге оралу</Link>
            <Link to="/progress" className="btn btn-primary">Прогрессті көру</Link>
          </div>
        </div>
      </section>
    );
  }

  const question = questions[currentQ];

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to={`/subjects/${subjectId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Тесттен шығу
          </Link>
          <div style={{ fontWeight: 'bold' }}>
            Сұрақ {currentQ + 1} / {questions.length}
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>{question.question}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {question.options.map((opt, idx) => {
              if (!opt) return null;
              const isSelected = answers[currentQ] === opt;
              return (
                <label 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                    transition: 'all var(--transition-speed)'
                  }}
                >
                  <input 
                    type="radio" 
                    name={`question-${currentQ}`} 
                    checked={isSelected}
                    onChange={() => handleSelectOption(currentQ, opt)}
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                  <span style={{ fontSize: '1.125rem' }}>{opt}</span>
                </label>
              );
            })}
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
            {currentQ < questions.length - 1 ? (
              <button 
                className="btn btn-primary" 
                disabled={!answers[currentQ]} 
                onClick={handleNext}
              >
                Келесі сұрақ
              </button>
            ) : (
              <button 
                className="btn btn-primary" 
                disabled={!answers[currentQ] || saving} 
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
