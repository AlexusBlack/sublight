/* =========== ECONOMIC CYCLE =========== */
const economicCycleEvent = new Event('economic_cycle', 'faction');
economicCycleEvent.mean_months_to_happen = 6;
const economicCycleModifierKeys = ['economic_cycle_boom', 'economic_cycle_growth', 'economic_cycle_stagnation', 'economic_cycle_recession', 'economic_cycle_depression'];
economicCycleEvent.trigger_func = function(faction) {
  // check if already have an economic cycle modifier
  const modifiers = faction.modifiers.filter(modifier => economicCycleModifierKeys.includes(modifier.key));
  if (modifiers.length > 0) return false;
  return true;
};

economicCycleEvent_descriptions = {
  'economic_cycle_boom': 'The economy entered period of unprecedented growth. Some say it will last forever.',
  'economic_cycle_growth': 'The economy is growing at a steady pace. The future looks bright.',
  'economic_cycle_stagnation': 'The economy is stagnating. There is no growth, but no decline either.',
  'economic_cycle_recession': 'The economy is in recession. The future looks grim.',
  'economic_cycle_depression': 'The economy suddenly entered a depression. People are losing their jobs and cost of living is rising.'
};

economicCycleEvent.actions_func = function(faction) {
  let economicCycleChances = {
    'economic_cycle_boom': 0.1,
    'economic_cycle_growth': 0.2,
    'economic_cycle_stagnation': 0.4,
    'economic_cycle_recession': 0.2,
    'economic_cycle_depression': 0.1
  };

  if(faction.ethics['communal'].active) {
    // Commie
    economicCycleChances = {
      'economic_cycle_boom': 0.05,
      'economic_cycle_growth': 0.2,
      'economic_cycle_stagnation': 0.6,
      'economic_cycle_recession': 0.1,
      'economic_cycle_depression': 0.05
    };
  } else if(faction.ethics['authoritarian'].active || faction.ethics['spiritualist'].active) {
    // Dictators and fanatics
    economicCycleChances = {
      'economic_cycle_boom': 0.0,
      'economic_cycle_growth': 0.1,
      'economic_cycle_stagnation': 0.2,
      'economic_cycle_recession': 0.4,
      'economic_cycle_depression': 0.3
    };
  } else if(faction.ethics['individual'].active) {
    // Capitalists
    economicCycleChances = {
      'economic_cycle_boom': 0.2,
      'economic_cycle_growth': 0.35,
      'economic_cycle_stagnation': 0.3,
      'economic_cycle_recession': 0.1,
      'economic_cycle_depression': 0.05
    };
  }

  if(theModifiers.has(faction.planet.cls, 'relativistic_projectile_hit')) {
    // relativistic projectile hit
    economicCycleChances = {
      'economic_cycle_boom': 0.0,
      'economic_cycle_growth': 0.0,
      'economic_cycle_stagnation': 0.0,
      'economic_cycle_recession': 0.0,
      'economic_cycle_depression': 1.0
    };
  }

  //const modifier = weightedRandom(economicCycleModifierKeys, Object.values(economicCycleChances)).item;
  const modifier = weightedRand2(economicCycleChances);
  History.add([faction], economicCycleEvent_descriptions[modifier], 'economic_cycle');
  theModifiers.add(faction, modifier);
};

