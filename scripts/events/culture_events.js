/* =========== CULTURE CYCLE =========== */
const cultureCycleEvent = new Event('culture_cycle', 'faction');
cultureCycleEvent.mean_months_to_happen = 4;
const cultureCycleModifierKeys = ['culture_cycle_boom', 'culture_cycle_growth', 'culture_cycle_stagnation', 'culture_cycle_decline', 'culture_cycle_depression'];
cultureCycleEvent.trigger_func = function(faction) {
  // check if already have an economic cycle modifier
  const modifiers = faction.modifiers.filter(modifier => cultureCycleModifierKeys.includes(modifier.key));
  if (modifiers.length > 0) return false;
  return true;
};

cultureCycleEvent_descriptions = {
  'culture_cycle_boom': 'Every month there is a great new entertainment, every week new popular songs are released, every day there is a new hit movie. The people are happy and the culture is booming.',
  'culture_cycle_growth': 'The culture is growing. New artists are emerging, new songs are being written, new movies are being made. The people are happy.',
  'culture_cycle_stagnation': 'The culture is stagnating. The people are bored and the artists are uninspired.',
  'culture_cycle_decline': 'The culture entered period of decline. Entertainment got dumber, music is repetitive and movies are boring. The people are unhappy though not always sure why.',
  'culture_cycle_depression': 'Our current culture by some are characterised as the lack of culture. Our artists are depressed, and people are looking for inspiration elsewhere.'
};

cultureCycleEvent.actions_func = function(faction) {
  let cultureCycleChances = {
    'culture_cycle_boom': 0.1,
    'culture_cycle_growth': 0.2,
    'culture_cycle_stagnation': 0.4,
    'culture_cycle_decline': 0.2,
    'culture_cycle_depression': 0.1
  };

  if(faction.ethics['communal'].active) {
    // Commie
    cultureCycleChances = {
      'culture_cycle_boom': 0.05,
      'culture_cycle_growth': 0.2,
      'culture_cycle_stagnation': 0.6,
      'culture_cycle_decline': 0.1,
      'culture_cycle_depression': 0.05
    };
  } else if(faction.ethics['authoritarian'].active || faction.ethics['spiritualist'].active) {
    // Dictators and fanatics
    cultureCycleChances = {
      'culture_cycle_boom': 0.0,
      'culture_cycle_growth': 0.1,
      'culture_cycle_stagnation': 0.2,
      'culture_cycle_decline': 0.4,
      'culture_cycle_depression': 0.3
    };
  } else if(faction.ethics['individual'].active) {
    // Capitalists
    cultureCycleChances = {
      'culture_cycle_boom': 0.2,
      'culture_cycle_growth': 0.35,
      'culture_cycle_stagnation': 0.3,
      'culture_cycle_decline': 0.1,
      'culture_cycle_depression': 0.05
    };
  }

  if(theModifiers.has(faction.planet.cls, 'relativistic_projectile_hit')) {
    cultureCycleChances = {
      'culture_cycle_boom': 0,
      'culture_cycle_growth': 0,
      'culture_cycle_stagnation': 0,
      'culture_cycle_decline': 0.3,
      'culture_cycle_depression': 0.7
    };
  }

  //const modifier = weightedRandom(cultureCycleModifierKeys, Object.values(cultureCycleChances)).item;
  const modifier = weightedRand2(cultureCycleChances);
  History.add([faction], cultureCycleEvent_descriptions[modifier], 'culture_cycle');
  theModifiers.add(faction, modifier);
};

