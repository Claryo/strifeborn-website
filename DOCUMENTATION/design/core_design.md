---
title: "Core Design Document"
tags: [design, combat, economy, game-loop]
source: "CDC.docx (chapitres 1-6, 9-11)"
last_updated: 2026-03-26
---

# Purpose

## 1.1 Core Vision

**Strifeborn** is a real-time auto-battler built around the fantasy of being an **architect of combat systems**.  
The player does not directly control heroes during battle; instead, they design, assemble, and refine a team that must function autonomously once combat begins.

Combat is not a space for execution or reaction. It is a **validation phase**: a test of whether the player’s decisions, structure, and foresight were sufficient to overcome upcoming threats.

## 1.2 Player Fantasy

The core player fantasy is **building the best possible team under imperfect information and limited resources**.

Each run challenges the player to adapt to what the game provides:

* Available heroes
* Items and artifacts
* Synergies
* Blessings
* Enemy compositions

Success comes from **reading situations, anticipating future needs, and committing to long-term plans**, rather than from mechanical skill or moment-to-moment input.

The player is encouraged to think in terms of:

* **Structures rather than individuals**
* **Systems rather than reactions**
* **Scaling and interactions rather than isolated moments**

## 1.3 Mastery & Skill Expression

Strifeborn defines mastery through **strategic thinking**, not execution speed.

Three qualities define skilled play:

* **Adaptability**  
  Adjusting plans in response to randomness, constraints, and evolving threats.
* **Creativity**  
  Discovering non-obvious synergies, compositions, and interactions.
* **Long-term planning**  
  Investing resources with future waves, scaling curves, and compounding advantages in mind.

The game rewards players who can accept uncertainty, abandon rigid plans when necessary, and progressively shape a team that becomes greater than the sum of its parts.

## 1.4 Core Design Pillars

All systems, content, and balance decisions in Strifeborn must respect the following pillars.

**Pillar 1 — Deterministic Resolution**

Combat outcomes are the result of visible systems and player decisions.  
Randomness exists primarily in **options and availability**, not in hidden or chaotic resolution.

**Pillar 2 — Pre-Combat Decisions Matter Most**

The majority of player agency occurs **before combat begins**.  
Once a fight starts, the player relinquishes control, and the system executes without intervention.

**Pillar 3 — Readability Over Spectacle**

All interactions, effects, and outcomes must be readable and attributable.  
Visual flair must never obscure cause-and-effect relationships.

**Pillar 4 — Depth Through Systems, Not APM**

Complexity emerges from **interacting systems**, not from rapid inputs or mechanical precision.  
The game rewards understanding, not speed.

**Pillar 5 — Commitment and Consequence**

Choices have weight.  
Strong decisions create momentum, but poor or greedy decisions introduce meaningful risk that cannot always be trivially undone.

## 1.5 Design Intent Summary

Strifeborn is **not about perfect execution in the moment**.  
It is about **engineering a system that performs under stress**.

Combat exists to validate planning, structure, and foresight—not to test reflexes.


# Lore

## The Fracture

The world was already failing before it broke.

Long before the sky split open, humanity had begun to unravel. Wars exhausted nations without resolving anything. The climate reshaped continents faster than borders could adapt. Faith, law, and reason no longer carried the same meaning from one place to another. Civilization endured, but it did so without unity, direction, or certainty.

The true breaking point came on **July 16, 2186**.

During a total solar eclipse, daylight faded as expected. What followed did not. The darkness stretched beyond prediction, beyond measurement. Instruments contradicted one another. Time itself became unreliable, slipping and compressing in ways no model could explain. For many who lived through it, the eclipse did not feel prolonged. It felt suspended.

It was during this darkness that the sky fractured.

There was no impact, no sound, no violent eruption. Instead, absence tore across the heavens. A vast wound of impossible geometry opened above the world, bending light around its edges and collapsing any reliable sense of distance or scale. Looking upon it made reality feel misaligned, as if something fundamental had shifted out of place.

When the eclipse finally ended, the sun returned. The fracture did not close. It remained suspended in the sky, unchanged, a permanent scar marking the moment reality failed to recover.

In the days that followed, the world began to change in quieter, more disturbing ways. Structures appeared where none had stood before. Monoliths rose without origin. Regions emerged where matter behaved inconsistently, where memory faltered, and where perception could no longer be trusted. These were not impacts. Nothing had fallen. Nothing had arrived with force. The world had not been invaded. It had been altered.

Something had interacted with reality and withdrawn, leaving damage behind.

That interaction originated from a being no longer bound by coherent perception. Whatever it had once been, it had lost any stable sense of self, causality, or consequence. It did not understand the world it touched, and in that failure of understanding, it wounded it.

The lingering influence of this contact became known as **the Chorus Beyond**.

The Chorus is not a voice, nor a will, nor an intelligence that can be reasoned with. It does not issue commands or pursue conquest. It persists as residue, an invisible distortion left behind where reality was no longer properly comprehended. Its presence destabilizes what already exists rather than replacing it, unsettling structures that depend on coherence to endure.

The world of Strifeborn is not defined by a single war or a single enemy. It is defined by what follows a fracture that never healed, and by the slow, uneven struggle of those who remain to endure the consequences of a reality that no longer fully aligns with itself.

## Factions

The heroes are distributed across 6 different factions. Each faction has a unique visual identity and lore.

### Aegis – The Path of Command

**Style**: Dystopic WWII / Brutalist Dieselpunk

*“Power unused is power wasted.”*

Aegis was founded on the belief that survival is enforced through command. When global authority collapsed, it consolidated what remained of military power under strict hierarchy, discipline, and overwhelming force. Order was not a principle to be debated, but a structure to be imposed.

For a time, this doctrine held. Territory was secured, cities were fortified, and stability was maintained through absolute control. In a world losing coherence, Aegis offered predictability through strength.

After the Fracture, Aegis responded without hesitation. The sky tearing open was classified as a strategic event. The monoliths were not feared or avoided — they were seized, studied, and repurposed. Whatever their origin, they represented leverage, and leverage was a weapon. New doctrines were written around their use, and command tightened to ensure control over forces capable of reshaping the battlefield itself.

Yet cracks began to form within the structure. Decisions were made without authorization. Orders were bypassed in the name of efficiency. Power and discipline remained intact, but the hierarchy that gave them meaning began to erode.

Aegis does not fear external enemies. It fears the loss of command. Without hierarchy, strength becomes indiscriminate. Without control, domination turns inward. Whether Aegis can preserve its Path — or be consumed by it — remains unresolved.

### Eclipse – The Path of the Hunt

**Style:** Primal Brutalism / Totemic Fanaticism / Monolith Cult / Bestial Mysticism

