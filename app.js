/**
 * MLB Smart Bulb Cloud Agent & Dashboard (Default: Washington Nationals)
 * Supports all 30 MLB Teams via MLB Stats API.
 *
 * Color Rules:
 * - Winning: My Team's Primary Color
 * - 0-0 / Tied: Home Team's Primary Color
 * - Losing: Opposing Team's Primary Color (or Opposite Spectrum if both teams have the same color!)
 */

const STORAGE_KEY = "natslight_settings_v3";

// All 30 MLB Teams with official MLB Stats API Team IDs & Smart-Bulb-Optimized Primary/Secondary Colors
const MLB_TEAMS = [
  { id: 120, abbr: "WSH", emblem: "W", name: "Washington Nationals", shortName: "Nationals", park: "Nationals Park", primaryHex: "#E8001C", primaryName: "Nationals Scarlet Red", secondaryHex: "#1D3587", secondaryName: "Nationals Navy Blue", rivalId: 121 },
  { id: 109, abbr: "ARI", emblem: "A", name: "Arizona Diamondbacks", shortName: "D-backs", park: "Chase Field", primaryHex: "#A71930", primaryName: "Sedona Red", secondaryHex: "#30CED8", secondaryName: "Sonoran Turquoise", rivalId: 119 },
  { id: 133, abbr: "ATH", emblem: "A's", name: "Athletics", shortName: "Athletics", park: "Sutter Health Park", primaryHex: "#00A859", primaryName: "Kelly Green", secondaryHex: "#EFB21E", secondaryName: "Fort Knox Gold", rivalId: 137 },
  { id: 144, abbr: "ATL", emblem: "A", name: "Atlanta Braves", shortName: "Braves", park: "Truist Park", primaryHex: "#CE1141", primaryName: "Braves Scarlet", secondaryHex: "#13274F", secondaryName: "Braves Navy", rivalId: 121 },
  { id: 110, abbr: "BAL", emblem: "O's", name: "Baltimore Orioles", shortName: "Orioles", park: "Camden Yards", primaryHex: "#FF5500", primaryName: "Orioles Orange", secondaryHex: "#FCD34D", secondaryName: "Camden Amber", rivalId: 147 },
  { id: 111, abbr: "BOS", emblem: "B", name: "Boston Red Sox", shortName: "Red Sox", park: "Fenway Park", primaryHex: "#BD3039", primaryName: "Fenway Red", secondaryHex: "#192C55", secondaryName: "Red Sox Navy", rivalId: 147 },
  { id: 112, abbr: "CHC", emblem: "C", name: "Chicago Cubs", shortName: "Cubs", park: "Wrigley Field", primaryHex: "#0E3386", primaryName: "Cubbie Royal Blue", secondaryHex: "#CC3433", secondaryName: "Wrigley Red", rivalId: 138 },
  { id: 145, abbr: "CWS", emblem: "SOX", name: "Chicago White Sox", shortName: "White Sox", park: "Rate Field", primaryHex: "#CBD5E1", primaryName: "Southside Silver-White", secondaryHex: "#38BDF8", secondaryName: "Ice Blue", rivalId: 114 },
  { id: 113, abbr: "CIN", emblem: "C", name: "Cincinnati Reds", shortName: "Reds", park: "Great American Ball Park", primaryHex: "#D50032", primaryName: "Reds Crimson", secondaryHex: "#F8FAFC", secondaryName: "Riverfront White", rivalId: 134 },
  { id: 114, abbr: "CLE", emblem: "C", name: "Cleveland Guardians", shortName: "Guardians", park: "Progressive Field", primaryHex: "#E31937", primaryName: "Guardians Red", secondaryHex: "#002B5C", secondaryName: "Lake Erie Navy", rivalId: 116 },
  { id: 115, abbr: "COL", emblem: "CR", name: "Colorado Rockies", shortName: "Rockies", park: "Coors Field", primaryHex: "#8B5CF6", primaryName: "Rockies Mountain Purple", secondaryHex: "#CBD5E1", secondaryName: "Silver", rivalId: 109 },
  { id: 116, abbr: "DET", emblem: "D", name: "Detroit Tigers", shortName: "Tigers", park: "Comerica Park", primaryHex: "#FF6600", primaryName: "Tigers Motor City Orange", secondaryHex: "#0C2340", secondaryName: "Detroit Navy", rivalId: 114 },
  { id: 117, abbr: "HOU", emblem: "H", name: "Houston Astros", shortName: "Astros", park: "Daikin Park", primaryHex: "#EB6E1F", primaryName: "Astros Tequila Orange", secondaryHex: "#002D62", secondaryName: "Space City Navy", rivalId: 140 },
  { id: 118, abbr: "KC", emblem: "KC", name: "Kansas City Royals", shortName: "Royals", park: "Kauffman Stadium", primaryHex: "#004687", primaryName: "Royals Royal Blue", secondaryHex: "#BD9B60", secondaryName: "Crown Gold", rivalId: 138 },
  { id: 108, abbr: "LAA", emblem: "A", name: "Los Angeles Angels", shortName: "Angels", park: "Angel Stadium", primaryHex: "#BA0021", primaryName: "Halo Red", secondaryHex: "#862633", secondaryName: "Crimson", rivalId: 119 },
  { id: 119, abbr: "LAD", emblem: "LA", name: "Los Angeles Dodgers", shortName: "Dodgers", park: "Dodger Stadium", primaryHex: "#005A9C", primaryName: "Dodger Blue", secondaryHex: "#EF3E42", secondaryName: "Angeles Red", rivalId: 137 },
  { id: 146, abbr: "MIA", emblem: "M", name: "Miami Marlins", shortName: "Marlins", park: "loanDepot park", primaryHex: "#00A3E0", primaryName: "Miami Aqua Blue", secondaryHex: "#EF3340", secondaryName: "Caliente Red", rivalId: 144 },
  { id: 158, abbr: "MIL", emblem: "M", name: "Milwaukee Brewers", shortName: "Brewers", park: "American Family Field", primaryHex: "#FFC52F", primaryName: "Brewers Barley Gold", secondaryHex: "#12284B", secondaryName: "Brewers Navy", rivalId: 112 },
  { id: 142, abbr: "MIN", emblem: "TC", name: "Minnesota Twins", shortName: "Twins", park: "Target Field", primaryHex: "#D31145", primaryName: "Twins Scarlet Red", secondaryHex: "#002B5C", secondaryName: "North Star Navy", rivalId: 145 },
  { id: 121, abbr: "NYM", emblem: "NY", name: "New York Mets", shortName: "Mets", park: "Citi Field", primaryHex: "#0052CC", primaryName: "Mets Royal Blue", secondaryHex: "#FF5910", secondaryName: "Flushing Orange", rivalId: 120 },
  { id: 147, abbr: "NYY", emblem: "NY", name: "New York Yankees", shortName: "Yankees", park: "Yankee Stadium", primaryHex: "#1D4ED8", primaryName: "Bronx Navy Blue", secondaryHex: "#E2E8F0", secondaryName: "Pinstripe White", rivalId: 111 },
  { id: 143, abbr: "PHI", emblem: "P", name: "Philadelphia Phillies", shortName: "Phillies", park: "Citizens Bank Park", primaryHex: "#E81828", primaryName: "Phillies Pinstripe Red", secondaryHex: "#002D72", secondaryName: "Liberty Blue", rivalId: 120 },
  { id: 134, abbr: "PIT", emblem: "P", name: "Pittsburgh Pirates", shortName: "Pirates", park: "PNC Park", primaryHex: "#FDB827", primaryName: "Pittsburgh Gold", secondaryHex: "#F8FAFC", secondaryName: "Steel White", rivalId: 113 },
  { id: 135, abbr: "SD", emblem: "SD", name: "San Diego Padres", shortName: "Padres", park: "Petco Park", primaryHex: "#FFC425", primaryName: "Friar Gold", secondaryHex: "#8B4513", secondaryName: "Mission Brown", rivalId: 119 },
  { id: 137, abbr: "SF", emblem: "SF", name: "San Francisco Giants", shortName: "Giants", park: "Oracle Park", primaryHex: "#FD5A1E", primaryName: "McCovey Cove Orange", secondaryHex: "#FDE68A", secondaryName: "Bay Cream Gold", rivalId: 119 },
  { id: 136, abbr: "SEA", emblem: "S", name: "Seattle Mariners", shortName: "Mariners", park: "T-Mobile Park", primaryHex: "#00A896", primaryName: "Northwest Green / Teal", secondaryHex: "#0C2C56", secondaryName: "Mariners Navy", rivalId: 117 },
  { id: 138, abbr: "STL", emblem: "STL", name: "St. Louis Cardinals", shortName: "Cardinals", park: "Busch Stadium", primaryHex: "#C41E3A", primaryName: "Cardinal Red", secondaryHex: "#FCD34D", secondaryName: "Beak Gold", rivalId: 112 },
  { id: 139, abbr: "TB", emblem: "TB", name: "Tampa Bay Rays", shortName: "Rays", park: "George M. Steinbrenner Field", primaryHex: "#38BDF8", primaryName: "Columbia Sky Blue", secondaryHex: "#FACC15", secondaryName: "Sunburst Gold", rivalId: 111 },
  { id: 140, abbr: "TEX", emblem: "T", name: "Texas Rangers", shortName: "Rangers", park: "Globe Life Field", primaryHex: "#003278", primaryName: "Texas Blue", secondaryHex: "#C0111F", secondaryName: "Lone Star Red", rivalId: 117 },
  { id: 141, abbr: "TOR", emblem: "TOR", name: "Toronto Blue Jays", shortName: "Blue Jays", park: "Rogers Centre", primaryHex: "#134A8E", primaryName: "Blue Jays Royal Blue", secondaryHex: "#E8291C", secondaryName: "Maple Leaf Red", rivalId: 147 }
];

