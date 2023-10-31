class Faction {
  static factionCounter = 0;

  constructor(planetId, name, population, territory, ethics, technology, diplomacy) {
    this.id = Faction.factionCounter++;
    theGalaxy.factions[this.id] = this;
    this.isDead = false;
    this.planetId = planetId;
    this.planet = theGalaxy.planets[planetId];
    this.name = name;
    this.population = population;
    this.territory = territory;
    this.ethicalSystem = ethics;
    this.ethics = ethics.ethics;
    this.technology = technology; // { 'formal': 0, 'natural': 0, 'social': 0, 'applied': 0 }
    this.diplomacy = diplomacy;
    this.baseNames = [];
    this.baseNamesAdjectives = [];
    this.partNames = [];
    this.partNamesAdjectives = [];

    this.triggeredEvents = {};
    this.modifiers = [];

    this.history = [];

    this.strength = 0;
    this.scienceStrength = 0;
    this.cultureStrength = 0;
    this.militaryStrength = 0;

    this.populationGroups = this.calculatePopulationGroups();
    this.calculateStrength();

    this.economicalSystem = this.getEconomicalSystem();

    const calcPoliticalSystem = this.getPoliticalSystem();
    this.politicalSystemType = calcPoliticalSystem.type;
    this.politicalSystem = calcPoliticalSystem.system;

  }

  processYear() {
    // TODO: here we generate events for the faction
  }

  grow5Years() {
    this.growTerritory();
    this.growPopulation();
    this.growScience();
  }

  calculate5Years() {
    this.calculatePopulationGroups();
    this.populationGroups = this.calculatePopulationGroups();

    this.calculateStrength();
  }

  kill() {
    this.isDead = true;
    // remove source faction from planet factions
    this.planet.cls.factions = this.planet.cls.factions.filter(f => f.id !== this.id);
  }

  annexFaction(faction, gently=false) { // gently if integration
    // add source population to target
    this.population += faction.population;
    // add source territory to target
    this.territory += faction.territory;
    // add source partNames and partNamesAdjectives
    this.partNames = this.baseNames.concat(faction.partNames);
    this.partNamesAdjectives = this.baseNamesAdjectives.concat(faction.partNamesAdjectives);
    // mark source faction as dead
    faction.kill()
    this.history.push({year: theTime.year, month: theTime.month, category: 'faction_annexed_' + theTime.year,  record: `The nation ${gently ? 'integrated':'annexed'} former nation known as ${faction.name}. Their people will now be working for the benefit of the nation.`});
  }

  integrateFaction(faction) {
    this.annexFaction(faction, true);
  }

  partitionFaction() {
    // split current faction population, territory and names between all threatenedBy factions equally
    let threatenedBy = this.diplomacy.threatenedBy.map(factionId => theGalaxy.factions[factionId]);
    const partsNumber = threatenedBy.length;
    if(partsNumber === 0) return;
    const partPopulation = Math.floor(this.population / partsNumber);
    const partTerritory = Math.floor(this.territory / partsNumber);
    const namesPerPartNumber = Math.floor(this.baseNames.length / partsNumber);
    const adjectivesPerPartNumber = Math.floor(this.baseNamesAdjectives.length / partsNumber);

    threatenedBy.forEach((faction, index) => {
      faction.population += partPopulation;
      faction.territory += partTerritory;
      const namesPart = this.baseNames.splice(index * namesPerPartNumber, namesPerPartNumber);
      const namesAdjectivesPart = this.baseNamesAdjectives.splice(index * adjectivesPerPartNumber, adjectivesPerPartNumber);
      faction.partNames = faction.baseNames.concat(namesPart);
      faction.partNamesAdjectives = faction.baseNamesAdjectives.concat(namesAdjectivesPart);
      faction.history.push({year: theTime.year, month: theTime.month, category: 'faction_partition_paticipated_' + theTime.year,  record: `The nation participated in partition of former nation known as ${this.name}. They became too weak to rule themselves.`});
    });
    this.kill();
  }

  splitFactions(parts, ethics = []) {
    // sum of parts can't be more than 1
    const sumOfParts = parts.reduce((a, b) => a + b, 0);
    if(sumOfParts > 1) return;
    const leftOver = 1 - sumOfParts;
    parts.forEach((part, index) => {
      let newEthics = new Ethics();
      if(ethics[index] === undefined) {
        newEthics.ethics = Object.assign({}, this.ethics);
        newEthics.driftRandom();
      } else {
        newEthics = ethics[index];
      }
      const newFaction = new Faction(this.planetId, 'New Faction', Math.floor(this.population * part), Math.floor(this.territory * part), newEthics, Object.assign({}, this.technology), {'alliance':[], 'rival':[], 'rivaledBy':[], 'war':[], 'protects':[], 'protectedBy':[], 'threatens':[], 'threatenedBy':[]});
      newFaction.baseNames = [this.partNames.length > 1 ? this.partNames.shift() : this.partNames[0]];
      newFaction.baseNamesAdjectives = [this.partNamesAdjectives.length > 1 ? this.partNamesAdjectives.shift() : this.partNamesAdjectives[0]];
      newFaction.partNames = newFaction.baseNames[0];
      newFaction.partNamesAdjectives = newFaction.baseNamesAdjectives[0];
      const newPoliticalSystem = newFaction.getPoliticalSystem();
      newFaction.name = newPoliticalSystem.name;
      newFaction.politicalSystemType = newPoliticalSystem.type;
      newFaction.politicalSystem = newPoliticalSystem.system;
      this.planet.cls.factions.push(newFaction);
    });
    if(leftOver > 0.01) {
      this.population *= leftOver;
      this.territory *= leftOver;
    } else {
      this.kill();
    }
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

  getAnarchyPolicalSystem() {
    if(this.ethics['libertarian'].extreme && this.ethics['communal'].active) {
      return 'Anarchical Comune';
    } else if(this.ethics['spiritualist'].active) {
      return 'Decentralised Missionaries';
    } else if(this.ethics['xenophobe'].active) {
      return 'Decentralised Isoaltionists';
    } else if(this.ethics['militarist'].active) {
      return 'Militant Anarchy';
    }
    return 'Anarchy';
  }

  generateNationName(names) {
    // 50/50 of or ajective
    if(Math.random() > 0.5) {
      const nationBaseName = this.baseNames[Math.floor(Math.random() * this.baseNames.length)];
      return names[Math.floor(Math.random() * names.length)] + ' of ' + nationBaseName;
    } else {
      const nationBaseName = this.baseNamesAdjectives[Math.floor(Math.random() * this.baseNamesAdjectives.length)];
      return nationBaseName + ' ' + names[Math.floor(Math.random() * names.length)];
    }
  }

  getAnarchyNames() {
    if(this.ethics['libertarian'].extreme && this.ethics['communal'].active) {
      return ['Free Comune', 'Peoples Comune'];
    } else if(this.ethics['spiritualist'].active) {
      return ['Free Missionaries', 'Free Church'];
    } else if(this.ethics['xenophobe'].active) {
      return ['Independent Lands', 'Independent People', 'Sovereign Lands', 'Sovereign People'];
    } else if(this.ethics['militarist'].active) {
      return ['Free Warriors', 'Free Army', 'Free Militia'];
    }
    return ['Free Lands', 'Free People', 'Free Territories'];
  }

  getAuthoritarianPoliticalSystem() {
    if(this.ethics['authoritarian'].extreme && this.ethics['communal'].active) {
      return 'Fascism';
    } else if(this.ethics['authoritarian'].extreme && this.ethics['individual'].active) {
      return 'Despotism';
    } else if(this.ethics['authoritarian'].extreme) {
      return 'Totalitarian Regime';
    } else if(this.ethics['communal'].active) {
      if(this.ethics['spiritualist'].active) {
        return 'Theocracy';
      } else if(this.ethics['xenophobe'].active) {
        return 'Nazism';
      } else if(this.ethics['militarist'].active) {
        return 'Fascism';
      }
    } else if(this.ethics['individual'].active) {
      if(this.ethics['spiritualist'].active) {
        return 'Theocratic Order';
      } else if (this.ethics['xenophobe'].active) {
        return 'Isolationist Tyranny';
      } else if(this.ethics['militarist'].active) {
        return 'Expansionist Oligarchy';
      }
    }
    return 'Dictatorship';
  }

  getAuthoritarianNames() {
    if(this.ethics['spiritualist'].active) {
      return ['Holy Empire', 'Holy Order', 'Holy State', 'Divine Empire', 'Divine Order', 'Divine State', 'Divine Mandate'];
    }
    return ['Authority', 'Autarchy', 'Mandate', 'Regime', 'Rule', 'State', 'Dictate'];
  }

  getDemocracyPoliticalSystem() {
    if(this.ethics['individual'].extreme && this.ethics['libertarian'].active) {
      return 'Direct Democracy';
    } else if(this.ethics['individual'].extreme) {
      if(this.ethics['spiritualist'].active) {
        return 'Religious Democracy';
      } else if(this.ethics['xenophobe'].active) {
        return 'Isolationist Democracy';
      } else if(this.ethics['militarist'].active) {
        return 'Democratic Crusaders';
      }
    } else {
      if(this.ethics['spiritualist'].active) {
        return 'Religious Republic';
      } else if(this.ethics['xenophobe'].active) {
        return 'Isolationist Democracy';
      } else if(this.ethics['militarist'].active) {
        return 'Democratic Crusaders';
      }
    }
    return 'Democracy';
  }

  getDemocracyNames() {
    let names = ['Republic', 'Democracy', 'Federation', 'Union', 'Alliance', 'Confederation', 'Commonwealth'];
    if(this.ethics['spiritualist'].active) {
      let spiritualNames = []
      names.forEach(n => {
        spiritualNames.push('Holy ' + n);
        spiritualNames.push('Divine ' + n);
        spiritualNames.push('Pious ' + n);
      });
      return spiritualNames;
    } else if(this.ethics['xenophobe'].active) {
      let xenophobeNames = []
      names.forEach(n => {
        xenophobeNames.push('Independent ' + n);
        xenophobeNames.push('Sovereign ' + n);
        xenophobeNames.push('Protected ' + n);
      });
      return xenophobeNames;
    }
    return names;
  }

  getSocialistPoliticalSystem() {
    if(this.ethics['communal'].extreme && this.ethics['authoritarian'].active) {
      return 'Socialist Soviet Republic';
    } else if(this.ethics['communal'].extreme && this.ethics['libertarian'].active) {
      return 'Socialist Comune';
    } else if(this.ethics['communal'].extreme) {
      if(this.ethics['spiritualist'].active) {
        return 'Religious Comune';
      } else if(this.ethics['xenophobe'].active) {
        return 'Isolationist Socialism';
      } else if(this.ethics['militarist'].active) {
        return 'War Communism';
      } else {
        return 'Socialist State';
      }
    } else if(this.ethics['communal'].active) {
      if(this.ethics['spiritualist'].active) {
        return 'Monastery State';
      } else if(this.ethics['xenophobe'].active) {
        return 'Isolationist Comune';
      } else if(this.ethics['militarist'].active) {
        return 'War Socialism';
      } else {
        return 'Socialist Republic';
      }
    }
    return 'Socialist';
  }

  getSocialistNames() {
    let names = ['Socialist Republic', 'Socialist State',  'Democratic Peoples Republic', 'Peoples Republic', 'Comune', 'Soviet Republic', 'Socialism', 'Collective', 'Union'];
    if(this.ethics['spiritualist'].active) {
      let spiritualNames = []
      names.forEach(n => {
        spiritualNames.push('Monastery ' + n);
        spiritualNames.push('Religious ' + n);
        spiritualNames.push('Pious ' + n);
        spiritualNames.push('Holy ' + n);
      });
      return spiritualNames;
    }
    return names;
  }

  getCouncilPoliticalSystem() {
    if(this.ethics['spiritualist'].active) {
      return 'Clerical Council';
    } else if(this.ethics['xenophobe'].active) {
      return 'Purity Council';
    } else if(this.ethics['militarist'].active) {
      return 'War Council';
    }
    return 'Council';
  }

  getCouncilNames() {
    return [this.getCouncilPoliticalSystem()];
  }

  getPoliticalSystem() {
    let politicalSystemType = '';
    let politicalSystem = '';
    let possibleFactionName = '';

    if(this.ethics['libertarian'].extreme) {
      politicalSystemType = 'anarchy';
      politicalSystem = this.getAnarchyPolicalSystem();
      possibleFactionName = this.generateNationName(this.getAnarchyNames());

    } else if(this.ethics['communal'].extreme) {
      politicalSystemType = 'socialism';
      politicalSystem = this.getSocialistPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getSocialistNames());

    } else if(this.ethics['authoritarian'].active) {
      politicalSystemType = 'dictatorship';
      politicalSystem = this.getAuthoritarianPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getAuthoritarianNames());

    } else if(this.ethics['individual'].extreme) {
      politicalSystemType = 'democracy';
      politicalSystem = this.getDemocracyPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getDemocracyNames());

    } else if(this.ethics['libertarian'].active && this.ethics['individual'].active) {
      politicalSystemType = 'anarchy';
      politicalSystem = this.getAnarchyPolicalSystem();
      possibleFactionName = this.generateNationName(this.getAnarchyNames());

    } else if(this.ethics['authoritarian'].active && this.ethics['individual'].active) {
      politicalSystemType = 'dictatorship';
      politicalSystem = this.getAuthoritarianPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getAuthoritarianNames());

    } else if(this.ethics['authoritarian'].active && this.ethics['communal'].active) {
      politicalSystemType = 'dictatorship';
      politicalSystem = this.getAuthoritarianPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getAuthoritarianNames());

    } else if(this.ethics['libertarian'].active && this.ethics['communal'].active) {
      politicalSystemType = 'socialism';
      politicalSystem = this.getSocialistPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getSocialistNames());

    } else if(this.ethics['libertarian'].active) {
      politicalSystemType = 'anarchy';
      politicalSystem = this.getAnarchyPolicalSystem();
      possibleFactionName = this.generateNationName(this.getAnarchyNames());

    } else if(this.ethics['authoritarian'].active) {
      politicalSystemType = 'dictatorship';
      politicalSystem = this.getAuthoritarianPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getAuthoritarianNames());

    } else if(this.ethics['individual'].active) {
      politicalSystemType = 'democracy';
      politicalSystem = this.getDemocracyPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getDemocracyNames());

    } else if(this.ethics['communal'].active) {
      politicalSystemType = 'socialism';
      politicalSystem = this.getSocialistPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getSocialistNames());

    } else {
      politicalSystemType = 'council';
      politicalSystem = this.getCouncilPoliticalSystem();
      possibleFactionName = this.generateNationName(this.getCouncilNames());
    }

    return {
      type: politicalSystemType,
      system: politicalSystem,
      name: possibleFactionName
    };
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

    const maxPopulationDensity = 2; // 2,000 people per km2
    const currentPopulationDensity = this.population / this.territory;
    //console.log(`Current Population Density: ${currentPopulationDensity}`);
    baseGrowth = theModifiers.apply(this.modifiers, 'faction_population_growth', baseGrowth);

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

    if(this.economicalSystem === 'monopolised') {
      generalStrength *= 0.80;
    } else if(this.economicalSystem === 'planned') {
      generalStrength *= 0.70;
    }

    generalStrength = theModifiers.apply(this.modifiers, 'faction_general_strength', generalStrength);

    // sum up the strength of each group
    this.strength = this.scienceStrength + this.cultureStrength + this.militaryStrength + generalStrength;
  }
  // ---
}
