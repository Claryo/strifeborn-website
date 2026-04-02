---
title: "Synergies"
tags: [synergies, design, data]
source: "CDC.docx (ch.12) + synergies.md (existing)"
last_updated: 2026-03-26
---

# Synergies

This section defines the Synergy system in Strifeborn: how synergies are categorized, activated, scaled, and interacted with.

Synergies are a **core composition layer** that rewards long-term planning and coherent team construction.

## 12.1 Design Philosophy

Synergies exist to:

* Reinforce hero identity
* Encourage structured compositions
* Provide scalable, strategic rewards

Synergies are:

* Fully visible to the player
* Deterministic in activation
* Independent from moment-to-moment execution

Synergies never rely on hidden mechanics or enemy interaction.

## 12.2 Synergy Types

Strifeborn uses **exactly three synergy types**:

1. **Faction Synergies**
2. **Class Synergies**
3. **Extra Synergies**

Each synergy type follows its own activation logic and scaling intent.

## 12.3 Faction Synergies

### 12.3.1 Purpose

Faction synergies represent **thematic identity and long-term combat behavior**.

They are designed to:

* Reward commitment to a faction
* Emphasize scaling and sustained performance
* Shape the overall identity of a composition

Faction synergies are slower to activate but more defining over time.

### 12.3.2 Activation Thresholds

Faction synergies activate at the following thresholds:

* **3 units**
* **5 units**
* **7 units**

Each threshold unlocks an additional effect.

### 12.3.3 Scaling Rules

* All unlocked thresholds are **additive**
* Higher thresholds build upon lower ones
* Effects may include:
  + Raw stat bonuses
  + Conditional effects
  + Scaling mechanics

## 12.4 Class Synergies

### 12.4.1 Purpose

Class synergies define **functional combat roles** within a composition.

They are designed to:

* Provide immediate and readable impact
* Clarify how a team operates in combat
* Reinforce positioning and role execution

### 12.4.2 Activation Thresholds

Class synergies activate at the following thresholds:

* **2 units**
* **4 units**
* **6 units**

Each threshold unlocks an additional effect.

### 12.4.3 Scaling Rules

* All unlocked thresholds are **additive**
* Higher thresholds enhance or expand previous effects
* Effects may include:
  + Raw stat bonuses
  + Combat modifiers
  + Role-specific mechanics

## 12.5 Extra Synergies

### 12.5.1 Purpose

Extra synergies represent **specialized identity extensions**.

They:

* Originate from heroes
* Reflect specific aspects of hero kits
* Enable deeper and more experimental compositions

Extra synergies are rarer and more focused than other synergy types.

### 12.5.2 Activation Thresholds

Extra synergies activate at:

* **1**
* **2**
* **3**

### 12.5.3 Scaling Rules

* Extra synergies use **one effect that scales in strength**
* Each threshold increases the **power of the same effect**
* Effects intensify rather than stack separately

## 12.6 Synergy Sources

Synergy counters can be contributed only by explicit sources.

### 12.6.1 Heroes

Heroes contribute **only** to:

* +1 to their **Faction synergy**
* +1 to their **Class synergy**

Heroes **do not directly contribute** to Extra synergy counters.

Instead:

* Each hero **defines** one Extra synergy
* This Extra synergy is **added to the run’s available synergy pool**
* The player gains the **possibility** to acquire this synergy through other systems

Heroes themselves never activate Extra synergies by presence alone.

### 12.6.2 Artifacts

Artifacts may grant:

* **+1 to a specific synergy**, including Extra synergies

Rules:

* The artifact must be **equipped on a hero on the battlefield**
* Unequipped artifacts provide no synergy contribution

Artifacts are one of the primary ways to activate Extra synergies.

### 12.6.3 Tokens (Blessings & Effects)

Some blessings or effects may grant **synergy tokens**.

Rules:

* Tokens add **+1** to a specific synergy counter
* Tokens do **not** need to be equipped
* Tokens are global and persistent for their duration

Tokens are another primary vector for activating Extra synergies.

## 12.7 Visibility & UX Rules

* All synergies are **always visible**, even when inactive
* Thresholds and effects must be readable
* Active thresholds must be clearly highlighted