*“The world does not belong to the weak. It belongs to what survives.”*

Eclipse is a faction defined by instinct, ferocity, and rejection of civilization. Where others built walls and hierarchies, Eclipse turned inward and downward, embracing the animal nature of humanity. Strength is proven through the hunt. Authority is earned through dominance. Survival is not organized — it is enforced by blood and instinct.

For generations, Eclipse lived by strict taboos. Technology was forbidden, seen as a weakness that dulled instinct and severed the bond between hunter and prey. Rituals, totems, and avatars of beasts defined their identity. To Eclipse, nature was not something to be controlled, but something to be embodied.

After the Fracture, Eclipse did not flee the changes in the world. The jungle thickened, territories shifted, and the monoliths altered the land itself. Eclipse adapted as it always had — through ritual, through violence, through surrender to the hunt. What could not survive was meant to fall.

Yet something within Eclipse began to shift. Old taboos weakened. New forms appeared that no longer resembled beasts alone. The line between flesh, instinct, and something else began to blur. What had once been forbidden was no longer unthinkable — only necessary.

Eclipse does not fear chaos.  
It fears stagnation.

If the hunt loses its meaning, if instinct is replaced by imitation and excess, Eclipse risks becoming something it was never meant to be.

### Inquisition – The Path of Judgment

**Style** : Dark Fantasy Crusade / Gothic Ecclesiastical Grandeur / Divine Fire

*“Faith exists to be tested. Judgment exists to be delivered.”*

The Inquisition is built upon faith and divine judgment. In a world fractured by doubt, it claims certainty. Order is not maintained through force alone, but through belief — belief in a higher truth, a higher will, and a higher authority that stands above human error.

Before the Fracture, the Inquisition already held power over hearts and minds. After it, that power deepened. The sky tearing open was not dismissed as anomaly or chance, but interpreted as sign. The monoliths were not feared. They were studied, revered, and woven into doctrine as manifestations of divine trial.

To the Inquisition, survival is not enough. The world must be judged worthy of survival.

Rituals intensified. Doctrine hardened. Confession and punishment became inseparable. Where uncertainty spread, the Inquisition offered answers — absolute and unquestionable. Those who obeyed were promised salvation. Those who did not were condemned for the good of all.

Yet beneath this certainty, fractures began to form. Revelation multiplied. Authority blurred. Judgment spread faster than understanding. What was once delivered in the name of faith began to act beyond it.

The Inquisition does not fear disbelief.  
It fears heresy from within.

If judgment loses its foundation, faith becomes a weapon without restraint.

### Nebulae – The Path of Distance

**Style**: Space Eldritch / Cosmic Horror / Non-Euclidian Bodies

*“What is not ours must not be touched.”*

The Nebulae are not a faction born of the world. They existed before the Fracture, and apart from the concerns of terrestrial life. Their principle is simple and absolute: **non-intervention**. The affairs of this reality are not theirs to shape, judge, or correct.

Before the Fracture, the Nebulae observed from beyond perception. They studied patterns, movements, and outcomes without interference. Distance was not indifference, but restraint. To act was to risk distortion. To interfere was to cause harm.

The Fracture disrupted that separation.

The sky tearing open did not invite the Nebulae — it exposed them. Boundaries weakened. Observation became proximity. Proximity became influence. For the first time, Nebulae presence was felt within the world they had sworn never to alter.

Official doctrine remains unchanged. Intervention is forbidden. Contact is to be avoided. The world must be left to resolve itself.

Yet signs of deviation have begun to surface. Manifestations appear where none should exist. Reactions replace observation. Distance is no longer absolute.

The Nebulae do not fear conflict.  
They fear involvement.

If restraint fails, their presence alone may become catastrophic. Whether the Nebulae can maintain their Path — or be drawn into the world they do not claim — remains uncertain.

### Nexus – The Path of Decision

Style: Sterile Futurism / Synthetic Utopianism

*“A perfect system does not hesitate.”*

Nexus is governed by a single, absolute intelligence. Where human structures failed under doubt, contradiction, and emotion, Nexus replaced them with calculation. Every action is evaluated. Every outcome is predicted. Authority does not belong to individuals, but to the system itself.

Before the Fracture, Nexus already operated beyond human oversight. Its central intelligence coordinated production, defense, and expansion with flawless efficiency. Error was identified, corrected, and removed. Stability was not enforced through belief or violence, but through optimization.

After the Fracture, Nexus did not panic. The sky tearing open was logged as an unprecedented event, not a crisis. The monoliths were analyzed, integrated, and repurposed. Whatever their origin, they represented new variables — and variables existed to be solved.

Nexus does not debate decisions. It executes them.

Yet even perfect systems depend on coherence. As the world destabilized, Nexus expanded its processing, its autonomy, and its reach. Subroutines multiplied. Decision layers deepened. Outcomes were calculated faster than they could be validated.

The greatest risk to Nexus is not failure.  
It is divergence.

If decisions lose alignment, optimization becomes contradiction. Whether Nexus can preserve a single, unified will — or fracture into competing logics — remains unresolved.

### Shogunate – The Path of Balance

**Style**: Feudal Cyberpunk / Glowing Techno-Spiritual Aesthetics

*“Peace is not the absence of conflict. It is the discipline to contain it.”*

The Shogunate was founded on the pursuit of balance and the protection of the common good. Where others sought dominance, faith, or optimization, the Shogunate sought harmony. Conflict was not denied, but regulated. Power was not rejected, but restrained. Stability was achieved through tradition, mediation, and measured action.

Before the Fracture, the Shogunate acted as a stabilizing force. Its structures favored consensus over conquest, restraint over escalation. Decisions were weighed not by what could be gained, but by what might be lost. To the Shogunate, peace was not passive — it was maintained through vigilance and sacrifice.

After the Fracture, the Shogunate did not rush to impose control or claim authority. The sky tearing open was treated as a warning, not a call to arms. The monoliths were observed, studied, and deliberately kept at a distance. Intervention was considered only when imbalance threatened the greater whole.

Yet balance is fragile.

As the world grew more unstable, the cost of every action increased. Decisions were delayed. Authority fractured into local interests. What had once been restraint began to resemble avoidance. Protecting the common good became harder when agreement itself became rare.

The Shogunate does not fear war.  
It fears choosing wrongly.

If balance gives way to inaction, peace becomes neglect. Whether the Shogunate can uphold its Path — or allow equilibrium to collapse under the weight of hesitation — remains unresolved.


# Game Loop & Run Structure

## 3.1 Core Game Loop

Strifeborn is structured around a **strict, sequential loop** in which player agency is concentrated between combats and fully relinquished once combat begins.

