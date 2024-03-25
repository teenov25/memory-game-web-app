/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper_objects.js":
/*!*******************************!*\
  !*** ./src/helper_objects.js ***!
  \*******************************/
/***/ ((module) => {

eval("const className = {\n flip: \"flip\",\n memoryCard: \".memory-card\",\n};\n\nconst elementID = {\n winningDialog: \"winningDialog\",\n closeButton: \"closeButton\",\n resetButton: \"resetButton\",\n};\n\nconst domElements = {\n resetButton: document.getElementById(elementID.resetButton),\n winningDialog: document.getElementById(elementID.winningDialog),\n closeButton: document.getElementById(elementID.closeButton),\n};\n\nconst toggleDisplay = {\n block: \"block\",\n none: \"none\",\n};\n\nconst outputMessages = {\n movesMessage: (moveCount, elapsedTime) =>\n  `You finished the game in ${moveCount} moves! Time: ${elapsedTime} seconds`,\n turnCount: (moveCount) => `Moves: ${moveCount}`,\n};\n\nmodule.exports = {\n className,\n domElements,\n toggleDisplay,\n outputMessages,\n};\n\n\n//# sourceURL=webpack://tm-novuka-222-memory-game-in-vanilla-js-javascript/./src/helper_objects.js?");

/***/ }),

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n className,\n toggleDisplay,\n domElements,\n outputMessages,\n} = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\n\nclass MemoryGame {\n constructor() {\n  this.rows = 2;\n  this.columns = 2;\n  this.cards = [];\n  this.moveCount = 0;\n  this.moveCountDisplay = document.getElementById(\"moveCount\");\n  this.updateMoveCountDisplay();\n  this.resetButton = domElements.resetButton;\n  this.gridSizeSelect = document.getElementById(\"gridSize\");\n  this.gridSizeSelect.addEventListener(\"click\", () => this.startGame());\n  this.resetButton.addEventListener(\"click\", () => this.resetGame());\n  this.allFlipped = false;\n  this.timerInterval = null;\n  this.timerDisplay = document.getElementById(\"timer\");\n  this.startGame();\n }\n\n startGame() {\n  this.updateTimerDisplay();\n  const selectedSize = this.gridSizeSelect.value;\n  [this.rows, this.columns] = selectedSize.split(\"x\").map(Number);\n  this.moveCount = 0;\n  this.updateMoveCountDisplay();\n  this.generateCards();\n  this.shuffleCards();\n  this.resetButton.style.display = toggleDisplay.none;\n  this.cards.forEach((card) =>\n   card.addEventListener(\"click\", () => this.flipCard(card))\n  );\n }\n\n generateCards() {\n  this.cards = [];\n  const memoryGameSection = document.querySelector(\".memory-game\");\n  memoryGameSection.innerHTML = \"\";\n\n  const totalCards = (this.rows * this.columns) / 2;\n\n  for (let i = 1; i <= totalCards; i++) {\n   const cardContainer = document.createElement(\"div\");\n   cardContainer.classList.add(\"memory-card\");\n   const frontImg = document.createElement(\"img\");\n   frontImg.classList.add(\"front-face\");\n   frontImg.src = `images/gorilla-${i}.svg`;\n   frontImg.alt = `Gorilla-${i}`;\n   const backImg = document.createElement(\"img\");\n   backImg.classList.add(\"back-face\");\n   backImg.src = \"images/question-mark.jpeg\";\n   backImg.alt = \"question mark image\";\n\n   cardContainer.appendChild(frontImg);\n   cardContainer.appendChild(backImg);\n\n   this.cards.push(cardContainer);\n   memoryGameSection.appendChild(cardContainer);\n\n   const duplicateCardContainer = cardContainer.cloneNode(true);\n   this.cards.push(duplicateCardContainer);\n   memoryGameSection.appendChild(duplicateCardContainer);\n   memoryGameSection.style.setProperty(\"--cols\", this.columns);\n   memoryGameSection.style.setProperty(\"--rows\", this.rows);\n  }\n }\n\n shuffleCards() {\n  this.cards.forEach((card) => {\n   if (card && card.style) {\n    const randomPosition = Math.floor(\n     Math.random() * (this.rows * this.columns)\n    );\n    card.style.order = randomPosition;\n   }\n  });\n }\n\n updateMoveCountDisplay() {\n  this.moveCountDisplay.textContent = outputMessages.turnCount(this.moveCount);\n }\n\n flipCard(card) {\n  if (this.lockBoard || card.classList.contains(className.flip)) return;\n  if (card === this.firstCard) return;\n  if (!this.hasFlippedCard && !this.startTime) {\n   this.startTime = Date.now();\n   this.startTimer();\n  }\n  card.classList.add(className.flip);\n  this.moveCount++;\n  this.updateMoveCountDisplay();\n  if (!this.hasFlippedCard) {\n   this.hasFlippedCard = true;\n   this.firstCard = card;\n   this.resetButton.style.display = toggleDisplay.block;\n   return;\n  }\n\n  this.secondCard = card;\n  this.checkForMatch();\n }\n\n checkForMatch() {\n  const isMatch =\n   this.firstCard.childNodes[0].src === this.secondCard.childNodes[0].src;\n  isMatch ? this.disableCards() : this.unFlipCards();\n }\n\n disableCards() {\n  this.firstCard.removeEventListener(\"click\", () =>\n   this.flipCard(this.firstCard)\n  );\n  this.secondCard.removeEventListener(\"click\", () =>\n   this.flipCard(this.secondCard)\n  );\n  this.resetBoard();\n }\n\n unFlipCards() {\n  this.lockBoard = true;\n\n  setTimeout(() => {\n   this.firstCard.classList.remove(className.flip);\n   this.secondCard.classList.remove(className.flip);\n   this.resetBoard();\n  }, 1500);\n }\n\n resetBoard() {\n  [this.hasFlippedCard, this.lockBoard] = [false, false];\n  [this.firstCard, this.secondCard] = [null, null];\n  this.allFlipped = this.cards.every((card) =>\n   card.classList.contains(className.flip)\n  );\n  if (this.allFlipped) {\n   const winningDialog = domElements.winningDialog;\n   const closeButton = domElements.closeButton;\n   const dialogContent = winningDialog.querySelector(\"p\");\n   dialogContent.textContent = outputMessages.movesMessage(\n    this.moveCount,\n    this.timerDisplay.textContent\n   );\n\n   document.body.appendChild(winningDialog);\n   this.stopTimer();\n   winningDialog.showModal();\n\n   closeButton.addEventListener(\"click\", () => {\n    winningDialog.close();\n   });\n   this.resetButton.style.display = toggleDisplay.block;\n  }\n }\n\n resetGame() {\n  this.cards.forEach((card) => {\n   card.removeEventListener(\"click\", this.flipCard);\n   card.classList.remove(className.flip);\n   card.addEventListener(\"click\", () => this.flipCard(card));\n  });\n\n  this.moveCount = 0;\n  this.updateMoveCountDisplay();\n  this.resetButton.style.display = toggleDisplay.none;\n  this.shuffleCards();\n  this.stopTimer();\n  this.timerDisplay.textContent = \"00:00\";\n  this.startTime = null;\n  this.endTime = null;\n }\n\n startTimer() {\n  this.startTime = Date.now();\n  this.updateTimerDisplay();\n  this.timerInterval = setInterval(() => {\n   this.updateTimerDisplay();\n  }, 1000);\n }\n\n updateTimerDisplay() {\n  let elapsedTime;\n  if (this.startTime && this.endTime) {\n   elapsedTime = this.endTime - this.startTime;\n  } else if (this.startTime) {\n   elapsedTime = Date.now() - this.startTime;\n  } else {\n   elapsedTime = 0;\n  }\n\n  const seconds = Math.round(elapsedTime / 1000);\n\n  const minutes = Math.floor(seconds / 60);\n  const remainingSeconds = seconds % 60;\n\n  const formattedMinutes = (\"0\" + minutes).slice(-2);\n  const formattedSeconds = (\"0\" + remainingSeconds).slice(-2);\n\n  this.timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;\n }\n\n stopTimer() {\n  this.endTime = Date.now();\n  clearInterval(this.timerInterval);\n  this.updateTimerDisplay();\n }\n}\n\nwindow.onload = () => {\n const game = new MemoryGame();\n game.startGame();\n};\nmodule.exports = MemoryGame;\n\n\n//# sourceURL=webpack://tm-novuka-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/memory_game.js");
/******/ 	
/******/ })()
;