function getTeamById(id) {
  return MLB_TEAMS.find((t) => t.id === Number(id)) || MLB_TEAMS[0];
}

// Convert Hex to HSL { h: 0..360, s: 0..1, l: 0..1 }
function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l };
}

// Determine if two team colors belong to the same color family on a smart bulb
function areColorsTooSimilar(hexA, hexB) {
  if (!hexA || !hexB) return false;
  if (hexA.toUpperCase() === hexB.toUpperCase()) return true;

  const hslA = hexToHsl(hexA);
  const hslB = hexToHsl(hexB);

  // Shortest angular distance between hues (0..180)
  const hueDiff = Math.abs(hslA.h - hslB.h);
  const shortestHueDiff = Math.min(hueDiff, 360 - hueDiff);

  // If both are low-saturation (white/silver), they are too similar
  if (hslA.s < 0.2 && hslB.s < 0.2) return true;

  // If hues are within 36 degrees (e.g. Red vs Red, Royal Blue vs Navy Blue, Orange vs Orange, Gold vs Gold)
  if (shortestHueDiff < 36 && hslA.s >= 0.2 && hslB.s >= 0.2) {
    return true;
  }
  return false;
}

// Calculate Opposite Spectrum Color (180-degree HSL Hue Rotation, boosted for smart bulb clarity)
function getOppositeSpectrumHex(hex) {
  const { h, s, l } = hexToHsl(hex);
  const oppH = ((h + 180) % 360) / 360;
  const oppS = Math.max(0.82, s);
  const oppL = Math.min(0.58, Math.max(0.46, l));
  return hslToHex(oppH, oppS, oppL);
}

