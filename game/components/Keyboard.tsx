import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
    onEnter: () => void;
    onBackspace: () => void;
    disabledKeys?: Set<string>;
}

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onEnter, onBackspace, disabledKeys = new Set() }) => {
    const { theme } = useTheme();

    const handleClick = (key: string) => {
        if (key === 'ENTER') {
            onEnter();
        } else if (key === '⌫') {
            onBackspace();
        } else {
            onKeyPress(key);
        }
    };

    return (
        <div className="w-full max-w-lg grid gap-1">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key) => {
                        const isSpecialKey = key === 'ENTER' || key === '⌫';
                        return (
                            <button
                                key={key}
                                onClick={() => handleClick(key)}
                                disabled={!isSpecialKey && disabledKeys.has(key)}
                                className={`
                                    ${isSpecialKey ? 'px-4 min-w-[10px]' : 'w-1/12'} 
                                    h-7
                                    flex items-center justify-center 
                                    text-sm font-semibold 
                                    ${theme === 'dark' 
                                        ? `bg-gray-800 hover:bg-gray-700 text-gray-100 border-gray-700
                                           ${isSpecialKey ? 'bg-gray-700 hover:bg-gray-600' : ''}`
                                        : `bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300
                                           ${isSpecialKey ? 'bg-gray-200 hover:bg-gray-300' : ''}`
                                    }
                                    border
                                    rounded-full
                                    transition-all duration-200
                                    shadow-lg
                                    backdrop-blur-sm
                                `}
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
