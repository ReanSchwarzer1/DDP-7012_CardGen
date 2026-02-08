// --- UTILITY: Fisher-Yates Shuffle ---
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// --- DATA: ENVIRONMENTAL HAZARDS ---
const environmentalHazardCards = [
  { id: "env_hull_breach", name: "Hull Breach", type: "Atmospheric", effect: "Choose a room with a player. For 3 turns, any player starting their turn there loses 2 Energy. Alien is immune." },
  { id: "env_security_lockdown", name: "Security Lockdown", type: "Systemic", effect: "All doors within 5 tiles of the Alien slam shut. Players must spend 3 Energy to force a door open." },
  { id: "env_gravity_fluctuation", name: "Gravity Flux", type: "Mechanical", effect: "For 1 turn, all player movement is halved (round down). Alien is unaffected." },
  { id: "env_gas_leak", name: "Toxic Vapors", type: "Atmospheric", effect: "Place a 'Toxic' marker on a 3x3 area. Players entering must roll 1d6: 1-3 Move randomly, 4-6 No action." },
  { id: "env_power_surge", name: "Power Surge", type: "Systemic", effect: "All players in rooms with 'Electronic' items lose 3 Energy. Any active player traps in those rooms are destroyed." },
  { id: "env_vent_burst", name: "Steam Vent", type: "Mechanical", effect: "Choose a path 4 tiles long. This path is impassable to players for 2 turns due to scalding steam." },
  { id: "env_emergency_klaxon", name: "Emergency Klaxon", type: "Systemic", effect: "An alarm triggers on the loudest player. Their tile counts as 'High Noise' for the next 2 turns." }
];

// --- DATA: HUNT CARDS (Base + Tiers) ---
const baseHuntCards = [
  { id: "hunt_stalking_echo", name: "Stalking Echo", tier: [1, 2, 3], noise: "Medium", effect: "Move 4 tiles toward the player that made the most recent noise. If no noise this turn, move 2 tiles toward the player with the most noise." },
  { id: "hunt_pheromone_trail", name: "Pheromone Trail", tier: [1, 2, 3], noise: "Low", effect: "Move 3 tiles toward any player you've encountered before. If none, move randomly. Use a die to choose." },
  { id: "hunt_thermal_pursuit", name: "Thermal Pursuit", tier: [1, 2, 3], noise: "High", effect: "Move 5 tiles toward the player with the highest accumulated energy or the lowest. Use the d6 to choose, 1-3 for lowest, 5-6 for the highest." },
  { id: "hunt_vent_crawl", name: "Vent Crawl", tier: [1, 2, 3], noise: "Medium", effect: "Move to any Vent Junction and search the adjacent room. Costs alien no movement. Choose the vent with a d6." },
  { id: "hunt_corridor_sweep", name: "Corridor Sweep", tier: [2, 3], noise: "High", effect: "Move 4 tiles to the north and 3 tiles towards the west. Post moving, teleport to the nearest vent." },
  { id: "hunt_room_isolation", name: "Room Isolation", tier: [1, 2, 3], noise: "Medium", effect: "Move 4 tiles toward the area with 2 players that are near 4 tiles of each other." },
  { id: "hunt_feed", name: "Feed", tier: [1, 2, 3], noise: "Medium", effect: "Move 5 tiles towards the player that made the most recent noise. If a player is found, move an additional 5 tiles towards the next closest player." },
  { id: "hunt_bloodlust", name: "Bloodlust", tier: [1, 2, 3], noise: "High", effect: "Move 4 tiles toward any previously captured player. If that player is now possessed, move 6 tiles towards the player nearest the possessed player." },
  { id: "hunt_territorial_snap", name: "Territorial Snap", tier: [2, 3], noise: "Medium", effect: "Move 4 tiles (roll three d6 for sector and room). After moving, search all tiles within a 3-tile radius." },
  { id: "hunt_sonic_retaliation", name: "Sonic Retaliation", tier: [1, 2, 3], noise: "Low", effect: "Move 4 tiles toward the player that used an item this turn. If none, move toward the loudest action." },
  { id: "hunt_double_threat", name: "Double Threat", tier: [1, 2, 3], noise: "Low", effect: "Spawn a temporary clone of the alien (for the next 2 turns) in the adjacent tile to the most recent noise token. Both original and clone move 2 tiles toward the same target player." },
  { id: "hunt_zone_control", name: "Zone Control", tier: [2, 3], noise: "Low", effect: "Place 2 clone markers (for the next 2 turns) in two different vents within 4 tiles of any player. Each clone moves 3 tiles toward the nearest player." },
  { id: "hunt_kill_net", name: "Kill Net", tier: [1, 2, 3], noise: "Low", effect: "Create 2 alien clones in any two vents within 10 tiles of the real alien. Real alien moves 5 tiles; each clone moves 4 tiles toward the nearest unpossessed player." },
  { id: "hunt_item_killer_i", name: "Item Killer (Pilot)", tier: [1, 2, 3], noise: "Low", effect: "Move 4 tiles towards the player that last used an item. If not, move 5 tiles towards the Pilot." },
  { id: "hunt_item_killer_iv", name: "Item Killer (Sci)", tier: [1, 2, 3], noise: "Low", effect: "Move 4 tiles towards the player that last used an item. If not, move 5 tiles towards the Scientist." },
  { id: "hunt_item_killer_v", name: "Item Killer (Eng)", tier: [1, 2, 3], noise: "Low", effect: "Move 4 tiles towards the player that last used an item. If not, move 5 tiles towards the Engineer." },
  { id: "hunt_possession_protocol_ii", name: "Possession Protocol II", tier: [1, 2, 3], noise: "High", effect: "Move 5 tiles toward an unpossessed player nearest to a possessed player." },
  { id: "hunt_vents_are_fun", name: "Vents are Fun", tier: [1, 2, 3], noise: "Low", effect: "Teleport to the Vent Junction nearest to a Safe Room. Decide the nearest tile with a dice roll." },
  { id: "hunt_vents_are_fun_ii", name: "Vents are Fun 2", tier: [2, 3], noise: "Low", effect: "Teleport to the Vent Junction nearest to the Engineer and move 3 tiles towards them." }
];

