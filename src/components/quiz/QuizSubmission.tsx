'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReward } from 'react-rewards';
import { X } from 'lucide-react';

import { AnswerBox } from './AnswerBox';
import Bar from './Bar';
import Button from '../Button';

interface QuizSubmissionProps {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
}

const QuizSubmission: React.FC<QuizSubmissionProps> = ({
  score,
  scorePercentage,
  totalQuestions,
}) => {
  const { reward } = useReward('rewardId', 'confetti');
  const router = useRouter();

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  const onHandleBack = () => {
    router.push('/new');
  };

  return (
    <div className='flex flex-col flex-1'>
      <div className='position-sticky top-0 z-10 shadow-sm py-4 w-full'>
        <header className='flex flex-row items-center justify-around py-2 gap-2'>
          <Button
            label='Review your previous attemp.'
            review
            onClick={onHandleBack} //TODO: Implement the review functionality
            outline={true}
          />

          <AnswerBox onClick={onHandleBack} size='icon' variant='outline'>
            <X />
          </AnswerBox>
        </header>
      </div>
      <main className='py-8 flex flex-col gap-4 items-center flex-1 mt-10'>
        <h2 className='text-3xl font-bold'>Quizz Complete!</h2>
        <p>You scored: {scorePercentage}%</p>
        {scorePercentage === 100 ? (
          <div className='flex flex-col items-center'>
            <p className='mb-5'>Congratulations! 🎉</p>
            <div className='flex justify-center'>
              <Image
                src='/images/guru.png'
                alt='Wise man guru'
                width={400}
                height={400}
              />
            </div>
            <span id='rewardId' />
          </div>
        ) : (
          <>
            <div className='flex flex-row gap-8 mt-6'>
              <Bar percentage={scorePercentage} color='green' />
              <Bar percentage={100 - scorePercentage} color='red' />
            </div>
            <div className='flex flex-row gap-8'>
              <p>{score} Correct</p>
              <p>{totalQuestions - score} Incorrect</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default QuizSubmission;
