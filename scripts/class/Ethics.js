class Ethics {
  constructor() {
    this.ethics_and_opposites = {
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

    this.ethics = {};

    for (let key in this.ethics_and_opposites) {
      this.ethics[key] = {active: false, extreme: false};
    }
  }

  increaseEthic(ethic) {
    // check if opposite ethic is active
    const oppositeEthic = this.ethics_and_opposites[ethic];
    if (this.ethics[oppositeEthic].active) {
      decreaseEthic(oppositeEthic);
    } else if(this.ethics[ethic].active) {
      // increase extreme
      this.ethics[ethic].extreme = true;
    } else {
      // increase ethic
      this.ethics[ethic].active = true;
    }
  }

  decreaseEthic(ethic) {
    const oppositeEthic = this.ethics_and_opposites[ethic];
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