const tier1HuntAdditions = [
  { id: "hunt_methodical_sweep", name: "Methodical Sweep", tier: [1], noise: "Medium", effect: "Move 3 tiles towards the nearest player." },
  { id: "hunt_cautious_approach", name: "Cautious Approach", tier: [1], noise: "Medium", effect: "Move 6 tiles toward most recent noise. If no noise, move 2 tiles toward nearest Safe Room." },
  { id: "hunt_environmental_glitch", name: "Environmental Glitch", tier: [1], noise: "Low", effect: "Move 2 tiles toward the nearest player AND draw 1 Environmental Hazard card immediately." },
  { id: "hunt_patrol_circuit", name: "Patrol Circuit", tier: [1], noise: "Medium", effect: "If a player is within a 4-tile radius, move 4 spaces toward them. If not, move 4 tiles towards the nearest possible player." },
  { id: "hunt_scent_memory", name: "Scent Memory", tier: [1], noise: "Medium", effect: "Move 6 tiles towards the nearest uncaught player." }
];

const tier2HuntAdditions = [
  { id: "hunt_aggressive_pursuit", name: "Aggressive Pursuit", tier: [2], noise: "High", effect: "Move 7 tiles toward the player with lowest current energy." },
  { id: "hunt_sabotaged_systems", name: "Sabotaged Systems", tier: [2], noise: "Medium", effect: "Move 4 tiles toward the Engine Room. Trigger 1 Environmental Hazard card." },
  { id: "hunt_breach_protocol", name: "Breach Protocol", tier: [2], noise: "High", effect: "Move 7 tiles while ignoring doors in the path." },
  { id: "hunt_vent_ambush", name: "Vent Ambush", tier: [2], noise: "High", effect: "Teleport to the Vent Junction nearest to the noise. If no noise, move 7 tiles toward the lowest energy player." },
  { id: "hunt_swarm_instinct_alpha", name: "Swarm Instinct Alpha", tier: [2], noise: "Medium", effect: "Draw and resolve 1 additional Hunt card immediately." }
];

const tier3HuntAdditions = [
  { id: "hunt_final_hour_frenzy", name: "Final Hour Frenzy", tier: [3], noise: "High", effect: "Move 9 tiles toward the nearest player." },
  { id: "hunt_total_collapse", name: "Total Collapse", tier: [3], noise: "Very High", effect: "Draw and resolve 2 Environmental Hazard cards. Alien then moves 5 tiles toward the board center." },
  { id: "hunt_no_escape", name: "No Escape", tier: [3], noise: "High", effect: "Move 5 tiles toward Escape Pod Bay. Guard position; players must roll 5+ to enter or be captured." },
  { id: "hunt_swarm_instinct_omega", name: "Swarm Instinct Omega", tier: [3], noise: "Very High", effect: "Draw and resolve 3 additional Hunt cards immediately." },
  { id: "hunt_possession_protocol", name: "Possession Protocol", tier: [3], noise: "High", effect: "Move 8 tiles toward an unpossessed player. On capture, possession occurs immediately." }
];

