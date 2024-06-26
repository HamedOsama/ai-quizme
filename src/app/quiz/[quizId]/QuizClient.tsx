'use client';

import { useMemo, useState } from 'react';

import { AnswerBox } from '@/components/quiz/AnswerBox';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuizSubmission from '@/components/quiz/QuizSubmission';
import { SafeQuiz } from '@/types';

interface QuizClientProps {
  quiz: SafeQuiz;
}

const QuizClient: React.FC<QuizClientProps> = ({ quiz }) => {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState(
    Array(quiz.questions.length).fill(null)
  ); // array of answers

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // reset the states
  const handleExit = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((value) => value - 1);
    }
  };

  const handleNext = () => {
    // if haven't started yet
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }

    setSelectedAnswer(null);
    // setIsCorrect(null);
  };

  const scorePercentage = useMemo(() => {
    return Math.round((score / quiz.questions.length) * 100);
  }, [quiz.questions.length, score]);

  const handleAnswer = (answer: any) => {
    if (answers[currentQuestion] !== null) return; // prevent re-answer the question

    // select the answer and update the answer list
    setSelectedAnswer(answer.id);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer.id;
    setAnswers(newAnswers);

    if (answer.isCorrect) {
      setScore(score + 1);
    }
    // setIsCorrect(isCurrentCorrect);
  };

  if (submitted) {
    return (
      <QuizSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={quiz.questions.length}
      />
    );
  }

  return (
    <div className='flex flex-col flex-1'>
      {started && (
        <div className='flex flex-row justify-center items-center gap-8 position-sticky top-0 z-10 shadow-md py-4 px-8 mb-5'>
          <button onClick={handleBack} disabled={currentQuestion === 0}>
            Back
          </button>
          <ProgressBar
            value={(currentQuestion / quiz.questions.length) * 100}
          />
          <button onClick={handleExit}>Exit</button>
        </div>
      )}

      <main className='flex justify-center flex-1'>
        {!started ? (
          <h1 className='text-3xl font-bold'>Let&apos;s get started</h1>
        ) : (
          <div>
            {/* QUESTION */}
            <h2 className='text-3xl font-bold'>
              {quiz.questions[currentQuestion].questionText}
            </h2>

            {/* ANSWERS */}
            <div className='grid grid-cols-1 gap-6 mt-6'>
              {quiz.questions[currentQuestion].answers.map((answer) => {
                const variant =
                  answers[currentQuestion] === answer.id
                    ? answer.isCorrect
                      ? 'neoSuccess'
                      : 'neoDanger'
                    : 'neoOutline';
                return (
                  <AnswerBox
                    key={answer.id}
                    variant={variant}
                    size='xl'
                    onClick={() => handleAnswer(answer)}
                  >
                    <p className='whitespace-normal'>{answer.answerText}</p>
                  </AnswerBox>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className='footer mt-20 pb-9 px-6 relative mb-0'>
        {/* <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answers.find(
              (answer) => answer.isCorrect === true
            )?.answerText || ''
          }
        /> */}

        <div className='mx-auto w-40'>
          <AnswerBox
            variant='neo'
            size='lg'
            onClick={handleNext}
            disabled={!answers[currentQuestion] && started}
          >
            {!started
              ? 'Start'
              : currentQuestion === quiz.questions.length - 1
              ? 'Submit'
              : 'Next'}
          </AnswerBox>
        </div>
      </footer>
    </div>
  );
};

export default QuizClient;
