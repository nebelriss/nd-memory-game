function init() {
  const moves = window.location.href.split('?')[1].split('=')[1];
  document.querySelector('.moves').textContent = moves;
}

init();