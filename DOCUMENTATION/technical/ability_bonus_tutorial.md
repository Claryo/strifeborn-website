---
title: "Ability & Bonus System Tutorial"
tags: [technical, abilities, bonus-effects]
source: "Ability & Bonus System Tutorial.md (existing)"
last_updated: 2026-03-28
---

# Strifeborn: Ability & Bonus System Tutorial

Complete guide to creating **BasicAttacks**, **Spells**, **Passives**, **Synergy Bonuses**, **Blessings**, and **Faction Oaths** — including the **Status Effect system**, **targeting helpers**, **combat math**, and a **recipe book** of concrete implementation patterns.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Creating a BasicAttack](#2-creating-a-basicattack)
3. [Creating a Spell](#3-creating-a-spell)
4. [Creating a Passive](#4-creating-a-passive)
5. [Wiring Abilities into a Hero (UnitKit)](#5-wiring-abilities-into-a-hero-unitkit)
6. [The Status Effect System](#6-the-status-effect-system)
7. [Targeting & Unit Queries](#7-targeting--unit-queries)
8. [Stat Queries & Modifier System](#8-stat-queries--modifier-system)
9. [The BonusEffect System](#9-the-bonuseffect-system)
10. [Creating Synergy Bonuses](#10-creating-synergy-bonuses)
11. [Creating Blessing Effects](#11-creating-blessing-effects)
12. [Creating Faction Oath Effects](#12-creating-faction-oath-effects)
13. [How It All Wires Together](#13-how-it-all-wires-together)
14. [Combat Math Reference](#14-combat-math-reference)
15. [Complete Enum & Constant Reference](#15-complete-enum--constant-reference)
16. [EventBus Signal Reference](#16-eventbus-signal-reference)
17. [Recipe Book: Complete Implementation Examples](#17-recipe-book-complete-implementation-examples)
18. [BonusEffect Recipe Book](#18-bonuseffect-recipe-book)
19. [Effects Requiring New Systems](#19-effects-requiring-new-systems)

---

## 1. Architecture Overview

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                        UnitKit (.tres)                       │
│  Defines a hero: stats, synergies, ability script references │
│  basic_attack_script ──► GDScript (extends BasicAttackAbility)│
│  spell_script ─────────► GDScript (extends SpellAbility)     │
│  passive_script ───────► GDScript (extends PassiveAbility)   │
│  synergies ────────────► Array[SynergyKit]                   │
└───────────────┬─────────────────────────────────────────────┘
                │ spawns as
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     BattleUnit (scene)                        │
│  ├── AbilityHandler ──► instantiates & manages abilities     │
│  ├── ModifierHandler ─► calculates stats (base + modifiers)  │
│  ├── CombatState ─────► tracks HP, mana, shield, timers     │
│  ├── UnitAI ──────────► state machine (chase, attack, cast)  │
│  └── StatusEffectHandler ► CC, DoTs, buffs, debuffs          │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

- **Abilities are RefCounted scripts**, not nodes or resources. They're instantiated at battle start and garbage-collected after.
- **Abilities hook into combat via EventBus signals** — no direct coupling to the combat loop.
- **BonusEffect is the abstract base Resource** for all bonus effects from synergies, blessings, and faction oaths. Each effect gets its own custom script (like abilities), with a script template for quick creation.
- **StatusEffect is a lightweight data object** created via static factory methods. It represents CC, DoTs, buffs, debuffs, and taunts applied to units.
- **Tier enhancements** are built into each ability type: Passive at tier 3, BasicAttack at tier 5, Spell at tier 7.

### The Ability Lifecycle

```
1. BattleUnit._apply_kit()
2. AbilityHandler.initialize(battle_unit)
   ├── basic_attack = kit.basic_attack_script.new(battle_unit)
   │   └── basic_attack.activate()  ← connects EventBus signals
   ├── spell = kit.spell_script.new(battle_unit)
   │   └── (NOT activated — cast on demand by CastState)
   └── passive = kit.passive_script.new(battle_unit)
       └── passive.activate()  ← connects EventBus signals

3. During combat:
   ├── AutoAttackState triggers CombatResolver.resolve_auto_attack()
   │   └── EventBus.auto_attack_pre_resolve → BasicAttack modifies context
   ├── CastState triggers spell.cast(target) when mana is full
   │   └── SpellAbility handles everything, emits cast_finished
   └── PassiveAbility reacts to EventBus signals continuously

4. On death / battle end:
   └── AbilityHandler.clear()
       ├── basic_attack.deactivate()  ← disconnects signals
       ├── passive.deactivate()       ← disconnects signals
       └── all references set to null
```

---

## 2. Creating a BasicAttack

### What is a BasicAttack?

A BasicAttack hooks into the **auto-attack resolution pipeline** to modify attacks before and/or after damage is applied. It does NOT trigger the attack itself — that's handled by `AutoAttackState` and `CombatResolver`.

### Base Class: `BasicAttackAbility`

**File:** `scripts/abilities/basic_attack_ability.gd`

```gdscript
class_name BasicAttackAbility
extends RefCounted

var owner: BattleUnit

func _init(battle_unit: BattleUnit) -> void:
    owner = battle_unit

func activate() -> void:
    pass

func deactivate() -> void:
    pass

func is_enhanced() -> bool:
    return owner.unit_kit.tier >= 5    # Tier 5 unlocks enhancement
```

### How Auto-Attacks Flow

```
AutoAttackState._trigger_attack()
    │
    ▼
CombatResolver.resolve_auto_attack(attacker, target)
    │
    ├── 1. Dodge roll (can miss)
    │
    ├── 2. Create mutable context dict:
    │      {
    │        "bonus_crit_chance": 0.0,
    │        "bonus_damage_percent": 0.0,
    │        "extra_targets": []
    │      }
    │
    ├── 3. EventBus.auto_attack_pre_resolve.emit(attacker, target, context)
    │      └──► YOUR BasicAttack._on_pre_resolve() hooks HERE
    │           Modify the context dict to change the attack
    │
    ├── 4. Apply context modifiers to damage calculation
    ├── 5. Apply defense mitigation
    ├── 6. Roll crit (with bonus_crit_chance from context)
    ├── 7. Apply damage (shield → health)
    ├── 8. Lifesteal
    ├── 9. Mana gain
    │
    ├── 10. EventBus.combat_attack_resolved.emit(attacker, target, damage, is_crit)
    │       └──► YOUR BasicAttack._on_attack_resolved() hooks HERE (optional)
    │
    └── 11. Process extra_targets from context (cleave/splash)
```

### Step-by-Step: Create a BasicAttack

**1. Create a new GDScript file** in your hero's folder (e.g., `scripts/abilities/heroes/aegis/atlas_basic_attack.gd`).

**2. Extend BasicAttackAbility and implement the hooks:**

```gdscript
extends BasicAttackAbility
class_name AtlasBasicAttack


func activate() -> void:
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)
    # Uncomment if you need post-attack logic:
    # EventBus.combat_attack_resolved.connect(_on_attack_resolved)


func deactivate() -> void:
    EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    # EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)


func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return    # CRITICAL: only modify YOUR OWN attacks

    # Example: Atlas gains +15% bonus damage per attack
    context.bonus_damage_percent += 15.0

    # Tier 5 Enhancement: also +20% crit chance
    if is_enhanced():
        context.bonus_crit_chance += 20.0
```

### Context Dictionary Keys

| Key | Type | Effect |
|-----|------|--------|
| `bonus_crit_chance` | `float` | Added to base crit chance for this attack |
| `bonus_damage_percent` | `float` | Multiplies base damage: `damage *= (1 + bonus/100)` |
| `extra_targets` | `Array[BattleUnit]` | Additional units hit by this attack (cleave) |

### Post-Attack Hook (Optional)

Use `combat_attack_resolved` to react AFTER damage is dealt:

```gdscript
func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, damage: int, is_critical: bool) -> void:
    if attacker != owner:
        return

    # Example: apply a DoT after every crit
    if is_critical and is_instance_valid(target) and target.combat_state.is_alive():
        var dot := StatusEffect.create_dot(
            "atlas_crit_burn",    # source_id
            owner,                # applier
            3.0,                  # duration (seconds)
            10.0,                 # damage per tick
            1.0,                  # tick interval (seconds)
            GameTypes.DamageType.PURE,  # damage type
            true                  # stackable
        )
        target.status_effect_handler.apply_effect(dot)
```

### Common Patterns

**Stacking mechanic (attack counter):**
```gdscript
var attack_count: int = 0

func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return
    attack_count += 1
    # Every 3rd attack does +50% damage
    if attack_count % 3 == 0:
        context.bonus_damage_percent += 50.0
```

**Cleave (hit adjacent enemies):**
```gdscript
func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return
    # Add all enemies as extra targets (full cleave)
    var all_enemies := TargetingSystem.get_all_enemies(owner)
    for enemy in all_enemies:
        if enemy != target:
            context.extra_targets.append(enemy)
```

**Redirect attack target (e.g. random enemy while spell is active):**

Override `get_attack_target()` to change who the auto-attack fires at each swing. AutoAttackState calls this before firing. Check the hero's spell state to conditionally redirect:
```gdscript
func get_attack_target(default_target: BattleUnit) -> BattleUnit:
    # Only redirect while the hero's spell is active
    var spell := owner.ability_handler.spell as MyHeroSpell
    if spell == null or not spell.is_active:
        return default_target

    # Pick a random enemy in attack range
    var enemies := TargetingSystem.get_all_enemies(owner)
    var attack_range: int = int(owner.modifier_handler.get_stat("attack_range"))
    var in_range: Array[BattleUnit] = []
    for enemy in enemies:
        var dist := UnitNavigation.get_distance_in_tiles(owner, enemy)
        if dist != -1 and dist <= attack_range:
            in_range.append(enemy)
    if in_range.is_empty():
        return default_target
    return in_range[randi() % in_range.size()]
```
> **Note:** `get_attack_target` only redirects the main auto-attack. Use `unit_ranged_effect_fired` for secondary projectiles (see Section 16 and Recipe 19).

**Secondary projectile (proc effect, no passive chaining):**

For bonus shots that should NOT trigger passives, grant mana, or chain further procs, use `unit_ranged_effect_fired` + `CombatResolver.resolve_secondary_attack`:
```gdscript
# In _on_attack_resolved: emit the secondary projectile
EventBus.unit_ranged_effect_fired.emit(owner, shot_target, 0.30)
# → BattleUnitPresenter spawns a projectile that calls resolve_secondary_attack on arrival
# → Deals 30% STR as Physical damage with mitigation + lifesteal, no other side effects
```
Use a reentrancy guard (`var _second_shot_in_progress: bool = false`) to prevent cascading if needed. See Recipe 19 for a complete example.

---

## 3. Creating a Spell

### What is a Spell?

A Spell takes **full control** of the unit when cast. It handles ALL targeting, damage, movement, timers, and effects internally. The AI state machine (`CastState`) waits for the spell to finish before resuming normal behavior.

### Base Class: `SpellAbility`

**File:** `scripts/abilities/spell_ability.gd`

```gdscript
class_name SpellAbility
extends RefCounted

signal cast_finished    # MUST be emitted when spell is complete

var owner: BattleUnit

func _init(battle_unit: BattleUnit) -> void:
    owner = battle_unit

func cast(primary_target: BattleUnit) -> void:
    cast_finished.emit()    # Default: instant no-op

func is_enhanced() -> bool:
    return owner.unit_kit.tier >= 7    # Tier 7 unlocks enhancement
```

### How Spell Casting Flows

```
UnitAI detects mana is full
    │
    ▼
CastState._enter()
    │
    ├── 1. Validates target (retargets if dead)
    ├── 2. Spends all mana
    ├── 3. Locks mana gain for 500ms
    │
    ├── 4. Connects to spell.cast_finished signal (one-shot)
    ├── 5. Calls spell.cast(target)
    │      └──► YOUR SpellAbility takes full control HERE
    ├── 6. Emits EventBus.spell_cast(caster) — passives can react
    │
    └── 7. On cast_finished signal:
           └── Transitions back to AutoAttackState
```

### Step-by-Step: Create a Spell

**1. Create a new GDScript file** (e.g., `scripts/abilities/heroes/aegis/atlas_spell.gd`).

**2. Extend SpellAbility and implement `cast()`:**

```gdscript
extends SpellAbility
class_name AtlasSpell


func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target):
        call_deferred("emit_signal", "cast_finished")  # Deferred: immediate return
        return

    # Simple single-target spell: deal 100% WIS as spell damage
    CombatResolver.resolve_spell_cast(owner, null, primary_target)

    # Tier 7 Enhancement: also heal self for 30% of max HP
    if is_enhanced():
        var max_hp: float = owner.modifier_handler.get_stat("max_hp")
        CombatResolver.resolve_healing(owner, max_hp * 0.30, owner)

    # CRITICAL: Always emit cast_finished when done!
    # Use call_deferred for synchronous emissions (not inside a tween callback)
    call_deferred("emit_signal", "cast_finished")
```

### Important Rules

1. **ALWAYS emit `cast_finished`** — even on error/early return. If you forget, the unit freezes forever.
2. **Use `call_deferred("emit_signal", "cast_finished")` for immediate emissions** — when `cast_finished` is emitted synchronously inside `cast()` (i.e. not via a tween callback), the CastState may not have finished processing the current frame yet. Using `call_deferred` ensures at least one frame passes so the state machine can properly transition out. Tween callbacks (`tween.tween_callback(cast_finished.emit)`) are already deferred by nature and don't need this.
3. **Validate targets** — units can die between mana full and cast. Always check `is_instance_valid()`.
4. **Use `owner.create_tween()` for multi-phase spells** — don't use `await` with timers. Since abilities are `RefCounted` (not `Node`), they cannot call `get_tree()` directly. Use `owner.create_tween()` instead (the owner is a `Node`).
5. **Check `is_alive()` before dealing damage** — targets can die mid-spell from other sources.
6. **`EventBus.spell_cast` is emitted by CastState** after `spell.cast(target)` is called, for both custom and default spells. Passives can safely listen to this signal to react to any spell cast.

### Multi-Phase Spell Example

```gdscript
extends SpellAbility
class_name KaelSpell

func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target):
        call_deferred("emit_signal", "cast_finished")  # Deferred: immediate return
        return

    # Phase 1: Deal damage to primary target
    CombatResolver.resolve_spell_cast(owner, null, primary_target)

    # Phase 2: After 0.5s, deal damage to all enemies
    var tween := owner.create_tween()
    tween.tween_interval(0.5)
    tween.tween_callback(_aoe_phase)
    tween.tween_callback(cast_finished.emit)  # Tween callbacks are already deferred


func _aoe_phase() -> void:
    var enemies := TargetingSystem.get_all_enemies(owner)
    for enemy in enemies:
        if is_instance_valid(enemy) and enemy.combat_state.is_alive():
            CombatResolver.resolve_damage(
                enemy,
                owner.modifier_handler.get_stat("wisdom") * 0.5,
                GameTypes.DamageType.SPELL,
                owner
            )

    # Tier 7 Enhancement: apply silence to all hit enemies
    if is_enhanced():
        for enemy in enemies:
            if is_instance_valid(enemy) and enemy.combat_state.is_alive():
                var silence := StatusEffect.create_cc(
                    GameTypes.EffectType.SILENCE,
                    "kael_spell_silence",
                    owner,
                    2.0
                )
                enemy.status_effect_handler.apply_effect(silence)
```

### Available CombatResolver Methods for Spells

| Method | Usage |
|--------|-------|
| `CombatResolver.resolve_spell_cast(caster, null, target)` | Standard spell damage (100% WIS, SPELL type, undodgeable) |
| `CombatResolver.resolve_damage(target, amount, damage_type, source)` | Custom damage (any amount/type, goes through mitigation) |
| `CombatResolver.resolve_healing(target, amount, source)` | Heal a unit (capped at max HP) |
| `CombatResolver.resolve_secondary_attack(attacker, target, effectiveness)` | Physical hit at `effectiveness * STR`, with mitigation + lifesteal. Does NOT grant mana or emit `combat_attack_resolved`. Use for bonus/proc shots that must not chain passives. |

### Common Pitfalls

**Signal feedback loops with `remove_effect` / `status_effect_removed`:**
When using stacking status effects that refresh on hit (remove old → apply new), calling `remove_effect(SOURCE_ID)` fires the `status_effect_removed` signal synchronously. If your callback resets the stack counter on removal, the counter will be zero by the time you create the new modifier. **Fix:** snapshot the stack count before calling `remove_effect`, then restore it after:

```gdscript
var current_stacks := _stacks
owner.status_effect_handler.remove_effect(SOURCE_ID)  # Fires signal, resets _stacks
_stacks = current_stacks  # Restore
# Now create modifier with correct _stacks value
```

**RefCounted scripts cannot use `get_tree()`:**
Abilities extend `RefCounted`, not `Node`. Use `owner.create_tween()` for delays and timers. For example, to fire a delayed projectile:

```gdscript
var tween := owner.create_tween()
tween.tween_interval(0.15)
tween.tween_callback(func():
    EventBus.unit_ranged_attack_fired.emit(owner, target)
)
```

**Mana lock for spells with ongoing effects:**
If your spell grants a buff and the unit keeps auto-attacking (e.g. `call_deferred("emit_signal", "cast_finished")` returns control immediately), lock mana to prevent re-casting during the effect:

```gdscript
owner.combat_state.lock_mana_for(int(duration * 1000.0))
```

### Stat Queries in Spells

```gdscript
# Get any stat through the modifier system
var wisdom: float = owner.modifier_handler.get_stat("wisdom")
var max_hp: float = owner.modifier_handler.get_stat("max_hp")
var current_hp: float = owner.combat_state.current_health
var current_mana: float = owner.combat_state.current_mana
var attack_speed: float = owner.modifier_handler.get_stat("attack_speed")
var strength: float = owner.modifier_handler.get_stat("strength")
```

---

## 4. Creating a Passive

### What is a Passive?

A Passive is an always-active ability that listens to EventBus signals and reacts to game events (attacks, damage taken, deaths, spells cast, etc.). It can apply stat modifiers, trigger effects, or maintain internal state.

### Base Class: `PassiveAbility`

**File:** `scripts/abilities/passive_ability.gd`

```gdscript
class_name PassiveAbility
extends RefCounted

var owner: BattleUnit

func _init(battle_unit: BattleUnit) -> void:
    owner = battle_unit

func activate() -> void:
    pass

func deactivate() -> void:
    pass

func is_enhanced() -> bool:
    return owner.unit_kit.tier >= 3    # Tier 3 unlocks enhancement
```

### Available EventBus Signals for Passives

| Signal | Parameters | When It Fires |
|--------|------------|---------------|
| `combat_attack_resolved` | `attacker, target, damage, is_critical` | After any auto-attack resolves |
| `unit_damaged` | `unit, damage, source, type, is_crit, is_shield_only` | When any unit takes damage |
| `unit_healed` | `unit, heal_amount` | When any unit is healed |
| `unit_died` | `battle_unit` | When any unit dies |
| `spell_cast` | `caster` | When any unit casts a spell |
| `status_effect_applied` | `unit, effect_type, source` | When a status effect is applied |
| `status_effect_removed` | `unit, effect_type, source` | When a status effect is removed |
| `unit_dodged` | `dodging_unit, attacker` | When a unit dodges an attack |
| `auto_attack_pre_resolve` | `attacker, target, context` | Before attack damage (same as BasicAttack) |

### Step-by-Step: Create a Passive

**1. Create a new GDScript file** (e.g., `scripts/abilities/heroes/aegis/atlas_passive.gd`).

**2. Extend PassiveAbility, connect signals in `activate()`, disconnect in `deactivate()`:**

```gdscript
extends PassiveAbility
class_name AtlasPassive

## Atlas gains +5% damage reduction each time he takes damage (stacks up to 5 times).
## Tier 3 Enhancement: stacks up to 8 times.

var stacks: int = 0
var MAX_STACKS: int = 5
var DR_PER_STACK: float = 5.0


func activate() -> void:
    EventBus.unit_damaged.connect(_on_unit_damaged)
    stacks = 0


func deactivate() -> void:
    EventBus.unit_damaged.disconnect(_on_unit_damaged)
    # Clean up any modifiers we applied
    owner.modifier_handler.remove_values_by_source("atlas_passive")


func _on_unit_damaged(
    damaged_unit: BattleUnit,
    _damage: float,
    _attacking_unit: BattleUnit,
    _damage_type: GameTypes.DamageType,
    _is_crit: bool,
    _is_shield_only: bool
) -> void:
    if damaged_unit != owner:
        return    # Only react to OUR damage

    var max_stacks: int = 8 if is_enhanced() else MAX_STACKS
    if stacks >= max_stacks:
        return

    stacks += 1

    # Remove old modifier and apply updated one
    owner.modifier_handler.remove_values_by_source("atlas_passive")

    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.FLAT
    mod.flat_value = DR_PER_STACK * stacks
    mod.source = "atlas_passive"
    owner.modifier_handler.add_modifier_value(Modifier.Type.DAMAGE_REDUCTION, mod)
```

### Common Passive Patterns

**On-kill effect:**
```gdscript
func activate() -> void:
    EventBus.unit_died.connect(_on_unit_died)

func deactivate() -> void:
    EventBus.unit_died.disconnect(_on_unit_died)

func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Check if the dead unit is an enemy (not an ally)
    if dead_unit.unit_kit.unit_type == owner.unit_kit.unit_type:
        return    # Same team died, ignore

    # Heal self on enemy kill
    CombatResolver.resolve_healing(owner, 50.0, owner)
```

**Permanent stat buff (applied once on activate):**
```gdscript
func activate() -> void:
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.PERCENT_BASED
    mod.percent_value = 15.0    # +15% attack speed
    mod.source = "hero_passive"
    owner.modifier_handler.add_modifier_value(Modifier.Type.ATTACK_SPEED, mod)

func deactivate() -> void:
    owner.modifier_handler.remove_values_by_source("hero_passive")
```

**React to ally spells:**
```gdscript
func activate() -> void:
    EventBus.spell_cast.connect(_on_spell_cast)

func deactivate() -> void:
    EventBus.spell_cast.disconnect(_on_spell_cast)

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster.unit_kit.unit_type != owner.unit_kit.unit_type:
        return    # Enemy spell, ignore
    if caster == owner:
        return    # Own spell, ignore

    # Grant a shield when an ally casts a spell
    owner.combat_state.modify_shield(50.0)
```

### Important: Always Clean Up

- **`deactivate()` must undo everything `activate()` did**: disconnect all signals, remove all modifiers.
- Use `remove_values_by_source("your_unique_source_id")` to cleanly remove modifiers.
- If you don't clean up, modifiers persist and signals fire on dead units.

---

## 5. Wiring Abilities into a Hero (UnitKit)

### UnitKit Ability Exports

Every hero is defined by a `UnitKit` resource (`.tres` file). It has three GDScript exports for abilities:

```gdscript
# In unit_kit.gd:
@export var basic_attack_script: GDScript  ## extends BasicAttackAbility
@export var spell_script: GDScript         ## extends SpellAbility
@export var passive_script: GDScript       ## extends PassiveAbility
```

### How to Wire It in the Editor

1. **Select your hero's UnitKit** resource (e.g., `data/heroes/aegis/atlas.tres`).
2. **In the Inspector**, find the ability script fields.
3. **Drag your GDScript file** onto the field, or click the field and select your script.
   - `basic_attack_script` → your `atlas_basic_attack.gd`
   - `spell_script` → your `atlas_spell.gd`
   - `passive_script` → your `atlas_passive.gd`

### What Happens at Runtime

```
AbilityHandler.initialize(battle_unit):
    1. basic_attack = kit.basic_attack_script.new(battle_unit)
       basic_attack.activate()     ← signals connected

    2. spell = kit.spell_script.new(battle_unit)
       (spell is NOT activated — cast() is called on demand)

    3. passive = kit.passive_script.new(battle_unit)
       passive.activate()          ← signals connected
```

### Tier Enhancement Thresholds

| Ability | Enhancement Tier | `is_enhanced()` returns true when... |
|---------|-----------------|--------------------------------------|
| Passive | Tier 3 | `owner.unit_kit.tier >= 3` |
| BasicAttack | Tier 5 | `owner.unit_kit.tier >= 5` |
| Spell | Tier 7 | `owner.unit_kit.tier >= 7` |

Heroes gain tiers through merging duplicates (auto-battler style).

---

## 6. The Status Effect System

### Overview

The status effect system lets abilities apply **CC (crowd control)**, **DoTs (damage over time)**, **taunts**, **stat buffs**, and **stat debuffs** to any BattleUnit. Effects are:

1. Created via **static factory methods** on `StatusEffect`
2. Applied via **`target.status_effect_handler.apply_effect(effect)`**
3. Automatically ticked, expired, and cleaned up by the system

### StatusEffect Data Object

**File:** `scripts/status_effect/status_effect.gd`

`StatusEffect` is a lightweight `RefCounted` data object. Never create one with `.new()` directly — always use the factory methods.

**Core fields (all effect types):**
```gdscript
var effect_type: GameTypes.EffectType  # STUN, SILENCE, ROOT, TAUNT, DOT, STAT_BUFF, STAT_DEBUFF
var source: String                      # Unique ID (e.g., "grimm_passive_armor_shred")
var source_unit: BattleUnit             # Who applied it
var duration: float                     # Total duration in seconds (-1 = permanent)
var remaining_duration: float           # Countdown
```

### Factory Method 1: CC Effects (Stun, Silence, Root)

```gdscript
StatusEffect.create_cc(
    type: GameTypes.EffectType,   # STUN, SILENCE, or ROOT
    source_id: String,            # Unique identifier
    applier_unit: BattleUnit,     # Who is applying this
    dur: float                    # Duration in seconds
) -> StatusEffect
```

**What each CC type does:**
| CC Type | Effect |
|---------|--------|
| `STUN` | Unit cannot attack, cast, or move. Checked via `is_stunned()`. CastState cancels spell if stunned. |
| `SILENCE` | Unit cannot cast spells (mana still fills). Checked via `is_silenced()`. |
| `ROOT` | Unit cannot move but can still attack and cast. Checked via `is_rooted()`. |

**Stacking rule:** CC effects **refresh to longest duration**. If a 2s stun is already active and a 1.5s stun is applied, the 2s stun stays. If a 3s stun is applied, it extends to 3s.

**Tenacity reduces CC duration:**
```
effective_duration = duration * (100.0 / (100.0 + tenacity))
```
Example: 50 tenacity reduces a 3s stun to 2s.

**Usage example:**
```gdscript
# Apply a 1.5s stun to the target
var stun := StatusEffect.create_cc(
    GameTypes.EffectType.STUN,
    "hero_spell_stun",       # source_id
    owner,                    # who applied it
    1.5                       # duration in seconds
)
target.status_effect_handler.apply_effect(stun)
```

### Factory Method 2: DoT Effects (Damage Over Time)

```gdscript
StatusEffect.create_dot(
    source_id: String,              # Unique identifier
    applier_unit: BattleUnit,       # Who is applying this
    dur: float,                     # Total duration in seconds
    damage: float,                  # Damage per tick
    interval: float,                # Seconds between ticks
    damage_type: GameTypes.DamageType,  # PHYSICAL, SPELL, or PURE
    is_stackable: bool = true       # Can multiple instances stack?
) -> StatusEffect
```

**DoT-specific fields:**
```gdscript
var dot_damage: float               # Damage per tick
var dot_interval: float             # Seconds between ticks (e.g., 1.0)
var dot_timer: float                # Countdown to next tick (starts at interval)
var dot_damage_type: GameTypes.DamageType
var stackable: bool                 # true = stack instances, false = refresh duration
```

**Stacking rules:**
- `stackable = true`: Every application adds a **new independent instance**. Each ticks separately. Use for effects that should stack (e.g., poison stacks).
- `stackable = false`: Reapplying from the **same source** refreshes the duration and resets the tick timer. Use for effects that should only exist once (e.g., a unique burn).

**DoT damage goes through mitigation.** The `CombatResolver.resolve_damage()` method is called on each tick, which applies defense and damage reduction based on the `dot_damage_type`.

**Usage example:**
```gdscript
# Apply a stackable poison DoT: 15 SPELL damage every 1s for 4s
var poison := StatusEffect.create_dot(
    "viper_passive_poison",     # source_id
    owner,                       # applier
    4.0,                         # total duration (seconds)
    15.0,                        # damage per tick
    1.0,                         # tick interval (every 1 second)
    GameTypes.DamageType.SPELL,  # damage type (mitigated by spell_def)
    true                         # stackable (multiple applications stack)
)
target.status_effect_handler.apply_effect(poison)
```

```gdscript
# Apply a non-stackable burn: 25 PURE damage every 0.5s for 3s (refreshes on reapply)
var burn := StatusEffect.create_dot(
    "fire_spell_burn",
    owner,
    3.0,
    25.0,
    0.5,
    GameTypes.DamageType.PURE,   # PURE ignores all defenses
    false                         # non-stackable: refreshes instead of stacking
)
target.status_effect_handler.apply_effect(burn)
```

### Factory Method 3: Taunt Effects

```gdscript
StatusEffect.create_taunt(
    source_id: String,
    applier_unit: BattleUnit,   # The taunter (forces enemies to attack THIS unit)
    dur: float
) -> StatusEffect
```

**Taunt-specific fields:**
```gdscript
var taunt_target: BattleUnit   # = applier_unit (the taunter)
```

**Stacking rule:** Only ONE taunt can be active at a time. A new taunt **replaces** the existing one.

**Auto-removal:** If the taunter dies, the taunt is automatically removed.

**Tenacity reduces taunt duration** (same formula as CC).

**Usage example:**
```gdscript
# Taunt all nearby enemies for 2s (forces them to attack the owner)
var enemies := TargetingSystem.get_all_enemies(owner)
for enemy in enemies:
    if is_instance_valid(enemy) and enemy.combat_state.is_alive():
        var taunt := StatusEffect.create_taunt(
            "tank_spell_taunt",
            owner,
            2.0
        )
        enemy.status_effect_handler.apply_effect(taunt)
```

### Factory Method 4: Stat Buff/Debuff Effects (Timed Modifiers)

```gdscript
StatusEffect.create_stat_mod(
    type: GameTypes.EffectType,   # STAT_BUFF or STAT_DEBUFF
    source_id: String,
    applier_unit: BattleUnit,
    dur: float,                   # Duration (-1 = permanent until manually removed)
    mod_type: Modifier.Type,      # Which stat to modify (e.g., Modifier.Type.ATTACK_SPEED)
    mod_value: ModifierValue      # The modifier to apply
) -> StatusEffect
```

**Stat mod-specific fields:**
```gdscript
var modifier_type: Modifier.Type    # Which stat
var modifier_value: ModifierValue   # Auto-applied to ModifierHandler, auto-cleaned on expiry
```

**Stacking rule:** Same source refreshes duration only (does NOT stack the modifier). Different sources stack.

**Auto-cleanup:** When the effect expires, the modifier is automatically removed from the unit's `ModifierHandler`. No manual cleanup needed.

**Usage example — timed debuff:**
```gdscript
# Apply -30% attack speed debuff for 3s
var mod := ModifierValue.new()
mod.type = ModifierValue.Type.PERCENT_BASED
mod.percent_value = -30.0     # NEGATIVE = debuff
mod.source = "frost_spell_slow"

var debuff := StatusEffect.create_stat_mod(
    GameTypes.EffectType.STAT_DEBUFF,
    "frost_spell_slow",        # source_id (should match mod.source)
    owner,
    3.0,                        # 3 second duration
    Modifier.Type.ATTACK_SPEED, # which stat
    mod
)
target.status_effect_handler.apply_effect(debuff)
```

**Usage example — timed buff:**
```gdscript
# Apply +50 flat physical defense buff for 4s
var mod := ModifierValue.new()
mod.type = ModifierValue.Type.FLAT
mod.flat_value = 50
mod.source = "shield_passive_buff"

var buff := StatusEffect.create_stat_mod(
    GameTypes.EffectType.STAT_BUFF,
    "shield_passive_buff",
    owner,
    4.0,
    Modifier.Type.PHYS_DEF,
    mod
)
owner.status_effect_handler.apply_effect(buff)
```

### StatusEffectHandler API

**File:** `scripts/components/status_effect_handler.gd`

Accessed via `battle_unit.status_effect_handler`.

**Application:**
```gdscript
# Apply any status effect (handles stacking rules automatically)
target.status_effect_handler.apply_effect(effect: StatusEffect) -> void
```

**Removal:**
```gdscript
# Remove all effects with a specific source ID
target.status_effect_handler.remove_effect("source_id") -> void

# Remove all effects of a specific type
target.status_effect_handler.remove_effects_by_type(GameTypes.EffectType.DOT) -> void

# Clear everything (called on battle end)
target.status_effect_handler.clear_all() -> void
```

**Queries:**
```gdscript
# Check if any effect of this type is active
target.status_effect_handler.has_effect(GameTypes.EffectType.STUN) -> bool

# Get all effects of a type
target.status_effect_handler.get_effects_by_type(GameTypes.EffectType.DOT) -> Array[StatusEffect]

# Get a specific effect by source ID
target.status_effect_handler.get_effect("source_id") -> StatusEffect  # or null

# Convenience checks
target.status_effect_handler.is_stunned() -> bool
target.status_effect_handler.is_silenced() -> bool
target.status_effect_handler.is_rooted() -> bool
target.status_effect_handler.is_taunted() -> bool

# Get the unit this unit is forced to attack (or null)
target.status_effect_handler.get_taunt_target() -> BattleUnit
```

### Status Effect Stacking Rules Summary

| Effect Type | Same Source Reapply | Different Source | Notes |
|-------------|--------------------|--------------------|-------|
| **STUN** | Refresh to longest duration | Refresh to longest duration | Only one stun active, tenacity reduces duration |
| **SILENCE** | Refresh to longest duration | Refresh to longest duration | Only one silence active, tenacity reduces duration |
| **ROOT** | Refresh to longest duration | Refresh to longest duration | Only one root active, tenacity reduces duration |
| **TAUNT** | Replace | Replace | Only one taunt active, tenacity reduces duration, auto-removes on taunter death |
| **DOT (stackable)** | Add new instance | Add new instance | All instances tick independently |
| **DOT (non-stackable)** | Refresh duration + reset timer | Add new instance | Different sources always create new instances |
| **STAT_BUFF** | Refresh duration only | Add new modifier | Duration refreshes, modifier NOT re-applied |
| **STAT_DEBUFF** | Refresh duration only | Add new modifier | Duration refreshes, modifier NOT re-applied |

---

## 7. Targeting & Unit Queries

### TargetingSystem Autoload

**File:** `autoload/targeting_system.gd`

The `TargetingSystem` autoload provides methods to find targets and get lists of units.

### Finding Targets

```gdscript
# Find the best enemy target from all enemies (uses priority + distance)
var target: BattleUnit = TargetingSystem.find_target(owner)

# Find the best enemy target within attack range
var target_in_range: BattleUnit = TargetingSystem.find_target_in_range(owner)
```

### Getting Unit Lists

```gdscript
# Get ALL alive, targetable enemies
var enemies: Array = TargetingSystem.get_all_enemies(owner)

# Get ALL alive, targetable allies (includes owner)
var allies: Array = TargetingSystem.get_all_allies(owner)
```

### Target Selection Priority

When multiple valid targets exist, `TargetingSystem` picks the best using:

1. **Primary: Closest distance** (measured in grid tiles)
2. **Tiebreaker 1: Highest priority score** (based on stats — low HP%, high damage, low defense, high attack speed, high mana%)
3. **Tiebreaker 2: Lowest absolute health**
4. **Tiebreaker 3: Lowest health percentage**

### Filtering Patterns for Abilities

Use `TargetingSystem.get_all_enemies()` and `TargetingSystem.get_all_allies()` to build target pools, then filter manually:

```gdscript
# Get the lowest-HP enemy
func _get_lowest_hp_enemy() -> BattleUnit:
    var enemies := TargetingSystem.get_all_enemies(owner)
    var lowest: BattleUnit = null
    for enemy in enemies:
        if lowest == null or enemy.combat_state.current_health < lowest.combat_state.current_health:
            lowest = enemy
    return lowest

# Get the highest-HP ally
func _get_highest_hp_ally() -> BattleUnit:
    var allies := TargetingSystem.get_all_allies(owner)
    var highest: BattleUnit = null
    for ally in allies:
        if highest == null or ally.combat_state.current_health > highest.combat_state.current_health:
            highest = ally
    return highest

# Get all enemies that have a specific debuff
func _get_enemies_with_debuff(source_id: String) -> Array[BattleUnit]:
    var result: Array[BattleUnit] = []
    for enemy in TargetingSystem.get_all_enemies(owner):
        if enemy.status_effect_handler.get_effect(source_id) != null:
            result.append(enemy)
    return result

# Get all enemies that are stunned
func _get_stunned_enemies() -> Array[BattleUnit]:
    var result: Array[BattleUnit] = []
    for enemy in TargetingSystem.get_all_enemies(owner):
        if enemy.status_effect_handler.is_stunned():
            result.append(enemy)
    return result

# Count active DoTs on a target
func _count_dots_on(target: BattleUnit) -> int:
    return target.status_effect_handler.get_effects_by_type(GameTypes.EffectType.DOT).size()
```

### Validity Checks

Always validate units before interacting with them:

```gdscript
# Full validity check before applying an effect
if is_instance_valid(target) and target.combat_state.is_alive():
    # Safe to apply damage/effects
    CombatResolver.resolve_damage(target, 50.0, GameTypes.DamageType.SPELL, owner)
```

---

## 8. Stat Queries & Modifier System

### Querying Stats

All stat queries go through `battle_unit.modifier_handler.get_stat(stat_name)`:

```gdscript
# Returns: base_stat * tier_scaling + flat_modifiers, then * percent_modifiers
var value: float = owner.modifier_handler.get_stat("stat_name")
```

### Complete Stat Name Reference

These are the exact string keys to use with `get_stat()`:

| Stat Name String | Modifier.Type | Description |
|-----------------|---------------|-------------|
| `"max_hp"` | `MAX_HP` | Maximum health |
| `"max_mana"` | `MAX_MANA` | Maximum mana |
| `"starting_mana"` | `STARTING_MANA` | Mana at battle start |
| `"strength"` | `STRENGTH` | Physical damage (auto-attack base) |
| `"wisdom"` | `WISDOM` | Spell damage (spell base) |
| `"attack_speed"` | `ATTACK_SPEED` | Attacks per second |
| `"phys_def"` | `PHYS_DEF` | Physical defense |
| `"spell_def"` | `SPELL_DEF` | Spell defense |
| `"crit_chance_percent"` | `CRIT_CHANCE` | Critical hit chance (%) |
| `"crit_damage_percent"` | `CRIT_DAMAGE` | Critical damage multiplier (e.g., 150 = 1.5x) |
| `"damage_amplification_percent"` | `DAMAGE_AMPLIFICATION` | Bonus damage dealt (%) |
| `"phys_pen_flat"` | `PHYS_PEN_FLAT` | Flat physical penetration |
| `"spell_pen_flat"` | `SPELL_PEN_FLAT` | Flat spell penetration |
| `"phys_pen_percent"` | `PHYS_PEN_PERCENT` | Percent physical penetration |
| `"spell_pen_percent"` | `SPELL_PEN_PERCENT` | Percent spell penetration |
| `"dodge"` | `DODGE` | Dodge chance (%) |
| `"lifesteal_percent"` | `LIFESTEAL` | Lifesteal on auto-attacks (%) |
| `"tenacity"` | `TENACITY` | CC duration reduction |
| `"damage_reduction_percent"` | `DAMAGE_REDUCTION` | Flat damage reduction (%) |
| `"healing_power"` | `HEALING_POWER` | Bonus healing (%) |
| `"shielding_power"` | `SHIELDING_POWER` | Bonus shielding (%) |
| `"move_speed"` | `MOVE_SPEED` | Movement speed |
| `"attack_range"` | `ATTACK_RANGE` | Attack range (in tiles) |

### Runtime-Only Values (on CombatState, NOT ModifierHandler)

```gdscript
owner.combat_state.current_health     # Current HP
owner.combat_state.current_mana       # Current mana
owner.combat_state.current_shield     # Current shield amount
owner.combat_state.is_alive()         # HP > 0
owner.combat_state.is_targetable()    # Not in untargetable window
owner.combat_state.is_attack_ready()  # Auto-attack timer expired
```

### Applying Modifiers (Permanent for Battle Duration)

For modifiers that last the entire battle (passives, on-activate effects):

```gdscript
# 1. Create a ModifierValue
var mod := ModifierValue.new()
mod.type = ModifierValue.Type.FLAT        # or PERCENT_BASED or ZERO
mod.flat_value = 30                       # for FLAT type
# mod.percent_value = 20.0               # for PERCENT_BASED type (20% = multiply by 1.2)
mod.source = "my_unique_source_id"        # REQUIRED for cleanup

# 2. Apply it
owner.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, mod)

# 3. Remove it (in deactivate or when no longer needed)
owner.modifier_handler.remove_values_by_source("my_unique_source_id")
```

### Applying Timed Modifiers (Auto-Expire via StatusEffect)

For modifiers that expire after a duration (buffs/debuffs), use `StatusEffect.create_stat_mod()` instead (see [Section 6](#factory-method-4-stat-buffdebuff-effects-timed-modifiers)). This automatically handles cleanup.

### ModifierValue.Type Reference

| Type | Behavior |
|------|----------|
| `FLAT` | Adds `flat_value` to the base stat. Applied first. |
| `PERCENT_BASED` | Multiplies result by `(1 + percent_value / 100)`. Applied after flats. Negative = reduction. |
| `ZERO` | Overrides the entire stat to 0. Useful for complete suppression. |

### Modifier Application Order

```
Final Value = (base_stat + sum(all_flat_values)) * (1 + sum(all_percent_values) / 100)
```

Example: Base STR = 100, +20 flat, +30% percent → `(100 + 20) * 1.3 = 156`

---

## 9. The BonusEffect System

### Overview

`BonusEffect` is the **abstract base Resource** for all effects applied by synergies, blessings, and faction oaths. Each effect gets its own **custom GDScript** — just like abilities get per-hero scripts. A `script_template` is provided to speed up creation.

### Architecture (Mirrors Abilities)

```
Abilities pattern:                    BonusEffect pattern:
  BasicAttackAbility (RefCounted)       BonusEffect (Resource)
  ├── script_template                   ├── script_template
  ├── JinxBasicAttack.gd                ├── AegisFortifiedStart.gd
  ├── VeigarBasicAttack.gd              ├── AegisGrindingAdvance.gd
  └── ...per-hero scripts               └── ...per-effect scripts
```

### Base Class

**File:** `scripts/bonus_effect/bonus_effect.gd`

```gdscript
@abstract
class_name BonusEffect
extends Resource

@export var source_id: String      # e.g., "synergy_assassin_lvl1", "oath_bulwark"
@export var persistent: bool = false  # true = applied immediately at acquisition

@abstract
func apply(targets: Array[BattleUnit] = []) -> void

@abstract
func remove() -> void
```

**Key properties:**
- `source_id` — unique identifier for modifier tracking and clean removal
- `persistent` — if `true`, the effect is applied immediately when acquired (oath chosen, blessing selected) with no unit targets. If `false` (default), it's applied at battle start with BattleUnit targets.

**Lifecycle:**
1. BonusManager **duplicates** the effect resource before applying (ensures clean state per battle)
2. `apply(targets)` is called — effect sets up modifiers, connects signals, starts timers
3. `remove()` is called at battle end — effect disconnects everything and cleans up
4. Duplicated instance is discarded

### Script Template

**File:** `script_templates/BonusEffect/bonus_effect_template.gd`

When creating a new script extending `BonusEffect` in the Godot editor, this template provides scaffolding:

```gdscript
class_name _CLASS_
extends BonusEffect

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        pass
    # Connect EventBus signals for global events:
    # EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    # EventBus.unit_damaged.connect(_on_unit_damaged)
    # EventBus.unit_died.connect(_on_unit_died)
    # EventBus.spell_cast.connect(_on_spell_cast)

func remove() -> void:
    # Disconnect all connected signals
    # Remove modifiers: unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```

### Creating a New BonusEffect

1. In Godot, create a new GDScript: `scripts/bonus_effect/synergy/my_effect.gd`
2. Select the `BonusEffect` script template
3. Rename the `class_name` (e.g., `AegisFortifiedStart`)
4. Implement `apply()` and `remove()` with your custom logic
5. Add `@export` vars for any configurable values (thresholds, percentages, etc.)
6. Create a `.tres` resource using your script, configure the exports in the inspector
7. Assign the `.tres` to the appropriate kit (SynergyKit, BlessingKit, FactionOath)

### Source ID Naming Convention

Follow this pattern for clean modifier tracking and removal:

| Context | Pattern | Example |
|---------|---------|---------|
| Synergy | `synergy_<name>_lvl<N>` | `synergy_tank_lvl1` |
| Blessing | `blessing_<name>` | `blessing_iron_will` |
| Faction Oath | `oath_<name>` | `oath_bulwark` |
| Passive ability | `<hero>_passive` | `atlas_passive` |
| BasicAttack ability | `<hero>_basic` | `atlas_basic` |
| Status effect | `<hero>_<ability>_<effect>` | `kael_spell_burn` |

---

## 10. Creating Synergy Bonuses

### What is a Synergy?

Synergies activate when you field enough heroes sharing a trait (faction or class). They have **threshold levels** — e.g., 2/4/6 units unlock increasingly powerful bonuses.

### SynergyKit Resource

**File:** `data/core/kits/synergy_kit.gd`

```gdscript
class_name SynergyKit
extends ResourceWithCustomID

@export var synergy_name: String
@export var synergy_type: GameTypes.SynergyType    # CLASS or FACTION
@export_multiline var description: String

@export_range(1, 5) var levels: int                # Number of thresholds
@export var unit_requirements: Array[int]          # e.g., [2, 4, 6]
@export var synergy_bonuses: Array[BonusEffect]    # One per threshold level
```

### Step-by-Step: Create a Synergy with Bonuses

Each synergy level gets its **own BonusEffect script** with custom behavior.

**1. Create or open a SynergyKit resource** (e.g., `data/synergies/class/tank.tres`).

**2. Set the basic properties:**
- `synergy_name`: "Tank"
- `synergy_type`: CLASS
- `levels`: 3
- `unit_requirements`: [2, 4, 6]

**3. Create a BonusEffect script for each level:**

**Level 1 (2 units) — Simple stat buff:**

Create `scripts/bonus_effect/synergy/tank_iron_wall.gd`:
```gdscript
class_name TankIronWall
extends BonusEffect

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.FLAT
        mod.flat_value = 30.0
        mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, mod)

func remove() -> void:
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```

**Level 2 (4 units) — Reactive shield on hit:**

Create `scripts/bonus_effect/synergy/tank_bulwark.gd`:
```gdscript
class_name TankBulwark
extends BonusEffect

@export var shield_percent: float = 0.06

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.unit_damaged.connect(_on_unit_damaged)

func remove() -> void:
    if EventBus.unit_damaged.is_connected(_on_unit_damaged):
        EventBus.unit_damaged.disconnect(_on_unit_damaged)
    _targets.clear()

func _on_unit_damaged(damaged: BattleUnit, _dmg: float, _atk: BattleUnit,
        _type: GameTypes.DamageType, _crit: bool, _shield: bool) -> void:
    if damaged not in _targets:
        return
    var max_hp: float = damaged.modifier_handler.get_stat("max_hp")
    damaged.combat_state.modify_shield(max_hp * shield_percent)
```

**4. Create `.tres` resources** for each script, set `source_id` in the inspector.

**5. Add them to `synergy_bonuses` array** in order: [level1, level2, level3].

### How Synergies Are Applied

```
DEPLOYMENT PHASE:
    SynergyTracker detects units on battlefield
    ├── Counts unique units per synergy
    ├── Emits EventBus.synergies_changed(unique_synergies, active_synergies)
    └── BonusManager._on_synergies_changed() updates _active_synergy_levels

BATTLE START:
    BonusManager.apply_battle_start_bonuses(player_units)
    └── _apply_synergy_bonuses(player_units):
        for each active synergy:
            1. Get the level_index from _active_synergy_levels
            2. Get bonus = synergy.synergy_bonuses[level_index]
            3. Filter targets to units that HAVE this synergy
            4. instance = bonus.duplicate()   ← clean state per battle
            5. instance.apply(targets)         ← custom script runs
            6. Track instance for battle-end cleanup
```

**Key point:** Synergy bonuses only apply to units that have that synergy in their `unit_kit.synergies` array.

### Linking Heroes to Synergies

In each hero's UnitKit resource:
```gdscript
@export var synergies: Array[SynergyKit]    # e.g., [Aegis, Tank]
@export var extra_synergy: SynergyKit       # Can be added dynamically
```

---

## 11. Creating Blessing Effects

### What is a Blessing?

Blessings are rewards offered between waves. The player picks one from a selection. Each blessing applies a `BonusEffect` that lasts the entire run.

### BlessingKit Resource

**File:** `data/core/kits/blessing_kit.gd`

```gdscript
class_name BlessingKit
extends Resource

@export var blessing_name: String
@export var category: GameTypes.BlessingCategory
@export var rarity: GameTypes.BlessingRarity
@export_multiline var description: String
@export var icon: Texture2D
@export var effect: BonusEffect              # Polymorphic!

var target_unit_kit: UnitKit                 # Set at selection time for HERO blessings
```

### Blessing Categories

| Category | Who it affects | When applied |
|----------|---------------|--------------|
| `TEAMWIDE` | All player units | Battle start |
| `HERO` | One specific hero (chosen at selection) | Battle start |
| `SYNERGY` | All player units (team-wide stat bonus) | Battle start |
| `ECONOMY` | Run economy (gold, costs) | Immediately on selection |
| `PLAYER` | Player meta-stats (life, deploy count) | Immediately on selection |

### Step-by-Step: Create a Blessing

**Example 1: Teamwide stat blessing**

1. Create a BonusEffect script `scripts/bonus_effect/blessing/blessing_iron_will.gd`:
```gdscript
class_name BlessingIronWill
extends BonusEffect

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.FLAT
        mod.flat_value = 20.0
        mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, mod)

func remove() -> void:
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```
2. Create a `.tres` resource using that script, set `source_id` to `"blessing_iron_will"`
3. Create a `BlessingKit` resource with `category`: TEAMWIDE, assign the effect `.tres`

**Example 2: Economy blessing (persistent)**

1. Create a BonusEffect script `scripts/bonus_effect/blessing/blessing_merchant_discount.gd`:
```gdscript
class_name BlessingMerchantDiscount
extends BonusEffect

@export var recruit_cost_reduction: int = 1

func apply(_targets: Array[BattleUnit] = []) -> void:
    GameRun.run_state.recruit_cost -= recruit_cost_reduction

func remove() -> void:
    GameRun.run_state.recruit_cost += recruit_cost_reduction
```
2. Create a `.tres` resource, set `persistent = true` and `source_id` in the inspector
3. Create a `BlessingKit` resource with `category`: ECONOMY, assign the effect `.tres`

---

## 12. Creating Faction Oath Effects

### What is a Faction Oath?

A Faction Oath is chosen once at the start of a run (before the first hero recruit). It provides run-wide bonuses tied to a faction's identity. Unlike blessings, faction oaths can have **multiple effects**.

### FactionOath Resource

**File:** `data/core/kits/faction_oath_kit.gd`

```gdscript
class_name FactionOath
extends ResourceWithCustomID

@export var faction_oath_name: String
@export var faction: GameTypes.Faction
@export_multiline var description: String
@export var background: Texture2D
@export var effects: Array[BonusEffect]    # Can have MULTIPLE effects!
```

### Step-by-Step: Create a Faction Oath

**Example: "Oath of the Bulwark" (Aegis faction)**

1. Create a `FactionOath` resource (e.g., `data/oaths/aegis_bulwark.tres`)
2. Set:
   - `faction_oath_name`: "Oath of the Bulwark"
   - `faction`: AEGIS
   - `description`: "All allies gain +15% max HP. You gain +1 deploy slot."

3. Create TWO BonusEffect scripts and `.tres` resources:

   **Effect 1 — Battle stat buff** (`oath_bulwark_stats.gd`):
   ```gdscript
   class_name OathBulwarkStats
   extends BonusEffect

   var _targets: Array[BattleUnit]

   func apply(targets: Array[BattleUnit] = []) -> void:
       _targets = targets
       for unit: BattleUnit in targets:
           var mod := ModifierValue.new()
           mod.type = ModifierValue.Type.PERCENT_BASED
           mod.percent_value = 15.0
           mod.source = source_id
           unit.modifier_handler.add_modifier_value(Modifier.Type.MAX_HP, mod)

   func remove() -> void:
       for unit: BattleUnit in _targets:
           if is_instance_valid(unit):
               unit.modifier_handler.remove_values_by_source(source_id)
       _targets.clear()
   ```
   Create `.tres` with `persistent = false` (applied at battle start).

   **Effect 2 — Persistent deploy slot** (`oath_bulwark_deploy.gd`):
   ```gdscript
   class_name OathBulwarkDeploy
   extends BonusEffect

   func apply(_targets: Array[BattleUnit] = []) -> void:
       GameRun.run_state.deploy_count += 1

   func remove() -> void:
       GameRun.run_state.deploy_count -= 1
   ```
   Create `.tres` with `persistent = true` (applied immediately when oath is chosen).

4. Add both `.tres` resources to the `effects` array on the FactionOath.

---

## 13. How It All Wires Together

### The Complete Flow: From Deployment to Combat

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: FACTION OATH SELECTION (once per run)             │
│                                                             │
│  Player picks oath → BonusManager stores it                 │
│  Persistent effects (persistent=true) applied IMMEDIATELY   │
│  Battle effects (persistent=false) STORED for battle start  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  PHASE 2: DEPLOYMENT (each wave)                            │
│                                                             │
│  Player places heroes on grid                               │
│  SynergyTracker counts unique units per synergy             │
│  EventBus.synergies_changed → BonusManager updates levels   │
│  Blessings may be selected between waves                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  PHASE 3: BATTLE START                                      │
│                                                             │
│  BattleHandler spawns BattleUnits from Units                │
│  Each BattleUnit._apply_kit():                              │
│    ├── ModifierHandler loads base stats + persistent mods   │
│    └── AbilityHandler.initialize():                         │
│        ├── BasicAttack.activate()  ← signals connected      │
│        ├── Spell created (not activated)                    │
│        └── Passive.activate()      ← signals connected      │
│                                                             │
│  BonusManager.apply_battle_start_bonuses(player_units):     │
│    ├── For each effect: duplicate → apply(targets) → track  │
│    ├── Synergy bonuses  → custom scripts per level          │
│    ├── Faction oath     → non-persistent effects            │
│    └── Blessings        → effect.apply() by category        │
│                                                             │
│  All stats now reflect: base + tier + persistent +          │
│  synergies + oath + blessings                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  PHASE 4: COMBAT LOOP                                       │
│                                                             │
│  UnitAI state machine drives each unit:                     │
│                                                             │
│  ChaseState → move toward target                            │
│      │                                                      │
│      ▼                                                      │
│  AutoAttackState → when in range:                           │
│      CombatResolver.resolve_auto_attack()                   │
│        ├── auto_attack_pre_resolve → BasicAttack modifies   │
│        ├── damage calc (STR, defense, crit, dodge)          │
│        ├── combat_attack_resolved → BasicAttack/Passive react│
│        └── unit_damaged → Passive reacts                    │
│      │                                                      │
│      ▼ (mana full)                                          │
│  CastState → spell.cast(target)                             │
│        ├── SpellAbility takes full control                  │
│        ├── Uses CombatResolver for damage/healing           │
│        ├── Can apply StatusEffects (CC, DoT, buffs)         │
│        ├── cast_finished → back to AutoAttackState          │
│        └── spell_cast → Passive reacts                      │
│      │                                                      │
│      ▼ (unit dies)                                          │
│  unit_died signal → Passives react                          │
│  AbilityHandler.clear() → all abilities deactivated         │
│                                                             │
│  BattleHandler._process():                                  │
│    └── Ticks all StatusEffectHandlers every frame            │
│        ├── Decrements durations                             │
│        ├── Ticks DoTs (calls CombatResolver.resolve_damage) │
│        └── Removes expired effects                          │
└─────────────────────────────────────────────────────────────┘
```

### Stat Query at Any Point During Combat

```
battle_unit.modifier_handler.get_stat("strength")
    │
    ├── 1. base = unit_kit.get_final_stat("strength")
    │      ├── base_stat from UnitKit export
    │      └── * tier_scaling: (1 + A*(T-1) + A*(T-1)²)
    │
    ├── 2. Look up modifier type: Modifier.STAT_NAME_TO_TYPE["strength"]
    │
    ├── 3. Collect all ModifierValues for STRENGTH:
    │      ├── From persistent_modifiers (items, upgrades)
    │      ├── From synergy bonuses (via BonusManager)
    │      ├── From faction oath (via BonusManager)
    │      ├── From blessings (via BonusManager)
    │      ├── From passive abilities (applied directly)
    │      └── From status effects (STAT_BUFF/STAT_DEBUFF via StatusEffectHandler)
    │
    ├── 4. Apply flat modifiers: base + sum(flat_values)
    ├── 5. Apply percent modifiers: result * (1 + sum(percent_values)/100)
    │
    └── return final_value
```

---

## 14. Combat Math Reference

### Auto-Attack Damage

```
base_damage = attacker.get_stat("strength")
base_damage *= (1 + bonus_damage_percent / 100)     ← from BasicAttack context
mitigated = base_damage * (1 - DR%)                  ← defense reduction
mitigated *= (1 - flat_damage_reduction% / 100)      ← flat DR
if crit: mitigated *= crit_damage_percent / 100       ← crit multiplier
```

### Spell Damage

```
base_damage = caster.get_stat("wisdom")
mitigated = base_damage * (1 - DR%)                  ← spell defense reduction
mitigated *= (1 - flat_damage_reduction% / 100)
# Spells cannot crit, cannot be dodged
```

### Defense Reduction Formula

```
DR% = (100 * DEF) / (500 + DEF)    ← capped at 80%

After penetration:
effective_def = DEF * (1 - percent_pen/100) - flat_pen
effective_def = max(0, effective_def)
```

### Mana Gain

- **Attacker**: gains `MANA_PER_ATTACK` (20) flat mana on each auto-attack
- **Defender**: gains mana based on pre/post-mitigation damage ratios, capped at `MANA_ON_HIT_CAP` (40)
  - Formula: `(1% of pre-mitigation damage) + (7% of post-mitigation damage)`

### Tenacity Formula

```
effective_cc_duration = base_duration * (100.0 / (100.0 + tenacity))
```

### Damage Types

| Type | Source | Defense Stat | Can Dodge | Can Crit |
|------|--------|-------------|-----------|----------|
| PHYSICAL | Auto-attacks | `phys_def` | Yes | Yes |
| SPELL | Spells, spell DoTs | `spell_def` | No | No |
| PURE | Special abilities | None | No | No |

### Damage Application Order

```
1. Shield absorbs first (emit unit_damaged with is_shield_only=true)
2. Health takes the rest (emit unit_damaged with is_shield_only=false)
3. If health <= 0 → emit unit_died
```

---

## 15. Complete Enum & Constant Reference

### GameTypes.EffectType

```gdscript
enum EffectType {
    DAMAGE,        # Direct damage (used conceptually, not as a status effect)
    HEAL,          # Healing (used conceptually)
    SHIELD,        # Shield application (used conceptually)
    DOT,           # Damage over time (ticking damage)
    STUN,          # Cannot attack, cast, or move
    SILENCE,       # Cannot cast spells
    ROOT,          # Cannot move, can still attack and cast
    STAT_BUFF,     # Timed positive stat modifier
    STAT_DEBUFF,   # Timed negative stat modifier
    TAUNT,         # Forces target to attack the taunter
    NONE
}
```

### GameTypes.DamageType

```gdscript
enum DamageType {
    PHYSICAL,   # Mitigated by phys_def, can be dodged, can crit (auto-attacks)
    SPELL,      # Mitigated by spell_def, undodgeable, cannot crit
    PURE,       # Ignores all defenses
    NONE
}
```

### GameTypes.Trigger

```gdscript
enum Trigger {
    PASSIVE,          # Always active
    CHANCE,           # Random chance per event
    ON_HIT,           # When landing an auto-attack
    ON_DAMAGE_DEALT,  # When dealing any damage
    ON_DAMAGE_TAKEN,  # When taking any damage
    PERIODIC,         # On a timer
    ON_KILL,          # When killing an enemy
    ON_CAST,          # When casting a spell
    ON_CRIT,          # When landing a critical hit
    ON_SELF_DEATH,    # When this unit dies
    ON_ALLY_DEATH,    # When an ally dies
    ON_ENEMY_DEATH,   # When an enemy dies
    ON_BATTLE_START,  # At the start of battle
    NONE
}
```

### GameTypes.ConditionType

```gdscript
enum ConditionType {
    NONE,
    STAT_THRESHOLD,     # HP/Mana/Stat value above or below a threshold
    DOT_COUNT,          # Number of DoTs active on target
    DOT_DAMAGE_TYPE,    # Check if specific damage type DoT is active
    STATUS_CHECK,       # Check for specific status effect (stunned, silenced, etc.)
    DISTANCE_CHECK,     # Range-based condition
    STAT_DEBUFF_CHECK,  # Check if target has any stat debuff
    STAT_BUFF_CHECK     # Check if target has any stat buff
}
```

### GameTypes.Targeting

```gdscript
enum Targeting {
    SELF,              # The caster
    CURRENT_TARGET,    # The unit's current attack target
    ALLIES,            # Friendly units (subset)
    ALL_ALLIES,        # All friendly units
    ENEMIES,           # Enemy units (subset)
    ALL_ENEMIES,       # All enemy units
    ALL,               # All units on the field
    NONE
}
```

### GameTypes.TargetingBehavior

```gdscript
enum TargetingBehavior {
    RANDOM,        # Pick random from pool
    NEAREST,       # Closest by distance
    FURTHEST,      # Farthest by distance
    HIGHEST_STAT,  # Highest value of a specified stat
    LOWEST_STAT,   # Lowest value of a specified stat
    ALL,           # Apply to all in pool
    NONE
}
```

### GameTypes.AoEShape

```gdscript
enum AoEShape {
    SINGLE,   # Single target
    CIRCLE,   # Circular area
    LINE,     # Line/beam
    CONE,     # Cone/fan
    CROSS,    # Cross/plus pattern
    NONE
}
```

### GameTypes.UnitStats (Enum-to-String Mapping)

Use `GameTypes.ENUM_TO_STAT_NAME[enum_value]` to convert enum to the string key for `get_stat()`:

```gdscript
const ENUM_TO_STAT_NAME = {
    UnitStats.CURRENT_HEALTH: "current_health",
    UnitStats.MAX_HEALTH: "max_hp",
    UnitStats.MISSING_HEALTH: "missing_health",
    UnitStats.SHIELD: "shield",
    UnitStats.STRENGTH: "strength",
    UnitStats.WISDOM: "wisdom",
    UnitStats.ATTACK_SPEED: "attack_speed",
    UnitStats.PHYS_DEF: "phys_def",
    UnitStats.SPELL_DEF: "spell_def",
    UnitStats.CRIT_CHANCE: "crit_chance_percent",
    UnitStats.CRIT_DAMAGE: "crit_damage_percent",
    UnitStats.CURRENT_MANA: "current_mana",
    UnitStats.MAX_MANA: "max_mana",
    UnitStats.MOVE_SPEED: "move_speed",
    UnitStats.DODGE: "dodge",
    UnitStats.ATTACK_RANGE: "attack_range",
    UnitStats.LIFESTEAL: "lifesteal_percent",
    UnitStats.TENACITY: "tenacity",
    UnitStats.DAMAGE_REDUCTION: "damage_reduction_percent",
    UnitStats.DAMAGE_AMPLIFICATION: "damage_amplification_percent",
    UnitStats.PHYS_PEN: "phys_penetration",
    UnitStats.SPELL_PEN: "spell_penetration",
    UnitStats.PHYS_PEN_PERCENT: "phys_pen_percent",
    UnitStats.SPELL_PEN_PERCENT: "spell_pen_percent",
    UnitStats.HEALING_POWER: "healing_power",
    UnitStats.SHIELDING_POWER: "shielding_power",
}
```

### Modifier.Type (Full List)

```gdscript
enum Type {
    MAX_HP, MAX_MANA, STARTING_MANA,
    STRENGTH, WISDOM, ATTACK_SPEED,
    PHYS_DEF, SPELL_DEF,
    CRIT_CHANCE, CRIT_DAMAGE, DAMAGE_AMPLIFICATION,
    PHYS_PEN_FLAT, SPELL_PEN_FLAT, PHYS_PEN_PERCENT, SPELL_PEN_PERCENT,
    DODGE, LIFESTEAL, TENACITY, DAMAGE_REDUCTION,
    HEALING_POWER, SHIELDING_POWER,
    MOVE_SPEED, ATTACK_RANGE, SHIELD,
    NO_MODIFIER
}
```

### GameTypes.Faction

```gdscript
enum Faction { AEGIS, ECLIPSE, INQUISITION, NEBULAE, NEXUS, SHOGUNATE, NONE }
```

### GameTypes.Class

```gdscript
enum Class { FIGHTER, TANK, SUPPORT, SHOOTER, ASSASSIN, CASTER, NONE }
```

### Key Constants

```gdscript
const MANA_PER_ATTACK := 20               # Flat mana gained per auto-attack
const MANA_ON_HIT_PRE_DAMAGE_RATIO := 0.01  # 1% of pre-mitigation damage
const MANA_ON_HIT_POST_DAMAGE_RATIO := 0.07 # 7% of post-mitigation damage
const MANA_ON_HIT_CAP := 40               # Max mana gained from being hit
const TIER_SCALING_COEFFICIENT := 0.06     # Tier scaling 'A' coefficient
const BATTLE_DURATION := 20.0             # Base battle duration (seconds)
```

---

## 16. EventBus Signal Reference

### Combat Signals (for abilities)

```gdscript
# BEFORE auto-attack damage — modify via context dict
signal auto_attack_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary)

# AFTER auto-attack resolves
signal combat_attack_resolved(attacker: BattleUnit, target: BattleUnit, damage: int, is_critical: bool)

# Spawn a secondary/bonus projectile that resolves via resolve_secondary_attack on arrival.
# Use instead of unit_ranged_attack_fired when the shot must NOT chain passives, grant mana,
# or trigger auto_attack_pre_resolve. Lifesteal still applies on arrival.
signal unit_ranged_effect_fired(attacker: BattleUnit, target: BattleUnit, effectiveness: float)

# When any unit takes damage (shield or health)
signal unit_damaged(damaged_unit: BattleUnit, damage: float, attacking_unit: BattleUnit,
                    damage_type: GameTypes.DamageType, is_crit: bool, is_shield_only: bool)

# When any unit dodges
signal unit_dodged(dodging_unit: BattleUnit, attacker: BattleUnit)

# When any unit is healed
signal unit_healed(healed_unit: BattleUnit, heal_amount: float)

# When any unit dies
signal unit_died(battle_unit: BattleUnit)

# When any unit casts a spell
signal spell_cast(caster: BattleUnit)

# When a status effect is applied/removed
signal status_effect_applied(unit: BattleUnit, effect_type: GameTypes.EffectType, source: String)
signal status_effect_removed(unit: BattleUnit, effect_type: GameTypes.EffectType, source: String)
```

### Unit State Signals

```gdscript
signal battle_unit_health_changed(battle_unit: BattleUnit, new_health: int, max_health: int)
signal battle_unit_mana_changed(battle_unit: BattleUnit, new_mana: int, max_mana: int)
signal battle_unit_spell_ready(battle_unit: BattleUnit)
```

### Synergy / Bonus Signals

```gdscript
# Synergies recalculated (deployment phase)
signal synergies_changed(unique: Dictionary[SynergyKit, int], active: Array[SynergyKit])

# Faction oath chosen
signal faction_oath_chosen(oath: FactionOath)
```

### Battle Lifecycle Signals

```gdscript
signal battle_start_requested()
signal battle_started()
signal battle_won()
signal battle_lost()
signal battle_ended()
```

---

## 17. Recipe Book: Complete Implementation Examples

This section provides **copy-paste-ready** implementations for common ability patterns. Each recipe is a complete, working GDScript file.

---

### Recipe 1: Single-Target Damage Spell

A spell that deals 100% WIS as spell damage to one target.

```gdscript
extends SpellAbility
class_name FireboltSpell

## Fires a bolt at the target dealing 100% WIS as spell damage.
## Tier 7: Also reduces target's spell defense by 20% for 3s.


func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target) or not primary_target.combat_state.is_alive():
        cast_finished.emit()
        return

    # Deal 100% WIS as spell damage (uses default resolve_spell_cast)
    CombatResolver.resolve_spell_cast(owner, null, primary_target)

    # Tier 7: Apply spell defense debuff
    if is_enhanced() and is_instance_valid(primary_target) and primary_target.combat_state.is_alive():
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.PERCENT_BASED
        mod.percent_value = -20.0
        mod.source = "firebolt_spell_def_shred"

        var debuff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_DEBUFF,
            "firebolt_spell_def_shred",
            owner,
            3.0,
            Modifier.Type.SPELL_DEF,
            mod
        )
        primary_target.status_effect_handler.apply_effect(debuff)

    cast_finished.emit()
```

---

### Recipe 2: AoE Damage Spell (All Enemies)

A spell that damages all enemies.

```gdscript
extends SpellAbility
class_name ShockwaveSpell

## Deals 60% WIS as spell damage to ALL enemies.
## Tier 7: Also stuns all hit enemies for 1s.


func cast(primary_target: BattleUnit) -> void:
    var damage: float = owner.modifier_handler.get_stat("wisdom") * 0.6
    var enemies := TargetingSystem.get_all_enemies(owner)

    for enemy in enemies:
        if is_instance_valid(enemy) and enemy.combat_state.is_alive():
            CombatResolver.resolve_damage(enemy, damage, GameTypes.DamageType.SPELL, owner)

    # Tier 7: Stun all enemies hit
    if is_enhanced():
        for enemy in enemies:
            if is_instance_valid(enemy) and enemy.combat_state.is_alive():
                var stun := StatusEffect.create_cc(
                    GameTypes.EffectType.STUN,
                    "shockwave_stun",
                    owner,
                    1.0
                )
                enemy.status_effect_handler.apply_effect(stun)

    cast_finished.emit()
```

---

### Recipe 3: DoT Spell (Damage Over Time)

A spell that applies a poison DoT.

```gdscript
extends SpellAbility
class_name VenomStrikeSpell

## Applies a stackable poison to the target.
## Poison deals 20 SPELL damage every 1s for 5s.
## Tier 7: Also applies poison to 2 additional random enemies.

const POISON_DAMAGE: float = 20.0
const POISON_INTERVAL: float = 1.0
const POISON_DURATION: float = 5.0


func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target) or not primary_target.combat_state.is_alive():
        cast_finished.emit()
        return

    _apply_poison(primary_target)

    # Tier 7: Spread to 2 additional enemies
    if is_enhanced():
        var enemies := TargetingSystem.get_all_enemies(owner)
        var spread_count: int = 0
        for enemy in enemies:
            if enemy == primary_target:
                continue
            if not is_instance_valid(enemy) or not enemy.combat_state.is_alive():
                continue
            _apply_poison(enemy)
            spread_count += 1
            if spread_count >= 2:
                break

    cast_finished.emit()


func _apply_poison(target: BattleUnit) -> void:
    var poison := StatusEffect.create_dot(
        "venom_strike_poison",
        owner,
        POISON_DURATION,
        POISON_DAMAGE,
        POISON_INTERVAL,
        GameTypes.DamageType.SPELL,
        true    # stackable
    )
    target.status_effect_handler.apply_effect(poison)
```

---

### Recipe 4: Debuff Spell (Stat Reduction)

A spell that applies multiple stat debuffs.

```gdscript
extends SpellAbility
class_name CurseSpell

## Curses the target for 4s, reducing their STR by 30% and attack speed by 25%.
## Also deals 50% WIS as spell damage.
## Tier 7: Curse affects all enemies.

const CURSE_DURATION: float = 4.0


func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target) or not primary_target.combat_state.is_alive():
        cast_finished.emit()
        return

    var targets: Array[BattleUnit] = []

    if is_enhanced():
        # Tier 7: Affect all enemies
        for enemy in TargetingSystem.get_all_enemies(owner):
            if is_instance_valid(enemy) and enemy.combat_state.is_alive():
                targets.append(enemy)
    else:
        targets.append(primary_target)

    var damage: float = owner.modifier_handler.get_stat("wisdom") * 0.5

    for target in targets:
        if not is_instance_valid(target) or not target.combat_state.is_alive():
            continue

        # Deal damage
        CombatResolver.resolve_damage(target, damage, GameTypes.DamageType.SPELL, owner)

        # Apply STR debuff
        var str_mod := ModifierValue.new()
        str_mod.type = ModifierValue.Type.PERCENT_BASED
        str_mod.percent_value = -30.0
        str_mod.source = "curse_str_debuff"

        var str_debuff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_DEBUFF,
            "curse_str_debuff",
            owner,
            CURSE_DURATION,
            Modifier.Type.STRENGTH,
            str_mod
        )
        target.status_effect_handler.apply_effect(str_debuff)

        # Apply Attack Speed debuff
        var as_mod := ModifierValue.new()
        as_mod.type = ModifierValue.Type.PERCENT_BASED
        as_mod.percent_value = -25.0
        as_mod.source = "curse_aspd_debuff"

        var as_debuff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_DEBUFF,
            "curse_aspd_debuff",
            owner,
            CURSE_DURATION,
            Modifier.Type.ATTACK_SPEED,
            as_mod
        )
        target.status_effect_handler.apply_effect(as_debuff)

    cast_finished.emit()
```

---

### Recipe 5: Shield & Buff Spell (Support)

A spell that shields and buffs allies.

```gdscript
extends SpellAbility
class_name BulwarkSpell

## Grants all allies a shield equal to 40% of caster's max HP
## and +20 flat physical defense for 4s.
## Tier 7: Shield amount increased to 60%, also grants +20 spell defense.


func cast(_primary_target: BattleUnit) -> void:
    var max_hp: float = owner.modifier_handler.get_stat("max_hp")
    var shield_percent: float = 0.60 if is_enhanced() else 0.40
    var shield_amount: float = max_hp * shield_percent

    var allies := TargetingSystem.get_all_allies(owner)

    for ally in allies:
        if not is_instance_valid(ally) or not ally.combat_state.is_alive():
            continue

        # Apply shield
        ally.combat_state.modify_shield(shield_amount)

        # Apply phys def buff
        var phys_mod := ModifierValue.new()
        phys_mod.type = ModifierValue.Type.FLAT
        phys_mod.flat_value = 20
        phys_mod.source = "bulwark_phys_buff"

        var phys_buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF,
            "bulwark_phys_buff",
            owner,
            4.0,
            Modifier.Type.PHYS_DEF,
            phys_mod
        )
        ally.status_effect_handler.apply_effect(phys_buff)

        # Tier 7: Also spell def
        if is_enhanced():
            var spell_mod := ModifierValue.new()
            spell_mod.type = ModifierValue.Type.FLAT
            spell_mod.flat_value = 20
            spell_mod.source = "bulwark_spell_buff"

            var spell_buff := StatusEffect.create_stat_mod(
                GameTypes.EffectType.STAT_BUFF,
                "bulwark_spell_buff",
                owner,
                4.0,
                Modifier.Type.SPELL_DEF,
                spell_mod
            )
            ally.status_effect_handler.apply_effect(spell_buff)

    cast_finished.emit()
```

---

### Recipe 6: Healing Spell (Support)

A spell that heals the lowest-HP ally.

```gdscript
extends SpellAbility
class_name HealingLightSpell

## Heals the lowest-HP ally for 80% of caster's WIS.
## Tier 7: Also heals all other allies for 30% of caster's WIS.


func cast(_primary_target: BattleUnit) -> void:
    var wisdom: float = owner.modifier_handler.get_stat("wisdom")
    var main_heal: float = wisdom * 0.80

    # Find the lowest-HP ally
    var lowest_ally: BattleUnit = _get_lowest_hp_ally()
    if lowest_ally == null:
        cast_finished.emit()
        return

    # Heal the lowest-HP ally
    CombatResolver.resolve_healing(lowest_ally, main_heal, owner)

    # Tier 7: Heal all other allies for 30% WIS
    if is_enhanced():
        var splash_heal: float = wisdom * 0.30
        var allies := TargetingSystem.get_all_allies(owner)
        for ally in allies:
            if ally == lowest_ally:
                continue
            if is_instance_valid(ally) and ally.combat_state.is_alive():
                CombatResolver.resolve_healing(ally, splash_heal, owner)

    cast_finished.emit()


func _get_lowest_hp_ally() -> BattleUnit:
    var allies := TargetingSystem.get_all_allies(owner)
    var lowest: BattleUnit = null
    for ally in allies:
        if not is_instance_valid(ally) or not ally.combat_state.is_alive():
            continue
        if lowest == null or ally.combat_state.current_health < lowest.combat_state.current_health:
            lowest = ally
    return lowest
```

---

### Recipe 7: Multi-Phase Tween Spell (Delayed Effects)

A spell with multiple phases using tween timing.

```gdscript
extends SpellAbility
class_name MeteorStrikeSpell

## Phase 1: Root the primary target for 1.5s.
## Phase 2 (after 0.8s): Deal 120% WIS as spell damage to all enemies.
## Tier 7: Also apply a 3s burn DoT to all enemies hit.


func cast(primary_target: BattleUnit) -> void:
    if not is_instance_valid(primary_target) or not primary_target.combat_state.is_alive():
        cast_finished.emit()
        return

    # Phase 1: Root the primary target
    var root := StatusEffect.create_cc(
        GameTypes.EffectType.ROOT,
        "meteor_root",
        owner,
        1.5
    )
    primary_target.status_effect_handler.apply_effect(root)

    # Phase 2: Delayed AoE damage
    var tween := owner.create_tween()
    tween.tween_interval(0.8)
    tween.tween_callback(_aoe_phase)
    tween.tween_callback(cast_finished.emit)


func _aoe_phase() -> void:
    if not is_instance_valid(owner) or not owner.combat_state.is_alive():
        return

    var damage: float = owner.modifier_handler.get_stat("wisdom") * 1.2
    var enemies := TargetingSystem.get_all_enemies(owner)

    for enemy in enemies:
        if not is_instance_valid(enemy) or not enemy.combat_state.is_alive():
            continue

        CombatResolver.resolve_damage(enemy, damage, GameTypes.DamageType.SPELL, owner)

        # Tier 7: Apply burn DoT
        if is_enhanced():
            var burn := StatusEffect.create_dot(
                "meteor_burn",
                owner,
                3.0,            # duration
                15.0,           # damage per tick
                1.0,            # tick interval
                GameTypes.DamageType.SPELL,
                false           # non-stackable (refreshes on reapply)
            )
            enemy.status_effect_handler.apply_effect(burn)
```

---

### Recipe 8: Taunt Spell (Tank)

A spell that taunts all enemies.

```gdscript
extends SpellAbility
class_name ProvocationSpell

## Taunts all enemies for 2s, forcing them to attack the caster.
## Also grants self +30% damage reduction for 3s.
## Tier 7: Taunt duration increased to 3s, also stuns enemies for 0.5s.


func cast(_primary_target: BattleUnit) -> void:
    var taunt_duration: float = 3.0 if is_enhanced() else 2.0
    var enemies := TargetingSystem.get_all_enemies(owner)

    for enemy in enemies:
        if not is_instance_valid(enemy) or not enemy.combat_state.is_alive():
            continue

        # Apply taunt
        var taunt := StatusEffect.create_taunt("provocation_taunt", owner, taunt_duration)
        enemy.status_effect_handler.apply_effect(taunt)

        # Tier 7: Brief stun
        if is_enhanced():
            var stun := StatusEffect.create_cc(
                GameTypes.EffectType.STUN,
                "provocation_stun",
                owner,
                0.5
            )
            enemy.status_effect_handler.apply_effect(stun)

    # Self damage reduction buff
    var dr_mod := ModifierValue.new()
    dr_mod.type = ModifierValue.Type.FLAT
    dr_mod.flat_value = 30
    dr_mod.source = "provocation_dr"

    var dr_buff := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_BUFF,
        "provocation_dr",
        owner,
        3.0,
        Modifier.Type.DAMAGE_REDUCTION,
        dr_mod
    )
    owner.status_effect_handler.apply_effect(dr_buff)

    cast_finished.emit()
```

---

### Recipe 9: Conditional Passive (React to DoTs on Target)

A passive that deals bonus damage to enemies with DoTs.

```gdscript
extends PassiveAbility
class_name VenomousStrikesPassive

## Auto-attacks deal 10% bonus damage for each DoT on the target.
## Tier 3: Bonus increased to 15% per DoT and also adds +10% crit chance per DoT.


func activate() -> void:
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)


func deactivate() -> void:
    EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)


func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return

    # Count DoTs on the target
    var dot_count: int = target.status_effect_handler.get_effects_by_type(GameTypes.EffectType.DOT).size()

    if dot_count <= 0:
        return

    var damage_per_dot: float = 15.0 if is_enhanced() else 10.0
    context.bonus_damage_percent += damage_per_dot * dot_count

    # Tier 3: Also bonus crit per DoT
    if is_enhanced():
        context.bonus_crit_chance += 10.0 * dot_count
```

---

### Recipe 10: Conditional Passive (React to Debuffs on Target)

A passive that empowers attacks against debuffed enemies.

```gdscript
extends PassiveAbility
class_name ExploitWeaknessPassive

## Attacks against enemies with any STAT_DEBUFF deal +30% bonus damage.
## Tier 3: Also applies a 2s armor shred (-15 flat phys def) on hit against debuffed targets.


func activate() -> void:
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)


func deactivate() -> void:
    EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)


func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return

    if target.status_effect_handler.has_effect(GameTypes.EffectType.STAT_DEBUFF):
        context.bonus_damage_percent += 30.0


func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, _damage: int, _is_critical: bool) -> void:
    if attacker != owner:
        return
    if not is_enhanced():
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return

    # Tier 3: Apply armor shred to debuffed targets
    if target.status_effect_handler.has_effect(GameTypes.EffectType.STAT_DEBUFF):
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.FLAT
        mod.flat_value = -15
        mod.source = "exploit_weakness_shred"

        var shred := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_DEBUFF,
            "exploit_weakness_shred",
            owner,
            2.0,
            Modifier.Type.PHYS_DEF,
            mod
        )
        target.status_effect_handler.apply_effect(shred)
```

---

### Recipe 11: On-Kill Passive with Stacking Buff

A passive that grows stronger with each kill.

```gdscript
extends PassiveAbility
class_name BloodlustPassive

## On enemy kill: gain +5% attack speed permanently (stacks up to 10 times).
## Tier 3: Each stack also grants +3% lifesteal.

var stacks: int = 0
const MAX_STACKS: int = 10
const ASPD_PER_STACK: float = 5.0
const LIFESTEAL_PER_STACK: float = 3.0


func activate() -> void:
    EventBus.unit_died.connect(_on_unit_died)
    stacks = 0


func deactivate() -> void:
    EventBus.unit_died.disconnect(_on_unit_died)
    owner.modifier_handler.remove_values_by_source("bloodlust_aspd")
    owner.modifier_handler.remove_values_by_source("bloodlust_lifesteal")


func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Only trigger on enemy deaths
    if dead_unit.unit_kit.unit_type == owner.unit_kit.unit_type:
        return

    if stacks >= MAX_STACKS:
        return

    stacks += 1
    _refresh_modifiers()


func _refresh_modifiers() -> void:
    # Remove old and apply updated
    owner.modifier_handler.remove_values_by_source("bloodlust_aspd")

    var aspd_mod := ModifierValue.new()
    aspd_mod.type = ModifierValue.Type.PERCENT_BASED
    aspd_mod.percent_value = ASPD_PER_STACK * stacks
    aspd_mod.source = "bloodlust_aspd"
    owner.modifier_handler.add_modifier_value(Modifier.Type.ATTACK_SPEED, aspd_mod)

    # Tier 3: Also grant lifesteal
    if is_enhanced():
        owner.modifier_handler.remove_values_by_source("bloodlust_lifesteal")

        var ls_mod := ModifierValue.new()
        ls_mod.type = ModifierValue.Type.FLAT
        ls_mod.flat_value = LIFESTEAL_PER_STACK * stacks
        ls_mod.source = "bloodlust_lifesteal"
        owner.modifier_handler.add_modifier_value(Modifier.Type.LIFESTEAL, ls_mod)
```

---

### Recipe 12: BasicAttack with CC (Stun on Every Nth Attack)

```gdscript
extends BasicAttackAbility
class_name ThunderStrikeBasicAttack

## Every 4th attack stuns the target for 1s.
## Tier 5: Every 3rd attack, and stun duration increased to 1.5s.

var attack_count: int = 0


func activate() -> void:
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    attack_count = 0


func deactivate() -> void:
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)


func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, _damage: int, _is_critical: bool) -> void:
    if attacker != owner:
        return

    attack_count += 1

    var trigger_interval: int = 3 if is_enhanced() else 4
    var stun_duration: float = 1.5 if is_enhanced() else 1.0

    if attack_count % trigger_interval == 0:
        if is_instance_valid(target) and target.combat_state.is_alive():
            var stun := StatusEffect.create_cc(
                GameTypes.EffectType.STUN,
                "thunder_strike_stun",
                owner,
                stun_duration
            )
            target.status_effect_handler.apply_effect(stun)
```

---

### Recipe 13: BasicAttack with On-Hit DoT

```gdscript
extends BasicAttackAbility
class_name PoisonBladeBasicAttack

## Each attack applies a non-stackable poison DoT (10 PHYSICAL damage/s for 3s).
## Tier 5: Poison damage increased to 20/s, becomes stackable.


func activate() -> void:
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)


func deactivate() -> void:
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)


func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, _damage: int, _is_critical: bool) -> void:
    if attacker != owner:
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return

    var dot_damage: float = 20.0 if is_enhanced() else 10.0
    var stackable: bool = true if is_enhanced() else false

    var poison := StatusEffect.create_dot(
        "poison_blade_dot",
        owner,
        3.0,
        dot_damage,
        1.0,
        GameTypes.DamageType.PHYSICAL,
        stackable
    )
    target.status_effect_handler.apply_effect(poison)
