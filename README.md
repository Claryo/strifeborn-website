# Strifeborn Website — Guide d'édition

Site de présentation (landing page) pour Strifeborn, construit avec [Hugo](https://gohugo.io/).

**Site live :** https://strifeborn.com

---

## Démarrage rapide

```bash
# Dans le dossier du projet
hugo server -D
# Ouvrir http://localhost:1313
```

Le site se recharge automatiquement à chaque sauvegarde.

---

## Structure du projet

Le site est une **page unique** (landing page). Voici les seuls fichiers qui comptent :

```
strifeborn-website/
├── config.toml                      # Configuration du site
├── layouts/
│   ├── index.html                   # Toutes les sections de la page
│   ├── _default/baseof.html         # Squelette HTML (head, balises, chargement CSS/JS)
│   └── partials/
│       ├── header.html              # En-tête (logo + titre)
│       └── footer.html              # Pied de page (réseaux, copyright)
└── static/
    ├── css/main.css                 # Tous les styles
    ├── js/main.js                   # JavaScript
    └── images/                      # Images du site
```

---

## Modifier le header

**Fichier :** `layouts/partials/header.html`

- **Logo :** placer une image dans `static/images/logo.png` — elle s'affiche automatiquement
- **Titre :** modifié via `config.toml` → champ `title`

---

## Modifier le footer

**Fichier :** `layouts/partials/footer.html`

Le footer affiche automatiquement les valeurs définies dans `config.toml` :
- Titre du site (`title`)
- Description (`params.description`)
- Statut du jeu (`params.game.status`)
- Liens sociaux (`params.social.*`)
- Nom de l'auteur (`params.author`)

Pour changer quelque chose dans le footer, modifier `config.toml` (voir section Config ci-dessous).

---

## Modifier les sections de la page

**Fichier :** `layouts/index.html`

La page contient 7 sections dans l'ordre :

| Section | Ligne approx. | Contenu |
|---|---|---|
| **Hero** | ~3 | Titre, tagline, placeholder screenshot |
| **Lore** | ~28 | Extrait narratif du jeu |
| **Features** | ~43 | 6 cartes de fonctionnalités |
| **Gameplay** | ~84 | 3 blocs avec placeholders médias (shop, combat, blessings) |
| **Factions** | ~145 | 6 cartes de factions |
| **Follow** | ~229 | Boutons réseaux sociaux |
| **Contact** | ~252 | Formulaire de contact (Formspree) |

Chaque section est clairement commentée dans le fichier avec `<!-- ── NOM ── -->`.

### Remplacer un placeholder par une vraie image ou vidéo

Dans `layouts/index.html`, chercher les blocs `lp-image-placeholder` ou `lp-media-placeholder`.
Les remplacer par une balise `<img>`, `<video>` ou `<iframe>` :

```html
<!-- Avant (placeholder) -->
<div class="lp-image-placeholder">...</div>

<!-- Après (vraie image) -->
<img src="/images/screenshot.png" alt="Strifeborn gameplay">
```

---

## Ajouter ou modifier des images

1. Copier l'image dans `static/images/`
2. La référencer dans `layouts/index.html` avec le chemin `/images/nom-du-fichier.png`

Images attendues par le site :

| Fichier | Usage |
|---|---|
| `static/images/logo.png` | Logo dans le header (transparent, ~100×100px recommandé) |
| `static/images/favicon.png` | Icône de l'onglet navigateur |
| `static/images/screenshot.png` | Section Hero (placeholder actuellement) |
| `static/images/gameplay-shop.png` ou `.gif` | Section Gameplay — phase Shop |
| `static/images/gameplay-combat.png` ou `.gif` | Section Gameplay — phase Combat |
| `static/images/gameplay-blessing.png` ou `.gif` | Section Gameplay — Blessing Selection |
| `static/images/factions/aegis.png` | Carte faction Aegis |
| `static/images/factions/eclipse.png` | Carte faction Eclipse |
| `static/images/factions/inquisition.png` | Carte faction Inquisition |
| `static/images/factions/nebulae.png` | Carte faction Nebulae |
| `static/images/factions/nexus.png` | Carte faction Nexus |
| `static/images/factions/shogunate.png` | Carte faction Shogunate |

---

## Design — couleurs et styles

**Fichier :** `static/css/main.css`

Toutes les couleurs sont définies comme variables CSS au début du fichier, sous `:root` :

```css
:root {
    /* Couleurs de base */
    --bg-primary: #0a0e17;        /* Fond de page (noir bleuté) */
    --bg-secondary: #141824;      /* Fond des cartes et inputs */
    --bg-tertiary: #1e2433;       /* Bordures, séparateurs */
    --text-primary: #e8eaed;      /* Texte principal */
    --text-secondary: #9aa0a6;    /* Texte secondaire (labels, sous-titres) */
    --accent-primary: #e8472a;    /* Couleur d'accentuation (orange-rouge) */
    --accent-hover: #ff6040;      /* Couleur hover */

    /* Couleurs des factions */
    --faction-aegis: #4a9eff;
    --faction-eclipse: #9945ff;
    --faction-inquisition: #ffd700;
    --faction-nebulae: #00ffcc;
    --faction-nexus: #ff4655;
    --faction-shogunate: #ff6b35;
}
```

Ne jamais mettre des valeurs hex directement dans le CSS — toujours modifier les variables dans `:root`.

---

## Configuration (`config.toml`)

```toml
title = "Strifeborn"                          # Titre du site (header, onglet, footer)

[params]
  description = "..."                         # Description (footer)
  author = "Claryo Dev"                       # Auteur (footer, copyright)
  formspree_id = "mgopnvrv"                   # ID Formspree pour le formulaire de contact

  [params.social]
    twitter   = "https://x.com/..."
    linkedin  = "https://www.linkedin.com/..."
    instagram = "https://www.instagram.com/..."

  [params.game]
    status  = "In Development"                # Badge statut (footer)
    tagline = "..."
```

### Modifier le formulaire de contact

Le formulaire utilise [Formspree](https://formspree.io). Pour changer l'adresse de réception :
1. Créer ou modifier un formulaire sur formspree.io
2. Copier l'ID (ex: `xabc1234`)
3. Mettre à jour `formspree_id` dans `config.toml`

---

## Déploiement — GitHub Pages

Le site est déployé automatiquement via GitHub Actions à chaque `push` sur `main`.

**Fichier de workflow :** `.github/workflows/hugo.yml`

### Première mise en ligne

1. Aller dans les **Settings** du repo GitHub → **Pages**
2. Source : **GitHub Actions**
3. Sauvegarder

Dès lors, chaque push sur `main` déclenche le build Hugo et déploie le site.

### Publier une modification

```bash
git add .
git commit -m "Description de la modification"
git push origin main
```

Le site se met à jour en ~1 minute.

### Vérifier le déploiement

Dans le repo GitHub → onglet **Actions** → voir le workflow `Deploy Hugo site`.

---

## Dépannage

**Le site ne se met pas à jour localement ?**
- `Ctrl+C` pour arrêter le serveur, relancer `hugo server -D`
- Forcer le rechargement du navigateur : `Ctrl+Shift+R`

**"Hugo command not found" ?**
- Hugo n'est pas dans le PATH. Redémarrer PowerShell après installation.

**Une image ne s'affiche pas ?**
- Vérifier que le fichier est dans `static/images/`
- Le chemin doit commencer par `/images/` (pas `static/images/`)
- Les noms de fichiers sont sensibles à la casse

**Le formulaire de contact ne fonctionne pas ?**
- Vérifier que `formspree_id` est défini dans `config.toml` **avant** `[params.social]`
- Aller sur formspree.io pour vérifier que le formulaire est actif
