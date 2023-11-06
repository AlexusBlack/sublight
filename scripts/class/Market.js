class Market {
  static maximumStock = 500;
  static productQtyMult = 0.000001;

  static productTypes = {
    'food': {'minPrice': 5, 'maxPrice': 50, 'basePrice': 20},
    'minerals': {'minPrice': 1, 'maxPrice': 25, 'basePrice': 10},
    'medicaments': {'minPrice': 10, 'maxPrice': 100, 'basePrice': 40},
    'technology': {'minPrice': 20, 'maxPrice': 200, 'basePrice': 80},
    'luxury': {'minPrice': 40, 'maxPrice': 400, 'basePrice': 160},
    'alcohol': {'minPrice': 10, 'maxPrice': 100, 'basePrice': 40},
    'weapons': {'minPrice': 20, 'maxPrice': 200, 'basePrice': 80},
    'drugs': {'minPrice': 40, 'maxPrice': 400, 'basePrice': 160},
  };
  static productTypeKeys = Object.keys(Market.productTypes);

  static productionDistribution = {
    'agricultural': {
      'food': 0.4,
      'minerals': 0.4,
      'alcohol': 0.2,
    },
    'mixed': {
      'food': 0.0,
      'minerals': 0.0,
      'medicaments': 0.2,
      'technology': 0.2,
      'luxury': 0.2,
      'alcohol': 0.2,
      'weapons': 0.1,
      'drugs': 0.1,
    },
    'industrial': {
      'food': -0.4,
      'minerals': -0.4,
      'medicaments': 0.1,
      'technology': 0.7,
      'luxury': 0.1,
      'alcohol': -0.1,
      'weapons': 0.1,
      'drugs': -0.1,
    },
    'post-industrial': {
      'food': -0.2,
      'minerals': -0.1,
      'medicaments': 0.2,
      'technology': -0.5,
      'luxury': 0.7,
      'alcohol': -0.1,
      'weapons': 0.1,
      'drugs': -0.1,
    }
  };

  // product price based on demand, supply and stock
  // ships can buy and sell stock
  constructor(planetId) {
    this.planetId = planetId;
    this.planet = theGalaxy.planets[planetId];
    this.products = {};
    Object.keys(Market.productTypes).forEach((productType) => {
      this.products[productType] = {
        'price': Market.productTypes[productType].basePrice,
        'stock': 0,
      };
    });
  }

  process1Years() {
    this.calculateQtyChange();
    this.adjustPrices();
  }

  calculateQtyChange() {
    this.planet.cls.factions.forEach((faction) => {
      let distribution = Object.assign({}, Market.productionDistribution[faction.production]);
      // TODO: implement variations based on ethics, but for now do same for all
      let economyStrength = faction.economyStrength;
      // Adjust economy strength based on available minirals or technology
      if(faction.production === 'industrial') {
        // can't produce tech without minerals
        if(this.products['minerals'].stock <= 0) return;
        let mineralsDemand = this.calculateChange(distribution['minerals'], economyStrength);
        economyStrength *= Math.min(1, this.products['minerals'].stock / mineralsDemand);
      } else if(faction.production === 'post-industrial') {
      // can't produce luxury without technology
        if(this.products['technology'].stock <= 0) return;
        let technologyDemand = this.calculateChange(distribution['technology'], economyStrength);
        economyStrength *= Math.min(1, this.products['technology'].stock / technologyDemand);
      }
      Market.productTypeKeys.forEach((productType) => {
        if(!(productType in distribution)) return;
        this.products[productType].stock += this.calculateChange(distribution[productType], faction.economyStrength);
      });
    });
  }

  calculateChange(distribution, economyStrength) {
    return distribution * economyStrength * Market.productQtyMult;
  }

  adjustPrices() {
    // make sure qty is within bounds and adjust prices
    Market.productTypeKeys.forEach((productType) => {
      this.products[productType].stock = Math.max(0, Math.min(Market.maximumStock, this.products[productType].stock));
      this.products[productType].price = this.calculatePrice(productType);
    });
  }

  calculatePrice(productType) {
    let type = Market.productTypes[productType];
    let product = this.products[productType];
    // if range between min and max price, base on stock
    let price = product.stock === 0 ? type.maxPrice : Math.min(Math.max(type.minPrice, type.basePrice * ((Market.maximumStock / 2) / product.stock )), type.maxPrice);
    return price;
  }

  /* ---- UNUSED ---- */

  calculateDemand() {
  }

  calculateProductDemand(productType, economyStrength, ethics) {
    switch(productType) {
      case 'food': return this.calculateFoodDemand();
      case 'medicaments': return this.calculateMedicamentsDemand();
      case 'minerals': return this.calculateMineralsDemand();
      case 'technology': return this.calculateTechnologyDemand();
      case 'luxury': return this.calculateLuxuryDemand();
      case 'alcohol': return this.calculateAlcoholDemand();
      case 'weapons': return this.calculateWeaponsDemand();
      case 'drugs': return this.calculateDrugsDemand();
    };
  }

  calculateFoodDemand() {
    let totalEconomyStrength = this.planet.cls.factions.reduce((a, b) => a + b.economyStrength, 0);
    return totalEconomyStrength;
  }

  calculateMedicamentsDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      // if at war x2 demand
      if(faction.diplomacy.war.length > 0) {
        factionDemand *= 2;
        // TODO: add epidemics
      }
      totalDemand += factionDemand;
    }
    return totalDemand;
  }

  calculateMineralsDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      factionDemand *= (1 + faction.technology.applied / 100);
    }
    return totalDemand;
  }

  calculateTechnologyDemand() {
    // multiplied by planetary applied technology level
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      factionDemand *= (1 + planet.cls.technology.applied / 100);
    }
    factionDemand *= Ethics.valuate(faction, 'materialist', 1.1, 1.2);
    factionDemand *= Ethics.valuate(faction, 'spiritualist', 0.9, 0.8);

    return totalDemand;
  }

  calculateLuxuryDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      // authoritarian regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'authoritarian', 1.1, 1.2);
      // individualist regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'individualist', 1.1, 1.2);
      // libertarian regimes have lower demand
      factionDemand *= Ethics.valuate(faction, 'libertarian', 0.9, 0.8);
      // communal regimes have lower demand
      factionDemand *= Ethics.valuate(faction, 'communal', 0.9, 0.8);
    }
    return totalDemand;
  }

  calculateAlcoholDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      // authoritarian regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'authoritarian', 1.1, 1.2);
      // communal regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'communal', 1.1, 1.2);
      // religious regimes have lower demand
      factionDemand *= Ethics.valuate(faction, 'religious', 0.9, 0.8);
    }
    return totalDemand;
  }

  calculateWeaponsDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      // if at war x4 demand
      if(faction.diplomacy.war.length > 0) {
        factionDemand *= 2;
      }
      // authoritarian regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'authoritarian', 1.1, 1.2);
      // militarist regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'militarist', 1.1, 1.2);
      // pacifist regimes have lower demand
      factionDemand *= Ethics.valuate(faction, 'pacifist', 0.9, 0.8);
    }
    return totalDemand;
  }

  calculateDrugsDemand() {
    let totalDemand = 0;
    for(let faction of this.planet.cls.factions) {
      let factionDemand = faction.economyStrength;
      // authoritarian regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'authoritarian', 1.1, 1.2);
      // militarist regimes have higher demand
      factionDemand *= Ethics.valuate(faction, 'militarist', 1.1, 1.2);
      // spiritualist regimes have lower demand
      factionDemand *= Ethics.valuate(faction, 'spiritualist', 0.9, 0.8);
    }
    return totalDemand;
  }
}
