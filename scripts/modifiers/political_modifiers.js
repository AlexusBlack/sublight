const politicalCycleDuration = 12 * 10;
const politicalCycleBoom = new Modifier('political_cycle_unity', politicalCycleDuration);
politicalCycleBoom.effects = [
  {type: 'faction_military_strength_mult', value: 1.3},
  {type: 'faction_culture_strength_mult', value: 1.3},
  {type: 'faction_general_strength_mult', value: 1.3},
];

const politicalCycleGrowth = new Modifier('political_cycle_consensus', politicalCycleDuration);
politicalCycleGrowth.effects = [
  {type: 'faction_military_strength_mult', value: 1.1},
  {type: 'faction_culture_strength_mult', value: 1.1},
  {type: 'faction_general_strength_mult', value: 1.1},
];

const politicalCycleStagnation = new Modifier('political_cycle_stagnation', politicalCycleDuration);
politicalCycleStagnation.effects = [];

const politicalCycleRecession = new Modifier('political_cycle_conflict', politicalCycleDuration);
politicalCycleRecession.effects = [
  {type: 'faction_military_strength_mult', value: 0.8},
  {type: 'faction_culture_strength_mult', value: 0.8},
  {type: 'faction_general_strength_mult', value: 0.8},
];

const politicalCycleDepression = new Modifier('political_cycle_crisis', politicalCycleDuration);
politicalCycleDepression.effects = [
  {type: 'faction_military_strength_mult', value: 0.6},
  {type: 'faction_culture_strength_mult', value: 0.6},
  {type: 'faction_general_strength_mult', value: 0.6},
];

const politicalCrisisAverted = new Modifier('political_crisis_averted', 12 * 5);
const politicalRecentReform = new Modifier('political_recent_reform', 12 * 6);
const politicalRecentRevolt = new Modifier('political_recent_revolt', 12 * 6);
const politicalRecentCoup = new Modifier('political_recent_coup', 12 * 10);
const politicalRecentCollapse = new Modifier('political_recent_collapse', 12 * 10);
