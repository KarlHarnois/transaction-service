import { IngestionValidator } from "@shared/validation/ingestion-validator"
import * as factories from "../../factories"

describe("IngestionValidator", () => {
  const subject = new IngestionValidator()

  describe("validate", () => {
    it("returns all duplicate ids", () => {
      const output = subject.validate([
        factories.createTransaction({ id: "1" }),
        factories.createTransaction({ id: "2" }),
        factories.createTransaction({ id: "2" }),
        factories.createTransaction({ id: "1" }),
        factories.createTransaction({ id: "2" }),
        factories.createTransaction({ id: "4" })
      ])

      expect(output.errors.map(e => e.message)).toEqual([
        "Found 2 duplicate transaction ids: 1",
        "Found 3 duplicate transaction ids: 2"
      ])
    })
  })
})
