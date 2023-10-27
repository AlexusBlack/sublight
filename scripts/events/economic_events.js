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

economicCycleEvent.actions_func = function(faction) {
  let economicCycleChances = {
    'economic_cycle_boom': 0.1,
    'economic_cycle_growth': 0.2,
    'economic_cycle_stagnation': 0.4,
    'economic_cycle_recession': 0.2,
    'economic_cycle_depression': 0.1
  };
  const modifier = weightedRandom(economicCycleModifierKeys, Object.values(economicCycleChances)).item;
  theModifiers.add(faction, modifier);
};

