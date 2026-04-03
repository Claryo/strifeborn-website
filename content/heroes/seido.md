---
title: "Seido"
faction: "Shogunate"
class: "Caster"
extra_synergy: "Scribe"
tagline: ""
stats:
  hp: 500
  strength: 45
  wisdom: 95
  phys_def: 70
  spell_def: 90
  range: 4
  attack_speed: 0.90
  crit_chance: 1
  crit_damage: 150
  move_speed: 17
  max_mana: 140
  starting_mana: 0
abilities:
  basic_attack:
    name: "Brushstroke"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Ink Trance"
    charge: 140
    description: "Send a Glyph to a random enemy, deal 120% Wisdom as Spell Damage, each Glyph stack on the target increases this damage by +20% Wisdom. Each cast sends +1 Glyph."
  passive:
    name: "Living Scripture"
    description: "Whenever any enemy casts a spell, apply 1 Glyph to that enemy."
relic:
  name: "Ink Resonance"
  description: "+20 Wisdom, +18% Spell Penetration, +12% Attack Speed. Spell Damage applies a 'Marked' debuff for 4s (refreshes): target takes +5% more Spell Damage per Mark (max 3 Marks, +15%). Each spell cast on a Marked target has -5% Mana cost (max -15%). Marks spread to 1 nearby enemy on target death."
---
