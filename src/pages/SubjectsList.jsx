import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Globe, BookOpen, Calculator, Map, Landmark, ArrowRight } from 'lucide-react';

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

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Күте тұрыңыз...</div>;

  // Helper function to map subject names to specific Lucide icons and colors
  const getSubjectIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('қазақстан тарихы')) return { icon: <Landmark size={48} color="#eab308" />, bg: '#fef9c3' }; // Yellow
    if (lowerName.includes('дүниежүзі')) return { icon: <Globe size={48} color="#3b82f6" />, bg: '#dbeafe' }; // Blue
    if (lowerName.includes('география')) return { icon: <Map size={48} color="#10b981" />, bg: '#d1fae5' }; // Green
    if (lowerName.includes('мат')) return { icon: <Calculator size={48} color="#8b5cf6" />, bg: '#ede9fe' }; // Purple
    if (lowerName.includes('оқу')) return { icon: <BookOpen size={48} color="#f43f5e" />, bg: '#ffe4e6' }; // Rose
    
    // Default
    return { icon: <BookOpen size={48} color="#7b9c8b" />, bg: '#eaf2ec' };
  };

  return (
    <div style={{ backgroundColor: '#faf9f5', minHeight: '80vh', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: '#1c4532', fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Пәндер</h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>Өзіңізге қажетті пәнді таңдап, дайындықты бастаңыз</p>
        </div>
        
        {subjects.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', textAlign: 'center', padding: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Әзірге пәндер қосылмаған.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {subjects.map((sub) => {
              const { icon, bg } = getSubjectIcon(sub.name);
              
              return (
                <Link 
                  to={`/subjects/${sub.id}`} 
                  key={sub.id} 
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    padding: '2rem', 
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)';
                  }}
                >
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    backgroundColor: bg, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    {icon}
                  </div>
                  
                  <h3 style={{ color: '#111827', fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                    {sub.name}
                  </h3>
                  
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1.5rem 0', flex: 1 }}>
                    {sub.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    color: '#7b9c8b',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#faf9f5',
                    borderRadius: '12px',
                    width: '100%'
                  }}>
                    Оқуды бастау <ArrowRight size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsList;
