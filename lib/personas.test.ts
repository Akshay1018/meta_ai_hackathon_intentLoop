import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PERSONA_IDS, personaList } from "./persona-catalog";
import {
  PERSONA_SCENARIOS,
  personaIntentCard,
  runPersonaScenario,
} from "./persona-engine";
import { isExitBrief, isIntentCard } from "./schemas";

describe("personas matrix", () => {
  it("lists all personas from PERSONAS_AND_IMPACT", () => {
    assert.equal(personaList().length, PERSONA_IDS.length);
    assert.equal(PERSONA_IDS.length, 10);
  });

  for (const id of PERSONA_IDS) {
    it(`persona intent cards validate for ${id}`, () => {
      for (const surface of ["home", "dms", "create", "reels", "profile"] as const) {
        const card = personaIntentCard(surface, id);
        assert.equal(isIntentCard(card), true);
      }
    });
  }
});

describe("persona scenarios (2 each)", () => {
  it("has twenty scenarios (two per persona)", () => {
    assert.equal(PERSONA_SCENARIOS.length, 20);
  });

  for (const scenario of PERSONA_SCENARIOS) {
    it(`${scenario.personaId}: ${scenario.name}`, () => {
      const brief = runPersonaScenario(scenario);
      assert.equal(isExitBrief(brief), true);
      assert.match(brief.happened, scenario.expectHappened);
      assert.match(brief.next_action, scenario.expectNext);
      if (scenario.driftMin != null) assert.ok(brief.drift >= scenario.driftMin);
      if (scenario.driftMax != null) assert.ok(brief.drift <= scenario.driftMax);
      assert.ok(!/addict/i.test(brief.happened));
    });
  }
});