const evolveCards = [
  { id: "evolve_hive_integration", name: "Hive Integration", persists: "Rest of game", effect: "Move 2 tiles toward any possessed player automatically each turn." },
  { id: "evolve_adaptive_hunting", name: "Adaptive Hunting", persists: "Rest of game", effect: "If a player has hidden twice, ignore hiding for that player for the next 1 turn." },
  { id: "evolve_apex_predator", name: "Apex Predator", persists: "3 turns", effect: "Gain +2 for every card action drawn for the next 3 turns." },
  { id: "evolve_nest_claiming", name: "Nest Claiming", persists: "5 turns", effect: "Designate a Safe Room (Lab/Armory) as a Hive. For 5 turns, this room is unusable to players." },
  { id: "evolve_environmental_mastery", name: "Environmental Mastery", persists: "Rest of game", effect: "Once per turn, the Alien may draw and resolve 1 Environmental Hazard card as a free action." },
  { id: "evolve_trap_immunity", name: "Trap Immunity", persists: "Rest of game", effect: "First trap encountered each turn does not activate." },
  { id: "evolve_item_immunity", name: "Item Immunity", persists: "3 turns", effect: "For the next 3 turns, no item works on the alien." }
];

const escalationCards = [
  { id: "esc_collective_scream", name: "Collective Scream", trigger: "Energy ≤ 8 AND 3+ players alive", effect: "All hidden players auto-reveal. Alien moves 5 tiles toward center. Alarm effects +1 permanent." },
  { id: "esc_station_breach", name: "Station Breach", trigger: "Energy ≤ 8 OR Possessed ≥ 4", effect: "2 random rooms sealed for 2 turns. Alien gains +1 card draw. Trigger 1 Environmental Hazard." }
];

// --- STATE MANAGEMENT ---
let currentTurn = 1;
let huntDeck = [];
let evolveDeck = [];
let escalationDeck = [];
let environmentalDeck = [];

// RULES UPDATE: Tier 1 (1-3), Tier 2 (4-6), Tier 3 (7+)
function getHuntTier(turn) {
  if (turn <= 3) return 1;
  if (turn <= 6) return 2;
  return 3;
}

function buildHuntDeckForTier(tier) {
  let deck = [];
  
  if (tier === 1) {
    const base = baseHuntCards.filter(c => c.tier.includes(1));
    deck = [...base, ...tier1HuntAdditions];
  } else if (tier === 2) {
    // RULES: Remove Tier 1 exclusive cards, Add Tier 2
    const base = baseHuntCards.filter(c => c.tier.includes(2));
    deck = [...base, ...tier2HuntAdditions];
  } else {
    // Tier 3
    const base = baseHuntCards.filter(c => c.tier.includes(3));
    deck = [...base, ...tier2HuntAdditions, ...tier3HuntAdditions];
  }

  return shuffle(deck);
}

function resetAllDecks() {
  const tier = getHuntTier(currentTurn);
  huntDeck = buildHuntDeckForTier(tier);
  evolveDeck = shuffle([...evolveCards]);
  escalationDeck = shuffle([...escalationCards]);
  environmentalDeck = shuffle([...environmentalHazardCards]);
  updateStatusUI();
  
  const entry = document.createElement("div");
  entry.className = "log-entry system-msg";
  entry.innerHTML = `
    <div class="log-entry-title">>> SYSTEM_RESET</div>
    <div class="log-entry-effect">ALL DECKS SHUFFLED. TIER ${tier} LOADED (TURN ${currentTurn}).</div>
  `;
  document.getElementById("logOutput").prepend(entry);
}

// --- UI UPDATES ---
const turnInput = document.getElementById("turnInput");
const turnDisplay = document.getElementById("turnDisplay");
const tierDisplay = document.getElementById("tierDisplay");
const huntCountSpan = document.getElementById("huntCount");
const evolveCountSpan = document.getElementById("evolveCount");
const escalationCountSpan = document.getElementById("escalationCount");
const envCountSpan = document.getElementById("envCount");
const logOutput = document.getElementById("logOutput");

