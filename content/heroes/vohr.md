---
title: "Vohr"
faction: "Nebulae"
class: "Support"
extra_synergy: "Neurosage"
tagline: "The link between allies is as strong as the mind that holds it."
stats:
  hp: 560
  strength: 55
  wisdom: 70
  phys_def: 100
  spell_def: 100
  range: 3
  attack_speed: 0.95
  crit_chance: 1
  crit_damage: 150
  move_speed: 19
  max_mana: 70
  starting_mana: 50
abilities:
  basic_attack:
    name: "Spindle Tap"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Sever Relay"
    charge: 70
    description: "Heal the linked ally for 60% of stored Buffer + 18% Wisdom then reset the Buffer."
  passive:
    name: "Neural Link"
    description: "Vohr always maintains a link to the nearest ally, while linked, share 12% of Vohr's Strength and Wisdom with that ally and store a Buffer of 25% of the damage dealt by the linked ally. (Buffer cap: 300 + 100% Wisdom) If the linked ally dies, link back to the closest ally."
relic:
  name: "Neural Synchrony"
  description: "+20 Strength, +20 Wisdom, +12% Lifesteal. The closest ally gains +8% of this hero's Strength and Wisdom. When this hero casts a spell, closest ally gains +20% Attack Speed for 3s. When closest ally takes lethal damage, redirect 30% of the hit to this hero instead (6s cooldown)."
---
