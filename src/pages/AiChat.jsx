import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AiChat = () => {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!profile?.has_ai_access && profile?.role !== 'admin') {
    return (
      <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', textAlign: 'center', borderTop: '4px solid var(--color-warning)' }}>
          <ShieldAlert size={64} color="var(--color-warning)" style={{ margin: '0 auto 1rem' }} />
          <h2>Рұқсат қажет</h2>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            AI ассистентке қол жеткізу үшін әкімші (admin) рұқсаты қажет. 
            Қолжетімділік алу үшін қолдау қызметіне немесе ұстазыңызға хабарласыңыз.
          </p>
        </div>
      </section>
    );
  }

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setLoading(true);
    
    try {
      const res = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Қате кетті: ' + (data.error || 'Белгісіз қате') }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Сервермен байланыс үзілді. Кейінірек қайталап көріңіз.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '70vh' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>🤖 AI Ассистент</h2>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
            {messages.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: 'auto' }}>Сабаққа немесе ҰБТ-ға байланысты сұрағыңызды қойыңыз.</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--bg-surface-hover)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  borderBottomRightRadius: msg.role === 'user' ? '0' : '1rem',
                  borderBottomLeftRadius: msg.role === 'ai' ? '0' : '1rem',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: '1rem', borderBottomLeftRadius: '0' }}>
                <span style={{ opacity: 0.5 }}>Ойлануда...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleAsk} style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
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
              Жіберу
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AiChat;
