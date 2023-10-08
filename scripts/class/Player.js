class Player extends Ship {
  constructor(options) {
    super(options);
    this.node.classList.add('starmap__spaceship--player');
  }

  async flyToSystem(systemName) {
    const targetSystem = document.querySelector(`.starmap__star[data-name="${systemName}"]`);
    const targetPos = Utils.getMapPosition(targetSystem);
    const currentPos = Utils.getMapPosition(this.node);
    let distance = Utils.getMapDistance(currentPos, targetPos);

    super.flyToSystem(systemName);
    await theTime.progressYears(distance);

    while(this.systemName !== systemName) {
      await theTime.progressMonth();
    }
  }
}

const playerShip = new Player({
  x: 0,
  y: 0,
  name: 'Orion IV',
  inSystem: true,
  system: 'Sol',
  population: 0.01,
});
