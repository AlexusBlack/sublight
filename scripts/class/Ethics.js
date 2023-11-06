class Ethics {
  static ethics_and_opposites = {
    'pacifist': 'militarist',
    'militarist': 'pacifist',
    'xenophile': 'xenophobe',
    'xenophobe': 'xenophile',
    'libertarian': 'authoritarian',
    'authoritarian': 'libertarian',
    'spiritualist': 'materialist',
    'materialist': 'spiritualist',
    'communal': 'individual',
    'individual': 'communal'
  };

  constructor() {

    this.ethics = {};

    for (let key in Ethics.ethics_and_opposites) {
      this.ethics[key] = {active: false, extreme: false};
    }
  }

  getEthics() {
    const ethics = [];
    Object.keys(this.ethics).forEach(key => {
      const ethic = this.ethics[key];
      if (ethic.active && ethic.extreme) {
        ethics.push('extreme ' + key);
      } else if (ethic.active) {
        ethics.push(key);
      }
    });
    return ethics;
  }

  static valuate(faction, ethic, active, extreme, none=1) {
    if(faction.ethics[ethic].active) {
      if(faction.ethics[ethic].extreme) {
        return extreme;
      } else {
        return active;
      }
    } else {
      return none;
    }
  }

  calculateValue() {
    // every active +1, every extreme +2
    let value = 0;
    for (let key in this.ethics) {
      if (this.ethics[key].active) value += 1;
      if (this.ethics[key].extreme) value += 1;
    }
    return value;
  }

  decreaseRandomEthic(exclude) {
    let activeEthics = [];
    for (let key in this.ethics) {
      if (this.ethics[key].active && // can't decrease inactive ethics
          exclude.indexOf(key) === -1 // can't decrease excluded ethics
      ) activeEthics.push(key);
    }
    let ethicToDecrease = activeEthics[Math.floor(Math.random() * activeEthics.length)];
    this.decreaseEthic(ethicToDecrease);
    return ethicToDecrease;
  }

  increaseRandomEthic(exclude) {
    let activeEthics = [];
    for (let key in this.ethics) {
      if (this.ethics[key].active) activeEthics.push(key);
    }
    let increasableEthics = [];
    for (let key in this.ethics) {
      if (!this.ethics[key].extreme && // can't increase extreme ethics
          exclude.indexOf(key) === -1 && // can't increase excluded ethics
          activeEthics.indexOf(Ethics.ethics_and_opposites[key]) === -1 // can't increase opposite ethics of active ethics
      ) increasableEthics.push(key);
    }
    let ethicToIncrease = increasableEthics[Math.floor(Math.random() * increasableEthics.length)];
    this.increaseEthic(ethicToIncrease);
    return ethicToIncrease;
  }

  driftRandom() {
    let increasedEthic = this.increaseRandomEthic([]);
    if(this.calculateValue() < 3) {
      this.increaseRandomEthic([increasedEthic, Ethics.ethics_and_opposites[increasedEthic]]);
    } else if(this.calculateValue() > 3) {
      this.decreaseRandomEthic([increasedEthic, Ethics.ethics_and_opposites[increasedEthic]]);
    }
  }

  increaseEthic(ethic) {
    // check if opposite ethic is active
    const oppositeEthic = Ethics.ethics_and_opposites[ethic];
    if (this.ethics[oppositeEthic].active) {
      this.decreaseEthic(oppositeEthic);
    } else if(this.ethics[ethic].active) {
      // increase extreme
      this.ethics[ethic].extreme = true;
    } else {
      // increase ethic
      this.ethics[ethic].active = true;
    }
  }

  decreaseEthic(ethic) {
    const oppositeEthic = Ethics.ethics_and_opposites[ethic];
    if(this.ethics[ethic].extreme) {
      // decrease extreme
      this.ethics[ethic].extreme = false;
    } else if(this.ethics[ethic].active) {
      // decrease ethic
      this.ethics[ethic].active = false;
    } else if(this.ethics[oppositeEthic].active) {
      // make it extreme
      this.ethics[oppositeEthic].extreme = true;
    } else {
      // make it active
      this.ethics[oppositeEthic].active = true;
    }
  }
  // ---
}

