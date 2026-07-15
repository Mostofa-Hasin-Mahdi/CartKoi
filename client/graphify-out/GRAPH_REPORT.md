# Graph Report - client  (2026-07-15)

## Corpus Check
- 30 files · ~39,915 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 146 nodes · 163 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60985a6f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useAuth()` - 9 edges
3. `createClient()` - 9 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `scripts` - 5 edges
7. `formatHoursForDisplay()` - 5 edges
8. `Button()` - 3 edges
9. `cn()` - 3 edges
10. `updateSession()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `EmployeeDashboard()` --calls--> `useAuth()`  [INFERRED]
  src/app/employees/dashboard/page.tsx → src/hooks/useAuth.ts
- `OwnerDashboard()` --calls--> `useAuth()`  [INFERRED]
  src/app/owners/dashboard/page.tsx → src/hooks/useAuth.ts
- `CartDetailPage()` --calls--> `formatHoursForDisplay()`  [EXTRACTED]
  src/app/cart/[id]/page.tsx → src/utils/hours.ts
- `NavBar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/NavBar.tsx → src/hooks/useAuth.ts
- `TopBar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/TopBar.tsx → src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (10): NavBar(), TopBar(), EmployeeDashboard(), OwnerDashboard(), MapComponent, useAuth(), User, ViewState (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, leaflet, lucide-react, next (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.27
Nodes (7): customIcon, openIcon, CartDetailPage(), daysOfWeek, formatHoursForDisplay(), getTodayHours(), OperatingHours

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/leaflet, @types/node, @types/react (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (6): tailwind, baseColor, config, css, cssVariables, prefix

### Community 9 - "Community 9"
Cohesion: 0.70
Nodes (3): cn(), Button(), buttonVariants

### Community 10 - "Community 10"
Cohesion: 0.60
Nodes (3): config, proxy(), updateSession()

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **84 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 3` to `Community 6`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 5` to `Community 6`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useAuth()` (e.g. with `EmployeeDashboard()` and `OwnerDashboard()`) actually correct?**
  _`useAuth()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._