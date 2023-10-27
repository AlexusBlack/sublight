(function() {
  const el = document.querySelector('.planet-info__box');
  const titleEl = el.querySelector('.modal__title');
  const planetImage = el.querySelector('.planet-info__image');
  const geoAttributes = el.querySelector('.planet-info__geo-attributes');

  const skipGeoKeys = ['id', 'in system id', 'parent star(s)', 'orbit index', 'parent body', 'moon index', 'belt length', 'visual style'];

  window['showPlanetInfo'] = function(planetId) {
    el.classList.remove('modal--hidden');
    // console.log('showPlanetInfo', planetId);
    // console.log(theGalaxy.planets[planetId]);

    const planet = theGalaxy.planets[planetId];
    titleEl.textContent = 'Planet: ' + planet['name'];

    const planetImageHtml = Planet.getPlanetImage(planet);
    planetImage.innerHTML = planetImageHtml;

    let geoAttributesHtml = '';
    let geoKeys = Object.keys(planet);
    geoKeys.forEach(key => {
      if(skipGeoKeys.indexOf(key) !== -1) return;
      geoAttributesHtml += `
        <li class="planet-info__field" data-name="${key}">${planet[key]}</li>
      `;
    });
    geoAttributes.innerHTML = geoAttributesHtml;

    const chartBox = el.querySelector('.planet-info__factions-chart-box');
    chartBox.innerHTML = 'No factions known';
    //// Factions
    if('cls' in planet) {
      chartBox.innerHTML = '';
      el.querySelector('.planet-info__factions-tab-btn').click();

      const factions = planet.cls.factions;
      const labels = [];
      const strengths = [];
      const territories = [];
      const populations = [];
      const technologies = [];
      const economies = [];
      const politicals = [];
      factions.forEach(faction => {
        labels.push(faction.name);
        strengths.push(faction.strength);
        territories.push(faction.territory);
        populations.push(faction.population);
        technologies.push(Object.values(faction.technology).reduce((a, b) => a + b, 0));
        economies.push(faction.economicalSystem);
        politicals.push(faction.politicalSystem);
      });

      const planetPopulation = populations.reduce((a, b) => a + b, 0);
      chartBox.innerHTML += `Planet population: ${Math.round(planetPopulation).toLocaleString()},000<br>`;

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'Strength',
            data: strengths,
            backgroundColor: ['#267365', '#F2CB05', '#F29F05', '#F28705', '#F23030', '#747F7F', '#72F2EB', '#FF4858', '#1B7F79']
          }
        ]
      };
      const config = {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Factions'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  let strength = context.dataset.data[index];
                  const name = context.label;
                  const territory = territories[index];
                  const population = populations[index];
                  const political = politicals[index];
                  const economy = economies[index];
                  let technology = technologies[index];

                  if(strength > 1000000) {
                    strength = Math.round(strength).toExponential(2);
                  } else {
                    strength = Math.round(strength).toLocaleString();
                  }
                  if(technology > 1000000) {
                    technology = Math.round(technology).toExponential(2);
                  } else {
                    technology = Math.round(technology).toLocaleString();
                  }

                  return [
                    `${political}`,
                    `Economy: ${economy}`,
                    `Strength: ${strength}`,
                    `Territory: ${territory.toLocaleString()} km²`,
                    `Population: ${Math.round(population).toLocaleString()},000`,
                    `Technology: ${technology}`,
                  ];
                }
              }
            }
          }
        }
      };

      const canvas = document.createElement('canvas');
      chartBox.appendChild(canvas);
      new Chart(canvas, config);
    } else {
      el.querySelector('.planet-info__geo-tab-btn').click();
    }
  };
})();
