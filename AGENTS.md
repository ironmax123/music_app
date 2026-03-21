# AGENTS guidelines for this repo

Scope: applies to the entire repository.

- Do not use emoji for UI icons.
  - Use inline SVG components or Google Material Symbols (locally provided) instead.
  - Prefer inline SVG stored under `src/shared/icons` to avoid network dependencies.
  - Icons must be accessible: include descriptive `aria-label` on buttons and keep icons decorative.
- Keep Presentation free of business logic. Use `features/*/usecases` for behavior and `features/*/state` for state.
- Favor small, reusable UI components; screens should be thin orchestrators.
- Keep styles cohesive: use module CSS and shared CSS variables where possible.

## Commit Messages
- Do not use `chore` for any commit. Its use is prohibited across this repository.
- Use precise Conventional Commit types instead: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `build`, `ci`, `perf`, `revert`.
- If none of the above types apply, reframe or split the change so that each commit reflects a meaningful, specific type.

## Postmortems
- When a critical UX regression occurs (e.g., audio not playing, overlapping playback, broken progress sync), add or update a postmortem under `docs/` describing:
  - Symptoms and impact
  - Root causes (what failed in state/usecases/engine boundaries)
  - Concrete fixes landed (files and functions)
  - Lessons learned and prevention steps
- Current example: `docs/postmortem_audio_playback.md`. Keep it up to date when related areas change.