The player must always understand:

* What synergies exist
* How close they are to activation
* What each threshold provides

## 12.8 Effect Scope & Constraints

Synergies:

* May grant **raw stats**
* May grant **special effects**
* May introduce **new mechanics**

Synergies:

* **Never affect enemies directly**
* **Cannot be disabled**
* **Do not apply conditionally based on combat state**

Once active, a synergy is always active.

## 12.9 Design Constraints

The Synergy system enforces the following constraints:

* No hidden synergies
* No enemy interaction
* No temporary deactivation
* No ambiguity in activation thresholds

Synergies are a **strategic layer**, not a reactive one.

## 12.10 Separation of Concerns

This section defines:

* Synergy structure
* Activation rules
* Scaling logic

The following are defined elsewhere:

* Individual synergy effects
* Balance values
* Visual theming

---

# STRIFEBORN — SYNERGIES v4

> Each synergy has **3 levels**. Faction synergies require **2/4/6 units**. Class synergies require **1/3/5 units**. Extra synergies require **1/2/3 units**. Effects at each level are additive (activating Level II also keeps Level I active).

> **Terminology rules:**
> - **Damage Amplification**: multiplicative modifier on all outgoing damage. Used where thematically appropriate (rage, frenzy, judgment).
> - **Damage Reduction**: multiplicative reduction on all incoming damage. Used where thematically appropriate (fortification, resilience).
> - **"bonus [type] Damage equal to X% of [stat]"**: a flat bonus damage instance of a specific type.
> - All stat bonuses are explicit (e.g. "+10% Strength and +10% Wisdom", not "+10% to all stats").
> - **Crit Chance and Dodge**: kept low. These stats scale dangerously. Individual sources should rarely exceed +5-8%.
> - **Reflect X%**: returns X% of damage received to the attacker.
> - **Counter for Xs**: when hit by a Basic Attack, automatically perform a Basic Attack back for the duration.

> **Available stats:**
> Max HP, Strength, Wisdom, Attack Speed, Physical Defense, Spell Defense, Crit Chance, Crit Damage, Starting Mana, Max Mana, Dodge, Attack Range, Lifesteal, Tenacity, Damage Reduction, Damage Amplification, Physical Penetration (flat or %), Spell Penetration (flat or %), Healing Power, Shielding Power.

> **Design rules for Faction Synergies:**
> Any class can belong to any faction. Faction synergies must benefit all classes equally — a tank, a caster, an assassin, and a support should all gain meaningful value. No faction synergy should favor a specific class archetype.

---

## FACTION SYNERGIES

### Aegis (2/4/6)
*Identity: Defensive ramp through shielding and sustained protection.*

- **I (2):** Fortified Start: Allies start battle with Shield = 5% Max HP per adjacent ally.
- **II (4):** Grinding Advance: Every 2s, grant +2% Damage Reduction (stacks 10; persists all battle).
- **III (6):** War Machine: Each 1s, allies gain +1% Damage Amp and +10 Phys/Spell Def (stacks 20; persists all battle).

---

### Eclipse (2/4/6)
*Identity: Death fuels the living. Every death makes the team stronger.*

- **I (2):** Resonant Passing: On any unit death, allies +3% Strength & +3% Wisdom (stacks 10; persists all battle).
- **II (4):** Tithe of the Fallen: On takedown, killer heals 8% Max HP and +10 Attack Speed (3s).
- **III (6):** Cycle Unbroken: First time each ally would die, revive at 25% HP after 1s and +25% Damage Amp for 3s (once per ally).

---

### Inquisition (2/4/6)
*Identity: Judgment through Marks. Wisdom-driven escalation.*

- **I (2):** Acolyte's Insight: Team +20% Wisdom, +20% HP.
- **II (4):** Edict of Judgement: At start and every 4s, Mark the highest-HP enemy; -15% Damage Reduction to Marked enemy (stacks 2; persists all battle).
- **III (6):** Doctrinal Surge: When allies cast, gain +1% Strength and +1% Wisdom (stacks 40; persists all battle); hitting a Marked target grants +25% Mana Regen for 2s.

---

