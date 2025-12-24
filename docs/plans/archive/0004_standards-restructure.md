---
archived: true
archived_date: 2024-12-24
archived_by: plan-execute
status: COMPLETE
---

## Archive Information

| Field | Value |
|-------|-------|
| Archived | 2024-12-24 |
| PR | N/A (direct to main) |
| Branch | `main` |
| Commits | 18 commits |
| Files Changed | 71 files (+15190 -1819) |

### Implementation Commits

```
fb9e2f3 fix(standards): correct framework links to directories
01892dc fix(standards): restore full-fidelity React files
8d0bd8f fix(standards): restore full-fidelity Spring observability/resiliency/testing
9c77240 docs(plans): mark 0004 standards-restructure as COMPLETE
d8d70a1 docs(standards): create Angular and Bun framework standards
7a027ae docs(standards): create tools standards
8cd4fc5 docs(standards): create data standards
b30094d docs(standards): create protocols-transports/websockets-sse
13ee4e0 docs(standards): enrich messaging with authoritative sources
b5cb786 docs(standards): create protocols-transports/graphql
2953fab docs(standards): create protocols-transports/rest
4c92a64 docs(standards): enrich css with authoritative sources
f6a69b0 docs(standards): create languages/html
003eb00 docs(standards): create languages/javascript
0faeb73 docs(standards): create languages/typescript
4cb9f66 docs(standards): enrich java with authoritative sources
2ee9d11 docs(standards): migrate Java/React standards to new taxonomy
cbf2920 docs(standards): add template, topics, and category structure
```

### Files Changed Summary

| Action | Count | Examples |
|--------|-------|----------|
| Created | ~65 | `content/standards/languages/*.md`, `content/standards/frameworks/*/`, `content/standards/tools/*.md` |
| Modified | ~6 | `docs/plans/0004*.md` |
| Deleted | ~2 | `content/standards/backend/`, `content/standards/frontend/` |

### Execution Summary

**Duration:** 2024-12-24 (single session)
**Phases:** 7 subplans (A-G)
**Reviews:** Subplans executed with review checkpoints

Restructured the entire standards section from backend/frontend organization to a technology-agnostic taxonomy. Created comprehensive standards for languages, frameworks, protocols, data formats, and tools - each sourced from authoritative references.

### Lessons Learned

**What Went Well:**
- Subplan structure (A-G) provided clear parallel execution paths
- Authoritative sources strategy ensured high-quality content
- Directory-based organization for large frameworks (Spring, React) scales well

**Challenges:**
- Framework standards required directory structure change mid-execution

**Recommendations:**
- For large restructuring, consider directory-per-topic from the start
- Cross-cutting topics (error handling, testing, observability) benefited from consistent template

---

# 0004_standards-restructure

**Status:** COMPLETE

---

## Overview

Restructure the standards section from backend/frontend organization to a technology-agnostic taxonomy: languages, frameworks, protocols-transports, data, and tools. Migrate existing Java and React standards to new structure and establish processes for sourcing best practices from authoritative references.

**Related Plans:**
- `0004A_standards-template.md` - Create unified template and cross-cutting topics
- `0004B_standards-migration.md` - Migrate existing Java/React standards
- `0004C_standards-languages.md` - Create language standards (Java, TypeScript, JavaScript, HTML, CSS)
- `0004D_standards-frameworks.md` - Create framework standards (Spring, React, Angular, Bun)
- `0004E_standards-protocols.md` - Create protocol standards (REST, GraphQL, messaging, WebSockets/SSE)
- `0004F_standards-data.md` - Create data standards (JSON, modeling, validation, OpenAPI)
- `0004G_standards-tools.md` - Create tool standards (Bun, Nx, Gradle, Docker, k6, Playwright)

## Goals

1. Replace backend/frontend taxonomy with technology-focused categories
2. Create reusable template ensuring consistency across all standards
3. Define cross-cutting topics that apply to each technology
4. Establish executable process for sourcing from authoritative references
5. Create a "team of experts" - each standard embodies expert knowledge

## Non-Goals

- Creating standards for technologies not listed (future additions)
- Defining organization-specific conventions (those go in project CLAUDE.md)
- Replacing ADRs or other documentation types

---

## Architecture

### New Directory Structure

```
content/standards/
├── README.md                          # Index of all categories
├── TEMPLATE.md                        # Master template for new standards
├── languages/
│   ├── README.md
│   ├── java.md
│   ├── typescript.md
│   ├── javascript.md
│   ├── html.md
│   └── css.md
├── frameworks/
│   ├── README.md
│   ├── spring/                        # Spring topics in separate files
│   │   ├── README.md
│   │   ├── architecture.md
│   │   ├── error-handling.md
│   │   ├── testing.md
│   │   ├── observability.md
│   │   ├── resiliency.md
│   │   ├── caching.md
│   │   └── security.md
│   ├── react/                         # React topics in separate files
│   │   ├── README.md
│   │   ├── architecture.md
│   │   ├── components.md
│   │   ├── state-management.md
│   │   ├── error-handling.md
│   │   ├── testing.md
│   │   └── observability.md
│   ├── angular/
│   │   └── README.md
│   └── bun/
│       └── README.md
├── protocols-transports/
│   ├── README.md
│   ├── rest.md
│   ├── graphql.md
│   ├── messaging.md
│   └── websockets-sse.md
├── data/
│   ├── README.md
│   ├── json.md
│   ├── data-modeling.md
│   ├── data-validation.md
│   └── openapi.md
└── tools/
    ├── README.md
    ├── bun.md
    ├── nx.md
    ├── gradle.md
    ├── docker.md
    ├── k6.md
    └── playwright.md
```

