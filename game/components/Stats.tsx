import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useDevvitListener } from '../hooks/useDevvitListener';
import { sendToDevvit } from '../utils';
import { useEffect } from 'react';
// Importing the statics data

interface StaticsProps {
    onBackClick: () => void;
}

const Statics: React.FC<StaticsProps> = ({ onBackClick }) => {
    const { theme } = useTheme();
    const totalAttempts = useDevvitListener('GET_GAME_STATS_RESPONSE')?.attempts as string;
    const totalSolved = useDevvitListener('GET_GAME_STATS_RESPONSE')?.wins as string;
    const played = useDevvitListener('GET_GAME_STATS_RESPONSE')?.played as string;
    const averageAttempts = (Number(totalAttempts) / Number(totalSolved)) == Infinity ? 0 : (Number(totalAttempts) / Number(totalSolved)).toFixed(2);
    const winPercentage =  Number(played) > 0 ? ((Number(totalSolved) / Number(played)) * 100).toFixed(2) + '%' : '0%';

    useEffect(() => {sendToDevvit({ type: 'GET_GAME_STATS' })},[]);

    return (
        <div className={` h-full justify-between p-2 w-full flex flex-col items-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {(!totalAttempts || !totalSolved || !played) ? (
                // Loading screen
                <div className="flex items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 
                    ${theme === 'dark' ? 'border-gray-400' : 'border-gray-700'}">
                </div>
            </div>
            ) : (
                // Stats content
                <>
                    <ThemeToggle />

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`justify-center center-align text-3xl font-thin mt-2 mb-2 tracking-wider ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                    >
                        Statics
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`max-w-2xl w-11/12 p-6 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } shadow-lg`}
                    >
                        <div
                            className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}
                        >
                            <div className="flex justify-between py-2">
                                <span>Average Attempts:</span>
                                <span>{averageAttempts}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Played:</span>
                                <span>{played}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Wins:</span>
                                <span>{totalSolved}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Win Percentage:</span>
                                <span>{winPercentage}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBackClick}
                        className={`mt-4 px-6 py-2 rounded-lg shadow-md font-medium text-sm transform transition-all duration-200 ${
                            theme === 'dark'
                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                    >
                        Back
                    </motion.button>
                </>
            )}
        </div>
    );
};
export default Statics;