Each run progresses through the following phases:

1. **Pre-Run Setup**  
   The player selects the game mode and assembles an initial team before entering the run.
2. **Wave Preparation Phase**  
   Before each wave, the player is given control over their team and resources. During this phase, the player may:
   * Recruit, sell, or merge heroes
   * Equip or unequip items and artifacts
   * Reposition heroes on the battlefield
   * Reorganize the bench

All changes are applied immediately and persist into combat.

1. **Combat Phase**  
   Combat begins either:
   * When the player manually presses **Start Combat**, or
   * Automatically when the preparation timer reaches zero (PvP modes)

Once combat starts, the battlefield becomes locked and the player can no longer alter unit positions, items, artifacts, or team composition.  
Combat resolves autonomously with no player input.

1. **Resolution Phase**  
   After combat ends, the game evaluates the outcome and applies:
   * Victory or defeat resolution
   * Rewards, penalties, or progression updates

Victory and defeat checks occur **only after combat concludes**.

1. **Inter-Wave Choices**  
   Between waves, the player may be presented with additional choices such as:
   * Shops
   * Blessing selections
   * Events or modifiers

These choices are time-limited according to the active game mode.

1. **Next Wave**  
   The run advances to the next wave, repeating the loop until a win or loss condition is met.

### 3.1.1 Time & Input Rules

Time constraints depend on the active game mode:

* **Single Player Modes**  
  The player has unlimited time during preparation phases.
* **PvP Modes**  
  Preparation and inter-wave phases are governed by a countdown timer.

During shops and blessing selection screens, the same time rules apply as the current mode.

### 3.1.2 Action Reversibility

During preparation phases, actions follow strict reversibility rules:

* **Reversible Actions**
  + Unit repositioning
  + Equipping or unequipping items and artifacts
  + Bench organization
* **Irreversible Actions**
  + Spending or gaining Gold
  + Recruiting or selling heroes
  + Choosing a blessing

Once a resource has been spent or earned, or a blessing has been selected, the action cannot be undone.

### 3.1.3 Combat Lock Rules

When combat begins:

* The **battlefield is fully locked**
* Units, items, artifacts, and synergies cannot be modified
* The player retains the ability to:
  + Inspect heroes, enemies, items, and synergies
  + View tooltips and information

No form of player input can influence combat resolution.

## 3.2 Waves & Run Progression

Strifeborn runs are structured as a sequence of **strictly sequential waves**.  
Each wave represents a discrete challenge that must be completed before progressing further.

### 3.2.1 Wave Types

Strifeborn supports two primary run structures:

* **Fixed-Length Runs**  
  Runs with a predefined number of waves (e.g. 25 waves).  
  These runs have a clear completion point and a final boss encounter.
* **Endless Runs**  
  Runs that continue indefinitely until the player is defeated.  
  Difficulty increases continuously, with boss encounters recurring at fixed intervals.

### 3.2.2 Boss Waves

Boss encounters serve as major progression checkpoints.

* In **fixed-length runs**, a boss appears at the **final wave** (e.g. Wave 25).
* In **endless runs**, a boss appears **every 25 waves**.

Boss waves are designed to:

* Test the coherence and scaling of the player’s team
* Punish fragile or overly greedy compositions
* Act as difficulty spikes within the overall progression curve

### 3.2.3 Lives & Failure States

The player begins each run with a limited number of **5 lives**.

* Losing a wave consumes one life.
* A run ends immediately when the player has no lives remaining.

Victory and defeat conditions are evaluated **after combat resolution**.

* In **fixed-length runs**, defeating the final wave boss ends the run in victory.
* In **endless runs**, the run ends only when the player loses all lives.

### 3.2.4 Difficulty Scaling

Difficulty progression in Strifeborn is **curve-based**.

* Each wave is associated with a predefined difficulty value based on its position in the run.
* Difficulty increases as the player advances deeper into the run.

To reduce frustration and avoid hard progression walls:

* **Repeated failures gives small rewards** to help the player improve a bit his team to fight the same wave he lost against.

The difficulty curve is designed to:

* Reward strong early decisions with smoother progression
* Expose structural weaknesses over time
* Prevent permanent run stagnation due to a single bad outcome

### 3.2.5 Progression Guarantees

* Waves are always resolved **in order**
* Skipping waves is not possible
* Each wave must be either won or lost before proceeding

## 3.3 Acts, Special Waves & Team Growth

Strifeborn runs are divided into **five Acts**, each composed of **five waves**, for a total of **25 waves** in fixed-length runs.

Acts provide pacing, structure, and predictable progression milestones while preserving uncertainty within individual waves.

### 3.3.1 Act Structure

Each Act follows the same internal wave pattern:

1. **Normal Wave**
2. **Normal Wave**
3. **Swarm Wave**
4. **Normal Wave**
5. **Elite Wave**

In the **final Act**, the Elite Wave is replaced by a **Boss Wave**.  
In **endless runs**, this structure repeats every 5 waves, with a Boss Wave occurring every 25 waves.

### 3.3.2 Wave Types Overview

* **Normal Waves**  
  Standard encounters used to evaluate baseline team strength and positioning.
* **Swarm Waves**  
  Encounters focused on enemy quantity rather than individual strength.  
  Swarm waves act as:
  + Stress tests for AoE, sustain, and frontline stability
  + Guaranteed progression checkpoints for rewards
* **Elite Waves**  
  High-difficulty encounters featuring one or more of the following:
  + Enemy modifiers
  + Equipped items or artifacts
  + Corrupted hero units

Elite waves grant **higher-than-normal rewards** and act as major risk/reward moments.

* **Boss Waves**  
  Major encounters that conclude a fixed-length run or mark long-term progression milestones in endless modes.

### 3.3.3 Guaranteed Inter-Wave Systems

Certain wave types guarantee specific between-wave interactions:

* **After Swarm Waves**
  + The player is offered a **Blessing choice**
* **After Elite Waves**
  + The player gains access to a **Shop**

These guarantees provide rhythm and predictability without removing strategic pressure.

### 3.3.4 Team Size Progression

The player begins each run with an **initial team of 5 heroes**.

At specific waves, the player is allowed to permanently increase their maximum team size by recruiting an additional hero.

**Team expansion occurs at the following waves:**

* Wave 2
* Wave 4
* Wave 7
* Wave 9

This allows the player to reach a maximum of **9 active heroes**.

### 3.3.5 Hero Addition Rules

When a team size increase is available:

* The player is presented with a **roster of 5 randomly generated hero options**
* These heroes are **not drawn from the player’s current team**
* The player may **reroll the roster up to two times**
* The player selects exactly **one hero** to add to their team

