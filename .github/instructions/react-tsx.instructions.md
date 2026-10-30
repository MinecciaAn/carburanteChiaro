---
description: "Use when creating or editing React components in TypeScript JSX (.tsx), especially when choosing or reviewing useState and useEffect."
applyTo: "**/*.tsx"
---

# React TSX guidelines

## State with `useState`
- Keep state minimal: do not store values that can be calculated from props or existing state; derive them during render or with `useMemo` only when measurement shows the calculation is expensive.
- Use a lazy initializer for expensive initial state, and use functional updates (`setValue(previous => ...)`) when the next value depends on the previous one.
- Treat objects and arrays in state as immutable; create updated copies rather than mutating existing state.
- Keep values that change together in a coherent state object, but avoid combining unrelated state.
- Use explicit TypeScript types for non-obvious state, nullable values, and discriminated async states. Model loading, success, and error states so impossible combinations cannot occur.
- Do not call state setters during render. Prefer event handlers for user actions.

## Synchronization with `useEffect`
- Use an effect only to synchronize React with an external system, such as a browser API, subscription, timer, network connection, or imperative widget. Do not use effects to derive render data or to handle a user action that belongs in an event handler.
- Declare every reactive value read by the effect in its dependency list. Do not suppress `react-hooks/exhaustive-deps` or omit dependencies to control when an effect runs.
- Make setup and cleanup symmetrical: unsubscribe, clear timers, abort requests, and release resources when dependencies change or the component unmounts.
- For asynchronous work, prevent stale results from updating state after cleanup. Use `AbortController` when supported; otherwise use a cleanup guard.
- Keep effects focused on one synchronization process. If different work needs different dependencies or cleanup, use separate effects.
- Ensure effects remain correct when React Strict Mode runs setup and cleanup an extra time during development. Do not rely on an effect running exactly once.
- If an effect repeatedly updates state, check for a dependency cycle and move event-driven work to the event handler or calculate derived values during render.
- Prefer a framework data-loading mechanism or an existing project data layer over fetching directly in an effect when one is available.

## TypeScript and components
- Type component props explicitly; prefer inferred hook types when clear and provide generic types when inference is insufficient.
- Keep components and custom hooks focused. Extract reusable stateful logic into a custom hook only when it clarifies reuse or lifecycle behavior.
- Preserve accessible labels, keyboard behavior, and semantic HTML when changing UI.
