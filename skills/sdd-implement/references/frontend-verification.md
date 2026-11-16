# Frontend verification

The kit decides **when** what is seen gets verified and **what evidence** is needed; the project declares **what with** in `§Frontend` of `operations.md`. A unit test doesn't see the layout, and the model's eye isn't enough either: it misses a 0 px padding or a text that overflows its box, and a detector over the rendered page catches them in seconds.

## When

- **Full task** with «Verificación visual» in the plan: after its review, before marking it done (`sdd-implement`).
- **Lite feature** that changes what is seen: before presenting the validation ([modo-lite.md](../../sdd-propose/references/modo-lite.md)).
- **Visual patch** (an adjustment of presentation alone): after the change, before asking for the validation (step 4 of `references/patch-flow.md`).

## What with: `§Frontend`

The fields, by name, of the `## Frontend` section of `operations.md`:

- **URL**: where the application answers once started with the «Arrancar» command.
- **Detector**: the command, with the slots `{url}` and `{viewport}`, and which output counts as a failure (e.g. `npx impeccable@<version> detect {url} --viewport {viewport}`, failure with exit code 2); or `ninguno`.
- **Viewports**: desktop and mobile. If undeclared, `1280x800` and `390x844`.
- **Runner E2E**: Playwright, with the MCP if the session has it, otherwise with a script of the `playwright` package.
- **Acceso**: how to get in, with an entry URL that opens the session and redirects to `{path}` (e.g. `/dev/impersonate?user=demo@example.test&next={path}`); the test user; the session's path (`storageState`, ignored by git) and how it is rebuilt when it expires; or `sin login`.
- **Temas**: how each theme is switched on.
- **Pantalla de referencia**: the default one; the one the task names wins over it.
- **Skills de apoyo**: the project's design skills, if any. The kit doesn't invoke them by name.

`§Frontend` wins over the defaults of this page.

## The five steps

1. **Criterion and reference, before touching anything.** The criterion in measurable sentences («the summary card shows customer, total and status») and the project screen to compare with. In full they go in the plan's «Verificación visual» field; in lite, in the spec's Approach; in a patch, the intent of §2 is the criterion and the reference is the screenshot of the screen **before** the change.
2. **Detector** in both viewports, on each screen and state the criterion declares. Each finding the detector counts as a failure is fixed or justified in writing, one by one; advisories don't count. The detector has no round cap: **it doesn't close with a finding open and unjustified**.
   - «It was already there» justifies a finding only in a part the change doesn't touch, never one in the element the change touches.
   - «It's a false positive» and «it's intentional» count only if they cite the sentence of the criterion or the trait of the reference screen that requires it. «Compact design», with no such citation, justifies nothing.
   - «The spec doesn't fix it» or «it would be a commit outside the already reviewed task» don't leave the finding for the dev-lead: the fix goes in its own commit, which enters the review.
   - On a screen behind a login, the detector opens a browser with no session: it scans the entry URL of the Acceso with the screen's `{path}`. With no entry URL, that screen's detector stays «no probado». Scanning the saved HTML doesn't replace it: it loads no CSS and applies no viewport.
   - If the detector is declared and doesn't run (it can't be installed or downloaded, no network or no Chrome; the URL doesn't answer; the command errors), say the concrete error: what is seen stays «no probado», never «verificado».
   - With `Detector: ninguno`, go on with the screenshots and the rubric, and the presentation carries, literally: «composición no medida: `operations.md` no declara detector en §Frontend».
3. **Eyes.** One screenshot per state and theme, which you look at with the composition rubric —hierarchy, spacing rhythm, density, alignment— against the reference. At most 3 rounds of composition fixes; if it is still wrong after the third, say so in the presentation and the dev-lead decides. Screenshots are kept outside git (the session's scratchpad, `%TEMP%`) and are not deleted until the validation.
4. **Hands**, only if the change touches behavior (it doesn't apply in a visual patch). Walk the real flow —the interaction and the loading, error and disabled states— with the console and the network free of errors; the accessibility tree checks presence, role and state. With the test user of `§Frontend`, never against production, and without deleting or modifying data the verification didn't create.
5. **Show.** The presentation (the stop of `pair`, the validation of `sdd-archive`) carries the criterion, the detector's output per viewport with each finding resolved or justified («390x844 · `cramped-padding` in `.card` · fixed: padding 16 px»), the path of each screenshot and, if the criterion fixes a value, each measurement with its value and the expected one. Or the notice, or «no probado» with its reason.

## Proportion by lane

| | Full | Lite | Visual patch |
| --- | --- | --- | --- |
| Criterion and reference | in the plan | in the spec's Approach | the intent; the screenshot of before |
| Detector, two viewports | yes | yes | yes |
| Screenshots | per state and theme | per state | before and after each touched screen |
| Hands | if behavior changes | if behavior changes | no |

- Measurements in computed styles are taken when the criterion fixes a numeric value (contrast ≥ 4.5:1, padding of 16 px), and at no other time. With no value fixed, the detector and the rubric measure the composition.
- If the user has the application up, verify on that environment: don't start another or make a dedicated build.
- To verify you don't write a new E2E spec suite: a screenshot script or the MCP is enough. A visual verification of a one-line CSS change is counted in minutes.

## Access

- With the **Acceso** declared, the runner and the detector get in through the entry URL with each screen's `{path}`. If that entry spends something with a limit (a magic link, a code), the runner gets in once, saves the session at its path and reuses it in later runs; if the application sends you back to the login, rebuild it once. If the path isn't ignored by git (`git check-ignore <path>`), don't save the session there and say so.
- If the application asks for a login and `§Frontend` doesn't say how to get in, **don't try to get in**: don't ask for links, don't try codes, don't force the login. A magic link or a code has a limit per account, and finding out the access by spending them exhausts it; don't delete that limit's record either. What is seen stays «no probado: falta el acceso en §Frontend», and the presentation proposes the Acceso: a development page that simulates the entry and the session saved with `storageState`. It is not a new stop: it goes in the presentation you already make.

## Without `§Frontend`

- A feature that changes what is seen and whose `operations.md` has no `§Frontend` (or has no Acceso and the application asks for a login) carries in «Decisiones que he tomado yo» of its spec the proposal of `§Frontend` with the fields filled in: impeccable as the detector, Playwright and the access seen in the code. When the spec is approved, you write it in `operations.md`.
- A visual patch has no spec: verify with what there is (the notice or «no probado»), and its validation's presentation proposes `§Frontend`.
- If the dev-lead doesn't want a detector, it stays `Detector: ninguno` and isn't proposed again.

## Pixel regression is not frontend verification

Comparing screenshots against baselines doesn't see what was already wrong in the baseline and costs minutes for each CSS change. It can make sense in CI, with a fixed environment and review in the PR, but it is not a gate of the development loop.