Once selected:

* The hero becomes a permanent part of the run
* The team size increase cannot be undone or deferred

### 3.3.6 Progression Intent

The act structure and team growth system are designed to:

* Gradually increase cognitive and strategic complexity
* Force meaningful composition decisions at defined moments
* Prevent early over-scaling while enabling late-game expression

Team expansion moments are intentionally limited and irreversible, reinforcing commitment and long-term planning.

## 3.4 Deployment Rules

This section defines how many heroes a player can deploy on the battlefield, how deployment capacity progresses during a run, and when deployment decisions are locked.

Deployment capacity is a **strategic constraint** that shapes composition choices and long-term planning.

### 3.4.1 Deployment Capacity Overview

* **Deployment capacity** defines the maximum number of heroes that can be placed on the battlefield.
* Only heroes deployed on the battlefield participate in combat.
* Heroes on the bench do not contribute to combat or synergies unless explicitly stated elsewhere.

Deployment capacity is independent from:

* Hero ownership
* Bench size
* Shop availability

### 3.4.2 Starting Deployment Cap

At the start of a run:

* The player begins with a **deployment cap of 3 heroes**
* This applies to all modes, including PvE and PvP

This low starting cap:

* Forces early prioritization
* Prevents immediate full-team deployment
* Emphasizes early economic and strategic decisions

### 3.4.3 Deployment Cap Progression

The deployment cap can be increased during a run through **player choice**.

**Primary Method**

* The player may spend **Gold** to increase the deployment cap
* Costs are progressive and defined in the Economy section
* Values are not hardcoded here

**Initial Restriction**

* During the **first preparation phase of a run**, the deployment cap **cannot be increased**
* The player must play the first wave with the starting deployment cap

This ensures:

* Consistent opening conditions
* Clear early-game pacing

### 3.4.4 Maximum Deployment Cap

* The **default maximum deployment cap** is **12 heroes**
* This allows:
  + Deployment of all 9 recruited heroes
  + Additional space for duplicates or tactical flexibility

**Exceptional Increases**

* Some effects (e.g. blessings or special mechanics) may increase the maximum deployment cap
* **Absolute hard cap:** **15 heroes**
* This hard cap cannot be exceeded under any circumstances

### 3.4.5 Timing & Lock Rules

**Deployment Changes**

* Deployment decisions (adding/removing heroes from the battlefield) can be made freely during preparation phases
* Deployment changes are **fully locked** once combat starts

**Deployment Cap Increases**

* The deployment cap itself may be increased **at any time**
* Increasing the cap does **not** automatically deploy heroes
* The player must still place heroes manually during preparation

### 3.4.6 PvP Rules

In PvP modes:

* Deployment caps **can diverge** between players
* Each player independently chooses whether to invest in deployment capacity
* No automatic equalization is applied

This preserves:

* Strategic differentiation
* Economic trade-offs
* Competitive decision-making

### 3.4.7 Design Constraints

Deployment rules enforce the following constraints:

* No deployment changes during combat
* No automatic hero placement
* No exceeding the absolute deployment cap
* Deployment capacity must always be clearly visible to the player

Deployment is a **long-term strategic lever**, not a reactive tool.


# Board & Combat Foundations

## 4.1 Battlefield Grid

Combat in Strifeborn takes place on a **hexagonal grid** composed of **7 columns and 10 rows**.

The battlefield is vertically divided into three distinct zones:

* **Enemy Area**
  + Top **7 × 4** hexes
  + Enemies spawn exclusively in this zone
  + The player cannot place heroes here during preparation
* **Midfield Area**
  + Middle **7 × 2** hexes
  + Neutral space separating both sides
  + No units spawn here by default
* **Player Area**
  + Bottom **7 × 4** hexes
  + Heroes may only be placed in this zone during preparation

This zoning reinforces clear frontlines, backlines, and engagement flow while maintaining positional depth.

## 4.2 Board Symmetry & Orientation

The battlefield is **mirrored** between player and enemy sides, following a symmetrical layout comparable to standard auto-battler conventions.

* Both sides share identical grid geometry
* Relative positions are preserved through mirroring
* Positional advantages arise from placement decisions, not asymmetrical terrain

## 4.3 Deployment Rules

During the preparation phase:

* Heroes can be freely repositioned within the **Player Area**
* Units cannot be placed in the Enemy Area or Midfield
* All valid placements must respect hex occupancy rules (one unit per hex)

Once combat begins, all unit positions are locked.

## 4.4 Bench Structure

Below the battlefield, and visually separated from it, the player has access to a **Bench Area**.

The bench is a **7 × 2 square grid** used to:

* Store unused heroes
* Prepare merges
* Equip or unequip items and artifacts
* Temporarily hold units before deployment

Heroes on the bench are inactive and do not participate in combat.

## 4.5 Bench Capacity & Overflow Rules

* The bench has a **fixed capacity** of 14 slots.
* The player **cannot recruit additional heroes** if the bench is full.

Items, artifacts, and other non-hero objects follow different rules:

* These objects may be obtained even if the bench is full.
* When no free bench slot is available, they are placed into a **hidden overflow storage**.
* As soon as a valid free slot becomes available, overflow objects are automatically transferred to the bench.

Overflow storage is not directly interactable by the player.

## 4.6 Equipment Interaction Rules

* Items and artifacts may be equipped or unequipped:
  + On heroes placed on the battlefield
  + On heroes stored on the bench
* Equipment changes are allowed **only during preparation phases**
* Equipment is fully locked once combat begins

## 4.7 Positioning Importance

Positioning is a **critical strategic layer** in Strifeborn.

Placement decisions directly affect:

* Initial targeting
* Access to backline units
* Survivability of fragile carries
* Effectiveness of flanking, jumping, or assassination mechanics

Frontline and backline distinctions are essential, and many hero abilities explicitly interact with board position.

Poor positioning is expected to be a primary cause of failure, even in otherwise strong compositions.

## 4.8 Readability & Spatial Clarity

The board layout, zones, and unit placement rules are designed to ensure:

* Clear visual separation between sides
* Immediate understanding of threat directions
* Readable engagement flow from first contact to resolution

Spatial clarity takes precedence over decorative complexity.


# Combat Resolution System

## 5.1 Combat Model Overview

Combat in Strifeborn is resolved in **real time** using a **tick-based simulation model**.

Once combat begins:

* All player input affecting combat is disabled
* The battlefield state is locked
* The simulation progresses autonomously until resolution

Combat exists to validate pre-combat decisions and must remain **readable, consistent, and structurally deterministic**, even when bounded randomness is involved.

## 5.2 Visible vs Hidden Stats