function hslToHex(h, s, l) {
  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function describeSpectrumColor(hex) {
  const { h } = hexToHsl(hex);
  if (h < 20 || h >= 340) return "Opposite Crimson Red";
  if (h < 50) return "Opposite Warm Orange";
  if (h < 70) return "Opposite Golden Yellow";
  if (h < 155) return "Opposite Emerald Green";
  if (h < 200) return "Opposite Cyan / Teal";
  if (h < 255) return "Opposite Electric Blue";
  if (h < 295) return "Opposite Deep Violet";
  return "Opposite Magenta";
}

// Application State
const state = {
  mode: "live", // 'live' | 'simulation'
  lastTeamScore: null,
  lastGameStatus: null,
  liveOpponentId: null,
  liveIsHome: true,
  pulseTimer: null,
  demoTimer: null,
  bulb: {
    power: "off",
    hex: "#000000",
    brightness: 0,
    title: "BULB OFF — No Active Game",
    subtitle: "Waiting for first pitch..."
  },
  settings: {
    teamId: 120, // Default: Washington Nationals
    simOppId: 121, // Default Sim Opponent: New York Mets (Blue)
    simVenue: "home", // 'home' | 'away'
    tiedPreset: "home_team",
    losingPreset: "opponent_or_opposite",
    flashOnScore: true,
    winPulse: true,
    autoOff: true,
    provider: "virtual",
    lifxToken: "",
    lifxSelector: "all",
    goveeKey: "",
    goveeModel: "H6008",
    goveeDevice: "",
    webhookUrl: ""
  }
};

function getSelectedTeam() {
  return getTeamById(state.settings.teamId);
}

function getActiveMatchupContext() {
  const myTeam = getSelectedTeam();
  if (state.mode === "live" && state.liveOpponentId) {
    const oppTeam = getTeamById(state.liveOpponentId);
    const isHome = state.liveIsHome;
    const homeTeam = isHome ? myTeam : oppTeam;
    return { myTeam, oppTeam, isHome, homeTeam };
  }
  const oppTeam = getTeamById(state.settings.simOppId || myTeam.rivalId);
  const isHome = state.settings.simVenue !== "away";
  const homeTeam = isHome ? myTeam : oppTeam;
  return { myTeam, oppTeam, isHome, homeTeam };
}

// DOM Elements
const els = {
  brandLogo: document.getElementById("brandLogo"),
  appTitle: document.getElementById("appTitle"),
  appSubtitle: document.getElementById("appSubtitle"),
  teamSelect: document.getElementById("teamSelect"),
  simOppSelect: document.getElementById("simOppSelect"),
  simVenueSelect: document.getElementById("simVenueSelect"),
  modeDot: document.getElementById("modeDot"),
  modeText: document.getElementById("modeText"),
  checkMlbNowBtn: document.getElementById("checkMlbNowBtn"),
  bulbStage: document.getElementById("bulbStage"),
  bulbHalo: document.getElementById("bulbHalo"),
  bulbGlass: document.getElementById("bulbGlass"),
  bulbEmblem: document.getElementById("bulbEmblem"),
  bulbStateTitle: document.getElementById("bulbStateTitle"),
  bulbStateSub: document.getElementById("bulbStateSub"),
  metricPower: document.getElementById("metricPower"),
  metricColor: document.getElementById("metricColor"),
  metricBrightness: document.getElementById("metricBrightness"),
  bulbTargetBadge: document.getElementById("bulbTargetBadge"),
  trackerCardTitle: document.getElementById("trackerCardTitle"),
  gameSourceBadge: document.getElementById("gameSourceBadge"),
  gameDateText: document.getElementById("gameDateText"),
  gameStatusBadge: document.getElementById("gameStatusBadge"),
  awayAbbr: document.getElementById("awayAbbr"),
  awayName: document.getElementById("awayName"),
  awaySub: document.getElementById("awaySub"),
  awayScore: document.getElementById("awayScore"),
  natsAbbr: document.getElementById("natsAbbr"),
  natsName: document.getElementById("natsName"),
  natsSub: document.getElementById("natsSub"),
  natsScore: document.getElementById("natsScore"),
  simDotTied: document.getElementById("simDotTied"),
  simLabelTied: document.getElementById("simLabelTied"),
  simDotWinning: document.getElementById("simDotWinning"),
  simLabelWinning: document.getElementById("simLabelWinning"),
  simDotLosing: document.getElementById("simDotLosing"),
  simLabelLosing: document.getElementById("simLabelLosing"),
  simLabelScore: document.getElementById("simLabelScore"),
  simLabelWin: document.getElementById("simLabelWin"),
  autoDemoBtn: document.getElementById("autoDemoBtn"),
  colorCollisionBadge: document.getElementById("colorCollisionBadge"),
  collisionBanner: document.getElementById("collisionBanner"),
  winColorSwatch: document.getElementById("winColorSwatch"),
  winColorDesc: document.getElementById("winColorDesc"),
  tiedColorSwatch: document.getElementById("tiedColorSwatch"),
  tiedColorDesc: document.getElementById("tiedColorDesc"),
  loseColorSwatch: document.getElementById("loseColorSwatch"),
  loseColorTitle: document.getElementById("loseColorTitle"),
  loseColorDesc: document.getElementById("loseColorDesc"),
  optTiedHome: document.getElementById("optTiedHome"),
  optTiedMyTeam: document.getElementById("optTiedMyTeam"),
  optLoseOpponent: document.getElementById("optLoseOpponent"),
  optLoseOpposite: document.getElementById("optLoseOpposite"),
  optLoseSecondary: document.getElementById("optLoseSecondary"),
  optLoseDim: document.getElementById("optLoseDim"),
  tiedPreset: document.getElementById("tiedPreset"),
  losingPreset: document.getElementById("losingPreset"),
  labelFlashScore: document.getElementById("labelFlashScore"),
  labelWinPulse: document.getElementById("labelWinPulse"),
  toggleFlashScore: document.getElementById("toggleFlashScore"),
  toggleWinPulse: document.getElementById("toggleWinPulse"),
  toggleAutoOff: document.getElementById("toggleAutoOff"),
  bulbProvider: document.getElementById("bulbProvider"),
  providerStatusBadge: document.getElementById("providerStatusBadge"),
  lifxFields: document.getElementById("lifxFields"),
  lifxToken: document.getElementById("lifxToken"),
  lifxSelector: document.getElementById("lifxSelector"),
  goveeFields: document.getElementById("goveeFields"),
  goveeKey: document.getElementById("goveeKey"),
  goveeModel: document.getElementById("goveeModel"),
  goveeDevice: document.getElementById("goveeDevice"),
  webhookFields: document.getElementById("webhookFields"),
  webhookUrl: document.getElementById("webhookUrl"),
  testRealBulbBtn: document.getElementById("testRealBulbBtn"),
  turnOffBulbBtn: document.getElementById("turnOffBulbBtn"),
  activityLog: document.getElementById("activityLog"),
  clearLogBtn: document.getElementById("clearLogBtn")
};

// Populate MLB Team & Simulated Opponent Dropdowns
function populateTeamDropdowns() {
  els.teamSelect.innerHTML = "";
  const sorted = [...MLB_TEAMS].sort((a, b) => {
    if (a.id === 120) return -1;
    if (b.id === 120) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const team of sorted) {
    const opt = document.createElement("option");
    opt.value = String(team.id);
    opt.textContent = `${team.name} (${team.abbr})`;
    els.teamSelect.appendChild(opt);
  }

  populateOpponentDropdown();
}

function populateOpponentDropdown() {
  const myTeamId = Number(els.teamSelect.value) || state.settings.teamId || 120;
  const myTeam = getTeamById(myTeamId);
  const currentOppId = Number(state.settings.simOppId);

  els.simOppSelect.innerHTML = "";
  const opponents = MLB_TEAMS.filter((t) => t.id !== myTeamId).sort((a, b) => {
    if (a.id === myTeam.rivalId) return -1;
    if (b.id === myTeam.rivalId) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const opp of opponents) {
    const sameColor = areColorsTooSimilar(myTeam.primaryHex, opp.primaryHex);
    const opt = document.createElement("option");
    opt.value = String(opp.id);
    opt.textContent = sameColor
      ? `${opp.name} (${opp.abbr} • Same Color → Uses Opp. Spectrum)`
      : `${opp.name} (${opp.abbr} • ${opp.primaryName})`;
    els.simOppSelect.appendChild(opt);
  }

  if (opponents.some((o) => o.id === currentOppId)) {
    els.simOppSelect.value = String(currentOppId);
  } else {
    state.settings.simOppId = myTeam.rivalId;
    els.simOppSelect.value = String(myTeam.rivalId);
  }
}

// Logging utility
function logEvent(message, type = "normal") {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  const timeStr = new Date().toLocaleTimeString([], { hour12: false });
  const msgClass = type === "highlight" ? "log-msg highlight" : type === "success" ? "log-msg success" : "log-msg";
  entry.innerHTML = `<span class="log-time">[${timeStr}]</span><span class="${msgClass}">${message}</span>`;
  els.activityLog.prepend(entry);
}

// Load & Save Settings
function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      Object.assign(state.settings, JSON.parse(raw));
    }
  } catch (e) {
    console.warn("Could not read settings from localStorage:", e);
  }

  els.teamSelect.value = String(state.settings.teamId || 120);
  populateOpponentDropdown();
  els.simOppSelect.value = String(state.settings.simOppId || getSelectedTeam().rivalId);
  els.simVenueSelect.value = state.settings.simVenue || "home";
  els.tiedPreset.value = state.settings.tiedPreset || "home_team";
  els.losingPreset.value = state.settings.losingPreset || "opponent_or_opposite";
  els.toggleFlashScore.checked = state.settings.flashOnScore;
  els.toggleWinPulse.checked = state.settings.winPulse;
  els.toggleAutoOff.checked = state.settings.autoOff;
  els.bulbProvider.value = state.settings.provider;
  els.lifxToken.value = state.settings.lifxToken;
  els.lifxSelector.value = state.settings.lifxSelector || "all";
  els.goveeKey.value = state.settings.goveeKey;
  els.goveeModel.value = state.settings.goveeModel || "H6008";
  els.goveeDevice.value = state.settings.goveeDevice;
  els.webhookUrl.value = state.settings.webhookUrl;

  updateTeamThemeUI();
  updateProviderFieldsUI();
}