```

---

### Recipe 14: Passive that Reacts to Status Effects

A passive that triggers effects when specific status effects are applied.

```gdscript
extends PassiveAbility
class_name ArcaneResonancePassive

## When ANY enemy is stunned, deal 30% WIS as PURE damage to them.
## Tier 3: Also deal 15% WIS damage to all OTHER enemies.


func activate() -> void:
    EventBus.status_effect_applied.connect(_on_status_applied)


func deactivate() -> void:
    EventBus.status_effect_applied.disconnect(_on_status_applied)


func _on_status_applied(unit: BattleUnit, effect_type: GameTypes.EffectType, _source: String) -> void:
    # Only react to stuns on enemies
    if effect_type != GameTypes.EffectType.STUN:
        return
    if unit.unit_kit.unit_type == owner.unit_kit.unit_type:
        return    # Ally was stunned, ignore

    if not is_instance_valid(owner) or not owner.combat_state.is_alive():
        return

    var wisdom: float = owner.modifier_handler.get_stat("wisdom")

    # Deal damage to the stunned enemy
    if is_instance_valid(unit) and unit.combat_state.is_alive():
        CombatResolver.resolve_damage(unit, wisdom * 0.30, GameTypes.DamageType.PURE, owner)

    # Tier 3: Splash damage to all other enemies
    if is_enhanced():
        var enemies := TargetingSystem.get_all_enemies(owner)
        for enemy in enemies:
            if enemy == unit:
                continue
            if is_instance_valid(enemy) and enemy.combat_state.is_alive():
                CombatResolver.resolve_damage(enemy, wisdom * 0.15, GameTypes.DamageType.PURE, owner)
