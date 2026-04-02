---
title: "Enemy & Boss Compendium"
tags: [enemies, bosses, design, data]
source: "Enemy & Boss Compendium.docx"
last_updated: 2026-03-26
---

# Enemy Design Contract

**1.1 Purpose & Design Intent**

Enemies are the primary means by which the game evaluates the player’s **pre-combat decisions**.

They exist to:

* Test hero selection, synergies, and positioning
* Validate or invalidate build directions
* Enforce clarity between difficulty choice and expected mastery
* Reward preparation and foresight over reaction speed

Enemies are not designed to surprise a prepared player.  
They are designed to punish **lack of preparation**.

A player who inspects enemies, positions correctly, and builds coherently should generally win encounters cleanly.

**1.2 Preparation-First Combat Philosophy**

Combat outcomes are determined **before the battle starts**.

The player is expected to:

* Inspect enemy rosters
* Read abilities and behaviors
* Position heroes accordingly
* Accept the consequences of difficulty selection

In-combat execution matters, but it is secondary to:

* Composition quality
* Positioning
* Anticipation of enemy threats

If an enemy kills a hero, it must be traceable to a decision the player could have made differently *before* combat.

**1.3 Readability, Information & Failure**

All enemies are **fully readable**.

* Enemy abilities, behaviors, and targeting logic can be inspected before battle
* Visual and behavioral cues are consistent and unambiguous
* No enemy relies on hidden mechanics or undocumented effects

Inspection is optional.

A player who chooses not to inspect enemies accepts the risk of surprise.  
Such surprises are intentional and valid failure cases.

Example:  
Placing a fragile carry at the furthest position against an enemy that targets or pulls the furthest unit is a player mistake, not unfair design.

**1.4 Misplay Punishment Distribution**

Punishment severity is intentionally tiered by enemy category:

**Swarm Enemies**

* Individually way weaker than heroes
* Apply pressure through body count, space occupation, and sustained contact
* Function as **AoE, sustain, and frontline checks**
* Can overwhelm and wipe teams if left unchecked, especially on higher difficulties

**Standard Enemies**

* Individually a bit weaker than heroes
* Define baseline combat difficulty
* Rarely kill heroes on their own
* Punish inefficiency and poor focus rather than single mistakes

**Elite Enemies**

* Individually equivalent to heroes
* Introduce localized build and positioning checks
* Can decisively punish mispositioning or incorrect targeting
* Are capable of killing heroes when mishandled

**Bosses**

* Individually way more stronger than heroes
* Fully punish incorrect preparation
* Test multiple axes simultaneously (positioning, durability, damage profile, control)
* Are allowed to end runs decisively

Misplay is not ignored — it is **concentrated where mastery is expected**.

**1.5 Rules Parity, Control & Mechanical Fairness**

Enemies obey the same core combat rules as heroes.

They do not:

* Act while stunned or disabled
* Ignore collision, range, or targeting rules
* Bypass mitigation systems
* Gain hidden or ad-hoc exceptions

Asymmetry comes from **behavior and parameters**, not rule-breaking.

**Control Effects & Resistance Scaling**

Crowd control follows a **systemic resistance model** based on enemy category:

* **Bosses**
  + Fully immune to all Hard Crowd Control effects
  + All non-Hard CC effects are less effective
* **Elite Enemies**
  + Hard Crowd Control effects are less effective
  + Non-Hard CC effects apply normally

These resistances are:

* Predictable
* Consistent
* Defined globally by system rules

Control remains a valid tactical axis, but cannot fully invalidate Elite or Boss encounters.

**1.6 Damage, Avoidability & Responsibility**

Enemy damage is always the result of:

* Targeting logic
* Positioning
* Timing
* Difficulty-scaled stats

Enemies do not deal damage that is:

* Hidden
* Untelegraphed
* Inevitable regardless of preparation

Damage that feels unavoidable must always be traceable to:

* Incorrect positioning
* Inadequate defenses for the chosen difficulty
* A deliberate risk taken by the player

**1.7 Difficulty as Commitment**

Difficulty selection meaningfully alters enemy strength through:

* Higher enemy tiers
* Increased stats
* Reduced tolerance for misplay

Higher difficulty does not:

* Change enemy rules
* Introduce unfair mechanics
* Remove counterplay

Choosing a higher difficulty is an explicit commitment to deeper system mastery.

**1.8 Role of This Compendium**

The Enemy & Boss Compendium serves two purposes:

* **In-game reference** for enemy behavior and threats
* **Design contract** ensuring consistency, fairness, and readability

This document defines what enemies are allowed to be.

# Enemy Description Structure & Authoring Guide

This section defines the **mandatory structure** for all enemy, elite, and boss entries in the Enemy & Boss Compendium, as well as the **global wave budget calculation model** used by all enemies.

Every enemy must follow this structure exactly.  
Differences between enemy categories affect **content inside sections**, not the section order itself.

**2.1 Enemy Overview**

Each enemy entry must begin with an **Enemy Overview** containing:

* **Faction**  
  The thematic faction the enemy belongs to.
* **Category**  
  One of:
  + Swarm
  + Normal
  + Elite
  + Boss
* **Role Tags**  
  Functional descriptors such as:
  + Frontliner
  + Backliner
  + Disruptor
  + Assassin
  + Support
  + Swarm  
    (Multiple tags allowed.)
* **Fantasy & Identity**  
  A short description of what the enemy represents and how that fantasy translates into combat behavior.
* **Strategic Role**  
  A concise explanation of:
  + What problem this enemy introduces
  + What axis of the player’s build or positioning it tests

**2.2 Base Stats (Tier 1)**

Enemies define **Tier 1 base stats** using the same stat framework as heroes.

* Strength
* Wisdom
* Health
* Physical Defense
* Spell Defense
* Attack Speed
* Crit Chance
* Crit Damage
* Movement Speed
* Range
* Max Mana (0 if not applicable)
* Starting Mana (0 if not applicable)

Tier scaling follows the same global rules as heroes.

**Tier 1 values are the sole reference for wave budget calculations.**  
Tier scaling is handled separately through a Tier Multiplier (see 2.6).

**2.3 Enemy Kit**

Enemy kits follow a strict structure depending on category.

**Swarm Enemies**

* **Basic Attack only**

**Normal Enemies & Elite Enemies**

* **Basic Attack**
* **Either one Spell or one Passive** (never both)

**Bosses**

* **Basic Attack**
* **Spell** (active or passive)
* **Passive**

Boss abilities may receive **Tier Enhancements**, following the same enhancement philosophy as heroes.

All enemy abilities must:

* Be deterministic
* Explicitly define targeting and timing
* Avoid hidden triggers or undocumented behavior

**2.4 Threat Profile**

This section describes how and when the enemy is dangerous.

Each entry must clearly state:

* Primary threat axis
* Which heroes or positions are most at risk
* When the threat becomes significant

**2.5 Weaknesses & Counterplay**

This section defines how the enemy is intended to be handled.

It must explicitly describe:

* Effective build responses
* Positional solutions
* What the player should avoid doing

Every enemy must have **at least one clear counterplay path**.

**2.6 Wave Budget Hooks**

This section defines **how enemy wave budget value is calculated** and how each enemy exposes its cost to wave generation systems.

All enemies use the **same global calculation model**.

**2.6.1 Global Constants**

**Category Weights**

|  |  |
| --- | --- |
| Category | Weight |
| Swarm | 0.60 |
| Normal | 1.00 |
| Elite | 2.00 |
| Boss | 6.00 |

**Tier Multiplier**

TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Stat Power Weights**

* OffenseWeight = 0.55
* DefenseWeight = 0.45
* DefenseStatWeight = 4

**Role Tag Multipliers**

(Only the highest applicable tag is used; do not stack.)

|  |  |
| --- | --- |
| Role Tag | Multiplier |
| Frontliner | 1.10 |
| Backliner | 1.05 |
| Disruptor | 1.15 |
| Assassin | 1.15 |
| Support | 1.20 |
| Swarm | 1.00 |
| None | 1.00 |

RoleMultiplier is capped at **1.25**.

**Global Scaling Constants**

* **BASE\_POINTS = 100**  
  A single global scale factor converting unit value into wave budget points.
* **ReferenceStatPower**  
  Defined by the baseline enemy in Section 2.6.2.

**2.6.2 Baseline Enemy (Reference Unit)**

All wave budget calculations are normalized against a single **baseline enemy**.

This baseline represents a **typical Normal Tier 1 enemy** with no special role pressure.

**Baseline Enemy Definition**

* **Category:** Normal
* **Tier:** 1
* **Role Tags:** None

**Tier 1 Stats used for budget reference:**

* Strength: 45
* Wisdom: 25
* Health: 350
* Physical Defense: 45
* Spell Defense: 45

**Baseline Stat Power Calculation**

* **Offense**

Offense = STR + WIS = 45 + 25 = 70

* **Defense**

Defense = HP + 4 × (PhysDef + SpellDef) = 350 + 4 × (45 + 45) = 350 + 360 = 710

* **StatPower**

StatPower = 0.55 × 70 + 0.45 × 710 = 38.5 + 319.5 = 358

✅ **ReferenceStatPower = 358**

**2.6.3 Budget Calculation Model**

Enemy wave cost is computed in two steps.

**Step 1 — Base Unit Factor (Tier 1)**

Offense = STR + WIS

Defense = HP + 4 × (PhysDef + SpellDef)

StatPower = 0.55 × Offense + 0.45 × Defense

StatMultiplier = StatPower / ReferenceStatPower

BaseUnitFactor = CategoryWeight × StatMultiplier × RoleMultiplier

This value is fixed for the enemy across all difficulties.

**Step 2 — Tier Application**

UnitValue(T) = BaseUnitFactor × TierMultiplier(T)

FinalBudgetCost(T) = UnitValue(T) × BASE\_POINTS

Tier scaling is applied **exactly once**.

**2.6.4 Per-Enemy Budget Declaration**

Each enemy entry must include a **Wave Budget Hooks** subsection that shows:

* Tier 1 stats used
* Offense, Defense, and StatPower
* StatMultiplier
* CategoryWeight and RoleMultiplier
* Final BaseUnitFactor
* TierMultiplier formula
* Final budget cost as a function of Tier

Enemy entries apply this model and do not redefine it.

# Swarm Enemies

Swarm enemies represent **overwhelming numerical pressure** rather than individual threat.  
They exist to validate a team’s ability to handle **volume**, **attrition**, and **scaling**, not tactics or execution.

Swarm enemies are intentionally simple at the unit level and dangerous only through accumulation.

**3.1 Design Purpose**

Swarm enemies exist to test core build fundamentals:

* Area-of-effect damage
* Frontline durability
* Sustain and recovery
* Overall build strength relative to chosen difficulty

They are designed to **punish narrow, greedy, or single-target focused compositions**.

Swarms are not tactical puzzles.  
They are **stress tests**.

**3.2 Individual Threat Philosophy**

At equivalent tier:

* A single Swarm enemy is **almost harmless**
* It poses no meaningful resistance on its own
* It should never feel like a duel

Swarms become lethal only when:

* They appear in sufficient numbers
* The player lacks adequate AoE or sustain
* The player’s heroes are under-tiered for the difficulty

At higher difficulty, Swarms are dangerous because **heroes fall behind**, not because Swarms gain complexity.

**3.3 Mechanical Constraints**

Swarm enemies follow strict mechanical limits.

**3.3.1 Allowed Kit Structure**

* **Basic Attack only**
* May be melee or ranged
* No spells
* No passives

There are no exceptions.

**3.3.2 Forbidden Mechanics (Hard Rules)**

Swarm enemies must **never** have:

* High burst damage
* Long-range sniping behavior
* Hard Crowd Control (stun, silence, taunt, root, slow)
* Complex or multi-step mechanics
* One-shot potential
* Tank-level durability
* Mana-based or conditional abilities
* Unique per-enemy mechanics

Any Swarm design violating these rules is invalid.

**3.4 Swarm Wave Mechanics**

Swarm waves are **compositionally pure**.

* Swarm waves contain **only Swarm enemies**
* Swarms are never mixed with:
  + Normal enemies
  + Elites
  + Bosses

Difficulty comes exclusively from:

* Unit count
* Tier-scaled stats
* Global wave effects

**3.4.1 Global Swarm Effects**

Swarm waves may apply **global, wave-level mechanics**, such as:

* On-death explosions
* On-death spawns
* Global buffs tied to enemy deaths or proximity
* Time-based pressure effects

These effects:

* Apply to the entire wave
* Are identical for all Swarm units
* Never create per-enemy differentiation

Complexity belongs to the **wave**, not the unit.

**3.5 Counterplay Guarantees**

The following counters must **always** be valid against Swarm enemies:

* Area-of-effect damage
* Cleave / splash damage
* Crowd control that affects movement or grouping (non-Hard CC)
* Choke-point positioning
* Summons or decoys
* Sustain and lifesteal
* Strong frontline presence

Damage-over-time is **not** a primary intended counter and should never be required.

Swarm waves are designed around the expectation:

“Kill them all before they overwhelm your team.”