### Nebulae (2/4/6)
*Identity: Corruption through debuffs. Penetration and scaling from battlefield pollution.*

- **I (2):** Non-Euclid: For each active debuff, allies gain +2% Spell Pen & +2% Phys Pen (stacks 10).
- **II (4):** Gravity Pulse: Every 8s, deal 12% of each enemy's Missing HP as Spell, then apply -15% Attack Speed (4s) to enemies hit.
- **III (6):** Inversion: For each active debuff, allies gain +1% Crit and +5% Crit Damage (stacks 10).

---

### Nexus (2/4/6)
*Identity: Mana network. Spells fuel the system.*

- **I (2):** Machine Built: Team +15% HP, +25% Phys/Spell Def.
- **II (4):** Quick Start: Allies start battle with +50% Max Mana (rounded up).
- **III (6):** Audit Beam: Whenever any ally casts, gain +10 Mana.

---

### Shogunate (2/4/6)
*Identity: Crit-driven aggression. Guaranteed crits fuel scaling.*

- **I (2):** Opening Kata: Allies start battle with +20% Move Speed and the first hit against a new target is a guaranteed Crit.
- **II (4):** Between Moments: Each ally Critical Hit heals for 15% of the damage done and grants +2.5% Attack Speed (stacks 20; persists all battle).
- **III (6):** Perfect Cycle: For each ally Critical Hit, allies gain +1% Strength, +1% Wisdom, +1% Crit (stacks 30; persists all battle).

---

## CLASS SYNERGIES

### Fighter (2/4/6)
*Identity: Sustained brawler who ramps through combat.*

- **I (2):** Brawl Line: On hit, gain +2% Strength and +1% Lifesteal (stacks 10; persists all battle).
- **II (4):** Momentum: On kill, gain Shield for 100% Strength or 100% Wisdom (whichever is higher).
- **III (6):** Punishing Guard: After getting hit 5 times, gain +15% Counter and +12% Damage Reduction (2s).

---

### Tank (2/4/6)
*Identity: Frontline anchor who protects allies and grows tougher.*

- **I (2):** Stand Ground: +50 Phys Def & +50 Spell Def per Tank hero.
- **II (4):** Bulwark Engine: When falling below 40% HP, gain Shield = 12% Max HP and +10% Reflect.
- **III (6):** Hold Forever: Each time a Tank dies, share 50% of dead Tank's Phys Def & Spell Def to other Tanks.

---

### Support (2/4/6)
*Identity: Team amplifier whose casts empower everyone.*

- **I (2):** Opening Tune-up: +20% Healing & Shielding. Allies gain +10% Strength & +10% Wisdom (persists all battle).
- **II (4):** Rotation Care: When a Support casts, all allies gain +25 Phys Def & +25 Spell Def (stacks 8 times; persists all battle).
- **III (6):** Rhythm of Aid: When a Support casts, all allies gain +2% Damage Amp & +2% Damage Reduction (stacks 10 times; persists all battle).

---

### Shooter (2/4/6)
*Identity: Ranged damage dealer who shreds from distance.*

- **I (2):** Sighted In: +1 Range and BA has +10% chance to fire an extra hit for 60% STR Physical (rolls Crit; same target).
- **II (4):** Piercing Lines: BAs ignore 18% of the target's Phys Def & Spell Def.
- **III (6):** Cadence: Every 3rd Shooter BA deals bonus 12% missing HP.

---

### Assassin (2/4/6)
*Identity: Backline diver who chains kills through stealth.*

- **I (2):** Backline Leap: At battle start, Assassins jump to the enemy backline and gain Stealth for 1.5s.
- **II (4):** Cut Window: Gain +18% Damage Amp to enemies below 30% HP.
- **III (6):** Ambush Loop: Kills grant Stealth for 1s. When breaking Stealth, also gains +20% Crit and +40% Crit Damage for 2s.

---

### Caster (2/4/6)
*Identity: Spell-driven powerhouse who escalates through casting.*

