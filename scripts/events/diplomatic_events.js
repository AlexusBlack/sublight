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

