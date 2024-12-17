import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ExampleTile: React.FC<{ letter: string; color: 'green' | 'blue' | 'red' | 'default' }> = ({ letter, color }) => {
    const { theme } = useTheme();
    
    const getColorClasses = () => {
        switch (color) {
            case 'green':
                return 'bg-green-500 text-white';
            case 'blue':
                return 'bg-blue-500 text-white';
            case 'red':
                return 'bg-red-500 text-white';
            default:
                return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className={`
            w-6 h-6
            flex items-center justify-center
            font-bold text-base
            rounded-md
            ${getColorClasses()}
        `}>
            {letter}
        </div>
    );
};

const JourneyInfoButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    fixed top-2 right-11
                    p-2
                    transition-all duration-200
                    ${theme === 'dark' 
                        ? 'text-sky-300' 
                        : 'text-sky-600'}
                    hover:scale-110
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        />
                       <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className={`
                                fixed left-1/8 top-4 -translate-x-1/2 -translate-y-1/2
                                w-11/12 max-w-md
                                p-3 rounded-lg shadow-xl
                                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                                z-50
                            `}
                        >
            <div className="space-y-6">
                <div>
                    <p className={`text-md ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Unlimited guesses to find the correct 5-letter word, with step-by-step feedback on one letter at a time.</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🟢 Green: Letter is correct and locked in.
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="S" color="green" />
                            <ExampleTile letter="P" color="blue" />
                            <ExampleTile letter="A" color="blue" />
                            <ExampleTile letter="R" color="blue" />
                            <ExampleTile letter="E" color="blue" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: SMART
                        </p>
                    </div>

                    <div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🔵 Blue: Word is lower than the target.
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="N" color="blue" />
                            <ExampleTile letter="O" color="blue" />
                            <ExampleTile letter="I" color="blue" />
                            <ExampleTile letter="S" color="blue" />
                            <ExampleTile letter="E" color="blue" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: PAINT (N → P)
                        </p>
                    </div>

                    <div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                                🔴 Red: Word is higher than the target.
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="C" color="green" />
                            <ExampleTile letter="R" color="red" />
                            <ExampleTile letter="A" color="red" />
                            <ExampleTile letter="N" color="red" />
                            <ExampleTile letter="E" color="red" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: CHAIR (R → H)
                        </p>
                    </div>
                    </div>
                    <button
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        mt-2 px-4 py-2
                                        rounded-lg
                                        font-medium
                                        ${theme === 'dark' 
                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }
                                        transition-colors
                                    `}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default JourneyInfoButton;
