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
};
