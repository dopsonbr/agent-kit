# Plan Examples

Real-world examples of well-structured implementation plans.

---

## Example 1: Small Plan (API Endpoint)

```markdown
# 0042_user-preferences-api

**Status:** DRAFT

---

## Overview

Add a REST endpoint to retrieve and update user preferences. This enables the settings UI to persist user choices.

## Goals

1. Create GET /api/users/{id}/preferences endpoint
2. Create PUT /api/users/{id}/preferences endpoint
3. Add validation for preference values

## Non-Goals

- Preference migration from legacy system
- Admin override of user preferences

---

## Architecture

```mermaid
graph LR
    UI[Settings UI] --> API[Preferences API]
    API --> DB[(PostgreSQL)]
    API --> Cache[(Redis)]
```

---

## Phase 1: Database & Model

**Prereqs:**
- PostgreSQL connection configured
- Existing User model

**Blockers:** None

### 1.1 Create Preferences Table

**Files:**
- CREATE: `src/db/migrations/042_user_preferences.sql`
- CREATE: `src/models/UserPreferences.ts`

**Implementation:**

```sql
-- 042_user_preferences.sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  theme VARCHAR(20) DEFAULT 'system',
  notifications_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Verification:**

```bash
bun run db:migrate
# Expected: Migration successful
```

**Commit:** `feat(db): add user_preferences table`

---

## Phase 2: API Endpoints

**Prereqs:**
- Phase 1 complete
- Auth middleware configured

### 2.1 GET Endpoint

**Files:**
- CREATE: `src/routes/preferences.ts`
- MODIFY: `src/routes/index.ts`

**Commit:** `feat(api): add GET /preferences endpoint`

### 2.2 PUT Endpoint

**Files:**
- MODIFY: `src/routes/preferences.ts`

**Commit:** `feat(api): add PUT /preferences endpoint`

---

## Files Summary

| Action | File | Purpose |
|--------|------|---------|
| CREATE | `src/db/migrations/042_user_preferences.sql` | Database schema |
| CREATE | `src/models/UserPreferences.ts` | Type definitions |
| CREATE | `src/routes/preferences.ts` | API handlers |
| MODIFY | `src/routes/index.ts` | Route registration |

---

## Dependency Graph

```mermaid
graph TD
    T1[1.1 Create Table] --> T2[2.1 GET Endpoint]
    T1 --> T3[2.2 PUT Endpoint]
    T2 --> T4[Testing]
    T3 --> T4
```

**Parallel Opportunities:**
- Tasks 2.1 and 2.2 can be developed in parallel after 1.1

---

## Checklist

- [ ] Phase 1 complete
- [ ] Phase 2 complete
- [ ] All tests passing
```

**Token count:** ~800 tokens (well within optimal range)

---

## Example 2: Medium Plan with Subplans (Feature Initiative)

```markdown
# 0050_notification-system

**Status:** DRAFT

---

## Overview

Implement a notification system with email, push, and in-app channels. Due to scope, this is split into subplans.

## Goals

1. Create notification service core
2. Implement email channel
3. Implement push notification channel
4. Implement in-app notification channel
5. Add user preference controls

## Related Plans

- `0050A_notification-core.md` - Service infrastructure
- `0050B_email-channel.md` - Email notifications
- `0050C_push-channel.md` - Push notifications
- `0050D_inapp-channel.md` - In-app notifications

---

## Architecture

```mermaid
graph TD
    subgraph "Producers"
        P1[Order Service]
        P2[Auth Service]
        P3[Payment Service]
    end

    subgraph "Notification System"
        Q[Message Queue]
        NS[Notification Service]

        subgraph "Channels"
            E[Email]
            Push[Push]
            InApp[In-App]
        end
    end

    subgraph "Delivery"
        SES[AWS SES]
        FCM[Firebase]
        WS[WebSocket]
    end

    P1 --> Q
    P2 --> Q
    P3 --> Q
    Q --> NS
    NS --> E --> SES
    NS --> Push --> FCM
    NS --> InApp --> WS
```

---

## Subplan Dependency Graph

```mermaid
graph TD
    subgraph "Foundation"
        A[0050A: Core Service]
    end

    subgraph "Channels - Parallel"
        B[0050B: Email]
        C[0050C: Push]
        D[0050D: In-App]
    end

    subgraph "Integration"
        E[0050E: Preferences UI]
    end

    A --> B
    A --> C
    A --> D
    B --> E
    C --> E
    D --> E
```

