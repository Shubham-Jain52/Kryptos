# Design System Strategy: The Luminescent Monolith

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Luminescent Monolith."** 

In the high-stakes world of medical AI, the UI must oscillate between two poles: the absolute authority of a secure vault and the ethereal intelligence of a living organism. We move beyond "template-driven" design by embracing **Intentional Asymmetry**. By utilizing massive, blurred radial gradients (Blazing Flame and Alabaster Grey) positioned off-center, we break the visual stagnation of typical medical dashboards. The layout should feel like a high-end editorial spread—heavy on negative space, driven by bold typographic scales, and layered with "physical" depth that feels like looking through multiple panes of smoked glass.

## 2. Colors & Surface Architecture
The color palette is a study in extreme contrast, designed to draw the eye toward critical diagnostic data while maintaining a low-fatigue "Carbon Black" environment.

### The Color Palette (Material Tokens)
*   **Surface (Base):** `#131313` (Carbon Black)
*   **Primary:** `#ffb4a1` (Blazing Flame Core)
*   **Primary Container:** `#fd582d` (Blazing Flame Glow)
*   **Secondary:** `#c5c7c5` (Alabaster Grey)
*   **On-Surface:** `#e5e2e1` (White Primary Text)
*   **On-Surface-Variant:** `#e4beb5` (Dust Grey Secondary Text)

### The "No-Line" Rule
Traditional 1px solid dividers are strictly prohibited. In a premium medical environment, lines create "visual noise" that interferes with data legibility. Structure must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` for large sectioning and `surface-container-highest` for interactive elements.
2.  **Tonal Transitions:** Defining an area by its relationship to the underlying radial glow.

### Surface Hierarchy & Nesting
Think of the UI as a series of nested glass plates.
*   **Level 0 (The Void):** `surface-container-lowest` (#0e0e0e). Use this for the deepest background layer.
*   **Level 1 (The Canvas):** `surface` (#131313). The primary workspace.
*   **Level 2 (The Interactive):** `surface-container` (#201f1f). Standard cards and interactive zones.
*   **The Glass Layer:** For floating modals or "AI Insight" panels, use the **Extreme Glassmorphism** token: `rgba(255, 255, 255, 0.04)` with a `32px` backdrop-filter. This creates a tactile sense of premium security.

## 3. Typography: The Editorial Authority
We utilize a dual-font strategy to balance technical precision with human-centric readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric purity. Use `display-lg` (3.5rem) with tight letter-spacing for high-impact metrics or AI conclusions. It should feel like a headline in a luxury medical journal.
*   **Body & Titles (Inter):** The workhorse of the system. `body-md` (0.875rem) provides the legibility required for complex medical data.
*   **Hierarchy Note:** Use `on-surface` (#FFFFFF) only for primary headers. All supporting text must use `on-surface-variant` (#CED0CE) to create a clear "information scent" and reduce visual vibration against the black background.

## 4. Elevation & Depth
Depth in this system is not "shadowed"—it is **Luminous**.

*   **The Layering Principle:** Instead of traditional shadows, achieve lift by placing a `surface-container-high` element over a `surface-dim` background. The eye perceives the lighter grey as being physically closer.
*   **Ambient Shadows:** If a floating element requires a shadow (e.g., a critical alert popover), use a diffused glow instead of a black shadow. Use `primary` at 8% opacity with a `48px` blur to simulate the Blazing Flame light source reflecting off the surface.
*   **The "Ghost Border":** Where containment is required for accessibility, use a "Ghost Border": `outline-variant` (#5b403a) at 15% opacity. It should be felt, not seen.

## 5. Components

### Buttons & Interaction
*   **Primary CTA:** A "Blazing Flame" gradient transitioning from `primary` to `primary-container`. High-gloss finish. No border.
*   **Secondary:** `surface-container-highest` with a `1px` Ghost Border. Subtle and architectural.
*   **Ghost Action:** Text-only using `secondary_fixed_dim`. Use for tertiary navigation.

### Input Fields & Controls
*   **Text Inputs:** Background: `surface-container-lowest`. On focus, the border transitions to a 10% Blazing Flame glow. Forbid hard white outlines.
*   **Chips:** Selection chips should use the Glassmorphism style. When selected, apply a subtle `2px` inner glow of `secondary`.
*   **Cards & Lists:** **Strictly forbid dividers.** Use `Spacing Scale 4` (1.4rem) to create separation between list items. Group related medical data by placing it on a slightly lighter `surface-container` background.

### Custom Medical Components
*   **The "AI Insight" Panel:** A large, asymmetrical glass container using `xl` (1.5rem) rounding, positioned partially over a Blazing Flame radial gradient to make the glass appear as if it's "catching the light."
*   **Diagnostic Gauges:** Thin, high-contrast strokes using `primary` (Blazing Flame) against `surface-container-lowest`.

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Place the radial glows in the corners or behind key data points to guide the user's eye naturally.
*   **Use Generous Padding:** Premium feels like "breathing room." Use `Spacing Scale 8` (2.75rem) for container padding.
*   **Layer Glass:** Use backdrop-blur to stack panels. The more layers visible, the more "complex" and "secure" the platform feels.

### Don’t:
*   **Don't use 100% Black:** Pure `#000000` is for dead pixels. Use `surface-container-lowest` (#0e0e0e) for the darkest tones to maintain "inkiness."
*   **Don't use Solid Borders:** Avoid the "Bootstrap" look. If you can't see the background through a border, it's too heavy.
*   **Don't Overuse Blazing Flame:** It is a high-energy accent. If more than 5% of the screen is orange, the "premium" feel is lost to "emergency" feel. Use it for data peaks and primary actions only.