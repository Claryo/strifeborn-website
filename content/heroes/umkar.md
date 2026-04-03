---
title: "Um'Kar"
faction: "Nebulae"
class: "Tank"
extra_synergy: "Graviton"
tagline: "He bends the battlefield toward himself and dares you to resist."
stats:
  hp: 750
  strength: 65
  wisdom: 70
  phys_def: 200
  spell_def: 200
  range: 1
  attack_speed: 0.85
  crit_chance: 0
  crit_damage: 150
  move_speed: 17
  max_mana: 100
  starting_mana: 0
abilities:
  basic_attack:
    name: "Gravity Pulse"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Event Horizon"
    charge: 100
    description: "Create a collapsing gravitational field centered on himself in 3 expanding waves delayed by 1s. Wave 1: 1-tile radius, deal 100% Wisdom as Spell Damage, Stun enemies 1s. Wave 2: 2-tiles radius, deal 60% Wisdom as Spell Damage, Root enemies 1s. Wave 3: 3-tiles radius, deal 30% Wisdom as Spell Damage, apply -10% Strength and -10% Wisdom to enemies for 2s."
  passive:
    name: "Gravity Well"
    description: "Enemies within 2-tiles suffer -10% Attack Speed and -5% Crit Chance"
relic:
  name: "Event Horizon Anchor"
  description: "+20 Wisdom, +18% Spell Penetration, +12% Damage Reduction. Enemies within 2 tiles deal -10% damage. When this hero casts a spell, enemies within 2 tiles are Slowed 20% for 2s. For each enemy within 2 tiles at spell cast, gain +5% Damage Reduction for 3s (max +25%)."
---
