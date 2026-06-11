import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ERA_ORDER } from '../config';
import { quizRegistry } from '../data/historyData';

export default function HistoricalPassportDashboard({ passport, onClose }) {
  const { publicKey } = useWallet();

  const walletDisplay = useMemo(() => {
    if (!publicKey) return 'No conectada';
    const str = publicKey.toBase58();
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  }, [publicKey]);

  const fullAddress = publicKey ? publicKey.toBase58() : '';
  void fullAddress;

  const stamps = passport.getStamps();
  const progress = passport.getProgress();
  const lastSig = passport.getLastSignature();
  const nextEra = passport.getNextEra();

  const eraItems = useMemo(() => ERA_ORDER.map((id) => {
    const status = passport.getEraStatus(id);
    const eraData = quizRegistry[id];
    const name = eraData ? eraData.title : id;
    return { id, name, status };
  }), [passport]);

  const hasWallet = !!publicKey;

  return (
    <div className="modal active passport-modal" role="dialog" aria-modal="true" aria-labelledby="passport-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content passport-content">
        <div className="modal-header">
          <h2 id="passport-title">Mi Pasaporte Histórico</h2>
          <button className="modal-close-btn" aria-label="Cerrar pasaporte" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="passport-body">
          {!hasWallet ? (
            <div className="passport-no-wallet">
              <p>Conecta una wallet de Solana para ver tu Pasaporte Histórico.</p>
            </div>
          ) : (
            <>
              <div className="passport-summary">
                <div className="passport-field">
                  <span className="passport-field-label">Wallet:</span>
                  <span className="passport-field-value">{walletDisplay}</span>
                </div>
                <div className="passport-field">
                  <span className="passport-field-label">Sellos obtenidos:</span>
                  <span className="passport-field-value">{stamps.length} / {ERA_ORDER.length}</span>
                </div>
                <div className="passport-field">
                  <span className="passport-field-label">Progreso:</span>
                  <span className="passport-field-value">{progress}%</span>
                </div>
                {lastSig && (
                  <div className="passport-field">
                    <span className="passport-field-label">Última firma:</span>
                    <span className="passport-field-value passport-sig">
                      {lastSig.slice(0, 8)}...{lastSig.slice(-4)}
                    </span>
                  </div>
                )}
                {nextEra && (
                  <div className="passport-field">
                    <span className="passport-field-label">Próxima era:</span>
                    <span className="passport-field-value">{nextEra.name}</span>
                  </div>
                )}
              </div>

              <div className="passport-progress-bar">
                <div className="passport-progress-fill" style={{ width: progress + '%' }}></div>
              </div>

              <div className="passport-era-list">
                {eraItems.map((era) => {
                  let icon, statusClass, statusText;
                  switch (era.status) {
                    case 'stamped':
                      icon = '\u2705';
                      statusClass = 'era-stamped';
                      statusText = 'Sello Reclamado';
                      break;
                    case 'completed':
                      icon = '\uD83D\uDFE1';
                      statusClass = 'era-completed';
                      statusText = 'Completada';
                      break;
                    case 'unlocked':
                      icon = '\uD83D\uDD13';
                      statusClass = 'era-unlocked';
                      statusText = 'Disponible';
                      break;
                    default:
                      icon = '\uD83D\uDD12';
                      statusClass = 'era-locked';
                      statusText = 'Bloqueada';
                  }
                  return (
                    <div key={era.id} className={`passport-era-item ${statusClass}`}>
                      <span className="passport-era-icon">{icon}</span>
                      <span className="passport-era-name">{era.name}</span>
                      <span className="passport-era-status">{statusText}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