- **I (2):** Spell Prep: Your first Spell this battle gains +15% Wisdom and +10% Spell Pen.
- **II (4):** Arcane Weave: After casting, your next BA deals +50% WIS as Spell.
- **III (6):** Echo: Every 2nd Spell Echoes at 60% effectiveness (Echoes can't Echo).

---

## EXTRA SYNERGIES

### Anchor (1/2/3) — GRV-T, Nexus Tank
- **I:** Frontline allies +80 Phys & +80 Spell Def; adjacent allies get half.
- **II:** Frontline allies +120 Phys & +120 Spell Def; adjacent allies get half.
- **III:** Frontline allies +160 Phys & +160 Spell Def; adjacent allies get half.

---

### Artillery (1/2/3) — Brakka, Aegis Shooter
- **I:** Every 5th BA explodes 3×3 for 120% STR Physical.
- **II:** Every 5th BA explodes 3×3 for 168% STR Physical.
- **III:** Every 5th BA explodes 3×3 for 235% STR Physical.

---

### Berserker (1/2/3) — Barkhul, Eclipse Fighter
- **I:** While <50% HP: +15% Strength, +10% Lifesteal.
- **II:** While <50% HP: +25% Strength, +15% Lifesteal.
- **III:** While <50% HP: +35% Strength, +20% Lifesteal.

---

### Bulwark (1/2/3) — Atlas, Aegis Tank
- **I:** Start battle with a Shield of 8% Max HP; while Shielded Reflect 15%.
- **II:** Start battle with a Shield of 12% Max HP; while Shielded Reflect 20%.
- **III:** Start battle with a Shield of 16% Max HP; while Shielded Reflect 25%.

---

### Butcher (1/2/3) — DR-AXX, Nexus Fighter
- **I:** BAs deal +5% of target current HP as Physical.
- **II:** BAs deal +8% of target current HP as Physical.
- **III:** BAs deal +11% of target current HP as Physical.

---

### Capacitor (1/2/3) — RZ-OR, Nexus Assassin
- **I:** At battle start, Mark 1 random enemy: team +15% final dmg to it.
- **II:** At battle start, Mark 1 random enemy: team +25% final dmg to it.
- **III:** At battle start, Mark 1 random enemy: team +35% final dmg to it.

---

### Controller (1/2/3) — Maltrus, Inquisition Support
- **I:** Every 6th BA Stuns.
- **II:** Every 5th BA Stuns.
- **III:** Every 4th BA Stuns.

---

### Duelist (1/2/3) — Raiken, Shogunate Fighter
- **I:** +10% Damage Amp to current target; +10% Damage Reduction against it.
- **II:** +15% Damage Amp to current target; +15% Damage Reduction against it.
- **III:** +20% Damage Amp to current target; +20% Damage Reduction against it.

---

### Fanatic (1/2/3) — Virella, Inquisition Assassin
- **I:** On death, strike killer 200% STR Pure.
- **II:** On death, strike killer 300% STR Pure.
- **III:** On death, strike killer 400% STR Pure.

---

### Fieldwright (1/2/3) — Rhea, Aegis Support
- **I:** After you cast, allies in your column: Repair Shield = 6% Max HP (2 turns) & +40/40 Phys/Spell Def while it holds.
- **II:** After you cast, allies in your column: Repair Shield = 9% Max HP (2 turns) & +65/65 Phys/Spell Def while it holds.
- **III:** After you cast, allies in your column: Repair Shield = 12% Max HP (2 turns) & +90/90 Phys/Spell Def while it holds.

---

### Graviton (1/2/3) — Um’Kar, Nebulae Tank
- **I:** At 50% HP, Taunt enemies in a 3 tiles area & gain Shield = 10% Max HP and +10% Damage Reduction.
- **II:** At 50% HP, Taunt enemies in a 3 tiles area & gain Shield = 15% Max HP and +20% Damage Reduction.
- **III:** At 50% HP, Taunt enemies in a 3 tiles area & gain Shield = 20% Max HP and +30% Damage Reduction.

---

### Gunner (1/2/3) — BL-STR, Nexus Shooter
- **I:** Every 6th BA +50% bonus Physical.
- **II:** Every 6th BA +75% bonus Physical.
- **III:** Every 6th BA +100% bonus Physical.

---

### Harbinger (1/2/3) — Selenar, Inquisition Caster
- **I:** On Spell cast, pulse 20% WIS as Spell at a random enemy.
- **II:** On Spell cast, pulse 35% WIS as Spell at a random enemy.
- **III:** On Spell cast, pulse 50% WIS as Spell at a random enemy.

---

### Juggernaut (1/2/3) — Krantz, Aegis Fighter
- **I:** Taking damage: +2% Strength & +15/15 Phys/Spell Def (10 stacks).
- **II:** Taking damage: +3% Strength & +30/30 Phys/Spell Def (10 stacks).
- **III:** Taking damage: +4% Strength & +45/45 Phys/Spell Def (10 stacks).

---

### Medic (1/2/3) — MED-X, Nexus Support
- **I:** Every 4s, heal lowest-HP ally 8% Missing HP.
- **II:** Every 4s, heal lowest-HP ally 12% Missing HP.
- **III:** Every 4s, heal lowest-HP ally 16% Missing HP.

---

### Mutant (1/2/3) — Xal’Thar, Nebulae Fighter
- **I:** Every 2s: +1% Strength & +5/5 Def.
- **II:** Every 2s: +1.5% Strength & +7/7 Def.
- **III:** Every 2s: +2% Strength & +9/9 Def.

---

### Mystic (1/2/3) — Enjiro, Shogunate Support
- **I:** Every 5s, team gains +10% Crit & +6% Dodge for 2s.
- **II:** Every 5s, team gains +15% Crit & +9% Dodge for 2s.
- **III:** Every 5s, team gains +20% Crit & +12% Dodge for 2s.

---

### Neurosage (1/2/3) — Vohr, Nebulae Support
- **I:** At battle start, link to the closest ally and +10% of your STR & WIS to the linked ally; you gain +6% Damage Reduction while linked.
- **II:** At battle start, link to the closest ally and +15% of your STR & WIS to the linked ally; you gain +9% Damage Reduction while linked.
- **III:** At battle start, link to the closest ally and +20% of your STR & WIS to the linked ally; you gain +12% Damage Reduction while linked.

---

### Overseer (1/2/3) — OMN-1, Nexus Caster
- **I:** Every 10s, Expose all enemies (2s): +10% final dmg taken.
- **II:** Every 10s, Expose all enemies (2s): +15% final dmg taken.
- **III:** Every 10s, Expose all enemies (2s): +20% final dmg taken.

---

### Paladin (1/2/3) — Caelum, Inquisition Fighter
- **I:** On Crit: heal 3% Max HP & +50 Spell Def for 2s.
- **II:** On Crit: heal 5% Max HP & +75 Spell Def for 2s.
- **III:** On Crit: heal 7% Max HP & +100 Spell Def for 2s.

---

### Phantom (1/2/3) — Ayane, Shogunate Shooter
- **I:** Each BA fires a phantom projectile at random enemy for 10% final damage.
- **II:** Each BA fires a phantom projectile at random enemy for 15% final damage.
- **III:** Each BA fires a phantom projectile at random enemy for 20% final damage.

---

### Phaseblade (1/2/3) — Yz’Xal, Nebulae Assassin
- **I:** BAs & Spells ignore 20% of target's Phys Def & Spell Def.
- **II:** BAs & Spells ignore 30% of target's Phys Def & Spell Def.
- **III:** BAs & Spells ignore 40% of target's Phys Def & Spell Def.

---

### Pillar (1/2/3) — Shin, Shogunate Tank
- **I:** +80/80 Phys/Spell Def; when a Pillar dies, team gains +4% of that ally's total Def.
- **II:** +120/120 Phys/Spell Def; when a Pillar dies, team gains +7% of that ally's total Def.
- **III:** +160/160 Phys/Spell Def; when a Pillar dies, team gains +10% of that ally's total Def.

---

### Reaper (1/2/3) — Lunara, Eclipse Assassin
- **I:** +7% damage to enemies <50% HP; on kill, heal 4% Max HP.
- **II:** +14% damage to enemies <50% HP; on kill, heal 7% Max HP.
- **III:** +21% damage to enemies <50% HP; on kill, heal 10% Max HP.

---

### Scribe (1/2/3) — Seido, Shogunate Caster
- **I:** Every 3rd Spell recasts at 30% (Echoes can't Echo).
- **II:** Every 3rd Spell recasts at 40% (Echoes can't Echo).
- **III:** Every 3rd Spell recasts at 50% (Echoes can't Echo).

---

### Sentinel (1/2/3) — Aureon, Inquisition Tank
- **I:** +15% Max HP; whenever you cast, heal 5% Max HP.
- **II:** +20% Max HP; whenever you cast, heal 7% Max HP.
- **III:** +25% Max HP; whenever you cast, heal 9% Max HP.

---

### Shaman (1/2/3) — Esmara, Eclipse Support
- **I:** Healing/Shielding also applies Regen = 2% Missing HP per second for 4s.
- **II:** Healing/Shielding also applies Regen = 3% Missing HP per second for 4s.
- **III:** Healing/Shielding also applies Regen = 4% Missing HP per second for 4s.

---

### Sharpshooter (1/2/3) — Belric, Inquisition Shooter
- **I:** +10% Crit Chance; on Crit, +10% bonus Pure Damage of target's current HP.
- **II:** +15% Crit Chance; on Crit, +15% bonus Pure Damage of target's current HP.
- **III:** +20% Crit Chance; on Crit, +20% bonus Pure Damage of target's current HP.

---

### Singularity (1/2/3) — Ael’Yzeth, Nebulae Caster
- **I:** Every 15s, pulse 15% Missing HP as Spell to all enemies.
- **II:** Every 15s, pulse 25% Missing HP as Spell to all enemies.
- **III:** Every 15s, pulse 35% Missing HP as Spell to all enemies.

---

### Sniper (1/2/3) — Ereth, Eclipse Shooter
- **I:** BAs deal +2% Damage per tile of distance with the target.
- **II:** BAs deal +4% Damage per tile of distance with the target.
- **III:** BAs deal +6% Damage per tile of distance with the target.

---

### Stormcaller (1/2/3) — Voss, Aegis Caster
- **I:** Every 4th BA calls lightning: 20% WIS Spell to a random enemy.
- **II:** Every 4th BA calls lightning: 35% WIS Spell to a random enemy.
- **III:** Every 4th BA calls lightning: 50% WIS Spell to a random enemy.

---

### Sunderer (1/2/3) — Grimm, Aegis Assassin
- **I:** BAs vs enemies <30% HP deal +8% Max HP as Pure.
- **II:** BAs vs enemies <30% HP deal +12% Max HP as Pure.
- **III:** BAs vs enemies <30% HP deal +16% Max HP as Pure.

---

### Unbeing (1/2/3) — Uz’Un, Nebulae Shooter
- **I:** On Crit, apply Unbeing: 4% STR Phys DoT per second for 3s.
- **II:** On Crit, apply Unbeing: 7% STR Phys DoT per second for 3s.
- **III:** On Crit, apply Unbeing: 10% STR Phys DoT per second for 3s.

---

### Voidweaver (1/2/3) — Vema, Eclipse Caster
- **I:** +15% Crit & +30% Crit Dmg for Spells.
- **II:** +25% Crit & +50% Crit Dmg for Spells.
- **III:** +35% Crit & +70% Crit Dmg for Spells.

---

### Warden (1/2/3) — Grolm, Eclipse Tank
- **I:** Taking damage: +10/10 Phys/Spell Def (stack 20).
- **II:** Taking damage: +15/15 Phys/Spell Def (stack 20).
- **III:** Taking damage: +20/20 Phys/Spell Def (stack 20).

---

### Wraith (1/2/3) — Kazuro, Shogunate Assassin
- **I:** After casting, +5% Dodge (2 turns); when you Dodge, heal 2% Missing HP.
- **II:** After casting, +10% Dodge (2 turns); when you Dodge, heal 4% Missing HP.
- **III:** After casting, +15% Dodge (2 turns); when you Dodge, heal 6% Missing HP.

---

> [!info] Related Documents
> - [[hero_kits]] — Heroes with their synergy assignments
> - [[core_design]] — Synergy system rules in the CDC
