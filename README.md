<div align="center">
  <img src="https://nightcord.su/image.png" width="96" height="96" alt="Nightcord Logo">
  
# Nightcord

**A custom Discord client built for people who actually care about how Discord runs.**

[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord&logoColor=white)](https://discord.gg/nightcord)
[![License](https://img.shields.io/github/license/nightcordoff/nightcord?color=a855f7)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-3b82f6.svg?logo=windows&logoColor=white)](https://github.com/nightcordoff/nightcord-macos)
[![Website](https://img.shields.io/badge/website-nightcord.su-5865F2?logo=googlechrome&logoColor=white)](https://nightcord.su)

---

</div>

Nightcord is a fork of [Equicord](https://github.com/Equicord/Equicord), which itself builds on top of [Vencord](https://github.com/Vendicated/Vencord). We stripped out the obfuscation, cleaned things up, added our own stuff, and kept what works. No bloat, no nonsense.

---

## What's in it

* **Faster startup** — no obfuscation means the client loads noticeably quicker and sits lighter on your CPU and RAM.
* **Auto-updates** — checks for updates in the background on launch and applies them silently. You don't have to think about it.
* **Plugin support** — compatible with the existing plugin ecosystem. Install community plugins straight from Git links.
* **Better audio** — hardware-optimized voice modules for cleaner, louder audio out of the box.
* **Custom styling** — our own visual tweaks on top of the base: smoother UI, custom icons, a few quality-of-life details here and there.

> 📢 **macOS Note:** A lot of plugin fixes are rolling out for macOS, including stability improvements for plugins like **Word Bomb** and **Multi-Instance** support.

---
## Installation (macOS ARM64)

**You'll need:**

* [Git](https://git-scm.com/download)
* [Node.js (LTS)](https://nodejs.dev/en/)
* [pnpm](https://pnpm.io/installation) — `npm install -g pnpm`

```bash
git clone https://github.com/20ch/nightcord.git
cd nightcord
pnpm install -r
pnpm add -D react react-dom
pnpm approve-builds
pnpm run package:dir
```

Once the build is finished:

1. Open the `nightcord` folder
2. Go into the `release` folder
3. Open the `arm64` folder

Your built Nightcord application will be there.

If the app launches correctly, you're good to go.