```

---

### Recipe 15: Passive with Conditional HP Threshold

A passive that activates a buff when HP drops below a threshold.

```gdscript
extends PassiveAbility
class_name LastStandPassive

## When owner drops below 50% HP, gain +40% attack speed and +20% lifesteal.
## Effect lasts until battle end (permanent once triggered).
## Tier 3: Threshold increased to 60% HP, also grants +15% damage reduction.

var triggered: bool = false


func activate() -> void:
    EventBus.unit_damaged.connect(_on_unit_damaged)
    triggered = false


func deactivate() -> void:
    EventBus.unit_damaged.disconnect(_on_unit_damaged)
    owner.modifier_handler.remove_values_by_source("last_stand")


func _on_unit_damaged(
    damaged_unit: BattleUnit,
    _damage: float,
    _attacking_unit: BattleUnit,
    _damage_type: GameTypes.DamageType,
    _is_crit: bool,
    _is_shield_only: bool
) -> void:
    if damaged_unit != owner:
        return
    if triggered:
        return

    var max_hp: float = owner.modifier_handler.get_stat("max_hp")
    var hp_threshold: float = 0.60 if is_enhanced() else 0.50

    if owner.combat_state.current_health > max_hp * hp_threshold:
        return

    triggered = true

    # Apply attack speed buff
    var aspd_mod := ModifierValue.new()
    aspd_mod.type = ModifierValue.Type.PERCENT_BASED
    aspd_mod.percent_value = 40.0
    aspd_mod.source = "last_stand"
    owner.modifier_handler.add_modifier_value(Modifier.Type.ATTACK_SPEED, aspd_mod)

    # Apply lifesteal buff
    var ls_mod := ModifierValue.new()
    ls_mod.type = ModifierValue.Type.FLAT
    ls_mod.flat_value = 20
    ls_mod.source = "last_stand"
    owner.modifier_handler.add_modifier_value(Modifier.Type.LIFESTEAL, ls_mod)

    # Tier 3: Also damage reduction
    if is_enhanced():
        var dr_mod := ModifierValue.new()
        dr_mod.type = ModifierValue.Type.FLAT
        dr_mod.flat_value = 15
        dr_mod.source = "last_stand"
        owner.modifier_handler.add_modifier_value(Modifier.Type.DAMAGE_REDUCTION, dr_mod)