function saveSettings() {
  state.settings.teamId = Number(els.teamSelect.value) || 120;
  state.settings.simOppId = Number(els.simOppSelect.value) || getSelectedTeam().rivalId;
  state.settings.simVenue = els.simVenueSelect.value || "home";
  state.settings.tiedPreset = els.tiedPreset.value;
  state.settings.losingPreset = els.losingPreset.value;
  state.settings.flashOnScore = els.toggleFlashScore.checked;
  state.settings.winPulse = els.toggleWinPulse.checked;
  state.settings.autoOff = els.toggleAutoOff.checked;
  state.settings.provider = els.bulbProvider.value;
  state.settings.lifxToken = els.lifxToken.value.trim();
  state.settings.lifxSelector = els.lifxSelector.value.trim() || "all";
  state.settings.goveeKey = els.goveeKey.value.trim();
  state.settings.goveeModel = els.goveeModel.value.trim() || "H6008";
  state.settings.goveeDevice = els.goveeDevice.value.trim();
  state.settings.webhookUrl = els.webhookUrl.value.trim();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
  } catch (e) {
    console.warn("Could not save settings:", e);
  }

  updateTeamThemeUI();
  updateProviderFieldsUI();
}

// Compute Desired Bulb Color & Brightness for Winning, Tied (0-0), and Losing
function getWinningStyle() {
  const { myTeam } = getActiveMatchupContext();
  return {
    hex: myTeam.primaryHex,
    brightness: 100,
    name: `${myTeam.shortName} ${myTeam.primaryName}`,
    label: `${myTeam.primaryName.toUpperCase()} (${myTeam.abbr} LEADING)`
  };
}

function getTiedStyle() {
  const { myTeam, homeTeam } = getActiveMatchupContext();
  if (state.settings.tiedPreset === "my_team") {
    return {
      hex: myTeam.primaryHex,
      brightness: 100,
      name: `${myTeam.shortName} (${myTeam.primaryName})`,
      label: `${myTeam.primaryName.toUpperCase()} (TIED / 0–0)`
    };
  }
  return {
    hex: homeTeam.primaryHex,
    brightness: 100,
    name: `Home: ${homeTeam.shortName} (${homeTeam.primaryName})`,
    label: `HOME TEAM ${homeTeam.primaryName.toUpperCase()} (TIED / 0–0)`
  };
}

function getLosingStyle() {
  const { myTeam, oppTeam } = getActiveMatchupContext();
  const preset = state.settings.losingPreset;
  const oppSpectrumHex = getOppositeSpectrumHex(myTeam.primaryHex);
  const oppSpectrumName = describeSpectrumColor(oppSpectrumHex);
  const sameColor = areColorsTooSimilar(myTeam.primaryHex, oppTeam.primaryHex);

  if (preset === "opponent_or_opposite") {
    if (sameColor) {
      return {
        hex: oppSpectrumHex,
        brightness: 75,
        isCollisionFallback: true,
        name: `${oppSpectrumName} (${oppTeam.abbr} matches ${myTeam.abbr})`,
        label: `${oppSpectrumName.toUpperCase()} (${myTeam.abbr} TRAILING — SAME COLOR FALLBACK)`
      };
    }
    return {
      hex: oppTeam.primaryHex,
      brightness: 85,
      isCollisionFallback: false,
      name: `${oppTeam.shortName}: ${oppTeam.primaryName}`,
      label: `OPPONENT ${oppTeam.primaryName.toUpperCase()} (${myTeam.abbr} TRAILING)`
    };
  }

  if (preset === "opposite_spectrum") {
    return {
      hex: oppSpectrumHex,
      brightness: 75,
      isCollisionFallback: false,
      name: oppSpectrumName,
      label: `${oppSpectrumName.toUpperCase()} (${myTeam.abbr} TRAILING)`
    };
  }

  if (preset === "team_secondary") {
    return {
      hex: myTeam.secondaryHex,
      brightness: 65,
      isCollisionFallback: false,
      name: myTeam.secondaryName,
      label: `${myTeam.secondaryName.toUpperCase()} (${myTeam.abbr} TRAILING)`
    };
  }

  return {
    hex: myTeam.primaryHex,
    brightness: 25,
    isCollisionFallback: false,
    name: `Dimmed ${myTeam.primaryName}`,
    label: `DIMMED ${myTeam.primaryName.toUpperCase()} (${myTeam.abbr} TRAILING)`
  };
}

