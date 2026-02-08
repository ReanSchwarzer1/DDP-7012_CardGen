// --- UTILITY ---
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// --- DATA: SABOTAGE DECK ---
const generalSabotageCards = [
  { name: "Telepathy Traitor", effect: "Move the Alien +4 tiles towards a target player of your choice." },
  { name: "Critical Failure", effect: "Choose a player. Their next Item usage fails and the Item is discarded." },
  { name: "Mass Hysteria", effect: "All players must make a Noise Check immediately." },
  { name: "Energy Siphon", effect: "Choose 2 players. They each lose 2 Energy." },
  { name: "False Clear", effect: "Designate a room 'Safe'. If a player enters this turn, Spawn a Drone immediately." },
  { name: "Panic Inducer", effect: "Play on a player. They cannot Move more than 1 tile next turn." },
  { name: "Systems Crash", effect: "Trigger 2 Minor Hazard cards immediately." },
  { name: "Dark Whisper", effect: "Teleport the Alien to any Vent Junction on the map." }
];

// --- DATA: PERMANENT HOST ACTIONS (PHASE 2) ---
const roleActionsData = {
  engineer: [
    { name: "Hard Lock", desc: "Seal a door permanently. Requires -5 Energy or Explosives (item) to open." },
    { name: "Power Down", desc: "Drain 3 Energy from any player's Reserves. All players get -1 Movement for the next 2 turns." }
  ],
  scientist: [
    { name: "False Reading", desc: "Draw and resolve 2 Alien Deck cards immediately." },
    { name: "Experimental Lure", desc: "Force any player in a specific room to possess 5 noise." }
  ],
  pilot: [
    { name: "Navigational Error", desc: "Forcefully move another player 4 tiles in YOUR chosen direction or room." },
    { name: "Vent Venting", desc: "Fill any two corridors with gas. Impassable for 1 turn." }
  ],
  medic: [
    { name: "Accelerate Infection", desc: "Advance the Infection Counter on a target player by 1 stage." },
    { name: "False Reading Omega", desc: "Draw and resolve 3 Alien Deck cards immediately." }
  ]
};

// --- DATA: ALIEN ECHOES ---
const alienEchoData = [
  { name: "Faint Echo", effect: "Alien moves 2 tiles toward noise." },
  { name: "Weak Scent", effect: "Alien moves 2 tiles toward encountered player." },
  { name: "Thermal Scan", effect: "Alien moves 3 tiles toward high energy." },
  { name: "Vent Peek", effect: "Check adjacent room. No move." },
  { name: "Minor Evolution", effect: "Alien ignores doors for 1 turn." },
  { name: "Hive Instinct", effect: "Alien moves 1 tile toward Possessed Player." },
  { name: "Nervous Twitch", effect: "Draw 1 Hazard Card." }
];

// --- DATA: HAZARDS ---
const hazardData = [
  { name: "Door Jam", effect: "1 Door closes. Costs 2 Energy to open." },
  { name: "Gravity Glitch", effect: "One player's movement reduced by 1." },
  { name: "Short Circuit", effect: "Player in Electronic room loses 2 Energy." },
  { name: "Local Alarm", effect: "Loudest player's tile is Noise for 1 turn." }
];

// --- STATE ---
let sabotageDeck = [];
let echoDeck = [];
let hazardDeck = [];
let currentHostRole = "";

// --- INITIALIZATION ---
const overlay = document.getElementById("roleSelectionOverlay");
const appMain = document.querySelector(".app");
const hostDisplay = document.getElementById("hostDisplay");
const actionsPanel = document.getElementById("actionsPanel");
const roleActionsList = document.getElementById("roleActionsList");

// NOTE: Ensure HTML only contains buttons for: engineer, scientist, pilot, medic
document.querySelectorAll(".btn-role").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const role = e.target.getAttribute("data-role");
    initPossessed(role);
  });
});

function initPossessed(role) {
  currentHostRole = role;
  hostDisplay.textContent = role.toUpperCase();
  hostDisplay.style.color = "var(--neon-red)";
  
  // 1. Define the Universal Action (Available to everyone)
  const universalAction = { 
    name: "SENSORY OVERLOAD (UNIVERSAL)", 
    desc: "Force a HIDDEN player in your room/adjacent rooms/or 2 tiles away to reveal themselves. (Die rolls: Same room=Auto, Adj=3+, 2 tiles=4+)." 
  };

  // 2. Get specific role actions
  const specificActions = roleActionsData[role] || [];
  
  // 3. Combine them
  const allActions = [universalAction, ...specificActions];

  roleActionsList.innerHTML = ""; // Clear previous
  allActions.forEach(action => {
      const div = document.createElement("div");
      div.className = "action-card";
      // Highlight the universal action
      if(action.name.includes("UNIVERSAL")) {
         div.style.borderLeftColor = "var(--neon-blue)";
         div.style.background = "rgba(0, 243, 255, 0.05)";
      }
      div.innerHTML = `
        <div class="action-title" ${action.name.includes("UNIVERSAL") ? 'style="color:var(--neon-blue)"' : ''}>${action.name}</div>
        <div class="action-desc">${action.desc}</div>
      `;
      roleActionsList.appendChild(div);
  });
  
  // Show Panel
  actionsPanel.style.display = "block";

  // Hide Overlay
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    appMain.style.filter = "none"; 
  }, 500);

  buildDecks();
}