```

---

### Recipe 16: BasicAttack with Cleave and Damage Scaling

```gdscript
extends BasicAttackAbility
class_name CleaveBasicAttack

## Attacks hit all enemies (full cleave). Cleave targets take 50% damage.
## Tier 5: Cleave targets take 75% damage and attacks gain +15% crit chance.


func activate() -> void:
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)


func deactivate() -> void:
    EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)


func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return

    # Note: extra_targets receive the same damage calculation as the primary target.
    # The cleave damage reduction must be handled differently if needed.
    # For now, add all enemies as extra targets.
    var all_enemies := TargetingSystem.get_all_enemies(owner)
    for enemy in all_enemies:
        if enemy != target and is_instance_valid(enemy) and enemy.combat_state.is_alive():
            context.extra_targets.append(enemy)

    # Tier 5: +15% crit chance
    if is_enhanced():
        context.bonus_crit_chance += 15.0
```

---

### Recipe 17: Spell that Uses Untargetability (Blink/Vanish)

```gdscript
extends SpellAbility
class_name ShadowStrikeSpell

## Become untargetable for 0.5s, then deal 150% WIS as PURE damage
## to the lowest-HP enemy.
## Tier 7: Also silence the target for 2s.


func cast(_primary_target: BattleUnit) -> void:
    # Phase 1: Go untargetable
    owner.combat_state.set_untargetable_for(500)  # 500ms

    # Phase 2: After 0.5s, strike
    var tween := owner.create_tween()
    tween.tween_interval(0.5)
    tween.tween_callback(_strike_phase)
    tween.tween_callback(cast_finished.emit)


