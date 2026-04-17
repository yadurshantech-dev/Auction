# 🏏 IPL Auction Arena

A fully functional, visually rich IPL-style cricket player auction web app built with pure HTML, CSS, and Vanilla JavaScript.

---

## 🚀 How to Run

Simply open `index.html` in any modern browser. No build step, no server needed.

> **Tip:** For a better experience (especially images), serve via a local server:
> ```bash
> # Python
> python3 -m http.server 8080
> # Node
> npx serve .
> ```
> Then open: http://localhost:8080

---

## 📁 Project Structure

```
cricket-auction-app/
├── index.html               # Main entry point
├── css/
│   ├── style.css            # Core design system, layout, components
│   ├── animations.css       # All keyframe animations & effects
│   └── responsive.css       # Mobile-first responsive breakpoints
├── js/
│   ├── state.js             # Global state singleton (single source of truth)
│   ├── players.js           # Player data with base price tiers
│   ├── timer.js             # SVG countdown timer (6-second)
│   ├── auction.js           # Core auction flow & logic
│   ├── ui.js                # All DOM rendering & UI updates
│   └── app.js               # App bootstrap & event wiring
└── images/
    ├── players/             # Player images: <firstname_lastname>.jpg
    └── ui/
        └── default.jpg      # Fallback player image
```

---

## 🖼️ Adding Player Images

Place images in `images/players/` named after the player with spaces → underscores:

| Player          | Filename                    |
|-----------------|-----------------------------|
| Virat Kohli     | `virat_kohli.jpg`           |
| MS Dhoni        | `ms_dhoni.jpg`              |
| Jasprit Bumrah  | `jasprit_bumrah.jpg`        |
| Hardik Pandya   | `hardik_pandya.jpg`         |

Missing images automatically fall back to `images/ui/default.jpg`.

---

## 🧠 Teams (8 Franchises)

| Short | Name                  | Color     |
|-------|-----------------------|-----------|
| MM    | Mumbai Marlins        | Blue      |
| CC    | Chennai Cheetahs      | Gold      |
| BB    | Bangalore Blazers     | Red       |
| KK    | Kolkata Knights       | Purple    |
| RR    | Rajasthan Royals      | Pink      |
| PP    | Punjab Panthers       | Red/Grey  |
| HH    | Hyderabad Hunters     | Orange    |
| DD    | Delhi Dynamos         | Cyan      |

Each team starts with **₹90 Crore** purse.

---

## 💰 Base Price Tiers

| Tier     | Price  | Examples                              |
|----------|--------|---------------------------------------|
| STAR     | ₹2 Cr  | Kohli, Bumrah, Dhoni, Stokes          |
| PREMIER  | ₹1.5Cr | Shami, Hasaranga, Sanju, Gill         |
| STANDARD | ₹1 Cr  | Most other players                    |
| BUDGET   | ₹0.8Cr | Umran Malik, Prithvi Shaw, etc.       |

---

## ⚙️ Bidding Increments

| Current Bid   | Increment  |
|---------------|------------|
| < ₹1 Cr       | +₹10 Lakhs |
| ₹1 Cr – ₹5 Cr | +₹25 Lakhs |
| > ₹5 Cr       | +₹50 Lakhs |

---

## ⌨️ Keyboard Shortcuts

| Key     | Action         |
|---------|----------------|
| `Space` | Pause / Resume |
| `S`     | Skip Player    |

---

## ✨ Features

- ✅ 100 players across 4 categories (Batsmen → Bowlers → All-Rounders → Wicket-Keepers)
- ✅ 8 IPL-inspired franchises with ₹90Cr purse each
- ✅ 6-second animated SVG countdown timer
- ✅ Dynamic bid increments based on current price
- ✅ SOLD overlay with CSS confetti/fireworks
- ✅ UNSOLD overlay for unclaimed players
- ✅ Real-time auction log
- ✅ Team detail modal (click any team to see squad)
- ✅ Pause/Resume auction
- ✅ Skip player (mark UNSOLD manually)
- ✅ Dark/Light mode with localStorage persistence
- ✅ Reset auction
- ✅ Fully responsive: Mobile / Tablet / Desktop
- ✅ Touch-friendly bid buttons
- ✅ Keyboard shortcuts

---

## 🎨 Design System

- **Display font**: Bebas Neue
- **UI font**: Barlow Condensed
- **Body font**: Barlow
- **Theme**: Stadium Broadcast — deep navy backgrounds, gold/orange accents
- **Animations**: Card entrance, bid pulse, timer color shift, SOLD shine sweep, firework particles

---

*Built with ❤️ using pure HTML · CSS · Vanilla JS*
