import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAssessment } from '../context/AssessmentContext';
import { questions } from '../data/questions';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { CheckCircle2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { updateProgress, submitDiagnosis } from '../services/api';

export function Assessment() {
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    setStep,
    sessionId,
    setSharedData
  } = useAssessment();

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [direction, setDirection] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Group questions by category for the top progress bar
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const currentCategoryIndex = categories.indexOf(currentQuestion.category);

  const handleAnswer = useCallback(async (score: number) => {
    setAnswer(currentQuestion.id, score);

    // Auto-save simulation
    setIsAutoSaving(true);

    // Call progress API
    if (sessionId) {
      updateProgress(sessionId, currentQuestion.id, score).catch(err => {
        console.error('Failed to auto-save progress', err);
      });
    }

    setTimeout(() => setIsAutoSaving(false), 800);

    // Gamification: Show toast at milestones
    const questionsCompleted = currentQuestionIndex + 1;
    if (questionsCompleted === 10) {
      setToastMessage("🎉 1/3을 완료했습니다! 집중력이 좋으시네요.");
      setTimeout(() => setToastMessage(null), 3000);
    } else if (questionsCompleted === 20) {
      setToastMessage("🚀 거의 다 왔습니다! 당신의 AI 역량이 곧 공개됩니다.");
      setTimeout(() => setToastMessage(null), 3000);
    }

    // Auto-advance
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setDirection(1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300); // Small delay for visual feedback
    } else {
      // Last question - submit
      setTimeout(async () => {
        setIsAutoSaving(true); // show loader or similar
        // NOTE: the server currently accepts the full result_data from the frontend or calculates it itself. We'll pass nothing to result_data for now since we haven't refactored the frontend calculation out of Results.tsx yet.
        // Wait, the Results.tsx currently calculates the result. The submission endpoint simply marks the session as finished and optionally saves result data.
        // Let's just submit the session completion state here.
        try {
          if (sessionId) {
            await submitDiagnosis(sessionId, null);
          }
        } catch (error) {
          console.error('Failed to submit final result calculation.', error);
        }
        setIsAutoSaving(false);
        setStep('results');
      }, 500);
    }
  }, [currentQuestion.id, currentQuestionIndex, totalQuestions, setAnswer, setCurrentQuestionIndex, setStep, sessionId]);

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion.id]) {
      if (currentQuestionIndex < totalQuestions - 1) {
        setDirection(1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStep('results');
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 5) {
        handleAnswer(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto py-8 space-y-8"
    >
      {/* Top Progress Bar (Unified & Modern) */}
      <div className="relative pt-2 pb-4">
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md tracking-wide">
              {currentQuestion.category}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 font-medium text-gray-400">
            <span className="text-xl font-bold text-gray-900 leading-none">{currentQuestionIndex + 1}</span>
            <span className="text-sm border-l border-gray-300 pl-1.5 ml-0.5">{totalQuestions}</span>
          </div>
        </div>
        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />

        {/* Gamification Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 110, x: 'calc(-50% - 10px)' }}
              animate={{ opacity: 1, y: 120, x: 'calc(-50% - 10px)' }}
              exit={{ opacity: 0, y: 110, x: 'calc(-50% - 10px)' }}
              className="fixed top-24 left-1/2 bg-gray-900/90 backdrop-blur-md text-white px-5 py-2.5 text-sm rounded-full shadow-xl z-50 flex items-center gap-3 whitespace-nowrap border border-white/10"
              style={{ transform: 'translateX(calc(-50% - 10px)) translateY(120px)' }}
            >
              <span className="font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-save Indicator */}
      <div className="h-6 flex justify-end items-center text-xs text-gray-400">
        {isAutoSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-primary"
          >
            <Save size={12} />
            <span>Auto-saved</span>
          </motion.div>
        )}
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQuestionIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="min-h-[400px] flex flex-col shadow-xl border-0 ring-1 ring-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary/80 to-primary" />
            <CardHeader className="pb-2 md:pb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wide uppercase">
                  {currentQuestion.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {currentQuestion.subcategory}
                </span>
              </div>
              <CardTitle className="text-2xl md:text-3xl leading-snug font-bold text-gray-900">
                Q{currentQuestion.id}. {currentQuestion.text}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-center py-8 md:py-12">
              <div className="grid grid-cols-5 gap-3 md:gap-6 max-w-2xl mx-auto w-full">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => handleAnswer(score)}
                      className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 shadow-sm
                        ${answers[currentQuestion.id] === score
                          ? 'bg-primary text-white shadow-primary/30 scale-110 ring-4 ring-primary/20'
                          : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-1'
                        }
                      `}
                    >
                      {score}
                    </button>
                    <span className={`
                      text-[10px] md:text-xs font-medium text-center transition-colors duration-300 whitespace-nowrap absolute md:static -bottom-6 md:bottom-auto
                      ${answers[currentQuestion.id] === score ? 'text-primary font-bold' : 'text-gray-400'}
                      ${score === 1 || score === 5 || score === 3 ? 'opacity-100' : 'opacity-0 md:opacity-100'}
                    `}>
                      {score === 1 && "전혀 아님"}
                      {score === 2 && "아님"}
                      {score === 3 && "보통"}
                      {score === 4 && "그렇다"}
                      {score === 5 && "매우 그렇다"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile labels for endpoints */}
              <div className="flex md:hidden justify-between text-xs text-gray-400 mt-12 px-2 font-medium">
                <span>전혀 아님</span>
                <span>매우 그렇다</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> 이전
        </Button>

        <div className="text-xs text-gray-400 hidden md:block">
          <span className="font-medium text-gray-900">Tip:</span> 키보드 숫자 1~5를 눌러 빠르게 응답할 수 있습니다.
        </div>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={!answers[currentQuestion.id] ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {currentQuestionIndex === totalQuestions - 1 ? '결과 보기' : '다음'}
          {currentQuestionIndex !== totalQuestions - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
          {currentQuestionIndex === totalQuestions - 1 && <CheckCircle2 className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  );
}
