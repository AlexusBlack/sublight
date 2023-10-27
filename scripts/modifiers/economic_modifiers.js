const economicCycleBoom = new Modifier('economic_cycle_boom');
economicCycleBoom.durationMonths = 12 * 5;
economicCycleBoom.effects = [
  {type: 'faction_general_strength_mult', value: 1.2},
  {type: 'faction_population_growth_add', value: 3},
];

const economicCycleGrowth = new Modifier('economic_cycle_growth');
economicCycleGrowth.durationMonths = 12 * 5;
economicCycleGrowth.effects = [
  {type: 'faction_general_strength_mult', value: 1.1},
  {type: 'faction_population_growth_add', value: 1},
];

const economicCycleStagnation = new Modifier('economic_cycle_stagnation');
economicCycleStagnation.durationMonths = 12 * 5;
economicCycleStagnation.effects = [];

const economicCycleRecession = new Modifier('economic_cycle_recession');
economicCycleRecession.durationMonths = 12 * 5;
economicCycleRecession.effects = [
  {type: 'faction_general_strength_mult', value: 0.9},
  {type: 'faction_population_growth_add', value: -1},
];

const economicCycleDepression = new Modifier('economic_cycle_depression');
economicCycleDepression.durationMonths = 12 * 5;
economicCycleDepression.effects = [
  {type: 'faction_general_strength_mult', value: 0.8},
  {type: 'faction_population_growth_add', value: -3},
];

