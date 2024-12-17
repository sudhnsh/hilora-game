import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface InstructionsProps {
    onBackClick: () => void;
}

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

const Instructions: React.FC<InstructionsProps> = ({ onBackClick }) => {
    const { theme } = useTheme();
    const [currentTab, setCurrentTab] = useState<'classic' | 'journey' | 'rotation'>('classic');

    const renderClassicInstructions = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                max-w-md w-11/12
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                shadow-lg
            `}
        >
            <div className="space-y-6">
                <div>
                    <p className={`text-md ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    7 attempts to guess the correct 5-letter word, with feedback on all letters in each guess.</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🟢 Green: Letter is correct
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="S" color="green" />
                            <ExampleTile letter="P" color="default" />
                            <ExampleTile letter="A" color="default" />
                            <ExampleTile letter="R" color="default" />
                            <ExampleTile letter="E" color="default" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: SMART
                        </p>
                    </div>

                    <div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🔵 Blue: Letter should be higher in alphabet
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="N" color="default" />
                            <ExampleTile letter="O" color="default" />
                            <ExampleTile letter="I" color="default" />
                            <ExampleTile letter="S" color="default" />
                            <ExampleTile letter="E" color="blue" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: PAINT (E → T)
                        </p>
                    </div>

                    <div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🔴 Red: Letter should be lower in alphabet
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="C" color="default" />
                            <ExampleTile letter="R" color="default" />
                            <ExampleTile letter="A" color="default" />
                            <ExampleTile letter="N" color="red" />
                            <ExampleTile letter="E" color="default" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: BRAIN (N → I)
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderRotationInstructions = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                max-w-md w-11/12
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                shadow-lg
            `}
        >
            <div className="space-y-6">
                <div>
                    <p className={`text-md ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Unlimited attempts to guess the correct 5-letter word, after each guess, the letters will rotate to the next position(Caesar Cipher). Words not need to be valid English words.</p>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            🟢 Green: Letter is correct
                            🔴 Red: Letter should be lower in alphabet
                            🔵 Blue: Letter should be higher in alphabet
                        </p>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="S" color="green" />
                            <ExampleTile letter="P" color="red" />
                            <ExampleTile letter="A" color="green" />
                            <ExampleTile letter="R" color="green" />
                            <ExampleTile letter="E" color="blue" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: SMART 
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-center gap-1">
                            <ExampleTile letter="T" color="green" />
                            <ExampleTile letter="N" color="green" />
                            <ExampleTile letter="B" color="green" />
                            <ExampleTile letter="S" color="green" />
                            <ExampleTile letter="U" color="green" />
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Target word: SMART but rotated ( S-&gt; T, M-&gt; N, A-&gt; B, R-&gt; S, T-&gt; U)
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderJourneyInstructions = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
                max-w-md w-11/12
                p-2 rounded-lg
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                shadow-lg
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
            </div>
        </motion.div>
    );

    return (
        <div className={`
            min-h-screen w-full
            flex flex-col items-center
            ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
        `}>
            <ThemeToggle />

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    text-3xl font-thin mt-2 mb-2
                    tracking-wider
                    ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}
                `}
            >
                How to Play
            </motion.h1>
            <div className="items-center center-align w-full max-w-md overflow-x-auto">
      <div className={`
        flex flex-row space-x-2 items-center center-align
        ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/50'}
        p-1 rounded-lg
      `}>
        <button
          onClick={() => setCurrentTab('classic')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-md font-medium text-sm transition-all
            ${currentTab === 'classic' 
              ? theme === 'dark' 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-gray-300 text-gray-800' 
              : theme === 'dark' 
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          Classic Mode
        </button>
        <button
          onClick={() => setCurrentTab('journey')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-md font-medium text-sm transition-all
            ${currentTab === 'journey' 
              ? theme === 'dark' 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-gray-300 text-gray-800' 
              : theme === 'dark' 
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          Journey Mode
        </button>
        <button
          onClick={() => setCurrentTab('rotation')}
          className={`
            flex-shrink-0 px-4 py-2 rounded-md font-medium text-sm transition-all
            ${currentTab === 'rotation' 
              ? theme === 'dark' 
                ? 'bg-gray-700 text-gray-200' 
                : 'bg-gray-300 text-gray-800' 
              : theme === 'dark' 
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          Rotation Mode
        </button>
      </div>
    </div>
            {currentTab === 'classic' && renderClassicInstructions()}
            {currentTab === 'journey' && renderJourneyInstructions()}
            {currentTab === 'rotation' && renderRotationInstructions()}

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

export default Instructions;

