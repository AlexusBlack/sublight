class Faction {
  constructor(planetId, name, population, territory, ethics, technology, diplomacy) {
    this.planetId = planetId;
    this.planet = theGalaxy.planets[planetId];
    this.name = name;
    this.population = population;
    this.territory = territory;
    this.ethicalSystem = ethics;
    this.ethics = ethics.ethics;
    this.technology = technology; // { 'formal': 0, 'natural': 0, 'social': 0, 'applied': 0 }
    this.diplomacy = diplomacy;

    this.strength = 0;
    this.scienceStrength = 0;
    this.cultureStrength = 0;
    this.militaryStrength = 0;

    this.populationGroups = this.calculatePopulationGroups();
    this.calculatePlanetaryTechAndBleedThrough();
    this.calculateStrength();

    this.economicalSystem = this.getEconomicalSystem();
    this.politicalSystem = this.getPoliticalSystem();
  }

  processYear() {
    // TODO: here we generate events for the faction
  }

  process5Years() {
    this.growTerritory();
    this.growPopulation();
    this.growScience();
    this.calculatePlanetaryTechAndBleedThrough();
    this.calculatePopulationGroups();
    this.populationGroups = this.calculatePopulationGroups();

    this.calculateStrength();
  }

  getEconomicalSystem() {
    if(this.ethics['authoritarian'].active) {
      if(this.ethics['communal'].active) {
        return 'planned';
      } else {
        return 'monopolised';
      }
    }
    return 'market';
  }

  getPoliticalSystem() {
    let politicalSystem = '';
    if(this.ethics['libertarian'].active) {
      if(this.ethics['libertarian'].extreme) {
        politicalSystem = 'anarchy';
      } else {
        politicalSystem = 'democracy';
      }
    } else if(this.ethics['communal'].active) {
      if(this.ethics['communal'].extreme) {
        politicalSystem = 'socialist party state';
      } else {
        politicalSystem = 'socialist republic';
      }
    } else if(this.ethics['individual'].active) {
      if(this.ethics['individual'].extreme) {
        politicalSystem = 'direct-democracy';
      } else {
        politicalSystem = 'republic';
      }
    } else if(this.ethics['authoritarian'].active) {
      if(this.ethics['authoritarian'].extreme) {
        politicalSystem = 'dictatorship';
      } else {
        politicalSystem = 'autocracy';
      }
    }

    if(this.ethics['xenophobe'].extreme) {
      politicalSystem = 'isolationist ' + politicalSystem;
    }
    if(this.ethics['pacifist'].active) {
      politicalSystem = 'peaceful ' + politicalSystem;
    } else if(this.ethics['militarist'].active) {
      politicalSystem = 'militant ' + politicalSystem;
    }
    if(this.ethics['spiritualist'].extreme) {
      politicalSystem = 'theocratic ' + politicalSystem;
    } else if(this.ethics['materialist'].extreme) {
      politicalSystem = 'technocratic ' + politicalSystem;
    }

    return politicalSystem;
  }

  growTerritory() {
    let baseGrowth = 10; // %
    if(this.ethics['individual'].active) baseGrowth += 5; // individual settlements
    if(this.ethics['individual'].extreme) baseGrowth += 5;
    if(this.ethics['militarist'].active) baseGrowth += 5; // military outposts
    if(this.ethics['militarist'].extreme) baseGrowth += 5;
    if(this.ethics['authoritarian'].active) baseGrowth += 5; // land grabs
    if(this.ethics['authoritarian'].extreme) baseGrowth += 5;
    //console.log(`Max Territory Growth: ${baseGrowth}%`);

    // TODO: check if planet still has unsettled territory, if no territory left, do not grow
    const maxTerritory = 3500000; // km2 // FIXME: hardcoded for now
    if(this.territory >= maxTerritory) return;
    this.territory *= 1 + baseGrowth / 100;
    if(this.territory > maxTerritory) this.territory = maxTerritory;
  }

  growPopulation() {
    let baseGrowth = 1;
    if(this.ethics['communal'].active) baseGrowth += 1; // social pressure
    if(this.ethics['communal'].extreme) baseGrowth += 1;
    if(this.ethics['spiritualist'].active) baseGrowth += 1; // religious pressure
    if(this.ethics['spiritualist'].extreme) baseGrowth += 1;
    if(this.ethics['pacifist'].active) baseGrowth += 1; // peace
    if(this.ethics['xenophile'].active) baseGrowth += 1; // migration

    const maxPopulationDensity = 25; // 25,000 people per km2
    const currentPopulationDensity = this.population / this.territory;
    //console.log(`Current Population Density: ${currentPopulationDensity}`);

    // TODO: factor in how suitable the planet is for life

    if(currentPopulationDensity < maxPopulationDensity) {
      this.population *= 1 + baseGrowth / 100;
    }
  }

  growScience() {
    //const technologicalProgress = this.populationGroups.scientists / 1000; // 1 point per 1,000,000 scientists // every 5 years
    const technologicalProgress = this.scienceStrength * Utils.SGMult; // 1 point per 1,000,000 scientists // every 5 years
    let formalShare = 0.25;
    let naturalShare = 0.25;
    let socialShare = 0.25;
    let appliedShare = 0.25;

    if(this.ethics['militarist'].active) {
      formalShare = 0.20;
      naturalShare = 0.20;
      socialShare = 0.20;
      appliedShare = 0.40;
    }

    if(this.ethics['spiritualist'].active || this.ethics['communal'].extreme) {
      formalShare = 0.30;
      naturalShare = 0.30;
      socialShare = 0.10;
      appliedShare = 0.30;
    }

    this.technology['formal'] += technologicalProgress * formalShare;
    this.technology['natural'] += technologicalProgress * naturalShare;
    this.technology['social'] += technologicalProgress * socialShare;
    this.technology['applied'] += technologicalProgress * appliedShare;

  }

  calculatePlanetaryTechAndBleedThrough() {
    Utils.TechnologyTypes.forEach(type => {
      // identifying planetary tech level
      if(this.technology[type] > this.planet.cls.technology[type]) {
        this.planet.cls.technology[type] = this.technology[type];
      }
      // technology bleed through. Faction tech lvl can't be lower than Utils.SBTRate of planetary tech level
      if(this.technology[type] < this.planet.cls.technology[type] * Utils.SBTRate) {
        this.technology[type] = this.planet.cls.technology[type] * Utils.SBTRate;
      }
    });
  }

  getScientistsShare() {
    let science = 0.5; // scientist, researcher, engineer, inventor, etc.

    // POSITIVE
    // -- scientificly oriented
    if(this.ethics['materialist'].active) science += 0.3;
    if(this.ethics['materialist'].extreme) science += 0.2;
    // -- individual ideas valued, competition encouraged
    if(this.ethics['individual'].active) science += 0.1; // enthusiasts & private research
    if(this.ethics['individual'].extreme) science += 0.1;
    // -- hate stimulates invention
    if(this.ethics['xenophobe'].active) science += 0.1; // hate is a great motivator
    if(this.ethics['xenophobe'].extreme) science += 0.1;
    // -- liberty means less regulations and less bureaucracy
    if(this.ethics['libertarian'].active) science += 0.1; // less regulations
    if(this.ethics['libertarian'].extreme) science += 0.1;

    // NEGATIVE
    // -- religious dogma hinders scientific progress
    if(this.ethics['spiritualist'].active) science -= 0.2;
    if(this.ethics['spiritualist'].extreme) science -= 0.1;
    // -- authoritarianism means more regulations and more bureaucracy
    if(this.ethics['authoritarian'].active) science -= 0.1; // more regulations
    if(this.ethics['authoritarian'].extreme) science -= 0.1;
    // -- communalism means less individualism and less competition
    if(this.ethics['communal'].active) science -= 0.1; // less individualism
    if(this.ethics['communal'].extreme) science -= 0.1;

    if(science < 0) science = 0;
    return science / 100;
  }

  getCultureShare() {
    let culture = 0.5; // artist, musician, writer, etc.
    // POSITIVE
    // -- spiritualism means more art
    if(this.ethics['spiritualist'].active) culture += 0.1;
    if(this.ethics['spiritualist'].extreme) culture += 0.1;
    // -- libertarian means more types of art and music are accepted
    if(this.ethics['libertarian'].active) culture += 0.1; // less regulations
    if(this.ethics['libertarian'].extreme) culture += 0.1;
    // -- communalism allows more time for collaboration and self expressions
    if(this.ethics['communal'].active) culture += 0.1; // less individualism
    if(this.ethics['communal'].extreme) culture += 0.1;
    // -- xenophile means more types of art and music are accepted
    if(this.ethics['xenophile'].active) culture += 0.1; // less regulations
    if(this.ethics['xenophile'].extreme) culture += 0.1;

    // NEGATIVE
    // -- materialism means less art
    if(this.ethics['materialist'].active) culture -= 0.1;
    if(this.ethics['materialist'].extreme) culture -= 0.1;
    // -- authoritarianism means more regulations and more bureaucracy
    if(this.ethics['authoritarian'].active) culture -= 0.1; // more regulations
    if(this.ethics['authoritarian'].extreme) culture -= 0.1;
    // -- xenophobe means less types of art and music are accepted
    if(this.ethics['xenophobe'].active) culture -= 0.1;
    if(this.ethics['xenophobe'].extreme) culture -= 0.1;

    if(culture < 0) culture = 0;
    return culture / 100;
  }

  getMilitaryShare() {
    let military = 0.5; // soldier, officer, general, etc.
    // POSITIVE
    // -- millitarism means more soldiers
    if(this.ethics['militarist'].active) military += 1.0;
    if(this.ethics['militarist'].extreme) military += 2.0;
    // -- autoritarianism means more soldiers and paramilitary
    if(this.ethics['authoritarian'].active) military += 0.5;
    if(this.ethics['authoritarian'].extreme) military += 1.0;
    // -- xenophobe means more soldiers and militia
    if(this.ethics['xenophobe'].active) military += 0.5;
    if(this.ethics['xenophobe'].extreme) military += 1.0;
    // -- communal means easier to recruit soldiers
    if(this.ethics['communal'].active) military += 0.5;
    if(this.ethics['communal'].extreme) military += 1.0;
    // -- spiritualism means more zealots
    if(this.ethics['spiritualist'].active) military += 0.5;
    if(this.ethics['spiritualist'].extreme) military += 1.0;

    // NEGATIVE
    // -- pacifism means less soldiers
    if(this.ethics['pacifist'].active) military -= 0.2;
    if(this.ethics['pacifist'].extreme) military -= 0.2;
    // -- libertarianism means less people become soldiers
    if(this.ethics['libertarian'].active) military -= 0.2;
    if(this.ethics['libertarian'].extreme) military -= 0.2;
    // -- xenophile means less people become soldiers
    if(this.ethics['xenophile'].active) military -= 0.1;
    if(this.ethics['xenophile'].extreme) military -= 0.1;

    if(military < 0) military = 0;
    return military / 100;
  }

  calculatePopulationGroups() {
    return {
      scientists: this.population * this.getScientistsShare(),
      culture: this.population * this.getCultureShare(),
      military: this.population * this.getMilitaryShare(),
      general: this.population * (1 - this.getScientistsShare() - this.getCultureShare() - this.getMilitaryShare())
    };
  }

  calculateGroupStrength(population, f, n, s, a, fe, ne, se, ae) {
    return population * (1 +
      Utils.SSMult * (Utils.getFlatScienceMult(this.technology['formal'], f) + Utils.getScientificEpochMult(this.technology['formal'], fe)) +
      Utils.SSMult * (Utils.getFlatScienceMult(this.technology['natural'], n) + Utils.getScientificEpochMult(this.technology['natural'], ne)) +
      Utils.SSMult * (Utils.getFlatScienceMult(this.technology['social'], s) + Utils.getScientificEpochMult(this.technology['social'], se)) +
      Utils.SSMult * (Utils.getFlatScienceMult(this.technology['applied'], a) + Utils.getScientificEpochMult(this.technology['applied'], ae))
    );
  }

  calculateStrength() {
    this.scienceStrength = this.calculateGroupStrength(this.populationGroups['scientists'],
    //formal, natural, social, applied
      0.4,  0.2,  0.1,   0.02, // direct
      2,    2,    0.1,   0.02  // epoch
    );
    this.cultureStrength = this.calculateGroupStrength(this.populationGroups['culture'],
    //formal, natural, social, applied
      0.02,  0.04,  0.04,   0.06, // direct
      0.2,   0.4,   0.4,    0.6   // epoch
    );
    this.militaryStrength = this.calculateGroupStrength(this.populationGroups['military'],
    //formal, natural, social, applied
      1,    1,   0.02,   1.2,  // direct
      2,    2,   0.2,    2    // epoch
    );
    let generalStrength = this.calculateGroupStrength(this.populationGroups['general'],
    //formal, natural, social, applied
      0.5,   0.5,   0.5,    0.5,  // direct
      0.5,   0.5,   0.5,    0.5   // epoch
    );

    // sum up the strength of each group
    this.strength = this.scienceStrength + this.cultureStrength + this.militaryStrength + generalStrength;
  }
  // ---
}