// Update UI Labels, Swatches, and Theme Colors for the Selected MLB Team & Matchup
function updateTeamThemeUI() {
  const { myTeam, oppTeam, homeTeam } = getActiveMatchupContext();
  const winStyle = getWinningStyle();
  const tiedStyle = getTiedStyle();
  const loseStyle = getLosingStyle();
  const sameColor = areColorsTooSimilar(myTeam.primaryHex, oppTeam.primaryHex);

  const root = document.documentElement;
  root.style.setProperty("--team-primary", myTeam.primaryHex);
  root.style.setProperty("--team-opposite", loseStyle.hex);

  // Header & Bulb Emblem
  els.brandLogo.textContent = myTeam.emblem;
  els.bulbEmblem.textContent = myTeam.emblem;
  els.appTitle.textContent = myTeam.id === 120 ? "NatsLight Cloud Agent" : `${myTeam.shortName} Light Agent`;
  els.appSubtitle.textContent = `Automatic ${myTeam.name} Smart Bulb Controller`;
  els.trackerCardTitle.textContent = `⚾ ${myTeam.shortName} Game Tracker`;

  // Dropdown Option Labels
  els.optTiedHome.textContent = `Home Team Color (${homeTeam.shortName}: ${homeTeam.primaryHex})`;
  els.optTiedMyTeam.textContent = `Always ${myTeam.shortName} Color (${myTeam.primaryHex})`;
  els.optLoseOpponent.textContent = sameColor
    ? `Opponent Color → Auto Opposite Spectrum (${oppTeam.abbr} is also ${oppTeam.primaryName})`
    : `Opposing Team Color (${oppTeam.shortName}: ${oppTeam.primaryName})`;
  els.optLoseOpposite.textContent = `Always Opposite Spectrum (180° Hue Shift)`;
  els.optLoseSecondary.textContent = `${myTeam.shortName} Secondary (${myTeam.secondaryName})`;
  els.optLoseDim.textContent = `Dimmed ${myTeam.primaryName} (25%)`;

  // 3-Way Swatch Preview Bar
  els.winColorSwatch.style.background = winStyle.hex;
  els.winColorSwatch.style.boxShadow = `0 0 12px ${winStyle.hex}`;
  els.winColorDesc.textContent = `${myTeam.shortName}: ${myTeam.primaryName} (${winStyle.hex})`;

  els.tiedColorSwatch.style.background = tiedStyle.hex;
  els.tiedColorSwatch.style.boxShadow = `0 0 12px ${tiedStyle.hex}`;
  els.tiedColorDesc.textContent = `${tiedStyle.name} (${tiedStyle.hex})`;

  els.loseColorSwatch.style.background = loseStyle.hex;
  els.loseColorSwatch.style.boxShadow = `0 0 12px ${loseStyle.hex}`;
  els.loseColorTitle.textContent = loseStyle.isCollisionFallback
    ? "Losing (Opposite Spectrum Fallback)"
    : "Losing (Opponent Color)";
  els.loseColorDesc.textContent = `${loseStyle.name} (${loseStyle.hex})`;

  // Collision Alert Banner
  const showBanner = sameColor && state.settings.losingPreset === "opponent_or_opposite";
  els.collisionBanner.classList.toggle("hidden", !showBanner);
  els.colorCollisionBadge.textContent = showBanner ? "Opposite Spectrum Active" : "Dynamic Matchup Rules";

  // Simulator Buttons & Dots
  els.simDotTied.style.background = tiedStyle.hex;
  els.simLabelTied.textContent = `0–0 / Tied 2–2 (Home: ${homeTeam.abbr})`;
  els.simDotWinning.style.background = winStyle.hex;
  els.simDotWinning.style.boxShadow = `0 0 8px ${winStyle.hex}`;
  els.simLabelWinning.textContent = `${myTeam.abbr} Winning 5–2 (${myTeam.abbr} Color)`;
  els.simDotLosing.style.background = loseStyle.hex;
  els.simDotLosing.style.boxShadow = `0 0 8px ${loseStyle.hex}`;
  els.simLabelLosing.textContent = loseStyle.isCollisionFallback
    ? `${myTeam.abbr} Losing 2–4 (Opposite Spectrum)`
    : `${myTeam.abbr} Losing 2–4 (${oppTeam.abbr} Color)`;
  els.simLabelScore.textContent = `⚡ Event: ${myTeam.shortName} Score a Run!`;
  els.simLabelWin.textContent = myTeam.id === 120
    ? "🎉 Final: Curly W Win! (Then Off)"
    : `🎉 Final: ${myTeam.shortName} Win! (Then Off)`;

  els.labelFlashScore.textContent = `⚡ Flash Bulb When ${myTeam.shortName} Score a Run`;
  els.labelWinPulse.textContent = myTeam.id === 120
    ? '🎉 "Curly W" Victory Celebration Pulse'
    : `🎉 ${myTeam.shortName} Victory Celebration Pulse`;
  els.testRealBulbBtn.textContent = `💡 Test Bulb: ${myTeam.primaryName}`;
}

function updateProviderFieldsUI() {
  const p = state.settings.provider;
  els.lifxFields.classList.toggle("hidden", p !== "lifx");
  els.goveeFields.classList.toggle("hidden", p !== "govee");
  els.webhookFields.classList.toggle("hidden", p !== "webhook");

  const labels = {
    virtual: "Simulated Mode",
    lifx: "LIFX Cloud Active",
    govee: "Govee Cloud Active",
    webhook: "Webhook Active"
  };
  els.providerStatusBadge.textContent = labels[p] || "Simulated Mode";
  els.bulbTargetBadge.textContent = p === "virtual" ? "Virtual Bulb" : `Virtual + ${p.toUpperCase()}`;
}

