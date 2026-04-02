---
title: "Blessing System Design"
tags: [blessings, design]
source: "Blessing Compendium.docx"
last_updated: 2026-03-26
---

# 1. Purpose & Design Intent

**A Blessing in Strifeborn is primarily a way to force commitment to a build direction, not a way to correct mistakes.**

Blessings are the main layer of **adaptive progression** during a run.  
They do not exist to smooth difficulty curves or compensate for weak decisions.  
They exist to **push identity, create forks, and lock commitment**.

Each Blessing permanently alters the trajectory of a run by reinforcing a chosen direction or enabling a new one. Once chosen, a Blessing becomes part of the run’s structure and cannot be undone.

Blessings reward:

* Strategic foresight
* Willingness to commit
* Acceptance of risk

Blessings intentionally allow failure.  
A run lost after a risky Blessing is a **valid outcome**, not a balance error.

# 2. Core Philosophy

## 2.1 Commitment Over Safety

Blessings are **decisions with consequences**.

They may:

* Amplify existing strengths
* Enable new interactions
* Expose weaknesses more sharply

They must not:

* Act as safety nets
* Passively fix bad compositions
* Quietly normalize poor decisions

Choosing a Blessing is a declaration of intent.

## 2.2 Determinism First

All Blessings are **fully deterministic**.

Blessings:

* Never roll chance during combat
* Never introduce hidden randomness
* Never resolve probabilistically

Any Blessing effect must be:

* Rule-based
* Predictable
* Traceable through inspection

Randomness belongs to **availability**, not **resolution**.

## 2.3 Permanence & Responsibility

Once a Blessing is selected:

* It applies for the rest of the run
* It cannot be removed, replaced, or downgraded
* Conflicting Blessings are allowed

Resolving conflicts is **entirely the player’s responsibility**.

Blessings do not protect the player from poor synergy or overcommitment.

# 3. Acquisition Rules

## 3.1 Timing

Blessings are obtained **only after Swarm waves**.

This guarantees:

* Predictable pacing
* Clear rhythm between pressure and choice
* Strategic planning opportunities without mid-combat interference

In Campaign mode (25 waves):

* Exactly **5 Blessings** are obtained per run

In Endless mode:

* Blessings continue indefinitely
* Cognitive load is an intentional mastery test

## 3.2 Selection Rules

At each Blessing event:

* The player is offered **three Blessings**
* All three share the **same rarity**
* One Blessing must be chosen

Once selected:

* The Blessing is removed from the run’s pool
* It cannot appear again during that run

## 3.3 Distribution Rules

Blessings’ rarity distribution scales with the Act currently playing according to this table:

|  |  |  |  |
| --- | --- | --- | --- |
| Act | Bronze | Silver | Gold |
| 1 | 65% | 30% | 5% |
| 2 | 55% | 35% | 10% |
| 3 | 45% | 40% | 15% |
| 4 | 35% | 45% | 20% |
| 5 | 25% | 50% | 25% |

# 4. Rarity Contract

Blessings follow a strict three-tier rarity system.

## 4.1 Bronze Blessings

* Reliable and consistent
* Primarily numeric or structural
* Low cognitive overhead
* Never redefine core gameplay loops

Bronze Blessings stabilize a direction without locking it.

## 4.2 Silver Blessings

* Modify how systems or kits behave
* Introduce new interactions or constraints
* Require understanding and anticipation

Silver Blessings begin to **shape** a build.

## 4.3 Gold Blessings

* Define playstyle
* Introduce permanent rules or scaling vectors
* Lock the run into a direction

Gold Blessings are intentionally:

* Powerful
* Polarizing
* Risky

A Gold Blessing is a commitment, not an upgrade.

# 5. Blessing Categories

All Blessings belong to exactly one of the following categories.

## 5.1 Hero Blessings

* Apply to a single specific hero
* Permanently modify stats or kit behavior
* Are defined in the Hero Compendium

Hero Blessings are the **most personal and run-defining** Blessings.

