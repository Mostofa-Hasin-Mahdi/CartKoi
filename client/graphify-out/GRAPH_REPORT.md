# Graph Report - client  (2026-07-21)

## Corpus Check
- 37 files · ~54,012 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 166 nodes · 209 edges · 16 communities (9 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `098b72d4`
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
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useAuth()` - 11 edges
3. `createClient()` - 11 edges
4. `tailwind` - 6 edges
5. `aliases` - 6 edges
6. `Skeleton()` - 6 edges
7. `scripts` - 5 edges
8. `formatHoursForDisplay()` - 5 edges
9. `EmptyState()` - 3 edges
10. `Button()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `EmployeeDashboard()` --calls--> `useAuth()`  [INFERRED]
  src/app/employees/dashboard/page.tsx → src/hooks/useAuth.ts
- `OwnerDashboard()` --calls--> `useAuth()`  [INFERRED]
  src/app/owners/dashboard/page.tsx → src/hooks/useAuth.ts
- `CartDetailPage()` --calls--> `formatHoursForDisplay()`  [EXTRACTED]
  src/app/cart/[id]/page.tsx → src/utils/hours.ts
- `ProfilePage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/profile/page.tsx → src/hooks/useAuth.ts
- `NavBar()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/NavBar.tsx → src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (16 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (17): metadata, poppins, NavBar(), TopBar(), EmployeeDashboard(), OwnerDashboard(), useAuth(), User (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, leaflet, lucide-react, next (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (9): customIcon, openIcon, CartDetailPage(), calculateDistance(), deg2rad(), daysOfWeek, formatHoursForDisplay(), getTodayHours() (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (18): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/leaflet, @types/node, @types/react (+10 more)

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
- **89 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 3` to `Community 5`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 7` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useAuth()` (e.g. with `EmployeeDashboard()` and `OwnerDashboard()`) actually correct?**
  _`useAuth()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13227513227513227 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._