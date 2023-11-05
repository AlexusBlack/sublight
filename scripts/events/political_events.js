/* =========== POLITICAL CYCLE =========== */
const politicalCycleEvent = new Event('political_cycle', 'faction');
politicalCycleEvent.mean_months_to_happen = 6;
const politicalCycleModifierKeys = ['political_cycle_unity', 'political_cycle_consensus', 'political_cycle_stagnation', 'political_cycle_conflict', 'political_cycle_crisis'];
politicalCycleEvent.trigger_func = function(faction) {
  // check if already have an economic cycle modifier
  const modifiers = faction.modifiers.filter(modifier => politicalCycleModifierKeys.includes(modifier.key));
  if (modifiers.length > 0) return false;
  return true;
};

politicalCycleEvent_descriptions = {
    'political_cycle_unity': 'The nation is experiencing a period of unity and solidarity. Political factions are working together to achieve common goals.',
    'political_cycle_consensus': 'Despite some differences, most political factions are in consensus about the direction of the nation.',
    'political_cycle_stagnation': 'The nation is experiencing a period of stagnation. It feels like nothing is happening.',
    'political_cycle_conflict': 'The nation is experiencing a period of political conflict. Political factions are fighting each other to achieve their goals.',
    'political_cycle_crisis': 'The nation is experiencing a political crisis. The government is in danger of collapsing.'
};

politicalCycleEvent.actions_func = function(faction) {
  // ballance spending most time in stagnation
  let politicalCycleChances = {
    'political_cycle_unity': 0.1,
    'political_cycle_consensus': 0.2,
    'political_cycle_stagnation': 0.4,
    'political_cycle_conflict': 0.2,
    'political_cycle_crisis': 0.1
  };

  if(faction.ethics['authoritarian'].active || faction.ethics['spiritualist'].active) {
    // Autoritarian and religious regimes never have absolute unity, as at least some people are suppressed
    // They have higher chance of political conflict and crisis. Such regime has higher chance of self destruction.
    politicalCycleChances = {
      'political_cycle_unity': 0.0,
      'political_cycle_consensus': 0.1,
      'political_cycle_stagnation': 0.3,
      'political_cycle_conflict': 0.4,
      'political_cycle_crisis': 0.2
    };
  } else if(faction.ethics['communal'].active) {
    // Communal regimes have higher chance of stagnation and conflict, but lower chance of unity and crisis. This makes regime more stable.
    politicalCycleChances = {
      'political_cycle_unity': 0.05,
      'political_cycle_consensus': 0.2,
      'political_cycle_stagnation': 0.5,
      'political_cycle_conflict': 0.3,
      'political_cycle_crisis': 0.05
    };
  } else if(faction.ethics['individual'].active) {
    // Democracies have higher chance of unity and consensus, but lower chance of stagnation and crisis. This makes regime more stable.
    politicalCycleChances = {
      'political_cycle_unity': 0.2,
      'political_cycle_consensus': 0.35,
      'political_cycle_stagnation': 0.3,
      'political_cycle_conflict': 0.1,
      'political_cycle_crisis': 0.05
    };
  }

  if(theModifiers.has(faction, 'economic_cycle_recession')) {
    // If there is a recession, there is a higher chance of political crisis
    politicalCycleChances['political_cycle_conflict'] += 0.1;
    politicalCycleChances['political_cycle_crisis'] += 0.1;
  } else if(theModifiers.has(faction, 'economic_cycle_depression')) {
    // If there is a depression, there is a higher chance of political crisis
    politicalCycleChances['political_cycle_conflict'] += 0.2;
    politicalCycleChances['political_cycle_crisis'] += 0.2;
  } else if(theModifiers.has(faction, 'economic_cycle_boom')) {
    // If there is a boom, there is a higher chance of political unity and lower chance of conflict & crisis
    politicalCycleChances['political_cycle_unity'] += 0.2;
    politicalCycleChances['political_cycle_conflict'] = Math.max(politicalCycleChances['political_cycle_conflict'] - 0.1, 0);
    politicalCycleChances['political_cycle_crisis'] = Math.max(politicalCycleChances['political_cycle_crisis'] - 0.1, 0);
  }

  if(theModifiers.has(faction, 'culture_cycle_decline')) {
    // If there is a cultural decline, there is a higher chance of political crisis
    politicalCycleChances['political_cycle_conflict'] += 0.1;
    politicalCycleChances['political_cycle_crisis'] += 0.1;
  } else if(theModifiers.has(faction, 'culture_cycle_depression')) {
    // If there is a cultural depression, there is a higher chance of political crisis
    politicalCycleChances['political_cycle_conflict'] += 0.2;
    politicalCycleChances['political_cycle_crisis'] += 0.2;
  } else if(theModifiers.has(faction, 'culture_cycle_boom')) {
    // If there is a cultural boom, there is a higher chance of political unity and lower chance of conflict & crisis
    politicalCycleChances['political_cycle_unity'] += 0.2;
    politicalCycleChances['political_cycle_conflict'] = Math.max(politicalCycleChances['political_cycle_conflict'] - 0.1, 0);
    politicalCycleChances['political_cycle_crisis'] = Math.max(politicalCycleChances['political_cycle_crisis'] - 0.1, 0);
  }

  if(theModifiers.has(faction.planet.cls, 'relativistic_projectile_hit')) {
    politicalCycleChances = {
      'political_cycle_unity': 0.1,
      'political_cycle_consensus': 0.1,
      'political_cycle_stagnation': 0,
      'political_cycle_conflict': 0.3,
      'political_cycle_crisis': 0.5
    };
  }

  const modifier = weightedRandom(politicalCycleModifierKeys, Object.values(politicalCycleChances)).item;
  //const modifier = weightedRand2(politicalCycleChances);
  History.add([faction],  politicalCycleEvent_descriptions[modifier], 'political_cycle');
  theModifiers.add(faction, modifier);
};


