---
title: "Stats Guide"
description: "Every stat explained — what it does, how it scales, and what it affects."
icon: "📊"
---

Every hero in Strifeborn has a set of stats that define how they perform in combat. This guide covers all stats — what they do, how they interact with formulas, and what to keep in mind when building around them.

Stats can be modified by items, artifacts, synergies, blessings, and status effects. All stats are visible to the player unless noted otherwise.

---

## Offensive Stats

### Strength
The primary stat for **physical damage**. Basic Attacks and physical abilities scale with Strength. Many Physical Penetration effects and on-hit bonuses also reference Strength as a multiplier (e.g., "100% Strength as Physical").

### Wisdom
The primary stat for **spell damage and healing**. Spell abilities and support healing scale with Wisdom. Spell Penetration interactions and healing power effects reference Wisdom.

### Crit Chance (%)
The probability that a damage instance will be a **Critical Hit**. Applies per damage instance — both Basic Attacks and Damage-over-Time effects can critically hit. The base Critical Damage multiplier is **150%** of normal damage.

Crit Chance is a dangerous stat to stack carelessly. Individual sources should rarely exceed 5–8% — combined with synergies and items, totals add up quickly.

### Crit Damage (%)
Multiplies the bonus damage from a Critical Hit. At the default 150% multiplier, +50% Crit Damage would make crits deal 200% of normal damage. Scales multiplicatively with the base crit multiplier.

### Damage Amplification
A multiplicative modifier applied to **all outgoing damage**. Not displayed as a standalone stat in the default HUD but inspectable. Often granted by synergies and Blessings as a combat-scaling effect.

### Physical Penetration (Flat / %)
Reduces the effective Physical Defense of the target.
- **Flat Pen** subtracts a fixed amount from the target's Physical Defense before the defense formula is applied.
- **% Pen** ignores a percentage of the target's Physical Defense entirely.

### Spell Penetration (Flat / %)
Equivalent to Physical Penetration but for Spell Defense and Spell damage.

---

## Defensive Stats

### HP (Max HP)
The total amount of damage a hero can sustain before dying. Shields absorb damage before HP. When HP reaches 0, the hero is removed from the battlefield immediately.

### Physical Defense
Reduces damage taken from **Physical Damage** sources. The formula converts Physical Defense into a Damage Reduction percentage:

```
Damage Reduction (%) = 100 × DEF / (500 + DEF)
```

Damage Reduction is capped at **80%**. The resulting percentage is an internal value and not shown directly — you see the Defense value, not the % reduction.

### Spell Defense
Equivalent to Physical Defense but applies to **Spell Damage** sources. Uses the same formula and the same 80% cap.

### Damage Reduction
A direct percentage reduction to all incoming damage (after Defense is applied). Not shown directly in the main stats panel but inspectable. Granted by specific synergies and Blessings.

### Dodge (%)
The chance to **fully avoid** an incoming damage instance. A successful Dodge causes the attack to deal no damage and trigger no on-hit effects. Critical Hits can be dodged; dodged hits cannot critically strike. Dodge is a high-variance stat — keep individual sources modest.

### Tenacity
Reduces the effectiveness of crowd control effects (duration and power). High Tenacity makes a hero more resistant to Stuns, Silences, Slows, and similar debuffs.

---

## Attack Stats

### Range
Defines how far a hero can reach with their Basic Attack.
- **Range 1** = Melee (must be adjacent or very close)
- **Range 2+** = Ranged (can attack from further tiles)

Range interacts with synergies and positioning. The Shooter class synergy at Tier I grants +1 Range to all Shooters, for example.

### Attack Speed
The **number of seconds between Basic Attacks**. Lower values mean faster attacking. Attack Speed bonuses typically reduce this interval by a percentage.

### Move Speed
How quickly a hero moves across the hex grid to reach their target. Affects how fast melee heroes close distance and reposition during combat.

---

## Mana Stats

### Max Mana
The amount of mana required to cast the hero's Spell. When current mana reaches Max Mana, the Spell fires automatically. Heroes with a **Passive** Spell always have Max Mana = 0 and cast continuously.

### Starting Mana (%)
The percentage of Max Mana the hero begins combat with. This is always one of five discrete values: **0%, 25%, 50%, 75%, or 100%**. Heroes with 100% Starting Mana cast their Spell at the very start of combat. Effects that modify Starting Mana add on top of this base value.

---

## Sustain Stats

### Lifesteal (%)
A percentage of damage dealt by Basic Attacks that is returned as healing to the attacker. Does not apply to Spell damage unless explicitly stated.

### Healing Power (%)
Increases the effectiveness of all healing this hero receives or applies. A hero with high Healing Power heals allies (or self) for more when their abilities or effects restore HP.

### Shielding Power (%)
Increases the strength of Shields applied by this hero. Relevant for support heroes whose abilities create protective barriers.

---

## Combat Modifiers

### Reflect (%)
Returns a percentage of incoming damage to the attacker. Reflect is an internal combat modifier, not shown in the main stats panel, but is applied by specific synergies and items (e.g., the Bulwark Extra Synergy).

### Counter (%)
Causes the hero to perform a Basic Attack back at the attacker for a percentage of normal damage when hit by a Basic Attack. Activated by specific synergy effects.

---

## Damage Types Reference

All damage in Strifeborn belongs to one of three types:

| Type | Reduced By |
|---|---|
| Physical | Physical Defense |
| Spell | Spell Defense |
| Pure | Nothing — bypasses all defense and Damage Reduction |

Pure Damage is rare and appears in specific abilities and Extra Synergies (e.g., Sharpshooter's on-crit bonus, Sunderer's execute damage). It cannot be mitigated.