**3.6 Failure Conditions**

When a player loses to a Swarm wave, the intended interpretation is:

* “My build didn’t have enough AoE”
* “My frontline collapsed”
* “My sustain wasn’t sufficient”
* “This difficulty outscaled my current team”

Failure should **not** feel like:

* A surprise mechanic
* A positioning trick
* A hidden interaction
* A single mistake cascade

Swarms punish **structural weaknesses**, not momentary errors.

**3.7 Scaling Rules**

Swarm enemies scale exclusively through **tier-based stat scaling**.

* Swarm count remains stable
* No additional mechanics are introduced at higher difficulty
* No complexity is added through scaling

Higher difficulty increases Swarm lethality by:

* Raising enemy tier
* Increasing raw stats
* Narrowing the margin for insufficient builds

**3.8 Faction Expression**

While mechanically uniform, Swarm enemies express **faction identity** through:

* Visual language
* Animation style
* Formation behavior
* Thematic wave effects

Examples:

* Aegis Swarms may feel like weak but disciplined infantry
* Nexus Swarms may feel like coordinated drones
* Eclipse Swarms may feel like relentless infestations

Faction expression is **aesthetic and thematic**, not mechanical.

**3.9 Design Summary**

Swarm enemies are:

* Simple individually
* Dangerous collectively
* Predictable
* Unforgiving to insufficient builds

They are the game’s **purest expression of scaling pressure**.

# Normal Enemies

Normal enemies form the **core combat experience** of the game.

They define baseline difficulty, teach combat rules, and establish the player’s expectations of fairness, readability, and threat.

**4.1 Design Purpose**

Normal enemies are designed to:

* Teach core combat mechanics
* Introduce light mechanical variety
* Form the majority of non-boss encounters
* Prepare the player for Elite enemies
* Remain relevant throughout the entire run

They are the primary reference point for what combat is supposed to feel like.

**4.2 Individual Threat Philosophy**

At equivalent tier, a single Normal enemy is generally **slightly weaker than a hero**.

However, threat level depends heavily on role:

* Frontline units may feel durable
* Damage-focused units may feel dangerous
* Support units may feel oppressive if ignored

Normal enemies are not disposable.  
They demand respect.

**4.3 Lethality & Punishment**

Normal enemies are allowed to be lethal.

They:

* Can kill heroes if ignored
* Can punish mispositioning with death

Lethality must always be:

* Readable
* Role-driven
* A consequence of player decisions

Normal enemies are pressure and execution checks, not traps.

**4.4 Mechanical Complexity**

Each Normal enemy follows a strict complexity limit.

**Allowed Kit Structure**

* **Basic Attack**
* **Plus exactly one** of:
  + a simple active spell, **or**
  + a simple passive, **or**
  + a simple conditional behavior

No Normal enemy may combine multiple mechanics.

Complexity emerges from **enemy combinations**, not from individual units.

**4.5 Allowed Mechanics**

Normal enemies may use the following mechanics, provided they remain simple and readable:

* Melee or ranged attacks
* Area damage
* Soft Crowd Control
* Limited Hard Crowd Control
* Self-buffs or ally buffs
* Healing or sustain
* Movement abilities (dash, leap, pull)

They may use **one or two** of these concepts at most.

**4.6 Role Definition & Target Priority**

Normal enemies must be **clearly role-defined**.

Common roles include:

* Frontliner
* Backliner
* Damage dealer
* Disruptor
* Support

Waves composed of Normal enemies are intended to:

* Require target prioritization
* Reward correct focus decisions
* Punish ignoring key roles

**4.7 Interaction with Other Enemy Categories**

Normal enemies **never appear together with Swarm enemies**.

They may appear:

* Alone
* In mixed Normal-only compositions
* Alongside Elites (as support or pressure)

This separation preserves the identity of each category.

**4.8 Scaling Rules**

Normal enemies scale exclusively through **Tier-based stat increases**.

* No new mechanics are introduced at higher tiers
* Ability behavior remains unchanged
* Difficulty increases are predictable and transparent

Scaling follows the same rules as Heroes.

**4.9 Failure Interpretation**

When a player loses to Normal enemies, the intended interpretation may be:

* “I targeted poorly”
* “I positioned badly”
* “My composition lacked balance”
* “I didn’t respect enemy roles”
* “I overestimated my build for this difficulty”

All of these are valid outcomes.

**4.10 Hard Design Guardrails**

Normal enemies must **never**:

* One-shot heroes
* Apply long chain Crowd Control
* Create permanent disable loops
* Deal lethal burst without telegraph
* Use multi-phase mechanics
* Reach boss-level durability

Some Normal enemies may intentionally counter specific heroes, but:

* This must be explicit
* This must be readable
* This must never be absolute

**4.11 Fantasy & Readability**

Normal enemies should feel:

* Threatening but fair
* Predictable once understood
* Clearly distinct per faction

They embody the game’s core combat identity.

# Elite Enemies

Elite enemies represent **localized spikes in difficulty** and serve as the game’s primary **build and knowledge checks** outside of Boss encounters.

They are rare, dangerous, and intentionally demanding.

**5.1 Design Purpose**

Elite enemies exist to:

* Break autopilot play
* Force target prioritization
* Punish specific build weaknesses
* Create sharp spikes in encounter difficulty
* Gate progression within a run

They are designed to be **meaningful threats**, not background pressure.

**5.2 Frequency & Presentation**

Elite enemies appear **only at defined intervals**, typically:

* Every **5th wave**

This controlled frequency ensures that:

* Elite appearances are anticipated
* Their presence carries weight
* Players mentally shift into a higher-risk mode

**5.3 Power Relative to Heroes**

At equivalent tier, a single Elite enemy is **roughly equal in power to a Hero**.

This parity is intentional and supported both mechanically and narratively.

In some encounters, Elite enemies may be **corrupted versions of playable Heroes**, visually and thematically altered by the influence of the **Chorus Beyond**.  
These encounters reuse Hero kits and identities while clearly signaling corruption through presentation, naming, and context.

In other cases, Elites are entirely original enemies that nonetheless operate at a **Hero-level of complexity and threat**.

Elites are not simply stronger Normal enemies — they are peers to Heroes, twisted or elevated into adversaries.

**5.4 Lethality & Stakes**

Elite enemies are fully lethal.

They:

* Can kill heroes if ignored
* Can kill heroes even if noticed but mishandled
* Can wipe teams if the build is incorrect
* Are allowed to **end runs decisively**

Failure against an Elite is a valid and intended outcome.

**5.5 Mechanical Complexity**

Elite enemies match **Hero-level complexity**, with one key restriction.

**Allowed Kit Structure**

Each Elite has:

* **1 Basic Attack**
* **1 Spell** (active or passive)
* **1 Passive**

Elite kits:

* Are fully readable
* Do not evolve with Tier
* Do not receive Tier Enhancements

Elites are complex by design, but their complexity is **static**.

**5.6 Crowd Control Interaction**

Elite enemies follow the global Elite crowd-control resistance model:

* **Non-Hard Crowd Control** effects apply normally
* **Hard Crowd Control** effects apply at **50% effectiveness and/or duration**

Crowd Control remains a valid tactical tool, but:

* It cannot fully neutralize an Elite
* It must be combined with correct damage, positioning, and focus

**5.7 Role Definition & Hybridity**

Elite enemies must have **clear roles**.

They may:

* Fulfill a single dominant role (tank, damage dealer, disruptor)
* Act as hybrids combining multiple roles

Hybrid Elites are acceptable and encouraged, mirroring Hero design.

What matters is clarity:

* The player must understand *why* this Elite is dangerous.

**5.8 Interaction with Other Enemies**

Elite enemies may appear:

* Alongside Normal enemies
* With other Elites
* As part of Boss encounters (as adds)

Elites do not inherently amplify other enemies.  
Any synergy or amplification must be **explicitly defined in their kit**.

**5.9 Scaling Rules**

Elite enemies scale exclusively through **Tier-based stat increases**.

* No new mechanics appear with difficulty
* Ability behavior remains unchanged
* Difficulty increases remain predictable

Scaling rules are identical to Heroes and other enemies.

**5.10 Counterplay Philosophy**

Elite counterplay is **not explicitly stated**.

The player is expected to:

* Inspect the Elite
* Read and understand its kit
* Identify its threat profile
* Adapt targeting, positioning, and strategy

Knowledge and understanding are the primary counters.

**5.11 Hard Design Guardrails**

Elite enemies must **never**:

* One-shot heroes
* Permanently disable heroes
* Ignore core combat rules
* Have Boss-level Crowd Control immunity
* Invalidate entire build archetypes
* Feel unfair once understood

Elites may be punishing, but never arbitrary.

**5.12 Emotional Target**

When an Elite appears, the intended player reaction is:

“This is dangerous, but manageable if I manage my team correctly.”

Elites reward mastery and punish complacency.

# Boss Enemies

Boss enemies are **mandatory, high-stakes encounters** that act as the primary milestones of a run.

They represent the ultimate validation of the player’s preparation, build choices, and execution.

**6.1 Design Purpose**

Bosses exist to:

* Serve as major run milestones
* Test the entire team composition
* Validate the run’s overall power level
* Act as difficulty gates
* Deliver strong narrative moments

A Boss fight is the point where the game asks:  
**“Is this run truly strong enough?”**

**6.2 Placement & Frequency**

Boss encounters are mandatory.

They appear:

* At the end of limited-length runs
* At the end of every **5 Acts** in Endless mode

Bosses cannot be skipped or avoided.

**6.3 Power Relative to Heroes**

At equivalent tier, a Boss is **stronger than any single Hero**.

This superiority comes from:

* Higher raw stats
* Full kit access
* Tier Enhancements
* Encounter structure

Bosses are not simply stronger Elites — they are **qualitatively superior threats**.

**6.4 Lethality & Stakes**

Bosses are fully lethal.

They:

* Can kill Heroes very quickly
* Can wipe entire teams if mishandled
* Are allowed to hard-fail a run
* Become increasingly punishing at higher difficulty

Failure against a Boss is an expected and valid outcome.

**6.5 Phase Structure & Transparency**

Bosses may:

* Have multiple phases
* Or have no phases at all

Regardless of structure:

* Phase presence is **always known before the fight**
* Phase behavior is explicitly documented in the Boss kit

There are no hidden phases or surprise escalations.

**6.6 Mechanical Complexity & Kit Structure**

Bosses follow a **Hero-level complexity model**, fully enhanced.

Each Boss has:

* **1 Basic Attack**
* **1 Spell** (active or passive)
* **1 Passive**

Unlike Elites:

* All Boss abilities have **Tier Enhancements**
* Enhancements unlock at defined tiers (e.g. T3, T5, T7)

Bosses evolve mechanically with difficulty.

**6.7 Crowd Control Philosophy**

Bosses are immune to Hard Crowd Control effects, as defined in the CDC.

Non-Hard Crowd Control effects:

* Buy time
* Enable weakening states
* Create windows of opportunity
* Support coordinated team play

Crowd Control is a **setup and control tool**, not a shutdown mechanism.

**6.8 Adds & Encounter Structure**

Bosses may be accompanied by additional enemies depending on difficulty.

Allowed adds:

* Normal enemies
* Elite enemies

Forbidden:

* Swarm enemies

Adds serve as **secondary pressure**:

* They prevent full tunnel-vision on the Boss
* They force target prioritization and multitasking

The Boss always remains the primary threat.

**6.9 Scaling Rules**

Bosses scale in two ways:

1. **Tier-based stat increases**
2. **Tier Enhancement unlocks**

This mirrors Hero progression and ensures Boss relevance throughout the run.

No mechanics are introduced outside of documented Tier Enhancements.

**6.10 Failure Interpretation**

When a player loses to a Boss, the intended interpretation may be:

* “My build wasn’t strong enough”
* “I misunderstood the mechanics”
* “I failed execution”
* “I took the wrong risks earlier in the run”

All of these outcomes are valid.

**6.11 Hard Design Guardrails**

Bosses must **never**:

* Kill without telegraph
* Ignore core combat rules
* Invalidate positioning entirely
* Remove all counterplay
* Feel random or chaotic

Boss difficulty must always feel **earned**, not arbitrary.

**6.12 Fantasy & Emotional Target**

Boss encounters are:

* Narrative climaxes
* Epic set-piece battles
* Highly unique and flavorful

Bosses should feel as distinctive and memorable as Heroes themselves.

**6.13 Relationship with Elites**

Elites function as **mini-bosses** that prepare the player for Boss encounters.

At higher difficulty:

* Bosses may be accompanied by one or more Elites

This establishes a clear escalation ladder:  
**Normal → Elite → Boss**

# Enemy Roster

## 7.1 Swarm Enemies

### 7.1.1 Aegis

#### 7.1.1.1 Mace Conscript

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Swarm  
**Role Tags:** Frontliner, Swarm

**Fantasy & Identity**  
Bayonet Conscripts are lightly armored Aegis infantry trained for aggressive forward pressure. Equipped with rifles fitted with bayonets, they trade protection for momentum, surging into close combat with crude but relentless thrusts.

