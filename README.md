# Strifeborn Website

Official website for Strifeborn - A tactical auto-battler with deep strategic depth.

**Live Site:** https://strifeborn.com

---

## 🚀 Quick Start

### 1. Open the Project in VS Code

```bash
# Navigate to your repo folder
cd path/to/strifeborn-website

# Open in VS Code
code .
```

### 2. Start the Local Server

Open **PowerShell** or **Terminal** in VS Code (Ctrl+` or Terminal menu), then run:

```bash
hugo server -D
```

### 3. View Your Site

Open your browser and go to: **http://localhost:1313**

The site will **auto-reload** whenever you save changes! 🎉

---

## 📁 Project Structure

```
strifeborn-website/
├── config.toml              # Site configuration (title, menus, social links)
├── content/                 # All your content (markdown files)
│   ├── heroes/             # Hero pages
│   ├── factions/           # Faction pages
│   ├── mechanics/          # Game mechanics explanations
│   ├── lore/               # Story and lore
│   ├── devlog/             # Development blog posts
│   └── news/               # News and announcements
│
├── layouts/                 # HTML templates
│   ├── index.html          # Homepage template
│   ├── _default/           # Default templates
│   ├── heroes/             # Hero-specific templates
│   ├── factions/           # Faction-specific templates
│   └── partials/           # Reusable components (header, footer)
│
├── static/                  # Static files (don't change during build)
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript
│   └── images/             # Images, logos, screenshots
│
└── archetypes/              # Templates for new content
    ├── heroes.md           # Template for creating heroes
    └── devlog.md           # Template for devlog posts
```

---

## ✏️ How to Add Content

### Add a New Hero

```bash
hugo new heroes/hero-name.md
```

This creates a new file in `content/heroes/` with the hero template. Then edit it:

```markdown
---
title: "Kael"
faction: "Shogunate"
class: "Assassin"
tagline: "The Shadow Blade"

stats:
  hp: 380
  strength: 95
  wisdom: 0
  # ... add all stats
---

Kael is a deadly assassin who strikes from the shadows...
```

**Save the file** and it automatically appears on your site!

### Add a Devlog Post

```bash
hugo new devlog/2026-04-15-my-update.md
```

Or create manually: `content/devlog/2026-04-15-my-update.md`

```markdown
---
title: "April Update - New Heroes Released"
date: 2026-04-15
author: "Claryo Dev"
---

This week I've been working on...

## What's New

- Added 3 new Shogunate heroes
- Balanced Eclipse faction
- Fixed combat bugs

## Screenshots

![New Hero](/images/kael-screenshot.png)
```

### Add Images

1. Put images in `static/images/`
2. Reference them in markdown: `![Description](/images/filename.png)`

Example:
```markdown
![Grimm Hero](/images/grimm-hero.png)
```

---

## 🎨 Customization

### Change Site Title or Tagline

Edit `config.toml`:

```toml
title = "Strifeborn"

[params]
  description = "Master synergies, command heroes, conquer the Strife"
  
  [params.game]
    tagline = "Tactical Auto-Battler with Deep Strategic Depth"
```

### Update Social Links

Edit `config.toml`:

```toml
[params.social]
  twitter = "https://x.com/ClaryoDev"
  linkedin = "https://www.linkedin.com/in/alexan-viel-211659141/"
  email = "contact@strifeborn.com"
```

### Change Colors

Edit `static/css/main.css` - look for the `:root` section:

```css
:root {
    --accent-primary: #4a9eff;  /* Change primary color */
    --faction-aegis: #4a9eff;   /* Change faction colors */
    /* ... */
}
```

---

## 📤 Publishing to the Internet

### First Time Setup (Netlify)

1. **Push to GitHub:**
   - Open GitHub Desktop
   - Write commit message: "Initial site"
   - Click "Commit to main"
   - Click "Push origin"

2. **Connect Netlify:**
   - Go to **https://netlify.com**
   - Click "Sign up" (use GitHub account)
   - Click "Add new site" → "Import existing project"
   - Select "GitHub"
   - Choose your `strifeborn-website` repo
   - Build settings:
     - Build command: `hugo`
     - Publish directory: `public`
   - Click "Deploy site"

3. **Add Custom Domain:**
   - In Netlify: Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `strifeborn.com`
   - Netlify will show DNS records to add

4. **Update OVH DNS:**
   - Log into OVH
   - Go to DNS zone for `strifeborn.com`
   - Add the records Netlify gave you
   - Wait 5-10 minutes for DNS propagation

**Done!** Your site is live at https://strifeborn.com 🎉

### Updating the Site

Every time you want to publish changes:

1. Edit files in VS Code
2. Save changes
3. Open GitHub Desktop
4. Write commit message (e.g., "Added new hero Kael")
5. Click "Commit to main"
6. Click "Push origin"

**Netlify automatically deploys** - your site updates in ~1 minute!

---

## 🛠️ Common Tasks

### Add a New Faction Page

Create `content/factions/your-faction.md`:

```markdown
---
title: "Your Faction"
identity: "Brief identity description"
tagline: "Faction motto"
---

## Faction Identity

Description of the faction...
```

### Edit Homepage

Edit `content/_index.md` for simple text changes.

For layout changes, edit `layouts/index.html`

### Change Navigation Menu

Edit `config.toml`:

```toml
[[menu.main]]
  name = "New Page"
  url = "/new-page/"
  weight = 8  # Order in menu (lower = earlier)
```

---

## 🐛 Troubleshooting

### Site Not Updating?

1. Stop the server: Press `Ctrl+C` in terminal
2. Restart: `hugo server -D`
3. Hard refresh browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### "Hugo command not found"?

Hugo isn't in PATH. Restart PowerShell after installation, or use full path:

```bash
D:\"Program Files (x86)"\Hugo\bin\hugo server -D
```

### Changes Not Showing?

- Check file is saved
- Check file is in correct folder
- Check frontmatter (the `---` section) is valid
- Look at terminal for errors

### Images Not Loading?

- Images must be in `static/images/`
- Reference as `/images/filename.png` (with leading `/`)
- File names are case-sensitive

---

## 📚 Hugo Basics

### Frontmatter

The section between `---` at the top of markdown files:

```markdown
---
title: "Page Title"
date: 2026-04-02
custom_field: "value"
---

Content starts here...
```

### Markdown Syntax

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

[Link text](https://example.com)

![Image alt text](/images/pic.png)

- Bullet point
- Another point

1. Numbered list
2. Second item

`inline code`

​```gdscript
# Code block
func example():
    print("Hello!")
​```
```

---

## 🎯 Next Steps

1. **Add Your Logo**
   - Replace `static/images/logo.png` with your logo
   - Recommended size: 100x100px PNG with transparent background

2. **Add Screenshots**
   - Put game screenshots in `static/images/`
   - Reference them in devlog posts and pages

3. **Create More Heroes**
   - Use `hugo new heroes/name.md` for each hero
   - Fill in stats from your hero_kits.md document

4. **Write Devlog Posts**
   - Share your development progress
   - Keep players engaged

5. **Add More Pages**
   - Roadmap
   - FAQ
   - Press Kit

---

## 📞 Need Help?

- **Hugo Documentation:** https://gohugo.io/documentation/
- **Markdown Guide:** https://www.markdownguide.org/
- **Netlify Docs:** https://docs.netlify.com/

---

## 🎨 Design Credits

- Dark tactical theme with faction color coding
- Responsive design (works on mobile, tablet, desktop)
- Optimized for game marketing

---

**Built with ❤️ for Strifeborn by Claryo Dev**