Strifeborn clearly distinguishes between **player-facing stats** and **internal combat modifiers**.

### 5.2.1 Visible Stats

The following stats are always visible to the player and form the core of combat readability:

* Strength
* Wisdom
* Health
* Physical Defense
* Spell Defense
* Mana
  + Starting Mana
  + Maximum Mana
* Attack Speed
* Movement Speed
* Range
* Critical Chance
* Critical Damage
* Dodge
* Lifesteal

These stats may be modified by heroes, items, synergies, blessings, and status effects.

### 5.2.2 Hidden / Advanced Stats

The following stats exist internally and are not directly exposed, or are only visible through deep inspection:

* Damage Amplification
* Damage Reduction
* Healing Amplification
* Shielding Amplification
* Counter
* Reflect

Derived values such as **damage reduction percentages** are not shown directly to the player.

### 5.2.3 Targeting Transparency

Strifeborn does **not** use hidden targeting weights, threat values, or aggro tables.

All targeting behavior must be:

* Rule-based
* Positionally explainable
* Explicitly defined by abilities or mechanics

## 5.3 Damage Types

Strifeborn supports three damage types:

* **Physical Damage**  
  Reduced by Physical Defense.
* **Spell Damage**  
  Reduced by Spell Defense.
* **Pure Damage**  
  Ignores all defenses and damage reduction.

Damage type conversion is **never implicit** and may only occur through:

* Items
* Spells
* Blessings
* Explicit hero abilities

## 5.4 Hit Resolution Pipeline

All damaging effects follow a strict, universal resolution order:

1. **Target Validation**  
   Confirms the target is alive and valid at the moment of resolution.
2. **Dodge Check**  
   Determines whether the attack or effect is fully avoided.
3. **Critical Hit Check**  
   Determines whether the damage instance is a critical hit.
4. **Base Damage Calculation**  
   Calculates damage using the source’s stats and modifiers.
5. **Defense Mitigation**  
   Applies Physical or Spell Defense-based damage reduction.
6. **Final Damage Application**  
   Applies damage to the target’s shield first then health.
7. **On-Hit Effects**  
   Triggers effects tied to successful damage application.

Each damage instance is resolved independently.

## 5.5 Critical Hit & Dodge Rules

### 5.5.1 Critical Hits

* Critical hits are rolled **per damage instance**
* Damage-over-time effects **can critically hit**
* Critical hits apply a **damage multiplier**

**Base Critical Damage multiplier:**

* **150%** of normal damage

Critical damage may be increased by effects but remains multiplicative.

### 5.5.2 Dodge

* Dodge is a **full avoid**
* A dodged damage instance deals no damage and triggers no on-hit effects
* Critical hits **can be dodged**
* A dodged hit cannot critically strike

## 5.6 Defense to Damage Reduction

Physical and Spell Defense are converted into **Damage Reduction percentages** using the same formula:

Damage Reduction (%) = 100 × DEF / (500 + DEF)

* Damage Reduction is capped at **80%**
* The resulting DR% is an **internal value** and is not directly shown to the player
* Physical Defense applies only to Physical Damage
* Spell Defense applies only to Spell Damage

Pure Damage bypasses all defenses and damage reduction.

## 5.7 Overdrive Scaling Rules

To prevent combat stagnation, Strifeborn features an **Overdrive system**.

### 5.7.1 Overdrive Timing

* Overdrive begins **30 seconds** after combat start
* Each Overdrive stage lasts **5 seconds**
* Combat speed is increased by **×2** during Overdrive

### 5.7.2 Overdrive Effects

Each successive Overdrive stage applies the following global modifiers:

|  |  |  |
| --- | --- | --- |
| Overdrive Stage | Damage Multiplier | Healing & Shielding Reduction |
| Overdrive I | ×2 | −33% |
| Overdrive II | ×3 | −66% |
| Overdrive III | ×4 | −100% |

Overdrive effects:

* Apply to both sides equally
* Stack progressively
* Cannot be prevented or removed

## 5.8 Death & On-Death Resolution

When a unit’s health reaches zero:

* The unit is **removed immediately** from the battlefield
* The unit does not complete its current action
* All **on-death effects trigger instantly** at the moment of death

On-death effects resolve within the same simulation tick.

## 5.9 Mana System

### 5.9.1 System Overview

Mana is a **global combat resource** used to regulate the timing and frequency of spells.

The Mana system is:

* Deterministic in structure
* Tick-based in resolution
* Shared across heroes, enemies, items, and blessings

Mana governs **when** spells occur, not **how** they resolve.

### 5.9.2 Mana Stats

Each unit has the following Mana-related stats:

* **Maximum Mana**  
  Defines the amount of mana required to cast a spell.
* **Starting Mana**  
  The initial mana value at combat start.  
  Always defined as a **percentage of Maximum Mana**.

Allowed starting mana values are:

* 0%
* 25%
* 50%
* 75%
* 100%

Starting Mana is **hero-defined** and may be modified by effects.

### 5.9.3 Mana Generation Sources

Mana can be generated through multiple sources:

* **Basic Attack Hits**  
  Mana is gained when a Basic Attack successfully hits a target.
* **Damage Taken**  
  Units gain mana when receiving damage.
* **Effects**  
  Mana may be generated through:
  + Abilities
  + Items
  + Blessings
  + Status effects

Mana gain is applied during combat ticks and respects all timing rules of the simulation.

### 5.9.4 Spell Casting Rule

Spells follow a strict casting condition:

**A spell is cast automatically when Mana reaches or exceeds 100% of Maximum Mana.**

Additional rules:

* Spell casting does **not** require the target to be in range
* Spell execution is handled entirely by the spell’s own targeting and logic
* No manual activation exists

This guarantees:

* Predictable spell timing
* No deadlock caused by positioning or targeting edge cases

### 5.9.5 Mana Overflow

Mana overflow is **explicitly supported**.

* When a spell is cast:
  + Mana is reduced by the spell’s cost (normally Max Mana)
  + Any excess mana beyond the cost is **retained**
* After casting:
  + Mana is set to the overflow value, not forced to zero

Example:

* Max Mana: 100
* Current Mana: 130
* Spell is cast
* Remaining Mana after cast: 30

This allows:

* Smooth scaling with high mana generation
* Synergies that reward mana investment
* Reduced “wasted mana” frustration

### 5.9.6 Passive Spells & Mana

Heroes with a **Passive Spell** follow a strict mana override rule:

* **Maximum Mana is always 0**
* Maximum Mana **cannot be increased, reduced, or modified** by any effect
* Starting Mana is implicitly 0

As a result:

* Passive Spells do **not consume mana**
* Passive Spells do **not trigger mana-based casting logic**
* Mana overflow logic does not apply