They are not duelists. They are shock bodies meant to break formations through numbers and constant contact.

**Strategic Role**  
Bayonet Conscripts serve as **damage-oriented Swarm frontliners**. Compared to Shielded Conscripts, they deal more damage but fall faster, accelerating the pace of attrition.

They test:

* Frontline damage tolerance
* Sustain under repeated melee hits
* AoE cleanup speed before numbers overwhelm

**B. Base Stats (Tier 1)**

Tuned to be **weaker than heroes**,  
more fragile than Shielded Conscripts, but more threatening on contact

| **Stat** | **Value** |
| --- | --- |
| Health | **150** |
| Strength | **30** |
| Wisdom | **0** |
| Physical Defense | **25** |
| Spell Defense | **25** |
| Attack Speed | **1.00** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **18** |
| Range | 2 |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lower HP and defenses than Shielded Conscripts
* Noticeably higher STR to reward contact
* Slightly higher Move Speed to close distance
* Still no crit variance (Swarm stability rule)

**C. Enemy Kit**

**Basic Attack — Bayonet Thrust**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained melee damage through numbers.

**Who Is at Risk**

* Low-armor frontline heroes
* Teams with insufficient sustain
* Builds that rely on slow, single-target kills

**When the Threat Is Highest**  
When Bayonet Conscripts reach melee range in groups and are allowed to maintain uninterrupted contact.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Area-of-effect and cleave damage
* Frontline heroes with armor or lifesteal
* Early thinning before contact

**What to Avoid**

* Letting them freely close distance
* Overcommitting to backline focus while they stack

Bayonet Conscripts punish teams that underestimate Swarm DPS.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 30 + 0 = **30**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 150 + 4 × (25 + 25)
* 150 + 200 = **350**

**StatPower**

* 0.55 × 30 + 0.45 × 350
* 16.5 + 157.5 = **174**

**StatMultiplier**

* 174 / 358 ≈ **0.49**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Frontliner): **1.10**

**BaseUnitFactor**

* 0.60 × 0.49 × 1.10 ≈ **0.32**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.32 × TierMultiplier(T) × 100

#### 7.1.1.2 Rifle Conscript

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
Rifle Conscripts are the ranged backbone of Aegis Swarm formations. Equipped with standard-issue rifles and minimal protection, they provide constant suppressive fire while advancing behind heavier infantry. Individually inaccurate and fragile, their danger comes from uninterrupted volleys and sheer numbers.

They are not marksmen — they are volume.

**Strategic Role**  
Rifle Conscripts serve as **ranged pressure Swarm units**. Their role is to apply steady chip damage from behind the frontline, forcing the player to either break through the Swarm quickly or suffer attrition.

They test:

* Backline protection
* AoE reach and wave clear speed
* Ability to collapse Swarm formations decisively

**B. Base Stats (Tier 1)**

Tuned to be **clearly weaker than heroes**,  
fragile even by Swarm standards, but numerous

| **Stat** | **Value** |
| --- | --- |
| Health | **120** |
| Strength | **26** |
| Wisdom | **0** |
| Physical Defense | **18** |
| Spell Defense | **18** |
| Attack Speed | **1.05** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **15** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lowest durability of Aegis Swarm units
* Moderate STR to reward uninterrupted firing
* Slightly higher Attack Speed to compensate low damage
* Short-to-mid range to force frontline interaction

**C. Enemy Kit**

**Basic Attack — Rifle Burst**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged attrition.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking ranged AoE or dive tools
* Slow, defensive compositions

**When the Threat Is Highest**  
When Rifle Conscripts are left untouched behind a frontline and allowed to fire continuously.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Ignoring them while dealing only with melee Swarms
* Overly passive positioning

Rifle Conscripts punish indecision and slow clears.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 26 + 0 = **26**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 120 + 4 × (18 + 18)
* 120 + 144 = **264**

**StatPower**

* 0.55 × 26 + 0.45 × 264
* 14.3 + 118.8 = **133.1**

**StatMultiplier**

* 133.1 / 358 ≈ **0.37**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.37 × 1.05 ≈ **0.23**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.23 × TierMultiplier(T) × 100

### 7.1.2 Eclipse

#### 7.1.2.1 Feral Thrall

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Swarm  
**Role Tags:** Frontliner, Swarm

**Fantasy & Identity**  
Feral Thralls are Eclipse devotees who have survived long enough for raw violence to replace frenzy. Less reckless than Bare Thralls, they wield crude melee weapons and fight with brutal intent, trading speed for heavier blows and greater staying power.

They are the Eclipse Swarm’s **meat grinders** — not fast, not disciplined, but relentless once engaged.

**Strategic Role**  
Feral Thralls act as **high-contact melee Swarm units** that punish teams lacking sustain or armor. Compared to Bare Thralls, they are slower but hit harder and survive longer, extending pressure once the initial rush is over.

They test:

* Frontline durability
* Sustain under repeated melee hits
* Ability to clear Swarm units efficiently

**B. Base Stats (Tier 1)**

Slower and tougher than Bare Thralls,  
still clearly weaker than heroes

| **Stat** | **Value** |
| --- | --- |
| Health | **190** |
| Strength | **34** |
| Wisdom | **0** |
| Physical Defense | **28** |
| Spell Defense | **22** |
| Attack Speed | **0.95** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **17** |
| Range | **1** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Highest HP among Eclipse Swarm frontliners
* Noticeably higher STR than Bare Thralls
* Reduced Move Speed to emphasize sticking power
* Still no crit chance to keep Swarm damage predictable

**C. Enemy Kit**

**Basic Attack — Brutal Cleave**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained melee pressure and attrition.

**Who Is at Risk**

* Frontline heroes without armor or sustain
* Teams that survive the initial rush but cannot clear efficiently
* Low-damage defensive compositions

**When the Threat Is Highest**  
Mid-wave, when Feral Thralls remain engaged after faster units have already collapsed.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage and cleave
* Armor-heavy frontliners
* Damage-over-time combined with sustain

**What to Avoid**

* Letting them stack on a single frontline hero
* Underestimating their damage due to Swarm labeling

Feral Thralls punish teams that can hold—but cannot kill.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 34 + 0 = **34**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 190 + 4 × (28 + 22)
* 190 + 200 = **390**

**StatPower**

* 0.55 × 34 + 0.45 × 390
* 18.7 + 175.5 = **194.2**

**StatMultiplier**

* 194.2 / 358 ≈ **0.54**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Frontliner): **1.10**

**BaseUnitFactor**

* 0.60 × 0.54 × 1.10 ≈ **0.36**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.36 × TierMultiplier(T) × 100

#### 7.1.2.2 Spear Thrall

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
Hunting Thralls are Eclipse survivors who have learned to stalk rather than rush. Armed with crude throwing weapons, they harass enemies from behind the melee swarm, striking exposed targets while staying just out of reach.

They are not precise hunters — they are relentless pursuers that wear targets down through repeated ranged strikes.

**Strategic Role**  
Hunting Thralls act as **ranged harassment Swarm units**. Their role is to apply continuous pressure from mid-range while melee Thralls lock heroes in place.

They test:

* Backline protection
* Ability to break Swarm formations
* Access to ranged AoE or dive tools

**B. Base Stats (Tier 1)**

Fragile, mobile,  
but dangerous when left unchecked

| **Stat** | **Value** |
| --- | --- |
| Health | **130** |
| Strength | **29** |
| Wisdom | **0** |
| Physical Defense | **18** |
| Spell Defense | **18** |
| Attack Speed | **1.00** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **19** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Slightly tougher than Rifle Conscripts
* High Move Speed to reposition behind the frontline
* Moderate STR to reward sustained firing
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Thrown Spear**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged chip damage.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking dive or ranged AoE
* Slow-clearing compositions

**When the Threat Is Highest**  
When Hunting Thralls are allowed to remain behind melee units and attack without interruption.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Tunnel-vision on melee Thralls only
* Passive positioning that allows free volleys

Hunting Thralls punish teams that fail to break Eclipse formations.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 29 + 0 = **29**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 130 + 4 × (18 + 18)
* 130 + 144 = **274**

**StatPower**

* 0.55 × 29 + 0.45 × 274
* 15.95 + 123.3 = **139.25**

**StatMultiplier**

* 139.25 / 358 ≈ **0.39**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.39 × 1.05 ≈ **0.25**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.25 × TierMultiplier(T) × 100

### 7.1.3 Inquisition

#### 7.1.3.1 Flagbearer Rabble

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Swarm  
**Role Tags:** Support, Swarm

**Fantasy & Identity**  
Flagbearer Rabbles are condemned zealots forced to march at the head of Inquisition Swarm formations, carrying heavy devotional banners marked with scripture and symbols of absolution. They are not fighters in the traditional sense, but living icons meant to inspire obedience, fanaticism, and relentless advance.

They exist to remind others why they march — and why retreat is forbidden.

**Strategic Role**  
Flagbearer Rabbles act as **support-oriented Swarm units**. Their presence reinforces the cohesion and pressure of surrounding Swarm bodies, not through mechanics, but through positioning and persistence.

They test:

* The player’s ability to clear Swarm waves efficiently
* AoE coverage across clustered units
* Discipline in prioritizing pressure sources

**B. Base Stats (Tier 1)**

Low damage,  
slightly sturdier than typical backliners to remain present in the wave

| **Stat** | **Value** |
| --- | --- |
| Health | **170** |
| Strength | **20** |
| Wisdom | **0** |
| Physical Defense | **30** |
| Spell Defense | **30** |
| Attack Speed | **0.80** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **15** |
| Range | **1** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Moderate durability to avoid instant removal
* Very low damage output
* Slow attack speed to reduce threat spike
* Designed to survive *long enough* to matter through numbers

**C. Enemy Kit**

**Basic Attack — Banner Strike**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Wave persistence and formation pressure.

**Who Is at Risk**

* Teams with weak AoE clear
* Builds that rely on slow, focused kills
* Under-tiered compositions at higher difficulty

**When the Threat Is Highest**  
When Flagbearer Rabbles remain alive within dense Swarm clusters, extending the overall time-to-clear of the wave.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Area-of-effect damage
* Cleave and splash
* Aggressive wave thinning

**What to Avoid**

* Over-prioritizing single dangerous-looking units
* Leaving large Swarm clusters intact

Flagbearer Rabbles are only threatening as long as the Swarm exists.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 20 + 0 = **20**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 170 + 4 × (30 + 30)
* 170 + 240 = **410**

**StatPower**

* 0.55 × 20 + 0.45 × 410
* 11 + 184.5 = **195.5**

**StatMultiplier**

* 195.5 / 358 ≈ **0.55**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Support): **1.20**

**BaseUnitFactor**

* 0.60 × 0.55 × 1.20 ≈ **0.40**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.40 × TierMultiplier(T) × 100

#### 7.1.3.2 Watchful Rabble

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
Watchful Rabbles are blinded devotees bound in ritual wrappings, their sight replaced by faith and vigilance. Tasked with observing the battlefield through prayer and whispered scripture, they trail behind the Swarm, striking from a distance with crude thrown relics and symbols of judgment.

They do not see the enemy — they *sense* transgression.

**Strategic Role**  
Watchful Rabbles function as **ranged pressure Swarm units**. Their role is to apply constant chip damage from behind the frontline while other Rabbles lock heroes in place.

They test:

* Backline protection
* Ability to collapse Swarm formations
* Access to ranged AoE or dive tools

**B. Base Stats (Tier 1)**

Fragile, observant,  
and dangerous only when ignored

| **Stat** | **Value** |
| --- | --- |
| Health | **125** |
| Strength | **27** |
| Wisdom | **0** |
| Physical Defense | **16** |
| Spell Defense | **16** |
| Attack Speed | **0.95** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **14** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lowest durability among Inquisition Swarm units
* Moderate STR to support sustained chip damage
* Slightly slower attack cadence to limit pressure spikes
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Relic Cast**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged attrition.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking dive or ranged AoE
* Slow-clearing compositions

**When the Threat Is Highest**  
When Watchful Rabbles are allowed to remain behind dense Swarm formations and attack uninterrupted.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Tunnel-vision on melee Rabbles only
* Passive positioning that allows free ranged pressure

Watchful Rabbles punish neglect, not mistakes.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 27 + 0 = **27**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 125 + 4 × (16 + 16)
* 125 + 128 = **253**

**StatPower**

* 0.55 × 27 + 0.45 × 253
* 14.85 + 113.85 = **128.7**

**StatMultiplier**

* 128.7 / 358 ≈ **0.36**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.36 × 1.05 ≈ **0.23**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.23 × TierMultiplier(T) × 100

### 7.1.4 Nebulae

#### 7.1.4.1 Crystaline Fragment

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Swarm  
**Role Tags:** Frontliner, Swarm

**Fantasy & Identity**  
Crystalline Fragments are semi-humanoid constructs formed from living nebular crystal. Their bodies are unstable agglomerations of shards bound by an alien cohesion force. Slow and expressionless, they advance methodically, absorbing impacts as their crystalline mass fractures and reforms.

