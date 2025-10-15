
'use client';

import { useState, useMemo } from 'react';
import { GameWrapper } from './GameWrapper';
import type { QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Icons } from '../icons';
import { FormattedText } from './FormattedText';

interface QuizModeProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  onCorrectAnswer: () => void;
}

export function QuizMode({ questions, onComplete, onCorrectAnswer }: QuizModeProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<{ index: number; isCorrect: boolean } | null>(null);

    const gameQuestions = useMemo(() => questions, [questions]);
    const currentQuestion = gameQuestions[currentQuestionIndex];

    const handleAnswer = (selectedIndex: number) => {
        if (selectedAnswer) return;

        const isCorrect = currentQuestion.options[selectedIndex].isCorrect;
        setSelectedAnswer({ index: selectedIndex, isCorrect });

        if (isCorrect) {
            setScore(prev => prev + 1);
            onCorrectAnswer();
        }

        setTimeout(() => {
            setSelectedAnswer(null);
            if (currentQuestionIndex < gameQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                onComplete(score + (isCorrect ? 1 : 0), gameQuestions.length);
            }
        }, 1200);
    };
    
    const getGridColsClass = () => {
        const numOptions = currentQuestion.options.length;
        if (numOptions === 3) {
            return 'md:grid-cols-3';
        }
        return 'md:grid-cols-2';
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

        if (currentQuestion.options[index].isCorrect) {
            return 'bg-success/80 text-success-foreground';
        }
        
        return 'bg-muted/50 text-muted-foreground opacity-50';
    };

    if (!gameQuestions || gameQuestions.length === 0) {
        return (
            <GameWrapper title="Prueba de Botánica" description="No se encontraron preguntas.">
                <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                    <Icons.Flower className="w-16 h-16 text-primary/50" />
                    <p className="mt-2 text-muted-foreground">Añade algunas preguntas en el modo de edición para empezar.</p>
                    <Button onClick={() => onComplete(0, 0)} className="mt-6">Saltar este juego</Button>
                </div>
            </GameWrapper>
        );
    }
  
    return (
        <GameWrapper title="Prueba de Botánica" description={`Pregunta ${currentQuestionIndex + 1} de ${gameQuestions.length}`} className="max-w-4xl">
            <Progress value={((currentQuestionIndex + 1) / gameQuestions.length) * 100} className="mb-6" />
            <div className="space-y-8">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <FormattedText text={currentQuestion.questionText} className="font-semibold text-lg text-center" />
                    </CardHeader>
                    <CardContent className={`grid grid-cols-1 ${getGridColsClass()} gap-4`}>
                       {currentQuestion.options.map((option, index) => (
                           <Button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={!!selectedAnswer}
                                className={cn('p-6 h-auto text-base whitespace-normal transition-all duration-300', getButtonClass(index))}
                            >
                               <FormattedText text={option.text} />
                           </Button>
                       ))}
                    </CardContent>
                </Card>
            </div>
        </GameWrapper>
    );
}
