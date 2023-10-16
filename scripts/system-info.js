(function() {
  const el = document.querySelector('.system-info__box');
  const titleEl = el.querySelector('.modal__title');

  window['showSystemInfo'] = function(systemId) {
    el.classList.remove('modal--hidden');
    console.log('showSystemInfo', systemId);
    console.log(theGalaxy.systems[systemId]);

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
      <div class="system-info__field" data-title="Image" title="${getPlanetTypeText(thePlanet['composition'], thePlanet['type'])}">${getPlanetImage(thePlanet)}</div>
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
    planet.addEventListener('click', () => window['showPlanetInfo'](planetId));
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

  var compcolors = [
    ["img/planeticons/rockyPlanet.png","img/planeticons/rockyPlanet2.png","img/planeticons/rockyPlanet3.png","img/planeticons/rockyPlanet4.png","img/planeticons/rockyPlanet5.png","img/planeticons/rockyPlanet6.png",],
    ["img/planeticons/icyPlanet.png","img/planeticons/icyPlanet2.png","img/planeticons/icyPlanet3.png","img/planeticons/icyPlanet4.png","img/planeticons/icyPlanet5.png","img/planeticons/icyPlanet6.png",],
    ["img/planeticons/carbonaceousPlanet.png","img/planeticons/carbonaceousPlanet2.png","img/planeticons/carbonaceousPlanet3.png","img/planeticons/carbonaceousPlanet4.png","img/planeticons/carbonaceousPlanet5.png","img/planeticons/carbonaceousPlanet6.png",],
    ["img/planeticons/metallicPlanet.png","img/planeticons/metallicPlanet2.png","img/planeticons/metallicPlanet3.png","img/planeticons/metallicPlanet4.png","img/planeticons/metallicPlanet5.png","img/planeticons/metallicPlanet6.png",],
    ["img/planeticons/iceGiant.png","img/planeticons/iceGiant2.png","img/planeticons/iceGiant3.png","img/planeticons/iceGiant4.png","img/planeticons/iceGiant5.png","img/planeticons/iceGiant6.png",],
    ["img/planeticons/gasGiant.png","img/planeticons/gasGiant2.png","img/planeticons/gasGiant3.png","img/planeticons/gasGiant4.png","img/planeticons/gasGiant5.png","img/planeticons/gasGiant6.png",]
];

  var surfaceliquidcolors = [
    "rgb(0,0,0)",
    "img/planeticons/waterOverlay",
    "img/planeticons/ammoniaOverlay",
    "img/planeticons/methaneOverlay",
    "img/planeticons/nitrogenOverlay"
  ];

  var liquidcoveragefilenames = {
      0.02: "1.png",
      0.05: "1.png",
      0.1: "1.png",
      0.3: "2.png",
      0.7: "2.png",
      0.8: "2.png",
      0.9: "2.png",
      0.97: "3.png",
      1: "3.png",
      '-1': "3.png"
  };

  function getPlanetImage(planet) {
    const composition = parseInt(planet['composition']);
    const displayseed = parseInt(planet['visual style']);
    const liquid = parseInt(planet['surface liquid']);
    const lcoverage = parseFloat(planet['liquid coverage']);
    const temperature = parseInt(planet['base temperature']);
    const life = parseInt(planet['life']);

    const overlays = [];

    if(planet['primary atmospheric gas'] === '2' && parseInt(planet['atmosphere thickness']) >= 3) {
      addOverlay('img/ATM_carbo.png', '100%');
    } else if(planet['primary atmospheric gas'] === '1' && parseInt(planet['atmosphere thickness']) >= 3) {
      addOverlay('img/ATM_nitro.png', '100%');
    }

    addOverlay(compcolors[composition][displayseed]);

    if(composition < 4) {
      if(planet['geologically active'] === 'true') {
        addOverlay('img/planeticons/geoActiveOverlay2.png');
      } else {
        addOverlay('img/planeticons/geoInactiveOverlay.png');
      }
    }

    if(life > 1) {
      if(liquid === 1) {
        addOverlay('img/planeticons/lifeOverlayWater.png');
      } else if(liquid === 2) {
        addOverlay('img/planeticons/lifeOverlayAmmonia.png');
      } else if(liquid === 3) {
        addOverlay('img/planeticons/lifeOverlayMethanum.png');
      }
    }

    addOverlay(surfaceliquidcolors[liquid]+liquidcoveragefilenames[lcoverage]);
    addOverlay('img/planeticons/shade2.png');

    if(composition < 4 && temperature >= 17) {
      addOverlay('img/planeticons/torridPlanetOverlay.png');
    }

    if(planet.rings === '1') {
      addOverlay('img/planeticons/rings.png', '100%');
    }

    // -- Render all
    const size = parseFloat(planet['size']);
    let type = 'regular';
    if(size > 99) type = 'giant';
    if(size < 0.1) type = 'dwarf';
    if(size < 0.01) type = 'tiny';

    let html = `<div class="planet-image planet-image--scale-${type}">`;
    for(let i = 0; i < overlays.length; i++) {
      html += `<div class="planet-image__overlay" style="background-image: url('${overlays[i].url}');background-size: ${overlays[i].size};"></div>`;
    }
    html += '</div>';
    return html;

    function addOverlay(image, size = '70%') {
      overlays.push({url: image, size: size});
    }
  }
})();
