class Planet {
  constructor(planetId) {
    this.planetId = planetId;
    this.factions = [];

    // planetary tech level, maximum from every faction in category
    this.technology = { 'formal': 0, 'natural': 0, 'social': 0, 'applied': 0 };
  }

  calculateDiplomaticRelations() {
    const validRivalries = this.getValidRivalries();
    const validThreatTargets = this.getValidThreatTargets();
    const validProtectionTargets = this.getValidProtectionTargets();

    this.factions.forEach(faction => {
      faction.diplomacy.rivaledBy = [];
      faction.diplomacy.threatenedBy = [];
      faction.diplomacy.protectedBy = [];
    });
    this.factions.forEach(faction => {
      // get first rival from available rivals list
      faction.diplomacy.rival = validRivalries[faction.id].length > 0 ? [validRivalries[faction.id][0]] : [];
      // add to rival's rivaledBy list
      faction.diplomacy.rival.forEach(rivalId => {
        theGalaxy.factions[rivalId].diplomacy.rivaledBy.push(faction.id);
      });

      // get first threat targe from available thread targets list
      faction.diplomacy.threatens = validThreatTargets[faction.id].length > 0 ? [validThreatTargets[faction.id][0]] : [];
      // add to threat target's threatenedBy list
      faction.diplomacy.threatens.forEach(threatTargetId => {
        theGalaxy.factions[threatTargetId].diplomacy.threatenedBy.push(faction.id);
      });

      // get first protection target from available protection targets list
      faction.diplomacy.protects = validProtectionTargets[faction.id].length > 0 ? [validProtectionTargets[faction.id][0]] : [];
      // add to protection target's protectedBy list
      faction.diplomacy.protects.forEach(protectionTargetId => {
        theGalaxy.factions[protectionTargetId].diplomacy.protectedBy.push(faction.id);
      });

      // TODO: validate alliances
      // TODO: establish new alliances if possible
    });
  }

  getValidRivalries() {
    const validRivalries = {};
    // build list of possible rivalries
    this.factions.forEach(faction1 => {
      if(!(faction1.id in validRivalries)) validRivalries[faction1.id] = [];
      this.factions.forEach(faction2 => {
        if(faction1.id !== faction2.id) {
          if(this.isValidRivalry(faction1.id, faction2.id)) validRivalries[faction1.id].push(faction2.id);
        }
      });
    });
    return validRivalries;
  }

  getValidThreatTargets() {
    const validThreatTargets = {};
    // build list of possible threat targets
    this.factions.forEach(faction1 => {
      if(!(faction1.id in validThreatTargets)) validThreatTargets[faction1.id] = [];
      // democracies that are not militarists don't threaten
      if(faction1.politicalSystemType === 'democracy' && !faction1.ethics['militarist'].active) return false;
      this.factions.forEach(faction2 => {
        if(faction1.id !== faction2.id) {
          if(this.isValidThreatTarget(faction1.id, faction2.id)) validThreatTargets[faction1.id].push(faction2.id);
        }
      });
      // sort by faction strength, weakest first
      validThreatTargets[faction1.id].sort((a, b) => theGalaxy.factions[a].strength - theGalaxy.factions[b].strength);
    });
    return validThreatTargets;
  }

  getValidProtectionTargets() {
    const validProtectionTargets = {};
    // build list of possible protection targets
    this.factions.forEach(faction1 => {
      if(!(faction1.id in validProtectionTargets)) validProtectionTargets[faction1.id] = [];
      this.factions.forEach(faction2 => {
        if(faction1.id !== faction2.id) {
          if(this.isValidProtectionTarget(faction1.id, faction2.id)) validProtectionTargets[faction1.id].push(faction2.id);
        }
      });
      // sort by faction strength, weakest first
      validProtectionTargets[faction1.id].sort((a, b) => theGalaxy.factions[a].strength - theGalaxy.factions[b].strength);
    });
    return validProtectionTargets;
  }


  isValidRivalry(faction1Id, faction2Id) {
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    // both can't be democracy or socialism, as those don't rival each other
    if(['democracy', 'socialism'].includes(faction1.politicalSystemType) &&
      faction1.politicalSystemType === faction2.politicalSystemType) return false;
    // strength difference can't be large than 30% of the weaker faction
    const strengthDifference = Math.abs(faction1.strength - faction2.strength);
    const weakerStrength = Math.min(faction1.strength, faction2.strength);
    if(strengthDifference > weakerStrength * 0.5) return false;
    return true;
  }

  isValidThreatTarget(faction1Id, faction2Id) {
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    // both can't be democracy or socialism, as those don't threaten each other
    if(['democracy', 'socialism'].includes(faction1.politicalSystemType) &&
      faction1.politicalSystemType === faction2.politicalSystemType) return false;
    // target can't be stronger than 15% of the threatening faction
    if(faction2.strength > faction1.strength * 0.15) return false;
    return true;
  }

  isValidProtectionTarget(faction1Id, faction2Id) {
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    // dictatorships don't protect and can't be protected
    if(faction1.politicalSystemType === 'dictatorship' || faction2.politicalSystemType === 'dictatorship') return false;
    // target must be of same political system type and can't be stronger than 15% of the protecting faction
    if(faction1.politicalSystemType !== faction2.politicalSystemType) return false;
    if(faction2.strength > faction1.strength * 0.20) return false;
    return true;
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

    this.calculateDiplomaticRelations();
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
