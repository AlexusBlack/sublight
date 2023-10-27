class Modifiers {
  constructor() {
    this.modifierTypes = {};
  }

  add(target, key) {
    let currentYear = theTime.year;
    let currentMonth = theTime.month;
    let modifierDurationMonths = this.modifierTypes[key].durationMonths;
    let modifierDurationYears = Math.floor(modifierDurationMonths / 12);
    modifierDurationMonths = modifierDurationMonths % 12;

    let endYear = currentYear + modifierDurationYears;
    let endMonth = currentMonth + modifierDurationMonths;
    if(endMonth >= 12) {
      endMonth -= 12;
      endYear++;
    }
    console.log(`<${target.name}> Adding modifier ${key} until ${endYear}-${endMonth}`);
    target.modifiers.push({key: key, endYear: endYear, endMonth: endMonth});
  }

  apply(modifiers, variableKey, variableValue) {
    modifiers.forEach(modifier => {
      const modifierType = this.modifierTypes[modifier.key];
      modifierType.effects.forEach(effect => {
        if(effect.type === variableKey + '_add') {
          variableValue += effect.value;
        } else if(effect.type === variableKey + '_mult') {
          variableValue *= effect.value;
        }
      });
    });
    return variableValue;
  }

  clean(target) {
    // remove expired modifiers
    target.modifiers = target.modifiers.filter(modifier => {
      if(modifier.endYear < theTime.year) {
        console.log(`<${target.name}> Modifier ${modifier.key} expired`);
        return false;
      }
      if(modifier.endYear === theTime.year && modifier.endMonth < theTime.month) {
        console.log(`<${target.name}> Modifier ${modifier.key} expired`);
        return false;
      }
      return true;
    });
  }
}
const theModifiers = new Modifiers();

class Modifier {
  constructor(key) {
    this.name = key;
    this.description = key;
    this.key = key;
    this.durationMonths = 0;
    this.effects = [];

    theModifiers.modifierTypes[key] = this;
  }
}