/* =========== POLITICAL CONFLICT =========== */
const politicalConflictEvent = new Event('political_conflict', 'faction');
politicalConflictEvent.mean_months_to_happen = 3;
politicalConflictEvent.trigger_func = function(faction) {
  return theModifiers.has(faction, 'political_cycle_conflict') && !theModifiers.hasAny(faction, ['political_recent_reform', 'political_recent_collapse', 'political_recent_revolt', 'political_crisis_averted', 'political_recent_collapse']);
};

politicalConflictEvent.actions_func = function(faction) {
  const situations = {
    'political_reform': 0.13,
    'small_revolt': 0.02,
    'nothing_happens': 0.85, // dumb luck
  };
  //const situation = weightedRandom(Object.keys(situations), Object.values(situations)).item;
  const situation = weightedRand2(situations);
  if(situation === 'nothing_happens') {
    theModifiers.add(faction, 'political_crisis_averted');
    return;
  }
  // calculate reform/revolt ethics
  const possibleEthicChange = {
    'authoritarian': 0.3,
    'libertarian': 0.2,
    'communal': 0.3,
    'individual': 0.2,
  };
  const ethicChange = weightedRandom(Object.keys(possibleEthicChange), Object.values(possibleEthicChange)).item;
  const oppositeEthicChange = Ethics.ethics_and_opposites[ethicChange];

  const newEthicalSystem = new Ethics();
  newEthicalSystem.ethics = Object.assign({}, faction.ethics);
  newEthicalSystem.increaseEthic(ethicChange);

  const ethicVal = newEthicalSystem.calculateValue();
  let otherEthicChange = '';
  if(ethicVal > 3) {
    otherEthicChange = 'less ' + newEthicalSystem.decreaseRandomEthic([ethicChange, oppositeEthicChange]);
  } else if(ethicVal < 3) {
    otherEthicChange = 'more ' + newEthicalSystem.increaseRandomEthic([ethicChange, oppositeEthicChange]);
  }

  if(situation === 'small_revolt') {
    //console.log(`Small revolt in <${faction.name}>`, newEthicalSystem);
    History.add([faction],  `Political instability leads to a small revolt with demand for nation to become more ${ethicChange}.`, 'political_conflict_revolt_' + theTime.year);
    theModifiers.add(faction, 'political_recent_revolt');
    faction.splitFactions([0.1*getRandomArbitrary(0.5, 1.5)], [newEthicalSystem]);
  } else {
    faction.changeEthicalSystem(newEthicalSystem);
    History.add([faction], `Political instability leads to a political reform that makes nation more ${ethicChange}.` + (otherEthicChange !== '' ? ` As a side effect the nation became ${otherEthicChange}.` : ''), 'political_conflict_reform_' + theTime.year);
  }
};