function updateStatusUI() {
  const tier = getHuntTier(currentTurn);
  turnDisplay.textContent = String(currentTurn).padStart(2, '0');
  tierDisplay.textContent = String(tier);
  huntCountSpan.textContent = String(huntDeck.length).padStart(2, '0');
  evolveCountSpan.textContent = String(evolveDeck.length).padStart(2, '0');
  escalationCountSpan.textContent = String(escalationDeck.length).padStart(2, '0');
  if(envCountSpan) envCountSpan.textContent = String(environmentalDeck.length).padStart(2, '0');
}

function logDraw(type, card, extra = "") {
  if (!card) return;
  
  let colorClass = "";
  if(type === "Hunt") colorClass = "type-hunt";
  if(type === "Evolve") colorClass = "type-evolve";
  if(type === "Escalation") colorClass = "type-escalate";
  if(type === "Hazard") colorClass = "type-hazard";
  if(type === "System") colorClass = "system-msg";

  const container = document.createElement("div");
  container.className = `log-entry ${colorClass}`;
  
  let meta = "";
  if (type === 'Hunt') meta = `NOISE: ${card.noise}`;
  else if (card.type) meta = `TYPE: ${card.type}`;
  else if (card.persists) meta = `DURATION: ${card.persists}`;
  else if (card.trigger) meta = `COND: ${card.trigger}`;

  if(type === "System") {
      container.innerHTML = `<div class="log-entry-title">>> ${card.name}</div><div class="log-entry-effect">${card.effect}</div>`;
  } else {
      container.innerHTML = `
        <div class="log-entry-title">${type.toUpperCase()}: ${card.name.toUpperCase()}</div>
        <div class="log-entry-meta">${meta}</div>
        <div class="log-entry-effect">${extra ? '<span class="alert-text">' + extra + '</span><br>' : ''}${card.effect}</div>
      `;
  }
  logOutput.prepend(container);
}

// --- DRAW LOGIC ---

function drawEnvironmental(isChain = false) {
  if (environmentalDeck.length === 0) {
    environmentalDeck = shuffle([...environmentalHazardCards]);
    logDraw("System", {name: "CYCLE_HAZARD", effect: "Hazard deck depleted. Reshuffling..."});
  }
  const card = environmentalDeck.shift();
  updateStatusUI();
  logDraw("Hazard", card, isChain ? ">> CHAIN REACTION <<" : "");
}

function drawHunt() {
  if (huntDeck.length === 0) {
     huntDeck = buildHuntDeckForTier(getHuntTier(currentTurn));
     logDraw("System", {name: "CYCLE_HUNT", effect: "Hunt deck depleted. Reshuffling for current Tier."});
  }
  
  const card = huntDeck.shift();
  if(!card) return; // Safety Check

  updateStatusUI();
  logDraw("Hunt", card);

  const effectText = card.effect.toLowerCase();
  
  // Handle Hazard Logic
  if (effectText.includes("resolve 2 environmental hazard")) {
     setTimeout(() => drawEnvironmental(true), 400);
     setTimeout(() => drawEnvironmental(true), 1200);
  } else if (effectText.includes("environmental hazard")) {
     setTimeout(() => drawEnvironmental(true), 400);
  }

  // Handle Swarm Logic
  if (card.id.includes("swarm_instinct")) {
    let extraDraws = 1; 
    if(card.id.includes("omega")) extraDraws = 3;

    setTimeout(() => {
        for (let i = 0; i < extraDraws; i++) {
            setTimeout(() => {
                if (huntDeck.length === 0) {
                    huntDeck = buildHuntDeckForTier(getHuntTier(currentTurn));
                    logDraw("System", {name: "CYCLE_HUNT", effect: "Hunt deck depleted during Swarm. Reshuffling..."});
                }
                const extraCard = huntDeck.shift();
                if(extraCard) {
                    logDraw("Hunt", extraCard, `>> SWARM ACTIVATION [${i+1}/${extraDraws}]`);
                    
                    // Recursive Hazard check for the Swarm card
                    const extraEffect = extraCard.effect.toLowerCase();
                    if (extraEffect.includes("resolve 2 environmental hazard")) {
                        setTimeout(() => drawEnvironmental(true), 400);
                        setTimeout(() => drawEnvironmental(true), 1200);
                    } else if (extraEffect.includes("environmental hazard")) {
                        setTimeout(() => drawEnvironmental(true), 400);
                    }
                }
                updateStatusUI();
            }, i * 800);
        }
    }, 600);
  }
}

