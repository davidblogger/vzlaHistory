import { useCallback, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { historyData } from '../data/historyData';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useQuiz } from '../hooks/useQuiz';
import { usePassportContext } from '../context/PassportContext';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import QuizModal from '../components/QuizModal';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export default function HomePage() {
  const quiz = useQuiz();
  const passport = usePassportContext();
  const wallet = useWallet();
  useScrollSpy();

  const [claimState, setClaimState] = useState('idle');
  const [claimError, setClaimError] = useState(null);
  const [claimSignature, setClaimSignature] = useState(null);
  const claimEraId = useRef(null);

  const handleStartQuiz = useCallback(
    (id) => {
      quiz.openQuiz(id);
      setClaimState('idle');
      setClaimError(null);
      setClaimSignature(null);
      claimEraId.current = null;
    },
    [quiz]
  );

  const handleCloseQuiz = useCallback(() => {
    quiz.closeQuiz();
    setClaimState('idle');
    setClaimError(null);
    setClaimSignature(null);
    claimEraId.current = null;
  }, [quiz]);

  const handlePassQuiz = useCallback(
    (eraId) => {
      passport.completeEra(eraId);
    },
    [passport]
  );

  const handleClaimStamp = useCallback(async () => {
    if (!wallet.publicKey) {
      setClaimState('error');
      setClaimError('Conecta una wallet para reclamar tu sello histórico.');
      return;
    }

    const eraId = quiz.quizId;
    if (!eraId) return;

    setClaimState('signing');
    setClaimError(null);

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < 5000) {
        setClaimState('error');
        setClaimError(
          'Tu wallet no tiene suficientes fondos en Devnet para pagar la cuota de red. ' +
          'Necesitas al menos ~0.000005 SOL. ' +
          'Usa un grifo de Solana Devnet (ej. https://faucet.solana.com).'
        );
        return;
      }

      const memo = `HistoriaVE:sello:${eraId}:${wallet.publicKey.toBase58()}:${Date.now()}`;

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction();
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = blockhash;
      transaction.add({
        keys: [{ pubkey: wallet.publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: new TextEncoder().encode(memo),
      });

      const signedTx = await wallet.signTransaction(transaction);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true }
      );

      setClaimState('confirming');

      const confirmation = await connection.confirmTransaction(
        signature,
        'confirmed'
      );

      if (confirmation.value.err) {
        setClaimState('error');
        setClaimError('La transacción fue rechazada por la red Devnet.');
        return;
      }

      const walletAddress = wallet.publicKey.toBase58();
      passport.claimStamp(eraId, walletAddress, signature);
      claimEraId.current = eraId;

      setClaimSignature(signature);
      setClaimState('confirmed');
    } catch (err) {
      const msg = typeof err === 'object' && err !== null
        ? (err.message || err.toString?.() || '')
        : String(err);

      if (err?.code === 4001 || msg.includes('User rejected') || msg.includes('cancelada') || msg.includes('rechaz')) {
        setClaimState('error');
        setClaimError('Firma cancelada por el usuario.');
      } else if (msg.includes('Network') || msg.includes('fetch') || msg.includes('timeout') || msg.includes('Failed to fetch')) {
        setClaimState('error');
        setClaimError('Error de conexión con Solana Devnet. Intenta de nuevo.');
      } else if (msg.includes('blockhash') || msg.includes('expired')) {
        setClaimState('error');
        setClaimError('El bloque expiró. Vuelve a intentar reclamar el sello.');
      } else if (msg.includes('Provided keys do not match')) {
        setClaimState('error');
        setClaimError('Error de configuración de la transacción. Recarga la página e intenta de nuevo.');
      } else {
        setClaimState('error');
        setClaimError(msg || 'No se pudo completar la transacción en Devnet. Reintenta.');
      }
    }
  }, [wallet, quiz.quizId, passport]);

  const passedEra = quiz.state?.completed && quiz.quizId
    ? passport.isEraCompleted(quiz.quizId) && !passport.isEraStamped(quiz.quizId)
      ? quiz.quizId
      : null
    : null;

  return (
    <>
      <a href="#main-content" className="skip-link" aria-label="Saltar al contenido principal">
        Saltar al contenido principal
      </a>
      <Hero />
      <main id="main-content">
        <Timeline
          data={historyData}
          onStartQuiz={handleStartQuiz}
          passport={passport}
        />
      </main>
      <QuizModal
        isOpen={quiz.isOpen}
        title={quiz.title}
        data={quiz.data}
        state={quiz.state}
        eraId={quiz.quizId}
        onClose={handleCloseQuiz}
        onSelectAnswer={quiz.selectAnswer}
        onNext={quiz.nextQuestion}
        onFinish={quiz.finishQuiz}
        onRetry={quiz.retryQuiz}
        onPassQuiz={handlePassQuiz}
        passportPassedEra={passedEra}
        claimState={claimState}
        claimError={claimError}
        claimSignature={claimSignature}
        walletAddress={wallet.publicKey ? wallet.publicKey.toBase58() : null}
        onClaimStamp={handleClaimStamp}
      />
    </>
  );
}
