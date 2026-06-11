import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-label="Introducción">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">Historia de</span>
          <span className="hero-title-highlight">Venezuela</span>
        </h1>
        <p className="hero-subtitle">
          Un recorrido por los acontecimientos que forjaron una nación. Desde los
          pueblos originarios hasta el presente, descubre las eras que definieron
          a Venezuela.
        </p>
        <p className="hero-passport-text">
          Conecta tu wallet de Solana, aprueba cuestionarios y reclama sellos históricos en la blockchain para desbloquear todas las eras.
        </p>
        <div className="hero-actions">
          <a
            href="#era-prehispanico"
            className="btn btn-primary"
            aria-label="Comenzar el recorrido histórico"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#era-prehispanico');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Explorar línea de tiempo
            <span aria-hidden="true">&#x2193;</span>
          </a>
          <Link to="/documentacion" className="btn btn-secondary">
            Documentación
          </Link>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-text">Desliza</span>
        <span className="hero-scroll-line"></span>
      </div>
    </section>
  );
}
