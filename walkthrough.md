# Walkthrough - UI Refinement, Vanish Logic, and Weeklies Split

I have completed the requested UI refinements, ensuring a unified aesthetic across all pages and implementing the "vanish on completion" behavior.

## Changes Made

### 1. Global "Show Completed Tasks" Setting
- Added a new toggle to the **Navbar Settings** panel.
- **Vanish Behavior**: When this setting is **OFF** (default), completed tasks vanish immediately. The bottom curvature of the section automatically "jumps" to the next available row, keeping the table boundary tidy.
- **Green Preservation**: When this setting is **ON**, completed tasks remain visible and turn **green** for visual clarity.

### 2. Checkbox Styling & Centering
- **Alignment Fix**: Added `10px` right-padding to the status cell. This compensates for the row's `clip-path` inset, ensuring checkboxes are perfectly centered in their visible area.
- **Black Line Removal**: Removed the `border-left` from the status cell to eliminate the distracting vertical line on the checkbox's left side.
- **Unified Height**: Enforced a `30px` row height globally to match the standard task page template.

### 3. Weeklies Split (Penguins)
- **Visual Break**: Implemented a 6px gap above the "Penguins" subparent header.
- **Curvature Logic**: Updated the weeklies renderer to apply terminal curvature to the row immediately preceding the split (e.g., "Advance Time"), creating a distinct visual separation within the weeklies block.

### 4. Farming Page Unification
- **Stripped Overrides**: Removed hardcoded grey backgrounds and 40px heights from `farming.css`.
- **Result**: The Farming page now perfectly mirrors the Task page styling (red theme, 30px height, unified gaps) while retaining its unique timer logic.

## Verification Results
- **Build Status**: `npm run build` completed successfully.
- **State Logic**: Verified that `getTaskState` correctly returns `'hide'` based on the new global setting.
- **CSS Hierarchy**: Verified that `subgroup-header-row` correctly applies the 6px hierarchical gap in all contexts.