function drawEvolve() {
  if (evolveDeck.length === 0) {
    evolveDeck = shuffle([...evolveCards]);
    logDraw("System", {name: "CYCLE_EVOLVE", effect: "Evolve deck recycled."});
  }
  const card = evolveDeck.shift();
  if(!card) return;
  updateStatusUI();
  logDraw("Evolve", card);
}

function drawEscalation() {
  if (escalationDeck.length === 0) {
    escalationDeck = shuffle([...escalationCards]);
    logDraw("System", {name: "CYCLE_EVENT", effect: "Escalation deck recycled."});
  }
  const card = escalationDeck.shift();
  if(!card) return;
  updateStatusUI();
  logDraw("Escalation", card);
  
  if (card.effect.toLowerCase().includes("environmental hazard")) {
      setTimeout(() => drawEnvironmental(true), 300);
  }
}

// --- CONTROLS ---
const deckSelector = document.getElementById("deckSelector");
const masterBtn = document.getElementById("masterDrawBtn");

deckSelector.addEventListener("change", () => {
  const type = deckSelector.value;
  masterBtn.className = "btn-master"; 
  if(type === "hunt") masterBtn.classList.add("hunt-mode");
  if(type === "evolve") masterBtn.classList.add("evolve-mode");
  if(type === "escalation") masterBtn.classList.add("escalate-mode");
  if(type === "hazard") masterBtn.classList.add("env-mode");
});

masterBtn.addEventListener("click", () => {
  const type = deckSelector.value;
  masterBtn.style.transform = "scale(0.98)";
  setTimeout(() => masterBtn.style.transform = "scale(1)", 100);

  if (type === "hunt") drawHunt();
  else if (type === "evolve") drawEvolve();
  else if (type === "escalation") drawEscalation();
  else if (type === "hazard") drawEnvironmental(false);
});

document.getElementById("nextTurnBtn").addEventListener("click", () => {
  currentTurn++;
  turnInput.value = currentTurn;
  const oldTier = parseInt(tierDisplay.textContent);
  const newTier = getHuntTier(currentTurn);
  updateStatusUI();
  
  if (newTier !== oldTier) {
     logDraw("System", {name: "TIER UPGRADE", effect: `Danger Level Increased to Tier ${newTier}. Hunt Deck updated.`});
     huntDeck = buildHuntDeckForTier(newTier);
     updateStatusUI();
  }
  
  if (currentTurn === 4) logDraw("System", {name: "TIER 2", effect: "Add Hazard + Evolve Cards. Remove Tier 1 Hunts."});
  if (currentTurn === 7) logDraw("System", {name: "TIER 3", effect: "Add Tier 3 Hunts."});
});

document.getElementById("setTurnBtn").addEventListener("click", () => {
    const val = parseInt(turnInput.value, 10);
    if(val > 0) {
        currentTurn = val;
        huntDeck = buildHuntDeckForTier(getHuntTier(currentTurn));
        updateStatusUI();
        logDraw("System", {name: "TURN_OVERRIDE", effect: `Turn set to ${currentTurn}. Deck verified for Tier ${getHuntTier(currentTurn)}.`});
    }
});

document.getElementById("shuffleAllBtn").addEventListener("click", () => {
    if(confirm("CONFIRM SYSTEM PURGE? ALL DATA WILL BE RESET.")) {
        currentTurn = 1;
        turnInput.value = 1;
        document.getElementById("logOutput").innerHTML = ""; 
        resetAllDecks();
    }
});

document.getElementById("clearLogBtn").addEventListener("click", () => {
    document.getElementById("logOutput").innerHTML = "";
});

// --- HANDBOOK TOGGLE ---
const handbookSection = document.getElementById("handbookSection");
const toggleHandbookBtn = document.getElementById("toggleHandbookBtn");

if(toggleHandbookBtn && handbookSection) {
  toggleHandbookBtn.addEventListener("click", () => {
    if (handbookSection.style.display === "none" || handbookSection.style.display === "") {
      handbookSection.style.display = "block";
      toggleHandbookBtn.textContent = "CLOSE HANDBOOK [-]";
      toggleHandbookBtn.style.background = "rgba(255, 157, 0, 0.1)";
      handbookSection.scrollIntoView({ behavior: "smooth" });
    } else {
      handbookSection.style.display = "none";
      toggleHandbookBtn.textContent = "HANDBOOK [?]";
      toggleHandbookBtn.style.background = "transparent";
    }
  });
}

// Init
resetAllDecks();