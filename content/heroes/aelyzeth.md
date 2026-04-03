---
title: "Ael'Yzeth"
faction: "Nebulae"
class: "Caster"
extra_synergy: "Singularity"
tagline: "She sings the entropy of dying things into a weapon."
stats:
  hp: 490
  strength: 45
  wisdom: 95
  phys_def: 70
  spell_def: 90
  range: 4
  attack_speed: 0.90
  crit_chance: 1
  crit_damage: 150
  move_speed: 18
  max_mana: 50
  starting_mana: 50
abilities:
  basic_attack:
    name: "Event Hymn"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Collapse Pulse"
    charge: 50
    description: "Blast a 1-tile radius centered on the target, dealing 110% Wisdom as Spell Damage. Enemies hit receive Gravity Mark for 3 seconds: Marked enemies take +8% damage from self."
  passive:
    name: "Entropic Choir"
    description: "Each time any unit dies, increase the damage of the next Collapse Pulse by +10% (max +50%)."
relic:
  name: "Entropic Pull"
  description: "+18 Wisdom, +18% Spell Penetration, +12% Damage Amplification. Spell Damage applies a 'Distortion' debuff for 3s: -10% Movement Speed and -10% Attack Speed. Enemies with Distortion take +10% Spell Damage from all sources. When an enemy dies with Distortion, the nearest enemy gains Distortion at full duration. 2s cooldown per spread."
---