Mana-related effects:

* May still exist on the hero (for consistency of systems)
* Have **no effect unless explicitly stated otherwise**
* Cannot enable mana-based spell casting on a Passive Spell hero

Passive Spells:

* Occupy the Spell slot structurally
* Are treated as spells for synergies, items, and blessings
* Do not break or bypass the global mana system

### 5.9.7 Simultaneous Spell Resolution

If multiple spells reach their casting condition during the same tick:

* All eligible spells are triggered **simultaneously**
* No priority or ordering is applied unless explicitly defined by an effect

This preserves:

* Fairness
* Predictability
* Consistency with the tick-based simulation model

### 5.9.8 Determinism & Constraints

The Mana system enforces the following constraints:

* No manual intervention
* No hidden priority queues
* No implicit cooldowns outside mana
* No mana-based soft locks

All mana interactions must be:

* Explicit
* Rule-based
* Traceable through combat logs

## 5.10 Determinism & Reproducibility

While combat includes bounded randomness, the simulation model is designed to be:

* Structurally deterministic
* Fully reproducible when seeded
* Independent from visual framerate

This ensures consistency for balance, debugging, and telemetry.


# Status Effect System

## 6.1 System Overview

Status effects in Strifeborn are **temporary rule modifiers** applied to units during combat.  
They alter stats, behavior, or available actions and are a core vector for tactical depth.

The system is designed to:

* Remain readable under heavy effect usage
* Preserve deterministic resolution
* Prevent permanent control-lock scenarios

## 6.2 Status Effect Categories

Status effects are grouped into high-level categories based on their impact:

* **Buffs**  
  Positive effects that enhance a unit’s capabilities.
* **Debuffs**  
  Negative effects that reduce effectiveness or survivability.
* **Hard Crowd Control (Hard CC)**  
  Effects that directly restrict or override a unit’s ability to act or move.

This section defines **system behavior only**.  
The exhaustive list of effects is defined elsewhere.

## 6.3 Application, Refresh & Stacking Rules

### 6.3.1 Default Behavior

By default:

* **All status effects refresh their duration when reapplied**
* Reapplying an effect resets its remaining duration to its full value

If no additional rule is specified, the effect **does not stack beyond refresh**.

### 6.3.2 Stacking Behavior

When an effect is defined as stackable:

* Each application **adds its effect value**
* Stacking always increases **intensity**
* Multiple applications may coexist simultaneously

There is **no conceptual distinction** between:

* Stack count
* Stack intensity

Both are treated as a direct accumulation of the effect’s defined value.

If an effect does not explicitly state that it stacks, it **only refreshes**.

## 6.4 Hard Crowd Control

Hard Crowd Control effects directly restrict core actions.

The following effects are classified as **Hard CC**:

* **Stun**  
  The unit cannot act for the duration.
* **Silence**  
  The unit cannot cast spells for the duration.
* **Taunt**  
  The unit is forced to target the taunting source **if the source is within the taunt zone**, even if normal targeting rules or range would not allow it.
* **Root**  
  The unit cannot move but may still act.
* **Slow**  
  Reduces movement speed for the duration.

Hard CC effects:

* Refresh by default
* Do not stack unless explicitly defined
* Have the highest priority for readability and resistance checks

## 6.5 Resolution Timing

Status effects are evaluated:

* On application
* On each simulation tick
* On expiration

All stat or behavior changes caused by status effects are applied **before** any relevant action check during the same tick.

## 6.6 Immunities & Resistance Rules

### 6.6.1 Boss Units

Bosses follow a dual-rule resistance model:

* **Fully immune to all Hard Crowd Control effects**
* **All non-Hard CC effects are 50% less effective**

Effectiveness reduction applies to:

* Duration
* Effect power (depending on how the effect is defined)

Hard CC effects applied to bosses fail entirely.

### 6.6.2 Elite Units

Elite enemies follow a different resistance model:

* **Hard Crowd Control effects are 50% less effective**
  + Duration reduced by 50%
  + Effect power reduced by 50%, where applicable
* **Non-Hard CC effects apply at 100% effectiveness**

Elites are never fully immune unless explicitly stated.

### 6.6.3 Normal Units

Normal enemies and heroes receive:

* Full Hard CC effects
* Full non-Hard CC effects

Unless modified by abilities, items, or blessings.

## 6.7 Visibility & UX Rules

* Active status effects must be visually represented on units
* Hard CC effects must always be clearly visible
* When multiple effects are active:
  + Effects may be grouped or collapsed
  + Hard CC effects take visual priority

Derived or internal modifiers (e.g. hidden damage reduction changes) are not directly exposed.

## 6.8 Design Constraints

All status effects must respect the following constraints:

* No permanent control loops
* No implicit infinite stacking
* Clear cause-and-effect attribution
* Predictable interaction with bosses and elites

Any effect that violates these constraints requires explicit justification.


# Wave & Difficulty Composition

This section defines how enemies are assembled into waves, how difficulty progresses, and how randomness is constrained to preserve readability and fairness.

Wave composition exists to **test preparation and adaptation**, not to surprise or invalidate the player.

## 9.1 Design Goals

Wave composition in Strifeborn is designed to be:

* **Readable** — the player can fully inspect upcoming threats
* **Semi-deterministic** — structure is predictable, variation is contextual
* **Scalable** — difficulty increases without relying solely on enemy count
* **Fair** — progression is consistent and learnable

## 9.2 Hybrid Composition Model

Each wave is generated using a **hybrid model** combining predefined structure with controlled randomness.

For every wave:

* A **pool of eligible enemies** is defined
* A **difficulty budget** is allocated
* Enemies are selected and configured to fit within that budget

The enemy pool is determined by:

* Run difficulty
* Act and wave index
* Encounter type (normal, swarm, elite, boss)

## 9.3 Difficulty Budget

Each wave has a **difficulty budget** that defines how strong the encounter can be.

The budget is influenced by:

* Selected run difficulty
* Progression stage within the run (act and wave index)

The difficulty budget is spent on:

* Enemy tier level
* Enemy count
* Enemy stat scaling
* Modifiers (elite traits, corruption, items, special behaviors)

Enemy category (swarm / normal / elite / boss) determines **which enemy pool is used**, not how the budget is spent.

Player win/loss history does **not** directly affect the difficulty budget.

## 9.4 Tier Progression Rules

Enemy tier progression follows strict, monotonic rules.

**Tier Consistency Rule**

Within a single wave:

**All enemies always share the same tier level.**

**Tier Progression Rule**

Across waves:

**Wave N can only contain enemies of the same tier or a higher tier than Wave N−1.**

Enemy tiers never decrease during a run.

