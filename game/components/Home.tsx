import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface HomeProps {
    onPlayClick: () => void;
    onInstructionsClick: () => void;

}

const Home: React.FC<HomeProps> = ({ onPlayClick, onInstructionsClick}) => {
    const { theme } = useTheme();

    const buttonClasses = `
        w-48 px-6 py-4 
        rounded-lg shadow-md 
        font-medium text-lg tracking-wide
        transform transition-all duration-200
        ${theme === 'dark' 
            ? 'bg-white text-gray-900 hover:bg-gray-100' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }
    `;

    return (
        <div className={`
            min-h-screen w-full
            flex flex-col items-center justify-center
            ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}
        `}>
            <ThemeToggle />
            
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    text-6xl font-thin mb-16
                    tracking-wider
                    ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}
                `}
            >
                HiLoRA
            </motion.h1>

            <div className="flex flex-col space-y-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={onPlayClick}
                    className={buttonClasses}
                >
                    Play
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={onInstructionsClick}
                    className={buttonClasses}
                >
                    Instructions
                </motion.button>
            </div>
        </div>
    );
};

export default Home;
