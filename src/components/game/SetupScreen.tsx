'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SetupScreenProps {
  onStartGame: () => void;
  onEnterEditMode: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SetupScreen({ onStartGame, onEnterEditMode }: SetupScreenProps) {
  const handleStart = () => {
    onStartGame();
  };

  const handleEdit = () => {
    onEnterEditMode();
  };

  return (
    <motion.div
      className="bg-card/80 p-8 rounded-lg shadow-xl text-center max-w-md w-full backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold text-primary font-headline"
      >
        Bienvenido a Flora Master
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-muted-foreground mt-2 mb-6"
      >
        ¡Prueba tu conocimiento botánico!
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={handleStart}
          className="w-full max-w-xs text-lg font-bold"
        >
          Comenzar Juego
        </Button>
      
        <Button
          size="lg"
          variant="secondary"
          onClick={handleEdit}
          className="w-full max-w-xs text-lg font-bold"
        >
          Modo Edición
        </Button>
      </motion.div>
    </motion.div>
  );
}
