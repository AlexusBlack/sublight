(function() {
  const el = document.querySelector('.planet-info__box');
  const titleEl = el.querySelector('.modal__title');

  window['showPlanetInfo'] = function(planetId) {
    el.classList.remove('modal--hidden');
    console.log('showPlanetInfo', planetId);
    console.log(theGalaxy.planets[planetId]);

    const planet = theGalaxy.planets[planetId];
    titleEl.textContent = 'Planet: ' + planet['name'];
  };
})();
