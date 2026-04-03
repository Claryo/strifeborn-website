---
title: "Vema"
faction: "Eclipse"
class: "Caster"
extra_synergy: "Voidweaver"
tagline: "She marks the condemned, and the stars finish the sentence."
stats:
  hp: 500
  strength: 45
  wisdom: 90
  phys_def: 70
  spell_def: 85
  range: 4
  attack_speed: 0.95
  crit_chance: 2
  crit_damage: 150
  move_speed: 18
  max_mana: 80
  starting_mana: 25
abilities:
  basic_attack:
    name: "Obsidian Shard"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Star Sigil"
    charge: 80
    description: "Place a Sigil on the current target, after 1.5s the Sigil detonates, dealing 150% Wisdom as Spell Damage in a 1-tile radius centered on the target. If the marked enemy dies before the detonation, the Sigil spreads to the 2 closest enemies and detonates after 1.5s, dealing 70% damage."
  passive:
    name: "Oracle's Sight"
    description: "Star Sigil can critically strike."
relic:
  name: "Sigil Amplifier"
  description: "+20 Wisdom, +25% Crit Damage, +12% Spell Penetration. Spell Damage that critically strikes applies a 'Resonance' mark for 3s. Resonance-marked enemies take +12% Spell Damage from all sources. When a marked enemy dies, the mark spreads to 1 nearby enemy. Max 3 active marks."
---
