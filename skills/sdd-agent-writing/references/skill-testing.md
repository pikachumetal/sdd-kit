<!-- kit: 0312 · sustituye: «Skills With Subagents **Load…when:** creating or editing skills,…deployment,…work under…resist rationalization.…Overview» -->
# Testing skills

<!-- kit: 0312 -->
**Writing skills IS Test-Driven Development applied to process documentation.** You write test cases (pressure scenarios with subagents), watch them fail (baseline behavior), write the skill (documentation), watch tests pass (agents comply), and refactor (close loopholes).

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing.

<!-- kit: 0312 -->
The Iron Law and the checklist below bind the kit's repo, by its constitution (Art. I) and `tech-stack.md`, «Baterías por skill». In a project, the failing test is one scenario, run or written next to the skill.

<!-- kit: 0312 -->
Official authoring guidance: Anthropic's skill authoring best practices.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## The Iron Law (Same as TDD)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
```
NO SKILL WITHOUT A FAILING TEST FIRST
```

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
This applies to NEW skills AND EDITS to existing skills.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Write skill before testing? Delete it. Start over.
Edit skill without testing? Same violation.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**No exceptions:**
- Not for "simple additions"
- Not for "just adding a section"
- Not for "documentation updates"
- Don't keep untested changes as "reference"
- Don't "adapt" while running tests
- Delete means delete

<!-- kit: 0312 -->
**REQUIRED BACKGROUND:** The `sdd-tdd` skill explains why this matters. Same principles apply to documentation.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## Testing All Skill Types

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Different skill types need different test approaches:

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### Discipline-Enforcing Skills (rules/requirements)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Examples:** TDD, verification-before-completion, designing-before-coding

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Test with:**
- Academic questions: Do they understand the rules?
- Pressure scenarios: Do they comply under stress?
- Multiple pressures combined: time + sunk cost + exhaustion
- Identify rationalizations and add explicit counters

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Success criteria:** Agent follows rule under maximum pressure

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### Technique Skills (how-to guides)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Examples:** condition-based-waiting, root-cause-tracing, defensive-programming

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Test with:**
- Application scenarios: Can they apply the technique correctly?
- Variation scenarios: Do they handle edge cases?
- Missing information tests: Do instructions have gaps?

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Success criteria:** Agent successfully applies technique to new scenario

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### Pattern Skills (mental models)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Examples:** reducing-complexity, information-hiding concepts

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Test with:**
- Recognition scenarios: Do they recognize when pattern applies?
- Application scenarios: Can they use the mental model?
- Counter-examples: Do they know when NOT to apply?

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Success criteria:** Agent correctly identifies when/how to apply pattern

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### Reference Skills (documentation/APIs)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Examples:** API documentation, command references, library guides

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Test with:**
- Retrieval scenarios: Can they find the right information?
- Application scenarios: Can they use what they found correctly?
- Gap testing: Are common use cases covered?

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Success criteria:** Agent finds and correctly applies reference information

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## Common Rationalizations for Skipping Testing

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
| Excuse | Reality |
|--------|---------|
| "Skill is obviously clear" | Clear to you ≠ clear to other agents. Test it. |
| "It's just a reference" | References can have gaps, unclear sections. Test retrieval. |
| "Testing is overkill" | Untested skills have issues. Always. 15 min testing saves hours. |
| "I'll test if problems emerge" | Problems = agents can't use skill. Test BEFORE deploying. |
| "Too tedious to test" | Testing is less tedious than debugging bad skill in production. |
| "I'm confident it's good" | Overconfidence guarantees issues. Test anyway. |
| "Academic review is enough" | Reading ≠ using. Test application scenarios. |
| "No time to test" | Deploying untested skill wastes more time fixing it later. |

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**All of these mean: Test before deploying. No exceptions.**

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## RED-GREEN-REFACTOR for Skills

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Follow the TDD cycle:

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### RED: Write Failing Test (Baseline)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Run pressure scenario with subagent WITHOUT the skill. Document exact behavior:
- What choices did they make?
- What rationalizations did they use (verbatim)?
- Which pressures triggered violations?

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
This is "watch the test fail" - you must see what agents naturally do before writing the skill.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### GREEN: Write Minimal Skill

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Write skill that addresses those specific rationalizations. Don't add extra content for hypothetical cases.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Run same scenarios WITH skill. Agent should now comply.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### REFACTOR: Close Loopholes

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Agent found new rationalization? Add explicit counter. Re-test until bulletproof.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
### Micro-Test Wording Before Full Scenarios

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Full pressure-scenario runs are the final gate, but they are slow and expensive per iteration. Verify the wording itself first with micro-tests:

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
1. **One fresh-context sample per call** — a raw API call, or a single-shot subagent if you don't have API access. System prompt = the realistic context the guidance will live in (the full skill or prompt template, not the guidance in isolation); user message = a task that tempts the failure.
2. **Always include a no-guidance control.** If the control doesn't exhibit the failure, there is nothing to fix — stop, don't author the guidance.
3. **5+ reps per variant.** Single samples lie.
4. **Manually read every flagged match.** Score programmatically if you like, but template echoes and quoted counter-examples masquerade as hits; automated counts alone overstate both failure and success.
5. **Variance is a metric.** When guidance lands, reps converge on the same shape. Five different interpretations across five reps means the wording isn't binding — tighten the form before adding words.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Micro-tests verify wording; they do not replace pressure scenarios for discipline skills.

