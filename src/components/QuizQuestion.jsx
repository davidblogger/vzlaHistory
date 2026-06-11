export default function QuizQuestion({
  questionData,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onFinish,
}) {
  const isAnswered = selectedAnswer !== null;
  const progressPct = (currentIndex / totalQuestions) * 100;

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <>
      <div className="quiz-progress">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: progressPct + '%' }}
          ></div>
        </div>
        <span className="quiz-progress-text">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <h3 className="quiz-question">{questionData.question}</h3>

      <div className="quiz-options">
        {questionData.options.map((option, i) => {
          let cls = 'quiz-option';
          if (isAnswered) {
            cls += ' disabled';
            if (i === questionData.correct) cls += ' correct';
            if (i === selectedAnswer && i !== questionData.correct)
              cls += ' incorrect';
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={isAnswered}
              onClick={() => onSelectAnswer(i)}
            >
              <span className="quiz-option-letter">
                {letters[i]}.
              </span>{' '}
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <>
          <div
            className={`quiz-feedback ${
              selectedAnswer === questionData.correct
                ? 'feedback-correct'
                : 'feedback-incorrect'
            }`}
          >
            {selectedAnswer === questionData.correct ? (
              <>
                <span className="feedback-icon">&#x2714;</span> ¡Correcto!
              </>
            ) : (
              <>
                <span className="feedback-icon">&#x2718;</span> Incorrecto. La
                respuesta correcta es:{' '}
                <strong>{questionData.options[questionData.correct]}</strong>
              </>
            )}
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button className="btn btn-primary quiz-next-btn" onClick={onNext}>
              Siguiente
            </button>
          ) : (
            <button className="btn btn-primary quiz-next-btn" onClick={onFinish}>
              Ver resultados
            </button>
          )}
        </>
      )}
    </>
  );
}
