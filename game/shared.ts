// Type definitions
export type LetterState = 'correct' | 'higher' | 'lower' | 'unused';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
    guesses: string[];
    feedback: LetterState[][];
    gameStatus: GameStatus;
    targetWord: string;
    currentDate: string;
}

export type Page =
  | "home"
  | "pokemon";

export type WebviewToBlockMessage = { type: "INIT" } 
| {
  type: "GET_POKEMON_REQUEST";
  payload: { name: string }; }
| { type: "GET_CURRENTUSER_NAME"}
| {type: "CONSOLE_LOG"; payload: { message: string;} } 
| { type: "GET_CURRENT_GAME_STATE" } 
| { type : "SET_CURRENT_GAME_STATE"; payload: { gameStatus: string; currentDate: string; guesses: string;  }}
| { type : "GET_GAME_STATS" }
| { type : "SET_GAME_STATS" ; payload: { played: string; wins: string; attempts: string; } };

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: {
    postId: string;
  };} 
| {
  type: "GET_POKEMON_RESPONSE";
  payload: { number: number; name: string; error?: string };
}
|{ type : "CONSOLE_LOG_RESPONSE"; payload: { error?: string }} 
|{
  type: "GET_CURRENTUSER_NAME_RESPONSE";
  payload: { name: string; error?: string };
}
| { type: "GET_CURRENT_GAME_STATE_RESPONSE"; payload: { gameStatus: string; currentDate: string; guesses: string;  error?: string } }
| { type: "SET_CURRENT_GAME_STATE_RESPONSE"; payload: { error?: string } }
| { type: "GET_GAME_STATS_RESPONSE"; payload: { played: string; wins: string; attempts: string; error?: string } }
| { type: "SET_GAME_STATS_RESPONSE"; payload: { error?: string } };

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};
