---
title: "Session Context"
tags: [session, technical, context]
source: "session_context.md (existing)"
last_updated: 2026-03-26
---

# Strifeborn - Session Context

> **Last updated**: 2026-03-24
> **Purpose**: Persistent context file for Claude Code sessions. Read at session start, updated at session end.

---

## Project Overview

- **Engine**: Godot 4 (GDScript)
- **Genre**: Tactical auto-battler roguelike (TFT-style)
- **Platform**: Mobile
- **6 Factions**: Aegis, Eclipse, Inquisition, Nebulae, Nexus, Shogunate
- **6 Classes**: Fighter, Tank, Support, Shooter, Assassin, Caster

---

## Project Structure

```
Strifeborn/
├── autoload/          # Global singletons
├── assets/            # Sprites, audio, fonts, shaders, themes
├── data/              # Game data & resources
│   ├── config/        # Game configuration
│   ├── core/          # Core data classes (kits, meta, pools, waves)
│   ├── heroes/        # Per-hero content (abilities, relics, skins)
│   ├── blessings/     # BlessingKit resources
│   ├── faction_oaths/ # FactionOath resources
│   ├── synergies/     # SynergyKit resources
│   ├── json/          # JSON data files
│   ├── pools/         # Hero, enemy, item, synergy pools
│   └── waves/         # Wave definitions
├── scenes/            # Godot scenes (.tscn)
│   ├── _menus/        # Main menu, level select, settings
│   ├── level/         # Gameplay level & board
│   ├── ui/            # All UI (cards, bars, screens, popups)
│   ├── unit/          # Unit prefabs
│   └── sell_portal/   # Sell mechanic
├── scripts/           # Core game logic
│   ├── abilities/     # BasicAttackAbility, SpellAbility, PassiveAbility base classes
│   ├── bonus_effect/  # BonusEffect polymorphic system
│   ├── components/    # Reusable unit components
│   ├── custom_nodes/  # ObjectGrid, BattleHandler, AStarHexGrid2D, etc.
│   ├── modifier/      # Modifier & ModifierValue stat system
│   └── status_effect/ # StatusEffect system
├── utils/             # Data generators & dev helpers
└── DOCUMENTATION/     # Obsidian vault — design docs, data refs, technical guides
    ├── design/        # Core design, game modes, items, meta progression
    ├── heroes/        # Hero kits data & progression system
    ├── enemies/       # Enemy & boss compendium
    ├── synergies/     # Synergy design & data
    ├── blessings/     # Blessing system & kits
    ├── faction_oaths/ # Faction oath data
    ├── lore/          # Campaign lore, art style
    ├── technical/     # Ability tutorial, icon prompts
    └── _session/      # Session context
```

---

## Autoloads (Singletons)

| Singleton | File | Role |
|-----------|------|------|
| **EventBus** | `autoload/event_bus.gd` | Central pub/sub hub with 100+ signals (battle, UI, meta, phases) |
| **GameTypes** | `autoload/game_types.gd` | All enums, constants (CELL_SIZE, BATTLE_DURATION, MAX_DEPLOY=12) |
| **GameRun** | `autoload/game_run.gd` | Run lifecycle, save/load (encrypted JSON), gold/life/meta management |
| **CombatResolver** | `autoload/combat_resolver.gd` | Damage/healing calculator, auto-attack & spell resolution pipeline |
| **TargetingSystem** | `autoload/targeting_system.gd` | Target priority AI (closest → priority score → lowest HP) |
| **UnitNavigation** | `autoload/unit_navigation.gd` | A* hex pathfinding with tile reservation |
| **GameText** | `autoload/game_text.gd` | Localization/text database |
| **SceneTransition** | `autoload/scene_transition.gd` | Fade transitions |
| **AudioPlayer** | `autoload/audio_player.gd` | Centralized audio |

---

## Core Data Classes (Kits)

All kits extend `ResourceWithCustomID` (provides `custom_id: String`).

- **UnitKit** (`data/core/kits/unit_kit.gd`): Hero/enemy definition — stats, faction, class, tier, abilities (3 scripts), skins, synergies, persistent modifiers. `get_final_stat(name)` applies level + tier scaling.
- **SynergyKit** (`data/core/kits/synergy_kit.gd`): Synergy with levels, unit requirements, and `synergy_bonuses: Array[BonusEffect]`.
- **BlessingKit** (`data/core/kits/blessing_kit.gd`): Run blessing with category, rarity, and `effect: BonusEffect`.
- **FactionOath** (`data/core/kits/faction_oath_kit.gd`): Run modifier with `effects: Array[BonusEffect]`.
- **SkinKit** (`data/core/kits/skin_kit.gd`): Visual variant (texture, portrait, VFX, SFX).