// Render Virtual Bulb and Dispatch to Real Cloud Bulb
async function applyBulbState({ power, hex, brightness, title, subtitle, pulse = false }) {
  if (state.pulseTimer) {
    clearTimeout(state.pulseTimer);
    state.pulseTimer = null;
  }

  state.bulb = { power, hex, brightness, title, subtitle };

  const root = document.documentElement;
  if (power === "off" || brightness === 0) {
    els.bulbGlass.classList.add("off");
    els.bulbGlass.classList.remove("pulsing");
    root.style.setProperty("--bulb-color", "#334155");
    root.style.setProperty("--bulb-glow", "rgba(51, 65, 85, 0)");
    root.style.setProperty("--bulb-opacity", "0.15");
    els.metricPower.textContent = "OFF";
    els.metricColor.textContent = "—";
    els.metricBrightness.textContent = "0%";
  } else {
    els.bulbGlass.classList.remove("off");
    els.bulbGlass.classList.toggle("pulsing", Boolean(pulse));
    const alpha = Math.max(0.25, (brightness / 100) * 0.75);
    root.style.setProperty("--bulb-color", hex);
    root.style.setProperty("--bulb-glow", hexToRgba(hex, alpha));
    root.style.setProperty("--bulb-opacity", String(Math.max(0.3, brightness / 100)));
    els.metricPower.textContent = pulse ? "PULSING" : "ON";
    els.metricColor.textContent = hex.toUpperCase();
    els.metricBrightness.textContent = `${brightness}%`;
  }

  els.bulbStateTitle.textContent = title;
  els.bulbStateSub.textContent = subtitle;

  // Dispatch to cloud hardware if configured
  await syncHardwareBulb({ power, hex, brightness, pulse, title });
}

// Flash Animation when Selected Team Scores a Run or Wins
function triggerCelebrationEffect({ type, returnState }) {
  const { myTeam } = getActiveMatchupContext();
  const winStyle = getWinningStyle();

  if (type === "score") {
    logEvent(`⚡ ${myTeam.name.toUpperCase()} SCORED! Triggering ${myTeam.primaryName} & White celebration flash!`, "highlight");
    applyBulbState({
      power: "on",
      hex: winStyle.hex,
      brightness: 100,
      title: `🚨 ${myTeam.shortName.toUpperCase()} SCORE A RUN! 🚨`,
      subtitle: "Flashing bulb in celebration...",
      pulse: true
    });

    state.pulseTimer = setTimeout(() => {
      if (returnState) applyBulbState(returnState);
    }, 4500);
  } else if (type === "win") {
    const winBanner = myTeam.id === 120
      ? "🎉 IT'S A CURLY W! NATIONALS WIN! 🎉"
      : `🎉 ${myTeam.name.toUpperCase()} WIN! 🎉`;

    logEvent(`${winBanner} Running victory pulse before power-off.`, "success");
    applyBulbState({
      power: "on",
      hex: winStyle.hex,
      brightness: 100,
      title: winBanner,
      subtitle: state.settings.autoOff
        ? "Victory celebration active — bulb will turn off in 6 seconds..."
        : "Victory celebration active!",
      pulse: true
    });

    if (state.settings.autoOff) {
      state.pulseTimer = setTimeout(() => {
        applyBulbState({
          power: "off",
          hex: "#000000",
          brightness: 0,
          title: `BULB OFF — Game Final (${myTeam.shortName} Win)`,
          subtitle: `Automatically powered off after ${myTeam.shortName} victory celebration.`
        });
        logEvent("🌙 Game ended — bulb automatically turned OFF.");
      }, 6000);
    }
  }
}

// Cloud Smart Bulb Hardware Dispatcher (LIFX, Govee, Webhook)
async function syncHardwareBulb({ power, hex, brightness, pulse, title }) {
  const provider = state.settings.provider;
  if (provider === "virtual") return;

  try {
    if (provider === "lifx") {
      if (!state.settings.lifxToken) {
        logEvent("⚠️ LIFX selected, but no Personal Access Token is entered yet.");
        return;
      }
      const selector = encodeURIComponent(state.settings.lifxSelector || "all");
      if (pulse && power === "on") {
        await fetch(`https://api.lifx.com/v1/lights/${selector}/effects/pulse`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.settings.lifxToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            color: "#FFFFFF",
            from_color: hex,
            period: 0.6,
            cycles: 5,
            power_on: true
          })
        });
        logEvent(`☁️ Sent LIFX Cloud Pulse effect to [${state.settings.lifxSelector}]`, "success");
      } else {
        await fetch(`https://api.lifx.com/v1/lights/${selector}/state`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${state.settings.lifxToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            power,
            color: `${hex} brightness:${(brightness / 100).toFixed(2)}`,
            duration: 0.8
          })
        });
        logEvent(`☁️ Updated LIFX bulb [${state.settings.lifxSelector}] → ${power.toUpperCase()} (${hex} @ ${brightness}%)`, "success");
      }
    } else if (provider === "govee") {
      if (!state.settings.goveeKey || !state.settings.goveeDevice) {
        logEvent("⚠️ Govee selected, but API Key or Device MAC is missing.");
        return;
      }
      const rgb = hexToRgb(hex);
      const cmd = power === "off"
        ? { name: "turn", value: "off" }
        : { name: "color", value: { r: rgb.r, g: rgb.g, b: rgb.b } };

      await fetch("https://developer-api.govee.com/v1/devices/control", {
        method: "PUT",
        headers: {
          "Govee-API-Key": state.settings.goveeKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          device: state.settings.goveeDevice,
          model: state.settings.goveeModel || "H6008",
          cmd
        })
      });
      logEvent(`☁️ Updated Govee bulb [${state.settings.goveeModel}] → ${power.toUpperCase()} (${hex})`, "success");
    } else if (provider === "webhook" && state.settings.webhookUrl) {
      await fetch(state.settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team: getSelectedTeam().name,
          power,
          hex,
          brightness,
          pulse,
          title,
          timestamp: new Date().toISOString()
        })
      });
      logEvent(`☁️ Sent state webhook to ${state.settings.webhookUrl}`, "success");
    }
  } catch (err) {
    logEvent(`⚠️ Hardware API request note: ${err.message}`);
  }
}

