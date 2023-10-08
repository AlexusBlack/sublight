const CONF_DISTANCE_MULT = 25;
(function() {
  const el = document.querySelector('.starmap-info');
  const fields = {
    'type': el.querySelector('[data-title="Type"]'),
    'name': el.querySelector('[data-title="Name"]'),
    'distance': el.querySelector('[data-title="Distance"]'),
    'year': el.querySelector('[data-title="Year"]'),
    'population': el.querySelector('[data-title="Population"]'),
  };
  const objects = Array.from(document.querySelectorAll('.starmap__object'));
  const playerShip = document.querySelector('.starmap__spaceship--player');
  objects.forEach(object => {
    object.addEventListener('mouseenter', function(e) {
      fields.type.textContent = object.dataset.type;
      fields.name.textContent = object.dataset.name;
      fields.year.textContent = 'year' in object.dataset ? object.dataset.year : 'Never';
      fields.population.textContent = 'population' in object.dataset ? parseFloat(object.dataset.population).toLocaleString('En-us') + ' mil' : 'None';

      const playerPosition = getPosition(playerShip);
      const objectPosition = getPosition(object);
      const distance = Math.sqrt(Math.pow(playerPosition.x - objectPosition.x, 2) + Math.pow(playerPosition.y - objectPosition.y, 2)) * CONF_DISTANCE_MULT;
      fields.distance.textContent = distance.toFixed(2) + ' LY';

      el.classList.add('starmap-info--visible');
    });
    object.addEventListener('mouseleave', function(e) {
      el.classList.remove('starmap-info--visible');
    });
  });
})();

function getPosition(starmapObject) {
  if(starmapObject.classList.contains('starmap__spaceship--in-system')) {
    const system = starmapObject.closest('.starmap__star');
    return {
      x: parseFloat(system.dataset.x),
      y: parseFloat(system.dataset.y),
    };
  }
  return {
    x: parseFloat(starmapObject.dataset.x),
    y: parseFloat(starmapObject.dataset.y),
  };
}
