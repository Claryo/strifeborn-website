---
title: "BL-STR"
faction: "Nexus"
class: "Shooter"
extra_synergy: "Gunner"
tagline: ""
stats:
  hp: 480
  strength: 80
  wisdom: 0
  phys_def: 85
  spell_def: 85
  range: 5
  attack_speed: 0.95
  crit_chance: 4
  crit_damage: 150
  move_speed: 20
  max_mana: 120
  starting_mana: 25
abilities:
  basic_attack:
    name: "Locked Burst"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Retargeting Volley"
    charge: 120
    description: "Fire 3 Microshots at the lowest current HP enemy, each Microshot deals 80% Strength as Phys Damage. If the target dies, remaining Microshots retarget the next lowest current HP enemy."
  passive:
    name: "Telemetry"
    description: "+1% Crit Chance for each consecutive hit on the same target (max 10%). Reset when switching targets."
relic:
  name: "Microshot Amplifier"
  description: "+20 Strength, +22% Attack Speed, +18% Crit Damage. Consecutive Basic Attacks on the same target grant +3% Crit Chance per hit (max +15%). At max stacks, next Basic Attack deals +40% bonus damage and resets stacks. Switching targets resets stacks but grants +10% Attack Speed for 2s."
---
