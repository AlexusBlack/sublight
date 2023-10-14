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
