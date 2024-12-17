import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    RotationGameState, 
    LetterState,
    initializeRotationGameState, 
    getWordFeedback, 
    rotateWord
} from '../utils/rotationGameUtils';
import Keyboard from './Keyboard';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import RotationInfoButton from './RotationInfobutton';

interface RotationGameProps {
    onHomeClick: () => void;
    onBackClick: () => void;
    onPlayAgainClick: () => void;
}

const MAX_ATTEMPTS = 7;

const RotationGame: React.FC<RotationGameProps> = ({ onHomeClick, onBackClick, onPlayAgainClick }) => {
    const { theme } = useTheme();
    const [gameState, setRotationGameState] = useState<RotationGameState>(initializeRotationGameState());
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [attempts, setAttempts] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameState.gameStatus !== 'playing') return;
            
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default Enter behavior
                submitGuess();
            } else if (event.key === 'Backspace') {
                setCurrentGuess(prev => prev.slice(0, -1));
            } else if (event.key.match(/^[a-zA-Z]$/) && currentGuess.length < 5) {
                const letter = event.key.toUpperCase();
                setCurrentGuess(prev => (prev + letter));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, gameState]);


    const handleKeyPress = (key: string) => {
        if (gameState.gameStatus === 'playing' && currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
        }
    };

    const handleBackspace = () => {
        setCurrentGuess(prev => prev.slice(0, -1));
    };

    const submitGuess = () => {
        if (currentGuess.length !== 5) {
            setMessage('Word must be 5 letters long');
            return;
        }

        const feedback = getWordFeedback(currentGuess, gameState.targetWord);
        const newWord = rotateWord(gameState.targetWord);
        const newState: RotationGameState = {
            ...gameState,
            targetWord: newWord,
            guesses: [...gameState.guesses, currentGuess],
            feedback: [...gameState.feedback, feedback]
        };

        
        // Update used letters
        const newUsedLetters = new Set(usedLetters);
        currentGuess.split('').forEach(letter => newUsedLetters.add(letter));
        setUsedLetters(newUsedLetters);

        if (currentGuess.toLowerCase() === gameState.targetWord.toLowerCase()) {
            newState.gameStatus = 'won';
            setMessage('🎉 Brilliant! You found the word in '+(attempts+newState.guesses.length)+' attempt(s)');
        } else if (newState.guesses.length == MAX_ATTEMPTS) {
            setAttempts(prev => prev + 1);
            newState.guesses.shift();
            newState.feedback.shift();
        }
        setRotationGameState(newState);
        setCurrentGuess('');
    };

    const resetGame = () => {
        setRotationGameState(initializeRotationGameState());
        setCurrentGuess('');
        setAttempts(0);
        setMessage('');
        setIsShaking(false);
        return onPlayAgainClick();
    };

    const getLetterColor = (state: LetterState): string => {
        if (theme === 'dark') {
            switch (state) {
                case 'correct':
                    return 'bg-green-800 border-green-700 text-green-200';
                case 'higher':
                    return 'bg-red-900 border-red-800 text-red-200';
                case 'lower':
                    return 'bg-blue-900 border-blue-800 text-blue-200';
                default:
                    return 'bg-gray-800 border-gray-700 text-white';
            }
        } else {
            switch (state) {
                case 'correct':
                    return 'bg-green-300 border-green-300 text-green-900';
                case 'higher':
                    return 'bg-red-300 border-red-300 text-red-900';
                case 'lower':
                    return 'bg-blue-300 border-blue-300 text-blue-900';
                default:
                    return 'bg-white border-gray-300 text-gray-900';
            }
        }
    };

    return (
        <div className={`
            w-full h-full flex flex-col items-center justify-between p-2
            ${theme === 'dark' 
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-white text-gray-900'}
            transition-colors duration-200
        `}>
           
            <h1 className={`fixed top-3 left-0 w-full text-3xl font-thin mb-4 font-sans tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                HiLoRA
            </h1>
            <ThemeToggle />
            
            <button
                onClick={onHomeClick}
                className={`
                    fixed top-2 left-10
                    p-2
                    transition-all duration-200
                    ${theme === 'dark' 
                        ? 'text-emerald-300' 
                        : 'text-emerald-600'}
                    hover:scale-110
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center">
                
                {message && (
                    <div className={`
                        mt-4 mb-2 
                        text-center font-medium text-sm 
                        px-4 py-2 rounded-lg
                        animate-fadeIn
                        ${theme === 'dark' 
                            ? 'bg-gray-800/50 text-gray-200' 
                            : 'bg-gray-100/80 text-gray-700'
                        }
                    `}>
                        {message}
                    </div>
                )}

                <div className="grid gap-1 mb-2">
                    {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
                        <div key={rowIndex} className={`justify-center flex gap-1 ${rowIndex === gameState.guesses.length && isShaking ? 'shake' : ''}`}>
                            {Array.from({ length: 5 }).map((_, colIndex) => {
                                const letter = gameState.guesses[rowIndex]?.[colIndex] || '';
                                const state = gameState.feedback[rowIndex]?.[colIndex];
                                const isCurrentRow = rowIndex === gameState.guesses.length;
                                
                                return (
                                    <div 
                                        key={colIndex}
                                        className={`
                                            flex items-center justify-center
                                            font-bold border-2 rounded
                                            transition-all duration-200 backdrop-blur-sm
                                            ${isCurrentRow ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-sm'}
                                            ${state ? getLetterColor(state) : theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-gray-50 border-gray-300 text-gray-900'}
                                            ${isCurrentRow && !state ? theme === 'dark' ? 'border-gray-500' : 'border-gray-400' : ''}
                                            shadow-lg
                                        `}
                                    >
                                        {isCurrentRow && colIndex < currentGuess.length
                                            ? currentGuess[colIndex]
                                            : letter}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-center">
                <Keyboard
                    onKeyPress={handleKeyPress}
                    onEnter={submitGuess}
                    onBackspace={handleBackspace}
                />
            </div>
            <RotationInfoButton />
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
            <motion.button
                onClick={resetGame}
                className={`
                    fixed top-1 left-16
                    p-2
                    transition-all duration-200
                    ${theme === 'dark' 
                        ? 'text-sky-300' 
                        : 'text-sky-600'}
                    hover:scale-110
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15v-.006" />
                </svg>
                </motion.button>
        </div>
    );
};

export default RotationGame;
