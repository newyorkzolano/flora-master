'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { GameWrapper } from './GameWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import trophyAnimationData from '../../../public/animations/Trophy.json';

interface EndScreenProps {
  scores: {
    quiz: number;
    imageGuessing: number;
    matching: number;
  };
  totals: {
    quiz: number;
    imageGuessing: number;
    matching: number;
  };
  onRestart: () => void;
}

const SUCCESS_THRESHOLD = 0.7; // 70%

export function EndScreen({ scores, totals, onRestart }: EndScreenProps) {
  const [showTrophy, setShowTrophy] = useState(false);

  const totalScore = Object.values(scores).reduce((acc, s) => acc + s, 0);
  const totalPossible = Object.values(totals).reduce((acc, s) => acc + s, 0);
  const scorePercentage = totalPossible > 0 ? totalScore / totalPossible : 0;

  useEffect(() => {
    // This code runs only on the client
    if (scorePercentage >= SUCCESS_THRESHOLD) {
      setShowTrophy(true);
    }
  }, [scorePercentage]);
  

  const modeNames: { [key: string]: string } = {
    quiz: 'Prueba',
    imageGuessing: 'Adivina la Imagen',
    matching: 'Relacionar',
  };

  return (
    <GameWrapper title="¡Juego Terminado!" description="Así es como te fue.">
      {showTrophy && (
        <div className="flex justify-center -mt-8 mb-4">
            <Lottie
                animationData={trophyAnimationData}
                loop={false}
                style={{ width: 150, height: 150 }}
            />
        </div>
      )}
      <div className="space-y-6 text-center">
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl text-primary">{totalScore} / {totalPossible}</CardTitle>
                <p className="text-muted-foreground">Puntuación Total</p>
            </CardHeader>
            <CardContent>
                <Progress value={totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0} className="w-full" />
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {Object.entries(scores).map(([mode, score]) => (
                <Card key={mode}>
                    <CardHeader>
                        <CardTitle className="capitalize">{modeNames[mode] || mode}</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{score} / {totals[mode as keyof typeof totals]}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Button size="lg" onClick={onRestart} className="mt-8">
          Jugar de Nuevo
        </Button>
      </div>
    </GameWrapper>
  );
}
