class Planet {
  constructor(planetId) {
    this.planetId = planetId;
    this.factions = [];

    // planetary tech level, maximum from every faction in category
    this.technology = { 'formal': 0, 'natural': 0, 'social': 0, 'applied': 0 };
  }

  recalculateFactionStrengths() {
    this.factions.forEach(faction => faction.calculateStrength());
  }

  process1Month() {
    this.factions.forEach(faction => {
      theModifiers.clean(faction);
      theEvents.tryTriggerEvents('faction', faction);
    });
  }

  process5Years() {
    this.factions.forEach(f => f.grow5Years());
    this.calculatePlanetaryTechLvl();
    this.calculateTechBleedThrough();
    this.factions.forEach(f => f.calculate5Years());
  }

  calculatePlanetaryTechLvl() {
    this.factions.forEach(faction => {
      Utils.TechnologyTypes.forEach(type => {
        // identifying planetary tech level
        if(faction.technology[type] > this.technology[type]) {
          this.technology[type] = faction.technology[type];
        }
      });
    });
  }

  calculateTechBleedThrough() {
    this.factions.forEach(faction => {
      Utils.TechnologyTypes.forEach(type => {
        // identifying planetary tech level
        if(faction.technology[type] < this.technology[type] * Utils.SBTRate) {
          faction.technology[type] = this.technology[type] * Utils.SBTRate;
        }
      });
    });
  }


  static compcolors = [
    ["/img/planeticons/rockyPlanet.png","/img/planeticons/rockyPlanet2.png","/img/planeticons/rockyPlanet3.png","/img/planeticons/rockyPlanet4.png","/img/planeticons/rockyPlanet5.png","/img/planeticons/rockyPlanet6.png",],
    ["/img/planeticons/icyPlanet.png","/img/planeticons/icyPlanet2.png","/img/planeticons/icyPlanet3.png","/img/planeticons/icyPlanet4.png","/img/planeticons/icyPlanet5.png","/img/planeticons/icyPlanet6.png",],
    ["/img/planeticons/carbonaceousPlanet.png","/img/planeticons/carbonaceousPlanet2.png","/img/planeticons/carbonaceousPlanet3.png","/img/planeticons/carbonaceousPlanet4.png","/img/planeticons/carbonaceousPlanet5.png","/img/planeticons/carbonaceousPlanet6.png",],
    ["/img/planeticons/metallicPlanet.png","/img/planeticons/metallicPlanet2.png","/img/planeticons/metallicPlanet3.png","/img/planeticons/metallicPlanet4.png","/img/planeticons/metallicPlanet5.png","/img/planeticons/metallicPlanet6.png",],
    ["/img/planeticons/iceGiant.png","/img/planeticons/iceGiant2.png","/img/planeticons/iceGiant3.png","/img/planeticons/iceGiant4.png","/img/planeticons/iceGiant5.png","/img/planeticons/iceGiant6.png",],
    ["/img/planeticons/gasGiant.png","/img/planeticons/gasGiant2.png","/img/planeticons/gasGiant3.png","/img/planeticons/gasGiant4.png","/img/planeticons/gasGiant5.png","/img/planeticons/gasGiant6.png",]
];

  static surfaceliquidcolors = [
    "rgb(0,0,0)",
    "/img/planeticons/waterOverlay",
    "/img/planeticons/ammoniaOverlay",
    "/img/planeticons/methaneOverlay",
    "/img/planeticons/nitrogenOverlay"
  ];

  static liquidcoveragefilenames = {
      0.02: "1.png",
      0.05: "1.png",
      0.1: "1.png",
      0.3: "2.png",
      0.7: "2.png",
      0.8: "2.png",
      0.9: "2.png",
      0.97: "3.png",
      1: "3.png",
      '-1': "3.png"
  };

  static getPlanetImage(planet) {
    const composition = parseInt(planet['composition']);
    const displayseed = parseInt(planet['visual style']);
    const liquid = parseInt(planet['surface liquid']);
    const lcoverage = parseFloat(planet['liquid coverage']);
    const temperature = parseInt(planet['base temperature']);
    const life = parseInt(planet['life']);

    const overlays = [];

    if(planet['primary atmospheric gas'] === '2' && parseInt(planet['atmosphere thickness']) >= 3) {
      addOverlay('/img/ATM_carbo.png', '100%');
    } else if(planet['primary atmospheric gas'] === '1' && parseInt(planet['atmosphere thickness']) >= 3) {
      addOverlay('/img/ATM_nitro.png', '100%');
    }

    addOverlay(this.compcolors[composition][displayseed]);

    if(composition < 4) {
      if(planet['geologically active'] === 'true') {
        addOverlay('/img/planeticons/geoActiveOverlay2.png');
      } else {
        addOverlay('/img/planeticons/geoInactiveOverlay.png');
      }
    }

    if(life > 1) {
      if(liquid === 1) {
        addOverlay('/img/planeticons/lifeOverlayWater.png');
      } else if(liquid === 2) {
        addOverlay('/img/planeticons/lifeOverlayAmmonia.png');
      } else if(liquid === 3) {
        addOverlay('/img/planeticons/lifeOverlayMethanum.png');
      }
    }

    addOverlay(this.surfaceliquidcolors[liquid]+this.liquidcoveragefilenames[lcoverage]);
    addOverlay('/img/planeticons/shade2.png');

    if(composition < 4 && temperature >= 17) {
      addOverlay('/img/planeticons/torridPlanetOverlay.png');
    }

    if(planet.rings === '1') {
      addOverlay('/img/planeticons/rings.png', '100%');
    }

    // -- Render all
    const size = parseFloat(planet['size']);
    let type = 'regular';
    if(size > 99) type = 'giant';
    if(size < 0.1) type = 'dwarf';
    if(size < 0.01) type = 'tiny';

    let html = `<div class="planet-image planet-image--scale-${type}">`;
    for(let i = 0; i < overlays.length; i++) {
      html += `<div class="planet-image__overlay" style="background-image: url('${overlays[i].url}');background-size: ${overlays[i].size};"></div>`;
    }
    html += '</div>';
    return html;

    function addOverlay(image, size = '70%') {
      overlays.push({url: image, size: size});
    }
  }
}
