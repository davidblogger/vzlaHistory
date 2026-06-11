export default function QuizResults({ data, answers, onRetry }) {
  let correctCount = 0;

  const resultsHtml = data.map((q, i) => {
    const isCorrect = answers[i] === q.correct;
    if (isCorrect) correctCount++;

    return (
      <div
        key={i}
        className={`quiz-result-item ${
          isCorrect ? 'result-correct' : 'result-incorrect'
        }`}
      >
        <div className="quiz-result-header">
          <span className="quiz-result-icon">
            {isCorrect ? '\u2714' : '\u2718'}
          </span>
          <span className="quiz-result-q">
            {i + 1}. {q.question}
          </span>
        </div>
        <div className="quiz-result-detail">
          <span className="quiz-result-label">Tu respuesta:</span>{' '}
          {answers[i] !== null ? q.options[answers[i]] : <em>No respondida</em>}
        </div>
        {!isCorrect && (
          <div className="quiz-result-detail quiz-result-correct-answer">
            <span className="quiz-result-label">Correcta:</span>{' '}
            {q.options[q.correct]}
          </div>
        )}
      </div>
    );
  });

  const percentage = Math.round((correctCount / data.length) * 100);

  return (
    <div className="quiz-results">
      <div className="quiz-score-circle">
        <span className="quiz-score-num">{correctCount}</span>
        <span className="quiz-score-den">/{data.length}</span>
      </div>
      <div className="quiz-percentage">{percentage}%</div>
      <h3 className="quiz-results-title">Resultados</h3>
      <div className="quiz-results-list">{resultsHtml}</div>
      <button className="btn btn-primary quiz-retry-btn" onClick={onRetry}>
        Reintentar cuestionario
      </button>
    </div>
  );
}