They are not aggressive entities — they are drifting pressure made solid.

**Strategic Role**  
Crystalline Fragments function as **durable Swarm frontliners**. Their role is to occupy space, absorb damage, and delay the enemy long enough for the Nebulae Swarm to accumulate pressure.

They test:

* Sustained damage output
* AoE efficiency against clustered targets
* Frontline endurance over time

**B. Base Stats (Tier 1)**

Slow, sturdy,  
low damage but high staying power for a Swarm unit

| **Stat** | **Value** |
| --- | --- |
| Health | **200** |
| Strength | **22** |
| Wisdom | **0** |
| Physical Defense | **35** |
| Spell Defense | **35** |
| Attack Speed | **0.80** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **14** |
| Range | **1** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Highest durability among Nebulae Swarm units
* Very low damage output
* Slow movement and attack cadence
* Designed to stall rather than threaten

**C. Enemy Kit**

**Basic Attack — Crystal Slam**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Space occupation and time-based attrition.

**Who Is at Risk**

* Teams with insufficient AoE damage
* Low-sustain frontlines
* Compositions that rely on burst rather than throughput

**When the Threat Is Highest**  
When multiple Crystalline Fragments cluster together and are left alive for extended periods.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Sustained AoE and cleave damage
* Armor-penetrating or high-throughput DPS
* Strong frontline anchors

**What to Avoid**

* Overcommitting burst to a single Fragment
* Allowing them to stack uncontested

Crystalline Fragments punish low DPS, not mispositioning.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 22 + 0 = **22**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 200 + 4 × (35 + 35)
* 200 + 280 = **480**

**StatPower**

* 0.55 × 22 + 0.45 × 480
* 12.1 + 216 = **228.1**

**StatMultiplier**

* 228.1 / 358 ≈ **0.64**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Frontliner): **1.10**

**BaseUnitFactor**

* 0.60 × 0.64 × 1.10 ≈ **0.42**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.42 × TierMultiplier(T) × 100

#### 7.1.4.2 Drifting Fragment

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
Drifting Fragments are unstable Nebulae entities that have lost most of their physical mass, existing in a semi-floating crystalline state. They hover slightly above the ground, projecting condensed nebular energy rather than engaging directly.

They do not rush or pursue. They drift, observe, and erode resistance through persistent ranged pressure.

**Strategic Role**  
Drifting Fragments act as **ranged attrition Swarm units**. Their role is to apply steady chip damage from behind sturdier Nebulae bodies, forcing the player to break through the frontline or suffer prolonged pressure.

They test:

* Backline protection
* Ranged AoE reach
* Ability to collapse Swarm formations efficiently

**B. Base Stats (Tier 1)**

Fragile and evasive in positioning,  
but weak if directly engaged

| **Stat** | **Value** |
| --- | --- |
| Health | **120** |
| Strength | **28** |
| Wisdom | **0** |
| Physical Defense | **16** |
| Spell Defense | **16** |
| Attack Speed | **1.00** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **16** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lowest durability among Nebulae Swarm units
* Moderate STR to enable consistent ranged pressure
* Average movement speed to maintain spacing
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Nebular Pulse**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged chip damage.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking dive or ranged AoE
* Slow-clearing compositions

**When the Threat Is Highest**  
When Drifting Fragments are left untouched behind Crystalline or Claws Fragments and allowed to attack continuously.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Tunnel-vision on melee Fragments only
* Passive positioning that allows free ranged pressure

Drifting Fragments punish indecision, not mistakes.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 28 + 0 = **28**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 120 + 4 × (16 + 16)
* 120 + 128 = **248**

**StatPower**

* 0.55 × 28 + 0.45 × 248
* 15.4 + 111.6 = **127.0**

**StatMultiplier**

* 127.0 / 358 ≈ **0.35**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.35 × 1.05 ≈ **0.22**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.22 × TierMultiplier(T) × 100

### 7.1.5 Nexus

#### 7.1.5.1 Assault Unit

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Swarm  
**Role Tags:** Frontliner, Swarm

**Fantasy & Identity**  
Assault Units are Nexus combat units optimized for close-range engagement. Lighter and more aggressive than Shielded Drones, they are equipped with integrated striking implements and high-thrust stabilizers, allowing them to ram, cut, or shock targets at point-blank range.

They are not built to hold ground — they are built to breach it.

**Strategic Role**  
Assault Units act as **damage-oriented Swarm frontliners**. Their role is to pressure enemy frontlines through sustained melee contact, trading durability for higher damage output and faster engagement.

They test:

* Frontline damage tolerance
* Sustain under repeated melee hits
* Ability to thin Swarm numbers efficiently

**B. Base Stats (Tier 1)**

More aggressive than Shielded Drones,  
but noticeably less durable

| **Stat** | **Value** |
| --- | --- |
| Health | **160** |
| Strength | **32** |
| Wisdom | **0** |
| Physical Defense | **26** |
| Spell Defense | **26** |
| Attack Speed | **1.05** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **18** |
| Range | **1** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Reduced defenses compared to Shielded Drones
* High STR and Attack Speed for sustained pressure
* Faster movement to ensure rapid engagement
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Impact Strike**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee-range contact attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained melee attrition.

**Who Is at Risk**

* Frontline heroes without sustain
* Low-armor melee units
* Teams relying on slow, defensive setups

**When the Threat Is Highest**  
When multiple Assault Units reach melee range simultaneously and maintain uninterrupted contact.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Area-of-effect and cleave damage
* Armor-heavy or lifesteal frontliners
* Early thinning before contact

**What to Avoid**

* Letting them stack freely on a single target
* Ignoring them in favor of slower units

Assault Units punish fragile frontlines.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 32 + 0 = **32**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 160 + 4 × (26 + 26)
* 160 + 208 = **368**

**StatPower**

* 0.55 × 32 + 0.45 × 368
* 17.6 + 165.6 = **183.2**

**StatMultiplier**

* 183.2 / 358 ≈ **0.51**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Frontliner): **1.10**

**BaseUnitFactor**

* 0.60 × 0.51 × 1.10 ≈ **0.34**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.34 × TierMultiplier(T) × 100

#### 7.1.5.2 FLAK Unit

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
FLAK Units are Nexus units specialized in sustained ranged fire. Hovering behind sturdier drones, they project controlled bursts of kinetic energy designed to wear targets down rather than eliminate them quickly. Precision is irrelevant — continuity is the goal.

They do not hunt targets. They maintain pressure.

**Strategic Role**  
FLAK Units act as **ranged pressure Swarm units**. Their role is to apply constant chip damage from behind the frontline, forcing the player to either break through Nexus formations or endure prolonged attrition.

They test:

* Backline protection
* Ranged AoE reach
* Ability to collapse Swarm formations decisively

**B. Base Stats (Tier 1)**

Fragile and non-threatening alone,  
dangerous only through uninterrupted fire

| **Stat** | **Value** |
| --- | --- |
| Health | **125** |
| Strength | **28** |
| Wisdom | **0** |
| Physical Defense | **18** |
| Spell Defense | **18** |
| Attack Speed | **1.05** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **16** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lowest durability among Nexus Swarm units
* Moderate STR to support sustained ranged damage
* Slightly higher Attack Speed to emphasize pressure
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Suppression Burst**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged attrition.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking dive or ranged AoE
* Slow-clearing compositions

**When the Threat Is Highest**  
When FLAK Units are allowed to remain behind Shielded or Assault Units and fire continuously.

**E. Weaknesses & Counterplay**

**Effective Counters**

* AoE damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Tunnel-vision on frontline drones only
* Passive positioning that allows free ranged fire

FLAK Units punish indecision, not single mistakes.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 28 + 0 = **28**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 125 + 4 × (18 + 18)
* 125 + 144 = **269**

**StatPower**

* 0.55 × 28 + 0.45 × 269
* 15.4 + 121.05 = **136.45**

**StatMultiplier**

* 136.45 / 358 ≈ **0.38**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.38 × 1.05 ≈ **0.24**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.24 × TierMultiplier(T) × 100

### 7.1.6 Shogunate

#### 7.1.6.1 Polearm Levy

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Swarm  
**Role Tags:** Frontliner, Swarm

**Fantasy & Identity**  
Tsubuko Levies are conscripted foot soldiers drawn from the lowest ranks of the Shogunate’s territories. Equipped with outdated armor plates, crude implants, and mass-produced polearms, they represent the disposable manpower sustaining the Shogunate war machine.

Their gear is functional but unreliable, blending feudal craftsmanship with poorly maintained cybernetic augments.

**Strategic Role**  
Tsubuko Levies act as **basic frontline Swarm units**. Their role is to advance, occupy space, and absorb damage long enough for the rest of the formation to apply pressure.

They test:

* Frontline durability
* AoE efficiency against clustered melee units
* Sustain during prolonged engagements

**B. Base Stats (Tier 1)**

Average durability,  
low damage, consistent pressure

| **Stat** | **Value** |
| --- | --- |
| Health | **175** |
| Strength | **24** |
| Wisdom | **0** |
| Physical Defense | **32** |
| Spell Defense | **28** |
| Attack Speed | **0.90** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **15** |
| Range | **1** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Middle-of-the-pack Swarm durability
* Low STR to keep damage modest
* Slightly uneven defenses reflecting mixed-quality gear
* No crit chance to maintain Swarm stability

**C. Enemy Kit**

**Basic Attack — Polearm Strike**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Melee attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Space occupation and attrition.

**Who Is at Risk**

* Frontline heroes without sustain
* Teams lacking AoE clear
* Under-tiered compositions

**When the Threat Is Highest**  
When multiple Tsubuko Levies stack together and are allowed to persist on the frontline.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Area-of-effect and cleave damage
* Strong frontline anchors
* High-throughput DPS

**What to Avoid**

* Single-target tunnel vision
* Allowing Levies to accumulate unchecked

Tsubuko Levies punish inefficient clears.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 24 + 0 = **24**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 175 + 4 × (32 + 28)
* 175 + 240 = **415**

**StatPower**

* 0.55 × 24 + 0.45 × 415
* 13.2 + 186.75 = **199.95**

**StatMultiplier**

* 199.95 / 358 ≈ **0.56**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Frontliner): **1.10**

**BaseUnitFactor**

* 0.60 × 0.56 × 1.10 ≈ **0.37**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.37 × TierMultiplier(T) × 100

#### 7.1.6.2 Shuriken Levy

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Swarm  
**Role Tags:** Backliner, Swarm

**Fantasy & Identity**  
Gun Levies are low-ranking Shogunate conscripts equipped with unreliable firearms and mismatched armor plates. Their weapons are mass-produced, poorly maintained, and often modified with crude cybernetic components. Accuracy is secondary to volume — they are taught to fire, advance, and reload until they fall.

They are not marksmen. They are expendable firing lines.

**Strategic Role**  
Gun Levies function as **ranged pressure Swarm units**. Their role is to apply steady chip damage from behind melee Levies, forcing the player to either collapse the frontline quickly or endure prolonged attrition.

They test:

* Backline protection
* Ranged AoE reach
* Ability to dismantle layered Swarm formations

**B. Base Stats (Tier 1)**

Fragile and unreliable,  
dangerous only through uninterrupted fire

| **Stat** | **Value** |
| --- | --- |
| Health | **130** |
| Strength | **27** |
| Wisdom | **0** |
| Physical Defense | **18** |
| Spell Defense | **18** |
| Attack Speed | **1.00** |
| Crit Chance | **0%** |
| Crit Damage | **150%** |
| Movement Speed | **14** |
| Range | **4** |
| Max Mana | **0** |
| Starting Mana | **0** |

**Stat Intent**

* Lowest durability among Shogunate Swarm units
* Moderate STR to enable chip damage
* Average attack cadence to keep pressure stable
* No crit chance to preserve Swarm predictability

**C. Enemy Kit**

**Basic Attack — Crude Gunfire**  
Deal **100% STR Physical damage** to the closest enemy in range.

* Ranged attack
* No secondary effects
* No crowd control
* No conditional behavior

(Strictly compliant with Swarm mechanical constraints.)

**D. Threat Profile**

**Primary Threat Axis**  
Sustained ranged attrition.

**Who Is at Risk**

* Backline heroes without protection
* Teams lacking dive or ranged AoE
* Slow-clearing compositions

**When the Threat Is Highest**  
When Gun Levies are allowed to remain behind Tsubuko or Ninjato Levies and fire continuously.

**E. Weaknesses & Counterplay**

**Effective Counters**

* Area-of-effect damage with sufficient reach
* Divers and flankers
* Fast frontline collapse

**What to Avoid**

* Tunnel-vision on melee Levies only
* Passive positioning that allows free volleys

Gun Levies punish hesitation, not individual mistakes.

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

**Offense**

* STR + WIS = 27 + 0 = **27**

**Defense**

* HP + 4 × (PhysDef + SpellDef)
* 130 + 4 × (18 + 18)
* 130 + 144 = **274**

**StatPower**

* 0.55 × 27 + 0.45 × 274
* 14.85 + 123.3 = **138.15**

**StatMultiplier**

