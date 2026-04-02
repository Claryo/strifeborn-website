---
title: "Game Modes"
tags: [design, game-modes]
source: "Game Modes Compendium.docx"
last_updated: 2026-03-26
---

# Purpose & Design Philosophy of Game Modes

**1.1 Definition of a Game Mode**

In **Strifeborn**, a **Game Mode** is a **structural wrapper around the core run loop**.

A Game Mode does not redefine how the game systems function.  
Instead, it defines **how the player must approach those systems**.

A Game Mode may alter:

* Whether the run is PvE or PvP
* The number and structure of waves
* The conditions under which a run ends
* The pacing, pressure, and stakes of progression
* The strategic framing of the same core mechanics

A Game Mode is selected **before the run begins** and remains **immutable for the entire duration of the run**.

Once a run starts, the selected Game Mode cannot be changed.

**1.2 Relationship to the Core Run Loop**

All Game Modes in Strifeborn are built on the **same core run loop**:

* Preparation Phase
* Combat Phase (fully autonomous)
* Resolution Phase
* Inter-wave choices
* Progression to the next wave

A Game Mode **never modifies or replaces this loop**.

Instead, it may:

* Change how many times the loop repeats
* Change the conditions under which the loop terminates
* Change how much pressure is applied between iterations
* Change what constitutes success or failure over the course of the run

The integrity of the core loop is non-negotiable.

**1.3 Scope of Allowed Modifications**

Game Modes are allowed to modify **structure, constraints, and context**, but not systems.

**Game Modes MAY modify:**

* Run length (fixed, variable, or endless)
* Wave count and progression structure
* Win and loss conditions
* Difficulty availability ranges
* Reward cadence and distribution
* Time constraints during preparation phases (mode-dependent)
* PvE vs PvP framing
* Multiplayer participation rules

**Game Modes MAY influence difficulty indirectly through:**

* Starting difficulty constraints
* Difficulty scaling curves
* Mode-specific difficulty availability

**1.4 Explicitly Forbidden Modifications**

Game Modes are **not** allowed to alter the fundamental rules of play.

A Game Mode must **never**:

* Modify the core run loop
* Modify combat resolution rules
* Modify damage formulas, mana rules, or Overdrive behavior
* Hide enemy information or mechanics
* Introduce execution-based or reaction-based gameplay
* Change hero kits directly
* Change enemy kits directly outside of **explicit, visible modifiers**
* Introduce hidden rules, hidden scaling, or undocumented behavior

Any exception to these rules must be:

* Explicitly documented
* Global in scope
* Treated as a system-level override, not mode-specific improvisation

**1.5 Game Modes and Difficulty**

Difficulty is a **setting of a Game Mode**, not a global constant.

Key principles:

* Difficulty is selected within the context of a Game Mode
* Not all Game Modes are required to support all difficulties
* Difficulty values between different Game Modes do **not** need to be equivalent
* Difficulty affects **scaling only**, never structure or rules

Higher difficulty:

* Increases enemy scaling
* Reduces tolerance for misplay
* Tightens margins for error

Higher difficulty does **not**:

* Change how the mode functions
* Introduce new mechanics
* Alter rules or information availability

**1.6 Time Pressure & Player Agency**

Time pressure is a **design tool**, not a defining pillar of Game Modes.

**Time Rules by Mode Type**

* **PvE Single-Player Modes**
  + No preparation time limits
  + Player may take unlimited time to inspect, plan, and adjust
* **PvP and PvE Multiplayer Modes**
  + Preparation phases are time-limited
  + Time limits exist to preserve run integrity and prevent blocking
  + Combat remains fully autonomous once started

Time pressure is never used to:

* Force execution skill
* Reduce information availability
* Create reaction-based decision making

**1.7 Run Termination & Failure Conditions**

Game Modes define **how a run can end**, not how combat resolves.

Depending on the mode, a run may end:

* Only when the player loses all lives
* When all predefined waves are completed
* When a final objective is achieved
* Through other explicitly defined structural endpoints

Failure conditions are always:

* Fully documented
* Visible to the player
* Known before the run begins

No Game Mode introduces hidden or sudden loss conditions.

**1.8 Player Fantasy & Mode Diversity**

Game Modes are not required to appeal equally to all players.

Each mode exists to emphasize different aspects of mastery, such as:

* Long-term planning
* Adaptation under constraints
* Risk management
* Comparative optimization
* Systemic depth and scaling literacy

