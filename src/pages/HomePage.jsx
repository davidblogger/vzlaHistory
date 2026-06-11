import { useCallback } from 'react';
import { historyData } from '../data/historyData';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useQuiz } from '../hooks/useQuiz';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import QuizModal from '../components/QuizModal';

export default function HomePage() {
  const quiz = useQuiz();

  useScrollSpy();

  const handleStartQuiz = useCallback(
    (id) => {
      quiz.openQuiz(id);
    },
    [quiz]
  );

  return (
    <>
      <a href="#main-content" className="skip-link" aria-label="Saltar al contenido principal">
        Saltar al contenido principal
      </a>
      <Hero />
      <main id="main-content">
        <Timeline data={historyData} onStartQuiz={handleStartQuiz} />
      </main>
      <QuizModal
        isOpen={quiz.isOpen}
        title={quiz.title}
        data={quiz.data}
        state={quiz.state}
        onClose={quiz.closeQuiz}
        onSelectAnswer={quiz.selectAnswer}
        onNext={quiz.nextQuestion}
        onFinish={quiz.finishQuiz}
        onRetry={quiz.retryQuiz}
      />
    </>
  );
}
