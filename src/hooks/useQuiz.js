import { useState, useCallback } from 'react';
import { quizRegistry } from '../data/historyData';

function loadState(key, dataLength) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const state = JSON.parse(saved);
      if (state.answers && state.answers.length === dataLength) {
        return state;
      }
    }
  } catch (e) {}
  return null;
}

function createInitialState(dataLength) {
  return {
    current: 0,
    answers: new Array(dataLength).fill(null),
    completed: false,
  };
}

export function useQuiz() {
  const [quizId, setQuizId] = useState(null);
  const [state, setState] = useState(null);

  const entry = quizId ? quizRegistry[quizId] : null;
  const data = entry ? entry.data : [];
  const storageKey = entry ? entry.key : '';
  const title = entry ? entry.title : '';

  const openQuiz = useCallback((id) => {
    setQuizId(id);
    const e = quizRegistry[id];
    if (e) {
      const saved = loadState(e.key, e.data.length);
      setState(saved || createInitialState(e.data.length));
    }
  }, []);

  const closeQuiz = useCallback(() => {
    setQuizId(null);
    setState(null);
  }, []);

  const saveState = useCallback(
    (newState) => {
      setState(newState);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(newState));
      }
    },
    [storageKey]
  );

  const selectAnswer = useCallback(
    (index) => {
      if (!state || state.answers[state.current] !== null) return;
      const newAnswers = [...state.answers];
      newAnswers[state.current] = index;
      saveState({ ...state, answers: newAnswers });
    },
    [state, saveState]
  );

  const nextQuestion = useCallback(() => {
    saveState({ ...state, current: state.current + 1 });
  }, [state, saveState]);

  const finishQuiz = useCallback(() => {
    saveState({ ...state, completed: true });
  }, [state, saveState]);

  const retryQuiz = useCallback(() => {
    saveState(createInitialState(data.length));
  }, [data.length, saveState]);

  const isOpen = quizId !== null;

  return {
    isOpen,
    title,
    data,
    state,
    openQuiz,
    closeQuiz,
    selectAnswer,
    nextQuestion,
    finishQuiz,
    retryQuiz,
  };
}
