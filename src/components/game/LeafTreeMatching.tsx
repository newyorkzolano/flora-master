'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { GameWrapper } from './GameWrapper';
import type { GameImage, LeafTreePair } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FormattedText } from './FormattedText';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface LeafTreeMatchingProps {
  allImages: GameImage[];
  allPairs: LeafTreePair[];
  onComplete: (score: number, total: number) => void;
  onCorrectAnswer: () => void;
}

const MIN_PAIRS_REQUIRED = 1;

export function LeafTreeMatching({ allImages, allPairs, onComplete, onCorrectAnswer }: LeafTreeMatchingProps) {
  const gamePairs = useMemo(() => shuffleArray(allPairs), [allPairs]);

  const { shuffledLeaves, shuffledTrees } = useMemo(() => {
    if (gamePairs.length === 0 || allImages.length === 0) {
      return { shuffledLeaves: [], shuffledTrees: [] };
    }
    const leafIds = new Set(gamePairs.map(p => p.leafId));
    const treeIds = new Set(gamePairs.map(p => p.treeId));
    
    const leaves = allImages.filter(img => leafIds.has(img.id));
    const trees = allImages.filter(img => treeIds.has(img.id));

    return {
        shuffledLeaves: shuffleArray(leaves),
        shuffledTrees: shuffleArray(trees)
    };
  }, [gamePairs, allImages]);

  const [selectedItem, setSelectedItem] = useState<GameImage | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({}); // { leafId: treeId }
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isPairCorrect = (leafId: string, treeId: string) => {
    return gamePairs.some(p => String(p.leafId) === leafId && String(p.treeId) === treeId);
  }

  const handleItemSelect = (item: GameImage) => {
    if (isSubmitted) return;
    
    const isMatched = Object.keys(matches).includes(String(item.id)) || Object.values(matches).includes(String(item.id));
    if (isMatched) return;

    if (!selectedItem) {
        setSelectedItem(item);
        return;
    }

    if (selectedItem.id === item.id) {
        setSelectedItem(null);
        return;
    }
    
    if (selectedItem.type === item.type) {
        setSelectedItem(item);
        return;
    }

    const leaf = selectedItem.type === 'leaf' ? selectedItem : item;
    const tree = selectedItem.type === 'tree' ? selectedItem : item;

    if (isPairCorrect(String(leaf.id), String(tree.id))) {
        onCorrectAnswer();
    }

    setMatches(prev => ({ ...prev, [String(leaf.id)]: String(tree.id) }));
    setSelectedItem(null);
  };


  const calculateScore = () => {
    return gamePairs.reduce((score, pair) => {
      const leafIdStr = String(pair.leafId);
      const treeIdStr = String(pair.treeId);
      const isCorrect = matches[leafIdStr] === treeIdStr;
      return isCorrect ? score + 1 : score;
    }, 0);
  };

  const getMatchResult = (leafId: string): 'correct' | 'incorrect' | 'unanswered' => {
      if (!isSubmitted || !matches[leafId]) return 'unanswered';
      const correctTreeId = allPairs.find(p => String(p.leafId) === leafId)?.treeId;
      return String(matches[leafId]) === String(correctTreeId) ? 'correct' : 'incorrect';
  }

  const getImageHint = (imageName: string) => {
    return imageName.toLowerCase().replace(/\s/g, '_');
  }

  if (gamePairs.length < MIN_PAIRS_REQUIRED) {
    return (
        <GameWrapper title="Relaciona la Hoja con el Árbol" description="Se necesitan más pares para jugar.">
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <Icons.Tree className="w-16 h-16 text-primary/50" />
                <p className="mt-2 text-muted-foreground">Necesitas al menos {MIN_PAIRS_REQUIRED} par de hoja/árbol en tus datos.</p>
                <Button onClick={() => onComplete(0, 0)} className="mt-6">Saltar este juego</Button>
            </div>
        </GameWrapper>
    );
  }

  const isMatched = (item: GameImage) => {
      const id = String(item.id);
      if (item.type === 'leaf') return !!matches[id];
      if (item.type === 'tree') return Object.values(matches).includes(id);
      return false;
  }
  
  const finalScore = useMemo(() => calculateScore(), [isSubmitted, matches, gamePairs]);

  return (
    <GameWrapper title="Relaciona la Hoja con el Árbol" description="Haz clic en una hoja, luego en su árbol correspondiente.">
      <Progress value={(Object.keys(matches).length / gamePairs.length) * 100} className="mb-4" />
      <div className="space-y-6">
        <div className="space-y-3">
            <h3 className="text-center font-bold text-lg text-primary">Hojas</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {shuffledLeaves.map(item => {
                    const matched = isMatched(item);
                    const result = getMatchResult(String(item.id));
                    return (
                        <Card
                            key={item.id}
                            onClick={() => handleItemSelect(item)}
                            className={cn(
                            'cursor-pointer transition-all border-4 w-40 sm:w-48',
                            selectedItem?.id === item.id && 'border-primary ring-4 ring-primary/50',
                            matched && !isSubmitted ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary/50',
                            isSubmitted && (result === 'correct' ? 'border-success' : 'border-destructive')
                            )}
                        >
                            <CardContent className="p-1 sm:p-2 relative">
                                <div className="relative aspect-square w-full">
                                    <Image src={item.url} alt={item.name} fill className="rounded-md object-cover" data-ai-hint={getImageHint(item.name)} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-center font-bold text-lg text-primary">Árboles</h3>
             <div className="flex flex-wrap justify-center gap-4">
                {shuffledTrees.map(item => {
                    const matched = isMatched(item);
                    return (
                        <Card
                            key={item.id}
                            onClick={() => handleItemSelect(item)}
                            className={cn(
                            'cursor-pointer transition-all border-4 border-transparent w-40 sm:w-48',
                            selectedItem?.id === item.id && 'border-primary ring-4 ring-primary/50',
                            matched && !isSubmitted ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary/50'
                            )}
                        >
                            <CardContent className="p-1 sm:p-2 relative">
                                <div className="relative aspect-square w-full">
                                    <Image src={item.url} alt={item.name} fill className="rounded-md object-cover" data-ai-hint={getImageHint(item.name)} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>

        {isSubmitted && (
             <Card>
                <CardContent className="space-y-2 pt-6">
                    {gamePairs.map(pair => {
                        const leafIdStr = String(pair.leafId);
                        const result = getMatchResult(leafIdStr);
                        const leaf = allImages.find(i => i.id === pair.leafId);
                        const yourMatch = allImages.find(i => String(i.id) === matches[leafIdStr]);
                        const correctMatch = allImages.find(i => i.id === pair.treeId);

                        if (!leaf) return null;

                        return (
                            <Alert key={pair.leafId} variant={result === 'correct' ? 'default' : 'destructive'} className={cn(result === 'correct' && 'bg-success/20 border-success')}>
                                {result === 'correct' ? <Icons.Check className="h-4 w-4" /> : <Icons.X className="h-4 w-4" />}
                                <AlertTitle>
                                    <FormattedText text={leaf.name} className="inline-block" />: {result === 'correct' ? '¡Correcto!' : 'Incorrecto'}
                                </AlertTitle>
                                {result === 'incorrect' && (
                                <AlertDescription>
                                    Relacionaste con <FormattedText text={yourMatch?.name || 'nada'} className="font-bold inline-block" />. La pareja correcta es <FormattedText text={correctMatch?.name || 'N/A'} className="font-bold inline-block" />.
                                </AlertDescription>
                                )}
                            </Alert>
                        )
                    })}
                </CardContent>
             </Card>
        )}

        <div className="text-center mt-6">
          {!isSubmitted ? (
            <Button size="lg" onClick={() => setIsSubmitted(true)} disabled={Object.keys(matches).length !== gamePairs.length}>
              Revisar Relaciones
            </Button>
          ) : (
            <Button size="lg" onClick={() => onComplete(finalScore, gamePairs.length)}>
              Ver Puntuación Final
            </Button>
          )}
        </div>
      </div>
    </GameWrapper>
  );
}