func _strike_phase() -> void:
    if not is_instance_valid(owner) or not owner.combat_state.is_alive():
        return

    # Find lowest HP enemy
    var target: BattleUnit = _get_lowest_hp_enemy()
    if target == null:
        return

    var damage: float = owner.modifier_handler.get_stat("wisdom") * 1.5
    CombatResolver.resolve_damage(target, damage, GameTypes.DamageType.PURE, owner)

    # Tier 7: Silence
    if is_enhanced() and is_instance_valid(target) and target.combat_state.is_alive():
        var silence := StatusEffect.create_cc(
            GameTypes.EffectType.SILENCE,
            "shadow_strike_silence",
            owner,
            2.0
        )
        target.status_effect_handler.apply_effect(silence)


func _get_lowest_hp_enemy() -> BattleUnit:
    var enemies := TargetingSystem.get_all_enemies(owner)
    var lowest: BattleUnit = null
    for enemy in enemies:
        if lowest == null or enemy.combat_state.current_health < lowest.combat_state.current_health:
            lowest = enemy
    return lowest
```

---

### Recipe 18: Complex Passive with Multiple Triggers

```gdscript
extends PassiveAbility
class_name WarMasterPassive

## - On auto-attack: gain +1 stack of Momentum (max 10).
##   Each stack grants +3% attack speed.
## - On spell cast (ally): gain 20 shield.
## - On enemy death: gain +5% damage for the rest of the battle.
## Tier 3: Momentum max stacks increased to 15, death bonus increased to 8%.

var momentum_stacks: int = 0
var kill_stacks: int = 0


func activate() -> void:
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    EventBus.spell_cast.connect(_on_spell_cast)
    EventBus.unit_died.connect(_on_unit_died)
    momentum_stacks = 0
    kill_stacks = 0


func deactivate() -> void:
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    EventBus.spell_cast.disconnect(_on_spell_cast)
    EventBus.unit_died.disconnect(_on_unit_died)
    owner.modifier_handler.remove_values_by_source("warmaster_momentum")
    owner.modifier_handler.remove_values_by_source("warmaster_kill_bonus")


func _on_attack_resolved(attacker: BattleUnit, _target: BattleUnit, _damage: int, _is_critical: bool) -> void:
    if attacker != owner:
        return

    var max_stacks: int = 15 if is_enhanced() else 10
    if momentum_stacks >= max_stacks:
        return

    momentum_stacks += 1
    _refresh_momentum()


func _on_spell_cast(caster: BattleUnit) -> void:
    # React to ally spells (including own)
    if caster.unit_kit.unit_type != owner.unit_kit.unit_type:
        return
    owner.combat_state.modify_shield(20.0)


func _on_unit_died(dead_unit: BattleUnit) -> void:
    if dead_unit.unit_kit.unit_type == owner.unit_kit.unit_type:
        return    # Ally died

    kill_stacks += 1
    _refresh_kill_bonus()


func _refresh_momentum() -> void:
    owner.modifier_handler.remove_values_by_source("warmaster_momentum")
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.PERCENT_BASED
    mod.percent_value = 3.0 * momentum_stacks
    mod.source = "warmaster_momentum"
    owner.modifier_handler.add_modifier_value(Modifier.Type.ATTACK_SPEED, mod)


func _refresh_kill_bonus() -> void:
    owner.modifier_handler.remove_values_by_source("warmaster_kill_bonus")
    var bonus_per_kill: float = 8.0 if is_enhanced() else 5.0
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.PERCENT_BASED
    mod.percent_value = bonus_per_kill * kill_stacks
    mod.source = "warmaster_kill_bonus"
    owner.modifier_handler.add_modifier_value(Modifier.Type.DAMAGE_AMPLIFICATION, mod)
```

---

### Recipe 19: BasicAttack with Secondary Projectile (Conditional Proc + No Passive Chain)

**Scenario:** On every auto-attack, there is a 15% chance (30% while a specific spell is active) to fire a bonus projectile at a **random** enemy in range for 30% STR as Physical damage. The bonus shot must not trigger passives, grant mana, or chain further procs. Lifesteal still applies.

**Key patterns demonstrated:**
- `get_attack_target()` override for spell-conditional random targeting
- `unit_ranged_effect_fired` for secondary projectiles
- `resolve_secondary_attack` for isolated damage + lifesteal
- Reentrancy guard (`_second_shot_in_progress`) to prevent cascading
- Conditional proc chance based on spell state

```gdscript
extends BasicAttackAbility
class_name ExampleSecondaryProjectileBasicAttack

const PROC_CHANCE_BASE: float = 15.0
const PROC_CHANCE_SPELL_ACTIVE: float = 30.0
const PROC_EFFECTIVENESS: float = 0.30
const PROC_DELAY: float = 0.15
const BULLETSTORM_BONUS_DAMAGE: float = 20.0

var _second_shot_in_progress: bool = false


func activate() -> void:
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)


func deactivate() -> void:
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)


## Redirect main attack to random enemy while the spell is active.
func get_attack_target(default_target: BattleUnit) -> BattleUnit:
    var spell := owner.ability_handler.spell as MyHeroSpell
    if spell == null or not spell.is_active:
        return default_target
    var random_target := _find_random_enemy_in_range()
    return random_target if random_target != null else default_target


## While spell is active, add +20% bonus damage to the main attack.
func _on_pre_resolve(attacker: BattleUnit, _target: BattleUnit, context: Dictionary) -> void:
    if attacker != owner:
        return
    var spell := owner.ability_handler.spell as MyHeroSpell
    if spell != null and spell.is_active:
        context["bonus_damage_percent"] += BULLETSTORM_BONUS_DAMAGE


func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, _damage: int, _is_critical: bool) -> void:
    if attacker != owner:
        return
    if _second_shot_in_progress:
        return  # Guard: ignore if we're already setting up a secondary shot
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return

    if is_enhanced():
        var spell := owner.ability_handler.spell as MyHeroSpell
        var chance := PROC_CHANCE_SPELL_ACTIVE if (spell != null and spell.is_active) else PROC_CHANCE_BASE
        if randf() * 100.0 < chance:
            _fire_secondary_shot()


func _fire_secondary_shot() -> void:
    # Hold the guard while picking a target to block cascading signals.
    _second_shot_in_progress = true
    var shot_target := _find_random_enemy_in_range()
    _second_shot_in_progress = false

    if shot_target == null:
        return

    # Small delay for visual stagger, then emit the secondary projectile signal.
    # BattleUnitPresenter spawns a Projectile using setup_secondary(), which calls
    # CombatResolver.resolve_secondary_attack on arrival: 30% STR + lifesteal, no side effects.
    var tween := owner.create_tween()
    tween.tween_interval(PROC_DELAY)
    tween.tween_callback(func():
        if not is_instance_valid(shot_target) or not shot_target.combat_state.is_alive():
            return
        EventBus.unit_ranged_effect_fired.emit(owner, shot_target, PROC_EFFECTIVENESS)
    )


func _find_random_enemy_in_range() -> BattleUnit:
    var enemies := TargetingSystem.get_all_enemies(owner)
    var attack_range: int = int(owner.modifier_handler.get_stat("attack_range"))
    var in_range: Array[BattleUnit] = []
    for enemy: BattleUnit in enemies:
        var dist := UnitNavigation.get_distance_in_tiles(owner, enemy)
        if dist != -1 and dist <= attack_range:
            in_range.append(enemy)
    if in_range.is_empty():
        return null
    return in_range[randi() % in_range.size()]
```

> **Why `unit_ranged_effect_fired` instead of `unit_ranged_attack_fired`?**
> `unit_ranged_attack_fired` spawns a `Projectile` that calls `resolve_auto_attack` on arrival — which emits `combat_attack_resolved` (chaining passives), grants mana, and fires `auto_attack_pre_resolve`. For bonus shots that should be isolated, always use `unit_ranged_effect_fired`, which spawns a projectile that calls `resolve_secondary_attack` instead.

---

## 18. BonusEffect Recipe Book

This section provides **copy-paste-ready** BonusEffect implementations covering every effect category. Each recipe is a complete, working GDScript that extends `BonusEffect`.

---

### Recipe A: Simple Stat Modifiers

Apply flat or percent-based modifiers at battle start, clean up via `source_id`.

```gdscript
class_name TeamStrengthBuff
extends BonusEffect

## Grants all targets +15% Strength.

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.PERCENT_BASED
        mod.percent_value = 15.0
        mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.STRENGTH, mod)

func remove() -> void:
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```

---

### Recipe B: Positioning — Adjacent Ally Shield

Count adjacent allies (distance 1) and grant a shield based on count.

```gdscript
class_name AegisFortifiedStart
extends BonusEffect

## Allies start battle with Shield = 5% Max HP per adjacent ally.

@export var shield_per_ally_percent: float = 0.05

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        # Count adjacent allies (distance = 1 tile)
        var adjacent_count: int = 0
        for ally: BattleUnit in targets:
            if ally == unit:
                continue
            var dist: int = UnitNavigation.get_distance_in_tiles(unit, ally)
            if dist == 1:
                adjacent_count += 1

        if adjacent_count > 0:
            var max_hp: float = unit.modifier_handler.get_stat("max_hp")
            var shield: float = max_hp * shield_per_ally_percent * adjacent_count
            unit.combat_state.modify_shield(shield)

func remove() -> void:
    _targets.clear()
```

---

### Recipe C: Movement — Backline Jump

Teleport units to the enemy backline at battle start.

```gdscript
class_name AssassinBacklineJump
extends BonusEffect

## At battle start, Assassins jump to the furthest enemy's backline.

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var enemies := TargetingSystem.get_all_enemies(unit)
        if enemies.is_empty():
            continue

        # Find the furthest enemy (deepest in the enemy backline)
        var furthest_enemy: BattleUnit = null
        var max_dist: int = -1
        for enemy in enemies:
            var dist: int = UnitNavigation.get_distance_in_tiles(unit, enemy)
            if dist > max_dist:
                max_dist = dist
                furthest_enemy = enemy

        if furthest_enemy == null:
            continue

        # Teleport near that enemy (find adjacent empty tile)
        var enemy_tile: Vector2i = UnitNavigation.get_unit_tile(furthest_enemy)
        var unit_tile: Vector2i = UnitNavigation.get_unit_tile(unit)

        # Try tiles adjacent to the enemy
        var neighbors := UnitNavigation.get_neighbors(enemy_tile)
        for neighbor: Vector2i in neighbors:
            if UnitNavigation.is_tile_valid(neighbor) and not UnitNavigation.is_tile_occupied(neighbor):
                UnitNavigation.move_unit_to_tile(unit, unit_tile, neighbor)
                unit.combat_state.set_untargetable_for(500)  # brief untargetable
                break

func remove() -> void:
    _targets.clear()
```

---

### Recipe D: Timed Effect — Periodic Stacking Buff

Grant a stacking buff every N seconds using an async loop.

```gdscript
class_name AegisGrindingAdvance
extends BonusEffect

## Every 2s, grant +2% Damage Reduction to all allies (stacks up to 10).

@export var tick_interval: float = 2.0
@export var dr_per_stack: float = 2.0
@export var max_stacks: int = 10

var _targets: Array[BattleUnit]
var _active: bool = false
var _current_stacks: int = 0

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _active = true
    _current_stacks = 0
    _tick_loop()

func remove() -> void:
    _active = false
    # Remove all applied modifiers
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()

func _tick_loop() -> void:
    while _active and _current_stacks < max_stacks:
        if _targets.is_empty():
            break
        # Use the scene tree from any valid unit
        var ref_unit: BattleUnit = null
        for unit: BattleUnit in _targets:
            if is_instance_valid(unit) and unit.is_inside_tree():
                ref_unit = unit
                break
        if ref_unit == null:
            break
        await ref_unit.get_tree().create_timer(tick_interval).timeout
        if not _active:
            break

        _current_stacks += 1
        for unit: BattleUnit in _targets:
            if is_instance_valid(unit) and unit.combat_state.is_alive():
                # Remove old modifier and re-add with updated value
                unit.modifier_handler.remove_values_by_source(source_id)
                var mod := ModifierValue.new()
                mod.type = ModifierValue.Type.FLAT
                mod.flat_value = dr_per_stack * _current_stacks
                mod.source = source_id
                unit.modifier_handler.add_modifier_value(
                    Modifier.Type.DAMAGE_REDUCTION, mod)
```

---

### Recipe E1: Triggered — On Kill Heal

Heal the killer when an enemy dies.

```gdscript
class_name EclipseTitheOfFallen
extends BonusEffect

## On takedown, killer heals 8% Max HP and gains +10 Attack Speed for 3s.

@export var heal_percent: float = 0.08
@export var atk_speed_bonus: float = 10.0
@export var buff_duration: float = 3.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.unit_died.connect(_on_unit_died)

