---
title: "Uz'Un"
faction: "Nebulae"
class: "Shooter"
extra_synergy: "Unbeing"
tagline: "He doesn't kill — he unravels."
stats:
  hp: 480
  strength: 80
  wisdom: 0
  phys_def: 85
  spell_def: 85
  range: 4
  attack_speed: 1.15
  crit_chance: 4
  crit_damage: 150
  move_speed: 20
  max_mana: 80
  starting_mana: 25
abilities:
  basic_attack:
    name: "Fracture Orb"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Erasure"
    charge: 80
    description: "Fire a void pulse at a random enemy, deals 100% Strength +10% Strength per active Unravel stacks as Phys Damage and applies Unravel. Unravel: Deals 1% of target's current HP as Spell Damage per second (max 10 stacks per enemy), when an Unraveled enemy dies, half of Unravel stacks (floored) jumps to another random enemy."
  passive:
    name: "Causal Drain"
    description: "Heal for 15% of total Unravel damage dealt."
relic:
  name: "Unraveling Toxin"
  description: "+20 Wisdom, +15% Attack Speed, +18% Lifesteal. Basic Attacks apply a 'Decay' debuff for 3s: target takes 1% current HP as Spell Damage/s. Decay damage heals this hero for 20% of damage dealt. On target death with Decay active, Decay spreads to 1 nearby enemy at full duration."
---
