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
let lastClickedCard;

/* 
 * UI functions
 */
function updateMoves(num) {
  document.querySelector(DOMStrings.moves).textContent = num;
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
function gameController(e) {
  e.target.className += (' show open');
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
  updateMoves(0);
  lastClickedCard = undefined;

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