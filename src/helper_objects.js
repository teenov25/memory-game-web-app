const className = {
 flip: "flip",
 memoryCard: ".memory-card",
};

const elementID = {
 winningDialog: "winningDialog",
 closeButton: "closeButton",
 resetButton: "resetButton",
};

const domElements = {
 resetButton: document.getElementById(elementID.resetButton),
 winningDialog: document.getElementById(elementID.winningDialog),
 closeButton: document.getElementById(elementID.closeButton),
};

const toggleDisplay = {
 block: "block",
 none: "none",
};

const outputMessages = {
 movesMessage: (moveCount, elapsedTime) =>
  `You finished the game in ${moveCount} moves! Time: ${elapsedTime} seconds`,
 turnCount: (moveCount) => `Moves: ${moveCount}`,
};

module.exports = {
 className,
 domElements,
 toggleDisplay,
 outputMessages,
};
