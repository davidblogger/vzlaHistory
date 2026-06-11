import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            Hecho con <span aria-label="amor">&#x2764;&#xFE0F;</span> para
            preservar la memoria histórica.
          </p>
          <nav className="footer-nav" aria-label="Enlaces del proyecto">
            <Link to="/documentacion" className="footer-link">
              Documentación
            </Link>
          </nav>
          <p className="footer-credits">
            Construido con <span aria-label="Solana purple">&#x2B50;</span> en el
            ecosistema Solana
          </p>
        </div>
      </div>
    </footer>
  );
}
