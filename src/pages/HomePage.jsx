import { useCallback, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, SystemProgram, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { historyData } from '../data/historyData';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useQuiz } from '../hooks/useQuiz';
import { usePassportContext } from '../context/PassportContext';
import { PROJECT_TREASURY_WALLET, CLAIM_AMOUNT_LAMPORTS } from '../config';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import QuizModal from '../components/QuizModal';

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

    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const treasuryPubkey = new PublicKey(PROJECT_TREASURY_WALLET);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasuryPubkey,
          lamports: CLAIM_AMOUNT_LAMPORTS,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);

      setClaimState('confirming');

      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        setClaimState('error');
        setClaimError('No se pudo confirmar la transacción en Devnet.');
        return;
      }

      const walletAddress = wallet.publicKey.toBase58();
      passport.claimStamp(eraId, walletAddress, signature);
      claimEraId.current = eraId;

      setClaimSignature(signature);
      setClaimState('confirmed');
    } catch (err) {
      if (err.code === 4001 || err.message?.includes('User rejected') || err.message?.includes('cancelada')) {
        setClaimState('error');
        setClaimError('Firma cancelada por el usuario.');
      } else if (err.message?.includes('Network') || err.message?.includes('fetch') || err.message?.includes('timeout') || err.message?.includes('Failed to fetch')) {
        setClaimState('error');
        setClaimError('Error de conexión con Solana Devnet.');
      } else {
        setClaimState('error');
        setClaimError('No se pudo confirmar la transacción en Devnet.');
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
