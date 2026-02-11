# Audit Log Specification

> **This is an anchor document.** The agent should read this before integrating new features with audit logging, and update it if implementation changes.

## Status: NOT CONFIGURED

> Update this section when audit logging is implemented in the project.

---

## Overview

This document describes how audit logging is implemented in this project for tracking user actions and changes.

---

## Audit Log Schema

### Standard Fields
<!-- Update when implemented -->
| Field         | Type     | Required | Description                |
| ------------- | -------- | -------- | -------------------------- |
| timestamp     | datetime | ✓        | When the action occurred   |
| user_id       | string   | ✓        | Who performed the action   |
| user_email    | string   | ○        | User email for readability |
| action        | string   | ✓        | What action was performed  |
| resource_type | string   | ✓        | Type of resource affected  |
| resource_id   | string   | ✓        | ID of affected resource    |
| changes       | object   | ○        | Before/after state         |
| metadata      | object   | ○        | Additional context         |

### Changes Object Structure
```
changes:
  before: (state before change - for update/delete)
  after: (state after change - for create/update)
```

### Metadata Object Structure
```
metadata:
  ip_address: (client IP)
  user_agent: (browser/client info)
  request_id: (unique request identifier)
  correlation_id: (for distributed tracing)
```

---

## Implementation Details

### Storage
<!-- Update when implemented -->
- **Storage Type**: _Not configured_ (e.g., database table, log file, external service)
- **Retention Policy**: _Not configured_
- **Query Interface**: _Not configured_

### How to Add Audit Logging
<!-- Update with actual steps when implemented -->
1. _Import/include the audit log module_
2. _Capture before state (for update/delete)_
3. _Perform the operation_
4. _Record audit entry with appropriate fields_

### Audit Log Pattern
<!-- Update with actual pattern when implemented -->
```
[Not configured - add actual implementation example here]

CREATE operation:
- action: resource.create
- changes: after only

UPDATE operation:
- action: resource.update
- changes: before and after

DELETE operation:
- action: resource.delete
- changes: before only
```

---

## Auditable Events

### Event Naming Convention
<!-- Update with your convention -->
```
Format: <resource>.<action>

Examples:
- user.create
- user.update
- user.delete
- project.create
- assessment.submit
- config.change
```

### Events to Audit Per Resource
<!-- Update when new resources added -->
| Resource  | create | read | update | delete | Other           |
| --------- | ------ | ---- | ------ | ------ | --------------- |
| _Example_ | ✓      | ○    | ✓      | ✓      | _login, logout_ |

Legend: ✓ = Required, ○ = Optional/Sensitive only

---

## Integration Checklist

When adding audit logging to a new feature:

1. [ ] Identify all auditable operations
2. [ ] Add audit log calls to create operations
3. [ ] Add audit log calls to update operations (with before/after)
4. [ ] Add audit log calls to delete operations
5. [ ] (Optional) Add audit for sensitive read operations
6. [ ] Verify audit entries are recorded correctly

---

## Querying Audit Logs

### Common Queries
<!-- Update when implemented -->
```
[Not configured - add query examples here]

- Find all actions by a user
- Find all changes to a resource
- Find all actions in time range
- Find all actions of a specific type
```

---

## Change Log

| Date      | Change           | Author  |
| --------- | ---------------- | ------- |
| _Initial_ | Document created | _Agent_ |
