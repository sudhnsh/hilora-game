import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface GameModeProps {
    onClassicClick: () => void;
    onJourneyClick: () => void;
    onBackClick: () => void;
    onRotationClick: () => void;
}

const GameMode: React.FC<GameModeProps> = ({ onClassicClick, onJourneyClick, onBackClick, onRotationClick }) => {
    const { theme } = useTheme();

    const buttonClass = `
        w-64 py-4 px-8 rounded-lg
        font-medium text-lg
        transition-all duration-200
        ${theme != 'dark' ? 'bg-gray-900 hover:bg-gray-700 text-gray-100' : 'bg-gray-100 hover:bg-gray-300 text-gray-900'}
    `;

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
            <ThemeToggle />
            <h1 className={`text-4xl font-thin mb-8 font-sans tracking-tight`}>
                Select Game Mode
            </h1>

            <motion.button
                onClick={onClassicClick}
                className={buttonClass}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Classic Mode</span>
                </div>
            </motion.button>

            <motion.button
                onClick={onJourneyClick}
                className={buttonClass}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span>Journey Mode</span>
                </div>
            </motion.button>

            <motion.button
                onClick={onRotationClick}
                className={buttonClass}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L12 5M12 5l3-3m-3 3L9 5M9 5l3 3m-3-3a9 9 0 10 0 18 9 9 0 000-18z" />
                </svg>
                    <span>Rotation Mode</span>
                </div>
            </motion.button>

            <motion.button
                onClick={onBackClick}
                className="absolute top-2 left-2 p-2 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </motion.button>
        </div>
    );
};

export default GameMode;