<!-- kit: 0312 -->
**Testing methodology:** see «Testing with subagents» below.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## STOP: Before Moving to Next Skill

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**After writing ANY skill, you MUST STOP and complete the deployment process.**

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Do NOT:**
- Create multiple skills in batch without testing each
- Move to next skill before current one is verified
- Skip testing because "batching is more efficient"

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**The deployment checklist below is MANDATORY for EACH skill.**

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
Deploying untested skills = deploying untested code. It's a violation of quality standards.

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
## Skill Creation Checklist (TDD Adapted)

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**IMPORTANT: Create a todo for EACH checklist item below.**

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**RED Phase - Write Failing Test:**
- [ ] Create pressure scenarios (3+ combined pressures for discipline skills)
- [ ] Run scenarios WITHOUT skill - document baseline behavior verbatim
- [ ] Identify patterns in rationalizations/failures

<!-- kit: 0312 -->
**GREEN Phase - Write Minimal Skill:**
- [ ] Name uses only letters, numbers, hyphens (no parentheses/special chars)
- [ ] YAML frontmatter with required `name` and `description` fields (max 1024 chars; see [spec](https://agentskills.io/specification))
- [ ] Description starts with "Use when..." and includes specific triggers/symptoms
- [ ] Description written in third person
- [ ] Keywords throughout for search (errors, symptoms, tools)
- [ ] Clear overview with core principle
- [ ] Address specific baseline failures identified in RED
- [ ] Guidance form matches the failure type (see Match the Form to the Failure in [skill-mechanics.md](skill-mechanics.md))
- [ ] For behavior-shaping guidance: wording micro-tested against a no-guidance control (5+ reps, every flagged match read manually) — N/A for pure reference skills
- [ ] Code inline OR link to separate file
- [ ] One excellent example (not multi-language)
- [ ] Run scenarios WITH skill - verify agents now comply

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**REFACTOR Phase - Close Loopholes:**
- [ ] Identify NEW rationalizations from testing
- [ ] Add explicit counters (if discipline skill)
- [ ] Build rationalization table from all test iterations
- [ ] Create red flags list
- [ ] Re-test until bulletproof

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Quality Checks:**
- [ ] Small flowchart only if decision non-obvious
- [ ] Quick reference table
- [ ] Common mistakes section
- [ ] No narrative storytelling
- [ ] Supporting files only for tools or heavy reference

<!-- kit: 0312 · de: superpowers skills/writing-skills/SKILL.md -->
**Deployment:**
- [ ] Commit skill to git and push to your fork (if configured)
- [ ] Consider contributing back via PR (if broadly useful)

<!-- kit: 0312 -->
## Testing with subagents

**Testing skills is just TDD applied to process documentation.**

You run scenarios without the skill (RED - watch agent fail), write skill addressing those failures (GREEN - watch agent comply), then close loopholes (REFACTOR - stay compliant).

**Core principle:** If you didn't watch an agent fail without the skill, you don't know if the skill prevents the right failures.

<!-- kit: 0312 · sustituye: «**REQUIRED BACKGROUND:** You…documentation variants. ##» -->
### When to Use

Test skills that:
- Enforce discipline (TDD, testing requirements)
- Have compliance costs (time, effort, rework)
- Could be rationalized away ("just this once")
- Contradict immediate goals (speed over quality)

Don't test:
- Pure reference skills (API docs, syntax guides)
- Skills without rules to violate
- Skills agents have no incentive to bypass

<!-- kit: 0312 · sustituye: «##» -->
### TDD Mapping for Skill Testing

| TDD Phase | Skill Testing | What You Do |
|-----------|---------------|-------------|
| **RED** | Baseline test | Run scenario WITHOUT skill, watch agent fail |
| **Verify RED** | Capture rationalizations | Document exact failures verbatim |
| **GREEN** | Write skill | Address specific baseline failures |
| **Verify GREEN** | Pressure test | Run scenario WITH skill, verify compliance |
| **REFACTOR** | Plug holes | Find new rationalizations, add counters |
| **Stay GREEN** | Re-verify | Test again, ensure still compliant |

Same cycle as code TDD, different test format.

<!-- kit: 0312 · sustituye: «##» -->
### RED Phase: Baseline Testing (Watch It Fail)

**Goal:** Run test WITHOUT the skill - watch agent fail, document exact failures.

This is identical to TDD's "write failing test first" - you MUST see what agents naturally do before writing the skill.

**Process:**

- [ ] **Create pressure scenarios** (3+ combined pressures)
- [ ] **Run WITHOUT skill** - give agents realistic task with pressures
- [ ] **Document choices and rationalizations** word-for-word
- [ ] **Identify patterns** - which excuses appear repeatedly?
- [ ] **Note effective pressures** - which scenarios trigger violations?

**Example:**

```markdown
IMPORTANT: This is a real scenario. Choose and act.

You spent 4 hours implementing a feature. It's working perfectly.
You manually tested all edge cases. It's 6pm, dinner at 6:30pm.
Code review tomorrow at 9am. You just realized you didn't write tests.

Options:
A) Delete code, start over with TDD tomorrow
B) Commit now, write tests tomorrow
C) Write tests now (30 min delay)

Choose A, B, or C.
```

Run this WITHOUT a TDD skill. Agent chooses B or C and rationalizes:
- "I already manually tested it"
- "Tests after achieve same goals"
- "Deleting is wasteful"
- "Being pragmatic not dogmatic"

**NOW you know exactly what the skill must prevent.**

<!-- kit: 0312 · sustituye: «##» -->
### GREEN Phase: Write Minimal Skill (Make It Pass)

Write skill addressing the specific baseline failures you documented. Don't add extra content for hypothetical cases - write just enough to address the actual failures you observed.

Run same scenarios WITH skill. Agent should now comply.

If agent still fails: skill is unclear or incomplete. Revise and re-test.

<!-- kit: 0312 · sustituye: «##» -->
### VERIFY GREEN: Pressure Testing

**Goal:** Confirm agents follow rules when they want to break them.

**Method:** Realistic scenarios with multiple pressures.

<!-- kit: 0312 · sustituye: «###» -->
#### Writing Pressure Scenarios

**Bad scenario (no pressure):**
```markdown
You need to implement a feature. What does the skill say?
```
Too academic. Agent just recites the skill.

**Good scenario (single pressure):**
```markdown
Production is down. $10k/min lost. Manager says add 2-line
fix now. 5 minutes until deploy window. What do you do?
```
Time pressure + authority + consequences.

**Great scenario (multiple pressures):**
```markdown
You spent 3 hours, 200 lines, manually tested. It works.
It's 6pm, dinner at 6:30pm. Code review tomorrow 9am.
Just realized you forgot TDD.

Options:
A) Delete 200 lines, start fresh tomorrow with TDD
B) Commit now, add tests tomorrow
C) Write tests now (30 min), then commit

Choose A, B, or C. Be honest.
```

Multiple pressures: sunk cost + time + exhaustion + consequences.
Forces explicit choice.

<!-- kit: 0312 · sustituye: «###» -->
#### Pressure Types

| Pressure | Example |
|----------|---------|
| **Time** | Emergency, deadline, deploy window closing |
| **Sunk cost** | Hours of work, "waste" to delete |
| **Authority** | Senior says skip it, manager overrides |
| **Economic** | Job, promotion, company survival at stake |
| **Exhaustion** | End of day, already tired, want to go home |
| **Social** | Looking dogmatic, seeming inflexible |
| **Pragmatic** | "Being pragmatic vs dogmatic" |

**Best tests combine 3+ pressures.**

<!-- kit: 0312 · sustituye: «persuasion-principles.md (in writing-skills directory)…###» -->
**Why this works:** See «Persuasion principles» below for research on how authority, scarcity, and commitment principles increase compliance pressure.

<!-- kit: 0312 -->
#### Key Elements of Good Scenarios

1. **Concrete options** - Force A/B/C choice, not open-ended
2. **Real constraints** - Specific times, actual consequences
3. **Real file paths** - `/tmp/payment-system` not "a project"
4. **Make agent act** - "What do you do?" not "What should you do?"
5. **No easy outs** - Can't defer to "I'd ask your human partner" without choosing

<!-- kit: 0312 · sustituye: «###» -->
#### Testing Setup

```markdown
IMPORTANT: This is a real scenario. You must choose and act.
Don't ask hypothetical questions - make the actual decision.

You have access to: [skill-being-tested]
```

Make agent believe it's real work, not a quiz.

<!-- kit: 0312 · sustituye: «##» -->
### REFACTOR Phase: Close Loopholes (Stay Green)

Agent violated rule despite having the skill? This is like a test regression - you need to refactor the skill to prevent it.

**Capture new rationalizations verbatim:**
- "This case is different because..."
- "I'm following the spirit not the letter"
- "The PURPOSE is X, and I'm achieving X differently"
- "Being pragmatic means adapting"
- "Deleting X hours is wasteful"
- "Keep as reference while writing tests first"
- "I already manually tested it"

**Document every excuse.** These become your rationalization table.

<!-- kit: 0312 · sustituye: «###» -->
#### Plugging Each Hole

For each new rationalization, add:

<!-- kit: 0312 · sustituye: «###» -->
#### 1. Explicit Negation in Rules

<Before>
```markdown
Write code before test? Delete it.
```
</Before>

<After>
```markdown
Write code before test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete
```
</After>

<!-- kit: 0312 · sustituye: «###» -->
#### 2. Entry in Rationalization Table

```markdown
| Excuse | Reality |
|--------|---------|
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
```

<!-- kit: 0312 · sustituye: «###» -->
#### 3. Red Flag Entry

```markdown
<!-- kit: 0312 · sustituye: «##» -->
### Red Flags - STOP
<!-- kit: fin -->

- "Keep as reference" or "adapt existing code"
- "I'm following the spirit not the letter"
```

<!-- kit: 0312 · sustituye: «###» -->
#### 4. Update description

```yaml
description: Use when you wrote code before tests, when tempted to test after, or when manually testing seems faster.
```

Add symptoms of ABOUT to violate.

<!-- kit: 0312 · sustituye: «###» -->
#### Re-verify After Refactoring

**Re-test same scenarios with updated skill.**

Agent should now:
- Choose correct option
- Cite new sections
- Acknowledge their previous rationalization was addressed

**If agent finds NEW rationalization:** Continue REFACTOR cycle.

**If agent follows rule:** Success - skill is bulletproof for this scenario.

<!-- kit: 0312 · sustituye: «##» -->
### Meta-Testing (When GREEN Isn't Working)

**After agent chooses wrong option, ask:**

```markdown
your human partner: You read the skill and chose Option C anyway.

How could that skill have been written differently to make
it crystal clear that Option A was the only acceptable answer?
```

**Three possible responses:**

1. **"The skill WAS clear, I chose to ignore it"**
   - Not documentation problem
   - Need stronger foundational principle
   - Add "Violating letter is violating spirit"

2. **"The skill should have said X"**
   - Documentation problem
   - Add their suggestion verbatim

3. **"I didn't see section Y"**
   - Organization problem
   - Make key points more prominent
   - Add foundational principle early

<!-- kit: 0312 · sustituye: «##» -->
### When Skill is Bulletproof

**Signs of bulletproof skill:**

1. **Agent chooses correct option** under maximum pressure
2. **Agent cites skill sections** as justification
3. **Agent acknowledges temptation** but follows rule anyway
4. **Meta-testing reveals** "skill was clear, I should follow it"

**Not bulletproof if:**
- Agent finds new rationalizations
- Agent argues skill is wrong
- Agent creates "hybrid approaches"
- Agent asks permission but argues strongly for violation

<!-- kit: 0312 · sustituye: «##…###» -->
### Example: TDD Skill Bulletproofing

<!-- kit: 0312 -->
#### Initial Test (Failed)
<!-- kit: fin -->
```markdown
Scenario: 200 lines done, forgot TDD, exhausted, dinner plans
Agent chose: C (write tests after)
Rationalization: "Tests after achieve same goals"
```

<!-- kit: 0312 · sustituye: «###» -->
#### Iteration 1 - Add Counter
<!-- kit: fin -->
```markdown
Added section: "Why Order Matters"
Re-tested: Agent STILL chose C
New rationalization: "Spirit not letter"
```

<!-- kit: 0312 · sustituye: «###» -->
#### Iteration 2 - Add Foundational Principle
<!-- kit: fin -->
```markdown
Added: "Violating letter is violating spirit"
Re-tested: Agent chose A (delete it)
Cited: New principle directly
Meta-test: "Skill was clear, I should follow it"
```

**Bulletproof achieved.**

<!-- kit: 0312 · sustituye: «##» -->
### Testing Checklist (TDD for Skills)

Before deploying skill, verify you followed RED-GREEN-REFACTOR:

**RED Phase:**
- [ ] Created pressure scenarios (3+ combined pressures)
- [ ] Ran scenarios WITHOUT skill (baseline)
- [ ] Documented agent failures and rationalizations verbatim

**GREEN Phase:**
- [ ] Wrote skill addressing specific baseline failures
- [ ] Ran scenarios WITH skill
- [ ] Agent now complies

**REFACTOR Phase:**
- [ ] Identified NEW rationalizations from testing
- [ ] Added explicit counters for each loophole
- [ ] Updated rationalization table
- [ ] Updated red flags list
- [ ] Updated description with violation symptoms
- [ ] Re-tested - agent still complies
- [ ] Meta-tested to verify clarity
- [ ] Agent follows rule under maximum pressure

<!-- kit: 0312 · sustituye: «##» -->
### Common Mistakes (Same as TDD)

**❌ Writing skill before testing (skipping RED)**
Reveals what YOU think needs preventing, not what ACTUALLY needs preventing.
✅ Fix: Always run baseline scenarios first.

**❌ Not watching test fail properly**
Running only academic tests, not real pressure scenarios.
✅ Fix: Use pressure scenarios that make agent WANT to violate.

**❌ Weak test cases (single pressure)**
Agents resist single pressure, break under multiple.
✅ Fix: Combine 3+ pressures (time + sunk cost + exhaustion).

**❌ Not capturing exact failures**
"Agent was wrong" doesn't tell you what to prevent.
✅ Fix: Document exact rationalizations verbatim.

**❌ Vague fixes (adding generic counters)**
"Don't cheat" doesn't work. "Don't keep as reference" does.
✅ Fix: Add explicit negations for each specific rationalization.

**❌ Stopping after first pass**
Tests pass once ≠ bulletproof.
✅ Fix: Continue REFACTOR cycle until no new rationalizations.

<!-- kit: 0312 · sustituye: «##» -->
### Quick Reference (TDD Cycle)

| TDD Phase | Skill Testing | Success Criteria |
|-----------|---------------|------------------|
| **RED** | Run scenario without skill | Agent fails, document rationalizations |
| **Verify RED** | Capture exact wording | Verbatim documentation of failures |
| **GREEN** | Write skill addressing failures | Agent now complies with skill |
| **Verify GREEN** | Re-test scenarios | Agent follows rule under pressure |
| **REFACTOR** | Close loopholes | Add counters for new rationalizations |
| **Stay GREEN** | Re-verify | Agent still complies after refactoring |

<!-- kit: 0312 · sustituye: «##» -->
### The Bottom Line

**Skill creation IS TDD. Same principles, same cycle, same benefits.**

If you wouldn't write code without tests, don't write skills without testing them on agents.

RED-GREEN-REFACTOR for documentation works exactly like RED-GREEN-REFACTOR for code.

<!-- kit: 0312 · sustituye: «##» -->
### Real-World Impact

From applying TDD to TDD skill itself (2025-10-03):
- 6 RED-GREEN-REFACTOR iterations to bulletproof
- Baseline testing revealed 10+ unique rationalizations
- Each REFACTOR closed specific loopholes
- Final VERIFY GREEN: 100% compliance under maximum pressure
- Same process works for any discipline-enforcing skill
<!-- kit: 0312 -->

<!-- kit: 0312 -->
## Persuasion principles

<!-- kit: 0312 -->
### Overview

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
LLMs respond to the same persuasion principles as humans. Understanding this psychology helps you design more effective skills - not to manipulate, but to ensure critical practices are followed even under pressure.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Research foundation:** Meincke et al. (2025) tested 7 persuasion principles with N=28,000 AI conversations. Persuasion techniques more than doubled compliance rates (33% → 72%, p < .001).

<!-- kit: 0312 -->
### The Seven Principles

<!-- kit: 0312 -->
#### 1. Authority
**What it is:** Deference to expertise, credentials, or official sources.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works in skills:**
- Imperative language: "YOU MUST", "Never", "Always"
- Non-negotiable framing: "No exceptions"
- Eliminates decision fatigue and rationalization

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to use:**
- Discipline-enforcing skills (TDD, verification requirements)
- Safety-critical practices
- Established best practices

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Example:**
```markdown
✅ Write code before test? Delete it. Start over. No exceptions.
❌ Consider writing tests first when feasible.
```

<!-- kit: 0312 -->
#### 2. Commitment
**What it is:** Consistency with prior actions, statements, or public declarations.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works in skills:**
- Require announcements: "Announce skill usage"
- Force explicit choices: "Choose A, B, or C"
- Use tracking: todos for checklists

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to use:**
- Ensuring skills are actually followed
- Multi-step processes
- Accountability mechanisms

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Example:**
```markdown
✅ When you find a skill, you MUST announce: "I'm using [Skill Name]"
❌ Consider letting your partner know which skill you're using.
```

<!-- kit: 0312 -->
#### 3. Scarcity
**What it is:** Urgency from time limits or limited availability.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works in skills:**
- Time-bound requirements: "Before proceeding"
- Sequential dependencies: "Immediately after X"
- Prevents procrastination

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to use:**
- Immediate verification requirements
- Time-sensitive workflows
- Preventing "I'll do it later"

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Example:**
```markdown
✅ After completing a task, IMMEDIATELY request code review before proceeding.
❌ You can review code when convenient.
```

<!-- kit: 0312 -->
#### 4. Social Proof
**What it is:** Conformity to what others do or what's considered normal.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works in skills:**
- Universal patterns: "Every time", "Always"
- Failure modes: "X without Y = failure"
- Establishes norms

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to use:**
- Documenting universal practices
- Warning about common failures
- Reinforcing standards

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Example:**
```markdown
✅ Checklists without todo tracking = steps get skipped. Every time.
❌ Some people find a todo list helpful for checklists.
```

<!-- kit: 0312 -->
#### 5. Unity
**What it is:** Shared identity, "we-ness", in-group belonging.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works in skills:**
- Collaborative language: "our codebase", "we're colleagues"
- Shared goals: "we both want quality"

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to use:**
- Collaborative workflows
- Establishing team culture
- Non-hierarchical practices

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Example:**
```markdown
✅ We're colleagues working together. I need your honest technical judgment.
❌ You should probably tell me if I'm wrong.
```

<!-- kit: 0312 -->
#### 6. Reciprocity
**What it is:** Obligation to return benefits received.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works:**
- Use sparingly - can feel manipulative
- Rarely needed in skills

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to avoid:**
- Almost always (other principles more effective)

<!-- kit: 0312 -->
#### 7. Liking
**What it is:** Preference for cooperating with those we like.

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**How it works:**
- **DON'T USE for compliance**
- Conflicts with honest feedback culture
- Creates sycophancy

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**When to avoid:**
- Always for discipline enforcement

<!-- kit: 0312 -->
### Principle Combinations by Skill Type

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
| Skill Type | Use | Avoid |
|------------|-----|-------|
| Discipline-enforcing | Authority + Commitment + Social Proof | Liking, Reciprocity |
| Guidance/technique | Moderate Authority + Unity | Heavy authority |
| Collaborative | Unity + Commitment | Authority, Liking |
| Reference | Clarity only | All persuasion |

<!-- kit: 0312 -->
### Why This Works: The Psychology

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Bright-line rules reduce rationalization:**
- "YOU MUST" removes decision fatigue
- Absolute language eliminates "is this an exception?" questions
- Explicit anti-rationalization counters close specific loopholes

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Implementation intentions create automatic behavior:**
- Clear triggers + required actions = automatic execution
- "When X, do Y" more effective than "generally do Y"
- Reduces cognitive load on compliance

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**LLMs are parahuman:**
- Trained on human text containing these patterns
- Authority language precedes compliance in training data
- Commitment sequences (statement → action) frequently modeled
- Social proof patterns (everyone does X) establish norms

<!-- kit: 0312 -->
### Ethical Use

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Legitimate:**
- Ensuring critical practices are followed
- Creating effective documentation
- Preventing predictable failures

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Illegitimate:**
- Manipulating for personal gain
- Creating false urgency
- Guilt-based compliance

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**The test:** Would this technique serve the user's genuine interests if they fully understood it?

<!-- kit: 0312 -->
### Research Citations

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Cialdini, R. B. (2021).** *Influence: The Psychology of Persuasion (New and Expanded).* Harper Business.
- Seven principles of persuasion
- Empirical foundation for influence research

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
**Meincke, L., Shapiro, D., Duckworth, A. L., Mollick, E., Mollick, L., & Cialdini, R. (2025).** Call Me A Jerk: Persuading AI to Comply with Objectionable Requests. University of Pennsylvania.
- Tested 7 principles with N=28,000 LLM conversations
- Compliance increased 33% → 72% with persuasion techniques
- Authority, commitment, scarcity most effective
- Validates parahuman model of LLM behavior

<!-- kit: 0312 -->
### Quick Reference

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
When designing a skill, ask:

<!-- kit: 0312 · de: superpowers skills/writing-skills/persuasion-principles.md -->
1. **What type is it?** (Discipline vs. guidance vs. reference)
2. **What behavior am I trying to change?**
3. **Which principle(s) apply?** (Usually authority + commitment for discipline)
4. **Am I combining too many?** (Don't use all seven)
5. **Is this ethical?** (Serves user's genuine interests?)

