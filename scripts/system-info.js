(function() {
  const el = document.querySelector('.system-info__box');
  const titleEl = el.querySelector('.modal__title');

  window['showSystemInfo'] = function(systemId) {
    el.classList.remove('modal--hidden');
    // console.log('showSystemInfo', systemId);
    // console.log(theGalaxy.systems[systemId]);

    const list = el.querySelector('.system-info .system-info__list');
    list.innerHTML = '';

    const system = theGalaxy.systems[systemId];
    titleEl.textContent = system['primary name'] + ' star system';

    const primaryStar = makeStarEl(system['primary name'], system['primary star type']);
    list.appendChild(primaryStar);

    if(system['close companion exists?'] === 'true') {
      const closeCompanion = makeStarEl(system['close companion name'], system['close companion star type']);
      list.appendChild(closeCompanion);
    }

    if(system['distant companion exists?'] === 'true') {
      const distantCompanion = makeStarEl(system['distant companion name'], system['distant companion star type']);
      list.appendChild(distantCompanion);
    }

    const planets = {};
    system.planets.forEach(planetId => {
      const planet = theGalaxy.planets[planetId];
      const planetEl = makePlanetEl(planet, planetId);
      const parentBodyIdx = parseInt(planet['parent body']);
      if(parentBodyIdx < 0) {
        list.appendChild(planetEl);
      } else {
        planets[planet['parent body']].subPlanets.appendChild(planetEl);
        planets[planet['parent body']].classList.add('system-info__list-item--has-moons');
      }
      planets[planet['in system id']] = planetEl;
    });
  };

  function makeStarEl(name, type) {
    const star = document.createElement('li');
    star.classList.add('system-info__list-item');
    const starLine = document.createElement('article');
    starLine.classList.add('system-info__line');
    starLine.innerHTML = `
      <div class="system-info__field" data-title="Image"><div class="planet-image planet-image--star" data-star-type="${type}"></div></div>
      <div class="system-info__field" data-title="Type">Star</div>
      <div class="system-info__field" data-title="Name">${name}</div>
    `;
    star.appendChild(starLine);
    return star;
  }

  function makePlanetEl(thePlanet, planetId) {
    const planet = document.createElement('li');
    planet.classList.add('system-info__list-item');
    const planetLine = document.createElement('article');
    planetLine.classList.add('system-info__line');
    planetLine.innerHTML = `
      <div class="system-info__field" data-title="Image" title="${getPlanetTypeText(thePlanet['composition'], thePlanet['type'])}">${Planet.getPlanetImage(thePlanet)}</div>
      <div class="system-info__field" data-title="Name">${thePlanet['name']}</div>
    `;
    planet.subPlanets = document.createElement('ul');
    planet.subPlanets.classList.add('system-info__list', 'system-info__sub-list');
    planet.appendChild(planetLine);
    planet.appendChild(planet.subPlanets);
    const expandBtn = document.createElement('button');
    expandBtn.classList.add('system-info__expand-btn');
    planet.appendChild(expandBtn);
    expandBtn.addEventListener('click', () => planet.classList.toggle('system-info__list-item--open'));
    planetLine.addEventListener('click', () => window['showPlanetInfo'](planetId));
    return planet;
  }

  function getPlanetTypeText(composition, type) {
    let typeText = '';
    composition = parseInt(composition);
    type = parseInt(type);
    if(type === 0) {
      type = 'Planet';
    } else if(type === 1) {
      type = 'Dwarf Planet';
    } else {
      type = 'Moon';
    }
    switch(composition) {
      case 0:
        return 'Rocky ' + type;
      case 1:
        return 'Ice ' + type;
      case 2:
        return 'Carbonaceous ' + type;
      case 3:
        return 'Metallic ' + type;
      case 4:
        return 'Ice Giant';
      case 5:
        return 'Gas Giant';
      default:
        return 'Unknown';
    }
  }

})();
