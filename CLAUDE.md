# Strifeborn Website

Hugo static site for **Strifeborn** — a real-time auto-battler where players architect teams of heroes that fight autonomously. 6 factions (Aegis, Eclipse, Inquisition, Nebulae, Nexus, Shogunate), 6 classes, 42 heroes.

## Stack
- Hugo · Netlify → https://strifeborn.com
- Dev: `hugo server -D` → http://localhost:1313

## Structure
- `content/` — Markdown pages (heroes, factions, mechanics, lore, devlog)
- `layouts/` — HTML templates · `static/css/` — Styles · `config.toml` — Site config
- `DOCUMENTATION/` — Source of truth for all game content (read before editing any game data)

## Content commands
- New hero: `hugo new heroes/name.md`
- New devlog: `hugo new devlog/YYYY-MM-DD-title.md`
- Images → `static/images/` · Referenced as `/images/file.png`

## Rules
See `.claude/rules/` for content conventions and design system details.
