class Galaxy {
  constructor() {
    this.systems = [];
    this.planets = [];

    this.loadGalaxy();
  }

  async loadGalaxy() {
    let response = await fetch('/systems.json');
    this.systems = await response.json();
    response = await fetch('/planets.json');
    this.planets = await response.json();
  }
}

const theGalaxy = new Galaxy();

const usaEthics = new Ethics();
usaEthics.increaseEthic('materialist');
usaEthics.increaseEthic('militarist');
usaEthics.increaseEthic('libertarian');
usaEthics.increaseEthic('individual');
usaEthics.increaseEthic('individual');
const usaFaction = new Faction(0, 'USA', 220200, 350000, usaEthics, {
  'formal': 5, 'natural': 5, 'social': 5, 'applied': 5
}, null);
theTime.call5years.push(() => usaFaction.progress5Years());

const ussrEthics = new Ethics();
ussrEthics.increaseEthic('materialist');
ussrEthics.increaseEthic('militarist');
ussrEthics.increaseEthic('authoritarian');
ussrEthics.increaseEthic('communal');
ussrEthics.increaseEthic('communal');
const ussrFaction = new Faction(1, 'USSR', 257800, 22400000, ussrEthics, {
  'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
}, null);
theTime.call5years.push(() => ussrFaction.progress5Years());