Only Hero Blessings are allowed to introduce hero-specific scaling tied to rarity.

## 5.2 Synergy Blessings

* Affect Faction, Class, or Extra synergies
* Use deterministic tokens, artifacts, or counters
* Never introduce hidden synergies

Synergy Blessings shape composition direction without bypassing synergy rules.

## 5.3 Economy Blessings

* Modify Gold, interest, shop rules, or refunds
* Are fully deterministic
* Never depend on combat outcomes beyond defined triggers

Economy Blessings trade immediate power for long-term leverage.

## 5.4 Player Blessings

* Affect preparation and progression layers
* Influence recruiting, items, deployment, or meta-resources
* Do not alter combat resolution directly

Player Blessings reshape how the run is managed, not how fights are executed.

## 5.5 Teamwide Blessings

* Apply global combat rules to all allies
* Affect positioning, timing, or shared effects
* Never introduce exceptions or hidden targeting

Teamwide Blessings define **how the team functions as a system**.

# 6. Scaling Rules

## 6.1 Forbidden Scaling

Blessings must never scale with:

* Wave number
* Enemy tier
* Time spent in combat
* Overdrive stages
* Random stacking

## 6.2 Allowed Scaling

Only **Hero Blessings** may introduce scaling, and only if:

* The scaling is explicit
* The behavior is finite or asymptotic
* The effect remains readable and inspectable

All other Blessing categories must remain **static** once chosen.

# 7. Interaction With Other Systems

## 7.1 Overdrive

Blessings:

* Do not modify Overdrive timing
* Do not ignore Overdrive penalties
* Do not scale with Overdrive

Overdrive is a global execution pressure and remains untouchable.

## 7.2 Visibility & Inspection

Blessing effects:

* Are not directly visualized on units
* Must be fully inspectable through the Blessings interface

Players are expected to **inspect and understand** their Blessings.

# 8. Failure Interpretation

When a run fails after choosing Blessings, the intended interpretation is:

“I chose this direction, and I accepted the consequences.”

Blessings do not guarantee success.  
They guarantee **clarity of responsibility**.

# 9. Blessings Template

**Category × Rarity Authoring Rules**

Each Blessing is defined by **two axes**:

* **Category** (Hero / Synergy / Economy / Player / Teamwide)
* **Rarity** (Bronze / Silver / Gold)

A Blessing **must comply with both** its category rules *and* its rarity rules.

If it violates either → **it is invalid**.

## 9.1 Hero Blessings

**Identity-first, hero-specific, run-defining.**

Hero Blessings are defined **per hero** and live in the **Hero Compendium**.

### 9.1.1 Bronze Hero Blessings

**Purpose:** Reliability & baseline reinforcement.

**Allowed**

* Flat stat increases (Strength / Wisdom / HP / Defense)
* Small survivability boosts (shields, damage reduction caps, sustain)
* Consistency improvements (uptime smoothing, reduced variance)

**Constraints**

* No behavior change
* No new triggers
* No scaling beyond the stat itself
* Must not change how the hero is played

**Litmus test**

“If I ignore this Blessing, the hero still plays the same way.”

### 9.1.2 Silver Hero Blessings

**Purpose:** Kit modification.

**Allowed**

* Modify **one** kit component:
  + Basic Attack **or**
  + Spell **or**
  + Passive
* Add deterministic conditional effects
* Alter targeting, timing, or payoff

**Constraints**

* One component only
* No permanent scaling loops
* Must preserve hero identity
* Must remain fully deterministic

**Litmus test**

“This Blessing changes *how* I use this hero, not *what* the hero is.”

### 9.1.3 Gold Hero Blessings

**Purpose:** Playstyle definition.

**Allowed**

* Permanent scaling tied to hero actions
* Unique modifiers unavailable elsewhere
* Structural changes to the hero’s role

**Constraints**

* Scaling must be explicit and bounded
* No infinite, uncapped growth
* Cannot invalidate core counters
* Cannot make the hero self-sufficient

**Litmus test**

“This Blessing makes me build the team *around* this hero.”

