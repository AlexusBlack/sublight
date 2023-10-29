class Galaxy {
  constructor() {
    this.systems = [];
    this.planets = [];
    this.inhabitedPlanets = [];
  }

  async loadGalaxy() {
    let response = await fetch('/systems.json');
    this.systems = await response.json();
    response = await fetch('/planets.json');
    this.planets = await response.json();
  }

  process1Month() {
    this.inhabitedPlanets.forEach(planet => planet.process1Month());

  }

  process5Years() {
    this.inhabitedPlanets.forEach(planet => planet.process5Years());
  }
}

const theGalaxy = new Galaxy();
(async () => {
  await theGalaxy.loadGalaxy();

  theTime.call1month.push(() => theGalaxy.process1Month());
  theTime.call5years.push(() => theGalaxy.process5Years());

  const theEarth = theGalaxy.planets.filter(p => p.name == 'Earth')[0];
  window.theEarth = theEarth;
  theEarth.cls = new Planet(theEarth.id);
  theGalaxy.inhabitedPlanets.push(theEarth.cls);

  const usaEthics = new Ethics();
  usaEthics.increaseEthic('individual');
  usaEthics.increaseEthic('individual');
  usaEthics.increaseEthic('militarist');
  const usaFaction = new Faction(theEarth.id, 'USA', 220200, 3000000, usaEthics, {
    'formal': 100, 'natural': 100, 'social': 100, 'applied': 100
  }, null);

  theEarth.cls.factions.push(usaFaction);

  const ussrEthics = new Ethics();
  ussrEthics.increaseEthic('authoritarian');
  ussrEthics.increaseEthic('communal');
  ussrEthics.increaseEthic('communal');
  const ussrFaction = new Faction(theEarth.id, 'USSR', 257800, 22400000, ussrEthics, {
    'formal': 80, 'natural': 80, 'social': 80, 'applied': 80
  }, null);
  theEarth.cls.factions.push(ussrFaction);

  const chinaEthics = new Ethics();
  chinaEthics.increaseEthic('communal');
  chinaEthics.increaseEthic('communal');
  chinaEthics.increaseEthic('xenophobe');
  const chinaFaction = new Faction(theEarth.id, 'China', 916400, 9600000, chinaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, null);
  theEarth.cls.factions.push(chinaFaction);

  const indiaEthics = new Ethics();
  indiaEthics.increaseEthic('authoritarian');
  indiaEthics.increaseEthic('communal');
  indiaEthics.increaseEthic('spiritualist');
  const indiaFaction = new Faction(theEarth.id, 'India', 623500, 3287000, indiaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, null);
  theEarth.cls.factions.push(indiaFaction);

  const eecEthics = new Ethics();
  eecEthics.increaseEthic('individual');
  eecEthics.increaseEthic('pacifist');
  eecEthics.increaseEthic('xenophile');
  const eecFaction = new Faction(theEarth.id, 'European Economic Community', 676770, 4233000, eecEthics, {
    'formal': 20, 'natural': 20, 'social': 20, 'applied': 20
  }, null);
  theEarth.cls.factions.push(eecFaction);

  const arabEthics = new Ethics();
  arabEthics.increaseEthic('authoritarian');
  arabEthics.increaseEthic('spiritualist');
  arabEthics.increaseEthic('militarist');
  const arabFaction = new Faction(theEarth.id, 'Arab Nations', 160000, 13000000, arabEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, null);
  theEarth.cls.factions.push(arabFaction);

  const japanEthics = new Ethics();
  japanEthics.increaseEthic('individual');
  japanEthics.increaseEthic('materialist');
  japanEthics.increaseEthic('pacifist');
  const japanFaction = new Faction(theEarth.id, 'Japan', 111600, 377973, japanEthics, {
    'formal': 95, 'natural': 95, 'social': 95, 'applied': 95
  }, null);
  theEarth.cls.factions.push(japanFaction);

  const southAmericaEthics = new Ethics();
  southAmericaEthics.increaseEthic('militarist');
  southAmericaEthics.increaseEthic('authoritarian');
  southAmericaEthics.increaseEthic('communal');
  const southAmericaFaction = new Faction(theEarth.id, 'South America', 202000, 6878000, southAmericaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, null);
  theEarth.cls.factions.push(southAmericaFaction);

  const africaEthics = new Ethics();
  africaEthics.increaseEthic('spiritualist');
  africaEthics.increaseEthic('authoritarian');
  africaEthics.increaseEthic('militarist');
  const africaFaction = new Faction(theEarth.id, 'Africa', 250000, 17000000, africaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, null);
  theEarth.cls.factions.push(africaFaction);

  theEarth.cls.calculatePlanetaryTechLvl();
  theEarth.cls.calculateTechBleedThrough();
  theEarth.cls.recalculateFactionStrengths();
})();
