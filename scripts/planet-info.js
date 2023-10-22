(function() {
  const el = document.querySelector('.planet-info__box');
  const titleEl = el.querySelector('.modal__title');
  const planetImage = el.querySelector('.planet-info__image');
  const geoAttributes = el.querySelector('.planet-info__geo-attributes');

  const skipGeoKeys = ['id', 'in system id', 'parent star(s)', 'orbit index', 'parent body', 'moon index', 'belt length', 'visual style'];

  window['showPlanetInfo'] = function(planetId) {
    el.classList.remove('modal--hidden');
    console.log('showPlanetInfo', planetId);
    console.log(theGalaxy.planets[planetId]);

    const planet = theGalaxy.planets[planetId];
    titleEl.textContent = 'Planet: ' + planet['name'];

    const planetImageHtml = Planet.getPlanetImage(planet);
    planetImage.innerHTML = planetImageHtml;

    let geoAttributesHtml = '';
    let geoKeys = Object.keys(planet);
    geoKeys.forEach(key => {
      if(skipGeoKeys.indexOf(key) !== -1) return;
      geoAttributesHtml += `
        <li class="planet-info__field" data-name="${key}">${planet[key]}</li>
      `;
    });
    geoAttributes.innerHTML = geoAttributesHtml;
  };
})();