### Category Relationships

```mermaid
graph TD
    subgraph "Languages"
        L1[Java]
        L2[TypeScript]
        L3[JavaScript]
        L4[HTML]
        L5[CSS]
    end

    subgraph "Frameworks"
        F1[Spring]
        F2[React]
        F3[Angular]
        F4[Bun]
    end

    subgraph "Protocols"
        P1[REST]
        P2[GraphQL]
        P3[Messaging]
        P4[WebSockets/SSE]
    end

    subgraph "Data"
        D1[JSON]
        D2[Modeling]
        D3[Validation]
        D4[OpenAPI]
    end

    subgraph "Tools"
        T1[Bun]
        T2[Nx]
        T3[Gradle]
        T4[Docker]
        T5[k6]
        T6[Playwright]
    end

    L1 --> F1
    L2 --> F2
    L2 --> F3
    L3 --> F4
    F1 --> P1
    F1 --> P3
    F2 --> P1
    P1 --> D4
    D1 --> D3
```

### Cross-Cutting Topics

Each standard covers these topics where applicable:

| Topic | Applies To | Description |
|-------|------------|-------------|
| Architecture | Languages, Frameworks | Structure, layering, organization |
| Conventions | All | Naming, formatting, idioms |
| Error Handling | Languages, Frameworks, Protocols | Error structures, propagation |
| Testing | Languages, Frameworks, Tools | Test patterns by level |
| Observability | Frameworks, Protocols | Logging, metrics, tracing |
| Validation | Languages, Protocols, Data | Input validation patterns |
| Resiliency | Frameworks, Protocols | Circuit breakers, retries, timeouts |
| Security | Languages, Frameworks, Protocols | Auth, sanitization, headers |
| Performance | All | Optimization patterns |

---

## Subplan Summary

| Subplan | Purpose | Dependencies |
|---------|---------|--------------|
| 0004A | Template + topics | None |
| 0004B | Migrate existing | 0004A |
| 0004C | Languages | 0004A |
| 0004D | Frameworks | 0004A, 0004B, 0004C |
| 0004E | Protocols | 0004A |
| 0004F | Data | 0004A |
| 0004G | Tools | 0004A |

---

## Authoritative Sources Strategy

### Source Priority

1. **Official Documentation** - Language/framework official docs
2. **Official Style Guides** - Google, Airbnb, etc.
3. **RFCs/Specifications** - For protocols and data formats
4. **Recognized Expert Sources** - Martin Fowler, ThoughtWorks, etc.

### Research Process

For each technology standard:

1. **Identify official docs URL**
2. **Search for official style guide**
3. **Find specification/RFC if applicable**
4. **Extract key patterns and anti-patterns**
5. **Synthesize into template format**

See subplans for specific URLs and extraction steps.

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `content/standards/TEMPLATE.md` | Master template |
| CREATE | `content/standards/README.md` | Category index |
| CREATE | `content/standards/languages/` | Language standards |
| CREATE | `content/standards/frameworks/` | Framework standards |
| CREATE | `content/standards/protocols-transports/` | Protocol standards |
| CREATE | `content/standards/data/` | Data standards |
| CREATE | `content/standards/tools/` | Tool standards |
| DELETE | `content/standards/backend/` | After migration |
| DELETE | `content/standards/frontend/` | After migration |

---

## Testing Strategy

### Automated Tests

| Type | What It Tests | Command |
|------|---------------|---------|
| Unit | Template validation script | `bun test tests/standards/` |
| Integration | All standards conform to template | `bun run validate-standards` |

### Manual Validation

1. Review each migrated standard preserves original intent
2. Verify new standards follow template structure
3. Confirm cross-cutting topics are consistently applied
4. Check all authoritative sources are cited

---

## Dependency Graph

```mermaid
graph TD
    subgraph "Phase 1: Foundation"
        A[0004A: Template + Topics]
    end

    subgraph "Phase 2: Migration"
        B[0004B: Migrate Existing]
    end

    subgraph "Phase 3: New Standards - Parallel"
        C[0004C: Languages]
        D[0004D: Frameworks]
        E[0004E: Protocols]
        F[0004F: Data]
        G[0004G: Tools]
    end

    A --> B
    A --> C
    A --> E
    A --> F
    A --> G
    C --> D
    B --> D
```

**Parallel Opportunities:**
- After 0004A: Languages, Protocols, Data, Tools can run in parallel
- Frameworks depends on Languages (for Java→Spring, TS→React/Angular)

**Sequential Requirements:**
- Migration (0004B) before Frameworks to preserve React/Spring content
- Template (0004A) before all others

---

## Checklist

- [ ] Subplan 0004A complete (Template)
- [ ] Subplan 0004B complete (Migration)
- [ ] Subplan 0004C complete (Languages)
- [ ] Subplan 0004D complete (Frameworks)
- [ ] Subplan 0004E complete (Protocols)
- [ ] Subplan 0004F complete (Data)
- [ ] Subplan 0004G complete (Tools)
- [ ] Old backend/frontend directories removed
- [ ] All standards validated against template

---

*Plan created with agent-kit. Execute with `/implement-plan`.*
