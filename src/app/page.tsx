'use client';

import { useReducer, useState, useRef, useMemo } from 'react';
import useGameData from '@/hooks/use-game-data';
import { SetupScreen } from '@/components/game/SetupScreen';
import { QuizMode } from '@/components/game/QuizMode';
import { ImageGuessingGame } from '@/components/game/ImageGuessingGame';
import { LeafTreeMatching } from '@/components/game/LeafTreeMatching';
import { EndScreen } from '@/components/game/EndScreen';
import { DataEditor } from '@/components/game/DataEditor';
import { IntroScreen } from '@/components/game/IntroScreen';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { GameData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

type GameState = 'intro' | 'setup' | 'edit' | 'quiz' | 'image-guessing' | 'matching' | 'end';

// Definición del estado y las acciones para el reducer
type State = {
  gameState: GameState;
  scores: { quiz: number; imageGuessing: number; matching: number; };
  totals: { quiz: number; imageGuessing: number; matching: number; };
};

type Action =
  | { type: 'START_GAME' }
  | { type: 'ENTER_EDIT_MODE' }
  | { type: 'EXIT_EDIT_MODE' }
  | { type: 'COMPLETE_QUIZ'; payload: { score: number; total: number } }
  | { type: 'COMPLETE_IMAGE_GUESSING'; payload: { score: number; total: number } }
  | { type: 'COMPLETE_MATCHING'; payload: { score: number; total: number } }
  | { type: 'RESTART' }
  | { type: 'ANIMATION_COMPLETE' };

const initialState: State = {
  gameState: 'intro',
  scores: { quiz: 0, imageGuessing: 0, matching: 0 },
  totals: { quiz: 0, imageGuessing: 0, matching: 0 },
};

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ANIMATION_COMPLETE':
      return { ...state, gameState: 'setup' };
    case 'START_GAME':
      return {
        ...state,
        scores: initialState.scores,
        totals: initialState.totals,
        gameState: 'quiz',
      };
    case 'ENTER_EDIT_MODE':
      return { ...state, gameState: 'edit' };
    case 'EXIT_EDIT_MODE':
        return { ...state, gameState: 'setup'};
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        gameState: 'image-guessing',
        scores: { ...state.scores, quiz: action.payload.score },
        totals: { ...state.totals, quiz: action.payload.total },
      };
    case 'COMPLETE_IMAGE_GUESSING':
        return {
            ...state,
            gameState: 'matching',
            scores: { ...state.scores, imageGuessing: action.payload.score },
            totals: { ...state.totals, imageGuessing: action.payload.total },
        };
    case 'COMPLETE_MATCHING':
        return {
            ...state,
            gameState: 'end',
            scores: { ...state.scores, matching: action.payload.score },
            totals: { ...state.totals, matching: action.payload.total },
        };
    case 'RESTART':
      return {
        ...state,
        scores: initialState.scores,
        totals: initialState.totals,
        gameState: 'setup',
      };
    default:
        throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

const GameContent = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { gameData, isLoaded, error, setGameData } = useGameData();
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalScore = useMemo(() => {
    return state.scores.quiz + state.scores.imageGuessing + state.scores.matching;
  }, [state.scores]);

  const triggerConfetti = () => {
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
    }
    setShowConfetti(true);
    confettiTimerRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const handleStartGame = () => dispatch({ type: 'START_GAME' });
  const handleEnterEditMode = () => dispatch({ type: 'ENTER_EDIT_MODE' });

  const handleQuizComplete = (score: number, total: number) => {
    dispatch({ type: 'COMPLETE_QUIZ', payload: { score, total } });
  };
  
  const handleImageGuessingComplete = (score: number, total: number) => {
    dispatch({ type: 'COMPLETE_IMAGE_GUESSING', payload: { score, total } });
  };

  const handleMatchingComplete = (score: number, total: number) => {
    dispatch({ type: 'COMPLETE_MATCHING', payload: { score, total } });
  };
  
  const handleRestart = () => dispatch({ type: 'RESTART' });

  const handleExitEditMode = (newData?: GameData) => {
    if (newData) {
      setGameData(newData);
    }
    dispatch({ type: 'EXIT_EDIT_MODE' });
  };

  const handleAnimationComplete = () => {
    dispatch({ type: 'ANIMATION_COMPLETE' });
  };

  const renderGameContent = () => {
    if (error) {
        return (
            <Alert variant="destructive" className="max-w-md">
              <Icons.X className="h-4 w-4" />
              <AlertTitle>Error al Cargar los Datos</AlertTitle>
              <AlertDescription>
                  No se pudieron cargar los datos. Revisa la consola para más detalles.
                  <p className="mt-2 text-xs">({error})</p>
              </AlertDescription>
            </Alert>
        )
    }

    if (!isLoaded || !gameData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Icons.Flower className="w-16 h-16 animate-spin text-primary" />
          <p className="mt-4 text-lg text-primary/80">Cargando Flora Master...</p>
        </div>
      );
    }
    
    const plantsForGuessing = gameData.images.filter(img => img.type === 'plant' && img.options && img.options.length > 0);
    
    switch (state.gameState) {
      case 'intro':
        return <IntroScreen onAnimationComplete={handleAnimationComplete} />;
      case 'setup':
        return <SetupScreen onStartGame={handleStartGame} onEnterEditMode={handleEnterEditMode} />;
      case 'edit':
        return <DataEditor initialData={gameData} onExit={handleExitEditMode} />;
      case 'quiz':
        return <QuizMode questions={gameData.questions} onComplete={handleQuizComplete} onCorrectAnswer={triggerConfetti} />;
      case 'image-guessing':
        return <ImageGuessingGame allImages={plantsForGuessing} onComplete={handleImageGuessingComplete} onCorrectAnswer={triggerConfetti} />;
      case 'matching':
        return <LeafTreeMatching allImages={gameData.images} allPairs={gameData.pairs} onComplete={handleMatchingComplete} onCorrectAnswer={triggerConfetti} />;
      case 'end':
        return <EndScreen scores={state.scores} totals={state.totals} onRestart={handleRestart} />;
      default:
        return <div>Error: Estado de juego desconocido.</div>;
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background overflow-hidden bg-leaves">
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        
        <header className="absolute top-4 left-4 sm:top-6 sm:left-8 z-20 flex items-center gap-2">
            <Icons.Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">Flora Master</h1>
        </header>

        {(state.gameState === 'quiz' || state.gameState === 'image-guessing' || state.gameState === 'matching') && (
            <div className="absolute top-4 right-4 z-20 bg-black/30 text-white px-4 py-2 rounded-lg font-bold">
                Puntos: {totalScore}
            </div>
        )}
        <div className="z-10 w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={state.gameState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="w-full flex justify-center"
                >
                    {renderGameContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    </main>
  );
}


const Home = () => {
    return (
        <GameContent />
    );
};

export default Home;
