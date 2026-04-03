---
title: "Kazuro"
faction: "Shogunate"
class: "Assassin"
extra_synergy: "Wraith"
tagline: ""
stats:
  hp: 470
  strength: 85
  wisdom: 0
  phys_def: 85
  spell_def: 85
  range: 1
  attack_speed: 1.25
  crit_chance: 5
  crit_damage: 150
  move_speed: 25
  max_mana: 50
  starting_mana: 0
abilities:
  basic_attack:
    name: "Shadow Slash"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Night Veil"
    charge: 50
    description: "Teleport to the enemy with the highest Strength and Taunt him for 3s. For 3s, cannot attack but automatically Dodge all Basic Attacks from the taunted enemy, each Dodged Basic Attacks stores the prevented damage. After 3s, perform Retaliation against the target for 100% Strength + 80% of the prevented damage as Phys Damage. If the target dies before Night Veil ends, teleport to the next highest Strength enemy and immediately perform Retaliation."
  passive:
    name: "Riposte"
    description: "Each Basic Attack Dodged during spell triggers a Riposte against the attacker for 40% Strength as Phys Damage."
relic:
  name: "Nightfall Blade"
  description: "+20 Strength, +18% Crit Damage, +15% Dodge. When dodging an attack, deal 30% STR as Phys Damage to the attacker. After dodging 3 attacks within 4s, gain +25% Damage Amplification for 3s. Dodging also grants +5% Crit Chance for 3s (max +20%, refreshes)."
---
