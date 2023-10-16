(function() {
  const els = Array.from(document.querySelectorAll('.tabs'));
  els.forEach(el => {
    const btns = Array.from(el.querySelectorAll('.tabs__button'));
    const items = Array.from(el.querySelectorAll('.tabs__item'));
    btns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        btns.forEach(btn => btn.classList.remove('tabs__button--active'));
        btn.classList.add('tabs__button--active');
        items.forEach(item => item.classList.remove('tabs__item--active'));
        items[idx].classList.add('tabs__item--active');
      });
    });
  });
})();