func remove() -> void:
    if EventBus.unit_died.is_connected(_on_unit_died):
        EventBus.unit_died.disconnect(_on_unit_died)
    _targets.clear()

func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Only trigger if an enemy died (dead unit is NOT one of our targets)
    if dead_unit in _targets:
        return

    # Find which of our units killed it (check last attacker)
    # Heal all synergy members as fallback (simplified)
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue
        var max_hp: float = unit.modifier_handler.get_stat("max_hp")
        CombatResolver.resolve_healing(unit, max_hp * heal_percent, unit)

        # Temporary attack speed buff via StatusEffect
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.FLAT
        mod.flat_value = atk_speed_bonus
        mod.source = source_id + "_as_buff"
        var buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF, source_id + "_as_buff",
            unit, buff_duration, Modifier.Type.ATTACK_SPEED, mod)
        unit.status_effect_handler.apply_effect(buff)
```

---

### Recipe E2: Triggered — On Crit Heal

Heal on critical hit.

```gdscript
class_name NexusCritHeal
extends BonusEffect

## On Crit, heal 3% Max HP.

@export var heal_percent: float = 0.03

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, _target: BattleUnit,
        _damage: int, is_critical: bool) -> void:
    if not is_critical:
        return
    if attacker not in _targets:
        return
    var max_hp: float = attacker.modifier_handler.get_stat("max_hp")
    CombatResolver.resolve_healing(attacker, max_hp * heal_percent, attacker)
```

---

### Recipe E3: Triggered — Every Nth Attack Stuns

Track attack count per unit, stun every Nth hit.

```gdscript
class_name TankEveryNthStun
extends BonusEffect

## Every 6th basic attack stuns the target for 1s.

@export var hit_interval: int = 6
@export var stun_duration: float = 1.0

var _targets: Array[BattleUnit]
var _hit_counts: Dictionary = {}  # BattleUnit → int

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _hit_counts.clear()
    for unit: BattleUnit in targets:
        _hit_counts[unit] = 0
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _hit_counts.clear()
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _hit_counts:
        return
    _hit_counts[attacker] += 1
    if _hit_counts[attacker] >= hit_interval:
        _hit_counts[attacker] = 0
        if is_instance_valid(target) and target.combat_state.is_alive():
            var stun := StatusEffect.create_cc(
                GameTypes.EffectType.STUN, source_id + "_stun",
                attacker, stun_duration)
            target.status_effect_handler.apply_effect(stun)
```

---

### Recipe E4: Triggered — On Ally Death (Team Buff)

When any ally dies, remaining allies gain stacking stats.

```gdscript
class_name EclipseEternalDominion
extends BonusEffect

## On any ally death, surviving allies gain +3% Strength and +3% Wisdom.

@export var buff_percent: float = 3.0

var _targets: Array[BattleUnit]
var _death_stacks: int = 0

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _death_stacks = 0
    EventBus.unit_died.connect(_on_unit_died)

func remove() -> void:
    if EventBus.unit_died.is_connected(_on_unit_died):
        EventBus.unit_died.disconnect(_on_unit_died)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()

func _on_unit_died(dead_unit: BattleUnit) -> void:
    if dead_unit not in _targets:
        return
    _death_stacks += 1

    # Update all surviving allies
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue
        unit.modifier_handler.remove_values_by_source(source_id)

        var str_mod := ModifierValue.new()
        str_mod.type = ModifierValue.Type.PERCENT_BASED
        str_mod.percent_value = buff_percent * _death_stacks
        str_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.STRENGTH, str_mod)

        var wis_mod := ModifierValue.new()
        wis_mod.type = ModifierValue.Type.PERCENT_BASED
        wis_mod.percent_value = buff_percent * _death_stacks
        wis_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.WISDOM, wis_mod)
```

---

### Recipe E5: Triggered — On Cast, Allies Gain Mana

React to spell casts across the team.

```gdscript
class_name NexusManaFlow
extends BonusEffect

## Whenever any ally casts a spell, all allies gain +10 Mana.

@export var mana_bonus: float = 10.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.spell_cast.connect(_on_spell_cast)

func remove() -> void:
    if EventBus.spell_cast.is_connected(_on_spell_cast):
        EventBus.spell_cast.disconnect(_on_spell_cast)
    _targets.clear()

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster not in _targets:
        return
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit) and unit.combat_state.is_alive() and unit != caster:
            unit.combat_state.modify_mana(mana_bonus)
```

---

### Recipe F: Condition Check — HP Threshold Toggle

Apply a buff when unit drops below an HP threshold, remove when healed above.

```gdscript
class_name VanguardLastStand
extends BonusEffect

## While below 40% HP, gain +25% Strength and +15% Lifesteal.

@export var hp_threshold: float = 0.4
@export var strength_bonus: float = 25.0
@export var lifesteal_bonus: float = 15.0

var _targets: Array[BattleUnit]
var _buffed_units: Dictionary = {}  # BattleUnit → bool

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit in targets:
        _buffed_units[unit] = false
    EventBus.unit_damaged.connect(_on_health_change)
    EventBus.unit_healed.connect(_on_healed)

func remove() -> void:
    if EventBus.unit_damaged.is_connected(_on_health_change):
        EventBus.unit_damaged.disconnect(_on_health_change)
    if EventBus.unit_healed.is_connected(_on_healed):
        EventBus.unit_healed.disconnect(_on_healed)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _buffed_units.clear()
    _targets.clear()

func _on_health_change(unit: BattleUnit, _dmg: float, _atk: BattleUnit,
        _type: GameTypes.DamageType, _crit: bool, _shield: bool) -> void:
    _check_threshold(unit)

func _on_healed(unit: BattleUnit, _amount: float) -> void:
    _check_threshold(unit)

func _check_threshold(unit: BattleUnit) -> void:
    if unit not in _buffed_units:
        return
    if not is_instance_valid(unit) or not unit.combat_state.is_alive():
        return

    var hp_ratio: float = unit.combat_state.current_health / unit.modifier_handler.get_stat("max_hp")
    var should_buff: bool = hp_ratio <= hp_threshold
    var is_buffed: bool = _buffed_units[unit]

    if should_buff and not is_buffed:
        _buffed_units[unit] = true
        var str_mod := ModifierValue.new()
        str_mod.type = ModifierValue.Type.PERCENT_BASED
        str_mod.percent_value = strength_bonus
        str_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.STRENGTH, str_mod)

        var ls_mod := ModifierValue.new()
        ls_mod.type = ModifierValue.Type.FLAT
        ls_mod.flat_value = lifesteal_bonus
        ls_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.LIFESTEAL, ls_mod)

    elif not should_buff and is_buffed:
        _buffed_units[unit] = false
        unit.modifier_handler.remove_values_by_source(source_id)
```

---

### Recipe G: Status Effect Application — DoT on Hit

Apply a DoT to each attack target.

```gdscript
class_name VenomStrikeBonus
extends BonusEffect

## Auto-attacks apply a poison DoT (15 SPELL damage/s for 3s).

@export var dot_dps: float = 15.0
@export var dot_duration: float = 3.0
@export var dot_tick: float = 1.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _targets:
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return
    var dot := StatusEffect.create_dot(
        source_id + "_poison", attacker,
        dot_duration, dot_dps, dot_tick,
        GameTypes.DamageType.SPELL, true)  # stackable
    target.status_effect_handler.apply_effect(dot)
```

---

### Recipe H: Shield at Battle Start

Grant shield based on a stat calculation.

```gdscript
class_name AegisIronAegis
extends BonusEffect

## Allies start battle with Shield = 8% Max HP.

@export var shield_percent: float = 0.08

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var max_hp: float = unit.modifier_handler.get_stat("max_hp")
        unit.combat_state.modify_shield(max_hp * shield_percent)

func remove() -> void:
    _targets.clear()
```

---

### Recipe I: Persistent Economy Effect

Modify run economy values immediately on acquisition. Set `persistent = true` in the `.tres` inspector.

```gdscript
class_name OathMerchantPact
extends BonusEffect

## Reduce recruit cost by 2 and reroll cost by 1.

@export var recruit_reduction: int = 2
@export var reroll_reduction: int = 1

func apply(_targets: Array[BattleUnit] = []) -> void:
    GameRun.run_state.recruit_cost -= recruit_reduction
    GameRun.run_state.hero_recruit_reroll -= reroll_reduction

func remove() -> void:
    GameRun.run_state.recruit_cost += recruit_reduction
    GameRun.run_state.hero_recruit_reroll += reroll_reduction
```

---

### Recipe J: Row-Based Stat Buff (Frontline / Backline)

Apply different buffs depending on whether a unit is in the frontline (rows 1–2) or backline (rows 3–4).

```gdscript
class_name FrontlineBacklineBuff
extends BonusEffect

## Frontline allies gain +25% Max HP. Backline allies gain +30% Attack Speed.
## Covers: Frontline I/II/III, Backline I/II/III blessings, Oath of the Bulwark.

@export var frontline_hp_percent: float = 25.0
@export var backline_aspd_percent: float = 30.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var tile: Vector2i = UnitNavigation.get_unit_tile(unit)
        var is_frontline: bool = tile.y <= 2    # rows 1–2

        if is_frontline:
            var mod := ModifierValue.new()
            mod.type = ModifierValue.Type.PERCENT_BASED
            mod.percent_value = frontline_hp_percent
            mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.MAX_HP, mod)
        else:
            var mod := ModifierValue.new()
            mod.type = ModifierValue.Type.PERCENT_BASED
            mod.percent_value = backline_aspd_percent
            mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.ATTACK_SPEED, mod)

func remove() -> void:
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```

**Row-based shield + penalty variant** (Oath of the Bulwark):
```gdscript
## Frontline allies start with Shield = 25% Max HP. Backline allies lose -10% Max HP.

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var tile: Vector2i = UnitNavigation.get_unit_tile(unit)
        var is_frontline: bool = tile.y <= 2

        if is_frontline:
            var max_hp: float = unit.modifier_handler.get_stat("max_hp")
            unit.combat_state.modify_shield(max_hp * 0.25)
        else:
            var mod := ModifierValue.new()
            mod.type = ModifierValue.Type.PERCENT_BASED
            mod.percent_value = -10.0
            mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.MAX_HP, mod)
```

---

### Recipe K: Adjacency-Based Conditional Buff (Formation)

Count adjacent allies and apply buffs if count meets a threshold. Also covers the inverse (Lone Wolf — bonus when isolated).

```gdscript
class_name FormationBuff
extends BonusEffect

## Allies adjacent to at least 2 other allies gain +10% Damage Reduction and +10% Strength.
## Covers: Formation I/II/III blessings, Lone Wolf blessing (invert the condition).

@export var adjacency_threshold: int = 2
@export var dr_bonus: float = 10.0
@export var str_bonus: float = 10.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var adjacent_count: int = 0
        for ally: BattleUnit in targets:
            if ally == unit:
                continue
            var dist: int = UnitNavigation.get_distance_in_tiles(unit, ally)
            if dist == 1:
                adjacent_count += 1

        if adjacent_count >= adjacency_threshold:
            var dr_mod := ModifierValue.new()
            dr_mod.type = ModifierValue.Type.FLAT
            dr_mod.flat_value = dr_bonus
            dr_mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.DAMAGE_REDUCTION, dr_mod)

            var str_mod := ModifierValue.new()
            str_mod.type = ModifierValue.Type.PERCENT_BASED
            str_mod.percent_value = str_bonus
            str_mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.STRENGTH, str_mod)

func remove() -> void:
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()
```

**Lone Wolf variant** (bonus when NOT adjacent to any ally):
```gdscript
## Replace the threshold check with:
        if adjacent_count == 0:
            # Grant Lone Wolf bonuses (+15% Strength, +15% Wisdom)
```

---

### Recipe L: On-Kill Temporary Buff (Timed Stats)

When an enemy dies, grant synergy members a timed stat buff via StatusEffect.

```gdscript
class_name OnKillTimedBuff
extends BonusEffect

## When an ally kills an enemy, they gain +20% Attack Speed and +5% Lifesteal for 4s.
## Covers: Bloodlust blessing, Fanatic synergy, Undying Flame (ally death variant).

@export var aspd_bonus: float = 20.0
@export var lifesteal_bonus: float = 5.0
@export var buff_duration: float = 4.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.unit_died.connect(_on_unit_died)

func remove() -> void:
    if EventBus.unit_died.is_connected(_on_unit_died):
        EventBus.unit_died.disconnect(_on_unit_died)
    _targets.clear()

func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Only trigger on enemy deaths
    if dead_unit in _targets:
        return

    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue

        # Attack Speed buff
        var aspd_mod := ModifierValue.new()
        aspd_mod.type = ModifierValue.Type.PERCENT_BASED
        aspd_mod.percent_value = aspd_bonus
        aspd_mod.source = source_id + "_aspd"
        var aspd_buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF, source_id + "_aspd",
            unit, buff_duration, Modifier.Type.ATTACK_SPEED, aspd_mod)
        unit.status_effect_handler.apply_effect(aspd_buff)

        # Lifesteal buff
        var ls_mod := ModifierValue.new()
        ls_mod.type = ModifierValue.Type.FLAT
        ls_mod.flat_value = lifesteal_bonus
        ls_mod.source = source_id + "_ls"
        var ls_buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF, source_id + "_ls",
            unit, buff_duration, Modifier.Type.LIFESTEAL, ls_mod)
        unit.status_effect_handler.apply_effect(ls_buff)
```

**Undying Flame variant** (trigger on ALLY death, grant to survivors, stacking):
```gdscript
func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Only trigger on ALLY deaths
    if dead_unit not in _targets:
        return
    # Grant timed buffs to all SURVIVING allies (same pattern as above)
```

---

### Recipe M: On-Damage-Taken Reactive Buff (One-Shot Timed)

First time a unit drops below an HP threshold, grant a one-shot timed buff.

```gdscript
class_name AdrenalineRushBonus
extends BonusEffect

## When an ally drops below 40% HP for the first time per battle,
## they gain +30% Attack Speed and +10% Lifesteal for 4s.
## Covers: Adrenaline Rush blessing, Fighter III synergy.

@export var hp_threshold: float = 0.4
@export var aspd_bonus: float = 30.0
@export var lifesteal_bonus: float = 10.0
@export var buff_duration: float = 4.0

var _targets: Array[BattleUnit]
var _triggered: Dictionary = {}    # BattleUnit → bool

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _triggered.clear()
    for unit in targets:
        _triggered[unit] = false
    EventBus.unit_damaged.connect(_on_unit_damaged)

func remove() -> void:
    if EventBus.unit_damaged.is_connected(_on_unit_damaged):
        EventBus.unit_damaged.disconnect(_on_unit_damaged)
    _triggered.clear()
    _targets.clear()

func _on_unit_damaged(damaged: BattleUnit, _dmg: float, _atk: BattleUnit,
        _type: GameTypes.DamageType, _crit: bool, _shield: bool) -> void:
    if damaged not in _triggered:
        return
    if _triggered[damaged]:
        return

    var max_hp: float = damaged.modifier_handler.get_stat("max_hp")
    if damaged.combat_state.current_health > max_hp * hp_threshold:
        return

    _triggered[damaged] = true

    var aspd_mod := ModifierValue.new()
    aspd_mod.type = ModifierValue.Type.PERCENT_BASED
    aspd_mod.percent_value = aspd_bonus
    aspd_mod.source = source_id + "_aspd"
    var aspd_buff := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_BUFF, source_id + "_aspd",
        damaged, buff_duration, Modifier.Type.ATTACK_SPEED, aspd_mod)
    damaged.status_effect_handler.apply_effect(aspd_buff)

    var ls_mod := ModifierValue.new()
    ls_mod.type = ModifierValue.Type.FLAT
    ls_mod.flat_value = lifesteal_bonus
    ls_mod.source = source_id + "_ls"
    var ls_buff := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_BUFF, source_id + "_ls",
        damaged, buff_duration, Modifier.Type.LIFESTEAL, ls_mod)
    damaged.status_effect_handler.apply_effect(ls_buff)
```

---

### Recipe N: Bonus Damage on Basic Attack (Stat-Scaled)

Each auto-attack deals additional damage of a specific type, scaled from a stat.

```gdscript
class_name BonusDamageOnHit
extends BonusEffect

## All allies' Basic Attacks deal bonus Pure Damage equal to 15% of their Strength.
## Covers: Avatar of War blessing, Capacitor synergy (Spell Damage from WIS after cast).

@export var stat_name: String = "strength"
@export var stat_percent: float = 0.15
@export var damage_type: GameTypes.DamageType = GameTypes.DamageType.PURE

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _targets:
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return

    var stat_value: float = attacker.modifier_handler.get_stat(stat_name)
    var bonus_damage: float = stat_value * stat_percent
    CombatResolver.resolve_damage(target, bonus_damage, damage_type, attacker)
```

**Post-cast variant** (Capacitor — bonus damage on next N attacks after casting):
```gdscript
var _empowered_attacks: Dictionary = {}    # BattleUnit → int (remaining empowered attacks)

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.spell_cast.connect(_on_spell_cast)
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster in _targets:
        _empowered_attacks[caster] = 3    # Next 3 attacks are empowered

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _empowered_attacks:
        return
    if _empowered_attacks[attacker] <= 0:
        return
    _empowered_attacks[attacker] -= 1
    var wisdom: float = attacker.modifier_handler.get_stat("wisdom")
    CombatResolver.resolve_damage(target, wisdom * 0.30, GameTypes.DamageType.SPELL, attacker)
```

---

### Recipe O: Execute Damage (Based on Target HP)

Basic Attacks deal bonus damage based on the target's missing or current HP.

```gdscript
class_name ExecuteDamageBonus
extends BonusEffect

## Every 3rd Shooter Basic Attack deals bonus Physical Damage equal to 8% of
## the target's Missing HP. If target is below 25% HP, the bonus doubles to 16%.
## Covers: Shooter III synergy, Sharpshooter synergy (current HP variant).

@export var hit_interval: int = 3
@export var missing_hp_percent: float = 0.08
@export var execute_threshold: float = 0.25
@export var execute_multiplier: float = 2.0

var _targets: Array[BattleUnit]
var _hit_counts: Dictionary = {}

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _hit_counts.clear()
    for unit in targets:
        _hit_counts[unit] = 0
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _hit_counts.clear()
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _hit_counts:
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return

    _hit_counts[attacker] += 1
    if _hit_counts[attacker] < hit_interval:
        return
    _hit_counts[attacker] = 0

    var max_hp: float = target.modifier_handler.get_stat("max_hp")
    var missing_hp: float = max_hp - target.combat_state.current_health
    var hp_ratio: float = target.combat_state.current_health / max_hp

    var percent: float = missing_hp_percent
    if hp_ratio < execute_threshold:
        percent *= execute_multiplier

    CombatResolver.resolve_damage(
        target, missing_hp * percent, GameTypes.DamageType.PHYSICAL, attacker)
```

**Current HP variant** (Sharpshooter — bonus Pure Damage on crit based on target's current HP):
```gdscript
func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, is_crit: bool) -> void:
    if attacker not in _targets:
        return
    if not is_crit:
        return
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return
    var current_hp: float = target.combat_state.current_health
    CombatResolver.resolve_damage(
        target, current_hp * 0.05, GameTypes.DamageType.PURE, attacker)
```

---

### Recipe P: Distance-Scaled Damage

Basic Attacks deal bonus damage that scales with tile distance to the target.

```gdscript
class_name DistanceScaledDamage
extends BonusEffect

## Basic Attacks deal +4% bonus Physical Damage per tile of distance to the target.
## Covers: Sniper synergy (+2/4/6% per tile).

@export var percent_per_tile: float = 4.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)

func remove() -> void:
    if EventBus.auto_attack_pre_resolve.is_connected(_on_pre_resolve):
        EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    _targets.clear()

func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit,
        context: Dictionary) -> void:
    if attacker not in _targets:
        return
    var dist: int = UnitNavigation.get_distance_in_tiles(attacker, target)
    context.bonus_damage_percent += percent_per_tile * dist
```

---

### Recipe Q: Mark Enemies and Amplify Damage

Periodically mark an enemy, apply Damage Amplification debuff, and reward hitting marked targets.

```gdscript
class_name InquisitionMarkSystem
extends BonusEffect

## Every 5s, the enemy with the highest current HP is Marked for 6s.
## Marked enemies take +10% Damage Amplification. Allies gain +5 Mana on hitting a Marked enemy.
## Covers: Inquisition I/II synergy, Overseer synergy (Exposed).

@export var mark_interval: float = 5.0
@export var mark_duration: float = 6.0
@export var damage_amp: float = 10.0
@export var mana_on_hit: float = 5.0

const MARK_SOURCE: String = "inquisition_mark"

var _targets: Array[BattleUnit]
var _active: bool = false
var _marked_enemy: BattleUnit = null
var _mana_cooldowns: Dictionary = {}    # BattleUnit → float (last mana grant time)

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _active = true
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    _mark_loop()

func remove() -> void:
    _active = false
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    if is_instance_valid(_marked_enemy):
        _marked_enemy.status_effect_handler.remove_effect(MARK_SOURCE)
    _mana_cooldowns.clear()
    _targets.clear()

