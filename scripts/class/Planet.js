class Planet {
  constructor(planetId) {
    this.planetId = planetId;
    this.factions = [];

    // planetary tech level, maximum from every faction in category
    this.technology = { 'formal': 0, 'natural': 0, 'social': 0, 'applied': 0 };
  }

  process1Month() {
    this.factions.forEach(faction => {
      theModifiers.clean(faction);
      theEvents.tryTriggerEvents('faction', faction);
    });
  }

  process1Years() {
    this.calculateWarProgress();
  }

  process5Years() {
    this.factions.forEach(f => f.grow5Years());
    this.calculatePlanetaryTechLvl();
    this.calculateTechBleedThrough();
    this.factions.forEach(f => f.calculate5Years());

    this.calculateDiplomaticRelations();
  }

  calculateWarProgress() {
    this.factions.forEach(faction => {
      if(faction.diplomacy.war.length === 0) {
        // peace time war exhaustion decrease
        faction.warExaustion = Math.max(0, faction.warExaustion - 0.1);
        return;
      }
      const militaryStrength = faction.calculateFullMilitaryStrength();
      faction.diplomacy.war.forEach(opponentId => {
        const opponent = theGalaxy.factions[opponentId];
        const opponentMilitaryStrength = opponent.calculateFullMilitaryStrength();

        // War End checks
        if(faction.warExaustion > 0.8) {
          if(!faction.wantsToEndWar) {
            faction.wantsToEndWar = true;
            console.log(`war: ${faction.name} wants to end war with ${opponent.name}`);
          }
        } else {
          faction.wantsToEndWar = false;
        }
        if(faction.warExaustion >= 1) {
          faction.warExaustion = 1;
          // filter out factions from each other war list
          faction.diplomacy.war = faction.diplomacy.war.filter(warTargetId => warTargetId !== opponentId);
          opponent.diplomacy.war = opponent.diplomacy.war.filter(warTargetId => warTargetId !== faction.id);
          // TODO: implement suppender conditions.
          // TODO: if opponent is 'democratic', change government to 'democratic'
          // TODO: if opponent is 'socialist', 50/50, change government to 'socialist' or get annexed
          // TODO: if opponent is 'anarchy', change government to anarchy and collapse
          // TODO: if opponent is 'dictatorship', get annexed
          // TODO: if opponent is 'council', collapse and what's left get annexed
          console.log(`war: ${faction.name} surrenders to ${opponent.name}`);
          return;
        }
        if(faction.wantsToEndWar && opponent.wantsToEndWar) {
          faction.diplomacy.war = faction.diplomacy.war.filter(warTargetId => warTargetId !== opponentId);
          opponent.diplomacy.war = opponent.diplomacy.war.filter(warTargetId => warTargetId !== faction.id);
          console.log(`war: ${faction.name} and ${opponent.name} declare peace`);

          return;
        }



        // War exhaustion growth
        let exhaustionGain = (opponentMilitaryStrength / militaryStrength) * getRandomArbitrary(0.7, 1.3) * Utils.EGMult;
        faction.warExaustion = Math.min(faction.warExaustion + exhaustionGain, 1);
      });
    });
  }

  calculateDiplomaticRelations() {
    const validRivalries = this.getValidRivalries();
    const validThreatTargets = this.getValidThreatTargets();
    const validProtectionTargets = this.getValidProtectionTargets();
    const validAlliances = this.getValidAlliances();
    const validWarTargets = this.getValidWarTargets();

    this.factions.forEach(faction => {
      faction.diplomacy.rivaledBy = [];
      faction.diplomacy.threatenedBy = [];
      faction.diplomacy.protectedBy = [];
    });
    this.factions.forEach(faction => {
      // get first rival from available rivals list
      faction.diplomacy.rival = validRivalries[faction.id].length > 0 ? [validRivalries[faction.id][Math.floor(Math.random() * validRivalries[faction.id].length)]] : [];
      // add to rival's rivaledBy list
      faction.diplomacy.rival.forEach(rivalId => {
        theGalaxy.factions[rivalId].diplomacy.rivaledBy.push(faction.id);
      });

      // get 3 random threat targets from available threat targets list
      faction.diplomacy.threatens = validThreatTargets[faction.id].length > 0 ? validThreatTargets[faction.id].slice(0, 3) : [];
      //faction.diplomacy.threatens = validThreatTargets[faction.id].length > 0 ? [validThreatTargets[faction.id][Math.floor(Math.random() * validThreatTargets[faction.id].length)]] : [];
      // add to threat target's threatenedBy list
      faction.diplomacy.threatens.forEach(threatTargetId => {
        theGalaxy.factions[threatTargetId].diplomacy.threatenedBy.push(faction.id);
      });

      // get first protection target from available protection targets list
      faction.diplomacy.protects = validProtectionTargets[faction.id].length > 0 ? [validProtectionTargets[faction.id][Math.floor(Math.random() * validProtectionTargets[faction.id].length)]] : [];
      // add to protection target's protectedBy list
      faction.diplomacy.protects.forEach(protectionTargetId => {
        theGalaxy.factions[protectionTargetId].diplomacy.protectedBy.push(faction.id);
      });

      // get first 2 alliances from available alliances list
      faction.diplomacy.alliance = validAlliances[faction.id].length > 0 ? validAlliances[faction.id].slice(0, 2) : [];

      // war declarations
      // faction that is already at war, can't declary more wars (non-historic sanity)
      if(faction.diplomacy.war.length > 0) return;
      if(validWarTargets[faction.id].length === 0) return;
      if(faction.warExaustion > 0.5) return;
      // non-militaristic democracies don't declare wars
      if(faction.politicalSystemType === 'democracy' && !faction.ethics['militarist'].active) return;
      // pacifists don't declare wars
      if(faction.ethics['pacifist'].active) return;
      // declare war on first war target
      faction.diplomacy.war = [validWarTargets[faction.id][0]];
      // war is force-mutual
      theGalaxy.factions[validWarTargets[faction.id][0]].diplomacy.war.push(faction.id);
      console.log(`${faction.name} declares war on ${theGalaxy.factions[faction.diplomacy.war[0]].name}`);
      // both sides are initially supported by their allies indirectly
      // their allies can join in directly though events
    });
    // remove non mutial alliances
    this.factions.forEach(faction => {
      if(faction.diplomacy.alliance.length > 0) {
        if(!theGalaxy.factions[faction.diplomacy.alliance[0]].diplomacy.alliance.includes(faction.id)) {
          faction.diplomacy.alliance = [];
        }
      }
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

  getValidAlliances() {
    const validAlliances = {};
    // build list of possible alliances
    this.factions.forEach(faction1 => {
      if(!(faction1.id in validAlliances)) validAlliances[faction1.id] = [];
      this.factions.forEach(faction2 => {
        if(faction1.id !== faction2.id) {
          if(this.isValidAlliance(faction1.id, faction2.id)) validAlliances[faction1.id].push(faction2.id);
        }
      });
      // sort by faction strength, strongest first
      validAlliances[faction1.id].sort((a, b) => theGalaxy.factions[b].strength - theGalaxy.factions[a].strength);
    });
    return validAlliances;
  }

  getValidWarTargets() {
    const validWarTargets = {};
    // build list of possible war targets
    this.factions.forEach(faction1 => {
      if(!(faction1.id in validWarTargets)) validWarTargets[faction1.id] = [];
      this.factions.forEach(faction2 => {
        if(faction1.id !== faction2.id) {
          if(this.isValidWarTarget(faction1.id, faction2.id)) validWarTargets[faction1.id].push(faction2.id);
        }
      });
      // sort by faction strength, weakest first
      validWarTargets[faction1.id].sort((a, b) => theGalaxy.factions[a].strength - theGalaxy.factions[b].strength);
    });
    return validWarTargets;
  }

  isValidRivalry(faction1Id, faction2Id) {
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    // both can't be democracy or socialism, as those don't rival each other
    if(['democracy', 'socialism'].includes(faction1.politicalSystemType) &&
      faction1.politicalSystemType === faction2.politicalSystemType) return false;
    // strength difference can't be large than 50%
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

  isValidAlliance(faction1Id, faction2Id) {
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    // must be of similar strength
    const strengthDifference = Math.abs(faction1.strength - faction2.strength);
    const strongerNationStrength = Math.max(faction1.strength, faction2.strength);
    if(strengthDifference > strongerNationStrength * 0.7) return false;
    // no if rival each other
    if(faction1.diplomacy.rival.includes(faction2.id)) return false;
    // If have mutual threatenedBy or rivals then yes (array intercection)
    if(Utils.arrayIntersect([...faction1.diplomacy.threatenedBy, ...faction1.diplomacy.rivaledBy], [...faction2.diplomacy.threatenedBy, ...faction2.diplomacy.rivaledBy]).length > 0) return true;
    // dictatorships don't ally and can't be allied, unless they have exactly same political system
    if((faction1.politicalSystemType === 'dictatorship' || faction2.politicalSystemType === 'dictatorship') &&
      faction1.politicalSystem !== faction2.politicalSystem) return false;
    // target must be of same political system type and strength difference can't be larger than 50% of the weaker faction
    if(faction1.politicalSystemType !== faction2.politicalSystemType) return false;
    return true;
  }

  isValidWarTarget(faction1Id, faction2Id) {
    // can't be at war already
    if(theGalaxy.factions[faction1Id].diplomacy.war.includes(faction2Id)) return false;
    // faction 1 must threaten or rival faction 2
    const faction1 = theGalaxy.factions[faction1Id];
    const faction2 = theGalaxy.factions[faction2Id];
    if(!faction2.diplomacy.threatenedBy.includes(faction1.id) && !faction2.diplomacy.rivaledBy.includes(faction1.id)) return false;
    const faction1MilitaryStrength = faction1.calculateFullMilitaryStrength();
    const faction2MilitaryStrength = faction2.calculateFullMilitaryStrength();
    // faction 1 must be stronger than faction 2 by at least 50%
    if(faction1MilitaryStrength < faction2MilitaryStrength * 1.5) return false;
    // democracies and socialism require at least 200% advantage
    if(['democracy', 'socialism'].includes(faction1.politicalSystemType) &&
      faction1MilitaryStrength < faction2MilitaryStrength * 3) return false;
    return true;
  }

  recalculateFactionStrengths() {
    this.factions.forEach(faction => faction.calculateStrength());
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