## 9.2 Synergy Blessings

**Composition shaping without rule-breaking.**

Synergy Blessings affect **Faction, Class, or Extra synergies only**.

### 9.2.1 Bronze Synergy Blessings

**Purpose:** Threshold access.

**Allowed**

* +1 Synergy Token
* Flat counter increases
* Deterministic synergy selection

**Constraints**

* No conditional triggers
* No scaling
* No per-turn effects

**Litmus test**

“This helps me *reach* a synergy breakpoint.”

### 9.2.2 Silver Synergy Blessings

**Purpose:** Synergy expression.

**Allowed**

* Grant a Synergy Artifact
* Convert resources into synergy value
* Reinforce an existing synergy direction

**Constraints**

* Artifact effects must already exist in the system
* No new mechanics
* No cross-synergy multiplication

**Litmus test**

“This makes one synergy matter more.”

### 9.2.3 Gold Synergy Blessings

**Purpose:** Synergy commitment.

**Allowed**

* Persistent synergy-wide effects
* Limited, deterministic progression tied to waves or turns
* Artifact + system-effect combinations

**Constraints**

* Must lock the run into a synergy direction
* Cannot scale infinitely
* Cannot implicitly activate multiple synergies

**Litmus test**

“After this, abandoning the synergy is wrong.”

## 9.3 Economy Blessings

**Long-term leverage over short-term power.**

Economy Blessings are **fully deterministic** and **pre-combat only**.

### 9.3.1 Bronze Economy Blessings

**Purpose:** Minor, predictable income.

**Allowed**

* Flat Gold per wave
* Conditional but guaranteed rewards
* One-time delayed payouts

**Constraints**

* No percentage scaling
* No compounding
* No combat triggers

**Litmus test**

“This is always good, never exciting.”

### 9.3.2 Silver Economy Blessings

**Purpose:** Structural economy advantage.

**Allowed**

* Interest cap changes
* Shop cost reductions
* Refund rule changes

**Constraints**

* No runaway loops
* No infinite resources
* Must respect Gold sinks

**Litmus test**

“This changes *how* I manage Gold.”

### 9.3.3 Gold Economy Blessings

**Purpose:** Economic identity.

**Allowed**

* Global income multipliers
* Rule overrides (refund penalties, free items)
* Economy-to-power conversion

**Constraints**

* Cannot remove economic tension entirely
* Cannot trivialize Shops or recruiting
* Must create long-term commitment

**Litmus test**

“My run is now an economy build.”

## 9.4 Player Blessings

**Meta-layer control over the run.**

Player Blessings affect **preparation, progression, and resources**.

### 9.4.1 Bronze Player Blessings

**Purpose:** Extra tools.

**Allowed**

* Tokens (recruit, reroll, reforge, duplicate)
* Limited one-shot resources
* Minor Tier nudges

**Constraints**

* Finite use
* No permanent combat effects
* No scaling

**Litmus test**

“This gives me options, not power.”

### 9.4.2 Silver Player Blessings

**Purpose:** Structural flexibility.

**Allowed**

* Deployment cap increases
* Persistent preparation bonuses
* Predictable post-wave rewards

**Constraints**

* Must not bypass core progression rules
* Must not grant infinite resources

**Litmus test**

“This changes how I plan my run.”

### 9.4.3 Gold Player Blessings

**Purpose:** Run-wide control lever.

**Allowed**

* Automated progression rules
* Persistent post-battle effects
* Deterministic hero growth over time

**Constraints**

* Cannot remove player agency entirely
* Cannot invalidate difficulty
* Must introduce risk or opportunity cost

**Litmus test**

“My run now plays by different rules.”

## 9.5 Teamwide Blessings

**System-wide combat identity.**

Teamwide Blessings affect **all allies symmetrically**.

### 9.5.1 Bronze Teamwide Blessings

**Purpose:** Baseline reinforcement.

**Allowed**

* Flat stat bonuses
* Simple positional bonuses
* Start-of-battle effects

**Constraints**

