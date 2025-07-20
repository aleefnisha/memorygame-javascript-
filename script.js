const emojis = ['🍓','🍒','🍉','🍍','🥝','🍇','🥥','🍌'];
let cards = [...emojis, ...emojis];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer = 0;
let interval;
let moves = 0;

const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const winOverlay = document.getElementById('win-overlay');
const finalTime = document.getElementById('final-time');
const finalMoves = document.getElementById('final-moves');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cards);
  grid.innerHTML = '';
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = '';
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  this.innerText = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.innerText = moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetTurn();
  checkGameEnd();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard.innerText = '';
    secondCard.innerText = '';
    resetTurn();
  }, 800);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer() {
  timer = 0;
  moves = 0;
  movesDisplay.innerText = 0;
  timerDisplay.innerText = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.innerText = timer;
  }, 1000);
}

function checkGameEnd() {
  const matchedCards = document.querySelectorAll('.card.matched');
  if (matchedCards.length === cards.length) {
    clearInterval(interval);
    setTimeout(() => {
      finalTime.innerText = timer;
      finalMoves.innerText = moves;
      winOverlay.style.display = 'flex';
    }, 300);
  }
}

function restartGame() {
  winOverlay.style.display = 'none';
  startTimer();
  createBoard();
}

restartButton.addEventListener('click', restartGame);
window.onload = () => {
  startTimer();
  createBoard();
};
