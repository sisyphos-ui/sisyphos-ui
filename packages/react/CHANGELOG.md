# @sisyphos-ui/react

## 1.0.2

### Patch Changes

- 71c3132: Re-export `Portal`, `useFocusTrap`, `useScrollLock`, and `PortalProps`
  from the React umbrella. They were already public in the v0.5
  @sisyphos-ui/portal package and were inadvertently dropped from the
  v1.0 public API; consumers that compose custom overlays need them.

## 1.0.1

### Patch Changes

- Updated dependencies [9f06bf3]
  - @sisyphos-ui/core@1.0.0
