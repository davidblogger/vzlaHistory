import { useEffect, useCallback } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

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

  return (
    <div className="modal active" role="dialog" aria-modal="true" aria-labelledby="quiz-modal-title">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="quiz-modal-title">Cuestionario — {title}</h2>
          <button className="modal-close-btn" aria-label="Cerrar cuestionario" onClick={onClose}>
            &times;
          </button>
        </div>
        <div id="quiz-container">
          {state.completed ? (
            <QuizResults
              data={data}
              answers={state.answers}
              onRetry={onRetry}
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
