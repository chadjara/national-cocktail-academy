import { describe, expect, it } from "vitest";

import { scenarios } from "./index";
import { scenarioSchema, type Scenario } from "./schema";

function reachable(scenario: Scenario): Set<string> {
  const seen = new Set<string>();
  const queue = [scenario.start];
  while (queue.length > 0) {
    const id = queue.shift();
    if (id === undefined || seen.has(id)) continue;
    seen.add(id);
    const node = scenario.nodes.find((n) => n.id === id);
    for (const choice of node?.choices ?? []) if (choice.next) queue.push(choice.next);
  }
  return seen;
}

/** True if some path from this node ends without coming back to a node already on the path. */
function endsFrom(scenario: Scenario, id: string, path: Set<string> = new Set()): boolean {
  if (path.has(id)) return false;
  const node = scenario.nodes.find((n) => n.id === id);
  if (!node) return false;
  const next = new Set([...path, id]);
  return node.choices.every(
    (choice) => choice.next === undefined || endsFrom(scenario, choice.next, next),
  );
}

describe("scenarios", () => {
  it("match the schema and have unique ids", () => {
    for (const scenario of scenarios) {
      const result = scenarioSchema.safeParse(scenario);
      expect(result.success, `${scenario.id}: ${result.error?.message ?? ""}`).toBe(true);
    }
    expect(new Set(scenarios.map((s) => s.id)).size).toBe(scenarios.length);
  });

  it("are well-formed graphs: every link resolves, every node is reachable, every path ends", () => {
    for (const scenario of scenarios) {
      const ids = new Set(scenario.nodes.map((n) => n.id));
      expect(ids.size, scenario.id).toBe(scenario.nodes.length);
      expect(ids.has(scenario.start), `${scenario.id} start`).toBe(true);
      for (const node of scenario.nodes) {
        for (const choice of node.choices) {
          if (choice.next)
            expect(ids.has(choice.next), `${scenario.id}/${node.id} → ${choice.next}`).toBe(true);
        }
      }
      expect(reachable(scenario), scenario.id).toEqual(ids);
      expect(endsFrom(scenario, scenario.start), `${scenario.id} has a loop`).toBe(true);
    }
  });

  it("offer one best response at every decision, and at least one unsafe one to learn from", () => {
    for (const scenario of scenarios) {
      for (const node of scenario.nodes) {
        const outcomes = node.choices.map((c) => c.outcome);
        expect(
          outcomes.filter((o) => o === "best"),
          `${scenario.id}/${node.id}`,
        ).toHaveLength(1);
        expect(outcomes, `${scenario.id}/${node.id}`).toContain("unsafe");
        expect(new Set(node.choices.map((c) => c.text)).size).toBe(node.choices.length);
      }
    }
  });
});
