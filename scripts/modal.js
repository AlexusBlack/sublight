(function() {
  const els = Array.from(document.querySelectorAll('.modal__box'));
  els.forEach(el => {
    el.querySelector('.modal__close-btn').addEventListener('click', () => el.classList.add('modal--hidden'));
  });
})();
