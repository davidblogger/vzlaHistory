import { useState, useCallback } from 'react';
import { quizRegistry } from '../data/historyData';

export default function TimelineItem({ era, onStartQuiz, isUnlocked, eraStatus }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const hasQuiz = quizRegistry[era.id] != null;
  const canTakeQuiz = hasQuiz && isUnlocked;
  const quizLabel = {
    prehispanico: 'Pon a prueba tus conocimientos sobre la era Prehispánica.',
    colonia: 'Pon a prueba tus conocimientos sobre la era Colonial.',
    independencia: 'Pon a prueba tus conocimientos sobre la era Independencia.',
    'siglo-xix-xx': 'Pon a prueba tus conocimientos sobre los Siglos XIX y XX.',
    contemporanea: 'Pon a prueba tus conocimientos sobre la era Contemporánea.',
  };

  const statusIcon =
    eraStatus === 'stamped' ? '\u2705' :
    eraStatus === 'completed' ? '\uD83D\uDFE1' :
    eraStatus === 'unlocked' ? '\uD83D\uDD13' :
    '\uD83D\uDD12';

  return (
    <div
      className="timeline-item"
      id={`era-${era.id}`}
      data-era={era.id}
      aria-expanded={expanded}
    >
      <div className="timeline-marker" aria-hidden="true"></div>
      <div className="timeline-card">
        <button
          className="timeline-header"
          aria-expanded={expanded}
          aria-controls={`content-${era.id}`}
          id={`btn-${era.id}`}
          onClick={toggle}
        >
          <span className="timeline-emoji" aria-hidden="true">
            {era.emoji}
          </span>
          <span className="timeline-title-group">
            <h3>{era.title}</h3>
            <time>{era.period}</time>
          </span>
          <span className="timeline-era-status-icon">{statusIcon}</span>
          <span className="timeline-icon" aria-hidden="true">
            +
          </span>
        </button>
        <div
          className="timeline-content"
          id={`content-${era.id}`}
          role="region"
          aria-labelledby={`btn-${era.id}`}
        >
          <div className="timeline-body">
            <p className="timeline-summary">{era.summary}</p>
            <ul className="timeline-events" role="list">
              {era.events.map((event, i) => (
                <li className="timeline-event" key={i}>
                  <span className="timeline-event-marker" aria-hidden="true"></span>
                  <span className="timeline-event-text">{event}</span>
                </li>
              ))}
            </ul>
            {canTakeQuiz && (
              <div className="timeline-quiz-section">
                <div className="timeline-quiz-divider"></div>
                <p className="timeline-quiz-cta">{quizLabel[era.id]}</p>
                <button
                  className="btn btn-primary quiz-start-btn"
                  data-quiz={era.id}
                  onClick={() => onStartQuiz(era.id)}
                >
                  Comenzar Cuestionario
                </button>
              </div>
            )}
            {!isUnlocked && hasQuiz && (
              <div className="timeline-quiz-section">
                <div className="timeline-quiz-divider"></div>
                <p className="timeline-quiz-locked">Completa la era anterior y reclama tu sello para desbloquear esta era.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
