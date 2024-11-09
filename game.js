class WhackAMole {
  constructor() {
    this.score = 0;
    this.gameRunning = false;
    this.currentMole = null;
    this.gameTimeout = null;
    this.defaultTime = 15;
    this.timeLeft = this.defaultTime;
    this.timerInterval = null;
    this.holes = Array.from(document.querySelectorAll('.hole'));
    this.scoreDisplay = document.getElementById('score');
    this.timerDisplay = document.getElementById('timer');
    this.finalScoreDisplay = document.getElementById('finalScore');
    this.modal = document.getElementById('gameOverModal');
    this.hammer = this.createHammer();
    this.timeFrames = {
      easy: { min: 1000, max: 2000 },      // بطيء: 1-2 ثواني
      normal: { min: 500, max: 1000 },     // عادي: 0.5-1 ثانية
      hard: { min: 200, max: 500 }         // سريع: 0.2-0.5 ثانية
    };
    this.currentDifficulty = 'normal';
  }

  createHammer() {
    const hammer = document.createElement('div');
    hammer.className = 'hammer';
    document.body.appendChild(hammer);
    return hammer;
  }

  createMoles() {
    this.holes.forEach(hole => {
      const mole = document.createElement('div');
      mole.classList.add('mole');
      const face = document.createElement('div');
      face.classList.add('mole-face');
      const cheeks = document.createElement('div');
      cheeks.classList.add('cheeks');
      face.appendChild(cheeks);
      mole.appendChild(face);
      hole.appendChild(mole);
    });
  }

  getRandomHole() {
    const index = Math.floor(Math.random() * this.holes.length);
    const hole = this.holes[index];
    if (hole === this.currentMole) {
      return this.getRandomHole();
    }
    return hole;
  }

  showMole() {
    const holes = document.querySelectorAll('.hole');
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    randomHole.classList.add('up');

    const { min, max } = this.timeFrames[this.currentDifficulty];
    const time = Math.random() * (max - min) + min;

    setTimeout(() => {
      randomHole.classList.remove('up');
      if (this.gameRunning) this.showMole();
    }, time);
  }

  updateTimer() {
    this.timerDisplay.textContent = this.timeLeft;
    if (this.timeLeft === 0) {
      this.endGame();
    } else {
      this.timeLeft--;
    }
  }

  startGame() {
    if (this.gameRunning) return;
    this.score = 0;
    this.timeLeft = this.defaultTime;
    this.gameRunning = true;
    this.scoreDisplay.textContent = '0';
    this.timerDisplay.textContent = this.timeLeft;
    this.showMole();
    this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    document.getElementById('startGame').disabled = true;
  }

  endGame() {
    this.gameRunning = false;
    clearInterval(this.timerInterval);
    this.holes.forEach(hole => hole.classList.remove('up'));
    this.finalScoreDisplay.textContent = this.score;
    this.modal.classList.add('visible');
    document.getElementById('startGame').disabled = false;
  }

  bonk(e) {
    if (!e.isTrusted) return;
    const hole = e.target.closest('.hole');
    if (!hole) return;
    if (!hole.classList.contains('up')) return;
    
    hole.classList.remove('up');
    hole.classList.add('bonked');
    setTimeout(() => hole.classList.remove('bonked'), 200);
    this.score++;
    this.scoreDisplay.textContent = this.score;
  }

  setGameTime(seconds) {
    this.defaultTime = seconds;
    this.timeLeft = seconds;
    this.timerDisplay.textContent = seconds;
  }

  setDifficulty(level) {
    this.currentDifficulty = level;
  }
}

export function initGame() {
  const game = new WhackAMole();
  game.createMoles();

  document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', () => {
      const time = parseInt(button.dataset.time);
      game.setGameTime(time);
    });
  });

  game.holes.forEach(hole => {
    hole.addEventListener('click', (e) => game.bonk(e));
  });

  document.getElementById('startGame').addEventListener('click', () => game.startGame());
  document.getElementById('closeModal').addEventListener('click', () => {
    game.modal.classList.remove('visible');
  });

  document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
      const difficulty = button.dataset.difficulty;
      game.setDifficulty(difficulty);
      
      document.querySelectorAll('.difficulty-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });

  return game;
}

// Initialize the game
document.addEventListener('DOMContentLoaded', initGame);