* No per-action triggers
* No chaining logic
* No hidden priorities

**Litmus test**

“This helps everyone a little.”

### 9.5.2 Silver Teamwide Blessings

**Purpose:** Combat pattern shaping.

**Allowed**

* Deterministic triggers (every N actions)
* Board control effects
* Conditional damage modifiers

**Constraints**

* Must remain readable
* No cascading triggers
* No soft infinite loops

**Litmus test**

“This changes how fights unfold.”

### 9.5.3 Gold Teamwide Blessings

**Purpose:** Team identity lock.

**Allowed**

* Persistent global rules
* Teamwide scaling from defined events
* Centralized effects (zones, anchors, carriers)

**Constraints**

* Cannot remove counterplay
* Cannot dominate without positioning
* Cannot scale infinitely without bounds

**Litmus test**

“My entire team is built around this.”

## 9.6 Global Invalid Patterns

A Blessing is **invalid by definition** if it:

* Introduces randomness in combat
* Scales infinitely without caps
* Interacts with Overdrive
* Applies hidden targeting logic
* Fixes mistakes without trade-offs
* Makes decisions reversible

# 10. Blessing Designs

## 10.1 Hero Blessings

They can be found in the Hero Compendium in each hero’s kit.

## 10.2 Synergy Blessings

Synergy Blessings increase the counters of randomly chosen Faction, Class or Extra synergies. Those randomly chosen synergies always stays within the range of the heroes from the player’s pool yet with a slight % chance of being out of this player’s pool.

|  |  |  |
| --- | --- | --- |
| Tier | Effect Type | Examples |
| Bronze | Synergy Token | “Gain +1 [Synergy] Token.” |
| Silver | Artifact | “Gain 1 [Synergy] Artifact” |
| Gold | Artifact + Item or Effect | “Gain 1 [Synergy] Artifact and [Synergy] heroes gain +1 Counter each turn.” Or “Gain 1 [Synergy] Artifact and Advanced Item related to this [Synergy].” |

## 10.3 Econ Blessings

This section handles deterministic economy modifiers — such as flat Gold bonuses, interest cap increases, or recruitment tweaks.

**Bronze**

1. **Minor Dividend** — At the end of each wave, gain +1 bonus Gold.
2. **Efficient Recruiter** — Your first Recruit each wave costs 2 Gold.
3. **Predictable Returns** — At the start of next Act, earn +10 Gold.
4. **Crowded Bench** — If the Bench is full at the start of each wave, gain +3 Gold.
5. **Milestone Bonus** — Gain +2 Gold after Elite waves and +3 Gold after Boss waves (on top of base rewards).

**Silver**

1. **Compound Interest** — Interest cap +2 Gold (max +6 instead of +4).
2. **Merchant Network** — −25% to all Shop prices.
3. **Bulk Contract** — If you Recruit 3+ heroes in a phase, refund 3 Gold total.
4. **Silver Token** — When you buy a Synergy Token, gain +4 Gold back.
5. **Recycling Protocol** — Selling any Item refunds 75% of its cost instead of 50%.

**Gold**

1. **Economic Singularity** — Wave Gold +50%.
2. **Dividend Arrival** — +1 Gold on Interest bonus.
3. **Automated Trader** — After every Shop phase, gain 1 random Basic Item for free.
4. **Infinite Ledger** — Selling a Tier ≥4 Hero refunds full invested Gold (remove the normal “−1 per T1 used” penalty).
5. **Chorus Patronage** — Whenever you select a Blessing, gain +3 Gold.

## 10.4 Player Blessings

This section covers permanent player-level rewards between combats (item duplication, recruit tier bonuses, reforges, etc.).

**Bronze**

1. **Draft Booster** — The first 2 Recruits each wave arrives at +1 Tier.
2. **Deja Vu** — Gain 3 Hero Token: each gives a Tier 1 copy of the chosen Hero.
3. **Reforge Kit** — Gain 3 Reforge Tokens: each token turns one Item or Artifact you own into another random one.
4. **Duplication Kit** — Gain 3 Dup Tokens: each token duplicates one Item you own.
5. **Blessing Instinct** — Gain +3 extra Blessing rerolls for the run.

