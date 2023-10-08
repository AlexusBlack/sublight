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
  const playerNode = document.querySelector('.starmap__spaceship--player');
  objects.forEach(object => {
    object.addEventListener('mouseenter', function(e) {
      fields.type.textContent = object.dataset.type;
      fields.name.textContent = object.dataset.name;
      fields.year.textContent = 'year' in object.dataset ? object.dataset.year : 'Never';
      fields.population.textContent = 'population' in object.dataset ? parseFloat(object.dataset.population).toLocaleString('En-us') + ' mil' : 'None';

      const playerPosition = Utils.getMapPosition(playerNode);
      const objectPosition = Utils.getMapPosition(object);
      const distance = Utils.getMapDistance(playerPosition, objectPosition);
      fields.distance.textContent = distance.toFixed(2) + ' LY';

      el.classList.add('starmap-info--visible');
    });
    object.addEventListener('mouseleave', function(e) {
      el.classList.remove('starmap-info--visible');
    });
    object.addEventListener('click', function(e) {
      if(confirm(`Fly to ${object.dataset.name}?`)) {
        playerShip.flyToSystem(object.dataset.name);
      }
    });
  });
})();
