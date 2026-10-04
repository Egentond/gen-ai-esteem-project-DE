/**
 * Runs the three test cases for the first working slice against the real matcher.
 *   npm run test:slice
 * Needs ANTHROPIC_API_KEY in .env.local for the model steps. Writes docs/test-results.md.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { testCases } from "../src/content/test-founders";
import { findMatches, type MatchResult } from "../src/lib/matching";

type Outcome = { name: string; checks: string; pass: boolean; notes: string[]; result: MatchResult };

async function main() {
  const outcomes: Outcome[] = [];

  for (const t of testCases) {
    process.stdout.write(`\n▶ ${t.name}: ${t.checks}\n`);
    const result = await findMatches(t.founder);
    const notes: string[] = [];
    let pass = true;

    if (t.expectNeedsDetail) {
      pass = result.status === "needs_detail";
      notes.push(pass ? `Asked for more detail (caught by ${result.status === "needs_detail" ? result.caughtBy : "?"}).` : `Expected a request for more detail, got "${result.status}".`);
    } else if (result.status !== "ok") {
      pass = false;
      notes.push(`Expected matches, got "${result.status}"${result.status === "error" ? `: ${result.message}` : ""}.`);
    } else {
      const ids = result.matches.map((m) => m.id);
      for (const id of t.mustInclude ?? []) {
        const ok = ids.includes(id);
        pass &&= ok;
        notes.push(`${ok ? "✓" : "✗"} ${id} ${ok ? "is" : "is NOT"} in the matches`);
      }
      for (const id of t.mustExclude ?? []) {
        const ok = !ids.includes(id);
        pass &&= ok;
        const why = [...result.removedByRules, ...result.removedByModel].find((r) => r.id === id)?.reason;
        notes.push(`${ok ? "✓" : "✗"} ${id} ${ok ? "kept out" : "WAS matched"}${why ? ` (${why})` : ""}`);
      }
      notes.push(`Matches: ${result.matches.map((m) => `${m.brand_name} [${m.fit}]`).join(", ") || "none"}`);
      notes.push(`Took ${(result.ms / 1000).toFixed(1)}s on ${result.model}`);
    }

    notes.forEach((n) => console.log("   " + n));
    console.log(pass ? "   PASS" : "   FAIL");
    outcomes.push({ name: t.name, checks: t.checks, pass, notes, result });
  }

  const passed = outcomes.filter((o) => o.pass).length;
  console.log(`\n${passed}/${outcomes.length} test cases passed.`);

  mkdirSync("docs", { recursive: true });
  const md = [
    `# Test results: first working slice`,
    ``,
    `Run: ${new Date().toISOString()} · ${passed}/${outcomes.length} passed`,
    ``,
    ...outcomes.flatMap((o) => [
      `## ${o.name}: ${o.pass ? "PASS" : "FAIL"}`,
      ``,
      `**Checks:** ${o.checks}`,
      ``,
      ...o.notes.map((n) => `- ${n}`),
      ``,
      `<details><summary>Full output</summary>`,
      ``,
      "```json",
      JSON.stringify(o.result, null, 2),
      "```",
      ``,
      `</details>`,
      ``,
    ]),
  ].join("\n");
  writeFileSync("docs/test-results.md", md);
  console.log("Wrote docs/test-results.md");

  process.exit(passed === outcomes.length ? 0 : 1);
}

main();
