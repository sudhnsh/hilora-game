import './App.css'
import { ThemeProvider } from './context/ThemeContext';
import Game from './components/Game';
import Home from './components/Home'; 
import Instructions from './components/Instructions';
import Statics from './components/Stats';
import GameMode from './components/GameMode';
import JourneyGame from './components/JourneyGame';
import { useState } from 'react';

type Page = 'home' | 'game' | 'instructions' | 'stats' | 'gameMode' | 'journey';

function App() {
  // const initData = useDevvitListener('INIT_RESPONSE');
  // useEffect(() => {
  //   sendToDevvit({ type: 'INIT' });
  // }, []);


  const [currentPage, setCurrentPage] = useState<Page>('home');
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (<>
          <Home 
            onPlayClick={() => {
              setCurrentPage('gameMode');}}   
            onInstructionsClick={() => setCurrentPage('instructions')}
          />
          </>
        );
      case 'gameMode':
        return (
          <GameMode
            onClassicClick={() => setCurrentPage('game')}
            onJourneyClick={() => setCurrentPage('journey')}
            onBackClick={() => setCurrentPage('home')}
          />
        );
      case 'game':
        return <Game 
          onHomeClick={() => setCurrentPage('home')}
          onBackClick={() => setCurrentPage('gameMode')}
          onStatsClick={() => setCurrentPage('stats')}
        />;
      case 'instructions':
        return <Instructions onBackClick={() => setCurrentPage('home')} />;
      case 'stats':
        return <Statics onBackClick={() => setCurrentPage('game')} />;
      case 'journey':
        return <JourneyGame
        onHomeClick={() => setCurrentPage('home')}
        onBackClick={() => setCurrentPage('gameMode')}
        onPlayAgainClick={() => setCurrentPage('journey')}
        />;
    }
  };

  return (
    <ThemeProvider>
      {renderPage()}
    </ThemeProvider>
  );
}

export default App;
