<div align="center">
  <img src="https://nightcord.lovable.app/__l5e/assets-v1/d8ac4bcd-37d2-43ba-93d6-02c4cff21acf/nightcord-logo.png" width="96" height="96" alt="Nightcord Logo">

# Nightcord

**Un client Discord personnalisé, transparent et performant, conçu pour ceux qui veulent garder le contrôle.**

[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/nightcord)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS-3b82f6?style=flat-square&logo=apple&logoColor=white)](https://github.com/20ch/nightcord-macos)
[![Website](https://img.shields.io/badge/Website-nightcord.lovable.app-00dfa2?style=flat-square&logo=googlechrome&logoColor=white)](https://nightcord.lovable.app)

<p align="left">
Nightcord est un fork d'Equicord, lui-même basé sur Vencord. Notre philosophie est simple : nous avons supprimé l'obfuscation, nettoyé la base de code, et apporté nos propres optimisations en conservant ce qui fonctionne. Pas de superflu, pas de télémétrie inutile. Juste de la performance.
</p>

</div>

## ⚡ Fonctionnalités

* **Démarrage ultra-rapide** — L'absence d'obfuscation permet au client de se charger instantanément tout en réduisant l'impact sur le processeur et la mémoire RAM.
* **Mises à jour silencieuses** — Nightcord vérifie automatiquement les mises à jour en arrière-plan à chaque démarrage pour ne jamais vous couper dans votre élan.
* **Écosystème de Plugins** — Entièrement compatible avec les plugins existants. Vous pouvez également installer des plugins communautaires directement via leurs liens Git.
* **Audio optimisé** — Intégration de modules vocaux avec accélération matérielle pour un son plus clair, plus stable et mieux équilibré dès l'installation.
* **Interface épurée** — Animations fluidifiées, icônes personnalisées et ajustements ergonomiques pour une meilleure expérience au quotidien.

## 🗺️ Roadmap & Évolution

- [x] **Fix Captchas** — Résolution des problèmes liés aux vérifications de sécurité Discord.
- [ ] **Système de suggestions** — Intégration d'un module pour recueillir les retours et idées de la communauté directement.
- [ ] **Optimisations continues** — Amélioration constante de la légèreté du client et suivi des versions amont.

## 📦 Installation (macOS)

### Méthode Standard
1. Téléchargez la dernière version de **`Nightcord.dmg`** depuis l'onglet Releases.
2. Ouvrez le fichier `.dmg` et glissez Nightcord dans votre dossier **Applications**.

> ⚠️ **Note de sécurité Apple ("Fichier endommagé") :**
> Si macOS bloque l'ouverture de l'application avec un message indiquant que le fichier est endommagé ou provient d'un développeur non identifié, ouvrez votre terminal et exécutez la commande suivante :
> ``bash
> xattr -d com.apple.quarantine /Applications/Nightcord.app
> ``

## 🛠️ Build depuis les sources

Si vous préférez compiler le client vous-même, suivez ces étapes :

```bash
# Cloner le dépôt
git clone [https://github.com/20ch/nightcord-macos.git](https://github.com/20ch/nightcord-macos.git)
cd nightcord-macos

# Installer les dépendances
pnpm install -r
pnpm add -D react react-dom

# Autoriser les builds et packager le client
pnpm approve-builds
pnpm run package:dir

```

## 🤝 Remerciements

Nightcord n'existerait pas sans le travail colossal d'**[Equicord](https://github.com/Equicord/Equicord)** et de **[Vencord](https://github.com/Vendicated/Vencord)**. Une immense partie des fonctionnalités de ce client repose sur leurs bases. Nous tenons à exprimer notre profonde gratitude envers leurs développeurs et contributeurs respectifs pour leur dévouement et leur esprit open-source. Nous prenons simplement une direction différente, mais leur travail reste la fondation de ce projet.

Je suis **atomic** (connu sous le pseudo **20ch** sur Discord). Je n'ai pas été impliqué dans le passé historique de Nightcord et je suis uniquement responsable de la maintenance et du développement de ce fork spécifique.

## 🛑 Avertissement

*Nightcord n'est en aucun cas affilié, associé ou approuvé par Discord Inc.*

L'utilisation de clients tiers modifiés est techniquement contraire aux Conditions d'Utilisation (ToS) de Discord. Utilisez ce logiciel en toute conscience et à vos propres risques.
