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
        type: 'pie', // doughnut
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

      const dataDiplomacy = {
        labels: labels,
        datasets: [
          {
            label: 'Strength',
            data: labels.map(label => 1),
            backgroundColor: ['#267365', '#F2CB05', '#F29F05', '#F28705', '#F23030', '#747F7F', '#72F2EB', '#FF4858', '#1B7F79']
          }
        ]
      };

      function drawLine(ctx, arc1, arc2, color) {
        ctx.beginPath();
        ctx.moveTo(arc1.x, arc1.y);
        ctx.lineTo(arc2.x, arc2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
      }

      function drawDiplomaticRelations(index, relation, color, ctx, factions, arcsCenterPoints) {
        const faction = factions[index];
        faction.diplomacy[relation].forEach(factionId => {
          const factionIndex = factions.findIndex(faction => faction.id === factionId);
          if(factionIndex === -1) return;

          const arc1 = arcsCenterPoints[index];
          const arc2 = arcsCenterPoints[factionIndex];

          drawLine(ctx, arc1, arc2, color);
        });
      }

      const diplomacyPlugin = {
        id: 'diplomacy',
        beforeDraw: function(chart, args, options) {
          // Draw lines between doughnut chart segments
          const ctx = chart.ctx;
          const datasetMeta = chart.getDatasetMeta(0);

          const arcsCenterPoints = datasetMeta.data.map(arc => arc.getCenterPoint());

          factions.forEach((faction, index) => {
            drawDiplomaticRelations(index, 'alliance', 'deepskyblue', ctx, factions, arcsCenterPoints);
            drawDiplomaticRelations(index, 'rival', 'orange', ctx, factions, arcsCenterPoints);
            drawDiplomaticRelations(index, 'protects', 'green', ctx, factions, arcsCenterPoints);
            drawDiplomaticRelations(index, 'threatens', 'yellow', ctx, factions, arcsCenterPoints);
            drawDiplomaticRelations(index, 'war', 'red', ctx, factions, arcsCenterPoints);
          });
        },
        afterDatasetsDraw: function(chart, args, options) {
          const ctx = chart.ctx;
          const datasetMeta = chart.getDatasetMeta(0);

          const arcsCenterPoints = datasetMeta.data.map(arc => arc.getCenterPoint());
          // draw faction names over center points
          factions.forEach((faction, index) => {
            let name = faction.name;
            // if name is too long, show only capital letters
            if(name.length > 10) {
              name = name.split(' ').filter(word => word !== 'of').map(word => word[0]).join('');
            }
            const arc = arcsCenterPoints[index];
            ctx.shadowColor="black";
            ctx.shadowBlur=7;
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(name, arc.x, arc.y);
            ctx.shadowBlur=0;
          });
        }
      };
      const configDiplomacy = {
        type: 'doughnut',
        plugins: [diplomacyPlugin],
        data: dataDiplomacy,
        options: {
          responsive: true,
          backgroundColor: '#333',
          borderColor: '#333',
          //borderWidth: 20,
          borderRadius: 100,
          spacing: 400 / factions.length,//80,
          //borderJoinStyle: 'round',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Diplomacy'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const name = context.label;
                  let alliance = factions[index].diplomacy.alliance.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let rivalry = factions[index].diplomacy.rival.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let war = factions[index].diplomacy.war.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let protects = factions[index].diplomacy.protects.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let protectedBy = factions[index].diplomacy.protectedBy.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let threatens = factions[index].diplomacy.threatens.map(factionId => theGalaxy.factions[factionId].name).join(', ');
                  let threatenedBy = factions[index].diplomacy.threatenedBy.map(factionId => theGalaxy.factions[factionId].name).join(', ');

                  const result = [];
                  if(alliance) result.push(`Alliance: ${alliance}`);
                  if(rivalry) result.push(`Rivalry: ${rivalry}`);
                  if(war) result.push(`War: ${war}`);
                  if(protects) result.push(`Protects: ${protects}`);
                  if(protectedBy) result.push(`Protected by: ${protectedBy}`);
                  if(threatens) result.push(`Threatens: ${threatens}`);
                  if(threatenedBy) result.push(`Threatened by: ${threatenedBy}`);
                  if(!result.length) result.push('No known diplomacy');
                  return result;
                }
              }
            }
          },
        },
      };

      const canvasDiplomacy = document.createElement('canvas');
      chartBox.appendChild(canvasDiplomacy);
      new Chart(canvasDiplomacy, configDiplomacy);

    } else {
      el.querySelector('.planet-info__geo-tab-btn').click();
    }
  };
})();
