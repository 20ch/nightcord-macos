<div align="center">
  <img src="https://nightcord.lovable.app/__l5e/assets-v1/d8ac4bcd-37d2-43ba-93d6-02c4cff21acf/nightcord-logo.png" width="96" height="96" alt="Nightcord Logo">

# Nightcord

**Un client Discord personnalisé conçu pour ceux qui se soucient vraiment du fonctionnement de Discord.**

[![Discord](https://img.shields.io/badge/Discord-Join%20us-5865F2?logo=discord\&logoColor=white)](https://discord.gg/nightcord)
[![License](https://img.shields.io/badge/license-GPL%20v3-a855f7)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-macOS-3b82f6.svg?logo=apple\&logoColor=white)](https://github.com/20ch/nightcord-macos)
[![Website](https://img.shields.io/badge/website-nightcord.lovable.app-5865F2?logo=googlechrome\&logoColor=white)](https://nightcord.lovable.app)

---

</div>

Nightcord est un fork d'Equicord, qui lui-même repose sur Vencord. Nous avons supprimé l'obfuscation, nettoyé le code, apporté nos propres améliorations, et conservé ce qui fonctionne. Pas de superflu, pas de blabla.

---

## Ce qu'il contient

* **Démarrage plus rapide** — sans obfuscation, le client se charge nettement plus vite et consomme moins de CPU et de RAM.
* **Mises à jour automatiques** — vérifie les mises à jour en arrière-plan au démarrage et les applique silencieusement.
* **Support des plugins** — compatible avec l'écosystème de plugins existant. Installez des plugins de la communauté directement via des liens Git.
* **Meilleur audio** — modules vocaux optimisés matériellement pour un audio plus clair et plus fort dès le départ.
* **Style personnalisé** — interface plus fluide, icônes personnalisées, et diverses améliorations de qualité de vie.

---

## Installation (MacOS)

1. Téléchargez **`Nightcord.dmg`**
2. **Double-cliquez et ouvrez**

## Correction (fichier Mac "endommagé" / blocage de sécurité Apple) :
xattr -d com.apple.quarantine /path/to/file
Ensuite, essayez de rouvrir le fichier

### Clone & Build

```bash
git clone https://github.com/20ch/nightcord-macos.git
cd nightcord
pnpm install -r
pnpm add -D react react-dom
pnpm approve-builds
pnpm run package:dir
```

## Dépôt

Code source :

https://github.com/20ch/nightcord-macos

---

## Remerciements

Nightcord n'existerait pas sans [Equicord](https://github.com/Equicord/Equicord) et [Vencord](https://github.com/Vendicated/Vencord). Une immense partie de ce qui rend ce projet fonctionnel provient directement de leurs projets. Nous en sommes pleinement conscients et apprécions sincèrement tout ce qu'ils ont construit — nous prenons simplement une direction différente. Un grand merci à tous ceux qui ont contribué aux deux projets.

Sans les développeurs et contributeurs de Vencord et Equicord, rien de tout cela n'aurait été possible. Leur travail acharné, leur dévouement et leur passion ont rendu ce projet réalisable. Je tiens à exprimer ma profonde gratitude envers chaque personne qui a contribué à ces projets incroyables.

Je suis **atomic**, connu sous le pseudo **20ch** sur Discord. Je ne suis pas impliqué dans le passé de Nightcord et je ne suis responsable que de ce fork spécifique.

---

## Avertissement

*Nightcord n'est affilié d'aucune manière à Discord Inc.*

L'utilisation de clients tiers est techniquement contraire aux Conditions d'Utilisation de Discord. Utilisez-le à vos propres risques.
