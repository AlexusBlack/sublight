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

  const modifier = weightedRandom(politicalCycleModifierKeys, Object.values(politicalCycleChances)).item;
  faction.history.push({year: theTime.year, month: theTime.month, category: 'political_cycle',  record: politicalCycleEvent_descriptions[modifier]});
  theModifiers.add(faction, modifier);
};