---

## Key Runtime Classes

### BattleUnit (Node2D)
Core battle entity with components:
- `unit_kit: UnitKit` — data reference
- `modifier_handler: ModifierHandler` — stat modifiers during battle
- `combat_state: CombatState` — mutable state (HP, mana, shield, timers)
- `status_effect_handler: StatusEffectHandler` — active effects
- `ability_handler: AbilityHandler` — activates/deactivates 3 abilities
- Groups: `"player_units"` or `"enemy_units"`

### Components (`scripts/components/`)
- **ModifierHandler**: `get_stat(name)` → base + mods. `add_modifier_value()`, `remove_values_by_source()`.
- **CombatState**: Health, mana, shield, attack timer, revive state, spell cast count.
- **StatusEffectHandler**: Apply/tick/remove effects. CC refreshes, DOTs stack, taunts replace. Tenacity reduces CC.
- **AbilityHandler**: Manages activation/deactivation of unit's 3 abilities.
- **FiniteStateMachine / State**: AI state management.

### Modifier System (`scripts/modifier/`)
- **Modifier**: Per-stat container of ModifierValues. Types: FLAT, PERCENT_BASED, ZERO.
- **ModifierValue**: Individual mod with `flat_value`, `percent_value`, `source`.
- Query path: `ModifierHandler.get_stat()` → `UnitKit.get_final_stat()` → apply mods.

### BonusEffect System (`scripts/bonus_effect/`)
- Abstract base `BonusEffect` (Resource). Subclassed per effect.
- `apply(targets)` / `remove()` pattern.
- `source_id: String`, `persistent: bool`.
- Used by blessings, synergies, faction oaths.

### StatusEffect (`scripts/status_effect/`)
- Lightweight RefCounted. Factory methods: `create_cc()`, `create_dot()`, `create_taunt()`, `create_hot()`, `create_stealth()`, `create_stat_mod()`.
- CC types: STUN, SILENCE, DISARM, ROOT, FEAR, CHARM, SLEEP, BLIND, AIRBORNE.

---

## Ability System

Three base classes (all RefCounted, in `scripts/abilities/`):

| Class | Override | Enhancement Tier | Key Pattern |
|-------|----------|-----------------|-------------|
| **BasicAttackAbility** | `activate()`/`deactivate()` | Tier 5 (`is_enhanced()`) | Hook `auto_attack_pre_resolve` / `combat_attack_resolved` |
| **SpellAbility** | `cast(primary_target)` | Tier 7 (`is_enhanced()`) | Emit `cast_finished` when done |
| **PassiveAbility** | `activate()`/`deactivate()` | Tier 3 (`is_enhanced()`) | Hook EventBus signals for on-hit/on-kill/etc. |

Hero abilities live in: `data/heroes/{faction}/{hero}/basic_attack/`, `spell/`, `passive/`

---

## Key Systems & Custom Nodes

- **BattleHandler** (`scripts/custom_nodes/battle_handler.gd`): Battle orchestrator — spawns units, ticks effects, manages phases.
- **ObjectGrid** (`scripts/custom_nodes/object_grid.gd`): 2D grid (Vector2i → Node). Bench & battlefield.
- **BonusManager** (`scripts/custom_nodes/bonus_manager.gd`): Applies blessings/synergies/oaths.
- **ObjectSpawner** (`scripts/custom_nodes/object_spawner.gd`): Instantiates units from UnitKit.
- **PlacementRules** (`scripts/custom_nodes/placement_rules.gd`): Drag-drop validation.

---

## Architecture Patterns

- **Signal-driven**: All cross-system communication via EventBus. No direct method calls between systems.
- **Component-based**: BattleUnit = composition of injected components.
- **Data/Runtime separation**: Resource kits (persistent data) vs. runtime components (battle state).
- **Factory methods**: `StatusEffect.create_cc()`, etc.
- **Setters with signals**: `_set_gold()` → `EventBus.gold_changed.emit()`.

---

## GDScript Conventions

