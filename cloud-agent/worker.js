/**
 * MLB Smart Bulb 24/7 Cloud Agent (Cloudflare Worker / Cron Trigger)
 *
 * Matchup Color Rules:
 * - Winning: My Team's Primary Color
 * - 0-0 / Tied: Home Team's Primary Color
 * - Losing: Opposing Team's Primary Color (or Opposite Spectrum if both teams have the same color!)
 */

const TEAM_COLORS = {
  120: "#E8001C", // Washington Nationals (Red)
  109: "#A71930", // Arizona Diamondbacks (Red)
  133: "#00A859", // Athletics (Kelly Green)
  144: "#CE1141", // Atlanta Braves (Red)
  110: "#FF5500", // Baltimore Orioles (Orange)
  111: "#BD3039", // Boston Red Sox (Red)
  112: "#0E3386", // Chicago Cubs (Blue)
  145: "#CBD5E1", // Chicago White Sox (Silver/White)
  113: "#D50032", // Cincinnati Reds (Red)
  114: "#E31937", // Cleveland Guardians (Red)
  115: "#8B5CF6", // Colorado Rockies (Purple)
  116: "#FF6600", // Detroit Tigers (Orange)
  117: "#EB6E1F", // Houston Astros (Orange)
  118: "#004687", // Kansas City Royals (Blue)
  108: "#BA0021", // Los Angeles Angels (Red)
  119: "#005A9C", // Los Angeles Dodgers (Blue)
  146: "#00A3E0", // Miami Marlins (Aqua Blue)
  158: "#FFC52F", // Milwaukee Brewers (Gold)
  142: "#D31145", // Minnesota Twins (Red)
  121: "#0052CC", // New York Mets (Blue)
  147: "#1D4ED8", // New York Yankees (Blue)
  143: "#E81828", // Philadelphia Phillies (Red)
  134: "#FDB827", // Pittsburgh Pirates (Gold)
  135: "#FFC425", // San Diego Padres (Gold)
  137: "#FD5A1E", // San Francisco Giants (Orange)
  136: "#00A896", // Seattle Mariners (Teal)
  138: "#C41E3A", // St. Louis Cardinals (Red)
  139: "#38BDF8", // Tampa Bay Rays (Sky Blue)
  140: "#003278", // Texas Rangers (Blue)
  141: "#134A8E"  // Toronto Blue Jays (Blue)
};

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runMlbBulbCheck(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/check") {
      const result = await runMlbBulbCheck(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    return new Response(
      "MLB Smart Bulb 24/7 Cloud Agent is running! Visit /api/check to trigger an immediate MLB check.",
      { status: 200 }
    );
  }
};

