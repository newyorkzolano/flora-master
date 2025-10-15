
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { GameWrapper } from './GameWrapper';
import type { GameImage, QuizQuestionOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Icons } from '../icons';
import { FormattedText } from './FormattedText';
import { cn } from '@/lib/utils';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface ImageGuessingGameProps {
  allImages: GameImage[];
  onComplete: (score: number, total: number) => void;
  onCorrectAnswer: () => void;
}

const MIN_PLANTS_REQUIRED = 1;

export function ImageGuessingGame({ allImages, onComplete, onCorrectAnswer }: ImageGuessingGameProps) {
  const gameRounds = useMemo(() => shuffleArray(allImages), [allImages]);
  
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ index: number; isCorrect: boolean } | null>(null);
  
  const [shuffledOptions, setShuffledOptions] = useState<QuizQuestionOption[]>([]);

  useEffect(() => {
    if (gameRounds.length > 0 && currentRoundIndex < gameRounds.length) {
      const currentQuestion = gameRounds[currentRoundIndex];
      setShuffledOptions(shuffleArray(currentQuestion.options || []));
    }
  }, [currentRoundIndex, gameRounds]);

  const currentQuestionImage = gameRounds[currentRoundIndex];
  
  const handleAnswer = (selectedIndex: number) => {
    if (selectedAnswer || !currentQuestionImage) return;
    
    const isCorrect = shuffledOptions[selectedIndex].isCorrect;
    setSelectedAnswer({ index: selectedIndex, isCorrect });

    if (isCorrect) {
      setScore(prev => prev + 1);
      onCorrectAnswer();
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentRoundIndex < gameRounds.length - 1) {
        setCurrentRoundIndex(prev => prev + 1);
      } else {
        onComplete(score + (isCorrect ? 1 : 0), gameRounds.length);
      }
    }, 1500);
  };

  const getButtonClass = (index: number) => {
    if (!selectedAnswer) {
        return 'bg-card hover:bg-accent/80 border border-border';
    }

    const { index: selectedIndex, isCorrect } = selectedAnswer;

    if (index === selectedIndex && isCorrect) {
        return 'bg-success/80 text-success-foreground transform scale-105 ring-4 ring-success/50';
    }

    if (index === selectedIndex && !isCorrect) {
        return 'bg-destructive/80 text-destructive-foreground animate-shake';
    }

    if (shuffledOptions[index].isCorrect) {
        return 'bg-success/80 text-success-foreground';
    }
    
    return 'bg-muted/50 text-muted-foreground opacity-50';
  };
  
  if (gameRounds.length < MIN_PLANTS_REQUIRED) {
    return (
        <GameWrapper title="¡Nombra esa Planta!" description="Se necesitan más imágenes para jugar.">
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <Icons.Flower className="w-16 h-16 text-primary/50" />
                 <p className="mt-4 text-muted-foreground">Necesitas al menos {MIN_PLANTS_REQUIRED} plantas con opciones definidas en tus datos.</p>
                 <Button onClick={() => onComplete(0, 0)} className="mt-6">Saltar este juego</Button>
            </div>
        </GameWrapper>
    );
  }

  if (!currentQuestionImage) {
      return (
          <GameWrapper title="Cargando..." description="Preparando el juego de adivinanzas.">
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <Icons.Flower className="w-16 h-16 animate-spin text-primary" />
              </div>
          </GameWrapper>
      );
  }

  return (
    <GameWrapper title="¿Cómo se llama esta planta?" description={`Ronda ${currentRoundIndex + 1} de ${gameRounds.length}`}>
        <Progress value={((currentRoundIndex + 1) / gameRounds.length) * 100} className="mb-4" />
        <div className="text-center w-full max-w-5xl">
             <div className="relative w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden shadow-lg border-4 border-card bg-black/10">
                <Image
                    src={currentQuestionImage.url}
                    alt={`Planta a adivinar: ${currentQuestionImage.name}`}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shuffledOptions.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={!!selectedAnswer}
                        className={cn('p-6 h-auto text-base whitespace-normal transition-all duration-300', getButtonClass(index))}
                    >
                        <FormattedText text={option.text} />
                    </Button>
                ))}
            </div>
        </div>
    </GameWrapper>
  );
}