- **Signals**: snake_case, past tense: `unit_died`, `battle_started`
- **Classes**: PascalCase: `BattleUnit`, `ModifierHandler`
- **Methods/Props**: snake_case: `get_stat()`, `current_health`
- **Private**: `_` prefix: `_apply_mitigation()`
- **Constants**: UPPER_CASE: `CELL_SIZE`, `MAX_DEPLOY`
- **Enums**: PascalCase container, UPPER_CASE values: `GameTypes.Faction.AEGIS`
- **Abstract base**: Override pattern with `push_error("Not implemented")`
- **RefCounted** for lightweight objects, **Resource** for persistent data

---

## Critical Implementation Notes

1. **Stat query**: `ModifierHandler.get_stat()` → `UnitKit.get_final_stat()` → apply mods. Never query HP/mana directly; use CombatState.
2. **Damage flow**: `CombatResolver.resolve_auto_attack()` → pre-resolve hook → mitigation → crit → apply to CombatState → post-resolve signal.
3. **Tier scaling**: Only STR, WIS, HP scale: `stat * (1 + 0.06*(T-1) + 0.06*(T-1)²)`
4. **CC stacking**: Refreshes to longest duration. DOTs stack (if stackable flag). Taunts replace.
5. **Tenacity formula**: `multiplier = 100 / (100 + tenacity)`
6. **Grid**: Hex grid, Vector2i coords. Occupied tiles block movement, reserved tiles prevent pathing overlap.
7. **Save system**: Encrypted JSON with backup. Legacy .tres migration supported.

---

## Git Workflow

- Main branch: `main`
- Feature branches: `claude/{descriptive-name}`
- PR merge into main

---

## Session History

| Date | Branch | Changes |
|------|--------|---------|
| 2026-03-24 | `claude/stupefied-solomon` | Created session_context.md, CLAUDE.md, configured opusplan model |
| 2026-03-25 | `claude/infallible-sanderson` | Implemented Sandbox mode: wired MainMenu button, added is_sandbox flag to GameRun, sandbox guards in GameModeManager/BattleHandler, full SandboxUI (unit spawning, tier +/-, dummy spawning, combat start with dummy AI exclusion, real-time stats refresh, clear all) |
| 2026-03-25 | `claude/bold-mccarthy` | Sandbox combat stats: per-unit live tracking for Offense/Defense/Tempo/Utility tabs, DamageTypeBar proportional display, added unit_shielded + unit_damaged_pre_mitigation signals, source param on unit_healed, CombatResolver.resolve_shielding() |
| 2026-03-26 | `claude/youthful-williamson` | Fixed grimm_spell.gd: replaced PlayArea static calls with UnitNavigation.battlefield, fixed get_tree() on RefCounted crash, used proper ObjectGrid.move_object() for grid updates, fixed tier 7 enhancement (was nerfing instead of buffing — now uses phys_pen modifier), added tile reservation during dash, optimized redundant tile computation |
| 2026-03-28 | `claude/competent-hawking` | Fixed Brakka T5 second shot: root cause was unit_ranged_attack_fired spawning a projectile that called resolve_auto_attack (double damage + passive chaining + mana gain). Added unit_ranged_effect_fired signal + resolve_secondary_attack (damage+lifesteal only) + Projectile.setup_secondary mode + BattleUnitPresenter handler. Also: increased proc chance to 30% during Bulletstorm, second shot always targets random enemy in range. Updated hero_kits.md, ability_bonus_tutorial.md (new patterns: get_attack_target, unit_ranged_effect_fired, resolve_secondary_attack, Recipe 19). |
| 2026-04-02 | `claude/elastic-herschel` | Safe area / notch handling for menu UI: created SafeAreaContainer (scripts/ui/safe_area_container.gd), a MarginContainer subclass that reads DisplayServer.get_display_safe_area(), converts insets to viewport coords, and applies max(design_margin, safe_inset) per side. Attached to top-level MarginContainers in main_menu, hero_barrack, level_selection_menu, sandbox_ui. level.tscn UI skipped (absolute-positioned elements tightly coupled to board layout). |
| 2026-04-02 | `claude/laughing-satoshi` | Implemented all 18 Eclipse hero ability scripts (Barkhul, Ereth, Esmara, Grolm, Lunara, Vema — 3 scripts each: basic_attack, spell, passive). Updated 6 UnitKit .tres files to reference the new scripts. Added Section 20 (9 new patterns) to ability_bonus_tutorial.md: dual-type spell damage, HP-scaled dynamic modifier, rolling stack timer, looping tween timer, delayed detonation with spread-on-death, HOT+shield, spell crit inline, battle-start aura, per-target stack Dictionary. Also corrected section 19 to note HOT and Spell Crit as already implemented. |