* 138.15 / 358 ≈ **0.39**

**Base Unit Factor**

* CategoryWeight (Swarm): **0.60**
* RoleMultiplier (Backliner): **1.05**

**BaseUnitFactor**

* 0.60 × 0.39 × 1.05 ≈ **0.25**

**Tier Scaling**

* TierMultiplier(T) = 1.00 + 0.35 × (T − 1)

**Final Budget Cost (T)**

* 0.25 × TierMultiplier(T) × 100

## 7.2 Normal Enemies

### 7.2.1 Aegis

#### 7.2.1.1 Bulwark Enforcer

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

Bulwark Enforcers are heavy Aegis shield infantry deployed to hold the line under sustained pressure. Encased in reinforced plating and trained in disciplined formation combat, they exist to absorb incoming force and stall advances.

They do not rush. They endure.

**Strategic Role**

Durability anchor designed to delay frontline collapse.

Tests:

* Sustained DPS
* Armor penetration
* Proper target prioritization

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 520 |
| Strength | 40 |
| Wisdom | 0 |
| Physical Defense | 80 |
| Spell Defense | 55 |
| Attack Speed | 0.85 |
| Crit Chance | 0% |
| Crit Damage | 150% |
| Movement Speed | 16 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 0 |

**Stat Intent**

High physical durability  
Moderate HP pool  
Low offensive output  
Designed to stall rather than kill

**C. Enemy Kit**

**Basic Attack — Shield Bash**  
Deal 100% STR Physical damage to the closest enemy in range.

**Spell — Brace Formation**  
Mana Cost: 60

Gain +25% Damage Reduction for 3 seconds.

No stacking.  
No ally interaction.  
Pure self-defense window.

**D. Threat Profile**

**Primary Threat Axis:** Time extension and durability.

**Who Is at Risk:**  
Teams lacking armor penetration or sustained DPS.

**When Threat Peaks:**  
When Brace Formation activates while multiple Enforcers remain alive.

**E. Weaknesses & Counterplay**

Effective Responses:

* Burst before mana fills
* Spell damage
* Armor penetration
* Ignore and dive backline

Avoid:

* Overcommitting low-DPS heroes into him

**F. Wave Budget Hooks**

**Tier 1 Stat Power**

Offense  
STR + WIS = 40

Defense  
HP + 4 × (PhysDef + SpellDef)  
520 + 4 × (80 + 55)  
520 + 4 × 135  
520 + 540 = 1,060

StatPower  
0.55 × 40 + 0.45 × 1,060  
22 + 477 = 499

StatMultiplier  
499 / 358 ≈ **1.39**

CategoryWeight (Normal): 1.00  
RoleMultiplier (Frontliner): 1.10

BaseUnitFactor  
1.00 × 1.39 × 1.10 ≈ **1.53**

TierMultiplier(T)  
= 1.00 + 0.35 × (T − 1)

Final Budget Cost(T)  
1.53 × TierMultiplier(T) × 100

#### 7.2.1.2 Volley Gunner

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

Disciplined riflemen trained in structured volley fire. They maintain distance and apply suppressive ranged pressure.

They do not reposition recklessly — they hold firing lines.

**Strategic Role**

Sustained ranged pressure.

Tests:

* Dive access
* Backline protection
* Wave clear speed

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 300 |
| Strength | 55 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.00 |
| Crit Chance | 0% |
| Crit Damage | 150% |
| Movement Speed | 17 |
| Range | 4 |
| Max Mana | 50 |
| Starting Mana | 25 |

**C. Enemy Kit**

**Basic Attack — Rifle Shot**  
Deal 100% STR Physical damage to the closest enemy in range.

**Spell — Suppressive Volley**  
Mana Cost: 50

Fire in a straight 3-tile line.  
Deal 80% STR Physical damage to all enemies hit.

**F. Wave Budget Hooks**

Offense  
55

Defense  
300 + 4 × (35 + 35)  
300 + 280 = 580

StatPower  
0.55 × 55 + 0.45 × 580  
30.25 + 261 = 291.25

StatMultiplier  
291.25 / 358 ≈ **0.81**

CategoryWeight = 1.00  
RoleMultiplier (Backliner) = 1.05

BaseUnitFactor  
1.00 × 0.81 × 1.05 ≈ **0.85**

Final Budget Cost(T)  
0.85 × TierMultiplier(T) × 100

#### 7.2.1.3 Trench Puller

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

Combat engineers equipped with mechanized grappling rigs designed to isolate priority targets.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 340 |
| Strength | 45 |
| Wisdom | 0 |
| Physical Defense | 40 |
| Spell Defense | 40 |
| Attack Speed | 0.95 |
| Movement Speed | 18 |
| Range | 3 |
| Max Mana | 60 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Hook Strike**  
100% STR Physical damage.

**Spell — Dragline**  
Mana Cost: 60

Pull the furthest enemy within 4 tiles 2 tiles toward the Puller.

**F. Wave Budget Hooks**

Offense = 45  
Defense = 340 + 4 × (40 + 40)  
340 + 320 = 660

StatPower  
0.55 × 45 + 0.45 × 660  
24.75 + 297 = 321.75

StatMultiplier  
321.75 / 358 ≈ **0.90**

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor  
1.00 × 0.90 × 1.15 ≈ **1.04**

#### 7.2.1.4 Shock Lancer

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Normal  
**Role Tags:** Assassin

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 320 |
| Strength | 70 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.15 |
| Movement Speed | 22 |
| Range | 1 |
| Max Mana | 70 |
| Starting Mana | 30 |

**C. Enemy Kit**

**Basic Attack — Lance Strike**  
100% STR Physical damage.

**Spell — Breach Charge**  
Mana Cost: 70

Dash to the lowest HP enemy within 4 tiles.  
Deal 120% STR Physical damage.

**F. Wave Budget Hooks**

Offense = 70  
Defense = 320 + 4 × (35 + 35)  
320 + 280 = 600

StatPower  
0.55 × 70 + 0.45 × 600  
38.5 + 270 = 308.5

StatMultiplier ≈ 0.86

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **0.99**

#### 7.2.1.5 Field Quartermaster

**A. Enemy Overview**

**Faction:** Aegis  
**Category:** Normal  
**Role Tags:** Support

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 380 |
| Strength | 35 |
| Wisdom | 0 |
| Physical Defense | 50 |
| Spell Defense | 50 |
| Attack Speed | 0.85 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Sidearm Shot**  
100% STR Physical damage.

**Passive — Rally Formation**  
Allies within 2 tiles gain +10% Physical Defense.

**F. Wave Budget Hooks**

Offense = 35  
Defense = 380 + 4 × (50 + 50)  
380 + 400 = 780

StatPower  
0.55 × 35 + 0.45 × 780  
19.25 + 351 = 370.25

StatMultiplier ≈ 1.03

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.24**

### 7.2.2 Eclipse

#### 7.2.2.1 Bloodbound Ravager

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

Bloodbound Ravagers are hardened Eclipse zealots who thrive in sustained violence. Each wound deepens their frenzy, pushing them forward through pain rather than discipline.

They do not defend — they endure by becoming more dangerous.

**Strategic Role**

Sustained melee bruiser that grows threatening over time.

Tests:

* Frontline stability
* Focus discipline
* Burst timing

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 480 |
| Strength | 55 |
| Wisdom | 0 |
| Physical Defense | 65 |
| Spell Defense | 45 |
| Attack Speed | 1.00 |
| Crit Chance | 0% |
| Crit Damage | 150% |
| Movement Speed | 18 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

Stat Intent:

* Durable but not tank-tier
* Stronger offense than Aegis frontliner
* Less defensive structure, more threat

**C. Enemy Kit**

**Basic Attack — Cleaving Maul**  
Deal 100% STR Physical damage to the closest enemy in range.

**Spell — Blood Surge**  
Mana Cost: 60

Gain +25% Attack Speed and +15% Lifesteal for 3 seconds.

No stacking.  
Self-only.

**D. Threat Profile**

Primary Threat Axis:  
Escalating sustain DPS.

Who Is at Risk:

* Low-burst frontliners
* Teams lacking healing reduction
* Slow damage compositions

Threat Peaks:  
When Blood Surge activates mid-fight.

**F. Wave Budget Hooks**

Offense = 55

Defense =  
480 + 4 × (65 + 45)  
480 + 4 × 110  
480 + 440 = 920

StatPower =  
0.55 × 55 + 0.45 × 920  
30.25 + 414 = 444.25

StatMultiplier =  
444.25 / 358 ≈ **1.24**

CategoryWeight = 1.00  
RoleMultiplier (Frontliner) = 1.10

BaseUnitFactor =  
1.00 × 1.24 × 1.10 ≈ **1.36**

Final Budget Cost(T) =  
1.36 × TierMultiplier(T) × 100

#### 7.2.2.2 Hexfire Acolyte

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

Hexfire Acolytes channel unstable ritual energy into crude ranged blasts. Their power is not precise — it spreads suffering across clustered targets.

They reward chaos.

**Strategic Role**

Mid-range AoE pressure unit.

Tests:

* AoE mitigation
* Backline dive
* Spread positioning

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 290 |
| Strength | 45 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 0.95 |
| Movement Speed | 17 |
| Range | 4 |
| Max Mana | 50 |
| Starting Mana | 25 |

**C. Enemy Kit**

**Basic Attack — Hex Bolt**  
100% STR Physical damage.

**Spell — Burning Brand**  
Mana Cost: 50

Mark the current target.  
After 1 second, deal 120% STR Physical damage  
in a 1-tile radius around that target.

Simple delayed AoE.

**F. Wave Budget Hooks**

Offense = 45

Defense =  
290 + 4 × (35 + 35)  
290 + 280 = 570

StatPower =  
0.55 × 45 + 0.45 × 570  
24.75 + 256.5 = 281.25

StatMultiplier ≈ 0.79

RoleMultiplier (Backliner) = 1.05

BaseUnitFactor ≈ **0.83**

#### 7.2.2.3 Shatterhowl Zealot

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

A maddened Eclipse preacher who weaponizes fanaticism itself.  
Instead of pulling targets with tools, he destabilizes formations through violent shockwaves.

He does not isolate — he fractures.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 360 |
| Strength | 48 |
| Wisdom | 0 |
| Physical Defense | 45 |
| Spell Defense | 45 |
| Attack Speed | 0.95 |
| Movement Speed | 19 |
| Range | 2 |
| Max Mana | 70 |
| Starting Mana | 20 |

Durable enough to matter, not tank-level.

**C. Enemy Kit**

**Basic Attack — Rending Swing**  
Deal 100% STR Physical damage.

**Spell — Fanatic Detonation**  
Mana Cost: 70

After 1 second, explode in a 1-tile radius around self:

* Deal 110% STR Physical damage
* Push all enemies hit 1 tile away

Self is not damaged.

**Why This Works**

* No targeted displacement
* AoE destabilization
* Breaks tight formations
* More chaotic
* Forces spacing discipline

This feels Eclipse, not tactical Aegis.

**Wave Budget Hooks**

Offense = 48

Defense =  
360 + 4 × (45 + 45)  
360 + 360 = 720

StatPower =  
0.55 × 48 + 0.45 × 720  
26.4 + 324 = 350.4

StatMultiplier ≈ 0.98

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor ≈ **1.13**

#### 7.2.2.4 Crimson Devourer

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Normal  
**Role Tags:** Assassin

**Fantasy & Identity**

A frenzied executioner who becomes stronger as blood spills.  
He does not calculate — he commits.

Once he chooses a target, he escalates until one of them dies.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 330 |
| Strength | 72 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.15 |
| Movement Speed | 21 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 0 |

More sustain pressure than burst mobility.

**C. Enemy Kit**

**Basic Attack — Carve Flesh**  
Deal 100% STR Physical damage.

**Spell — Blood Frenzy**  
Mana Cost: 60

Mark the current target for 3 seconds.

While marked:

* Devourer gains +20% Attack Speed
* Devourer gains +15% Lifesteal

If the marked target dies:

* Instantly gain 40 Mana

**Why This Works**

* No dash
* No precision dive
* No positional targeting
* Escalates through commitment
* Snowballs off takedowns

It feels like:

“If this thing locks onto someone, someone is dying.”

That is Eclipse.

**Wave Budget Hooks**

Offense = 72

Defense =  
330 + 4 × (35 + 35)  
330 + 280 = 610

StatPower =  
0.55 × 72 + 0.45 × 610  
39.6 + 274.5 = 314.1

StatMultiplier ≈ 0.88

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **1.01**

#### 7.2.2.5 Ritual Harrower

**A. Enemy Overview**

**Faction:** Eclipse  
**Category:** Normal  
**Role Tags:** Support

**Fantasy & Identity**

Ritual overseers who empower nearby zealots through blood rites.

They strengthen violence around them.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 370 |
| Strength | 35 |
| Wisdom | 0 |
| Physical Defense | 50 |
| Spell Defense | 50 |
| Attack Speed | 0.85 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Ritual Strike**  
100% STR Physical damage.

**Passive — Frenzy Chant**  
All allies within 2 tiles gain +10% Attack Speed.

