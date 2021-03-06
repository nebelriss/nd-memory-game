(function () {
  'use strict';

  /*
   * global vars
   */
  const cardFaces = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];

  const DOMStrings = {
    'deck': '.deck',
    'moves': '.moves',
    'restart': '.restart',
    'star': '.fa-star',
    'emptyStar': '.fa-star-o',
    'time': '.time'
  }

  const classStrings = {
    'card': 'card',
    'fa': 'fa',
    'show': 'show',
    'open': 'open',
    'nomatch': 'no-match',
    'starEmpty': 'fa-star-o',
    'star': 'fa-star',
    'match': 'match'
  }

  /*
   * game state vars
   */
  let lastSelectedCard = undefined;
  let gameIsLocked = false;
  let interval;


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

    // remove last star
    if (newValue === 10 || newValue === 15 || newValue === 20) {
      removeLastStar();
    }
  }

  function removeLastStar() {
    const lastStar = document.querySelectorAll(DOMStrings.star);

    if (lastStar.length != 1) {
      lastStar[lastStar.length - 1].className += '-o';
    }
  }

  function resetStars() {
    const emptyStars = document.querySelectorAll(DOMStrings.emptyStar);
    for (let star of emptyStars) {
      star.classList.remove(classStrings.starEmpty);
      star.classList.add(classStrings.star);
    }
  }

  function clearGameBoard() {
    const deck = document.querySelector(DOMStrings.deck);

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
      li.classList.add(classStrings.card);

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
  * Timer functions
  */
  function startTimer() {
    interval = setInterval(updateTimerDisplay, 1000);
  }

  function stopTimer() {
    clearInterval(interval);
    interval = null;
  }

  function updateTimerDisplay() {
    const timeEl = document.querySelector(DOMStrings.time);
    const currentTime = timeEl.textContent.split(':');

    let minutes = Number(currentTime[0]);
    let seconds = Number(currentTime[1]) + 1;

    // if seconds is 60 add 1 to minutes and set seconds to zero
    if (seconds == 60) {
      minutes = minutes + 1;
      seconds = 0;
    }

    // dealing with single digits, so they have a leading 0
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    timeEl.textContent = `${minutes}:${seconds}`;
  }

  function getStarCount() {
    return document.querySelectorAll(DOMStrings.star).length;
  }


  /*
   * Game control functions
   */

  function isGameWon() {
    const deck = document.querySelector(DOMStrings.deck);
    const moves = document.querySelector(DOMStrings.moves).textContent;
    const time = document.querySelector(DOMStrings.time).textContent;
    let stars = getStarCount();

    if (stars > 1) {
      stars += ' stars';
    } else {
      stars += ' star';
    }

    for (let card of deck.childNodes) {
      if (!existsClass(card, classStrings.match)) {
        // game isn't finished
        return false;
      }
    }
    // game is finished
    stopTimer();

    const dlgText = `${moves} moves, ${stars}, time: ${time}.`;

    swal({
      title: "You Won!",
      text: dlgText,
      icon: "success",
      button: "Restart Game",
    }).then((value) => {
      if (value) {
        initGame();
      }
    });
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

  function gameController(e) {
    // check if event is from a card
    if (existsClass(e.target, classStrings.card)) {

      // starting timer, if timer exist it will be ignored
      if (interval == null) {
        startTimer();
      }

      // check if the selected card isn't a matched one, or the same card has been clicked twice.
      if (!existsClass(e.target, classStrings.match) && lastSelectedCard !== e.target && !gameIsLocked) {
        e.target.className += (` ${classStrings.show} ${classStrings.open}`);

        if (lastSelectedCard === undefined) {
          // set lastSelectedCard to current card
          lastSelectedCard = e.target
        } else {
          if (!checkIfCardMatch(lastSelectedCard, e.target)) {

            // lock game board, so no interaction is possible while the animation is running
            gameIsLocked = true;

            // listener for animation end
            e.target.addEventListener('animationend', function _listener() {
              e.target.classList.remove(classStrings.show, classStrings.open, classStrings.nomatch);
              lastSelectedCard.classList.remove(classStrings.show, classStrings.open, classStrings.nomatch);

              // reset lastClickedCard
              lastSelectedCard = undefined;
              gameIsLocked = false;

              // remove listener for animation
              e.target.removeEventListener("animationend", _listener, true);
            }, true);


            // if cards do not match, turn them face down.
            e.target.classList.add(classStrings.nomatch);
            lastSelectedCard.classList.add(classStrings.nomatch);

          } else {
            // if card match, add class match to them.
            e.target.classList.add(classStrings.match);
            lastSelectedCard.classList.add(classStrings.match);

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
    // init / reset game state
    resetMoves();
    resetStars();
    stopTimer();
    lastSelectedCard = undefined;
    // duplicate array, combine it and shuffle it.
    const fulldeck = createFullShuffledDeck(cardFaces);

    // clear board
    clearGameBoard();

    // draw gameboard with fulldeck
    drawGameBoard(fulldeck);

    // init timer
    document.querySelector(DOMStrings.time).textContent = '0:00';
  }

  function init() {
    // init game
    initGame();

    // add event listeners
    setUpEventListeners();
  }

  init();
}());