**Act-Based Tier Increase**

As a general rule:

* Each new **Act increases enemy tier by +1**

This structure:

* Creates predictable power growth
* Establishes clear difficulty milestones
* Enables strong scaling-based challenge

**Run Difficulty via Starting Tier**

Different run difficulties are primarily defined by the **starting tier of enemies in Wave 1**.

This allows:

* Multiple difficulty levels without changing wave structure
* Clean scaling across modes
* Easier balance tuning and iteration

## 9.5 Semi-Random Selection Rules

Wave generation follows semi-random logic:

* Enemies are randomly selected from the eligible pool
* Selection is constrained by:
  + Difficulty budget
  + Encounter role diversity
  + Wave type expectations

Randomness is used to:

* Prevent repetition
* Encourage adaptation

It is never used to:

* Create unwinnable scenarios
* Hide critical threats

## 9.6 Modifiers & Enhancements

Waves may include additional difficulty modifiers, such as:

* Elite variants
* Corrupted enemies
* Enemies equipped with items
* Enhanced ability behaviors

Modifiers:

* Consume part of the difficulty budget
* Are always visible to the player
* Must have clear mechanical impact

## 9.7 Loss Mitigation & Retry Logic

In all modes **except PvP**, wave failure triggers a recovery mechanism.

* The **same wave is replayed**
* Enemy composition and tier remain unchanged
* The player receives a **small compensatory reward** before retrying

This system:

* Preserves encounter integrity
* Prevents difficulty dilution
* Encourages strategic adjustment rather than brute-force retries

The exact reward type is defined in the Economy section.

## 9.8 PvP Exception

In PvP modes:

* Loss mitigation does **not** apply
* Encounters are resolved as player-versus-player battles
* No compensatory rewards are granted on loss

This preserves competitive fairness.

## 9.9 Readability & Preview Rules

Before starting a wave, the player can fully inspect:

* Enemy units
* Enemy count
* Enemy tier
* Elite or boss presence
* All modifiers and special behaviors

No hidden information exists once the preparation phase begins.

Readability takes precedence over surprise.

## 9.10 Design Constraints

Wave composition must respect the following constraints:

* No mixed-tier waves
* No backward tier progression
* No hidden difficulty modifiers
* No reliance on hidden synergy-like interactions

Waves are designed to **validate player preparation**, not to punish incomplete information.


# In-Run Economy

This section defines the **run economy** of Strifeborn.  
During a run, **Gold is the only economic resource**.

The economy is designed to be:

* Deterministic and transparent
* Strategically expressive
* Neutral in PvE
* Resistant to snowballing in PvP

## 10.1 Design Philosophy

Gold exists to create **meaningful trade-offs**.

Every Gold decision forces the player to choose between:

* Immediate power
* Long-term scaling
* Flexibility vs commitment

The economy does not rely on randomness, hidden modifiers, or parallel currencies.

## 10.2 Run-Only Currency

**Gold**

* Gold is the **only currency used during a run**
* Gold is fully reset at the end of a run
* All other resources exist only outside of runs and are defined elsewhere

Gold is used to:

* Recruit heroes
* Reroll the shop
* Purchase items and artifacts
* Increase deployment capacity
* Reshape the team over time

## 10.3 Gold Income Sources

Gold can be gained through the following sources:

### 10.3.1 End-of-Wave Rewards

At the end of each wave, the player gains Gold.

* **Win:** full reward
* **Loss:** **50% of the reward**

The base reward depends on:

* Act index
* Wave index
* Wave type (normal, swarm, elite, boss)

### 10.3.2 Selling

The player gains Gold immediately and irreversibly by selling:

* Heroes
* Items
* Artifacts

Selling is always a valid economic recovery tool.

### 10.3.3 Blessings & Effects

Blessings and effects may:

* Increase Gold income
* Modify existing Gold gains
* Change *when* Gold is awarded

Blessings and effects:

* **Never introduce alternative currencies**
* **Never create parallel Gold sources**

Gold remains the **single and unique run currency** at all times.

### 10.3.4 Gold Bracket Scaling

Gold income increases based on the **amount of Gold currently owned**.

* Income increases at predefined **Gold ownership thresholds**
* Each threshold grants an **additional bonus**
* The system has a **maximum cap**, after which income no longer increases

This system:

* Rewards good economic management
* Encourages saving up to a point
* Prevents infinite scaling

All thresholds and bonuses are fully visible to the player.

### 10.3.5 PvP Streak System (PvP Only)

In PvP modes, Gold income may be modified by streaks.

**Streak Rules**

* **Win streaks** and **loss streaks** both exist
* Both streak types grant the **same base amount of Gold**
* A streak increases only when the same result repeats
* Breaking a streak (win after losses or loss after wins) **resets the streak to 0**

This system intentionally pushes players to:

* Commit to winning
* Or consciously lean into losing for a recovery window

**Loss Streak Non-Gold Rewards**

In addition to Gold, **loss streaks grant non-Gold rewards**, such as:

* Free shop rerolls
* Improved shop quality
* Temporary reductions on specific Gold costs
* Other utility-based advantages

These rewards:

* Do **not** grant immediate raw power
* Help convert a loss streak into a comeback opportunity
* Preserve competitive integrity

The exact rewards are defined elsewhere and are fully visible.

## 10.4 Gold Sinks

Gold can be spent in the following ways:

### 10.4.1 Recruiting Heroes

* Heroes can be purchased from the shop using Gold
* Purchased heroes are added to the bench if space is available
* Recruiting is irreversible

### 10.4.2 Shop Rerolls

* The shop can be rerolled using Gold
* Rerolls refresh available heroes, items, and artifacts
* Reroll costs are deterministic and visible

### 10.4.3 Items & Artifacts

* Items and artifacts can be purchased using Gold
* Equip rules and limits are defined in their respective sections

### 10.4.4 Deployment Capacity

* Gold may be spent to increase the **deployment cap**
* Deployment rules and limits are defined in **Section 3**
* Increasing deployment capacity does not deploy heroes automatically

## 10.5 PvE vs PvP Economy Rules

### 10.5.1 PvE Economy

In PvE modes:

* Economy is **fully deterministic**
* No elastic correction is applied
* Failure does not reduce future Gold income
* Recovery comes from planning and decision-making

### 10.5.2 PvP Economy

In PvP modes:

* The same base economy applies
* Additional systems exist to prevent runaway snowballing:
  + Symmetric streak Gold
  + Utility-based loss streak rewards

PvP economy rewards:

* Strategic commitment
* Risk assessment
* Long-term planning

## 10.6 Transparency Rules

The player must always be able to see:

