const {
 className,
 toggleDisplay,
 domElements,
 outputMessages,
} = require("./helper_objects");

class MemoryGame {
 constructor() {
  this.rows = 2;
  this.columns = 2;
  this.cards = [];
  this.moveCount = 0;
  this.moveCountDisplay = document.getElementById("moveCount");
  this.updateMoveCountDisplay();
  this.resetButton = domElements.resetButton;
  this.gridSizeSelect = document.getElementById("gridSize");
  this.gridSizeSelect.addEventListener("click", () => this.startGame());
  this.resetButton.addEventListener("click", () => this.resetGame());
  this.allFlipped = false;
  this.timerInterval = null;
  this.timerDisplay = document.getElementById("timer");
  this.startGame();
 }

 startGame() {
  this.updateTimerDisplay();
  const selectedSize = this.gridSizeSelect.value;
  [this.rows, this.columns] = selectedSize.split("x").map(Number);
  this.moveCount = 0;
  this.updateMoveCountDisplay();
  this.generateCards();
  this.shuffleCards();
  this.resetButton.style.display = toggleDisplay.none;
  this.cards.forEach((card) =>
   card.addEventListener("click", () => this.flipCard(card))
  );
 }

 generateCards() {
  this.cards = [];
  const memoryGameSection = document.querySelector(".memory-game");
  memoryGameSection.innerHTML = "";

  const totalCards = (this.rows * this.columns) / 2;

  for (let i = 1; i <= totalCards; i++) {
   const cardContainer = document.createElement("div");
   cardContainer.classList.add("memory-card");
   const frontImg = document.createElement("img");
   frontImg.classList.add("front-face");
   frontImg.src = `images/gorilla-${i}.svg`;
   frontImg.alt = `Gorilla-${i}`;
   const backImg = document.createElement("img");
   backImg.classList.add("back-face");
   backImg.src = "images/question-mark.jpeg";
   backImg.alt = "question mark image";

   cardContainer.appendChild(frontImg);
   cardContainer.appendChild(backImg);

   this.cards.push(cardContainer);
   memoryGameSection.appendChild(cardContainer);

   const duplicateCardContainer = cardContainer.cloneNode(true);
   this.cards.push(duplicateCardContainer);
   memoryGameSection.appendChild(duplicateCardContainer);
   memoryGameSection.style.setProperty("--cols", this.columns);
   memoryGameSection.style.setProperty("--rows", this.rows);
  }
 }

 shuffleCards() {
  this.cards.forEach((card) => {
   if (card && card.style) {
    const randomPosition = Math.floor(
     Math.random() * (this.rows * this.columns)
    );
    card.style.order = randomPosition;
   }
  });
 }

 updateMoveCountDisplay() {
  this.moveCountDisplay.textContent = outputMessages.turnCount(this.moveCount);
 }

 flipCard(card) {
  if (this.lockBoard || card.classList.contains(className.flip)) return;
  if (card === this.firstCard) return;
  if (!this.hasFlippedCard && !this.startTime) {
   this.startTime = Date.now();
   this.startTimer();
  }
  card.classList.add(className.flip);
  this.moveCount++;
  this.updateMoveCountDisplay();
  if (!this.hasFlippedCard) {
   this.hasFlippedCard = true;
   this.firstCard = card;
   this.resetButton.style.display = toggleDisplay.block;
   return;
  }

  this.secondCard = card;
  this.checkForMatch();
 }

 checkForMatch() {
  const isMatch =
   this.firstCard.childNodes[0].src === this.secondCard.childNodes[0].src;
  isMatch ? this.disableCards() : this.unFlipCards();
 }

 disableCards() {
  this.firstCard.removeEventListener("click", () =>
   this.flipCard(this.firstCard)
  );
  this.secondCard.removeEventListener("click", () =>
   this.flipCard(this.secondCard)
  );
  this.resetBoard();
 }

 unFlipCards() {
  this.lockBoard = true;

  setTimeout(() => {
   this.firstCard.classList.remove(className.flip);
   this.secondCard.classList.remove(className.flip);
   this.resetBoard();
  }, 1500);
 }

 resetBoard() {
  [this.hasFlippedCard, this.lockBoard] = [false, false];
  [this.firstCard, this.secondCard] = [null, null];
  this.allFlipped = this.cards.every((card) =>
   card.classList.contains(className.flip)
  );
  if (this.allFlipped) {
   const winningDialog = domElements.winningDialog;
   const closeButton = domElements.closeButton;
   const dialogContent = winningDialog.querySelector("p");
   dialogContent.textContent = outputMessages.movesMessage(
    this.moveCount,
    this.timerDisplay.textContent
   );

   document.body.appendChild(winningDialog);
   this.stopTimer();
   winningDialog.showModal();

   closeButton.addEventListener("click", () => {
    winningDialog.close();
   });
   this.resetButton.style.display = toggleDisplay.block;
  }
 }

 resetGame() {
  this.cards.forEach((card) => {
   card.removeEventListener("click", this.flipCard);
   card.classList.remove(className.flip);
   card.addEventListener("click", () => this.flipCard(card));
  });

  this.moveCount = 0;
  this.updateMoveCountDisplay();
  this.resetButton.style.display = toggleDisplay.none;
  this.shuffleCards();
  this.stopTimer();
  this.timerDisplay.textContent = "00:00";
  this.startTime = null;
  this.endTime = null;
 }

 startTimer() {
  this.startTime = Date.now();
  this.updateTimerDisplay();
  this.timerInterval = setInterval(() => {
   this.updateTimerDisplay();
  }, 1000);
 }

 updateTimerDisplay() {
  let elapsedTime;
  if (this.startTime && this.endTime) {
   elapsedTime = this.endTime - this.startTime;
  } else if (this.startTime) {
   elapsedTime = Date.now() - this.startTime;
  } else {
   elapsedTime = 0;
  }

  const seconds = Math.round(elapsedTime / 1000);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = ("0" + minutes).slice(-2);
  const formattedSeconds = ("0" + remainingSeconds).slice(-2);

  this.timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
 }

 stopTimer() {
  this.endTime = Date.now();
  clearInterval(this.timerInterval);
  this.updateTimerDisplay();
 }
}

window.onload = () => {
 const game = new MemoryGame();
 game.startGame();
};
module.exports = MemoryGame;
