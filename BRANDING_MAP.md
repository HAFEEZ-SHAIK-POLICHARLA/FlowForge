\# FlowForge Branding \& Migration Tracker



\*\*Project:\*\* FlowForge

\*\*Base Project:\*\* ActivePieces

\*\*Repository:\*\* C:\\PROJECTS\\FlowForge\\deployment

\*\*Current Branch:\*\* flowforge-branding



\---



Development Environment



\[✓] Production Docker deployment verified

\[ ] Inspect docker-compose.dev.yml

\[ ] Decide development workflow

\[ ] Verify local source changes are reflected

\[ ] CP-02 Development Environment Ready







\# Project Rules



\## Allowed Changes



\* Replace all user-visible ActivePieces branding.

\* Replace logos, icons and favicons.

\* Replace browser metadata.

\* Replace color palette.

\* Hide unnecessary UI on Day 4.

\* Customize templates and marketplace later.



\## Protected Areas (Do NOT modify unless absolutely necessary)



\* Docker services

\* PostgreSQL configuration

\* Redis configuration

\* Worker architecture

\* Execution Engine

\* Scheduler

\* Internal TypeScript identifiers

\* Package/workspace names

\* API contracts



\---



\# Git Checkpoints



| Checkpoint | Status | Description                                                                    | Commit     |

| ---------- | ------ | ------------------------------------------------------------------------------ | ---------- |

| CP-00      | ✅     | Stable Docker deployment, workers and scheduler verified                       | 1158da261e |

| CP-01      | ✅     | Browser branding investigation completed                                       |            |

| CP-02      | 🚧     | Development environment migration (dependencies installed, local dev setup in progress)|    |            

| CP-03      | ☐      | Browser branding implemented and verified                                      |            |

| CP-04      | ☐      | Logo system complete                                                           |            |

| CP-05      | ☐      | Theme \& color palette complete                                                 |            |

| CP-06      | ☐      | Visible UI branding complete                                                   |            |

| CP-07      | ☐      | Navigation cleanup \& feature removal complete                                  |            |

| CP-08      | ☐      | Marketplace \& authentication customization complete                            |            |

| CP-09      | ☐      | Final QA, deployment verification \& release                                    |            |

\---



\# Phase 1 — Visible Branding (Day 3)



\## Browser



\## Browser



| Status | Item                   | File                                       | Notes                                                                         |

| ------ | ---------------------- | ------------------------------------------ | ----------------------------------------------------------------------------- |

| ✏️     | Browser Title Source   | `packages/web/vite.config.mts`             | `const AP\_TITLE = 'Activepieces';` Ready to modify.                           |

| ✏️     | Browser Favicon Source | `packages/web/vite.config.mts`             | `const AP\_FAVICON = 'https://activepieces.com/favicon.ico';` Ready to 

&#x20;                                                                                 modify. |

| ✅      | Browser Title Injector | `packages/web/vite-plugins/html-plugin.js` | Confirmed. Injects title and favicon into HTML.                               |

| ✅      | Browser HTML           | `packages/web/index.html`                  | Confirmed. Uses `apTitle` and `apFavicon` placeholders.                       |

| \[ ]     | Browser Manifest       | Not yet investigated                       |                                                                               |







\### Planned Changes



\- Change `AP\_TITLE` from `Activepieces` → `FlowForge`.

\- Change `AP\_FAVICON` from the external ActivePieces URL to the local FlowForge favicon.

\- Replace `packages/web/public/favicon.ico` with the FlowForge favicon.

\- Verify browser tab title updates correctly.

\- Verify browser favicon updates correctly.

\- Create Git Checkpoint CP-01 after successful verification.





\---



\## Logos



| Status | Item                | File                                             | Notes                  |

| ------ | ------------------- | ------------------------------------------------ | ---------------------- |

| \[\~]    | Main Logo Component | packages/web/src/components/custom/full-logo.tsx | Primary logo component |

| \[ ]    | Sidebar Logo        |                                                  |                        |

| \[ ]    | Login Logo          |                                                  |                        |

| \[ ]    | Loading Logo        |                                                  |                        |



\---



\## Assets



| Status | Asset    | File                             | Notes                       |

| ------ | -------- | -------------------------------- | --------------------------- |

| \[\~]    | SVG Logo | packages/web/public/logo.svg     | Replace with FlowForge logo |

| \[\~]    | Logo 180 | packages/web/public/logo-180.png | Replace                     |

| \[\~]    | Logo 192 | packages/web/public/logo-192.png | Replace                     |

| \[\~]    | Favicon  | packages/web/public/favicon.ico  | Replace                     |



\---



\## Theme



| Status | Item            | Notes |

| ------ | --------------- | ----- |

| \[ ]    | Primary Color   |       |

| \[ ]    | Secondary Color |       |

| \[ ]    | Accent Color    |       |

| \[ ]    | Dark Theme      |       |



\---



\## Visible UI



| Status | Item             | Notes |

| ------ | ---------------- | ----- |

| \[ ]    | Application Name |       |

| \[ ]    | Login Screen     |       |

| \[ ]    | Sidebar          |       |

| \[ ]    | Dashboard        |       |

| \[ ]    | Footer           |       |



\---



\# Phase 2 — UI Cleanup (Day 4)



\* \[ ] Remove unnecessary navigation items

\* \[ ] Hide Impact

\* \[ ] Hide Leaderboard

\* \[ ] Hide marketing pages

\* \[ ] Hide community pages



\---



\# Phase 3 — Marketplace \& Templates



\* \[ ] Marketplace branding

\* \[ ] Template branding

\* \[ ] Category branding

\* \[ ] Custom FlowForge templates



\---



\# Phase 4 — Deployment Branding



\* \[ ] Public domain

\* \[ ] Browser metadata

\* \[ ] OpenGraph metadata

\* \[ ] Social preview

\* \[ ] SEO metadata



\---



\# Testing Log



| Date       | Tested            | Result |

| ---------- | ----------------- | ------ |

| 2026-06-24 | Docker deployment | ✅      |

| 2026-06-24 | Worker execution  | ✅      |

| 2026-06-24 | Scheduler         | ✅      |



\---



\# Rollback Commands



Current Stable Checkpoint



git reset --hard 1158da261e



Latest Checkpoint



git log --oneline



\---



\# Notes



\* Never perform global find-and-replace.

\* Work one component at a time.

\* Test after every logical change.

\* Create a Git checkpoint after each completed milestone.

\* If a checkpoint fails testing, roll back immediately before continuing.



