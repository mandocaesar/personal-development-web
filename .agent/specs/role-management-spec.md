# Role Management Specification

> **This is an anchor document.** The agent should read this before integrating new features with role management, and update it if implementation changes.

## Status: NOT CONFIGURED

> Update this section when role management is implemented in the project.

---

## Overview

This document describes how role-based access control (RBAC) and permissions are implemented in this project.

---

## Roles

### Defined Roles
<!-- Update when implemented -->
| Role             | Description             | Access Level       |
| ---------------- | ----------------------- | ------------------ |
| _Example: guest_ | _Unauthenticated users_ | _Read-only public_ |
| _Example: user_  | _Authenticated users_   | _Standard access_  |
| _Example: admin_ | _Administrators_        | _Full access_      |

---

## Permissions

### Permission Naming Convention
<!-- Update with your convention -->
```
Format: <resource>:<action>

Examples:
- project:read
- project:create
- project:update
- project:delete
- user:manage
```

### Permission Matrix
<!-- Update when implemented -->
| Permission        | guest | user  | admin |
| ----------------- | ----- | ----- | ----- |
| _resource:read_   | ✓     | ✓     | ✓     |
| _resource:create_ | ✗     | ✓     | ✓     |
| _resource:update_ | ✗     | owner | ✓     |
| _resource:delete_ | ✗     | ✗     | ✓     |

---

## Implementation Details

### Configuration Location
<!-- Update when implemented -->
- **Roles Config**: _Not configured_
- **Permissions Config**: _Not configured_
- **User-Role Mapping**: _Not configured_

### How to Add Permission Check (Backend)
<!-- Update with actual steps when implemented -->
1. _Get current user from session/token_
2. _Check if user has required permission_
3. _Return 403 Forbidden if not authorized_
4. _Proceed with operation if authorized_

### How to Add Permission Guard (Frontend)
<!-- Update with actual steps when implemented -->
1. _Get current user permissions_
2. _Check if user can perform action_
3. _Show/hide UI element based on permission_

### Permission Check Pattern
<!-- Update with actual pattern when implemented -->
```
[Not configured - add actual implementation example here]

Backend:
- Check: user has permission "resource:action"
- On failure: return 403 with error message

Frontend:
- Check: user can "resource:action"
- On true: render component
- On false: hide or disable component
```

---

## Adding Permissions for New Features

When adding a new feature:

1. Define needed permissions following naming convention
2. Add permissions to configuration file
3. Assign permissions to appropriate roles in matrix
4. Add backend permission checks to routes/endpoints
5. Add frontend permission guards to UI components

---

## Integration Checklist

1. [ ] Define permissions for the new feature
2. [ ] Add permission entries to config
3. [ ] Add backend route/API permission checks
4. [ ] Add frontend UI permission guards
5. [ ] Test with each role to verify access

---

## Change Log

| Date      | Change           | Author  |
| --------- | ---------------- | ------- |
| _Initial_ | Document created | _Agent_ |
