import { ImportValidator } from "@shared/validation/import-validator"
import * as factories from "@test/factories"

describe("ImportValidator", () => {
  const subject = new ImportValidator()

  describe("validate", () => {
    it("returns all duplicate ids", () => {
      const output = subject.validate([
        factories.createTransaction({ id: "1", description: "Saint-Henri" }),
        factories.createTransaction({ id: "2", description: "Larue" }),
        factories.createTransaction({ id: "2", description: "HUIT" }),
        factories.createTransaction({ id: "1", description: "Dispatch" }),
        factories.createTransaction({ id: "2", description: "Standard" }),
        factories.createTransaction({ id: "4", description: "Myriade" })
      ])

      expect(output.errors.map((e) => e.message)).toEqual([
        "Found 2 duplicate transaction ids 1 with descriptions: Saint-Henri, Dispatch",
        "Found 3 duplicate transaction ids 2 with descriptions: Larue, HUIT, Standard"
      ])
    })
  })
})
