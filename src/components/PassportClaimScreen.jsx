const DEVNET_EXPLORER = 'https://explorer.solana.com/tx';

export default function PassportClaimScreen({
  eraName,
  claimState,
  claimError,
  claimSignature,
  walletAddress,
  onClaim,
  onClose,
}) {
  return (
    <div className="claim-screen">
      {claimState === 'confirmed' ? (
        <div className="claim-success">
          <div className="claim-success-icon">&#x2705;</div>
          <h3 className="claim-success-title">Sello Histórico Reclamado</h3>
          <div className="claim-success-details">
            <div className="claim-detail">
              <span className="claim-detail-label">Era:</span>
              <span className="claim-detail-value">{eraName}</span>
            </div>
            <div className="claim-detail">
              <span className="claim-detail-label">Wallet:</span>
              <span className="claim-detail-value claim-wallet">{walletAddress}</span>
            </div>
            <div className="claim-detail">
              <span className="claim-detail-label">Firma:</span>
              <span className="claim-detail-value claim-signature">{claimSignature}</span>
            </div>
          </div>
          <a
            href={`${DEVNET_EXPLORER}/${claimSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary explorer-link"
          >
            Ver en Solana Explorer
          </a>
          <button className="btn claim-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      ) : (
        <div className="claim-prompt">
          <div className="claim-success-icon">&#x1F389;</div>
          <h3 className="claim-prompt-title">Has completado la Era {eraName}</h3>
          <p className="claim-prompt-text">
            Reclama tu Sello Histórico en Solana Devnet para registrar tu logro en la blockchain.
          </p>

          {claimState === 'error' && (
            <div className="claim-error">
              <span className="claim-error-msg">{claimError}</span>
            </div>
          )}

          <button
            className="btn btn-primary claim-btn"
            onClick={onClaim}
            disabled={claimState === 'signing' || claimState === 'confirming'}
          >
            {claimState === 'signing'
              ? 'Firmando transacción...'
              : claimState === 'confirming'
              ? 'Confirmando en Devnet...'
              : 'Reclamar Sello Histórico'}
          </button>
        </div>
      )}
    </div>
  );
}
