/*
 * global vars
 */
const cardFaces = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];

const DOMStrings = {
  'deck': '.deck',
  'moves': '.moves',
  'restart': '.restart',
  'star': '.fa-star',
  'emptyStar': '.fa-star-o'
}

const classStrings = {
  'card': 'card',
  'fa': 'fa'
}

/*
 * game state vars
 */
let lastSelectedCard = undefined;
let gameIsLocked = false;


/* 
 * UI functions
 */
function resetMoves() {
  document.querySelector(DOMStrings.moves).textContent = 0;
}

function addMove() {
  const moves = document.querySelector(DOMStrings.moves);
  const value = Number(moves.textContent)

  const newValue = value + 1;
  moves.textContent = newValue;
  console.log(newValue);

  // remove last star
  if (newValue === 10 || newValue === 15 || newValue === 20) {
    removeLastStar();
  }
}

function removeLastStar() {
  const lastStar = document.querySelectorAll(DOMStrings.star);

  if (lastStar.length != 0) {
    lastStar[lastStar.length - 1].className += '-o';
  }
}

function resetStars() {
  const emptyStars = document.querySelectorAll(DOMStrings.emptyStar);
  for (let star of emptyStars) {
    star.classList.remove('fa-star-o');
    star.classList.add('fa-star');
  }
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

function isGameWon() {
  const deck = document.querySelector(DOMStrings.deck);
  const moves = document.querySelector(DOMStrings.moves).textContent;

  for (let card of deck.childNodes) {
    if (!existsClass(card, 'match')) {
      return false;
    }
  }

  window.location = 'winner.html?moves=' + moves;
}

function checkIfCardMatch(card1, card2) {
  if (card1.innerHTML === card2.innerHTML) {
    return true;
  }
  return false;
}

function existsClass(element, className) {
  // if card has class match return true, else false
  for (let classItem of element.classList) {
    if (classItem === className) {
      return true;
    }
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
  // check if event is from a card
  if (existsClass(e.target, 'card'))
    {
    // check if the selected card isn't a matched one, or the same card has been clicked twice.
    if (!isMached(e.target) && lastSelectedCard !== e.target && !gameIsLocked) {
      e.target.className += (' show open');

      if (lastSelectedCard === undefined) {
        // set lastSelectedCard to current card
        lastSelectedCard = e.target
      } else {
        if (!checkIfCardMatch(lastSelectedCard, e.target)) {

          // lock game board, so no interaction is possible while the animation is running
          gameIsLocked = true;

          // listener for animation end
          e.target.addEventListener('animationend', function _listener() {
            e.target.classList.remove('show', 'open', 'no-match');
            lastSelectedCard.classList.remove('show', 'open', 'no-match');

            // reset lastClickedCard
            lastSelectedCard = undefined;
            gameIsLocked = false;

            // remove listener for animation
            e.target.removeEventListener("animationend", _listener, true);
          }, true);


          // if cards do not match, turn them face down.
          e.target.classList.add('no-match');
          lastSelectedCard.classList.add('no-match');

        } else {
          // if card match, add class match to them.
          e.target.classList.add('match');
          lastSelectedCard.classList.add('match');

          // reset lastClickedCard
          lastSelectedCard = undefined;
        }

        // add move
        addMove();
      }
      isGameWon();
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
  // init or reset game state
  resetMoves();
  resetStars();
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