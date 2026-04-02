# Design Rules

## Colors
All color tokens are defined in `static/css/main.css` under `:root`.
**Always edit CSS variables — never hardcode hex values inline.**

### Faction colors
| Faction | Description | CSS var |
|---|---|---|
| Aegis | Army orange | `--faction-aegis` |
| Eclipse | Dark green | `--faction-eclipse` |
| Inquisition | Gold yellow | `--faction-inquisition` |
| Nebulae | Cosmic purple | `--faction-nebulae` |
| Nexus | Electronic blue | `--faction-nexus` |
| Shogunate | Neon red | `--faction-shogunate` |

> Note: if any hex values in `:root` don't match these descriptions, fix them to match.

### Accent
- `--accent-primary` — primary interactive color (links, buttons, borders)
- `--accent-hover` — hover state variant

## Typography
- `--font-primary` — system sans-serif stack, used for body text
- `--font-heading` — Segoe UI family, used for headings
- Do not import external fonts unless explicitly requested

## Layout
- Mobile-first responsive design
- Test changes at mobile, tablet, and desktop breakpoints
- Do not use inline styles for layout — use CSS classes

## Sprites & images
- Hero/enemy sprites are chibi pixel art with thick outlines and transparent backgrounds
- When displaying sprites on the site, preserve transparency (use PNG, not JPG)
- Do not stretch or distort sprites — use `object-fit: contain` or fixed dimensions that match the art
