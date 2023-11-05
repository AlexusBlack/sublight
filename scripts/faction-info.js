(function() {
  const el = document.querySelector('.faction-info__box');
  const titleEl = el.querySelector('.modal__title');
  const overviewTab = el.querySelector('.faction-info__overview-tab');
  const historyTab = el.querySelector('.faction-info__history-tab');

  window['showFactionInfo'] = function(factionId) {
    el.classList.remove('modal--hidden');
    // console.log('showPlanetInfo', planetId);
    // console.log(theGalaxy.planets[planetId]);

    const faction = theGalaxy.factions[factionId];
    titleEl.textContent = 'Faction: ' + faction['name'];

    let technology = Object.values(faction.technology).reduce((a, b) => a + b, 0);
    if(technology > 1000000) {
      technology = Math.round(technology).toExponential(2);
    } else {
      technology = Math.round(technology).toLocaleString();
    }

    let tabContentHtml = `${faction.politicalSystem}<br/>
      Ethics: ${faction.ethicalSystem.getEthics().join(', ')}<br/>
      Economy: ${faction.economicalSystem}<br/>
      Territory: ${faction.territory.toLocaleString()} km²<br/>
      Population: ${Math.round(faction.population).toLocaleString()},000<br/>
      Technology: ${technology}<br/>`;
    overviewTab.innerHTML = tabContentHtml;


    tabContentHtml = History.render(faction.history);
    historyTab.innerHTML = tabContentHtml;
  };
})();
