const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("./index.html", "utf-8");
const { window } = new JSDOM(html);
const { document } = window;
global.window = window;
global.document = document;

const { className } = require("../src/helper_objects");
const MemoryGame = require("../src/memory_game");

describe("memory game", () => {
 let game;
 let mockCards;
 let card1, card2, card;
 const scrObj1 = { src: "image1.jpg" };
 const scrObj2 = { src: "image2.jpg" };

 beforeEach(() => {
  mockCards = [
   {
    classList: {
     contains: jasmine.createSpy(),
     add: jasmine.createSpy(),
     remove: jasmine.createSpy(),
    },
    addEventListener: jasmine.createSpy(),
    removeEventListener: jasmine.createSpy(),
    childNodes: [scrObj1],
   },
   {
    classList: {
     contains: jasmine.createSpy(),
     add: jasmine.createSpy(),
     remove: jasmine.createSpy(),
    },
    addEventListener: jasmine.createSpy(),
    removeEventListener: jasmine.createSpy(),
    childNodes: [scrObj1],
   },
  ];

  game = new MemoryGame();
  game.cards = mockCards;

  [card1, card2] = mockCards;
  card = mockCards[0];
 });

 describe("flipCard method", () => {
  it("should flip cards by adding flip class to cards", () => {
   card1.classList.contains.and.returnValue(false);
   card2.classList.contains.and.returnValue(false);

   game.flipCard(card1);

   expect(card1.classList.add).toHaveBeenCalledWith(className.flip);
   expect(game.hasFlippedCard).toBe(true);
   expect(game.firstCard).toBe(card1);
  });
 });

 describe("checkForMatch method", () => {
  it("should disable cards if cards match", () => {
   const disableSpy = spyOn(game, "disableCards");

   game.firstCard = {
    childNodes: [scrObj1],
   };
   game.secondCard = {
    childNodes: [scrObj2],
   };

   game.checkForMatch();

   expect(disableSpy).not.toHaveBeenCalled();

   game.firstCard = {
    childNodes: [scrObj1],
   };
   game.secondCard = {
    childNodes: [scrObj1],
   };

   game.checkForMatch();

   expect(disableSpy).toHaveBeenCalledTimes(1);
  });

  it("should unFlip cards when cards do not match", () => {
   const unFlipSpy = spyOn(game, "unFlipCards");

   game.firstCard = {
    childNodes: [scrObj1],
    removeEventListener: jasmine.createSpy(),
   };
   game.secondCard = {
    childNodes: [scrObj1],
    removeEventListener: jasmine.createSpy(),
   };

   game.checkForMatch();

   expect(unFlipSpy).not.toHaveBeenCalled();

   game.firstCard = {
    childNodes: [scrObj1],
    removeEventListener: jasmine.createSpy(),
   };
   game.secondCard = {
    childNodes: [scrObj2],
    removeEventListener: jasmine.createSpy(),
   };

   game.checkForMatch();

   expect(unFlipSpy).toHaveBeenCalledTimes(1);
  });
 });

 describe("disableCards method", function () {
  it("should remove event listeners of cards when called", function () {
   game.firstCard = card1;
   game.secondCard = card2;

   spyOn(game, "resetBoard").and.callThrough();

   game.disableCards();

   expect(card1.removeEventListener).toHaveBeenCalledWith(
    "click",
    jasmine.any(Function)
   );
   expect(card2.removeEventListener).toHaveBeenCalledWith(
    "click",
    jasmine.any(Function)
   );
   expect(game.resetBoard).toHaveBeenCalled();
  });
 });

 describe("resetBoard method", function () {
  it("should reset board", function () {
   game.hasFlippedCard = true;
   game.lockBoard = true;

   game.firstCard = card1;
   game.secondCard = card2;

   game.resetBoard();

   expect(game.hasFlippedCard).toBe(false);
   expect(game.lockBoard).toBe(false);
   expect(game.firstCard).toBe(null);
   expect(game.secondCard).toBe(null);
  });
 });

 describe("resetGame", function () {
  it("should call removeEventListener and addEventListener on each card", function () {
   game.resetGame();

   expect(card.removeEventListener).toHaveBeenCalledOnceWith(
    "click",
    game.flipCard
   );
   expect(card.addEventListener).toHaveBeenCalledOnceWith(
    "click",
    jasmine.any(Function)
   );
  });
 });

 describe("startGame", function () {
  it("should call shuffleCards and generate cards when called", function () {
   spyOn(game, "shuffleCards");
   spyOn(game, "generateCards");

   game.startGame();
   card = game.cards[0];

   expect(card.addEventListener).toHaveBeenCalledTimes(1);
   expect(game.generateCards).toHaveBeenCalledTimes(1);
   expect(game.shuffleCards).toHaveBeenCalledTimes(1);
  });
 });

 describe("generateCards", () => {
  it("should generate cards specified by row and column", () => {
   game.rows = 4;
   game.columns = 4;
   game.generateCards();
   expect(game.cards.length).toBe(16);
  });
 });

 describe("MemoryGame Timer", () => {
  let updateDisplaySpy;
  beforeEach(() => {
   jasmine.clock().install();
   jasmine.clock().mockDate();
   updateDisplaySpy = spyOn(game, "updateTimerDisplay");
  });

  afterEach(() => {
   jasmine.clock().uninstall();
  });

  it("should start the timer when the timer starts", () => {
   game.startTimer();
   expect(updateDisplaySpy).toHaveBeenCalled();
  });

  it("should update the timer display every second plus once for the initial tick", () => {
   game.startTimer();
   jasmine.clock().tick(3000);

   expect(updateDisplaySpy).toHaveBeenCalledTimes(4);
  });

  it("should stop the timer when the game is reset", () => {
   spyOn(game, "stopTimer");
   game.startTimer();
   game.resetGame();

   expect(game.stopTimer).toHaveBeenCalled();
  });

  it("should calculate the correct elapsed time", () => {
   game.startTimer();

   jasmine.clock().tick(1000);

   game.stopTimer();

   const expectedElapsedTime = 1000;

   expect(game.endTime - game.startTime).toBe(expectedElapsedTime);
  });
 });
});
