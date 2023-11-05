const relativisticProjectileHit = new Modifier('relativistic_projectile_hit', 12 * 300);
relativisticProjectileHit.effects = [
  {type: 'faction_population_growth_set', value: -40}, // decrease by 25%
];
