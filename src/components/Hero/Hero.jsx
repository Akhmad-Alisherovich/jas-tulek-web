import React from 'react';

const Hero = () => {
  return (
    <section className="section hero">
      <div className="container">
        <h1>Jas Tulek — ҰБТ-ға ақылды дайындық платформасы</h1>
        <p>Жеке оқу траекториясы мен жасанды интеллекттің көмегімен жоғары балл жинауға қол жеткізіңіз.</p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => alert('Тіркелу жүйесі жақында қосылады!')}>Дайындықты бастау</button>
          <a href="#subjects" className="btn btn-secondary">Пәндерді көру</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
