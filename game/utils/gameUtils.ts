import { wordList } from './words';
import { useEffect } from 'react';
import { sendToDevvit } from '../utils';
import { useDevvitListener } from '../hooks/useDevvitListener';
import { send } from 'process';
// Type definitions
export type LetterState = 'correct' | 'higher' | 'lower' | 'unused';
export type GameStatus = '0done' | 'won' | 'lost' | '1done' | '2done' | '3done' | '4done' | '5done' | '6done' ;

export interface GameState {
    guesses: string[];
    feedback: LetterState[][];
    gameStatus: GameStatus;
    targetWord: string;
    currentDate: string;
}

// Get today's word based on the date
export const getWordOfDay = (): string => {
    const epoch = new Date('2024-01-01').getTime();
    const today = new Date().getTime();
    const daysSinceEpoch = Math.floor((today-epoch)/(24*60*60*1000));
    return wordList[daysSinceEpoch % wordList.length];
};

// Compare letters and provide feedback
export const getLetterFeedback = (guessLetter: string, targetLetter: string): LetterState => {
    if (guessLetter.toUpperCase() === targetLetter.toUpperCase()) return 'correct';
    return guessLetter.toUpperCase()  < targetLetter.toUpperCase() ? 'lower' : 'higher';
};

// Get feedback for entire word
export const getWordFeedback = (guess: string, target: string): LetterState[] => {
    return guess.split('').map((letter, index) => 
        getLetterFeedback(letter, target[index])
    );
};

// Check if the word is valid
export const isValidWord = (word: string): boolean => {
    return wordList.includes(word.toLowerCase());
};

// Get time until next word
export const getTimeUntilNextWord = (): number => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
};

// Format milliseconds to HH:MM:SS
export const formatTimeRemaining = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};



// Initialize or load game state
export const initializeGameState =  (): GameState => {
    return  createNewGameState();
};

// Create a new game state
export const createNewGameState = (): GameState => {
    return {
        guesses: [],
        feedback: [],
        gameStatus: '0done',
        targetWord: getWordOfDay(),
        currentDate: new Date().toDateString()
    };
};

// //Save game state from redis
// export const saveGameState = (state: GameState): void => {
    
// };
