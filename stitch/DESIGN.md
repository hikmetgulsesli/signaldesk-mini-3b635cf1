---
name: SignalDesk Mini Operational System
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  element-gap-sm: 8px
  element-gap-md: 12px
---

## Brand & Style

The design system is engineered for high-performance operational environments where clarity, speed of cognition, and extended focus are paramount. The personality is **Product-First**: an aesthetic that removes all marketing-driven visual noise in favor of a utilitarian, systematic interface. 

The design style is **Corporate / Modern** with a lean toward **Minimalism**. It prioritizes a calm, "Zen-like" workspace through a restrained color palette, crisp borders, and a rigorous adherence to a functional grid. The interface should feel like a precision instrument—reliable, professional, and invisible until needed.

## Colors

The color strategy uses a "neutral-plus" approach to maintain a calm atmosphere. The canvas is a soft light gray, allowing white surfaces to clearly define work areas without harsh glare. 

- **Primary (#1E293B):** Used for critical actions and navigational structure to anchor the eye.
- **Accents:** Semantic colors are reserved strictly for status communication (Success, Warning, Error) and should never be used decoratively.
- **Text:** Headings utilize Slate 900 for maximum legibility. Body text uses Slate 600 to reduce visual fatigue during long periods of data entry and monitoring.

## Typography

This design system utilizes **Inter** for its exceptional legibility at small sizes and high-density layouts. 

- **Tabular Data:** For all metrics, prices, and IDs, the `font-feature-settings` must be set to `tnum` (tabular numbers) to ensure digits align vertically in tables.
- **Scale:** Sizes are kept compact (13px-14px for body) to maximize information density on desktop screens.
- **Hierarchy:** Weight is used more frequently than size to denote hierarchy, keeping the layout compact and stable.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a 4px base unit. 

- **Density:** We employ a "Compact/Moderate" density. Interior padding for inputs and buttons should be tight (8px horizontal, 4px vertical) to allow for more rows in data tables.
- **Margins:** Consistent 24px margins on the page perimeter provide breathing room for the content.
- **Breakpoints:** 
  - **Desktop (1440px+):** Full 12-column span.
  - **Compact (1024px-1439px):** Columns shrink; sidebars may collapse to icons.
  - **Mobile:** Reflow to a single column, but primary focus remains on the desktop experience.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-contrast outlines** rather than aggressive shadows.

- **Level 0 (Canvas):** #F8FAFC. The background layer.
- **Level 1 (Card/Surface):** #FFFFFF. White background with a 1px border (#E2E8F0).
- **Shadows:** Use a single "Soft-Ink" shadow for floating elements (modals, dropdowns): `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`. 
- **Interaction:** On hover, surfaces do not lift; instead, borders darken to #CBD5E1 to indicate interactivity.

## Shapes

The shape language is strictly functional and architectural. 

- **Primary Radius:** 4px to 6px. This "Soft" rounding maintains a professional, rigid structure while removing the visual sharpness of 90-degree corners.
- **Consistency:** All form inputs, buttons, and card containers must share this radius. Rounding should not increase with the size of the element; 4px remains the standard for everything from a checkbox to a large container.

## Components

### Buttons
- **Primary:** Background #1E293B, Text #FFFFFF. Bold and decisive.
- **Secondary:** Background #FFFFFF, Border #E2E8F0, Text #334155.
- **Ghost:** No background or border. Text #64748B. Use for low-priority actions like "Cancel."

### Form Fields
- **Default State:** White background, 1px #E2E8F0 border.
- **Focus State:** 1px #1E293B border with a subtle 2px outer glow in #F1F5F9.
- **Validation:** Error states use a #EF4444 border and small 12px helper text below the field.

### Data Tables
- **Header:** Background #F1F5F9, Text Slate 900 (Bold), 12px height.
- **Rows:** 40px minimum height for density. Subtle #F8FAFC hover state for row scanning.

### Chips & Badges
- **Status Badges:** Small (12px text), semi-transparent background of the status color (e.g., 10% opacity) with the full-color text for maximum readability and minimal visual weight.

### Icons
- Use **Lucide** or similar line-style icons with a 1.5px or 2px stroke width. Icons should always be monochrome (Slate 500) unless indicating a specific status.