Players are free to approach any mode with their own preferred mindset.  
The mode defines **constraints**, not behavior.

Preference divergence between modes is intentional and healthy.

**1.9 Design Guardrails (Hard Rules)**

The following rules apply to **all current and future Game Modes**:

* No mode hides information
* No mode alters the core run loop
* No mode modifies combat rules
* No mode introduces player input during combat
* No mode bypasses difficulty commitment
* No mode relies on surprise, obscurity, or unreadable behavior

Game Modes exist to **reframe decision-making**, not to invalidate it.

**1.10 Role of This Compendium**

The Game Modes Compendium serves as:

* A **design contract** for all current and future modes
* A **reference document** for implementation and balance
* A **player-facing source** for clarity and expectations

All future Game Modes must conform to the principles defined here.  
If a proposed mode violates this section, it is invalid by default.

# Global Mode Taxonomy & Shared Rules

**2.1 Purpose of the Mode Taxonomy**

The Mode Taxonomy defines the **global classification system** for all Game Modes in Strifeborn.

Its role is to:

* Establish a stable set of **mode categories**
* Define **shared rules** inherited by all modes within those categories
* Prevent rule drift, duplication, or contradiction between modes
* Serve as a validation framework for all future Game Mode designs

Every Game Mode must be fully describable using this taxonomy.  
If a proposed mode cannot be classified within it, the mode is invalid by default.

**2.2 Classification Axes**

Each Game Mode is defined by selecting **exactly one value per axis**.

Hybrid values are not allowed unless explicitly stated.

**2.2.1 Participation Model**

Defines how many players are involved and how they interact.

Allowed values:

* **Single-Player**  
  One player engages with the system alone.
* **Multiplayer (Synchronous)**  
  Multiple players participate in the same run or match simultaneously.

Asynchronous participation (e.g. raid-style content) is considered a **Multiplayer variant**, not a separate category.

Each Game Mode must use exactly one Participation Model.

**2.2.2 Opposition Model**

Defines who or what the player is facing.

Allowed values:

* **PvE**  
  The player faces system-generated enemies only.
* **PvP**  
  The primary opponent is another player or team of players.
* **Cooperative PvE**  
  Multiple players cooperate against system-generated enemies.

A Game Mode may include **special waves** that differ from its primary opposition model  
(e.g. PvP modes with PvE waves), but the mode’s **core identity** must remain consistent.

**2.2.3 Run Structure**

Defines how progression unfolds over time.

Allowed values:

* **Fixed-Length**  
  The run has a predefined number of waves or stages.
* **Endless**  
  The run continues indefinitely until failure.
* **Score-Based**  
  Performance is measured over a constrained duration or wave count.
* **Campaign / Chapter-Based**  
  The run is divided into authored segments with defined endpoints.

Run structure is selected at run start and **cannot change mid-run**.

**2.2.4 Competitive Context**

Defines the social and progression context of the mode.

Allowed values:

* **Non-Competitive**
* **Ranked / Ladder**
* **Tournament / Event-Based**

Private, custom, and spectator-focused modes are not supported at this time.

Competitive context affects:

* Matchmaking
* Ranking and visibility
* Reward interpretation

It does **not** alter core gameplay rules.

**2.3 Shared Rules by Category**

The following rules are **inherited automatically** based on taxonomy classification.

**2.3.1 Single-Player Modes**

Global rules:

* Preparation phases have **no time limit**
* The player may inspect freely and indefinitely
* No anti-blocking logic is required
* Failure mitigation and retry logic may be applied if defined by the mode

**2.3.2 Multiplayer Modes (PvE & PvP)**

Global rules:

* Preparation phases are **always time-limited**
* When a timer expires, unresolved player choices are resolved **randomly**
* This rule exists solely to prevent run blocking
* Combat remains fully autonomous once started

Multiplayer modes do not pause or wait indefinitely for inactive players.

**2.3.3 PvE Modes**

Global rules:

* Enemies are system-generated
* Difficulty scaling follows PvE balance curves
* Retry is allowed only after full run resolution (win or loss)
* Loss mitigation systems are **not allowed**

**2.3.4 PvP Modes**

Global rules:

* The primary opponent is another player or team
* No loss mitigation systems exist
* No retries within an ongoing run or match
* Competitive integrity takes precedence over comfort systems

**2.3.5 Cooperative PvE Modes**

Global rules:

