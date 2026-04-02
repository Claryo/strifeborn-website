# ADD YOUR IMAGES HERE

## Logo (Required)

1. Create or export your Strifeborn logo
2. Save as: `logo.png`
3. Recommended size: 100x100 pixels
4. Transparent background (PNG format)
5. Place in this folder: `/static/images/logo.png`

The logo appears in:
- Header (top navigation)
- Footer
- Browser tab (when you add favicon)

---

## Favicon (Browser Tab Icon)

1. Create a small version of your logo
2. Save as: `favicon.png`
3. Size: 32x32 pixels
4. Place in this folder: `/static/images/favicon.png`

The favicon appears in browser tabs and bookmarks.

---

## Screenshots & Marketing Images

Add any game screenshots or marketing images here:

- `screenshot-1.png`
- `hero-artwork.png`
- `faction-banner.png`
- etc.

Reference them in your content like this:

```markdown
![Screenshot Description](/images/screenshot-1.png)
```

---

## Image Formats

- **PNG** - Best for logos, UI elements (supports transparency)
- **JPG** - Best for screenshots, photos
- **WebP** - Best for web optimization (modern browsers)

## Image Optimization

Before uploading large images:

1. Resize to appropriate dimensions (max 1920px wide for screenshots)
2. Compress using online tools:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
3. Keep file sizes under 500KB when possible

---

## Folder Structure

```
static/images/
├── logo.png              # Site logo
├── favicon.png           # Browser tab icon
├── heroes/               # Hero artwork (create this folder)
│   ├── grimm.png
│   └── atlas.png
├── factions/             # Faction banners (create this folder)
│   ├── aegis-banner.png
│   └── eclipse-banner.png
└── screenshots/          # Game screenshots (create this folder)
    ├── combat-1.png
    └── ui-overview.png
```

Create subfolders as needed to keep organized!
