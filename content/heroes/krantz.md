---
title: "Krantz"
faction: "Aegis"
class: "Fighter"
extra_synergy: "Juggernaut"
tagline: "He runs hotter the harder he's hit."
stats:
  hp: 620
  strength: 85
  wisdom: 0
  phys_def: 140
  spell_def: 100
  range: 1
  attack_speed: 1.05
  crit_chance: 4
  crit_damage: 150
  move_speed: 19
  max_mana: 100
  starting_mana: 0
abilities:
  basic_attack:
    name: "Piston Sledge"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Ground Smash"
    charge: 100
    description: "Slam the ground in a 1-tile area centered on the target, dealing 180% Strength as Phys Damage. Damage is increased by +8% per Heat consumed. Stun the primary target for 1s, then consume all Heat."
  passive:
    name: "Boilerplate"
    description: "Gain 1 Heat when hitting or being hit. Maximum 10 Heat. Gain +7 Phys Def and +7 Spell Def per Heat. These bonuses last until Ground Smash is cast."
relic:
  name: "Pressure Vessel"
  description: "+20 Phys Defense, +20 Spell Defense, +15% Max Health. Gain +2% Damage Reduction for each instance of damage received in the last 3s (max +20%). When taking 5+ instances within 3s, release a shockwave dealing 60% STR as Phys Damage in 1-tile radius. 5s cooldown."
---