No stacking.

**F. Wave Budget Hooks**

Offense = 35

Defense =  
370 + 4 × (50 + 50)  
370 + 400 = 770

StatPower =  
0.55 × 35 + 0.45 × 770  
19.25 + 346.5 = 365.75

StatMultiplier ≈ 1.02

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.22**

### 7.2.3 Inquisition

All follow:

* Basic Attack
  + ONE Spell OR ONE Passive
* Mana-based only
* No cooldowns
* No stacking complexity
* Fully readable

#### 7.2.3.1 Ironbound Justicar

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

A disciplined crusader in heavy sanctified armor.  
He does not grow stronger through rage — he weakens those who oppose him.

He is not a wall.  
He is a suppressor.

**Strategic Role**

Frontline anchor that reduces enemy damage output.

Tests:

* Damage scaling resilience
* Spell damage reliance
* Target focus discipline

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 500 |
| Strength | 45 |
| Wisdom | 0 |
| Physical Defense | 75 |
| Spell Defense | 70 |
| Attack Speed | 0.85 |
| Movement Speed | 16 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

Durable but not Aegis-level tank.

**C. Enemy Kit**

**Basic Attack — Sanctified Strike**  
Deal 100% STR Physical damage.

**Spell — Rebuke**  
Mana Cost: 60

All enemies within 1 tile deal -15% damage for 3 seconds.

No stacking.  
No silence.  
Pure suppression.

**F. Wave Budget Hooks**

Offense = 45

Defense =  
500 + 4 × (75 + 70)  
500 + 4 × 145  
500 + 580 = 1,080

StatPower =  
0.55 × 45 + 0.45 × 1,080  
24.75 + 486 = 510.75

StatMultiplier ≈ 1.43

RoleMultiplier (Frontliner) = 1.10

BaseUnitFactor ≈ **1.57**

#### 7.2.3.2 Verdict Arbalist

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

A long-range execution specialist who punishes exposed positioning.

He does not spam fire.  
He waits for weakness.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 300 |
| Strength | 60 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 40 |
| Attack Speed | 0.95 |
| Movement Speed | 17 |
| Range | 5 |
| Max Mana | 70 |
| Starting Mana | 30 |

Longer range than Aegis.

**C. Enemy Kit**

**Basic Attack — Crossbow Bolt**  
Deal 100% STR Physical damage.

**Spell — Condemn Shot**  
Mana Cost: 70

Deal 130% STR Physical damage to the furthest enemy in range.

No dash.  
No AoE.  
Pure positional punishment.

**F. Wave Budget Hooks**

Offense = 60

Defense =  
300 + 4 × (35 + 40)  
300 + 300 = 600

StatPower =  
0.55 × 60 + 0.45 × 600  
33 + 270 = 303

StatMultiplier ≈ 0.85

RoleMultiplier (Backliner) = 1.05

BaseUnitFactor ≈ **0.89**

#### 7.2.3.3 Oathbinder Confessor

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

A doctrinal enforcer who binds enemies in sacred oaths.

He does not move targets.  
He restricts them.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 360 |
| Strength | 40 |
| Wisdom | 0 |
| Physical Defense | 45 |
| Spell Defense | 50 |
| Attack Speed | 0.90 |
| Movement Speed | 18 |
| Range | 3 |
| Max Mana | 60 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Lash of Doctrine**  
100% STR Physical damage.

**Spell — Binding Edict**  
Mana Cost: 60

Bind the current target for 2 seconds:

* Movement Speed reduced by 50%
* Cannot gain bonus Movement Speed

No stun.  
No silence.  
Pure positional restriction.

**F. Wave Budget Hooks**

Offense = 40

Defense =  
360 + 4 × (45 + 50)  
360 + 380 = 740

StatPower =  
0.55 × 40 + 0.45 × 740  
22 + 333 = 355

StatMultiplier ≈ 0.99

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor ≈ **1.14**

#### 7.2.3.4 Penitent Executor

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Normal  
**Role Tags:** Assassin

**Fantasy & Identity**

A ritual executioner who grows deadlier as judgment approaches completion.

He does not leap.  
He waits until law has weakened you.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 330 |
| Strength | 75 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.05 |
| Movement Speed | 20 |
| Range | 1 |
| Max Mana | 70 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Execution Slash**  
100% STR Physical damage.

**Spell — Final Sentence**  
Mana Cost: 70

Deal 120% STR Physical damage.  
If target is below 40% HP, deal an additional 40% STR Physical damage.

No dash.  
No stealth.  
Pure execute scaling.

**F. Wave Budget Hooks**

Offense = 75

Defense =  
330 + 4 × (35 + 35)  
330 + 280 = 610

StatPower ≈ 314.1

StatMultiplier ≈ 0.88

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **1.01**

#### 7.2.3.5 Doctrine Herald

**A. Enemy Overview**

**Faction:** Inquisition  
**Category:** Normal  
**Role Tags:** Support

**Fantasy & Identity**

A preacher who reinforces divine authority in nearby allies.

He does not attack aggressively.  
He amplifies law.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 380 |
| Strength | 35 |
| Wisdom | 0 |
| Physical Defense | 55 |
| Spell Defense | 55 |
| Attack Speed | 0.85 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Sanctum Strike**  
100% STR Physical damage.

**Passive — Righteous Authority**  
All allies within 2 tiles gain +10% Damage Amp.

No stacking.

**F. Wave Budget Hooks**

Offense = 35

Defense =  
380 + 4 × (55 + 55)  
380 + 440 = 820

StatPower ≈ 388.25

StatMultiplier ≈ 1.08

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.30**

### 7.2.4 Nebulae

All follow:

* Basic Attack
  + ONE Spell OR ONE Passive
* Mana only
* No cooldowns
* Fully readable
* No stacking complexity

#### 7.2.4.1 Massbound Coloss

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

A dense gravitational entity that bends space around its mass.  
It does not defend itself — it makes escape difficult.

It does not chase.  
It pulls the world inward.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 520 |
| Strength | 40 |
| Wisdom | 0 |
| Physical Defense | 80 |
| Spell Defense | 80 |
| Attack Speed | 0.80 |
| Movement Speed | 14 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

Durable and slow.

**C. Enemy Kit**

**Basic Attack — Density Slam**  
Deal 100% STR Physical damage.

**Spell — Gravity Well**  
Mana Cost: 60

For 3 seconds, enemies within 2 tiles have their Movement Speed reduced by 40%.

No stun.  
No root.  
Pure gravitational drag.

**F. Wave Budget Hooks**

Offense = 40

Defense =  
520 + 4 × (80 + 80)  
520 + 4 × 160  
520 + 640 = 1,160

StatPower =  
0.55 × 40 + 0.45 × 1,160  
22 + 522 = 544

StatMultiplier ≈ 1.52

RoleMultiplier (Frontliner) = 1.10

BaseUnitFactor ≈ **1.67**

#### 7.2.4.2 Void Raycaster

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

An alien construct projecting condensed void beams across warped sightlines.

It does not aim.  
It calculates.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 280 |
| Strength | 55 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 0.95 |
| Movement Speed | 16 |
| Range | 5 |
| Max Mana | 60 |
| Starting Mana | 30 |

Long-range threat.

**C. Enemy Kit**

**Basic Attack — Void Pulse**  
100% STR Physical damage.

**Spell — Refraction Beam**  
Mana Cost: 60

Fire at current target.  
After 0.5 seconds, the beam refracts to 1 additional enemy within 2 tiles of the first target.  
Secondary hit deals 70% STR Physical damage.

Spatial chaining, not fire or rage.

**F. Wave Budget Hooks**

Offense = 55

Defense =  
280 + 4 × (35 + 35)  
280 + 280 = 560

StatPower ≈ 281.75

StatMultiplier ≈ 0.79

RoleMultiplier (Backliner) = 1.05

BaseUnitFactor ≈ **0.83**

#### 7.2.4.3 Singularity Anchor

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

A spatial anomaly that compresses local reality, increasing gravitational density around targets.

It does not grab or bind.  
It increases pressure.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 350 |
| Strength | 45 |
| Wisdom | 0 |
| Physical Defense | 45 |
| Spell Defense | 50 |
| Attack Speed | 0.90 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 70 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Compression Strike**  
100% STR Physical damage.

**Spell — Mass Compression**  
Mana Cost: 70

Mark the current target for 3 seconds.

While marked:

* The target takes +15% damage from all sources.

No silence.  
No stun.  
Pure gravitational amplification.

**F. Wave Budget Hooks**

Offense = 45

Defense =  
350 + 4 × (45 + 50)  
350 + 380 = 730

StatPower ≈ 349.75

StatMultiplier ≈ 0.98

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor ≈ **1.13**

#### 7.2.4.4 Phase Skimmer

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Normal  
**Role Tags:** Assassin

**Fantasy & Identity**

A lightweight void predator that partially phases through space, becoming harder to strike while committing to elimination.

It does not leap.  
It shifts dimensions.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 310 |
| Strength | 72 |
| Wisdom | 0 |
| Physical Defense | 30 |
| Spell Defense | 30 |
| Attack Speed | 1.10 |
| Movement Speed | 22 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Phase Claw**  
100% STR Physical damage.

**Spell — Partial Phase**  
Mana Cost: 60

For 2 seconds:

* Gain +30% Evasion (attacks against it have 30% chance to miss)
* Gain +15% Attack Speed

No teleport.  
No invisibility.  
Pure dimensional shift.

**F. Wave Budget Hooks**

Offense = 72

Defense =  
310 + 4 × (30 + 30)  
310 + 240 = 550

StatPower ≈ 288.75

StatMultiplier ≈ 0.81

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **0.93**

#### 7.2.4.5 Entropy Conduit

**A. Enemy Overview**

**Faction:** Nebulae  
**Category:** Normal  
**Role Tags:** Support

**Fantasy & Identity**

A floating construct that amplifies decay in surrounding space.

It does not inspire.  
It accelerates inevitability.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 380 |
| Strength | 35 |
| Wisdom | 0 |
| Physical Defense | 55 |
| Spell Defense | 55 |
| Attack Speed | 0.85 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Entropic Touch**  
100% STR Physical damage.

**Passive — Entropy Field**  
All enemies within 2 tiles lose 10% of incoming healing effectiveness.

No stacking.  
No damage amplification.  
Pure decay amplification.

**F. Wave Budget Hooks**

Offense = 35

Defense =  
380 + 4 × (55 + 55)  
380 + 440 = 820

StatPower ≈ 388.25

StatMultiplier ≈ 1.08

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.30**

### 7.2.5 Nexus

All follow:

* Basic Attack
  + ONE Spell OR ONE Passive
* Mana-based only
* Fully readable
* No hidden stacking

#### 7.2.5.1 Bastion Automaton

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

A heavily plated autonomous construct designed to absorb kinetic impact and project adaptive shielding.

It does not endure through rage.  
It optimizes survivability.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 510 |
| Strength | 42 |
| Wisdom | 0 |
| Physical Defense | 85 |
| Spell Defense | 75 |
| Attack Speed | 0.85 |
| Movement Speed | 15 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

Durable but slightly more balanced defenses than Aegis.

**C. Enemy Kit**

**Basic Attack — Hydraulic Slam**  
Deal 100% STR Physical damage.

**Spell — Adaptive Shielding**  
Mana Cost: 60

For 3 seconds:

* Gain +20% Physical Defense
* Gain +20% Spell Defense

No damage reduction.  
Pure stat amplification.

**F. Wave Budget Hooks**

Offense = 42

Defense =  
510 + 4 × (85 + 75)  
510 + 4 × 160  
510 + 640 = 1,150

StatPower =  
0.55 × 42 + 0.45 × 1,150  
23.1 + 517.5 = 540.6

StatMultiplier ≈ 1.51

RoleMultiplier (Frontliner) = 1.10

BaseUnitFactor ≈ **1.66**

#### 7.2.5.2 Pulse Sniper Drone

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

A hovering precision drone that locks onto optimal trajectories before firing compressed energy pulses.

It does not spam fire.  
It calculates best shot vectors.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 270 |
| Strength | 65 |
| Wisdom | 0 |
| Physical Defense | 30 |
| Spell Defense | 30 |
| Attack Speed | 1.00 |
| Movement Speed | 18 |
| Range | 5 |
| Max Mana | 70 |
| Starting Mana | 30 |

**C. Enemy Kit**

**Basic Attack — Energy Pulse**  
100% STR Physical damage.

**Spell — Target Lock**  
Mana Cost: 70

Mark current target for 3 seconds.

While marked:

* Target takes +20% damage from this Drone only.

Precision amplification, not AoE.

**F. Wave Budget Hooks**

Offense = 65

Defense =  
270 + 4 × (30 + 30)  
270 + 240 = 510

StatPower =  
0.55 × 65 + 0.45 × 510  
35.75 + 229.5 = 265.25

StatMultiplier ≈ 0.74

RoleMultiplier (Backliner) = 1.05

BaseUnitFactor ≈ **0.78**

#### 7.2.5.3 Flux Interdictor

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

A field manipulator that destabilizes enemy energy output through interference pulses.

