const cultureCycleDuration = 12 * 10;
const cultureCycleBoom = new Modifier('culture_cycle_boom');
cultureCycleBoom.durationMonths = cultureCycleDuration;
cultureCycleBoom.effects = [
  {type: 'faction_culture_strength_mult', value: 3},
  {type: 'faction_general_strength_mult', value: 1.1},
];

const cultureCycleGrowth = new Modifier('culture_cycle_growth');
cultureCycleGrowth.durationMonths = cultureCycleDuration;
cultureCycleGrowth.effects = [
  {type: 'faction_culture_strength_mult', value: 1.5},
];

const cultureCycleStagnation = new Modifier('culture_cycle_stagnation');
cultureCycleStagnation.durationMonths = cultureCycleDuration;
cultureCycleStagnation.effects = [];

const cultureCycleRecession = new Modifier('culture_cycle_decline');
cultureCycleRecession.durationMonths = cultureCycleDuration;
cultureCycleRecession.effects = [
  {type: 'faction_culture_strength_mult', value: 0.8},
];

const cultureCycleDepression = new Modifier('culture_cycle_depression');
cultureCycleDepression.durationMonths = cultureCycleDuration;
cultureCycleDepression.effects = [
  {type: 'faction_culture_strength_mult', value: 0.5},
];

