import { createContext, useContext, useState, ReactNode } from 'react';

type QuestionSet = 'civics' | 'form';

interface QuestionSetContextValue {
  questionSet: QuestionSet;
  setQuestionSet: (set: QuestionSet) => void;
}

const QuestionSetContext = createContext<QuestionSetContextValue | null>(null);

export function QuestionSetProvider({ children }: { children: ReactNode }) {
  const [questionSet, setQuestionSetState] = useState<QuestionSet>(() => {
    const stored = localStorage.getItem('questionSet');
    return stored === 'form' ? 'form' : 'civics';
  });

  const setQuestionSet = (set: QuestionSet) => {
    localStorage.setItem('questionSet', set);
    setQuestionSetState(set);
  };

  return (
    <QuestionSetContext.Provider value={{ questionSet, setQuestionSet }}>
      {children}
    </QuestionSetContext.Provider>
  );
}

export function useQuestionSet(): QuestionSetContextValue {
  const ctx = useContext(QuestionSetContext);
  if (!ctx) throw new Error('useQuestionSet must be used within QuestionSetProvider');
  return ctx;
}
