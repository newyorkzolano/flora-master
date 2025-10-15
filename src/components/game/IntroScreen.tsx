'use client';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import flowerAnimationData from '../../../public/animations/Growing Tree.json';

interface IntroScreenProps {
    onAnimationComplete: () => void;
}

export function IntroScreen({ onAnimationComplete }: IntroScreenProps) {
    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <Lottie
                animationData={flowerAnimationData}
                loop={false}
                onComplete={onAnimationComplete}
                style={{ width: 250, height: 250 }}
            />
            <motion.div
                className="text-center text-sm text-white/70"
                animate={{
                opacity: [0, 1, 1, 0],
                }}
                transition={{
                duration: 3,
                times: [0, 0.25, 0.75, 1],
                }}
            >
                <p>by Almudena Lerin</p>
            </motion.div>
        </motion.div>
    );
}