// Evaluate Game Data and Update Scoreboard + Bulb
function evaluateGameState(gameInfo, isSimulated = false) {
  const { myTeam, homeTeam } = getActiveMatchupContext();
  const {
    dateLabel,
    statusBadge,
    abstractState, // 'Preview' | 'Live' | 'Final'
    oppAbbr,
    oppName,
    oppLocation,
    oppScore,
    teamLocation,
    teamScore,
    forceScoreFlash = false
  } = gameInfo;

  // Update Scoreboard UI
  els.gameDateText.textContent = dateLabel;
  els.gameStatusBadge.textContent = statusBadge;
  els.awayAbbr.textContent = oppAbbr;
  els.awayName.textContent = oppName;
  els.awaySub.textContent = oppLocation;
  els.awayScore.textContent = oppScore !== null && oppScore !== undefined ? oppScore : "-";
  els.natsAbbr.textContent = myTeam.abbr;
  els.natsName.textContent = myTeam.name;
  els.natsSub.textContent = `${teamLocation} • Team ID #${myTeam.id}`;
  els.natsScore.textContent = teamScore !== null && teamScore !== undefined ? teamScore : "-";

  updateTeamThemeUI();

  // Determine Bulb Action
  if (abstractState === "Preview") {
    state.lastTeamScore = null;
    applyBulbState({
      power: "off",
      hex: "#000000",
      brightness: 0,
      title: "BULB OFF — Waiting for First Pitch",
      subtitle: `${oppName} vs. ${myTeam.name} (${statusBadge})`
    });
    return;
  }

  if (abstractState === "Final") {
    const teamWon = teamScore > oppScore;
    if (teamWon && state.settings.winPulse && (isSimulated || state.lastGameStatus === "Live")) {
      state.lastGameStatus = "Final";
      triggerCelebrationEffect({ type: "win" });
      return;
    }

    state.lastGameStatus = "Final";
    if (state.settings.autoOff) {
      applyBulbState({
        power: "off",
        hex: "#000000",
        brightness: 0,
        title: "BULB OFF — Game Final",
        subtitle: `Final Score: ${myTeam.abbr} ${teamScore}, ${oppAbbr} ${oppScore}`
      });
    } else {
      const style = teamWon ? getWinningStyle() : getLosingStyle();
      applyBulbState({
        power: "on",
        hex: style.hex,
        brightness: style.brightness,
        title: `GAME FINAL — ${myTeam.abbr} ${teamScore}, ${oppAbbr} ${oppScore}`,
        subtitle: "Auto-off is disabled in settings."
      });
    }
    return;
  }

  // Game is LIVE ('Live')
  const isWinning = teamScore > oppScore;
  const isTied = teamScore === oppScore;
  const style = isWinning ? getWinningStyle() : isTied ? getTiedStyle() : getLosingStyle();

  const venueNote = isTied ? ` (Home Team: ${homeTeam.shortName})` : "";
  const targetState = {
    power: "on",
    hex: style.hex,
    brightness: style.brightness,
    title: `💡 ${style.label}`,
    subtitle: `${statusBadge} • ${myTeam.name} ${teamScore}, ${oppName} ${oppScore}${venueNote}`,
    pulse: false
  };

  const scoredNewRun =
    forceScoreFlash ||
    (state.lastTeamScore !== null && teamScore > state.lastTeamScore && state.lastGameStatus === "Live");

  state.lastTeamScore = teamScore;
  state.lastGameStatus = "Live";

  if (scoredNewRun && state.settings.flashOnScore) {
    triggerCelebrationEffect({ type: "score", returnState: targetState });
  } else {
    applyBulbState(targetState);
  }
}

