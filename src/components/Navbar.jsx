import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar({ onOpenPassport }) {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey } = useWallet();
  const location = useLocation();

  const toggleNav = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeNav = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAnchorClick = useCallback(
    (e, href) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        closeNav();
      }
    },
    [closeNav]
  );

  const handleOpenPassport = useCallback(() => {
    closeNav();
    if (onOpenPassport) onOpenPassport();
  }, [closeNav, onOpenPassport]);

  const isHome = location.pathname === '/';

  const walletDisplay = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;
  void walletDisplay;

  return (
    <header className="navbar" role="banner">
      <nav aria-label="Navegación principal">
        <Link to="/" className="nav-logo" aria-label="Ir al inicio" onClick={closeNav}>
          <span aria-hidden="true">&#x1F1FB;&#x1F1EA;</span>
          <span className="nav-logo-text">HistoriaVE</span>
        </Link>
        <button
          className="nav-toggle"
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={isOpen}
          aria-controls="nav-list"
          onClick={toggleNav}
        >
          <span className="nav-toggle-bar" aria-hidden="true"></span>
          <span className="nav-toggle-bar" aria-hidden="true"></span>
          <span className="nav-toggle-bar" aria-hidden="true"></span>
        </button>
        <ul className={`nav-links${isOpen ? ' open' : ''}`} id="nav-list" role="list">
          {isHome ? (
            <>
              <li>
                <a
                  href="#era-prehispanico"
                  aria-label="Ir a la era Prehispánica"
                  onClick={(e) => handleAnchorClick(e, '#era-prehispanico')}
                >
                  Prehispánico
                </a>
              </li>
              <li>
                <a
                  href="#era-colonia"
                  aria-label="Ir a la era Colonial"
                  onClick={(e) => handleAnchorClick(e, '#era-colonia')}
                >
                  Colonia
                </a>
              </li>
              <li>
                <a
                  href="#era-independencia"
                  aria-label="Ir a la era de la Independencia"
                  onClick={(e) => handleAnchorClick(e, '#era-independencia')}
                >
                  Independencia
                </a>
              </li>
              <li>
                <a
                  href="#era-siglo-xix-xx"
                  aria-label="Ir al siglo XIX y XX"
                  onClick={(e) => handleAnchorClick(e, '#era-siglo-xix-xx')}
                >
                  S. XIX–XX
                </a>
              </li>
              <li>
                <a
                  href="#era-contemporanea"
                  aria-label="Ir a la era Contemporánea"
                  onClick={(e) => handleAnchorClick(e, '#era-contemporanea')}
                >
                  Contemporánea
                </a>
              </li>
            </>
          ) : null}
          <li className="nav-item-passport">
            <button className="nav-link-passport" onClick={handleOpenPassport}>
              Mi Pasaporte
            </button>
          </li>

          <li className="nav-wallet-item">
            <WalletMultiButton className="wallet-btn-custom" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
