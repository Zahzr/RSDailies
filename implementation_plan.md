# Grand Implementation Plan - Blueprint Engine & Layout Precision

This plan details the structural transformation of the Dailyscape tracker into a configuration-driven "Blueprint" system. It directly addresses the verified bugs and layout conflicts identified in the [Audit Report](file:///C:/Users/antho/.gemini/antigravity/brain/bfbed7a4-529b-428b-9f31-7ded680c3ed2/audit_report.md).

## I. Architectural Strategy: The Unified Blueprint Engine

To ensure the tracker is easily expandable and configurable for non-coders, we are replacing manual rendering loops with a central **Section Engine**.

### 1. The Blueprint Configuration
Sections will now be defined by a clear, data-driven "Blueprint." A user can add or modify blocks by simply changing properties:
- `attached`: Set to `true` to remove curvature and gaps between the current block and the one above (e.g., for Penguins).
- `showGapBelow`: Controls the 6px hierarchical split between a header and its task rows.
- `rowType`: Defines which row factory to use (Standard, Grouped, etc.).

### 2. Implementation in `section-engine.js` [NEW]
A unified engine will take these Blueprints and:
1.  Filter visible tasks based on the "Vanish" settings.
2.  Handle the `markLastVisibleRow` rounding logic *once* at the end of the entire block sequence.
3.  Inject dynamic CSS variables to control gaps, eliminating the need for hardcoded class overrides.

## II. Precision Layout: Penguins & Weeklies

Based on the audit, we will precisely adjust the Weeklies block to reconnect the Penguins section:
1.  **Remove Rounding Above**: Remove the call to `markLastVisibleRow` before the Penguins header. The rounding will only occur at the very end of the Penguins tasks (or the entire Weeklies section).
2.  **Gap Unification**: 
    - **Remove Top Gap**: Remove the `subgroup-header-row` class from the Penguins header in the JS.
    - **Add Bottom Gap**: Apply a specific `subgroup-attached-header` class that **only** adds the 6px gap *below* the header, not above it. This ensures it stays "attached" to the row above while keeping internal hierarchy.

## III. Critical Bug Fixes & Aesthetics

### 1. The "Click Bug" Fix
- **Target**: [toggle.js](file:///c:/Users/antho/Documents/Coding/Dailyscape/src/ui/components/tracker/rows/factory/toggle.js)
- **Fix**: Update the state check to handle string return values correctly:
  ```javascript
  const state = getTaskState(sectionKey, taskId, task);
  const isCompleted = (state === 'true' || state === 'hide');
  ```
- **Impact**: Restores immediate visual feedback (Vanish or Green Highlight) when a row is clicked.

### 2. Checkbox Visuals
- **Target**: [table.css](file:///c:/Users/antho/Documents/Coding/Dailyscape/src/ui/components/tracker/tables/styles/table.css)
- **Fix**: Restore the `border-left: 1px solid rgba(255, 255, 255, 0.15);` on `.activity_status`.
- **Global Variables**: Define `--ds-section-gap: 6px` and `--ds-checkbox-border: rgba(255, 255, 255, 0.15)` at the top of the file for easy "non-coder" adjustments.

## IV. Audit-Verified Rules
- **Modularity**: Individual sections (Dailies, Gathering, Weeklies) will be converted to use the Engine sequentially.
- **Farming/Timers**: These will be **completely ignored** in this phase to ensure the main page unification is 100% stable first.
- **Safety**: Each change will be verified against the `npm run build` command to ensure path integrity.

## V. Verification Plan

### Manual Verification
1.  **Interaction Check**: Toggle tasks and verify they vanish or highlight green correctly.
2.  **Hierarchy Check**: Inspect Weeklies. Verify Penguins has no gap above but has a gap below.
3.  **Aesthetic Check**: Verify the checkbox has its subtle white border and is centered.
4.  **Expansion Check**: Verify that adding a mock "attached" block in the config works without extra JS coding.