* All players share success and failure conditions
* Anti-blocking rules apply identically to other multiplayer modes
* Reward distribution may be cooperative or individual, as defined by the mode

**2.4 Time & Anti-Blocking Rules**

Time pressure is not a difficulty axis, but a **structural safeguard**.

* Single-player modes never impose preparation timers
* Multiplayer modes always impose preparation timers
* Timers never reduce available information
* Timers never introduce execution-based decision making

If a player is inactive:

* Choices are resolved randomly
* The run proceeds without interruption

No penalties, kicks, or AI takeovers are applied at this level.

**2.5 Failure, Termination & Retry Rules**

**2.5.1 Failure Models**

Game Modes may use:

* Life-based failure
* Time-expiration failure
* Other explicitly defined failure conditions

A Game Mode must define **exactly one primary failure model**.

**2.5.2 Retry Rules**

* A run may only be retried **after it fully ends** (win or loss)
* Partial retries, checkpoints, or mid-run resets are not allowed
* PvP modes never allow retries

Retry availability is a **mode-level property**, constrained by this section.

**2.6 Rewards & Progression Authority**

Reward logic follows a strict separation of concerns:

* **Game Mode** defines:
  + Reward types
  + Reward cadence
  + Progression relevance
* **Difficulty** defines:
  + Reward quantity
  + Scaling magnitude

Modes may differ significantly in rewards, but are not required to.

Meta-progression interaction is mode-dependent and must be explicitly stated.

**2.7 Information & Transparency Guarantees**

All Game Modes inherit the following hard rules:

* Enemy inspection is always available
* Wave preview is always available
* Modifiers and special rules are always visible
* No information is hidden after preparation begins

No Game Mode may override these guarantees.

**2.8 Inheritance & Override Rules**

Game Modes inherit rules in a strict hierarchy:

**Core Run Loop → Taxonomy Rules → Mode-Specific Rules**

* Taxonomy rules apply automatically
* Mode-specific rules may only add constraints
* Overrides are allowed **only if explicitly documented**
* Overrides must never violate the core run loop

**2.9 Future Compatibility**

This taxonomy defines the **complete allowed design space** for Game Modes at this stage of development.

Experimental, limited-time, or non-canonical modes are not defined here yet and must be introduced explicitly if added later.

**2.10 Design Summary**

The Mode Taxonomy exists to ensure that:

* Game Modes remain coherent over time
* New modes can be validated immediately
* Structural decisions are explicit, not implicit
* The player experience remains predictable and readable

Game Modes change **how the game is approached**,  
never **how the game works**.

# Campaign Mode — *The Chorus Beyond*

**3.1 Mode Identity & Purpose**

**The Chorus Beyond** is the primary **PvE Campaign mode** of *Strifeborn*.

It serves two core purposes:

1. **Narrative Function**  
   The Campaign tells the story of the fractured world through the perspective of each faction, chronicling the appearance of the Chorus Beyond and how each Path interprets, confronts, or assimilates its presence.
2. **System Mastery Environment**  
   The Campaign is the definitive PvE space for learning, testing, and mastering **all core mechanics** of Strifeborn under fully readable, rule-consistent conditions.

The Campaign does not simplify systems.  
It contextualizes them.

**3.2 Taxonomy Classification**

The Chorus Beyond is defined by the following taxonomy values:

* **Participation Model:** Single-Player
* **Opposition Model:** PvE
* **Run Structure:** Fixed-Length
* **Competitive Context:** Non-Competitive

All global rules inherited from these categories apply automatically.

**3.3 Narrative Structure Overview**

The Campaign is structured around **Faction Chapters**.

* Each faction has **5 Chapters**
* Each Chapter represents a distinct narrative phase
* Each Chapter is completed through a full Campaign run
* Each Chapter culminates in a unique boss encounter

Chapters are:

* Linear
* Non-branching
* Designed to gradually escalate narrative and systemic complexity

**3.4 Run Structure (Enforced)**

Each Campaign run follows a strict, immutable structure.

**3.4.1 Acts & Waves**

* **5 Acts**
* **5 Waves per Act**
* **Total: 25 Waves**

Wave pattern per Act:

1. Normal Wave
2. Normal Wave
3. Swarm Wave
4. Normal Wave
5. Elite Wave

In **Act V**, the Elite Wave is replaced by a **Boss Wave** at Wave 25.

Acts are **purely structural** and do not alter rules, themes, or systems.

**3.5 Difficulty Binding & Progression**