**Silver**

1. **Experienced Trainer** — Gain 15% chance to add +1 Tier when merging or recruiting.
2. **Deployment Permit** — Deployment limit +2.
3. **Swarm Reward** — After each Swarm wave, gain a random Advanced Items.
4. **Veteran Feedback** — After each Act, gain 1 Blank Token: once applied to a hero pick 1 of the 3 Synergies of the Hero (faction, class, extra).
5. **Lucky Armory** — Gain 2 Armory Tokens: when used on a Basic Item, pick 1 Advanced Item built with this Basic Item.

**Gold**

1. **Conscription Order** — After each battle auto-recruit 1 random hero from your unlocked pool for free, if your Bench is full, you instead gain +4 Gold.
2. **Twisted Reality** — After each battle, Items and Artifacts still on bench are rerolled into another random ones of the same type.
3. **Master’s Chest** — After each Shop gain a Master’s chest, when open: pick 1 of 3 Advanced Item and Artifact duo.
4. **Mirror Forge** — After each Shop, duplicate one random item you own (Basic or Advanced; once per Shop).
5. **Tactical Promotion** — For the next 5 Waves, after the battle, one random hero gains +1 Tier.

## 10.5 Teamwide Blessings

Teamwide Blessings will apply combat-wide changes.

**Bronze**

1. **Cohesion Plating** — At battle start, each ally gains **Shield = 5% Max HP per adjacent ally** (up to 3 adjacents; stacks separately).
2. **Vital Reserves** — Allies gain **+120 HP** and **+6% Max HP** (additive).
3. **Tempo Spark** — The **first time** each ally casts this battle: **refund 1 Charge** (min 1) and gain **+10% Damage Amp (1 turn)**.
4. **Knife’s Edge** — Allies deal **+15% final damage** to **isolated** targets (no enemies within 2 tiles).
5. **Heavy Hands** — Basic Attacks deal **+2% of the target’s current HP** as **normal damage** (in addition to BA).

**Silver**

1. **Loaded Carriers** — Each ally **equipped with 3 items** emits a pulse at **end of their turn**: **40% of their BA damage** to enemies within **2 tiles** (Spell).
2. **Favored Ground** — At wave start, a **random tile** becomes **Empowered (this wave)**. An ally standing on it gains **+25% Strength & +25% Wisdom** and **+10% Damage Reduction**.
3. **Combo Guard** — Every **3rd team action**, grant **Shield = 8% Max HP** to **all allies** (refreshes, doesn’t stack).
4. **Opening Cuts** — Your hits deal **+15% final damage** to enemies **above 70% HP**.
5. **Enhanced Promotion** — Whenever an ally **increases Tier**, they gain **+20% extra stats** from that Tier’s increase (applied once per tier-up).

**Gold**

1. **Relic Bearer** — At battle start, the **first ally with 3 items** becomes the **Relic Bearer**: **+25% Damage Amp** and, at end of their turn, fire a **3×1 beam** for **100% of their BA damage** (Spell). If they die, Relic moves to the next 3-item ally.
2. **Sanctum Zone** — Before battle, **mark a 2×2 zone**. Allies inside gain **+20% Strength & +20% Wisdom**, **+20% Damage Reduction**, and **+1 Priority** (while inside).
3. **Ascendant Chorus** — Each time **any ally gains a Tier**, **all allies** gain **+2% Strength & +2% Wisdom permanently**.
4. **Execution Matrix** — Allied hits deal **bonus Pure damage = 6% of the target’s Missing HP**.
5. **Clockwork Surge** — At battle start, **all Spells −1 Charge** (min 1). Then, every **4 team turns**, **−1 additional Charge** for **all allies** (min 1).

---

> [!info] Related Documents
> - [[blessing_kits]] — Economy, Player, and Teamwide blessing data
> - [[hero_kits]] — Hero-specific blessings in each hero's kit
