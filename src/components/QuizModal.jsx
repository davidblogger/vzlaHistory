import { useEffect, useCallback } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import PassportClaimScreen from './PassportClaimScreen';

export default function QuizModal({
  isOpen,
  title,
  data,
  state,
  onClose,
  onSelectAnswer,
  onNext,
  onFinish,
  onRetry,
  onPassQuiz,
  claimState,
  claimError,
  claimSignature,
  walletAddress,
  onClaimStamp,
  eraId,
  passportPassedEra,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !state) return null;

  const currentQuestion = state.completed ? null : data[state.current];
  const showClaimScreen = state.completed && passportPassedEra;
  const isStamped = claimState === 'confirmed';

  return (
    <div className="modal active" role="dialog" aria-modal="true" aria-labelledby="quiz-modal-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="quiz-modal-title">
            {showClaimScreen ? (isStamped ? 'Sello Reclamado' : `\u{1F389} Era ${title} Completada`) : `Cuestionario — ${title}`}
          </h2>
          <button className="modal-close-btn" aria-label="Cerrar cuestionario" onClick={onClose}>
            &times;
          </button>
        </div>
        <div id="quiz-container">
          {showClaimScreen ? (
            <PassportClaimScreen
              eraName={title}
              claimState={claimState}
              claimError={claimError}
              claimSignature={claimSignature}
              walletAddress={walletAddress}
              onClaim={onClaimStamp}
              onClose={onClose}
            />
          ) : state.completed ? (
            <QuizResults
              data={data}
              answers={state.answers}
              onRetry={onRetry}
              onPassQuiz={onPassQuiz}
              eraId={eraId}
            />
          ) : (
            <QuizQuestion
              questionData={currentQuestion}
              currentIndex={state.current}
              totalQuestions={data.length}
              selectedAnswer={state.answers[state.current]}
              onSelectAnswer={onSelectAnswer}
              onNext={onNext}
              onFinish={onFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
}
