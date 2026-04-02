---
title: "Items, Relics & Artifacts"
tags: [design, items, artifacts, relics]
source: "CDC.docx (chapitre 13)"
last_updated: 2026-03-26
---

# Items, Relics & Artifacts

This section defines the itemization system in Strifeborn, including items, artifacts, and hero relics, their structure, equip rules, and constraints.

Itemization exists to:

* Support build expression
* Reinforce hero and composition identity
* Enable synergy-driven strategies

This section defines **systems**, not individual items.

## 13.1 Design Philosophy

Itemization in Strifeborn is intentionally layered:

* **Items** provide incremental, modular power
* **Artifacts** enable or reinforce synergy-based builds
* **Hero Relics** are strong, identity-driven commitments

Each layer serves a different strategic purpose and interacts with heroes, synergies, and economy systems.

## 13.2 Item Categories

Strifeborn uses **three item categories**.

### 13.2.1 Basic Items

Basic items are the foundational tier.

* Provide **a single stat modifier**
* Have **no unique effect**
* Are **stackable**
* Serve as components for advanced items

Basic items are simple, readable, and widely available.

### 13.2.2 Advanced Items

Advanced items are created by **merging two compatible basic items**.

* Provide **two stat modifiers**
* Include **one unique effect**
* Are **stackable**
* Represent a meaningful mid-game power spike

Advanced items retain flexibility while introducing specialization.

### 13.2.3 Hero Relics

Hero Relics are a special item tier.

* Provide **two stat modifiers with higher values**
* Include **one unique, identity-defining effect**
* Are **unique per run**

**Relic Availability & Equip Rules**

* Each hero **defines one unique Hero Relic** tied to their identity
* Having that hero in the player’s team makes the relic **available during the run**
* A Hero Relic:
  + Is **not bound** to its originating hero
  + Can be **equipped by any hero**
  + May exist **only once per run**

Hero Relics allow aspects of a hero’s identity to be transferred or amplified elsewhere in the team.

## 13.3 Artifacts (Definition)

Artifacts are distinct from items.

* Artifacts do **not** grant raw stats
* Artifacts grant **+1 synergy counter** (Faction, Class, or Extra)
* Artifacts enable the equipped hero to benefit from that synergy **if it is active**

Artifacts exist to unlock or reinforce composition paths.

Artifacts:

* Do **not** modify synergy thresholds
* Do **not** grant power outside synergy effects

## 13.4 Equip Slots

* Each hero has **3 total equip slots**
* Item slots and artifact slots are **shared**
* A hero may equip any combination of:
  + Basic items
  + Advanced items
  + Artifacts
  + Hero relics

Equip slot limits enforce meaningful trade-offs.

## 13.5 Stack & Uniqueness Rules

**Items**

* Basic and advanced items are **stackable**
* Identical items may be equipped simultaneously

**Artifacts**

* Artifacts are **unique per hero**
* The same artifact cannot be equipped more than once on the same hero

**Hero Relics**

* Hero Relics are **unique per run**
* Only one instance of a given Hero Relic may exist in a run

## 13.6 Equip Timing Rules

* **Heroes on the battlefield**:
  + Items, artifacts, and relics may be equipped or unequipped **only during preparation**
* **Heroes on the bench**:
  + Items, artifacts, and relics may be equipped or unequipped **at any time**

Equipping is always locked on battlefield heroes during combat.

## 13.7 Item Merge Rules

### 13.7.1 Basic → Advanced Auto-Merge

* When a hero equips **two compatible basic items**:
  + They automatically merge into the corresponding **advanced item**
  + The two basic items are consumed
  + The advanced item occupies **one equip slot**

This merge:

* Is deterministic
* Requires no manual action
* Occurs immediately upon equipping the second basic item

### 13.7.2 Slot Constraints

* If no equip slot is available, the merge cannot occur
* The player must free a slot before equipping the second basic item

## 13.8 Synergy Interaction Rules

* Artifacts grant **+1 synergy counter**
* Artifacts can enable:
  + Faction synergies
  + Class synergies
  + Extra synergies
* Artifacts allow the equipped hero to benefit from synergy effects **only if the synergy is active**

Artifacts and tokens:

* Can unlock synergy thresholds
* Cannot modify threshold values

## 13.9 Interaction with Hero Lifecycle

### 13.9.1 Hero Death

* Heroes that die in combat are restored after combat
* Items, artifacts, and relics are **never lost** on death

### 13.9.2 Selling a Hero

When a hero is sold:

* The hero instance is removed permanently
* All equipped items, artifacts, and relics are:
  + Returned to the bench
  + Or placed into overflow if the bench is full

No equipment is destroyed by selling.

### 13.9.3 Merging Heroes

When heroes are merged:

* The resulting hero keeps equipped items, artifacts, and relics
* If equipped items exceed **3 slots**:
  + Excess equipment is unequipped
  + Returned to the bench or overflow

Merging never destroys equipment.

## 13.10 Design Constraints

The item system enforces the following constraints:

* No equipment loss through combat
* No hidden equip or merge rules
* No modification of synergy thresholds
* No exceeding equip slot limits

Itemization must remain readable, deliberate, and strategically meaningful.

## 13.11 Separation of Concerns

This section defines:

* Item, artifact, and relic structure
* Equip, merge, and uniqueness rules

The following are defined elsewhere:

* Individual item effects
* Numerical tuning
* Drop rates and shop odds
* Visual presentation


---

> [!info] Related Documents
> - [[core_design]] — Equipment and economy systems
> - [[hero_kits]] — Hero equipment slots and relics
