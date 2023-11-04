/* =========== INTEGRATION & ANNEXATION =========== */
const integrationOrAnnexationEvent = new Event('diplomatic_integration_or_annexation', 'faction');
integrationOrAnnexationEvent.mean_months_to_happen = 6;
function isIntegrationTarget(faction) {
  // Nation has no allies
  if(faction.diplomacy.alliance.length > 0) return false;
  // == Integration
  // Nation is protectedBy only 1 nation as is <= 10% in strength than the protector
  if(faction.diplomacy.protectedBy.length === 1) {
    const protector = theGalaxy.factions[faction.diplomacy.protectedBy[0]];
    if(faction.strength / protector.strength <= 0.05) return true;
  }
  return false;
}

function isAnnexationTarget(faction) {
  // == Annexation
  // Nation isn't protected by anyone and is <= 15% in strength than the strongest threatenedBy nation
  if(faction.diplomacy.protectedBy.length > 0) return false;
  // Nation has no allies
  if(faction.diplomacy.alliance.length > 0) return false;
  const strongestThreat = faction.diplomacy.threatenedBy.reduce((strongest, threat) => {
    if(!strongest) return threat;
    if(theGalaxy.factions[threat].strength > theGalaxy.factions[strongest].strength) return threat;
    return strongest;
  }, null);
  if(!strongestThreat) return false;
  if(faction.strength / theGalaxy.factions[strongestThreat].strength <= 0.05) return true;
  return false;
}

integrationOrAnnexationEvent.trigger_func = (faction) => {
  return isIntegrationTarget(faction) || isAnnexationTarget(faction);
};

integrationOrAnnexationEvent.actions_func = (faction) => {
  if(isIntegrationTarget(faction)) {
    const protector = theGalaxy.factions[faction.diplomacy.protectedBy[0]];
    protector.integrateFaction(faction);
  } else if(isAnnexationTarget(faction)) {
    if(faction.diplomacy.threatenedBy.length === 1) {
      const annexator = theGalaxy.factions[faction.diplomacy.threatenedBy[0]];
      annexator.annexFaction(faction);
    } else {
      faction.partitionFaction();
    }
  }
};

/* =========== ALLIES JOIN WAR =========== */
// const alliesJoinWarEvent = new Event('diplomatic_allies_join_war', 'faction');
// alliesJoinWarEvent.mean_months_to_happen = 0;
// alliesJoinWarEvent.trigger_func = (faction) => {
//   // get all war enemies of out allies
//   let alliesEnemies = [...new Set(faction.diplomacy.alliance.reduce((enemies, allyId) => {
//     const ally = theGalaxy.factions[allyId];
//     return enemies.concat(ally.diplomacy.war);
//   }, []))];
//   // remove our own enemies
//   alliesEnemies = alliesEnemies.filter(enemyId => !faction.diplomacy.war.includes(enemyId));
//   // remove our allies
//   alliesEnemies = alliesEnemies.filter(enemyId => !faction.diplomacy.alliance.includes(enemyId));
//   if(alliesEnemies.length === 0) return false;
//   faction._temp_alliesEnemies = alliesEnemies;
//   return true;
// };
//
// alliesJoinWarEvent.actions_func = (faction) => {
//   faction._temp_alliesEnemies.forEach(enemyId => faction.declareWar(enemyId));
// };