// Fetch Live MLB Schedule & Score from MLB Stats API for Selected Team
async function checkLiveMlbSchedule() {
  stopAutoDemo();
  const team = getSelectedTeam();
  state.mode = "live";
  els.modeDot.classList.remove("sim");
  els.modeText.textContent = "MLB Live API Connected";
  els.gameSourceBadge.textContent = "MLB Stats API";
  document.querySelectorAll(".sim-btn").forEach((b) => b.classList.remove("active-sim"));

  const today = new Date().toISOString().split("T")[0];
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${team.id}&date=${today}&hydrate=linescore,team`;

  try {
    logEvent(`📡 Checking MLB Stats API for ${team.name} (${today})...`);
    const res = await fetch(url);
    const data = await res.json();
    const games = data.dates?.[0]?.games || [];

    if (games.length === 0) {
      state.liveOpponentId = null;
      logEvent(`⚾ No ${team.name} game scheduled today (Off-Day / Off-Season). Bulb is OFF.`);
      evaluateGameState({
        dateLabel: `Today (${today}) • No Game Scheduled`,
        statusBadge: "OFF-DAY / OFF-SEASON",
        abstractState: "Preview",
        oppAbbr: "MLB",
        oppName: "No Opponent Today",
        oppLocation: "Use Test Simulator below to preview live states!",
        oppScore: "-",
        teamLocation: team.park,
        teamScore: "-"
      });
      return;
    }

    const game = games[0];
    const isHome = game.teams.home.team.id === team.id;
    const myTeamData = isHome ? game.teams.home : game.teams.away;
    const oppTeamData = isHome ? game.teams.away : game.teams.home;
    state.liveOpponentId = oppTeamData.team.id;
    state.liveIsHome = isHome;

    const abstractState = game.status.abstractGameState; // 'Preview', 'Live', 'Final'
    const detailedState = game.status.detailedState;
    const linescore = game.linescore;

    let statusBadge = detailedState.toUpperCase();
    if (abstractState === "Live" && linescore?.currentInningOrdinal) {
      statusBadge = `${linescore.inningState || ""} ${linescore.currentInningOrdinal}`.trim().toUpperCase();
    }

    logEvent(`⚾ Found MLB Game: ${team.abbr} vs. ${oppTeamData.team.name} — Status: ${statusBadge}`);

    evaluateGameState({
      dateLabel: `Live MLB Schedule (${today})`,
      statusBadge,
      abstractState,
      oppAbbr: oppTeamData.team.abbreviation || getTeamById(oppTeamData.team.id).abbr,
      oppName: oppTeamData.team.name,
      oppLocation: isHome ? "Away" : "Home",
      oppScore: oppTeamData.score ?? 0,
      teamLocation: isHome ? "Home" : "Away",
      teamScore: myTeamData.score ?? 0
    });
  } catch (err) {
    logEvent(`⚠️ Could not reach MLB API (${err.message}). Try Simulation Mode below!`);
  }
}

// Build Dynamic Simulation Scenario for the Currently Selected Team, Opponent & Venue
function getSimScenarioForTeam(key) {
  const { myTeam, oppTeam, isHome, homeTeam } = getActiveMatchupContext();
  const oppLocation = isHome ? "Away" : `Home (${oppTeam.park})`;
  const teamLocation = isHome ? `Home (${myTeam.park})` : "Away";

  const scenarios = {
    pregame: {
      dateLabel: `Simulated Game • ${homeTeam.park}`,
      statusBadge: "PRE-GAME • 7:05 PM",
      abstractState: "Preview",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 0,
      teamLocation,
      teamScore: 0
    },
    tied: {
      dateLabel: `Simulated Live Game • ${homeTeam.park}`,
      statusBadge: `TOP 4TH • TIED (HOME: ${homeTeam.abbr})`,
      abstractState: "Live",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 2,
      teamLocation,
      teamScore: 2
    },
    winning: {
      dateLabel: `Simulated Live Game • ${homeTeam.park}`,
      statusBadge: `BOT 6TH • ${myTeam.abbr} LEADING`,
      abstractState: "Live",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 2,
      teamLocation,
      teamScore: 5
    },
    losing: {
      dateLabel: `Simulated Live Game • ${homeTeam.park}`,
      statusBadge: `TOP 8TH • ${myTeam.abbr} TRAILING`,
      abstractState: "Live",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 4,
      teamLocation,
      teamScore: 2
    },
    score_run: {
      dateLabel: `Simulated Live Game • ${homeTeam.park}`,
      statusBadge: "BOT 7TH • HOME RUN!",
      abstractState: "Live",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 3,
      teamLocation,
      teamScore: 6,
      forceScoreFlash: true
    },
    curly_w: {
      dateLabel: `Simulated Final • ${homeTeam.park}`,
      statusBadge: myTeam.id === 120 ? "FINAL • CURLY W!" : `FINAL • ${myTeam.abbr} WIN!`,
      abstractState: "Final",
      oppAbbr: oppTeam.abbr,
      oppName: oppTeam.name,
      oppLocation,
      oppScore: 3,
      teamLocation,
      teamScore: 6
    }
  };
  return scenarios[key];
}

function runSimulationScenario(key, buttonEl = null) {
  state.mode = "simulation";
  const scenario = getSimScenarioForTeam(key);
  if (!scenario) return;

  els.modeDot.classList.add("sim");
  els.modeText.textContent = "Simulation Mode Active";
  els.gameSourceBadge.textContent = "Simulator";

  document.querySelectorAll(".sim-btn").forEach((b) => b.classList.remove("active-sim"));
  if (buttonEl) buttonEl.classList.add("active-sim");

  const { myTeam, oppTeam } = getActiveMatchupContext();
  logEvent(`🧪 Simulator (${myTeam.abbr} vs ${oppTeam.abbr}): Switched to [${key.toUpperCase()}]`);
  evaluateGameState(scenario, true);
}

// Auto-Play Demo Sequence
function stopAutoDemo() {
  if (state.demoTimer) {
    clearInterval(state.demoTimer);
    state.demoTimer = null;
    els.autoDemoBtn.textContent = "▶️ Auto-Play Demo Game";
  }
}

function toggleAutoDemo() {
  if (state.demoTimer) {
    stopAutoDemo();
    logEvent("⏹️ Stopped Auto-Play Demo.");
    return;
  }

  const sequence = ["pregame", "tied", "losing", "score_run", "winning", "curly_w"];
  let idx = 0;
  els.autoDemoBtn.textContent = "⏹️ Stop Demo";
  logEvent(`▶️ Starting Auto-Play ${getSelectedTeam().name} Game Demo (cycles every 4.5s)...`, "highlight");

  const runNext = () => {
    const key = sequence[idx];
    const btn = document.querySelector(`.sim-btn[data-sim="${key}"]`);
    runSimulationScenario(key, btn);
    idx = (idx + 1) % sequence.length;
  };

  runNext();
  state.demoTimer = setInterval(runNext, 4800);
}

// Color Helpers
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Event Listeners
function initApp() {
  populateTeamDropdowns();
  loadSettings();

  // My MLB Team Dropdown Change Listener
  els.teamSelect.addEventListener("change", () => {
    populateOpponentDropdown();
    saveSettings();
    const { myTeam, oppTeam } = getActiveMatchupContext();
    logEvent(`⚾ Selected ${myTeam.name} (Default Opponent: ${oppTeam.name})`, "highlight");

    const activeBtn = document.querySelector(".sim-btn.active-sim");
    if (state.mode === "simulation" && activeBtn) {
      runSimulationScenario(activeBtn.dataset.sim, activeBtn);
    } else {
      checkLiveMlbSchedule();
    }
  });

  // Simulated Opponent & Venue Change Listeners
  [els.simOppSelect, els.simVenueSelect].forEach((sel) => {
    sel.addEventListener("change", () => {
      saveSettings();
      const activeBtn = document.querySelector(".sim-btn.active-sim") || document.querySelector('.sim-btn[data-sim="losing"]');
      runSimulationScenario(activeBtn.dataset.sim, activeBtn);
    });
  });

  // Simulator buttons
  document.querySelectorAll(".sim-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopAutoDemo();
      runSimulationScenario(btn.dataset.sim, btn);
    });
  });

  els.autoDemoBtn.addEventListener("click", toggleAutoDemo);
  els.checkMlbNowBtn.addEventListener("click", checkLiveMlbSchedule);

  // Settings change listeners
  [
    els.tiedPreset,
    els.losingPreset,
    els.toggleFlashScore,
    els.toggleWinPulse,
    els.toggleAutoOff,
    els.bulbProvider,
    els.lifxToken,
    els.lifxSelector,
    els.goveeKey,
    els.goveeModel,
    els.goveeDevice,
    els.webhookUrl
  ].forEach((input) => {
    input.addEventListener("change", () => {
      saveSettings();
      const activeBtn = document.querySelector(".sim-btn.active-sim");
      if (activeBtn && activeBtn.dataset.sim !== "score_run" && activeBtn.dataset.sim !== "curly_w") {
        runSimulationScenario(activeBtn.dataset.sim, activeBtn);
      }
    });
  });

  // Manual Hardware Test Buttons
  els.testRealBulbBtn.addEventListener("click", () => {
    stopAutoDemo();
    saveSettings();
    const team = getSelectedTeam();
    logEvent(`💡 Manual Test: Turning bulb ${team.primaryName} (${team.primaryHex} @ 100%)`, "highlight");
    applyBulbState({
      power: "on",
      hex: team.primaryHex,
      brightness: 100,
      title: `💡 MANUAL TEST — ${team.primaryName.toUpperCase()}`,
      subtitle: `Testing ${team.name} winning color at 100% brightness`,
      pulse: false
    });
  });

  els.turnOffBulbBtn.addEventListener("click", () => {
    stopAutoDemo();
    saveSettings();
    logEvent("⚫ Manual Test: Turning bulb OFF");
    applyBulbState({
      power: "off",
      hex: "#000000",
      brightness: 0,
      title: "BULB OFF — Manual Override",
      subtitle: "Turned off manually"
    });
  });

  els.clearLogBtn.addEventListener("click", () => {
    els.activityLog.innerHTML = "";
    logEvent("Log cleared.");
  });

  // Initial MLB Live Check + 60-second background poll
  const team = getSelectedTeam();
  logEvent(`🚀 MLB Smart Bulb Agent initialized for ${team.name} (Team ID: ${team.id}).`);
  checkLiveMlbSchedule();
  setInterval(() => {
    if (state.mode === "live") {
      checkLiveMlbSchedule();
    }
  }, 60000);
}

document.addEventListener("DOMContentLoaded", initApp);
