/* =========== RELATIVISTIC HIT =========== */
const relativisticHitEvent = new Event('relativistic_hit', 'planet');
relativisticHitEvent.mean_months_to_happen = 0;
relativisticHitEvent.trigger_func = (planet) => {
  // year must be at least 2025
  //if(theTime.year < 2025) return false;
  // one hit is enough
  if(theModifiers.has(planet, 'relativistic_projectile_hit')) return false;
  // needs a least 1 billion population
  if(planet.population < 10**6) return false;
  // planet technology needs to be 300 or higher
  if(Object.values(planet.technology).reduce((a, b) => a + b, 0) < 300) return false;
  return true;
}

relativisticHitEvent.actions_func = (planet) => {
  theModifiers.add(planet, 'relativistic_projectile_hit');
  History.add([planet], `${planet.name} was hit by a relativistic projectile. Vulcans errupt, earth quakes are common place, most complex life forms are dying out. Scientists estimate that concequences of the hit will last for another 300-500 years. ${planet.name} civilisation is on the brink of extinsion.`, 'relativistic_hit');
};