It does not drag.  
It scrambles.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 360 |
| Strength | 40 |
| Wisdom | 0 |
| Physical Defense | 45 |
| Spell Defense | 55 |
| Attack Speed | 0.90 |
| Movement Speed | 17 |
| Range | 3 |
| Max Mana | 60 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Interference Beam**  
100% STR Physical damage.

**Spell — Energy Disruption**  
Mana Cost: 60

Current target:

* Has its Mana gain reduced by 50% for 3 seconds.

No silence.  
No damage.  
Pure resource disruption.

**F. Wave Budget Hooks**

Offense = 40

Defense =  
360 + 4 × (45 + 55)  
360 + 400 = 760

StatPower =  
0.55 × 40 + 0.45 × 760  
22 + 342 = 364

StatMultiplier ≈ 1.02

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor ≈ **1.17**

#### 7.2.5.4 Quantum Skirmisher

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Normal  
**Role Tags:** Assassin

**Fantasy & Identity**

A rapid-response strike unit optimized for isolated elimination.

It does not rage.  
It executes with efficiency.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 320 |
| Strength | 75 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.15 |
| Movement Speed | 22 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Phase Blade**  
100% STR Physical damage.

**Spell — Overclock**  
Mana Cost: 60

For 3 seconds:

* Gain +25% Attack Speed
* Gain +20% Movement Speed

No dash.  
No teleport.  
Pure performance boost.

**F. Wave Budget Hooks**

Offense = 75

Defense =  
320 + 4 × (35 + 35)  
320 + 280 = 600

StatPower =  
0.55 × 75 + 0.45 × 600  
41.25 + 270 = 311.25

StatMultiplier ≈ 0.87

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **1.00**

#### 7.2.5.5 Synchronizer Node

**A. Enemy Overview**

**Faction:** Nexus  
**Category:** Normal  
**Role Tags:** Support

**Fantasy & Identity**

A floating energy relay that synchronizes nearby units for optimized combat efficiency.

It does not inspire.  
It connects.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 370 |
| Strength | 30 |
| Wisdom | 0 |
| Physical Defense | 55 |
| Spell Defense | 55 |
| Attack Speed | 0.80 |
| Movement Speed | 16 |
| Range | 3 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Signal Discharge**  
100% STR Physical damage.

**Passive — Network Link**  
All allies within 2 tiles gain +10% Attack Speed.

No stacking.

**F. Wave Budget Hooks**

Offense = 30

Defense =  
370 + 4 × (55 + 55)  
370 + 440 = 810

StatPower =  
0.55 × 30 + 0.45 × 810  
16.5 + 364.5 = 381

StatMultiplier ≈ 1.06

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.27**

### 7.2.6 Shogunate

All follow:

* Basic Attack
  + ONE Spell OR ONE Passive
* Mana-based
* Fully readable
* No hidden stacking

#### 7.2.6.1 Ironclad Hatamoto

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Normal  
**Role Tags:** Frontliner

**Fantasy & Identity**

An elite bodyguard trained to intercept and withstand assault.  
He does not rely on armor mass — he relies on guarded stance and discipline.

He does not stall.  
He stands.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 500 |
| Strength | 45 |
| Wisdom | 0 |
| Physical Defense | 75 |
| Spell Defense | 65 |
| Attack Speed | 0.90 |
| Movement Speed | 16 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

Durable but not Aegis-heavy.

**C. Enemy Kit**

**Basic Attack — Guarded Slash**  
Deal 100% STR Physical damage.

**Spell — Defensive Stance**  
Mana Cost: 60

For 3 seconds:

* Gain +30% Physical Defense
* Cannot gain bonus Movement Speed

Clear stance tradeoff.

**F. Wave Budget Hooks**

Offense = 45

Defense =  
500 + 4 × (75 + 65)  
500 + 4 × 140  
500 + 560 = 1,060

StatPower ≈ 499

StatMultiplier ≈ 1.39

RoleMultiplier (Frontliner) = 1.10

BaseUnitFactor ≈ **1.53**

#### 7.2.6.2 Longbow Ashigaru

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Normal  
**Role Tags:** Backliner

**Fantasy & Identity**

A disciplined archer trained for precise battlefield targeting.

He does not spam arrows.  
He chooses moments.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 290 |
| Strength | 60 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 0.95 |
| Movement Speed | 17 |
| Range | 5 |
| Max Mana | 70 |
| Starting Mana | 30 |

**C. Enemy Kit**

**Basic Attack — Piercing Arrow**  
100% STR Physical damage.

**Spell — Focused Shot**  
Mana Cost: 70

After 1 second of aiming:

* Deal 150% STR Physical damage to current target.

If interrupted before release, mana is not consumed.

No AoE.  
Pure disciplined burst.

**F. Wave Budget Hooks**

Offense = 60

Defense =  
290 + 4 × (35 + 35)  
290 + 280 = 570

StatPower ≈ 289.5

StatMultiplier ≈ 0.81

RoleMultiplier (Backliner) = 1.05

BaseUnitFactor ≈ **0.85**

#### 7.2.6.3 Blade Instructor

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Normal  
**Role Tags:** Disruptor

**Fantasy & Identity**

A veteran duelist who exploits openings and punishes reckless movement.

He does not pull or bind.  
He forces hesitation.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 350 |
| Strength | 48 |
| Wisdom | 0 |
| Physical Defense | 45 |
| Spell Defense | 45 |
| Attack Speed | 1.00 |
| Movement Speed | 19 |
| Range | 1 |
| Max Mana | 60 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Precision Cut**  
100% STR Physical damage.

**Spell — Counterstep**  
Mana Cost: 60

For 2 seconds:

* If struck by a melee attack, immediately retaliate for 80% STR Physical damage.

Only triggers once per activation.

No stun.  
No displacement.  
Punishes careless engagement.

**F. Wave Budget Hooks**

Offense = 48

Defense =  
350 + 4 × (45 + 45)  
350 + 360 = 710

StatPower ≈ 332.4

StatMultiplier ≈ 0.93

RoleMultiplier (Disruptor) = 1.15

BaseUnitFactor ≈ **1.07**

#### 7.2.6.4 Shadow Ronin

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Normal  
**Role Tags:** Assassin

**Fantasy & Identity**

A masterless warrior who strikes decisively when opportunity appears.

He does not rage.  
He ends fights.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 320 |
| Strength | 78 |
| Wisdom | 0 |
| Physical Defense | 35 |
| Spell Defense | 35 |
| Attack Speed | 1.10 |
| Movement Speed | 22 |
| Range | 1 |
| Max Mana | 70 |
| Starting Mana | 20 |

**C. Enemy Kit**

**Basic Attack — Swift Slash**  
100% STR Physical damage.

**Spell — Iaijutsu Strike**  
Mana Cost: 70

Dash up to 3 tiles in a straight line.  
Strike the first enemy hit for 130% STR Physical damage.

Single clean dash line.  
No stealth.  
No invisibility.

**F. Wave Budget Hooks**

Offense = 78

Defense =  
320 + 4 × (35 + 35)  
320 + 280 = 600

StatPower ≈ 313.9

StatMultiplier ≈ 0.88

RoleMultiplier (Assassin) = 1.15

BaseUnitFactor ≈ **1.01**

#### 7.2.6.5 War Banner Herald

**A. Enemy Overview**

**Faction:** Shogunate  
**Category:** Normal  
**Role Tags:** Support

**Fantasy & Identity**

A battlefield standard-bearer who maintains morale and coordination.

He does not cast magic.  
He reinforces discipline.

**B. Base Stats (Tier 1)**

| **Stat** | **Value** |
| --- | --- |
| Health | 380 |
| Strength | 35 |
| Wisdom | 0 |
| Physical Defense | 55 |
| Spell Defense | 55 |
| Attack Speed | 0.85 |
| Movement Speed | 17 |
| Range | 2 |
| Max Mana | 0 |
| Starting Mana | 0 |

**C. Enemy Kit**

**Basic Attack — Banner Strike**  
100% STR Physical damage.

**Passive — Martial Cohesion**  
All allies within 2 tiles gain +10% Crit Chance.

No stacking.

**F. Wave Budget Hooks**

Offense = 35

Defense =  
380 + 4 × (55 + 55)  
380 + 440 = 820

StatPower ≈ 388.25

StatMultiplier ≈ 1.08

RoleMultiplier (Support) = 1.20

BaseUnitFactor ≈ **1.30**

# VIII. Enemies Prompt

## 8.1 Aegis

### AEGIS SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a basic industrial military infantry soldier.

The character wears light functional armor consisting of a plain matte steel chest plate, small rounded steel shoulder pads, and simple steel forearm guards. Under the armor are dark navy cloth sleeves and matching trousers secured with brown leather straps and a belt. The boots are simple dark leather combat boots. The helmet is a basic open-faced steel helmet with a smooth surface and no visor, no glow, and no decorative elements. The face is visible and neutral in expression. The armor is symmetrical, practical, and standardized. No engravings, no gold trim, no capes, no fabric flowing elements, and no glowing parts. The silhouette is compact and slim, with light armor coverage and clearly visible limbs.

The design must look like german WWII disciplined factory-issued infantry equipment — mass-produced, uniform, and replaceable.  
It must not look magical, medieval fantasy, heroic, alien, futuristic, ornate, or exaggerated.

Color palette: matte steel grey armor, dark navy cloth, brown leather straps, natural human skin tone.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No rust, scratches, or battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line depending on swarm subtype.

**Mace Conscript (Frontliner Swarm)**

Equipped with a short blunt mace and a small round buckler shield.

**Rifle Conscript (Backliner Swarm)**

Equipped with a simple standard-issue rifle held at shoulder level.

### AEGIS NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a heavily armored industrial military soldier.

The character wears full modular plate armor made of matte steel panels with visible segmented construction and reinforced joints. The armor includes large squared shoulder plates, a solid chest plate with layered panel sections, plated forearm guards, reinforced thigh plates, and armored boots. Brown leather straps secure the armor segments in a practical and mechanical way. The helmet is fully enclosed and smooth, with a narrow horizontal glowing orange visor slit across the front. No face is visible. The visor glow is subtle and controlled, not bright or magical. The armor design is symmetrical and industrial, with clean geometric panel shapes and no medieval ornamentation. No engravings, no gold trim, no capes, no cloth decoration, no spikes. The silhouette is solid and medium-heavy, with noticeable bulk in the shoulders and torso while maintaining realistic human proportions.

The design must look like german WWII disciplined industrial heavy infantry equipped with advanced protective gear.  
It must not look medieval fantasy, magical, alien, organic, futuristic exosuit, ornate knight armor, or heroic.

Color palette: matte steel grey armor, subtle desaturated dark blue accent panels, brown leather straps, soft orange visor glow.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No rust, scratches, or battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 How You Extend This For Specific Units**

After this base prompt, you append one line depending on role:

Examples:

**Frontliner (Bulwark Enforcer)**

Equipped with a large rectangular reinforced riot shield and a short blunt mace.

**Backliner (Volley Gunner)**

Equipped with a compact industrial rifle held at chest level.

**Disruptor (Trench Puller)**

Equipped with a mechanical grappling launcher mounted on the left arm.

**Assassin (Shock Lancer)**

Equipped with a long military lance with a reinforced tip.

**Support (Quartermaster)**

Carries a compact tactical command device attached to belt and a short sidearm.

## 8.2 Eclipse

### ECLIPSE SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a wild fanatic cultist infantry fighter.

The character has a lean build and an aggressive forward-leaning posture. The face is fully visible with a fierce or unhinged expression. Clothing consists of minimal torn dark cloth wraps, a simple rope belt, and basic leather straps around the torso and forearms. Arms are partially exposed. No heavy armor plates. No metal chest armor. No glowing symbols. The weapon is crude and practical, made of dark rough metal or wood. The silhouette is thin and lightweight, with visible limbs and no bulky equipment.

The design must look like an expendable cult zealot thrown into battle — human, reckless, and poorly equipped.  
It must not look heroic, magical, armored, futuristic, regal, or elite.

Color palette: charcoal black cloth, deep muted red accents, dark brown leather, pale or slightly ashen skin tone.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No blood splatter or gore
* No dirt noise
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line per unit.

**Feral Thrall (Frontliner Swarm)**

Equipped with a crude two-handed cleaver made of dark rough metal.

**Spear Thrall (Backliner Swarm)**

Equipped with a simple wooden spear with a dark metal tip.

### ECLIPSE NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a hardened fanatic warrior.

The character has a lean but muscular build and a confident, aggressive posture. The face is fully covered with a crude and simple animal bone helmet or mask. The eyes glow faint yellow madness. Clothing consists of layered dark cloth garments combined with crude asymmetrical metal armor pieces strapped over the chest and shoulders. Armor pieces are dark steel or rusted iron with rough edges, secured by leather straps. Forearms may be wrapped in bandages or leather. The silhouette is medium-weight, with visible armor plates on shoulders and torso but not full heavy plate coverage.

The design must look like a brutal, battle-hardened cult warrior — dangerous and disciplined in violence.  
It must not look futuristic, technological, alien, regal, polished knight-like, or heroic.