async function runMlbBulbCheck(env) {
  const teamId = Number(env.TEAM_ID || 120); // Default: Washington Nationals (120)
  const myTeamHex = env.TEAM_PRIMARY_HEX || TEAM_COLORS[teamId] || "#E8001C";

  const today = new Date().toISOString().split("T")[0];
  const mlbUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${teamId}&date=${today}&hydrate=linescore,team`;

  const response = await fetch(mlbUrl);
  const data = await response.json();
  const games = data.dates?.[0]?.games || [];

  const stateKey = `last_game_state_${teamId}`;
  const prevStateRaw = env.NATS_STATE ? await env.NATS_STATE.get(stateKey) : null;
  const prevState = prevStateRaw ? JSON.parse(prevStateRaw) : { status: "Preview", teamScore: 0 };

  if (games.length === 0) {
    return { date: today, teamId, status: "No Game Today", action: "none" };
  }

  const game = games[0];
  const isHome = game.teams.home.team.id === teamId;
  const myTeam = isHome ? game.teams.home : game.teams.away;
  const oppTeam = isHome ? game.teams.away : game.teams.home;
  const oppId = oppTeam.team.id;
  const oppTeamHex = TEAM_COLORS[oppId] || "#0052CC";

  const homeTeamHex = isHome ? myTeamHex : oppTeamHex;
  const sameColor = areColorsTooSimilar(myTeamHex, oppTeamHex);
  const losingHex = sameColor ? getOppositeSpectrumHex(myTeamHex) : oppTeamHex;

  const abstractState = game.status.abstractGameState; // 'Preview' | 'Live' | 'Final'
  const teamScore = myTeam.score ?? 0;
  const oppScore = oppTeam.score ?? 0;

  let action = "none";

  if (abstractState === "Live") {
    const scoredRun = prevState.status === "Live" && teamScore > prevState.teamScore;
    let hex = myTeamHex;
    let brightness = 100;

    if (teamScore > oppScore) {
      hex = myTeamHex; // Winning: My Team Color
      brightness = 100;
    } else if (teamScore === oppScore) {
      hex = homeTeamHex; // 0-0 or Tied: Home Team Color
      brightness = 100;
    } else {
      hex = losingHex; // Losing: Opponent Color (or Opposite Spectrum if same color)
      brightness = 85;
    }

    if (scoredRun) {
      await pulseCloudBulb(env, "#FFFFFF", myTeamHex);
      action = `Team Scored! (${teamScore}-${oppScore}) -> Pulsed & Set ${hex}`;
    } else {
      await setCloudBulbState(env, { power: "on", hex, brightness });
      action = `Live Game (${teamScore}-${oppScore}) -> Set ${hex} @ ${brightness}%`;
    }
  } else if (abstractState === "Final" && prevState.status === "Live") {
    const teamWon = teamScore > oppScore;
    if (teamWon) {
      await pulseCloudBulb(env, "#FFFFFF", myTeamHex);
    }
    await setCloudBulbState(env, { power: "off", hex: "#000000", brightness: 0 });
    action = `Game Final (${teamScore}-${oppScore}) -> Turned Bulb OFF`;
  }

  if (env.NATS_STATE) {
    await env.NATS_STATE.put(
      stateKey,
      JSON.stringify({ status: abstractState, teamScore, oppScore, updatedAt: new Date().toISOString() })
    );
  }

  return {
    date: today,
    teamId,
    opponentId: oppId,
    isHome,
    gameStatus: abstractState,
    teamScore,
    oppScore,
    winningHex: myTeamHex,
    tiedHomeHex: homeTeamHex,
    losingHex,
    sameColorFallback: sameColor,
    action
  };
}

function hexToHsl(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function areColorsTooSimilar(hexA, hexB) {
  if (!hexA || !hexB) return false;
  if (hexA.toUpperCase() === hexB.toUpperCase()) return true;
  const hslA = hexToHsl(hexA);
  const hslB = hexToHsl(hexB);
  const hueDiff = Math.abs(hslA.h - hslB.h);
  const shortestHueDiff = Math.min(hueDiff, 360 - hueDiff);
  if (hslA.s < 0.2 && hslB.s < 0.2) return true;
  return shortestHueDiff < 36 && hslA.s >= 0.2 && hslB.s >= 0.2;
}

function getOppositeSpectrumHex(hex) {
  const { h, s, l } = hexToHsl(hex);
  const oppH = ((h + 180) % 360) / 360;
  const oppS = Math.max(0.82, s);
  const oppL = Math.min(0.58, Math.max(0.46, l));

  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = oppL < 0.5 ? oppL * (1 + oppS) : oppL + oppS - oppL * oppS;
  const p = 2 * oppL - q;
  const ro = Math.round(hue2rgb(p, q, oppH + 1 / 3) * 255);
  const go = Math.round(hue2rgb(p, q, oppH) * 255);
  const bo = Math.round(hue2rgb(p, q, oppH - 1 / 3) * 255);

  const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(ro)}${toHex(go)}${toHex(bo)}`;
}

async function setCloudBulbState(env, { power, hex, brightness }) {
  if (env.LIFX_TOKEN) {
    const selector = encodeURIComponent(env.LIFX_SELECTOR || "all");
    await fetch(`https://api.lifx.com/v1/lights/${selector}/state`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${env.LIFX_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        power,
        color: `${hex} brightness:${(brightness / 100).toFixed(2)}`,
        duration: 1.0
      })
    });
  }

  if (env.GOVEE_API_KEY && env.GOVEE_DEVICE) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const rgb = { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    const cmd = power === "off" ? { name: "turn", value: "off" } : { name: "color", value: rgb };

    await fetch("https://developer-api.govee.com/v1/devices/control", {
      method: "PUT",
      headers: {
        "Govee-API-Key": env.GOVEE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        device: env.GOVEE_DEVICE,
        model: env.GOVEE_MODEL || "H6008",
        cmd
      })
    });
  }
}

async function pulseCloudBulb(env, colorHex, fromHex) {
  if (env.LIFX_TOKEN) {
    const selector = encodeURIComponent(env.LIFX_SELECTOR || "all");
    await fetch(`https://api.lifx.com/v1/lights/${selector}/effects/pulse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.LIFX_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        color: colorHex,
        from_color: fromHex,
        period: 0.6,
        cycles: 5,
        power_on: true
      })
    });
  }
}