**3.5.1 Available Difficulties**

Campaign supports all five difficulties:

* Dissonance
* Whisper
* Fracture
* Dominance
* Ascendency

**3.5.2 Unlock Rules**

* Completing **Difficulty X** unlocks **Difficulty X+1**
* Completing **Chapter X (any difficulty)** unlocks **Chapter X+1**

These progression tracks are independent and cumulative.

**3.5.3 Difficulty Scaling Rule**

In Campaign mode:

**Difficulty X ⇒ Wave 1 enemies start at Tier X**

Enemy tiers then progress according to the global wave and act rules.

Difficulty affects **scaling only**:

* Enemy tier
* Stat scaling
* Reward magnitude

Difficulty never alters:

* Chapter rules
* Boss mechanics
* Narrative structure
* Chorus Beyond encounter behavior

**3.6 Win, Loss & Retry Conditions**

**3.6.1 Victory**

A Campaign run is won when:

* **All 25 waves are cleared**

**3.6.2 Failure**

A Campaign run is lost when:

* The player accumulates **5 total wave losses**

On wave loss:

* One life is consumed
* The same wave is replayed
* Enemy composition and tier remain unchanged
* A small compensatory reward is granted

If a wave is lost while at **1 remaining life**, the run ends immediately.

**3.6.3 Run Retry**

When a run ends (victory or defeat):

* The player may retry the Campaign
* Retrying always restarts from **Wave 1**
* No checkpoints exist

**3.7 Time, Agency & Transparency**

Campaign mode enforces:

* **Unlimited preparation time**
* Full inspection of enemies, modifiers, and waves
* Manual combat start only

No timers, automation, or hidden information exist.

**3.8 Guaranteed Inter-Wave Systems**

Campaign strictly enforces all guaranteed systems:

* **After Swarm Waves:** Blessing selection
* **After Elite Waves:** Shop access

No Campaign-specific restrictions currently apply.

**3.9 Team Growth Enforcement**

Campaign enforces all global team growth rules:

* Initial team size: 5
* Maximum team size: 9
* Team size increases at Waves:
  + 2
  + 4
  + 7
  + 9

No Campaign-specific recruitment constraints exist.

**3.10 Optional Post-Run Encounter — *The Chorus Beyond***

After defeating the Chapter boss, the player is offered an **optional encounter** against **The Chorus Beyond**.

**3.10.1 Mechanical Definition**

This encounter is **not a combat challenge**, but a **performance evaluation**.

* Single target: *The Chorus Beyond*
* Properties:
  + Invincible
  + Does not attack
  + Does not interact with the player’s team
* Encounter duration:
  + Fixed and time-limited
* Objective:
  + Deal as much damage as possible within the time limit
* Outcome:
  + No victory or defeat
  + No lives consumed
  + No impact on Campaign completion

The encounter exists solely to measure **total DPS output**.

**3.10.2 Asynchronous Performance Benchmarking**

* DPS results are recorded
* Results are ranked asynchronously against other players
* Rankings reset **weekly**
* Weekly rewards are distributed based on relative performance

This system:

* Does not affect the Campaign run
* Does not influence progression
* Does not alter Campaign’s non-competitive nature

It exists as a **meta-performance lens**, not as PvP.

**3.11 Rewards & Progression**

**3.11.1 Reward Authority**

* **Campaign mode** defines reward types
* **Chapter and Difficulty** define reward magnitude

Reward types are known **before starting the run**.

**3.11.2 Reward Types**

Depending on Chapter and difficulty, Campaign may grant:

* Meta currencies
* Hero unlocks
* Codex / lore entries
* Relic materials
* Cosmetic rewards
* Persistent progression resources

**3.11.3 Completion Rewards**

* Completing a Chapter always grants the same base reward
* First-time Chapter completion may grant **one-time unlocks**
* These one-time rewards are treated as achievement-style rewards

**3.12 Chapter System (Structural Specification)**

This section defines the **Chapter system** used by the Campaign mode *The Chorus Beyond*.  
It specifies **structural rules, invariants, and narrative constraints** that all Campaign Chapters must obey.

This section does **not** contain story content.  
Narrative material is defined in a separate compendium.

**3.12.1 Definition of a Chapter**

A **Chapter** is a canonical narrative and structural unit of the Campaign.

Each Chapter:

* Represents a **faction-specific interpretation** of the Chorus Beyond
* Wraps **exactly one Campaign run**
* Is independent from difficulty
* Advances the faction’s narrative state irreversibly