function buildDecks() {
  sabotageDeck = shuffle([...generalSabotageCards]);
  echoDeck = shuffle([...alienEchoData]);
  hazardDeck = shuffle([...hazardData]);
  
  updateStatusUI();
  
  const entry = document.createElement("div");
  entry.className = "log-entry system-msg";
  entry.innerHTML = `
    <div class="log-entry-title">>> HOST ASSIMILATED</div>
    <div class="log-entry-effect">ROLE: ${currentHostRole.toUpperCase()}<br>ACTION PROTOCOLS UNLOCKED.</div>
  `;
  document.getElementById("logOutput").prepend(entry);
}

// --- DRAW LOGIC ---

function drawSabotage() {
  if (sabotageDeck.length === 0) {
    sabotageDeck = shuffle([...generalSabotageCards]);
    logDraw("System", {name: "RECYCLE", effect: "Sabotage options re-compiled."});
  }
  const card = sabotageDeck.shift();
  updateStatusUI();
  logDraw("Sabotage", card);
}

function drawEcho() {
  if (echoDeck.length === 0) {
    echoDeck = shuffle([...alienEchoData]);
    logDraw("System", {name: "RECYCLE", effect: "Alien Echoes re-compiled."});
  }
  const card = echoDeck.shift();
  updateStatusUI();
  logDraw("Echo", card);
}

function drawHazard() {
  if (hazardDeck.length === 0) {
    hazardDeck = shuffle([...hazardData]);
    logDraw("System", {name: "RECYCLE", effect: "Hazard triggers re-compiled."});
  }
  const card = hazardDeck.shift();
  updateStatusUI();
  logDraw("Hazard", card);
}

// --- INTERFERENCE LOGIC ---
function attemptInterference() {
  const roll = Math.floor(Math.random() * 6) + 1;
  let resultType = "";
  let resultText = "";
  let isSuccess = false;

  // RULE: 4-6 Success, 1-3 Failure
  if (roll >= 4) {
    isSuccess = true;
    resultType = "SUCCESS (DESTROY SANITY)";
    resultText = `Target loses <strong>2 Energy</strong> OR <strong>1 Item</strong>.`;
  } else {
    isSuccess = false;
    resultType = "FAILURE";
    resultText = `The possessed player is <strong>Stunned</strong> for 1 turn.`;
  }

  const container = document.createElement("div");
  container.className = `log-entry ${isSuccess ? 'type-hunt' : 'type-hazard'}`;
  
  container.innerHTML = `
    <div class="log-entry-title">>> DESTROY SANITY: ROLL [${roll}]</div>
    <div class="log-entry-meta">RESULT: ${resultType}</div>
    <div class="log-entry-effect"><span class="alert-text">${resultText}</span></div>
  `;
  document.getElementById("logOutput").prepend(container);
}

// --- UI UPDATES ---
function updateStatusUI() {
  document.getElementById("sabotageCount").textContent = String(sabotageDeck.length).padStart(2, '0');
  document.getElementById("echoCount").textContent = String(echoDeck.length).padStart(2, '0');
  document.getElementById("envCount").textContent = String(hazardDeck.length).padStart(2, '0');
}

function logDraw(type, card) {
  let colorClass = "";
  if(type === "Sabotage") colorClass = "type-hunt"; 
  if(type === "Echo") colorClass = "type-evolve"; 
  if(type === "Hazard") colorClass = "type-hazard"; 
  if(type === "System") colorClass = "system-msg";

  const container = document.createElement("div");
  container.className = `log-entry ${colorClass}`;
  
  if(type === "System") {
    container.innerHTML = `<div class="log-entry-title">>> ${card.name}</div><div class="log-entry-effect">${card.effect}</div>`;
  } else {
    container.innerHTML = `
      <div class="log-entry-title">${type.toUpperCase()}: ${card.name.toUpperCase()}</div>
      <div class="log-entry-effect">${card.effect}</div>
    `;
  }
  document.getElementById("logOutput").prepend(container);
}

// --- CONTROLS ---
const deckSelector = document.getElementById("deckSelector");
const masterBtn = document.getElementById("masterDrawBtn");
const interferenceBtn = document.getElementById("interferenceBtn");

deckSelector.addEventListener("change", () => {
  const type = deckSelector.value;
  masterBtn.className = "btn-master"; 
  if(type === "sabotage") {
     masterBtn.classList.add("hunt-mode");
     masterBtn.querySelector(".btn-text").textContent = "EXECUTE SABOTAGE";
  }
  if(type === "echo") {
     masterBtn.classList.add("evolve-mode");
     masterBtn.querySelector(".btn-text").textContent = "TRIGGER ECHO";
  }
  if(type === "hazard") {
     masterBtn.classList.add("env-mode");
     masterBtn.querySelector(".btn-text").textContent = "CAUSE HAZARD";
  }
});

masterBtn.addEventListener("click", () => {
  const type = deckSelector.value;
  masterBtn.style.transform = "scale(0.98)";
  setTimeout(() => masterBtn.style.transform = "scale(1)", 100);

  if (type === "sabotage") drawSabotage();
  else if (type === "echo") drawEcho();
  else if (type === "hazard") drawHazard();
});

interferenceBtn.addEventListener("click", () => {
  if(confirm("Attempt Direct Interference? (Target must be in the same room)")) {
    attemptInterference();
  }
});

document.getElementById("shuffleAllBtn").addEventListener("click", () => {
    if(confirm("RESET CONNECTION?")) {
        location.reload(); 
    }
});

document.getElementById("clearLogBtn").addEventListener("click", () => {
    document.getElementById("logOutput").innerHTML = "";
});