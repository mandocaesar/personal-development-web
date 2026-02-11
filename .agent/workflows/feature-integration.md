---
description: Integrate new feature with observability, role management, and audit logging
---

# Feature Integration Workflow

Use this workflow **every time** you build a new feature or functionality.

---

## IMPORTANT: Read Specification Files First

Before proceeding, **read the specification files** to understand how each system is implemented:

1. **Observability**: `.agent/specs/observability-spec.md`
2. **Role Management**: `.agent/specs/role-management-spec.md`
3. **Audit Logging**: `.agent/specs/audit-log-spec.md`

> **Agent Instructions**: 
> - If specs show "NOT CONFIGURED", help user set up the implementation and update the spec
> - If implementation changes, update the corresponding spec file
> - Always follow patterns documented in the specs

---

## 1. Observability Integration

### Steps

1. **Read spec**: Review `.agent/specs/observability-spec.md` for current implementation
2. **Add logging**: 
   - Log key operations (create, update, delete, access)
   - Include relevant context (user, resource ID, metadata)
   - Use appropriate log levels (INFO, WARN, ERROR)
   - Log errors with full context for debugging
3. **Add metrics** (if applicable):
   - Track operation counts (success/failure)
   - Track latency for performance-critical paths
4. **Add tracing** (if applicable):
   - Add spans for distributed operations

### Checklist
- [ ] Structured logging added for key operations
- [ ] Error logging includes context
- [ ] Metrics track success/failure rates
- [ ] (Optional) Tracing spans for distributed operations

---

## 2. Role Management Integration

### Steps

1. **Read spec**: Review `.agent/specs/role-management-spec.md` for current implementation
2. **Define permissions**:
   - Determine what actions need protection
   - Follow naming convention from spec
3. **Add to configuration**:
   - Register new permissions
   - Assign to appropriate roles
4. **Add backend checks**:
   - Protect routes/endpoints
   - Return 403 for unauthorized access
5. **Add frontend guards**:
   - Hide/disable UI elements based on permissions

### Checklist
- [ ] Permissions defined following naming convention
- [ ] Permissions added to configuration
- [ ] Backend permission checks implemented
- [ ] Frontend permission guards implemented
- [ ] Tested with different roles

---

## 3. Audit Log Integration

### Steps

1. **Read spec**: Review `.agent/specs/audit-log-spec.md` for current implementation
2. **Identify auditable events**:
   - Create operations
   - Update operations (with before/after state)
   - Delete operations
   - Sensitive access operations
3. **Add audit logging**:
   - Follow schema from spec
   - Include user context
   - Capture changes appropriately

### Checklist
- [ ] Create operations logged
- [ ] Update operations logged with before/after
- [ ] Delete operations logged
- [ ] User context included in all entries

---

## 4. Final Verification

- [ ] All three integrations completed
- [ ] Feature tested with observability active
- [ ] Feature tested with different user roles
- [ ] Audit log entries verified

---

## Updating Specifications

If the implementation of observability, role management, or audit logging changes:

1. Update the corresponding spec file in `.agent/specs/`
2. Update the "Status" section
3. Update implementation patterns/examples
4. Add entry to the Change Log

This ensures future feature integrations use correct patterns.
