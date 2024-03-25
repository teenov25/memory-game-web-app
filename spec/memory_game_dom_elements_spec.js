const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");
const { window } = new JSDOM(html);
const { document } = window;
global.window = window;
global.document = document;

const MemoryGame = require("../src/memory_game");
const {
 domElements,
 toggleDisplay,
 outputMessages,
} = require("../src/helper_objects");

describe("Memory Game", function () {
 let game;
 let resetButton;
 let card1;

 beforeEach(function () {
  game = new MemoryGame();
  resetButton = domElements.resetButton;
  card1 = game.cards[0];
 });

 describe("resetButton", function () {
  it("should appear when the first card is flipped", function () {
   game.startGame();

   expect(resetButton.style.display).toEqual(toggleDisplay.none);

   card1.click();

   expect(resetButton.style.display).toEqual(toggleDisplay.block);
  });

  it("should not change the grid size when clicked", () => {
   game.gridSizeSelect.value = "3x4";
   game.gridSizeSelect.click();

   expect(game.rows).toBe(3);
   expect(game.columns).toBe(4);

   resetButton.click();

   expect(game.rows).toBe(3);
   expect(game.columns).toBe(4);
  });

  it("should reset the turn count to zero when clicked", () => {
   card1.click();

   expect(game.moveCount).toBe(1);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );
   game.resetButton.click();

   expect(game.moveCount).toBe(0);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );
  });
 });

 describe("shuffleCards method", function () {
  it("should shuffle the order of cards when the reset button is clicked", async function () {
   const originalOrder = Array.from(game.cards, (card) => card.style.order);

   resetButton.click();

   const shuffledOrder = Array.from(game.cards, (card) => card.style.order);
   const isSameOrder = shuffledOrder.every(
    (order, index) => order === originalOrder[index]
   );

   expect(isSameOrder).toBe(false);
  });
 });

 describe("gridSizeSelect dropdown", () => {
  it("should create cards by selecting grid size", () => {
   game.gridSizeSelect.value = "2x2";
   game.gridSizeSelect.click();

   expect(game.cards.length).toBe(4);

   game.gridSizeSelect.value = "3x2";
   game.gridSizeSelect.click();

   expect(game.rows).toBe(3);
   expect(game.columns).toBe(2);
   expect(game.cards.length).toBe(6);
  });

  it("should reset the move count to 0 when clicked", () => {
   card1.click();

   expect(game.moveCount).toBe(1);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );

   game.gridSizeSelect.click();

   expect(game.moveCount).toBe(0);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );
  });
 });

 describe("moveCountDisplay", () => {
  it("should display the number of moves each time a card is flipped", () => {
   card1.click();

   expect(game.moveCount).toBe(1);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );

   const card2 = game.cards[1];
   card2.click();

   expect(game.moveCount).toBe(2);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );

   const card3 = game.cards[2];
   card3.click();

   expect(game.moveCount).toBe(3);
   expect(game.moveCountDisplay.textContent).toContain(
    outputMessages.turnCount(game.moveCount)
   );
  });
 });

 describe("showModal dialog", () => {
  let game;

  beforeEach(() => {
   game = new MemoryGame();
   window.HTMLDialogElement.prototype.showModal = jasmine
    .createSpy("showModal")
    .and.callThrough();
  });

  it("should display the dialog after all cards have been flipped", () => {
   expect(window.HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

   game.cards.forEach((card) => game.flipCard(card));

   expect(window.HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("should display the message with the number of moves after all cards have been flipped", () => {
   game.cards.forEach((card) => game.flipCard(card));

   expect(window.HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(
    1
   );

   const movesMessage = outputMessages.movesMessage(
    game.moveCount,
    game.timerDisplay.textContent
   );
   const dialogContent = domElements.winningDialog.querySelector("p");

   expect(dialogContent.textContent).toContain(movesMessage);
  });
 });
});