Color palette: charcoal black cloth, deep desaturated red accents, dark brown leather, dull dark metal armor, pale or ashen skin.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No blood splatter or gore
* No dirt noise
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Role-Specific Extensions**

You append one line per unit.

**Frontliner (Bloodbound Ravager)**

Equipped with a heavy crude two-handed cleaver made of dark steel.

**Backliner (Hexfire Acolyte)**

Holds a ritual staff tipped with a jagged crimson crystal shard.

**Disruptor (Shatterhowl Zealot)**

Carries chained iron weights wrapped around forearms.

**Assassin (Crimson Devourer)**

Wields dual curved daggers with darkened blades.

**Support (Ritual Harrower)**

Holds a ritual bone totem wrapped in red cloth strips.

## 8.3 Inquisition

### INQUISITION SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a disciplined religious infantry zealot.

The character wears a long bone-white robe or tabard with a simple deep crimson vertical stripe or sigil on the chest.  
The clothing is clean and structured, not torn. Minimal armor is present — only small leather shoulder pads and a simple brown belt. The head is covered by a cloth hood. The face is completely shadowed. No metal mask. No glowing eyes. No magical aura. The silhouette is slim and cloth-dominant, with long vertical lines created by the robe.  
No heavy plate armor. No ornate decorations. No gold trim.

The design must look like a low-ranking but disciplined religious foot soldier serving an authoritarian order.  
It must not look chaotic, magical, futuristic, alien, regal, heroic, or heavily armored.

Color palette: bone white cloth, deep crimson accents, dark grey undershirt, brown leather belt.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No dirt or battle damage
* No blood
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line depending on subtype.

**Flagbearer Rabble (Support Swarm)**

Carries a simple wooden staff with a small cloth banner bearing a red sigil.

**Watchful Rabble (Backliner Swarm)**

Holds a small crossbow or thrown relic in one hand.

### INQUISITION NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a heavily equipped authoritarian religious soldier.

The character wears structured dark iron plate armor layered over a long bone-white tabard with deep crimson accents. The armor includes reinforced shoulder plates, solid chest plating, plated forearm guards, and armored boots. The tabard hangs vertically beneath the armor and is clean and symmetrical. The head is covered by a hood or a metal helmet or a smooth expressionless metal faceplate. No visible hair. No exposed face. The silhouette is solid and upright, with strong vertical lines and a disciplined, rigid posture. No flowing capes. No excessive ornament. No gold dominance.

The design must look like a strict enforcer of a powerful religious authority — controlled, imposing, and disciplined.  
It must not look chaotic, futuristic, alien, regal fantasy knight-like, heroic, or magical.

Color palette: dark iron armor, bone-white tabard, deep crimson accents, subtle muted gold trim.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No scratches or battle damage
* No blood
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Role-Specific Extensions**

Append one line per unit.

**Frontliner (Ironbound Justicar)**

Equipped with a tall rectangular tower shield engraved with a simple religious sigil and a heavy one-handed mace.

**Backliner (Verdict Arbalist)**

Equipped with a long reinforced crossbow held with disciplined posture.

**Disruptor (Oathbinder Confessor)**

Holds a chained censer emitting faint amber smoke trails.

**Assassin (Penitent Executor)**

Wields a long executioner-style greatsword with a straight blade.

**Support (Doctrine Herald)**

Carries a rigid ceremonial standard bearing a simple red sigil.

## 8.4 Nebulae

### NEBULAE SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a small floating alien crystal fragment creature.

The creature is composed of several angular dark indigo and deep violet crystal shards loosely held together by faint purple glowing energy seams. There is no face, no eyes, and no mouth. A small unstable purple glowing core is visible at the center of the main torso shard. The structure is irregular and fragmented, with thin shard-like limb pieces connected by visible gaps of glowing energy. The body hovers slightly above the ground and casts no shadow underneath. No smooth humanoid anatomy. No cloth. No metal armor. No organic skin. No magical aura effects. The silhouette is compact and lightweight, made of sharp geometric crystal shapes.

The design must look like a fragmented alien crystal lifeform driven by internal energy, not a fully formed armored warrior, not mechanical, and not humanoid.

Color palette: dark indigo and violet crystal surfaces with subtle inner purple glow.

Style requirements:

* Clean geometric cartoon rendering
* Flat colors with subtle internal glow gradients
* No painterly texture
* No scratches, dirt, or surface damage
* Clear angular silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line depending on subtype.

**Crystalline Fragment (Frontliner Swarm)**

The torso shard is thicker and more compact, with heavier lower crystal mass.

**Drifting Fragment (Backliner Swarm)**

One shard extends outward forming a narrow angular crystal projection.

### NEBULAE NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a fully formed alien crystalline humanoid construct.

The body is composed entirely of dark indigo and deep violet crystal plates arranged in a symmetrical humanoid shape. Limbs are angular and segmented with clean geometric joints. The structure is stable and complete, with solid crystal mass forming shoulders, torso, arms, and legs. The head is a smooth geometric crystal shape with nebulae-like energy templates running down the center. No face, no eyes, no mouth. Thin purple energy seams are visible between crystal plates, and a subtle inner purple glow emanates from within the torso. The entity slightly hovers above the ground and casts no shadow underneath. No cloth. No metal. No leather. No organic skin. No decorative ornaments. No magical aura effects. The silhouette is asymmetrical, and medium-weight, with defined shoulders and balanced proportions.

The design must look like an advanced alien crystalline being formed from structured crystal geometry, not mechanical, not humanoid armor, and not a fantasy elemental spirit.

Color palette: dark indigo and violet crystal surfaces with controlled purple internal glow lines.

Style requirements:

* Clean geometric cartoon rendering
* Flat colors with subtle inner glow gradients
* No painterly texture
* No scratches, dirt, or surface damage
* Clear angular silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Role-Specific Extensions**

Append one line per unit.

**Frontliner (Massbound Coloss)**

Body mass is thicker and denser with larger shoulder crystal plates and heavier lower torso segments.

**Backliner (Void Raycaster)**

One arm extends into a long angular crystalline cannon shape.

**Disruptor (Singularity Anchor)**

Floating crystal shards orbit slowly around the torso.

**Assassin (Phase Skimmer)**

Limbs are thinner and sharper, with elongated blade-like forearms.

**Support (Entropy Conduit)**

A small floating crystal core hovers behind its back connected by faint energy strands.

## 8.5 Nexus

### NEXUS SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a small mass-produced combat drone.

The unit is a compact mechanical construct with a simplified humanoid or semi-humanoid body shape. It has a small central torso module made of light metallic grey and white ceramic panels. Limbs are thin mechanical arms and legs with visible segmented joints. Instead of a face, the head area features a small horizontal glowing cyan visor slit or a single circular cyan sensor light. A small faint cyan energy core glows at the center of the torso. Armor plating is minimal and smooth, with clean panel seams and subtle geometric design. No cloth. No exposed wires. No rust. No scratches. No decorative elements. The silhouette is compact and lightweight, with thin limbs and a small torso mass.

The design must look like a factory-produced, replaceable combat drone — efficient, mechanical, and utilitarian.  
It must not look organic, magical, alien crystal-like, medieval, or heroic.

Color palette: light metallic grey, white ceramic armor panels, dark graphite joints, cyan visor and core glow.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line depending on subtype.

**Assault Unit (Frontliner Swarm)**

The body is slightly wider with reinforced front plating and thicker lower chassis.

**Pulse Drone (Backliner Swarm)**

One arm or emitter extends into a narrow cylindrical energy projector.

### NEXUS NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of an advanced humanoid combat robot.

The unit has a full humanoid mechanical body with balanced proportions and reinforced armor plating. The body is constructed from smooth white ceramic armor panels and light metallic grey structural segments. Joints are dark graphite with visible clean mechanical articulation. The head is a smooth robotic helmet with a horizontal glowing cyan visor line. A defined cyan energy core glows at the center of the chest. Thin cyan energy lines run along armor seams. The armor is symmetrical and moderately heavy, with reinforced shoulder plates, plated forearms, and solid leg armor. No cloth. No exposed wiring. No rust. No scratches. No decorative ornament. No magical effects. The silhouette is structured and medium-weight, clearly mechanical and purpose-built for combat.

The design must look like a high-tech military combat unit manufactured with precision engineering — efficient, clean, and controlled. It must not look organic, medieval, alien crystal-like, religious, chaotic, or heroic.

Color palette: white ceramic armor panels, light metallic grey plating, dark graphite joints, cyan visor and chest core glow.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Role-Specific Extensions**

Append one line depending on the unit.

**Frontliner (Bastion Automaton)**

Armor plates are thicker and more reinforced around shoulders and chest, with a larger chest core module.

**Backliner (Pulse Sniper Drone)**

Right arm transforms into a long sleek energy rifle module.

**Disruptor (Flux Interdictor)**

Small floating holographic emitter panels project from the forearms.

**Assassin (Quantum Skirmisher)**

Limbs are slightly slimmer and more aerodynamic with sharper angular knee and elbow plates.

**Support (Synchronizer Node)**

A small floating energy drone orbits behind the unit connected by faint cyan energy strands.

## 8.6 Shogunate

### SHOGUNATE SWARM BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a light infantry soldier inspired by feudal Japanese ashigaru, blended with subtle cyberpunk technology.

The character wears a simple muted red or dark charcoal cloth tunic secured with a dark navy sash. A small plain iron chest plate is worn over the tunic. The armor is lightweight and practical. The helmet is a simple conical jingasa hat or minimal light kabuto helmet with integrated thin red digital accent lines along the rim. The face is visible and human, calm and disciplined. Subtle cyberpunk elements are integrated into the gear: thin glowing red circuitry lines embedded into the chest plate, a small rectangular data module attached at the belt, minimal red LED strips along armor edges. The glow is controlled and subtle, not bright neon. The silhouette is slim and lightly armored, with no large shoulder plates and no layered heavy skirt armor. No gold ornamentation. No medieval European knight elements. No magical aura.

The design must look like disciplined low-ranking infantry from a cyberpunk feudal military society — traditional foundation with restrained technological augmentation. It must not look alien, fantasy magical, bulky mech, or heroic champion.

Color palette: muted crimson cloth, dark charcoal accents, iron grey chest plate, subtle red digital glow lines.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No dirt or battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Swarm Role Extensions**

Append one line depending on subtype.

**Spear Ashigaru (Frontliner Swarm)**

Equipped with a long yari spear with a thin red energy filament running along the blade edge.

**Bow Ashigaru (Backliner Swarm)**

Equipped with a traditional yumi bow enhanced with small red illuminated targeting nodes.

### SHOGUNATE NORMAL BASE SPRITE PROMPT

Create a 2D top-down tactical RPG game sprite of a disciplined armored warrior inspired by feudal Japanese samurai blended with restrained cyberpunk technology.

The character wears full layered lamellar armor with deep crimson lacquered plates arranged in horizontal segments across the torso and shoulders. The armor includes reinforced shoulder guards, plated forearm guards, layered waist armor panels, and armored shin guards. Integrated into the armor are subtle technological element: thin controlled red digital lines embedded along the armor plate edges, small rectangular data modules attached at the waist, minimal red LED indicators on shoulder or chest plates. The glow is subtle and controlled, not bright neon. Under the armor is a muted beige or charcoal undergarment secured with a dark navy sash. The helmet is a structured kabuto with modest angular flares and a narrow horizontal red illuminated visor slit or small red sensor line. The face may be partially visible or covered by a simple lower face guard. The silhouette is balanced and medium-heavy, with clearly defined layered armor plates and strong shoulder presence. No excessive gold ornamentation. No glowing aura. No full mechanical limbs. No futuristic white ceramic armor.

The design must look like a professional warrior of a cyberpunk feudal military order — traditional martial form enhanced by controlled integrated technology. It must not look alien, robotic, medieval European, magical, exaggerated, or heroic.

Color palette: deep crimson lacquered armor, dark brown or charcoal accents, iron grey plates, subtle red digital glow lines.

Style requirements:

* Clean cartoon rendering
* Flat colors
* Simple shading
* No painterly texture
* No dirt or battle damage
* Clear readable silhouette
* Transparent background
* Top-down tactical RPG perspective
* Consistent outline thickness

**🧩 Role-Specific Extensions**

Append one line per unit.

**Frontliner (Ironclad Hatamoto)**

Equipped with a reinforced rectangular shield with subtle red energy seams and a short katana.

**Backliner (Longbow Ashigaru)**

Equipped with a long yumi bow enhanced with small red illuminated targeting nodes.

**Disruptor (Blade Instructor)**

Equipped with a single katana featuring a thin red energy line running along the blade groove.

**Assassin (Shadow Ronin)**

Equipped with dual tanto with subtle red energy accents near the hilts.

**Support (War Banner Herald)**

Carries a tall war banner integrated with a small red holographic clan emblem projection.

---

> [!info] Related Documents
> - [[core_design]] — Combat resolution and wave composition
> - [[art_style]] — Enemy sprite visual descriptions
