class Ship {
  constructor(options) {
    this.node = document.createElement('div');

    this.setCoordinates(options.x, options.y);
    this.name = options.name;
    this.inSystem = options.inSystem;
    this.systemName = options.system;
    this.system = this.inSystem ? document.querySelector(`.starmap__star[data-name="${this.systemName}"]`) : null;
    this.population = options.population;

    this.node.classList.add('starmap__object', 'starmap__spaceship');
    this.node.dataset.name = this.name;
    this.node.dataset.type = 'spaceship';
    this.node.dataset.population = this.population;
    this.node.innerHTML = `<div class="starmap__spaceship-body"></div><label class="starmap__spaceship-name">${this.name}</label>`;

    if(!this.inSystem) {
      document.querySelector('.starmap__body').appendChild(this.node);
    } else {
      this.node.classList.add('starmap__spaceship--in-system');
      this.system.querySelector('.starmap__spaceships').appendChild(this.node);
    }
  }

  setCoordinates(x, y) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.node.dataset.x = x;
    this.node.dataset.y = y;
    this.node.style.setProperty('--x', x);
    this.node.style.setProperty('--y', y);
  }

  leaveSystem() {
    this.node.classList.remove('starmap__spaceship--in-system');
    // apply system coordinates to ship
    this.setCoordinates(this.system.dataset.x, this.system.dataset.y);
    document.querySelector('.starmap__body').appendChild(this.node);
  }

  enterSystem(systemName) {
    this.node.classList.add('starmap__spaceship--in-system');
    this.systemName = systemName;
    this.system = document.querySelector(`.starmap__star[data-name="${systemName}"]`);
    this.system.querySelector('.starmap__spaceships').appendChild(this.node);
  }

  async flyToSystem(systemName) {
    if(this.inSystem) this.leaveSystem();
    const targetSystem = document.querySelector(`.starmap__star[data-name="${systemName}"]`);
    const targetPos = Utils.getMapPosition(targetSystem);
    const currentPos = Utils.getMapPosition(this.node);
    let distance = Utils.getMapDistance(currentPos, targetPos);
    const forwardsVector = Utils.getForwardsVector(currentPos, targetPos);
    while(distance > 0.1) {
      this.setCoordinates(this.x + forwardsVector.x / 12, this.y + forwardsVector.y / 12);
      await theTime.awaitMonth();
      distance = Utils.getMapDistance(Utils.getMapPosition(this.node), targetPos);
    }
    this.enterSystem(systemName);
  }
}

const otherShip = new Ship({
  x: 0,
  y: 0,
  name: 'Korolev II',
  inSystem: true,
  system: 'Sol',
  population: 0.01,
});
