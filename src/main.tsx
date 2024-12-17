import { Devvit, useAsync, useState } from '@devvit/public-api';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { getPokemonByName } from './core/pokeapi.js';

export type LetterState = 'correct' | 'higher' | 'lower' | 'unused';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
    guesses: string[];
    feedback: LetterState[][];
    gameStatus: GameStatus;
    targetWord: string;
    currentDate: string;
}

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
});

// Scheduler for daily posts
Devvit.addSchedulerJob({
  name: 'daily_hilora_post',
  onRun: async (_, context) => {
    const subreddit = await context.reddit.getCurrentSubreddit();
    try {
      const post = await context.reddit.submitPost({
        title: 'Classic HiLoRA - Daily Post',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      console.log(`Daily post created: ${post.url}`);
    } catch (error) {
      console.error('Failed to create daily post:', error);
    }
  },
});

// Menu item to apply daily posts
Devvit.addMenuItem({
  label: 'Enable Daily HiLoRA Posts',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { scheduler, redis, ui } = context;
    try {
      const jobId = await scheduler.runJob({
        cron: '0 12 * * *', // Daily at 12:00 UTC
        name: 'daily_hilora_post',
        data: {},
      });
      await redis.set('daily_hilora_jobId', jobId);
      ui.showToast({ text: 'Daily HiLoRA posts enabled!' });
    } catch (error) {
      console.error('Failed to enable daily posts:', error);
      ui.showToast({ text: 'Failed to enable daily posts. Check logs for details.' });
    }
  },
});

// Menu item to cancel daily posts
Devvit.addMenuItem({
  label: 'Disable Daily HiLoRA Posts',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { scheduler, redis, ui } = context;
    try {
      const jobId = await redis.get('daily_hilora_jobId');
      if (jobId) {
        await scheduler.cancelJob(jobId);
        await redis.del('daily_hilora_jobId');
        ui.showToast({ text: 'Daily HiLoRA posts disabled!' });
      } else {
        ui.showToast({ text: 'No active daily post schedule found.' });
      }
    } catch (error) {
      console.error('Failed to disable daily posts:', error);
      ui.showToast({ text: 'Failed to disable daily posts. Check logs for details.' });
    }
  },
});

Devvit.addMenuItem({
  label: 'Add HiLoRA',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'HiLoRA',
      subredditName: subreddit.name,
      preview: <Preview />,
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post.url);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (context) => {
    const [launched, setLaunched] = useState(false);
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}
            onMessage={async (event) => {
              console.log('Received message', event);
              const data = event as unknown as WebviewToBlockMessage;

              switch (data.type) {
                case 'INIT':
                  sendMessageToWebview(context, {
                    type: 'INIT_RESPONSE',
                    payload: {
                      postId: username,
                    },
                  });
                  break;
                case 'CONSOLE_LOG':
                  console.log(data.payload.message);
                  break;
                case 'GET_POKEMON_REQUEST':
                  context.ui.showToast({ text: `Received message: ${JSON.stringify(data)}` });
                  const pokemon = getPokemonByName(data.payload.name);

                  sendMessageToWebview(context, {
                    type: 'GET_POKEMON_RESPONSE',
                    payload: {
                      name: pokemon.name,
                      number: pokemon.id,
                    },
                  });
                  break;
                case 'GET_CURRENTUSER_NAME':
                  sendMessageToWebview(context, {
                    type: 'GET_CURRENTUSER_NAME_RESPONSE',
                    payload: {
                      name: username,
                    },
                  });
                  break;
                case 'GET_CURRENT_GAME_STATE':
                  const gameStatus = await context.redis.get(`gameStatus_${context.userId}`);
                  const currentDate = await context.redis.get(`currentDate_${context.userId}`);
                  const guesses = await context.redis.get(`guesses_${context.userId}`);
                  console.log(`got gameStatus: ${gameStatus}, currentDate: ${currentDate}, guesses: ${guesses}`);
                  sendMessageToWebview(context, {
                    type: 'GET_CURRENT_GAME_STATE_RESPONSE',
                    payload: {
                      gameStatus: gameStatus ?? 'playing',
                      currentDate: currentDate ?? new Date().toDateString(),
                      guesses: guesses ?? JSON.stringify([]),
                    },
                  });
                  break;
                case 'SET_CURRENT_GAME_STATE':
                  await context.redis.set(`gameStatus_${context.userId}`, data.payload.gameStatus);
                  await context.redis.set(`currentDate_${context.userId}`, data.payload.currentDate);
                  await context.redis.set(`guesses_${context.userId}`, data.payload.guesses);
                  console.log(`got payload to set gameStatus to ${data.payload.gameStatus} and currentDate to ${data.payload.currentDate} and guesses to ${data.payload.guesses}`);
                  sendMessageToWebview(context, {
                    type: 'SET_CURRENT_GAME_STATE_RESPONSE',
                    payload: {},
                  });
                  break;
                case 'GET_GAME_STATS':
                  const played = await context.redis.get(`played_${context.userId}`) ?? '0';
                  const attempts = await context.redis.get(`attempts_${context.userId}`) ?? '0';
                  const wins = await context.redis.get(`wins_${context.userId}`) ?? '0';
                  console.log(`got played: ${played}, attempts: ${attempts}, wins: ${wins}`);
                  sendMessageToWebview(context, {
                    type: 'GET_GAME_STATS_RESPONSE',
                    payload: {
                      played,
                      attempts,
                      wins,
                    },
                  });
                  break;
                case 'SET_GAME_STATS':
                  await context.redis.set(`played_${context.userId}`, data.payload.played);
                  await context.redis.set(`attempts_${context.userId}`, data.payload.attempts);
                  await context.redis.set(`wins_${context.userId}`, data.payload.wins);
                  console.log(` Set played: ${data.payload.played}, attempts: ${data.payload.attempts}, wins: ${data.payload.wins}`);
                  sendMessageToWebview(context, {
                    type: 'SET_GAME_STATS_RESPONSE',
                    payload: {},
                  });
                  break;

                default:
                  console.error('Unknown message type', data satisfies never);
                  break;
              }
            }}
          />
        ) : (
          <button
            onPress={() => {
              setLaunched(true);
            }}
          >
            Launch
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
