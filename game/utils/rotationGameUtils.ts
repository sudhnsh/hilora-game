import { wordList } from './words';

// Type definitions
export type LetterState = 'correct' | 'higher' | 'lower' | 'unused';
export type RotationGameStatus = 'playing' | 'won' | 'lost';

export interface RotationGameState {
    guesses: string[];
    feedback: LetterState[][];
    gameStatus: RotationGameStatus;
    targetWord: string;
    currentDate: string;
}

// Get today's word based on the date
export const getWordOfDay = (): string => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    return randomWord;
};

// Compare letters and provide feedback
export const getLetterFeedback = (guessLetter: string, targetLetter: string): LetterState => {
    if (guessLetter.toLowerCase() === targetLetter.toLowerCase()) return 'correct';
    return guessLetter.toLowerCase()  < targetLetter.toLowerCase() ? 'lower' : 'higher';
};

// Get feedback for entire word
export const getWordFeedback = (guess: string, target: string): LetterState[] => {
    var boolcheck = true;
    var lastfeedback = 'unused'
    return guess.split('').map((letter, index): LetterState => {
        if (!boolcheck) {
            return lastfeedback as LetterState; // Return last feedback if boolcheck is false
        }
    
        const feedback = getLetterFeedback(letter, target[index]) as LetterState;
    
        if (feedback !== 'correct') {
            boolcheck = false;
            lastfeedback = feedback;
        }
    
        return feedback;
    });
};

// Check if the word is valid
export const isValidWord = (word: string): boolean => {
    return wordList.includes(word.toLowerCase());
};

export const rotateWord = (word: string): string => {
    let result = '';
    for (let i = 0; i < word.length; i++) {
        let char = word[i];

        // Check if the character is a lowercase letter
        if (char >= 'a' && char <= 'z') {
            result += String.fromCharCode((char.charCodeAt(0) - 97 + 1) % 26 + 97);
        }
        // Check if the character is an uppercase letter
        else if (char >= 'A' && char <= 'Z') {
            result += String.fromCharCode((char.charCodeAt(0) - 65 + 1) % 26 + 65);
        }
        else {
            result += char;  // Non-alphabet characters remain unchanged
        }
    }
    return result;
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
export const initializeRotationGameState = (): RotationGameState => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const today = new Date().toDateString();
        
        // If it's a new day, reset the game
        if (state.currentDate !== today) {
            return createNewRotationGameState();
        }
        return state;
    }
    return createNewRotationGameState();
};

// Create a new game state
export const createNewRotationGameState = (): RotationGameState => {
    return {
        guesses: [],
        feedback: [],
        gameStatus: 'playing',
        targetWord: getWordOfDay(),
        currentDate: new Date().toDateString()
    };
};
