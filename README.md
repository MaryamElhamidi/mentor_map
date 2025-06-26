## 🗺️ HackTheNorth 2024 Polaris' Mentor & Hacker Tracker

### 📌 Overview

This repo is a **simulated indoor map demo** built for a hackathon, showcasing how mentors and hackers *could* be tracked in a physical venue using the [Mappedin API](https://developer.mappedin.com/). While it doesn't use real-time tracking, it simulates movement and map interactions to illustrate a possible future feature.

Built with:

* `@mappedin/mappedin-js`
* Simulated character movement and randomized placement
* Custom avatars for mentors and hackers
* Animated updates on a 3D venue map

---

### 💡 Features

✅ Simulated mentor movement on a 3D map
✅ Hackers placed with fun/relatable status messages
✅ Custom HTML/SVG markers with avatars
✅ Visualized concept for tracking inside hackathon venues

---

### 📁 Tech Stack

| Tech                        | Description                        |
| --------------------------- | ---------------------------------- |
| **Mappedin JS SDK**         | Indoor mapping & simulation        |
| **TypeScript / JavaScript** | For simulation logic & DOM control |
| **CSS**                     | For custom marker styles           |

---

### 🛠️ Functionality

* Connects to Mappedin’s 3D mapping SDK using a dev key
* Mentors are randomly placed and **simulate movement** every few seconds
* Hackers are static markers that show “mood updates” like:

  * 💤 “I’m so sleepy”
  * 🧠 “At the workshop”
  * 💻 “Running into many errors”

⚠️ **Note:** This is *not* a real-time GPS tracking system — it’s a **visual mock-up** meant to represent what a live hackathon map *could* look like.

---

### 🔑 API Access

This uses a temporary **Mappedin dev key** for demo purposes:

```ts
const mapData = await getMapData({
  key: "...",
  secret: "...",
  mapId: "...",
  viewId: "...",
});
```

Do not use this key in production.

---

### 📸 Sample Marker

```ts
addAsset("Mentor 1", mentor1, "#3DA93B");  // green circle w/ avatar
addHackathonSaying("I'm so sleepy", hacker1);  // square box with text
```

---

### 🧪 How to Run

1. Clone this repo
2. Install dependencies:

```bash
npm install
```

3. Start local server:

```bash
npm run dev
```

4. Visit `http://localhost:3000`

---
