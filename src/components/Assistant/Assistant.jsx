import React, { useState } from 'react';

const Assistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.reply);
      } else {
        setResponse('Қате кетті: ' + (data.error || 'Белгісіз қате'));
      }
    } catch (err) {
      setResponse('Сервермен байланыс үзілді. Кейінірек қайталап көріңіз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="assistant">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🤖 AI Ассистент</h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Сабаққа немесе ҰБТ-ға байланысты сұрағыңызды қойыңыз.</p>
          
          <form onSubmit={handleAsk} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Мысалы: Абылай хан кім?"
              style={{ 
                flex: 1, 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-primary)'
              }}
              aria-label="Сұрақ енгізу"
            />
            <button type="submit" className="btn btn-primary" disabled={loading} title="Сұрақ жіберу">
              {loading ? 'Күте тұрыңыз...' : 'Сұрау'}
            </button>
          </form>

          {response && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--bg-surface-hover)', 
              borderRadius: '0.5rem',
              borderLeft: '4px solid var(--color-primary)'
            }}>
              <strong>Жауап:</strong>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{response}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Assistant;
