---
title: "OMN-1"
faction: "Nexus"
class: "Caster"
extra_synergy: "Overseer"
tagline: "Every allied attack feeds its archive. Every cast unleashes it."
stats:
  hp: 500
  strength: 45
  wisdom: 90
  phys_def: 70
  spell_def: 80
  range: 3
  attack_speed: 0.95
  crit_chance: 1
  crit_damage: 150
  move_speed: 19
  max_mana: 70
  starting_mana: 50
abilities:
  basic_attack:
    name: "Compliance Beam"
    description: "Deals 100% Strength as Phys Damage"
  spell:
    name: "Surveillance Beam"
    charge: 70
    description: "Consumes all Data and fire a beam toward the furthest enemy lasting 2s and ticking 20 times damaging every enemy in the path. Each tick deals 20% Wisdom as Spell Damage and grant +1% Spell Penetration to self during the beam (max 20%). If the target dies during the beam, restore 40 Mana."
  passive:
    name: "Telemetry Cache"
    description: "Whenever another ally deals damage, store +1 Data. When spell cast, gain +2 Wisdom per Data."
relic:
  name: "Data Processor"
  description: "+18 Wisdom, +18% Spell Penetration, +6 Bonus Mana per spell cast. When allies deal damage, this hero gains +0.5% Spell Damage for 3s (max +15%, refreshes). On spell cast, consume all stacks for +3% Spell Penetration per stack consumed for 4s. At 10+ stacks consumed, also apply -15% Spell Def to enemies hit."
---
