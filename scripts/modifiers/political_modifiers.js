const politicalCycleDuration = 12 * 10;
const politicalCycleBoom = new Modifier('political_cycle_unity');
politicalCycleBoom.durationMonths = politicalCycleDuration;
politicalCycleBoom.effects = [
  {type: 'faction_military_strength_mult', value: 1.3},
  {type: 'faction_culture_strength_mult', value: 1.3},
  {type: 'faction_general_strength_mult', value: 1.3},
];

const politicalCycleGrowth = new Modifier('political_cycle_consensus');
politicalCycleGrowth.durationMonths = politicalCycleDuration;
politicalCycleGrowth.effects = [
  {type: 'faction_military_strength_mult', value: 1.1},
  {type: 'faction_culture_strength_mult', value: 1.1},
  {type: 'faction_general_strength_mult', value: 1.1},
];

const politicalCycleStagnation = new Modifier('political_cycle_stagnation');
politicalCycleStagnation.durationMonths = politicalCycleDuration;
politicalCycleStagnation.effects = [];

const politicalCycleRecession = new Modifier('political_cycle_conflict');
politicalCycleRecession.durationMonths = politicalCycleDuration;
politicalCycleRecession.effects = [
  {type: 'faction_military_strength_mult', value: 0.8},
  {type: 'faction_culture_strength_mult', value: 0.8},
  {type: 'faction_general_strength_mult', value: 0.8},
];

const politicalCycleDepression = new Modifier('political_cycle_crisis');
politicalCycleDepression.durationMonths = politicalCycleDuration;
politicalCycleDepression.effects = [
  {type: 'faction_military_strength_mult', value: 0.6},
  {type: 'faction_culture_strength_mult', value: 0.6},
  {type: 'faction_general_strength_mult', value: 0.6},
];

