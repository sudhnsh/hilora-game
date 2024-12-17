# Hilora: The 5-Letter Word Guessing Game  

## Overview  
**Hilora** is an interactive 5-letter word guessing game that delivers a unique and challenging experience through color-coded feedback. Built for Reddit using **React** and **Devvit Webview**, Hilora engages players with daily challenges, multiple game modes, and logical word-guessing mechanics, fostering an engaging community environment.  

---

## Features  

- **Color-Coded Feedback System**:  
   - **Green**: Correct letter, correct position.  
   - **Red**: Guessed letter is alphabetically *greater* than the correct letter.  
   - **Blue**: Guessed letter is alphabetically *smaller* than the correct letter.  

- **Multiple Game Modes**:  
   - **Classic Mode**: Guess the word in **7 attempts**.  
   - **Journey Mode**: Feedback is provided for **one letter at a time**, progressively revealing clues.  
   - **Rotation Mode**: After each guess, the word shifts using a **Caesar cipher (+1)**, challenging players to adapt as the word changes dynamically.**(If you like challenges, this is the one for you!)**
- **Daily Challenges**: Fresh word challenges are posted automatically every day.  
- **Community Focused**: Designed to run seamlessly on Reddit, encouraging users to play, share, and compete.  
- **Automation with Devvit APIs**: Game management, posts, and feedback responses are automated for smooth functionality.  
- **Open Source**: Contributions and improvements from developers are welcome.  

### Example:  
If the secret word is **“apple”**:

**grape** would have the following feedback:  
- **g**: red (since "g" is alphabetically greater than "a")  
- **r**: red (since "r" is alphabetically greater than "p")  
- **a**: blue (since "a" is alphabetically smaller than "p")  
- **p**: blue (since "p" is alphabetically smaller than "l")  
- **e**: green (since "e" is correct and in the right position).

---

## Built With  

- **React**: Frontend development for a clean and dynamic user interface.  
- **Devvit Webview**: Seamless embedding and integration within Reddit.  
- **Devvit APIs**: For automating game logic, challenge postings, and user interactions.  

---

## How to Play  

1. Guess the secret **5-letter word**.  
2. Receive **color-coded feedback** for each guess:  
   - **Green**: Correct letter in the correct position.  
   - **Red**: Guessed letter is alphabetically greater than the correct letter.  
   - **Blue**: Guessed letter is alphabetically smaller than the correct letter.  
3. Use the feedback to refine your guesses and find the correct word.  

### Game Modes  

- **Classic Mode**: Solve the word in **7 attempts** using feedback for each guess.  
- **Journey Mode**: Focus on one letter at a time; feedback is provided progressively for individual letters.  
- **Rotation Mode**: The word dynamically shifts after every guess using a **Caesar cipher (+1)**, where each letter changes to its next alphabetical position.  

---

### Playing
This is the app that runs the [**Hilora**](https://www.reddit.com/r/HiLoRA/) game on Reddit. Feel free to stop by, guess the 5-letter word, and challenge yourself every day!

---

## Roadmap  

Upcoming features for Hilora 🚀:  
- **Leaderboards**: Track high scores and streaks.  
- **Streaks and Rewards**: Badges and achievements for consistent players.  
- **Customization Options**: Subreddit-specific settings and word pools.  
- **New Features**: More interactive gameplay mechanics and user engagement tools.  

---

## License  

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.  

---

### Source Code
The [code for Hilora is open source!](https://github.com/sudhnsh/hilora-game) You are welcome to suggest improvements, fork the repository, and submit pull requests for new features and improvements.

## Contact  

For feedback, questions, or collaboration opportunities, feel free to reach out :  
- **GitHub**: [sudhnsh](https://github.com/sudhnsh)  
- **Reddit**: u/childhoodSerious5369 