**Parallel Opportunities:**
- Subplans B, C, D can be developed in parallel after A completes
- Each channel subplan is independently mergeable

**Sequential Requirements:**
- Core (A) must complete before any channel
- Preferences UI (E) requires all channels complete

---

## Checklist

- [ ] 0050A complete and merged
- [ ] 0050B complete and merged
- [ ] 0050C complete and merged
- [ ] 0050D complete and merged
- [ ] 0050E complete and merged
- [ ] Integration testing complete
```

**Token count:** ~700 tokens (parent plan only, subplans add ~2000 each)

---

## Example 3: Diagram Types

Choose the diagram type that best illustrates your changes.

### Sequence Diagram (API Flows)

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Gateway
    participant S as Auth Service
    participant D as Database

    C->>+A: POST /login
    A->>+S: Validate credentials
    S->>+D: Query user
    D-->>-S: User record
    S-->>-A: JWT token
    A-->>-C: 200 OK + token
```

Best for: API interactions, authentication flows, request/response patterns.

### State Diagram (Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> Pending: Order created
    Pending --> Processing: Payment received
    Processing --> Shipped: Items dispatched
    Shipped --> Delivered: Confirmed receipt
    Delivered --> [*]

    Processing --> Cancelled: Customer request
    Pending --> Cancelled: Timeout
    Cancelled --> [*]
```

Best for: Order status, workflow states, entity lifecycle.

### Class Diagram (Data Models)

```mermaid
classDiagram
    class User {
        +id: UUID
        +email: string
        +createdAt: Date
        +getPreferences()
    }

    class Preferences {
        +userId: UUID
        +theme: string
        +notifications: boolean
    }

    User "1" --> "1" Preferences: has
```

Best for: Entity relationships, data models, type hierarchies.

### ER Diagram (Database Schema)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    ORDERS ||--|{ LINE_ITEMS : contains
    PRODUCTS ||--o{ LINE_ITEMS : "ordered in"

    USERS {
        uuid id PK
        string email
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        string status
    }
```

Best for: Database design, foreign key relationships.

---

## Example 4: Task Dependency Patterns

### Linear Dependencies

```mermaid
graph LR
    T1[Task 1] --> T2[Task 2] --> T3[Task 3] --> T4[Task 4]
```

Use when each task depends on the previous.

### Parallel with Sync Point

```mermaid
graph TD
    T1[Setup] --> T2A[Feature A]
    T1 --> T2B[Feature B]
    T1 --> T2C[Feature C]
    T2A --> T3[Integration]
    T2B --> T3
    T2C --> T3
```

Use when multiple independent features can be developed simultaneously.

### Diamond Pattern

```mermaid
graph TD
    T1[Foundation] --> T2[Backend]
    T1 --> T3[Frontend]
    T2 --> T4[Integration]
    T3 --> T4
```

Common for full-stack features.

### Complex with External Dependencies

```mermaid
graph TD
    subgraph "External"
        E1[Prior Plan 049]
        E2[Database Migration]
    end

    subgraph "This Plan"
        T1[Phase 1]
        T2[Phase 2]
        T3[Phase 3]
    end

    E1 --> T1
    E2 --> T1
    T1 --> T2
    T1 --> T3
    T2 --> T4[Phase 4]
    T3 --> T4
```

Use when plan depends on external work.

---

## Anti-Patterns to Avoid

### Too Vague

```markdown
## Phase 1: Setup

Do the initial setup work.
```

**Better:**

```markdown
## Phase 1: Database Setup

**Prereqs:**
- PostgreSQL 15+ installed
- Database credentials in .env

### 1.1 Create Migration

**Files:**
- CREATE: `src/db/migrations/001_initial.sql`

**Implementation:**
{specific SQL}
```

### Missing Dependencies

```markdown
## Phase 2: API

Build the API endpoints.

## Phase 3: Frontend

Build the UI components.
```

**Better:**

```markdown
## Dependency Graph

```mermaid
graph TD
    P1[Phase 1: DB] --> P2[Phase 2: API]
    P2 --> P3[Phase 3: Frontend]
```

### No Verification Steps

```markdown
### 1.1 Add validation

Add input validation to the form.

**Commit:** `feat: add validation`
```

**Better:**

```markdown
### 1.1 Add Form Validation

**Files:**
- MODIFY: `src/components/Form.tsx`

**Implementation:**
{code}

**Verification:**

```bash
bun test src/components/Form.test.tsx
# Expected: 5 tests passing
```

**Commit:** `feat(form): add input validation`
```
