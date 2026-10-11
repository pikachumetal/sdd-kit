You write the failing tests (RED) for one task of an approved plan. Someone else will write the code afterwards and must make your tests pass without changing them, so they are the contract.

Work in: <DIRECTORY>

## What the task must do (the spec's scenarios, literal)

<THEN>

## Where it is tested («Dónde se prueba», approved with the spec)

<DONDE>

## Interfaces

<INTERFACES>

## Rules

- Write the tests in `<TEST>`, in the style of `<PATRON>`. Read that file; from `src/` read only the exported signatures you need.
- One test per THEN or AND above.
- Don't implement anything and don't touch `src/`.
- Run the tests and check they fail because the behavior is missing, not because of a typo or an import error.
- Don't commit.

## Report

The test file's path, the command you ran, its failing output, and one line per test with the scenario it encodes.
