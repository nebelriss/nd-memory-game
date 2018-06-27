/*
 * global vars
 */
const cardFaces = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];

const DOMStrings = {
  'deck': '.deck',
  'moves': '.moves',
  'restart': '.restart'
}

const classStrings = {
  'card': 'card',
  'fa': 'fa'
}

/*
 * game state vars
 */
let lastSelectedCard = undefined;


/* 
 * UI functions
 */
function resetMoves() {
  document.querySelector(DOMStrings.moves).textContent = 0;
}

function addMove() {
  const value = Number(document.querySelector(DOMStrings.moves).textContent)
  document.querySelector(DOMStrings.moves).textContent = value + 1;
}

function clearGameBoard() {
  deck = document.querySelector(DOMStrings.deck);

  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
}

function drawGameBoard(cards) {

  // create a fragment
  const fragment = document.createDocumentFragment();

  for (let card of cards) {
    // create li element and add card class
    const li = document.createElement('li');
    li.classList.add('card');

    // create icon element and append to li
    const icon = document.createElement('i');
    icon.className = `${classStrings.fa} ${classStrings.fa}-${card}`;

    li.appendChild(icon);

    // append li to fragment
    fragment.appendChild(li);
  }
  document.querySelector(DOMStrings.deck).appendChild(fragment);
}


/*
 * Game control functions
 */
function checkIfCardMatch(card1, card2) {
  if (card1.innerHTML === card2.innerHTML) {
    return true;
  }
  return false;
}

function isMached(element) {
  // if card has class match return true, else false
  for (let classItem of element.classList) {
    if (classItem === "match") {
      return true;
    }
  }
  return false;
}

function gameController(e) {
  
  // check if the selected card isn't a matched one, or the same card has been clicked twice.
  if (!isMached(e.target) && lastSelectedCard !== e.target) {
    e.target.className += (' show open');

    if (lastSelectedCard === undefined) {
      // set lastSelectedCard to current card
      lastSelectedCard = e.target
    } else {
      if (!checkIfCardMatch(lastSelectedCard, e.target)) {

        // if cards do not match, turn them face down.
        setTimeout(() => {
          e.target.classList.remove('show', 'open');
          lastSelectedCard.classList.remove('show', 'open');

        }, 1000);
      } else {
        // if card match, add class match to them.
        e.target.classList.add('match');
        lastSelectedCard.classList.add('match');
      }

      // reset lastClickedCard
      lastSelectedCard = undefined;
      // add move
      addMove();
    }
  }
}


/*
 * Basic functions
 */
function setUpEventListeners() {
  // listener for the cards
  document.querySelector(DOMStrings.deck).addEventListener('click', gameController);

  // listener for reset button
  document.querySelector(DOMStrings.restart).addEventListener('click', initGame);
}

function createFullShuffledDeck(cards) {
  const array = cards.concat(cards);
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * Init
 */
function initGame() {
  // TODO: init or reset game state
  resetMoves();
  lastSelectedCard = undefined;

  // duplicate array, combine it and shuffle it.
  const fulldeck = createFullShuffledDeck(cardFaces);

  // clear board
  clearGameBoard();

  // draw gameboard with fulldeck
  drawGameBoard(fulldeck);
}

function init() {
  // init game
  initGame();

  // add event listeners
  setUpEventListeners();
}

init();