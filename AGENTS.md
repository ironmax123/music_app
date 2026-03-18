# AGENTS guidelines for this repo

Scope: applies to the entire repository.

- Do not use emoji for UI icons.
  - Use inline SVG components or Google Material Symbols (locally provided) instead.
  - Prefer inline SVG stored under `src/shared/icons` to avoid network dependencies.
  - Icons must be accessible: include descriptive `aria-label` on buttons and keep icons decorative.
- Keep Presentation free of business logic. Use `features/*/usecases` for behavior and `features/*/state` for state.
- Favor small, reusable UI components; screens should be thin orchestrators.
- Keep styles cohesive: use module CSS and shared CSS variables where possible.