**Invariant:**

One Chapter always corresponds to one complete 25-wave Campaign run.

**3.12.2 Chapter Cardinality & Ordering**

* Each faction has **exactly five Chapters**
* Chapters are indexed **I to V**
* Chapter order is **fixed and linear**
* Chapter *N+1* assumes Chapter *N* has been completed

Chapters may be replayed after unlock, but replay never alters canon.

**3.12.3 Mandatory Chapter Content**

Every Chapter must define the following narrative fields.

All content is **text-only by default**, but the structure is designed to support future voice or cinematic presentation without modification.

**a) Intro Text (Pre-Run)**

Displayed before the Campaign run begins.

Purpose:

* Establish the current state of the world
* Frame the faction’s mindset
* Introduce the current stage of Chorus influence

**b) Chorus Presence Description**

Explicitly describes:

* How the Chorus Beyond manifests in this Chapter
* How its influence has escalated since the previous Chapter

This field is mandatory and must reflect **monotonic escalation**.

**c) Faction State Description**

Describes:

* What changed within the faction since the previous Chapter
* Shifts in doctrine, belief, structure, or identity
* The internal consequences of Chorus exposure

**d) Outro Text (Post-Run)**

Displayed **only on first successful completion** of the Chapter.

Purpose:

* Resolve the Chapter’s narrative beat
* Reflect on the defeat of the Chapter boss
* Transition toward the next Chapter

**3.12.4 Chorus Corruption Curve**

Chorus influence follows a strict progression.

* Each Chapter represents a **strict increase** in Chorus influence
* Corruption may change form, but never regress
* No Chapter may depict stabilization or reversal

**Resolution Constraint (Chapter V)**

By Chapter V:

* The Chorus Beyond’s influence must be **resolved**
* Resolution must align with the faction’s Path
* Ambiguity is permitted
* Reversal or denial is not

**3.12.5 Cross-Chapter Continuity Rules**

All Chapters must obey the following continuity constraints:

* Chapter *N+1* must reference the outcome or state of Chapter *N*
* No narrative branching based on:
  + Difficulty
  + Player performance
  + Chorus Beyond DPS ranking
* Narrative progression is **difficulty-agnostic**

The Campaign tells **one canonical story per faction**.

**3.12.6 Boss & Chorus Relationship**

**Chapter Bosses**

Each Chapter boss represents **both**:

* A manifestation of Chorus corruption
* A factional response to that corruption

Bosses are:

* Canonical
* Narrative anchors
* Expressions of the Chapter’s theme

**The Chorus Beyond Encounter (Lore Framing)**

* The Chorus Beyond is a **single, singular entity**
* Each faction contextualizes it differently
* The optional post-run encounter represents:
  + Exerting pressure on the Chorus
  + Measuring the impact of a faction’s Path
  + Testing the limits of systemic expression

The encounter is intentionally ambiguous in canon.

**3.12.7 Canon Status**

* Campaign narrative is **fully canonical**
* Written as:
  + Scripted narrative
  + Novel-style prose
* The world does not acknowledge:
  + Difficulty settings
  + Retries
  + Performance rankings

**3.12.8 Authoring & Implementation**

* Chapter structure is fixed
* Content is **mostly hardcoded**
* Chapters are authored, not procedurally generated

Chapter indices do **not** need to align narratively across factions.

**3.12.9 Summary**

The Chapter system exists to:

* Guarantee narrative coherence
* Enforce corruption escalation
* Prevent structural drift
* Anchor Campaign storytelling to immutable rules

All Campaign lore must comply with this section.

**3.13 Campaign Lore Reference — *The Chorus Beyond***

All narrative content for the Campaign mode is defined in a separate document:

**Campaign Lore Compendium — *The Chorus Beyond***

This compendium contains:

* The global Campaign narrative
* The nature of the Chorus Beyond (as lore)
* All faction-specific story arcs
* Chapter intros, outros, and internal states
* Boss narrative context

**Separation of Concerns**

* **Game Modes Compendium**  
  Defines rules, structure, progression, and constraints.
* **Campaign Lore Compendium**  
  Defines story, themes, and narrative expression.

All lore authored in the Campaign Lore Compendium must conform to the **Chapter System rules** defined in Section 3.12.

---

> [!info] Related Documents
> - [[core_design]] — Core game loop and combat system
> - [[campaign_lore]] — Campaign mode narrative
