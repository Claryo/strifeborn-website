---
title: "Items & Artifacts"
description: "Basic items, advanced combinations, and faction artifacts that transform your heroes."
icon: "⚔️"
---

Itemization in Strifeborn is built in three layers: **Basic Items**, **Advanced Items**, and **Hero Relics** for equipment — plus **Artifacts** as a separate synergy-granting category. Each layer serves a different strategic purpose and interacts with heroes, synergies, and the economy.

No equipment is ever lost through combat. Heroes that die in battle are restored afterward, items intact. Selling a hero returns all their equipment to the bench.

---

## Equip Slots

Every hero has **3 equip slots**. Item slots and artifact slots are shared — you can fill them with any combination of Basic Items, Advanced Items, Artifacts, and Hero Relics. This creates meaningful trade-offs between raw power, synergy enablement, and identity-defining relics.

Equipment can be changed freely **during preparation phases**. Once combat starts, all equipment is locked.

---

## Basic Items

Basic Items are the foundational tier. Each one:

- Provides a **single stat modifier**
- Has **no unique effect**
- Is **stackable** (you can equip multiple copies)
- Serves as a **component for Advanced Items**

There are **7 Basic Items**, each corresponding to a key stat:

| Item | Stat |
|---|---|
| Sword | Strength |
| Book | Wisdom |
| Armor | Physical Defense |
| Veil | Spell Defense |
| Scope | Attack Speed / Range |
| Belt | HP |
| Cell | Mana-related |

Basic Items are widely available in the Shop and through Blessings. They are the most common building block for power.

---

## Advanced Items

Advanced Items are created by **merging two compatible Basic Items** on the same hero.

The merge is:
- **Automatic** — when you equip a second compatible Basic Item on a hero who already has the first, they merge instantly into the Advanced Item
- **Deterministic** — each Basic Item pair always produces the same Advanced Item
- **Slot-efficient** — the two Basic Items combine into one slot

Each Advanced Item provides:
- **Two stat modifiers**
- **One unique effect**
- Is stackable

Advanced Items represent a meaningful mid-game power spike and the first layer of build specialization. Examples include items that trigger on-hit effects, grant combat stacking bonuses, or modify ability behavior.

If no equip slot is free, the merge cannot happen — you must clear a slot first.

---

## Hero Relics

Hero Relics are the strongest item tier and the most identity-defining.

Each Hero Relic:
- Provides **two stat modifiers with higher values** than Advanced Items
- Includes **one unique, identity-defining effect** tied to a hero's kit theme
- Is **unique per run** — only one instance can exist at a time

### How Relics Work

- Every hero in the game **defines one Hero Relic**
- Having that hero anywhere in your team pool makes the relic **available** in the run (in Shops, Forge objects, etc.)
- A Hero Relic is **not bound to its originating hero** — it can be equipped on any hero
- Only one copy of a given Relic may exist at a time

This system lets you transfer aspects of one hero's identity to another. Equipping a tank's relic on a caster, or a support's relic on a carry, opens creative build paths.

Hero Relics are obtainable through the Shop and via **Relic Forge** objects.

---

## Artifacts

Artifacts are a separate category from items and work differently.

An Artifact:
- Grants **+1 to a specific synergy counter** (Faction, Class, or Extra)
- Allows the equipped hero to benefit from that synergy if it's active
- Does **not** grant raw stats
- Is **unique per hero** — you cannot equip the same Artifact twice on the same hero
- Does **not** modify synergy threshold values

Artifacts are one of the primary ways to activate Extra synergies, which have no hero-based contribution. They occupy an equip slot just like items, so equipping an Artifact means giving up one slot of raw power — the trade-off is reaching a synergy breakpoint.

---

## Item Forge Objects

Several special objects interact with the item system and can be granted through Blessings or Shops:

| Object | Effect |
|---|---|
| Small Forge | Pick 1 Basic Item from a choice of 3 |
| Advanced Forge | Pick 1 Advanced Item from a choice of 3 |
| Relic Forge | Pick 1 Hero Relic from a choice of 3 |
| Item Reroll | Reroll one Item into another of the same rarity; reroll one Artifact into a random Artifact from your pool |
| Item Duplication | Duplicate one Basic Item (does not work on Advanced Items, Relics, or Artifacts) |
| Unfuse | Split one Advanced Item back into its two Basic component items |

---

## Design Constraints

- No equipment is destroyed by combat, hero death, or merging
- If a hero merge results in more than 3 items, excess equipment is returned to the bench
- Basic and Advanced Items are stackable; Artifacts and Relics are not (per hero / per run respectively)
- All merge and equip rules are explicit and visible — no hidden interactions