func _mark_loop() -> void:
    while _active:
        var ref_unit: BattleUnit = null
        for unit: BattleUnit in _targets:
            if is_instance_valid(unit) and unit.is_inside_tree():
                ref_unit = unit
                break
        if ref_unit == null:
            break
        await ref_unit.get_tree().create_timer(mark_interval).timeout
        if not _active:
            break
        _apply_mark()

func _apply_mark() -> void:
    # Find highest-HP enemy
    var best_enemy: BattleUnit = null
    var best_hp: float = -1.0
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit):
            continue
        for enemy in TargetingSystem.get_all_enemies(unit):
            if is_instance_valid(enemy) and enemy.combat_state.is_alive():
                if enemy.combat_state.current_health > best_hp:
                    best_hp = enemy.combat_state.current_health
                    best_enemy = enemy
        break    # Only need one unit's enemy list

    if best_enemy == null:
        return

    _marked_enemy = best_enemy

    # Apply Damage Amplification debuff as the "Mark"
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.FLAT
    mod.flat_value = damage_amp
    mod.source = MARK_SOURCE
    var mark := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_DEBUFF, MARK_SOURCE,
        _targets[0], mark_duration,
        Modifier.Type.DAMAGE_AMPLIFICATION, mod)
    best_enemy.status_effect_handler.apply_effect(mark)

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _targets:
        return
    if not is_instance_valid(target):
        return
    # Check if target is Marked
    if target.status_effect_handler.get_effect(MARK_SOURCE) == null:
        return
    # Grant mana to the attacker
    attacker.combat_state.modify_mana(mana_on_hit)
```

---

### Recipe R: Stat Scaling Per Active Debuff Types

Grant stats to allies that scale dynamically with the number of unique debuff types on enemies.

```gdscript
class_name DebuffCountScaling
extends BonusEffect

## All allies gain +4% Physical Penetration and +4% Spell Penetration for each
## unique debuff type currently active on any enemy (max 5 types tracked).
## Covers: Nebulae I synergy, Nebulae III (Crit Damage + Lifesteal variant).

@export var pen_per_type: float = 4.0
@export var max_types: int = 5

var _targets: Array[BattleUnit]
var _last_count: int = 0

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.status_effect_applied.connect(_on_status_changed)
    EventBus.status_effect_removed.connect(_on_status_changed)

func remove() -> void:
    if EventBus.status_effect_applied.is_connected(_on_status_changed):
        EventBus.status_effect_applied.disconnect(_on_status_changed)
    if EventBus.status_effect_removed.is_connected(_on_status_changed):
        EventBus.status_effect_removed.disconnect(_on_status_changed)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()

func _on_status_changed(_unit: BattleUnit, _effect_type: GameTypes.EffectType,
        _source: String) -> void:
    _recalculate()

func _recalculate() -> void:
    # Count unique debuff types across all enemies
    var debuff_types: Dictionary = {}
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit):
            continue
        for enemy in TargetingSystem.get_all_enemies(unit):
            if not is_instance_valid(enemy) or not enemy.combat_state.is_alive():
                continue
            var debuffs := enemy.status_effect_handler.get_effects_by_type(
                GameTypes.EffectType.STAT_DEBUFF)
            for debuff in debuffs:
                debuff_types[debuff.source] = true
            var dots := enemy.status_effect_handler.get_effects_by_type(
                GameTypes.EffectType.DOT)
            for dot in dots:
                debuff_types[dot.source] = true
        break

    var count: int = mini(debuff_types.size(), max_types)
    if count == _last_count:
        return
    _last_count = count

    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue
        unit.modifier_handler.remove_values_by_source(source_id)

        if count > 0:
            var phys_mod := ModifierValue.new()
            phys_mod.type = ModifierValue.Type.FLAT
            phys_mod.flat_value = pen_per_type * count
            phys_mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.PHYS_PEN_PERCENT, phys_mod)

            var spell_mod := ModifierValue.new()
            spell_mod.type = ModifierValue.Type.FLAT
            spell_mod.flat_value = pen_per_type * count
            spell_mod.source = source_id
            unit.modifier_handler.add_modifier_value(Modifier.Type.SPELL_PEN_PERCENT, spell_mod)
```

---

### Recipe S: Debuff Spread on Death

When an enemy with 2+ debuffs dies, copy their debuffs to the nearest enemy.

```gdscript
class_name DebuffSpreadOnDeath
extends BonusEffect

## When an enemy with 2+ debuffs dies, all their debuffs spread to the nearest enemy.
## Covers: Nebulae III synergy.

@export var min_debuffs: int = 2

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.unit_died.connect(_on_unit_died)

func remove() -> void:
    if EventBus.unit_died.is_connected(_on_unit_died):
        EventBus.unit_died.disconnect(_on_unit_died)
    _targets.clear()

func _on_unit_died(dead_unit: BattleUnit) -> void:
    # Only trigger on enemy deaths (not our allies)
    if dead_unit in _targets:
        return

    # Collect debuffs on the dead unit
    var debuffs := dead_unit.status_effect_handler.get_effects_by_type(
        GameTypes.EffectType.STAT_DEBUFF)
    var dots := dead_unit.status_effect_handler.get_effects_by_type(
        GameTypes.EffectType.DOT)
    var all_debuffs: Array = []
    all_debuffs.append_array(debuffs)
    all_debuffs.append_array(dots)

    if all_debuffs.size() < min_debuffs:
        return

    # Find nearest alive enemy to the dead unit
    var nearest_enemy: BattleUnit = null
    var min_dist: int = 999
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit):
            continue
        for enemy in TargetingSystem.get_all_enemies(unit):
            if not is_instance_valid(enemy) or not enemy.combat_state.is_alive():
                continue
            if enemy == dead_unit:
                continue
            var dist: int = UnitNavigation.get_distance_in_tiles(dead_unit, enemy)
            if dist < min_dist:
                min_dist = dist
                nearest_enemy = enemy
        break

    if nearest_enemy == null:
        return

    # Reapply each debuff to the nearest enemy
    for effect: StatusEffect in debuffs:
        var mod := ModifierValue.new()
        mod.type = effect.modifier_value.type
        mod.flat_value = effect.modifier_value.flat_value
        mod.percent_value = effect.modifier_value.percent_value
        mod.source = effect.source + "_spread"
        var spread := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_DEBUFF, effect.source + "_spread",
            effect.source_unit, effect.remaining_duration,
            effect.modifier_type, mod)
        nearest_enemy.status_effect_handler.apply_effect(spread)

    for effect: StatusEffect in dots:
        var spread_dot := StatusEffect.create_dot(
            effect.source + "_spread", effect.source_unit,
            effect.remaining_duration, effect.dot_damage,
            effect.dot_interval, effect.dot_damage_type, true)
        nearest_enemy.status_effect_handler.apply_effect(spread_dot)
```

---

### Recipe T: Debuff Cleanse (Nth Cast Trigger)

Track spell casts from specific units and cleanse team debuffs on every Nth cast.

```gdscript
class_name CastCountCleanse
extends BonusEffect

## Every 4th Support cast cleanses all debuffs from the team.
## Covers: Support III synergy.

@export var cast_threshold: int = 4

var _targets: Array[BattleUnit]
var _cast_count: int = 0

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _cast_count = 0
    EventBus.spell_cast.connect(_on_spell_cast)

func remove() -> void:
    if EventBus.spell_cast.is_connected(_on_spell_cast):
        EventBus.spell_cast.disconnect(_on_spell_cast)
    _targets.clear()

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster not in _targets:
        return

    _cast_count += 1
    if _cast_count < cast_threshold:
        return
    _cast_count = 0

    # Cleanse all STAT_DEBUFF and DOT from all allies
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue
        unit.status_effect_handler.remove_effects_by_type(GameTypes.EffectType.STAT_DEBUFF)
        unit.status_effect_handler.remove_effects_by_type(GameTypes.EffectType.DOT)
```

---

### Recipe U: Bonus Mana Per Basic Attack Hit

Grant flat mana to units on each auto-attack they land.

```gdscript
class_name BonusManaOnHit
extends BonusEffect

## All allies gain +5 bonus Mana per Basic Attack hit.
## Covers: Mana Flow blessing, Inquisition II (mana on hitting Marked).

@export var mana_per_hit: float = 5.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)

func remove() -> void:
    if EventBus.combat_attack_resolved.is_connected(_on_attack_resolved):
        EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    _targets.clear()

func _on_attack_resolved(attacker: BattleUnit, _target: BattleUnit,
        _damage: int, _is_crit: bool) -> void:
    if attacker not in _targets:
        return
    attacker.combat_state.modify_mana(mana_per_hit)
```

---

### Recipe V: Bonus Starting Mana

Grant allies bonus mana at battle start as a percentage of their Max Mana.

```gdscript
class_name BonusStartingMana
extends BonusEffect

## All allies start battle with bonus Mana equal to 10% of their Max Mana.
## Covers: Focused Mind blessing, Nexus I synergy (25% bonus Starting Mana).

@export var mana_percent: float = 0.10

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    for unit: BattleUnit in targets:
        var max_mana: float = unit.modifier_handler.get_stat("max_mana")
        unit.combat_state.modify_mana(max_mana * mana_percent)

func remove() -> void:
    _targets.clear()
```

---

### Recipe W: Guaranteed Crit on First Hit Against Each Target

Track per-attacker per-target hit state to give a guaranteed crit (and bonus crit damage) on the first hit against each new target.

```gdscript
class_name GuaranteedFirstCrit
extends BonusEffect

## The first Basic Attack against each new target is a guaranteed Critical Hit
## with +20% bonus Crit Damage.
## Covers: Shogunate I synergy.

@export var bonus_crit_damage: float = 20.0

var _targets: Array[BattleUnit]
var _hit_targets: Dictionary = {}    # BattleUnit (attacker) → Array[BattleUnit] (already-hit targets)

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _hit_targets.clear()
    for unit in targets:
        _hit_targets[unit] = []
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)

func remove() -> void:
    if EventBus.auto_attack_pre_resolve.is_connected(_on_pre_resolve):
        EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    _hit_targets.clear()
    _targets.clear()

func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit,
        context: Dictionary) -> void:
    if attacker not in _hit_targets:
        return

    if target in _hit_targets[attacker]:
        return    # Already hit this target before

    _hit_targets[attacker].append(target)

    # Guarantee crit
    context.bonus_crit_chance += 100.0
    # Bonus crit damage via a brief stat mod (applies before this attack resolves)
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.FLAT
    mod.flat_value = bonus_crit_damage
    mod.source = source_id + "_first_crit"
    attacker.modifier_handler.add_modifier_value(Modifier.Type.CRIT_DAMAGE, mod)

    # Schedule removal after a tiny delay (after this attack resolves)
    if is_instance_valid(attacker) and attacker.is_inside_tree():
        attacker.get_tree().create_timer(0.05).timeout.connect(
            func(): attacker.modifier_handler.remove_values_by_source(
                source_id + "_first_crit"))
```

---

### Recipe X: First Spell Bonus Damage

Each ally's first spell per battle deals bonus damage (via a temporary Wisdom buff applied before the cast).

```gdscript
class_name FirstSpellBonus
extends BonusEffect

## Each ally's first Spell cast per battle deals +30% bonus damage.
## Covers: Arcane Surge blessing, Caster I synergy (+20% Wisdom first spell).

@export var bonus_wisdom_percent: float = 30.0

var _targets: Array[BattleUnit]
var _has_cast: Dictionary = {}    # BattleUnit → bool

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _has_cast.clear()
    for unit in targets:
        _has_cast[unit] = false
        # Apply Wisdom buff that will be active for the first cast
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.PERCENT_BASED
        mod.percent_value = bonus_wisdom_percent
        mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.WISDOM, mod)
    EventBus.spell_cast.connect(_on_spell_cast)

func remove() -> void:
    if EventBus.spell_cast.is_connected(_on_spell_cast):
        EventBus.spell_cast.disconnect(_on_spell_cast)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _has_cast.clear()
    _targets.clear()

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster not in _has_cast:
        return
    if _has_cast[caster]:
        return
    _has_cast[caster] = true
    # Remove the Wisdom buff after first cast
    if is_instance_valid(caster):
        caster.modifier_handler.remove_values_by_source(source_id)
```

---

### Recipe Y: Per-Spell-Cast Stacking Team Buff

Each spell cast by any ally grants the whole team a stacking buff.

```gdscript
class_name SpellCastStackingBuff
extends BonusEffect

## Whenever any ally casts a spell, all allies gain +15 Physical Defense and
## +15 Spell Defense (stacks 8; persists all battle).
## Covers: Nexus II synergy, Nexus III (System Pulse every 3rd cast).

@export var def_per_stack: float = 15.0
@export var max_stacks: int = 8

var _targets: Array[BattleUnit]
var _stacks: int = 0

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _stacks = 0
    EventBus.spell_cast.connect(_on_spell_cast)

func remove() -> void:
    if EventBus.spell_cast.is_connected(_on_spell_cast):
        EventBus.spell_cast.disconnect(_on_spell_cast)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _targets.clear()

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster not in _targets:
        return
    if _stacks >= max_stacks:
        return
    _stacks += 1
    _refresh_modifiers()

func _refresh_modifiers() -> void:
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue
        unit.modifier_handler.remove_values_by_source(source_id)

        var phys_mod := ModifierValue.new()
        phys_mod.type = ModifierValue.Type.FLAT
        phys_mod.flat_value = def_per_stack * _stacks
        phys_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, phys_mod)

        var spell_mod := ModifierValue.new()
        spell_mod.type = ModifierValue.Type.FLAT
        spell_mod.flat_value = def_per_stack * _stacks
        spell_mod.source = source_id
        unit.modifier_handler.add_modifier_value(Modifier.Type.SPELL_DEF, spell_mod)
```

**System Pulse variant** (Nexus III — every 3rd cast triggers a timed team buff):
```gdscript
var _global_cast_count: int = 0

func _on_spell_cast(caster: BattleUnit) -> void:
    if caster not in _targets:
        return
    _global_cast_count += 1
    if _global_cast_count % 3 != 0:
        return

    # Trigger System Pulse: +5% Damage Amp, +8% AS, +8 Mana for 4s
    for unit: BattleUnit in _targets:
        if not is_instance_valid(unit) or not unit.combat_state.is_alive():
            continue

        var amp_mod := ModifierValue.new()
        amp_mod.type = ModifierValue.Type.FLAT
        amp_mod.flat_value = 5.0
        amp_mod.source = source_id + "_pulse_amp"
        var amp_buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF, source_id + "_pulse_amp",
            unit, 4.0, Modifier.Type.DAMAGE_AMPLIFICATION, amp_mod)
        unit.status_effect_handler.apply_effect(amp_buff)

        var aspd_mod := ModifierValue.new()
        aspd_mod.type = ModifierValue.Type.PERCENT_BASED
        aspd_mod.percent_value = 8.0
        aspd_mod.source = source_id + "_pulse_aspd"
        var aspd_buff := StatusEffect.create_stat_mod(
            GameTypes.EffectType.STAT_BUFF, source_id + "_pulse_aspd",
            unit, 4.0, Modifier.Type.ATTACK_SPEED, aspd_mod)
        unit.status_effect_handler.apply_effect(aspd_buff)

        unit.combat_state.modify_mana(8.0)
```

---

### Recipe Z: Damage Bonus Per Alive Ally

All allies deal bonus damage that scales with how many allies are currently alive.

```gdscript
class_name PackHuntersBonus
extends BonusEffect

## All allies deal +3% bonus damage for each other ally currently alive.
## Covers: Pack Hunters blessing.

@export var percent_per_ally: float = 3.0

var _targets: Array[BattleUnit]

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)

func remove() -> void:
    if EventBus.auto_attack_pre_resolve.is_connected(_on_pre_resolve):
        EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    _targets.clear()

func _on_pre_resolve(attacker: BattleUnit, _target: BattleUnit,
        context: Dictionary) -> void:
    if attacker not in _targets:
        return

    # Count alive allies (excluding self)
    var alive_count: int = 0
    for ally: BattleUnit in _targets:
        if ally == attacker:
            continue
        if is_instance_valid(ally) and ally.combat_state.is_alive():
            alive_count += 1

    if alive_count > 0:
        context.bonus_damage_percent += percent_per_ally * alive_count
```

---

### Recipe AA: Consecutive Hits on Same Target Ramp

Track per-attacker target loyalty. Stacking bonus builds on same target, resets on target switch.

```gdscript
class_name TargetLoyaltyRamp
extends BonusEffect

## Consecutive Basic Attacks on the same target gain +4% Damage Amplification
## (max 7 stacks; resets on target switch).
## Covers: Gunner synergy, Phaseblade (penetration variant), Duelist (crit variant).

@export var amp_per_stack: float = 4.0
@export var max_stacks: int = 7

var _targets: Array[BattleUnit]
var _last_target: Dictionary = {}    # BattleUnit → BattleUnit (last attacked target)
var _stacks: Dictionary = {}         # BattleUnit → int

func apply(targets: Array[BattleUnit] = []) -> void:
    _targets = targets
    _last_target.clear()
    _stacks.clear()
    for unit in targets:
        _last_target[unit] = null
        _stacks[unit] = 0
    EventBus.auto_attack_pre_resolve.connect(_on_pre_resolve)

func remove() -> void:
    if EventBus.auto_attack_pre_resolve.is_connected(_on_pre_resolve):
        EventBus.auto_attack_pre_resolve.disconnect(_on_pre_resolve)
    for unit: BattleUnit in _targets:
        if is_instance_valid(unit):
            unit.modifier_handler.remove_values_by_source(source_id)
    _last_target.clear()
    _stacks.clear()
    _targets.clear()

func _on_pre_resolve(attacker: BattleUnit, target: BattleUnit,
        _context: Dictionary) -> void:
    if attacker not in _stacks:
        return

    if _last_target[attacker] == target:
        # Same target — stack up
        if _stacks[attacker] < max_stacks:
            _stacks[attacker] += 1
    else:
        # Target switched — reset
        _last_target[attacker] = target
        _stacks[attacker] = 1

    # Apply updated Damage Amplification modifier
    attacker.modifier_handler.remove_values_by_source(source_id)
    if _stacks[attacker] > 0:
        var mod := ModifierValue.new()
        mod.type = ModifierValue.Type.FLAT
        mod.flat_value = amp_per_stack * _stacks[attacker]
        mod.source = source_id
        attacker.modifier_handler.add_modifier_value(
            Modifier.Type.DAMAGE_AMPLIFICATION, mod)
```

**Penetration variant** (Phaseblade — stacking pen instead of amp):
```gdscript
## Replace Modifier.Type.DAMAGE_AMPLIFICATION with:
        attacker.modifier_handler.add_modifier_value(Modifier.Type.PHYS_PEN_PERCENT, mod)
        attacker.modifier_handler.add_modifier_value(Modifier.Type.SPELL_PEN_PERCENT, mod)
