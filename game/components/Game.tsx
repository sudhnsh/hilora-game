import React, { useState, useEffect, useReducer } from 'react';
import { motion } from 'framer-motion';
import { 
    GameState, 
    GameStatus,
    LetterState,
    getWordFeedback, 
    isValidWord,
    getTimeUntilNextWord,
    formatTimeRemaining,
    initializeGameState,
} from '../utils/gameUtils';
import Keyboard from './Keyboard';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import InfoButton from './InfoButton';
import { sendToDevvit } from '../utils';
import { useDevvitListener } from '../hooks/useDevvitListener';

interface GameProps {
    onHomeClick: () => void;
    onBackClick: () => void;
    onStatsClick: () => void;
}


const MAX_ATTEMPTS = 7;

function gameReducer(state: GameState, action: { type: string; payload: any }) {
    switch (action.type) {
      case "SET_GAME_STATE":
        return { ...state, ...action.payload };
      case "SET_FULL_GAME_STATUS":
        return { ...state, ...action.payload };
      case "SET_NEW_STATE":
        return {...action.payload};
      default:
        return state;
    }
  }

const Game: React.FC<GameProps> = ({ onHomeClick, onBackClick, onStatsClick }) => {
    const { theme  } = useTheme();
    const [gameState, dispatch] = useReducer(gameReducer, initializeGameState());
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
    const [isShaking, setIsShaking] = useState(false);
    useEffect(() => {sendToDevvit({ type: 'GET_GAME_STATS' })},[]);
    useEffect(() => {sendToDevvit({ type: 'GET_CURRENT_GAME_STATE' })},[]);
    // const gamekistate = useDevvitListener('GET_CURRENT_GAME_STATE_RESPONSE');
    // const currentDate = gamekistate?.currentDate as string;
    // const gameStatus = gamekistate?.gameStatus as string;
    // const guesses = gamekistate?.guesses as string;
    const gameStats = useDevvitListener('GET_GAME_STATS_RESPONSE');
    const totalAttempts = gameStats?.attempts as string;
    const totalSolved = gameStats?.wins as string;
    const played = gameStats?.played as string;
    // const [prevGameState, setPrevGameState] = useState<GameState>(initializeGameState());
    const gameData = useDevvitListener("GET_CURRENT_GAME_STATE_RESPONSE");
    const [isEasterEgg, setIsEasterEgg] = useState(false);
    const [redditTheme, setRedditTheme] = useState(false);

    useEffect(() => {
        if (currentGuess == 'REDDI'|| currentGuess == 'DEVVI' || currentGuess == 'devvi' || currentGuess == 'reddi')
        {
            setIsEasterEgg(true);
        }
        else{
            setIsEasterEgg(false);
        }
    }, [currentGuess]);

    useEffect(() => {
        if (gameData) {
            const feedbackArray: LetterState[][] = [];
          for( let i = 0; i < JSON.parse(gameData.guesses).length; i++){
            const feedback = getWordFeedback(JSON.parse(gameData.guesses)[i], gameState.targetWord);
            feedbackArray.push(feedback);
            sendToDevvit({type: 'CONSOLE_LOG', payload: { message: JSON.stringify(feedback) }});
        }
          dispatch({
            type: "SET_GAME_STATE",
            payload: {
              feedback: feedbackArray,
              guesses: JSON.parse(gameData.guesses) || [],
              gameStatus: gameData.gameStatus as GameStatus || "0done",
              currentDate: gameData.currentDate || new Date().toDateString(),
            },
          });
        }
      }, [gameData]);

      useEffect(() => {
        sendToDevvit({type: 'SET_CURRENT_GAME_STATE', payload: { gameStatus: gameState?.gameStatus || "0done", currentDate: gameState?.currentDate || new Date().toDateString() , guesses: JSON.stringify(gameState?.guesses) || '[]'} });
      }, [gameState]);

    // useEffect(() => {
    //     if(!gamekistate) return;
    //     if (currentDate == new Date().toDateString()) 
    //     {  
    //             setPrevGameState({
    //             ...prevGameState,
    //             gameStatus: gameStatus as GameStatus,
    //             currentDate: currentDate
    //         }
    //         );
    //         };
    //     if(gameStatus == 'won')
    //     {setMessage(`🎉 Brilliant! The word is "${gameState.targetWord.toUpperCase()}" ! See You Tommorrow`);}
    //     else if(gameStatus == 'lost')
    //     {setMessage(`💫 Close! You ran out of attempts, The word was "${gameState.targetWord.toUpperCase()}"`);}
    //     else
    //     setPrevGameState({
    //         ...prevGameState,
    //         gameStatus: '0done' as GameStatus,
    //         currentDate: new Date().toDateString()
    //     });
    //     setGameState(prevGameState);
    //     sendToDevvit({ type: 'SET_CURRENT_GAME_STATE' , payload: { gameStatus: gamekistate.gameStatus, currentDate: gamekistate.currentDate , guesses: JSON.stringify(gamekistate.guesses) } });
    // }, [gameState]);
    
    useEffect(() => {
    
    },[]);
      
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') return;
            if ((currentGuess == 'REDDI'|| currentGuess == 'DEVVI' || currentGuess == 'devvi' || currentGuess == 'reddi')&& (event.key == 'T' || event.key == 't'))
            {
            setMessage('Thanks you for playing this game! Redditor and Devvitors');
            setCurrentGuess(prev => prev + event.key.toUpperCase());
            setRedditTheme(true);
            setCurrentGuess('');
            }
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

    useEffect(() => {
        const updateTimer = () => {
            const timeLeft = getTimeUntilNextWord();
            setTimeRemaining(formatTimeRemaining(timeLeft));
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(timer);
    }, []);

    const handleKeyPress = (key: string) => {
        if ( (currentGuess == 'REDDI'|| currentGuess == 'DEVVI' || currentGuess == 'devvi' || currentGuess == 'reddi' ) && (key == 'T' || key == 't'))
        {
            setMessage('Thanks you for playing this game! Redditor and Devvitors');
            setCurrentGuess(prev => prev + key);
            setRedditTheme(true);
            setCurrentGuess('');
        }
        if (gameState.gameStatus != 'won' && gameState.gameStatus != 'lost' && currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
        }
    };

    const handleBackspace = () => {
        setCurrentGuess(prev => prev.slice(0, -1));
    };

    const submitGuess = () => {
        if (gameState.gameStatus == 'won' || gameState.gameStatus == 'lost') return;
        
        if (currentGuess.length !== 5) {
            setMessage('Word must be 5 letters long');
            return;
        }

        if (!isValidWord(currentGuess)) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            return;
        }

        const feedback = getWordFeedback(currentGuess, gameState.targetWord);
        const newState: GameState = {
            ...gameState,
            guesses: [...gameState.guesses, currentGuess],
            feedback: [...gameState.feedback, feedback]
        };

        // Update used letters
        const newUsedLetters = new Set(usedLetters);
        currentGuess.split('').forEach(letter => newUsedLetters.add(letter));
        setUsedLetters(newUsedLetters);
        switch (newState.guesses.length){
            case 0:
                newState.gameStatus = '0done';
                break;
            case 1:
                newState.gameStatus = '1done';
                break;
            case 2:
                newState.gameStatus = '2done';
                break;
            case 3:
                newState.gameStatus = '3done';
                break;
            case 4:
                newState.gameStatus = '4done';
                break;
            case 5:
                newState.gameStatus = '5done';
                break;
            case 6:
                newState.gameStatus = '6done';
                break;
        }

        if (currentGuess.toLowerCase() === gameState.targetWord.toLowerCase()) {
            newState.gameStatus = 'won';
            const newPlayed = Number(played) + 1;
            const newWins = Number(totalSolved) + 1;
            const newAttempts = Number(totalAttempts) + gameState.guesses.length;
            sendToDevvit({ type: 'SET_GAME_STATS' , payload: { played: newPlayed.toString(), wins: newWins.toString(), attempts: newAttempts.toString() } });
            setMessage('🎉 Brilliant! You found the word!');
        } else if (newState.guesses.length >= MAX_ATTEMPTS) {
            newState.gameStatus = 'lost';
            const newPlayed = Number(played) + 1;
            const newAttempts = Number(totalAttempts) + gameState.guesses.length;
            sendToDevvit({ type: 'SET_GAME_STATS' , payload: { played: newPlayed.toString(), wins: totalSolved, attempts: newAttempts.toString() } });
            setMessage(`💫 Close! The word was "${gameState.targetWord.toUpperCase()}"`);
            
        }
        dispatch({ type: "SET_NEW_STATE", payload: newState });
        setCurrentGuess('');
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
        }
        else if(redditTheme) {
            switch (state) {
                case 'correct':
                    return 'bg-orange-300 border-green-500 text-black'; // Reddit correct color
                case 'higher':
                    return 'bg-orange-300 border-red-500 text-black'; // Reddit higher color
                case 'lower':
                    return 'bg-orange-300 border-blue-500 text-black'; // Reddit lower color
                default:
                    return 'bg-orange-50 border-gray-300 text-black'; // Reddit default color
            }
        }
        else {
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

    const resetbutton = () => {
        const newState: GameState = initializeGameState();
        dispatch({ type: "SET_NEW_STATE", payload: newState });
        setCurrentGuess('');
        setMessage('');
    }

    return (
        <div
        className={`w-full h-full flex flex-col items-center justify-between p-2
            ${redditTheme
                ? 'bg-orange-600 text-white' // Apply Reddit theme styles
                : theme === 'dark'
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-white text-gray-900'}
            transition-colors duration-200
        `}
    >
        {(!gameData) ? (
            // Loading Screen
            <div className="flex items-center justify-center w-full h-full">
                <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 
                    ${redditTheme
                        ? 'border-light-orange-300'
                        : theme === 'dark'
                        ? 'border-gray-400' 
                        : 'border-gray-700'}`}>
                </div>
            </div>
        ) : (
            // Main Content
            <>
                <h1
                    className={`fixed top-3 left-0 w-full text-3xl font-thin mb-4 font-sans tracking-tight
                        ${redditTheme 
                            ? 'text-white' // Apply Reddit theme styles
                            : theme === 'dark' 
                            ? 'text-gray-100' 
                            : 'text-gray-900'}
                    `}
                >
                    HiLoRA
                </h1>
                <ThemeToggle />
                <button
                    onClick={onHomeClick}
                    className={`fixed top-2 left-10 p-2 transition-all duration-200
                        ${redditTheme
                            ? 'text-orange-300' // Apply Reddit theme accent color
                            : theme === 'dark'
                            ? 'text-emerald-300'
                            : 'text-emerald-600'}
                        hover:scale-110
                    `}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                </button>
                {/* <button
                    onClick={resetbutton}
                    className={`fixed top-2 left-30 p-2 transition-all duration-200
                        ${redditTheme
                            ? 'text-orange-300' // Apply Reddit theme accent color
                            : theme === 'dark'
                            ? 'text-emerald-300'
                            : 'text-emerald-600'}
                        hover:scale-110
                    `}
                >
                    resetbutton
                </button> */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {message && (
                        <div
                            className={`mt-4 mb-2 text-center font-medium text-sm px-4 py-2 rounded-lg animate-fadeIn
                                ${redditTheme
                                    ? 'bg-orange-400 text-white' // Apply Reddit theme message colors
                                    : theme === 'dark'
                                    ? 'bg-gray-800/50 text-gray-200' 
                                    : 'bg-gray-100/80 text-gray-700'}
                            `}
                        >
                            {message}
                        </div>
                    )}
                    <div className="grid gap-1 mb-2">
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`justify-center flex gap-1 ${rowIndex === gameState.guesses.length && isShaking ? 'shake' : ''}`}
                            >
                                { !isEasterEgg ? Array.from({ length: 5 }).map((_, colIndex) => {
                                    const letter = gameState.guesses[rowIndex]?.[colIndex] || '';
                                    const state = gameState.feedback[rowIndex]?.[colIndex];
                                    const isCurrentRow = rowIndex === gameState.guesses.length;
    
                                    return (
                                        <div
                                            key={colIndex}
                                            className={`flex items-center justify-center font-bold border-2 rounded
                                                transition-all duration-200 backdrop-blur-sm
                                                ${isCurrentRow ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-sm'}
                                                ${state 
                                                    ? getLetterColor(state) 
                                                    : redditTheme 
                                                    ? 'bg-orange-300 border-orange-600 text-white'
                                                    : theme === 'dark' 
                                                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900'}
                                                ${isCurrentRow && !state 
                                                    ? redditTheme 
                                                        ? 'border-orange-500' 
                                                        : theme === 'dark' 
                                                        ? 'border-gray-500' 
                                                        : 'border-gray-400'
                                                    : ''}
                                                shadow-lg
                                            `}
                                        >
                                            {isCurrentRow && colIndex < currentGuess.length ? currentGuess[colIndex] : letter}
                                        </div>
                                    );
                                }) : Array.from({ length: 6 }).map((_, colIndex) => {
                                    const letter = gameState.guesses[rowIndex]?.[colIndex] || '';
                                    const state = gameState.feedback[rowIndex]?.[colIndex];
                                    const isCurrentRow = rowIndex === gameState.guesses.length;
    
                                    return (
                                        <div
                                            key={colIndex}
                                            className={`flex items-center justify-center font-bold border-2 rounded
                                                transition-all duration-200 backdrop-blur-sm
                                                ${isCurrentRow ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-sm'}
                                                ${state 
                                                    ? getLetterColor(state) 
                                                    : redditTheme 
                                                    ? 'bg-orange-300 border-orange-600 text-white'
                                                    : theme === 'dark' 
                                                    ? 'bg-gray-800 text-gray-100 border-gray-700' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900'}
                                                ${isCurrentRow && !state 
                                                    ? redditTheme 
                                                        ? 'border-orange-500' 
                                                        : theme === 'dark' 
                                                        ? 'border-gray-500' 
                                                        : 'border-gray-400'
                                                    : ''}
                                                shadow-lg
                                            `}
                                        >
                                            {isCurrentRow && colIndex < currentGuess.length ? currentGuess[colIndex] : letter}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
                        <div
                            className={`text-sm font-medium ${redditTheme ? 'text-orange-200' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                            Next word in: {timeRemaining}
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-center">
                    <Keyboard
                        onKeyPress={handleKeyPress}
                        onEnter={submitGuess}
                        onBackspace={handleBackspace}
                    />
                </div>
                <InfoButton />
                <motion.button
                    onClick={onBackClick}
                    className="absolute top-2 left-2 p-2 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${redditTheme ? 'text-orange-300' : theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                </motion.button>
                <motion.button
                    onClick={onStatsClick}
                    className="absolute top-2 right-20 p-2 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${redditTheme ? 'text-orange-200' : theme === 'dark' ? 'text-sky-300' : 'text-sky-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                        />
                    </svg>
                </motion.button>
            </>
        )}
    </div>
    
    

    // <div
    //     className={`
    //             w-full h-full flex flex-col items-center justify-between p-2
    //             ${theme === 'dark' 
    //                 ? 'bg-gray-900 text-gray-100' 
    //                 : 'bg-white text-gray-900'}
    //             transition-colors duration-200
    //         `}
    // >
    //     {(!gameData) ? (
    //         // Loading Screen
    //         <div className="flex items-center justify-center w-full h-full">
    //             <div className={`animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 
    //                 ${theme === 'dark' ? 'border-gray-400' : 'border-gray-700'}`}>
    //             </div>
    //         </div>
    //     ) : (
    //         // Main Content
    //         <>
    //             <h1
    //                 className={`fixed top-3 left-0 w-full text-3xl font-thin mb-4 font-sans tracking-tight ${
    //                     theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
    //                 }`}
    //             >
    //                 HiLoRA
    //             </h1>
    //             <ThemeToggle />
    //             <button
    //                 onClick={onHomeClick}
    //                 className={`
    //                     fixed top-2 left-10
    //                     p-2
    //                     transition-all duration-200
    //                     ${theme === 'dark' 
    //                         ? 'text-emerald-300' 
    //                         : 'text-emerald-600'}
    //                     hover:scale-110
    //                 `}
    //             >
    //                 <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className="h-5 w-5"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                 >
    //                     <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={1.5}
    //                         d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    //                     />
    //                 </svg>
    //             </button>
    //             <button
    //                 onClick={resetbutton}
    //                 className={`
    //                     fixed top-2 left-30
    //                     p-2
    //                     transition-all duration-200
    //                     ${theme === 'dark' 
    //                         ? 'text-emerald-300' 
    //                         : 'text-emerald-600'}
    //                     hover:scale-110
    //                 `}
    //             >
    //                 resetbutton
    //             </button>
    //             <div className="flex-1 flex flex-col items-center justify-center">
    //                 {message && (
    //                     <div
    //                         className={`
    //                             mt-4 mb-2 
    //                             text-center font-medium text-sm 
    //                             px-4 py-2 rounded-lg
    //                             animate-fadeIn
    //                             ${theme === 'dark' 
    //                                 ? 'bg-gray-800/50 text-gray-200' 
    //                                 : 'bg-gray-100/80 text-gray-700'}
    //                         `}
    //                     >
    //                         {message}
    //                     </div>
    //                 )}
    //                 <div className="grid gap-1 mb-2">
    //                     {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => (
    //                         <div
    //                             key={rowIndex}
    //                             className={`justify-center flex gap-1 ${
    //                                 rowIndex === gameState.guesses.length && isShaking
    //                                     ? 'shake'
    //                                     : ''
    //                             }`}
    //                         >  
    //                             { !isEasterEgg ?Array.from({ length: 5 }).map((_, colIndex) => {
    //                                 const letter =
    //                                     gameState.guesses[rowIndex]?.[colIndex] || '';
    //                                 const state =
    //                                     gameState.feedback[rowIndex]?.[colIndex];
    //                                 const isCurrentRow =
    //                                     rowIndex === gameState.guesses.length;

    //                                 return (
    //                                     <div
    //                                         key={colIndex}
    //                                         className={`
    //                                             flex items-center justify-center
    //                                             font-bold border-2 rounded
    //                                             transition-all duration-200 backdrop-blur-sm
    //                                             ${
    //                                                 isCurrentRow
    //                                                     ? 'w-10 h-10 text-xl'
    //                                                     : 'w-8 h-8 text-sm'
    //                                             }
    //                                             ${
    //                                                 state
    //                                                     ? getLetterColor(state)
    //                                                     : theme === 'dark'
    //                                                     ? 'bg-gray-800 text-gray-100 border-gray-700'
    //                                                     : 'bg-gray-50 border-gray-300 text-gray-900'
    //                                             }
    //                                             ${
    //                                                 isCurrentRow && !state
    //                                                     ? theme === 'dark'
    //                                                         ? 'border-gray-500'
    //                                                         : 'border-gray-400'
    //                                                     : ''
    //                                             }
    //                                             shadow-lg
    //                                         `}
    //                                     >
    //                                         {isCurrentRow &&
    //                                         colIndex < currentGuess.length
    //                                             ? currentGuess[colIndex]
    //                                             : letter}
    //                                     </div>
    //                                 );
    //                             }): Array.from({ length: 6 }).map((_, colIndex) => {
    //                                 const letter =
    //                                     gameState.guesses[rowIndex]?.[colIndex] || '';
    //                                 const state =
    //                                     gameState.feedback[rowIndex]?.[colIndex];
    //                                 const isCurrentRow =
    //                                     rowIndex === gameState.guesses.length;

    //                                 return (
    //                                     <div
    //                                         key={colIndex}
    //                                         className={`
    //                                             flex items-center justify-center
    //                                             font-bold border-2 rounded
    //                                             transition-all duration-200 backdrop-blur-sm
    //                                             ${
    //                                                 isCurrentRow
    //                                                     ? 'w-10 h-10 text-xl'
    //                                                     : 'w-8 h-8 text-sm'
    //                                             }
    //                                             ${
    //                                                 state
    //                                                     ? getLetterColor(state)
    //                                                     : theme === 'dark'
    //                                                     ? 'bg-gray-800 text-gray-100 border-gray-700'
    //                                                     : 'bg-gray-50 border-gray-300 text-gray-900'
    //                                             }
    //                                             ${
    //                                                 isCurrentRow && !state
    //                                                     ? theme === 'dark'
    //                                                         ? 'border-gray-500'
    //                                                         : 'border-gray-400'
    //                                                     : ''
    //                                             }
    //                                             shadow-lg
    //                                         `}
    //                                     >
    //                                         {isCurrentRow &&
    //                                         colIndex < currentGuess.length
    //                                             ? currentGuess[colIndex]
    //                                             : letter}
    //                                     </div>
    //                                 );
    //                             })}
    //                         </div>
    //                     ))}
    //                 </div>
    //                 {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
    //                     <div
    //                         className={`text-sm font-medium ${
    //                             theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    //                         }`}
    //                     >
    //                         Next word in: {timeRemaining}
    //                     </div>
    //                 )}
    //             </div>
    //             <div className="w-full flex justify-center">
    //                 <Keyboard
    //                     onKeyPress={handleKeyPress}
    //                     onEnter={submitGuess}
    //                     onBackspace={handleBackspace}
    //                 />
    //             </div>
    //             <InfoButton />
    //             <motion.button
    //                 onClick={onBackClick}
    //                 className="absolute top-2 left-2 p-2 transition-all duration-200"
    //                 whileHover={{ scale: 1.1 }}
    //                 whileTap={{ scale: 0.95 }}
    //             >
    //                 <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     className={`h-5 w-5 ${
    //                         theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
    //                     }`}
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     stroke="currentColor"
    //                 >
    //                     <path
    //                         strokeLinecap="round"
    //                         strokeLinejoin="round"
    //                         strokeWidth={1.5}
    //                         d="M10 19l-7-7m0 0l7-7m-7 7h18"
    //                     />
    //                 </svg>
    //             </motion.button>
    //             <motion.button
    //                 onClick={onStatsClick}
    //                 className="absolute top-2 right-20 p-2 transition-all duration-200"
    //                 whileHover={{ scale: 1.1 }}
    //                 whileTap={{ scale: 0.95 }}
    //             >
    //                 <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className={`h-5 w-5 ${
    //                 theme === 'dark' ? 'text-sky-300' : 'text-sky-600'
    //                 }`}
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //                 strokeWidth={1.5}
    //                 >
    //                 <path 
    //                 strokeLinecap="round" 
    //                 strokeLinejoin="round" 
    //                 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
    //             />
    //             </svg>
    //             </motion.button>
    //         </>
    //     )}
    // </div>
);

};

export default Game;
