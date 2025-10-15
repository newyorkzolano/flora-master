'use client';

import { useState, useEffect } from 'react';
import type { GameData } from '@/lib/types';
import { localGameData } from '@/lib/game-data';

const useGameData = () => {
    const [gameData, setGameData] = useState<GameData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            // Simulate async loading
            setTimeout(() => {
                 // The data now includes images from the JSON file.
                setGameData(localGameData);
                setIsLoaded(true);
            }, 500);
        } catch (e: any) {
            setError(e.message || 'Failed to load game data');
            setIsLoaded(true);
        }
    }, []);
    
    return {
      gameData, 
      isLoaded,
      error,
      setGameData,
    };
};

export default useGameData;