```

**Crit variant** (Duelist — stacking crit chance + crit damage, 2s lockout on switch):
```gdscript
## On target switch, clear modifiers and set a 2s cooldown before new stacks begin.
var _lockout_until: Dictionary = {}    # BattleUnit → float (Time.get_ticks_msec)
```

---

## 19. Effects Requiring New Systems

The following effect patterns appear in the game design docs (synergies, blessings, faction oaths) but **cannot be fully implemented** with the current ability and bonus system. Each requires a dedicated engine feature to be built first.

### Revive on Death

**Used by:** Eclipse III synergy (revive at 25% HP), Oath of the Reborn (revive at 20% HP with +25% Damage Amp).

**What's needed:** A death-interception hook — either an `on_before_death` signal emitted before `unit_died`, or a `CombatState.revive(hp_percent)` method that restores the unit after death triggers. Must handle re-enabling AI states, resetting untargetable, and preventing cascading death effects.

---

### Counter (Auto-Attack Back on Hit)

**Used by:** Aegis III synergy (Counter for 3s when shield breaks), Pillar synergy (Counter while stationary).

**What's needed:** `CombatResolver.trigger_counter_attack(unit, attacker)` — a method that forces a unit to perform an immediate auto-attack against a specific enemy outside the normal AI loop. Must respect stun/silence checks and not interrupt the unit's current action.

---

### Reflect X% Damage

**Used by:** Aegis III synergy (+10% Reflect for 3s), Bulwark synergy (15-25% Reflect while shielded), Pillar III (+10% Reflect while stationary).

**What's needed:** A `reflect_percent` field on `CombatState` or a `unit_damaged` → `resolve_damage` back pattern. Critical requirement: **infinite-loop prevention** (reflected damage must NOT trigger further reflects). Simplest approach: add a `is_reflected: bool` flag to the damage pipeline.

---

### Stealth (Untargetable + Bonus on Break)

**Used by:** Assassin I synergy (Stealth for 2s at battle start), Assassin III (kills grant 1.5s Stealth, breaking Stealth gives +50% bonus damage).

**What's needed:** A dedicated `STEALTH` status effect type or a `stealth_active` flag on `CombatState`. `set_untargetable_for()` exists but doesn't track "stealth" as a state with a "break bonus". Need: stealth breaks on the unit's first offensive action, the break triggers a damage bonus on the next hit, and kills can refresh it.

---

### Spell Echo (Re-Cast at Reduced Effectiveness)

**Used by:** Caster III synergy (every 2nd spell echoes at 50% effectiveness).

**What's needed:** A mechanism to re-invoke `spell.cast()` at a damage multiplier, or a dedicated echo system. Challenges: the echo must not trigger mana cost, must not count as a "cast" for other stacking effects (or it creates infinite loops), and must respect the 50% damage scaling. Possible approach: a `CombatState.spell_damage_multiplier` field set before echo cast.

---

### Spell Crit

**Used by:** Voidweaver synergy (spells can critically hit with +5-12% Crit Chance and +25-60% Crit Damage).

**Status: IMPLEMENTED** — `CombatState.can_spell_crit: bool` (default `false`) opts a unit into spell crits. When `true`, `resolve_spell_cast()` rolls a crit using the same `crit_chance_percent` and `crit_damage_percent` stats as auto-attacks. For custom spell damage paths that use `resolve_damage()` instead of `resolve_spell_cast()`, implement the crit roll inline (see Section 20, Pattern 7).

---

### Stationarity Detection

**Used by:** Pillar synergy (while stationary for 2s+, gain Counter + Defense), Anchor synergy (generate Anchor Field while stationary).

**What's needed:** Movement tracking on BattleUnit — either a `last_move_time` timestamp updated whenever the unit changes tiles, or a `position_changed` signal. The BonusEffect needs to poll or react to know "this unit hasn't moved for X seconds." Currently no movement signal exists.

---

### Regen (Heal over Time)

**Used by:** Shaman synergy (healing/shielding also applies Regen = 2-4% Missing HP/s for 4s).

**Status: IMPLEMENTED** — `StatusEffect.create_hot(source_id, applier, dur, heal_per_tick, interval, is_stackable)` exists in `status_effect.gd`. Ticks call `CombatResolver.resolve_healing()` each interval. See Section 20 (Pattern 6) for hero usage.

---

### Per-Wave Permanent Stat Stacking

**Used by:** Oath of Fortification (+5% all stats per consecutive wave deployed), Vanguard I/II/III blessings (+2-5% stats per wave survived), Reserve Corps (+1% all stats per wave on bench).

**What's needed:** A cross-battle persistence hook. Current BonusEffects are duplicated and discarded each battle. Need either: (a) a `persistent_modifiers` array on the Unit (not BattleUnit) that survives between battles, or (b) a `BonusManager` callback at wave-end that writes stacking data to the Unit resource for the next battle.

---

### Gold Manipulation During Battle

**Used by:** Oath of Harvest (+1 gold per enemy kill during battle, max +5), Frontline Wages (+1 gold per surviving frontline hero).

**What's needed:** BonusEffects currently don't interact with `GameRun.run_state.gold` during combat. Need a pattern for battle-time gold tracking — either allow direct `GameRun.run_state.gold` modification from BonusEffects (safe since it's additive), or accumulate gold in a temporary counter and flush it at battle end via a `battle_ended` signal handler.

---

### Synergy Count Manipulation

**Used by:** Synchrony blessing (all active synergies count as having +1 additional unit toward their thresholds).

**What's needed:** A hook into `SynergyTracker` that allows virtual unit injection — adding phantom counts to synergy thresholds without deploying actual units. Could be a simple `bonus_synergy_counts: Dictionary[SynergyKit, int]` on BonusManager that SynergyTracker reads when calculating thresholds.

---

## 20. Patterns Introduced by Eclipse Heroes

The following patterns were added during the Eclipse hero implementation. Each addresses a mechanic not previously covered by sections 1–18.

---

### Pattern 1: Dégâts dual-type en un seul Spell (Ereth — Tempest Draw)

**Problem:** A single spell needs to deal both Physical and Spell damage.

**Solution:** Call `CombatResolver.resolve_damage()` twice — once for each damage type. After both calls, manually emit `EventBus.spell_cast` (since you're not using `resolve_spell_cast()`).

```gdscript
func cast(primary_target: BattleUnit) -> void:
    var str_val: float = owner.modifier_handler.get_stat("strength")
    var wis_val: float = owner.modifier_handler.get_stat("wisdom")

    CombatResolver.resolve_damage(primary_target, str_val * 1.50, GameTypes.DamageType.PHYSICAL, owner)

    if is_instance_valid(primary_target) and primary_target.combat_state.is_alive():
        CombatResolver.resolve_damage(primary_target, wis_val * 1.00, GameTypes.DamageType.SPELL, owner)

    EventBus.spell_cast.emit(owner)  # Must emit manually when not using resolve_spell_cast()
    cast_finished.emit()
```

**Key rule:** Always guard the second damage call with an alive-check — the first hit may have killed the target. Always emit `EventBus.spell_cast` manually, and always call `cast_finished.emit()` (not `call_deferred`).

---

### Pattern 2: Modificateur dynamique basé sur le HP manquant (Barkhul — Bloodied Hide)

**Problem:** A stat bonus scales with the caster's current missing HP% and must update in real-time as HP changes.

**Solution:** Use `modifier_handler.add_modifier_value()` and `remove_values_by_source()` directly (not StatusEffect) to replace the value on every HP event. Connect to both `unit_damaged` and `unit_healed`.

```gdscript
const SOURCE_DEF := "barkhul_passive_def"

func activate() -> void:
    EventBus.unit_damaged.connect(_on_hp_changed)
    EventBus.unit_healed.connect(_on_hp_healed)
    _recalculate()

func _on_hp_changed(damaged_unit: BattleUnit, ...) -> void:
    if damaged_unit == owner:
        _recalculate()

func _on_hp_healed(healed_unit: BattleUnit, ...) -> void:
    if healed_unit == owner:
        _recalculate()

func _recalculate() -> void:
    owner.modifier_handler.remove_values_by_source(SOURCE_DEF)

    var max_hp: float = owner.modifier_handler.get_stat("max_hp")
    var missing_pct: float = (max_hp - owner.combat_state.current_health) / max_hp * 100.0
    var stacks: int = int(missing_pct / 10.0)  # 1 stack per 10% HP missing

    if stacks <= 0:
        return

    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.FLAT
    mod.flat_value = stacks * 10.0  # e.g. +10 Phys Def per stack
    mod.source = SOURCE_DEF
    owner.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, mod)

func deactivate() -> void:
    EventBus.unit_damaged.disconnect(_on_hp_changed)
    EventBus.unit_healed.disconnect(_on_hp_healed)
    owner.modifier_handler.remove_values_by_source(SOURCE_DEF)
```

**Why not StatusEffect?** StatusEffect is designed for timed buffs. Here the value changes continuously and has no expiry — direct modifier manipulation is cleaner and avoids overhead.

---

### Pattern 3: Rolling Stack Timer avec Tween killable (Grolm — Rhinohide)

**Problem:** A passive grants stacking buffs when hit, but all stacks expire together 2s after the *last* hit (not each hit individually). Each new hit resets the 2s window.

**Solution:** Maintain a single `Tween` that resets every hit. All stacks decay together when the tween fires.

```gdscript
var _stacks: int = 0
var _stack_tween: Tween = null

func _on_unit_damaged(damaged_unit: BattleUnit, ...) -> void:
    if damaged_unit != owner:
        return
    _stacks = mini(_stacks + 1, max_stacks)
    _reset_stack_timer()
    _update_modifiers()

func _reset_stack_timer() -> void:
    if _stack_tween != null:
        _stack_tween.kill()           # Cancel previous timer
    _stack_tween = owner.create_tween()
    _stack_tween.tween_interval(2.0)
    _stack_tween.tween_callback(_on_stacks_expired)

func _on_stacks_expired() -> void:
    _stacks = 0
    _update_modifiers()

func _update_modifiers() -> void:
    owner.modifier_handler.remove_values_by_source(SOURCE_DEF)
    if _stacks <= 0:
        return
    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.FLAT
    mod.flat_value = _stacks * 20.0
    mod.source = SOURCE_DEF
    owner.modifier_handler.add_modifier_value(Modifier.Type.PHYS_DEF, mod)
```

**Key difference from StatusEffect stacks:** This approach groups all stacks into one expiry window, which is simpler and matches the design intent "gain X for 2s" (all stacks share the same 2s clock).

---

### Pattern 4: Timer Looping pour Basic Attack (Grolm — Stonefist)

**Problem:** A basic attack enhancement triggers on a time-based cadence (every 2.5s), not on every N attacks.

**Solution:** Use `owner.create_tween().set_loops()` to create an infinite repeating timer that sets a flag. The flag is consumed by the next attack.

```gdscript
var _heal_ready: bool = false
var _loop_tween: Tween = null

func activate() -> void:
    EventBus.combat_attack_resolved.connect(_on_attack_resolved)
    if is_enhanced():
        _loop_tween = owner.create_tween().set_loops()
        _loop_tween.tween_interval(2.5)
        _loop_tween.tween_callback(func() -> void: _heal_ready = true)

func deactivate() -> void:
    EventBus.combat_attack_resolved.disconnect(_on_attack_resolved)
    if _loop_tween != null:
        _loop_tween.kill()
        _loop_tween = null
    _heal_ready = false

func _on_attack_resolved(attacker: BattleUnit, ...) -> void:
    if attacker != owner or not _heal_ready:
        return
    _heal_ready = false
    # ... apply effect
```

**Important:** Always call `_loop_tween.kill()` in `deactivate()` to prevent the tween from firing after battle end.

---

### Pattern 5: Spell avec Détonation Retardée + Spread on Death (Vema — Star Sigil)

**Problem:** A spell places a delayed effect on a target. If the target dies before the effect triggers, it spreads to nearby enemies and detonates there instead.

**Solution:** Apply a marker StatusEffect to identify the target. Maintain a Dictionary tracking live sigil targets. Connect `unit_died` to intercept premature death and redirect.

```gdscript
const SIGIL_DELAY: float = 1.5
const SOURCE_SIGIL := "vema_spell_sigil"
var _sigil_targets: Dictionary = {}  # BattleUnit -> effectiveness (float)

func _place_sigil(target: BattleUnit, effectiveness: float) -> void:
    if _sigil_targets.has(target):
        return
    _sigil_targets[target] = effectiveness

    # Apply a zero-value marker so the target is identifiable via get_effect()
    var marker_mod := ModifierValue.new()
    marker_mod.type = ModifierValue.Type.FLAT
    marker_mod.flat_value = 0.0
    marker_mod.source = SOURCE_SIGIL
    var marker := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_DEBUFF, SOURCE_SIGIL, owner,
        SIGIL_DELAY + 0.5, Modifier.Type.DAMAGE_AMPLIFICATION, marker_mod
    )
    target.status_effect_handler.apply_effect(marker)

    if not EventBus.unit_died.is_connected(_on_sigil_target_died):
        EventBus.unit_died.connect(_on_sigil_target_died)

    var tween := owner.create_tween()
    tween.tween_interval(SIGIL_DELAY)
    tween.tween_callback(_detonate.bind(target, effectiveness))

func _on_sigil_target_died(dead_unit: BattleUnit) -> void:
    if not _sigil_targets.has(dead_unit):
        return
    var effectiveness: float = _sigil_targets[dead_unit]
    _sigil_targets.erase(dead_unit)

    # Spread to nearest enemies and re-place sigils
    for spread_target in _get_spread_targets(dead_unit):
        _place_sigil(spread_target, effectiveness * 0.70)

    if _sigil_targets.is_empty():
        EventBus.unit_died.disconnect(_on_sigil_target_died)

func _detonate(target: BattleUnit, effectiveness: float) -> void:
    _sigil_targets.erase(target)
    if not is_instance_valid(target) or not target.combat_state.is_alive():
        return  # Target already died and spread was handled by _on_sigil_target_died
    target.status_effect_handler.remove_effect(SOURCE_SIGIL)
    # ... deal AoE damage
```

**Key guards:**
- `_sigil_targets.has(target)` prevents double-placing on the same unit.
- `is_connected()` before connecting prevents duplicate signal connections.
- Tween fires even if target died — the alive-check inside `_detonate` handles the no-op case.

---

### Pattern 6: HOT + Shield Post-HOT basé sur le Total Healé (Esmara — Regrowth)

**Problem:** Apply a Heal over Time, then after it finishes, grant a Shield equal to a percentage of the total healing actually applied (which may differ from the theoretical total if the target was nearly full HP).

**Solution:** Track actual healing via `unit_healed` signal filtered by source, then apply the shield in a tween callback after the HOT duration.

```gdscript
const SOURCE_HOT := "esmara_spell_hot_primary"
var _primary_target: BattleUnit = null
var _total_healing: float = 0.0

func cast(...) -> void:
    _primary_target = _find_lowest_hp_ally(null)
    _total_healing = 0.0

    var heal_per_tick: float = wisdom * 0.60 / 2.0  # 60% WIS over 2s, ticking every 1s
    var hot := StatusEffect.create_hot(SOURCE_HOT, owner, 2.0, heal_per_tick, 1.0, false)
    _primary_target.status_effect_handler.apply_effect(hot)

    EventBus.unit_healed.connect(_on_unit_healed)

    var tween := owner.create_tween()
    tween.tween_interval(2.1)       # HOT duration + small buffer
    tween.tween_callback(_apply_shield)
    tween.tween_callback(_cleanup)
    tween.tween_callback(cast_finished.emit)

func _on_unit_healed(healed_unit: BattleUnit, amount: float, source: BattleUnit) -> void:
    if source != owner or healed_unit != _primary_target:
        return
    _total_healing += amount        # Accumulate actual healing done

func _apply_shield() -> void:
    if is_instance_valid(_primary_target) and _primary_target.combat_state.is_alive():
        CombatResolver.resolve_shielding(_primary_target, _total_healing * 0.30, owner)

func _cleanup() -> void:
    EventBus.unit_healed.disconnect(_on_unit_healed)
    _primary_target = null
    _total_healing = 0.0
```

**Note:** Filter by `source == owner` (not by effect source string) since `unit_healed` carries the source BattleUnit. The HOT ticks call `CombatResolver.resolve_healing()` internally with `owner` as the source.

---

### Pattern 7: Spell Crit Opt-in + Crit Check Inline (Vema — Oracle's Sight + Star Sigil)

**Problem:** A spell's damage is dealt via `resolve_damage()` (not `resolve_spell_cast()`), so it doesn't benefit from the built-in `can_spell_crit` pipeline. The passive enables crits; the spell must check manually.

**Passive side** — set the flag in `activate()`:

```gdscript
func activate() -> void:
    owner.combat_state.can_spell_crit = true
    # T3: permanent stat buffs via add_modifier_value()

func deactivate() -> void:
    owner.combat_state.can_spell_crit = false
    owner.modifier_handler.remove_values_by_source(SOURCE_CRIT)
```

**Spell side** — inline crit check before `resolve_damage()`:

```gdscript
func _deal_sigil_damage(target: BattleUnit, base_damage: float) -> void:
    var damage: float = base_damage

    if owner.combat_state.can_spell_crit:
        var crit_chance: float = owner.modifier_handler.get_stat("crit_chance_percent")
        if crit_chance > 0.0 and randf() * 100.0 < crit_chance:
            var crit_mult: float = owner.modifier_handler.get_stat("crit_damage_percent") / 100.0
            damage *= crit_mult

    CombatResolver.resolve_damage(target, damage, GameTypes.DamageType.SPELL, owner)
```

**When to use:** Only when the spell uses `resolve_damage()` for custom AoE or damage type control. If using `resolve_spell_cast()`, the crit is handled automatically when `can_spell_crit` is `true`.

---

### Pattern 8: Aura de Battle-Start via activate() (Esmara — Bloom)

**Problem:** A passive must apply a permanent team-wide buff at the start of battle.

**Solution:** Apply directly in `activate()` — the passive is initialized after all player units are spawned (inside `_enter_battle_phase()`), so allies are already present. Use `modifier_handler.add_modifier_value()` for permanent modifiers (no StatusEffect duration needed).

```gdscript
const SOURCE_AURA := "esmara_passive_aura"

func activate() -> void:
    var allies: Array[BattleUnit] = TargetingSystem.get_all_allies(owner)
    for ally: BattleUnit in allies:
        var hp_mod := ModifierValue.new()
        hp_mod.type = ModifierValue.Type.FLAT
        hp_mod.flat_value = 15.0   # +15 Healing Power (base is 100, this adds 15)
        hp_mod.source = SOURCE_AURA
        ally.modifier_handler.add_modifier_value(Modifier.Type.HEALING_POWER, hp_mod)

        var sp_mod := ModifierValue.new()
        sp_mod.type = ModifierValue.Type.FLAT
        sp_mod.flat_value = 15.0
        sp_mod.source = SOURCE_AURA
        ally.modifier_handler.add_modifier_value(Modifier.Type.SHIELDING_POWER, sp_mod)
```

**No deactivate cleanup needed:** Battle end discards all BattleUnit nodes and their modifier state. The modifiers are cleaned up automatically with the unit.

**Healing Power / Shielding Power:** Base value in UnitKit is `100.0`. A flat +15 gives 115, which CombatResolver interprets as 115% effectiveness for healing/shielding calculations.

---

### Pattern 9: Stacks Debuff par Cible avec Dictionary (Esmara — Vinesnap)

**Problem:** Each basic attack applies a stackable debuff to the *specific target hit*, up to a max stack count. Each target has its own independent stack counter.

**Solution:** Use a `Dictionary` mapping `BattleUnit → int` for per-target stack counts. Use a unique source ID per target (include `get_instance_id()`) to allow individual removal/refresh. Clean up dead targets via `unit_died`.

```gdscript
const MAX_STACKS: int = 10
const SOURCE_PREFIX := "esmara_basic_as_debuff_"
var _target_stacks: Dictionary = {}  # BattleUnit -> int

func _on_attack_resolved(attacker: BattleUnit, target: BattleUnit, ...) -> void:
    if attacker != owner:
        return
    var current: int = _target_stacks.get(target, 0)
    current = mini(current + 1, MAX_STACKS)
    _target_stacks[target] = current

    var source: String = SOURCE_PREFIX + str(target.get_instance_id())
    target.status_effect_handler.remove_effect(source)  # Remove old (outdated stack count)

    var mod := ModifierValue.new()
    mod.type = ModifierValue.Type.PERCENT_BASED
    mod.percent_value = -(current * 0.03)  # -3% per stack
    mod.source = source
    var effect := StatusEffect.create_stat_mod(
        GameTypes.EffectType.STAT_DEBUFF, source, owner,
        4.0, Modifier.Type.ATTACK_SPEED, mod
    )
    target.status_effect_handler.apply_effect(effect)

func _on_unit_died(dead_unit: BattleUnit) -> void:
    _target_stacks.erase(dead_unit)  # Prevent memory leak from dead BattleUnit references
```

**Why remove and reapply each hit?** StatusEffect doesn't support "modify value in-place". The cleanest approach is: remove the old effect (which also removes its modifier), then apply a fresh one with the new total value and a refreshed duration.

**Duration choice:** Use a duration long enough to act as "while in combat" (4s here). This prevents the debuff from falling off if Esmara stops attacking temporarily.

---

| What | Where |
|------|-------|
| Base classes | `scripts/abilities/` |
| Script templates | `script_templates/BasicAttackAbility/`, `SpellAbility/`, `PassiveAbility/`, `BonusEffect/` |
| BonusEffect base | `scripts/bonus_effect/bonus_effect.gd` |
| BonusEffect scripts | `scripts/bonus_effect/synergy/`, `scripts/bonus_effect/blessing/`, `scripts/bonus_effect/oath/` |
| StatusEffect | `scripts/status_effect/status_effect.gd` |
| StatusEffectHandler | `scripts/components/status_effect_handler.gd` |
| AbilityHandler | `scripts/components/ability_handler.gd` |
| ModifierHandler | `scripts/components/modifier_handler.gd` |
| Modifier types | `scripts/components/modifier.gd` |
| ModifierValue | `scripts/modifier/modifier_value.gd` |
| CombatResolver | `autoload/combat_resolver.gd` |
| CombatState | `scripts/components/combat_state.gd` |
| TargetingSystem | `autoload/targeting_system.gd` |
| EventBus | `autoload/event_bus.gd` |
| GameTypes (enums) | `autoload/game_types.gd` |
| BonusManager | `scripts/custom_nodes/bonus_manager.gd` |
| SynergyKit | `data/core/kits/synergy_kit.gd` |
| BlessingKit | `data/core/kits/blessing_kit.gd` |
| FactionOath | `data/core/kits/faction_oath_kit.gd` |
| UnitKit | `data/core/kits/unit_kit.gd` |
| Hero resources | `data/heroes/{faction}/{hero}.tres` |
| Synergy resources | `data/synergies/class/`, `data/synergies/faction/` |


---

> [!info] Related Documents
> - [[hero_kits]] — Hero kit data reference
> - [[synergies]] — Synergy effects reference
> - [[blessing_kits]] — Blessing effects reference
> - [[faction_oaths]] — Faction oath effects reference
