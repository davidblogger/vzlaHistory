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

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const treasuryPubkey = new PublicKey(PROJECT_TREASURY_WALLET);

    try {
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < CLAIM_AMOUNT_LAMPORTS + 5000) {
        setClaimState('error');
        setClaimError(
          'Tu wallet no tiene suficientes fondos en Devnet. ' +
          'Necesitas al menos ~0.000006 SOL. ' +
          'Usa un grifo de Solana Devnet (ej. https://faucet.solana.com) ' +
          'para obtener SOL de prueba.'
        );
        return;
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction();
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = blockhash;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: treasuryPubkey,
          lamports: CLAIM_AMOUNT_LAMPORTS,
        })
      );

      const signedTx = await wallet.signTransaction(transaction);

      const currentBlockHeight = await connection.getBlockHeight('confirmed');
      if (currentBlockHeight > lastValidBlockHeight) {
        setClaimState('error');
        setClaimError('El bloque expiró mientras firmabas. Vuelve a intentar.');
        return;
      }

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true }
      );

      setClaimState('confirming');

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

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
      } else if (msg.includes('seguridad') || msg.includes('security') || msg.includes('verificar')) {
        setClaimState('error');
        setClaimError(
          'Solflare no pudo verificar la transacción. ' +
          'Asegúrate de tener conexión a Internet e intenta de nuevo. ' +
          'Si el problema persiste, usa una wallet diferente como Phantom.'
        );
      } else if (msg.includes('Network') || msg.includes('fetch') || msg.includes('timeout') || msg.includes('Failed to fetch')) {
        setClaimState('error');
        setClaimError('Error de conexión con Solana Devnet. Intenta de nuevo.');
      } else if (msg.includes('blockhash') || msg.includes('expired')) {
        setClaimState('error');
        setClaimError('El bloque expiró. Vuelve a intentar reclamar el sello.');
      } else if (msg.includes('simul') || msg.includes('simulation') || msg.includes('simulate')) {
        setClaimState('error');
        setClaimError(
          'La transacción no pudo simularse. ' +
          'Asegúrate de que tu wallet tenga fondos en Devnet ' +
          '(usa https://faucet.solana.com para obtener SOL de prueba).'
        );
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
