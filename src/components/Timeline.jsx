import { useRevealAnimations } from '../hooks/useRevealAnimations';
import TimelineItem from './TimelineItem';

export default function Timeline({ data, onStartQuiz, passport }) {
  useRevealAnimations();

  return (
    <section id="timeline-section" aria-label="Línea de tiempo histórica de Venezuela">
      <div className="container">
        <h2 className="section-title">Línea de Tiempo</h2>
        <p className="section-desc">
          Haz clic en cada era para conocer sus eventos más importantes.
        </p>
        <div className="timeline" role="list" id="timeline-container">
          {data.map((era) => (
            <TimelineItem
              key={era.id}
              era={era}
              onStartQuiz={onStartQuiz}
              isUnlocked={passport ? passport.isEraUnlocked(era.id) : true}
              eraStatus={passport ? passport.getEraStatus(era.id) : 'unlocked'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
