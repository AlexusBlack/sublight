class Utils {
  static TechnologyTypes = ['formal', 'natural', 'social', 'applied'];
  static SSMult = 5; // science strength multiplier
  static SBTRate = 1/10; // science bleedthrough
  static SGMult = 1/100000; // science growth multiplier
  static wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getMonthName(month) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ][month];
  }

  static getMapPosition(starmapObject) {
    if(starmapObject.classList.contains('starmap__spaceship--in-system')) {
      const system = starmapObject.closest('.starmap__star');
      return {
        x: parseFloat(system.dataset.x),
        y: parseFloat(system.dataset.y),
      };
    }
    return {
      x: parseFloat(starmapObject.dataset.x),
      y: parseFloat(starmapObject.dataset.y),
    };
  }

  static getMapDistance(object1, object2) {
    return Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2)) * CONF_DISTANCE_MULT;
  }

  static getForwardsVector(object1, object2) {
    const distance = Utils.getMapDistance(object1, object2);
    return {
      x: (object2.x - object1.x) / distance,
      y: (object2.y - object1.y) / distance,
    };
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static getFlatScienceMult(lvl, perLvl) {
    return lvl * perLvl;
  }

  static getScientificEpochMult(lvl, perEpoch) {
    const epochs = Math.floor(lvl / 10);
    return epochs * perEpoch;
  }
}