/* =========== POLITICAL CRISIS =========== */
const politicalCrisisEvent = new Event('political_crisis', 'faction');
politicalCrisisEvent.mean_months_to_happen = 3;
politicalCrisisEvent.trigger_func = function(faction) {
  return theModifiers.has(faction, 'political_cycle_crisis') && !theModifiers.hasAny(faction, ['political_recent_reform', 'political_recent_collapse', 'political_recent_revolt', 'political_crisis_averted', 'political_recent_collapse']);
};

politicalCrisisEvent.actions_func = function(faction) {
  let situations = {
    'nothing_happens': 0.80, // dumb luck
    'political_coup': 0.1,
    'revolution': 0.08,
    'collapse': 0.02
  };
  let total_factions_strength = faction.planet.cls.factions.reduce((acc, f) => acc + f.strength, 0);
  // If planet has only one faction, there is a higher chance of collapse due to small number of options
  // If the faction got too strong it's volatility increasing as well as people want to challenge authority
  if(faction.planet.cls.factions.length < 3 || faction.strength > total_factions_strength * 0.6) {
    situations = {
      'nothing_happens': 0.50, // dumb luck
      'political_coup': 0.10,
      'revolution': 0.20,
      'collapse': 0.20
    };
  }
  //const situation = weightedRandom(Object.keys(situations), Object.values(situations)).item;
  const situation = weightedRand2(situations);
  if(situation === 'nothing_happens') {
    theModifiers.add(faction, 'political_crisis_averted');
    return;
  }

  const newEthicalSystem = new Ethics();
  let options = {'council': 1};
  if(faction.politicalSystemType === 'anarchy') {
    options = {
      'democracy': 0.25,
      'socialism': 0.25,
      'dictatorship': 0.5
    };
  } else if(faction.politicalSystemType === 'democracy') {
    options = {
      'socialism': 0.60,
      'dictatorship': 0.40
    };
  } else if(faction.politicalSystemType === 'socialism') {
    options = {
      'democracy': 0.30,
      'dictatorship': 0.70
    };
  } else if(faction.politicalSystemType === 'dictatorship') {
    options = {
      'democracy': 0.25,
      'anarchy': 0.75,
    };
  }
  let newPoliticalSystemType = weightedRandom(Object.keys(options), Object.values(options)).item;
  if(newPoliticalSystemType === 'democracy') {
    newEthicalSystem.increaseEthic('individual');
    newEthicalSystem.increaseEthic('pacifist');
    newEthicalSystem.increaseEthic('xenophile');
  } else if(newPoliticalSystemType === 'socialism') {
    newEthicalSystem.increaseEthic('communal');
    newEthicalSystem.increaseEthic('communal');
    newEthicalSystem.increaseEthic('authoritarian');
  } else if(newPoliticalSystemType === 'dictatorship') {
    newEthicalSystem.increaseEthic('authoritarian');
    newEthicalSystem.increaseEthic('authoritarian');
    newEthicalSystem.increaseEthic('individual');
  } else if(newPoliticalSystemType === 'anarchy') {
    newEthicalSystem.increaseEthic('individual');
    newEthicalSystem.increaseEthic('individual');
    newEthicalSystem.increaseEthic('pacifist');
  }

  if(situation === 'political_coup') {
    faction.changeEthicalSystem(newEthicalSystem);
    theModifiers.add(faction, 'political_recent_coup');

  } else if(situation === 'revolution') {
    theModifiers.add(faction, 'political_recent_revolt');
    const revoltedFactionId = faction.splitFactions([0.5*getRandomArbitrary(0.5, 1.5)], [newEthicalSystem])[0];
    const revoltedFaction = theGalaxy.factions[revoltedFactionId];
    History.add([faction, faction.planet.cls],  `Political instability leads to a revolution in ${faction.name} with demand for the nation to become ${newPoliticalSystemType}. Revolutionaries call themselves ${revoltedFaction.name}.`);
    revoltedFaction.revolvedFrom = faction.id;
    revoltedFaction.declareWar(faction.id);

  } else if(situation === 'collapse') {
    // split 2-4 new factions
    faction.collapse();
    History.add([faction, faction.planet.cls], `Political instability leads to the collapse of ${faction.name}.`, 'political_crisis_collapse_' + theTime.year);
  } else {
    debugger;
  }
};
