# Writing E2E Tests

**Load this reference when:** writing, changing or fixing an end-to-end test (Playwright or another runner that drives the real app). It adds to [writing-good-tests.md](writing-good-tests.md) what only an E2E needs. Playwright facts: its 1.65 docs.

## Overview

An E2E is the most expensive test a project has and the only one that sees what the user sees. It earns its cost by doing what a user does, at the user's pace, on a flow the product exists for:

```
1. An E2E names a core flow
2. Between two user actions, wait only for what the user can see
```

In the field, a menu offered the *previous* copy for ~3 s after copying; every E2E of that flow polled the API for the new copy before opening the menu, and the bug lived three releases with the suite green.

## Rule 1: Name the Core Flow

`operations.md` §Testing lists the project's **Flujos core**, each with its test. A new E2E extends one of them; say which in its `describe`. A behavior of no core flow (a remembered filter, a format, a label) is tested one layer down: a component or endpoint test. A change you think creates a core flow is a proposal for the spec's ✋, not a file you add.

## Rule 2: Test What the User Sees

Locate by role, label or text (`getByRole('button', { name: 'Reservar' })`), not by CSS or XPath; a test id only where neither exists. Assert with web-first assertions, which retry until their timeout (`await expect(row).toHaveText('Norte · 10:00')`); a manual check (`expect(await row.textContent())…`) reads once and races. Stub what you don't control (a payment provider) at the network.

## Rule 3: Between Two User Actions, Wait Only for What the User Sees

<Bad>
```typescript
await page.getByRole('button', { name: 'Reservar' }).click();
// The booking is saved in the background: without waiting, «Mis reservas» would be empty.
await expect.poll(() => bookingsOf(request, 'ana'), { timeout: 15_000 }).toHaveLength(1);
await page.getByRole('link', { name: 'Mis reservas' }).click();
```
The comment is the bug: if «Mis reservas» is empty right after booking, the user sees it, and the test must too.
</Bad>

<Good>
```typescript
await page.getByRole('button', { name: 'Reservar' }).click();
await page.getByRole('link', { name: 'Mis reservas' }).click();
await expect(page.getByRole('row', { name: /Norte/ })).toHaveText('Norte · 10:00');
```
</Good>

A wait on internal state (an API poll, a store, an attribute the user doesn't see) between two user actions carries its reason in a comment, and the reason is something the user doesn't see either: an email sent in the background. «Without waiting, the app wouldn't have the data yet» is never a reason: it describes the failure the test exists to catch. Checking the server after the last user action is fine.

## Rule 4: After a Focus or Cell Change, Wait for a Visible State Before Typing

Enter on a cell, opening a dialog or moving focus starts something the user watches finish. Keys typed before it are lost: with this helper, «Concepto» arrived as «oncepto».

<Bad>
```typescript
await page.getByTestId(`cell-${cell}`).click();
await page.keyboard.press('Enter');
await page.keyboard.type(text);
```
</Bad>

<Good>
```typescript
await page.getByTestId(`cell-${cell}`).click();
await page.keyboard.press('Enter');
const editor = page.getByRole('textbox', { name: 'Concepto' });
await expect(editor).toBeFocused();
await editor.pressSequentially(text);
```
</Good>

Fix a shared helper where it lives: it fails the whole suite. `page.waitForTimeout()` is not a wait: Playwright discourages it because «tests that wait for time are inherently flaky».

## Rule 5: Each Test Owns Its Data

Each test creates what it needs and deletes it when it ends, as `operations.md` §Testing «Datos» says: a test that only passes on a freshly emptied environment depends on another. Tests and probes run with the **agent's user** («Acceso a la aplicación»), never the one the person validating uses. A one-off probe gets its own output folder (`--output <workspace>/probe-results`).

## Rule 6: Retries and Timeouts Come from `operations.md`

Playwright's defaults: 30 s per test, 5 s per assertion, no retries. Retries are `0` locally and at most `2` in CI; timeouts stay at the default unless `operations.md` writes a raised value with its reason. Never raise either, in a test or in `playwright.config.ts`, to make a test pass: it moves the race, it doesn't remove it.

## Rule 7: A Flaky Test Is Triaged, Never Hidden

1. **Repeat only that test**: `npx playwright test <file> -g "<title>" --repeat-each=10`, not the suite.
2. **Classify the cause** from the failing run's output: a **race in the test** (rules 2-4: fix the test); a **race in the app**, which the user hits too (a bug: `sdd-debugging`); the **environment** (a server down, a port taken: check it before the code); **shared data** (rule 5: isolate it).
3. **Fix the cause** and repeat that test again.
4. **Can't fix it now**: declare it `test.fixme('<title>', { annotation: { type: 'issue', description: '<url>' } }, …)`. Playwright doesn't run it, and the suite stops lying.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Without waiting for the server, the next action would have nothing" | That's what the user gets. The test must fail there, not wait it out. |
| "The helper already types in cells; I reuse it" | A shared helper that types before the editor is ready loses keys in every test. Wait for the visible state, in the helper. |
| "I raise this one timeout to 10 s: the server is slow" | A raised timeout hides the race on a fast machine and loses it on a slow one. Keep the default or write the reason in `operations.md`. |
| "Retries: 2 makes the suite green" | It makes the failure invisible. Triage it, or declare it `test.fixme('<title>', { annotation: { type: 'issue', description: '<url>' } }, …)`. |
| "The behavior is new, so it gets its own E2E file" | New isn't core. Name the core flow, or go one layer down. |