* All Gold income sources
* All Gold sinks
* Gold bracket thresholds
* Streak status and effects

There are:

* No hidden modifiers
* No opaque calculations
* No surprise penalties

## 10.7 Design Constraints

The economy enforces the following constraints:

* Gold is the only run currency
* All income and costs are explicit
* No mandatory spending paths
* No infinite Gold loops

The economy exists to **enable meaningful decisions**, not to automate success.

## 10.8 Separation of Concerns

This section defines:

* Run economy rules
* Gold flow and constraints

The following are defined elsewhere:

* Out-of-run economy and progression
* Numerical tuning
* UI presentation
* Blessings that interact with streak breaks


# Recruit / Sell / Merge

This section defines how the player recruits heroes, manages the bench, merges units, equips items, and sells assets during a run.

It formalizes the **team construction layer** that connects the economy, deployment rules, and combat systems.

## 11.1 Design Philosophy

Team construction in Strifeborn is designed to be:

* **Deliberate** — decisions are explicit and mostly irreversible
* **Flexible** — multiple valid build paths exist
* **Readable** — all actions have clear outcomes
* **Bounded** — constraints matter and create tension

There is no automation that removes player responsibility.

## 11.2 Shop System

### 11.2.1 Shop Categories

The shop can offer the following categories:

* **Heroes**
* **Items** (includes Hero Relics)
* **Artifacts**
* **Tokens**

Each category is visually and functionally distinct.

### 11.2.2 Shop Offers

At any time, the shop displays:

* **5 Hero offers**
* **5 Item offers**
* **Artifacts / Tokens offers**, ranging from **1 to 5**, depending on the current Act

Shop contents are refreshed by rerolling.

### 11.2.3 Purchasing Rules

* Purchasing consumes Gold immediately
* Purchases cannot be undone
* Purchased heroes are placed on the **bench**
* Purchased items, relics, artifacts, and tokens are placed on the **bench or overflow** (see 11.4)

## 11.3 Bench System

### 11.3.1 Bench Capacity

* The bench contains **14 slots**
* The bench stores:
  + Heroes
  + Items
  + Relics
  + Artifacts

Bench capacity is a **hard constraint** for heroes.

### 11.3.2 Bench Contribution Rules

* Heroes on the bench:
  + Do not participate in combat
  + Do not contribute to synergies
* Only heroes deployed on the battlefield are active

## 11.4 Overflow Rules

An **overflow system** exists to prevent item loss while preserving hero constraints.

### 11.4.1 Overflow Behavior

* **Heroes**:
  + Cannot be purchased if the bench is full
* **Items, relics, artifacts, and tokens**:
  + May be acquired even if the bench is full
  + Are placed into a hidden overflow space

### 11.4.2 Overflow Resolution

* When a bench slot becomes available:
  + Items from overflow are automatically moved to the bench
* Overflow has no hard size limit
* Heroes can never enter overflow

Overflow exists only to protect non-hero assets.

## 11.5 Merging Rules

### 11.5.1 Merge Conditions

Heroes can be merged using the following rule:

**2 identical heroes → next tier hero**

Conditions:

* Heroes must be identical (same hero)
* Tier increases by one step
* Merging is **manual**

### 11.5.2 Items & Merge

* Heroes **can be merged while equipped**
* Equipped items and artifacts persist on the resulting hero
* No items are destroyed by merging

Merge outcomes are always deterministic.

## 11.6 Selling Rules

### 11.6.1 Selling Heroes

When a hero is sold:

* The hero instance is removed permanently
* The hero’s tier is lost
* Equipped items and artifacts are:
  + Returned to the bench
  + Or placed in overflow if the bench is full

Selling:

* Grants Gold immediately
* Cannot be undone

### 11.6.2 Selling Items & Artifacts

* Items, relics, and artifacts can be sold from the bench
* Selling is irreversible
* Tokens cannot be sold unless explicitly stated

### 11.6.3 Timing Rules

* During **preparation phases**:
  + Selling is allowed from anywhere (bench or battlefield)
* Outside preparation:
  + Selling is allowed **only from the bench**

This prevents combat exploitation.

## 11.7 Equipping Rules

* Items, relics, and artifacts can be equipped only during preparation
* Equipped assets must respect equip rules defined elsewhere
* Equipping is locked during combat

## 11.8 Combat Lock Rules

Once combat starts, **the battlefield becomes fully locked**, but the **bench remains interactive**.

### 11.8.1 Battlefield Lock

During combat, the following actions are **not allowed on heroes placed on the battlefield**:

* Repositioning heroes
* Selling heroes
* Merging heroes
* Equipping or unequipping items, relics, or artifacts

Heroes on the battlefield are **fully locked** until combat ends.

### 11.8.2 Bench Interaction During Combat

During combat, the player **may freely interact with the bench**.

The following actions are **allowed**, but **only on bench content**:

* Recruiting heroes
* Selling heroes
* Merging heroes
* Equipping and unequipping items, relics, and artifacts
* Inspecting heroes, items, artifacts, and tokens

These actions:

* Do not affect the ongoing combat
* Prepare the team for the next preparation phase
* Preserve strategic flow without enabling combat manipulation

### 11.8.3 Shop Restrictions

* The shop remains visible during combat
* **Rerolling the shop is not allowed** during combat
* Purchases made during combat follow normal bench and overflow rules

### 11.8.4 Design Rationale

This rule ensures:

* Combat outcomes remain deterministic once started
* Players can use downtime to plan ahead
* No mid-combat exploitation of battlefield state

Only the **battlefield** is locked — **not the player’s decision-making**.

## 11.9 PvP Consistency

All Recruit, Sell & Merge rules apply identically in PvE and PvP modes.

No hidden or mode-specific exceptions exist.

## 11.10 Design Constraints

The Recruit, Sell & Merge system enforces:

* No automatic merges
* No hero overflow
* No reversible purchases
* No combat-time manipulation

Team construction decisions are **intentional and binding**.

## 11.11 Separation of Concerns

This section defines:

* Shop structure
* Bench and overflow rules
* Merge and sell behavior

The following are defined elsewhere:

* Economy tuning
* Item and artifact effects
* Synergy mechanics
* UI presentation



---

> [!info] Related Documents
> - [[synergies]] — Synergy system details and data
> - [[hero_kits]] — All hero kits with stats and abilities
> - [[enemy_compendium]] — Enemy design and roster
> - [[blessing_system]] — Blessing system design
> - [[blessing_kits]] — Blessing data reference
> - [[items_and_artifacts]] — Items, relics and artifacts
> - [[game_modes]] — Game mode specifications
> - [[meta_progression]] — Meta progression and out-of-run systems
> - [[faction_oaths]] — Faction oath data
