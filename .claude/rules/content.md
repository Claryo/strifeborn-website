# Content Rules

## Source of truth
- All game data lives in `DOCUMENTATION/` — always read the relevant doc before creating or editing content
- Hero data: `DOCUMENTATION/heroes/hero_kits.md`
- Synergies: `DOCUMENTATION/synergies/synergies.md`
- Lore: `DOCUMENTATION/lore/campaign_lore.md`
- Never invent stats, ability descriptions, or lore — pull directly from DOCUMENTATION

## Naming conventions
- Faction names (exact, case-sensitive): Aegis, Eclipse, Inquisition, Nebulae, Nexus, Shogunate
- Class names (exact): Fighter, Tank, Support, Shooter, Assassin, Caster
- Hero slugs: lowercase, matching the hero's internal id (e.g. `grimm.md`, `brakka.md`, `omn1.md`)

## Frontmatter schemas

### Hero page (`content/heroes/name.md`)
```yaml
---
title: "HeroName"
faction: "FactionName"
class: "ClassName"
tagline: "Short tagline"
stats:
  hp: 0
  strength: 0
  wisdom: 0
  # ... fill from hero_kits.md
---
```

### Devlog post (`content/devlog/YYYY-MM-DD-title.md`)
```yaml
---
title: "Post Title"
date: YYYY-MM-DD
author: "Claryo Dev"
---
```

## Images
- All images go in `static/images/`
- Reference in markdown as `/images/filename.png` (leading slash required)
- Ability icons are in `assets/sprites/abilities_icons/` (game assets, not for website use directly)
