---
"@sisyphos-ui/react": patch
---

Re-export `Portal`, `useFocusTrap`, `useScrollLock`, and `PortalProps`
from the React umbrella. They were already public in the v0.5
@sisyphos-ui/portal package and were inadvertently dropped from the
v1.0 public API; consumers that compose custom overlays need them.
