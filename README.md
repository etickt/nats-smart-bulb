# NatsLight — Washington Nationals Smart Bulb Cloud Agent & Dashboard

An interactive web app and 24/7 cloud agent that monitors the **Washington Nationals** (`MLB Team ID: 120`) via the official MLB Stats API and controls a smart bulb in real time.

## ✨ What It Does
- **Pre-Game / Off-Day:** Keeps the bulb **OFF** while waiting for first pitch.
- **Game Starts / Tied / Nationals Winning:** Turns the bulb **Bright Nationals Scarlet Red (`#E8001C`)** at 100% brightness.
- **Nationals Trailing (Losing):** Switches the bulb to **Nationals Navy Blue (`#1D3587`)**, **Dimmed Red (25%)**, or **Bullpen Amber (`#F59E0B`)** (user-configurable).
- **Nationals Score a Run:** Flashes/pulses the bulb in celebration and returns to the active game color.
- **Curly W Victory / Game Over:** Runs a celebratory victory pulse when the Nationals win, then **turns the bulb OFF automatically** when the game ends.
- **Off-Season / Anytime Simulator:** Includes one-click test buttons and an **Auto-Play Demo Game** mode so you or your friends can test every game state even when the Nationals aren't playing today.

---

## 🚀 How to Run Right Now (Zero Installation)
1. Double-click [`index.html`](./index.html) to open the dashboard in Chrome, Edge, or any browser.
2. Click **▶️ Auto-Play Demo Game** or click any of the **Test & Simulation Mode** buttons (*First Pitch/Tied*, *Nats Winning*, *Nats Losing*, *Nats Score a Run*, *Curly W Win*) to watch the Virtual Smart Bulb react immediately.
3. Have a **LIFX** or **Govee** Wi-Fi bulb? Select your bulb brand under **Connect a Real Smart Bulb**, paste your API key, and click **🔴 Test Bulb: Flash Nationals Red**.

---

## ☁️ Deploying the 24/7 Cloud Agent (Optional)
The [`cloud-agent/`](./cloud-agent/) folder contains a ready-to-deploy **Cloudflare Worker** ([`worker.js`](./cloud-agent/worker.js)) configured to run every minute in the cloud for free (`crons = ["* * * * *"]`), even when your computer is turned off:

1. Install **Node.js** and sign up for a free **Cloudflare** account.
2. Open a terminal in `cloud-agent/` and run:
   ```bash
   npx wrangler login
   npx wrangler secret put LIFX_TOKEN
   npx wrangler deploy
   ```
3. To share the web dashboard (`index.html`, `styles.css`, `app.js`) with non-technical friends so they can use it from their phone or computer browser, drag and drop this folder into **Cloudflare Pages**, **Netlify Drop** (`app.netlify.com/drop`), or **Vercel**.
