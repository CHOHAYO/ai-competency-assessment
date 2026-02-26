import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  name: string;
  email: string;
  affiliation?: string;
  job?: string;
  task?: string;
  industry?: string;
  age?: string;
  marketing?: boolean;
}

interface AssessmentState {
  step: 'landing' | 'info' | 'assessment' | 'loading' | 'results';
  userInfo: UserInfo;
  answers: Record<number, number>;
  currentQuestionIndex: number;
  sessionId: string | null;
}

export interface SharedData {
  userInfo: UserInfo;
  answers: Record<number, number>;
}

interface AssessmentContextType extends AssessmentState {
  setStep: (step: AssessmentState['step']) => void;
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: number, score: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setSessionId: (id: string | null) => void;
  resetAssessment: () => void;
  sharedData: SharedData | null;
  setSharedData: (data: SharedData | null) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AssessmentState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('scopelabs-assessment');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return {
      step: 'landing',
      userInfo: { name: '', email: '' },
      answers: {},
      currentQuestionIndex: 0,
      sessionId: null,
    };
  });

  const [sharedData, setSharedData] = useState<SharedData | null>(null);

  useEffect(() => {
    localStorage.setItem('scopelabs-assessment', JSON.stringify(state));
  }, [state]);

  const setStep = (step: AssessmentState['step']) => {
    setState((prev) => ({ ...prev, step }));
  };

  const setUserInfo = (info: UserInfo) => {
    setState((prev) => ({ ...prev, userInfo: info }));
  };

  const setAnswer = (questionId: number, score: number) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: score },
    }));
  };

  const setCurrentQuestionIndex = (index: number) => {
    setState((prev) => ({ ...prev, currentQuestionIndex: index }));
  };

  const setSessionId = (id: string | null) => {
    setState((prev) => ({ ...prev, sessionId: id }));
  };

  const resetAssessment = () => {
    const newState: AssessmentState = {
      step: 'landing',
      userInfo: { name: '', email: '' },
      answers: {},
      currentQuestionIndex: 0,
      sessionId: null,
    };
    setState(newState);
    setSharedData(null);
    localStorage.removeItem('scopelabs-assessment');
  };

  return (
    <AssessmentContext.Provider
      value={{
        ...state,
        setStep,
        setUserInfo,
        setAnswer,
        setCurrentQuestionIndex,
        setSessionId,
        resetAssessment,
        sharedData,
        setSharedData,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
