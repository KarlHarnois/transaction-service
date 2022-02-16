import { PatternMatcherMiddleware } from "@handlers/update-transaction/middlewares/pattern-matcher-middleware"
import * as factories from "@test/factories"

describe("PatternMatcherMiddleware", () => {
  let subject: PatternMatcherMiddleware

  beforeEach(() => {
    subject = new PatternMatcherMiddleware([
      {
        patterns: { description: "cafe|coffee" },
        override: { category: "FOOD", subcategory: "COFFEE" }
      },
      {
        patterns: { fullDescription: "paiement caisse" },
        override: { category: "TRANSFER" }
      }
    ])
  })

  describe("apply", () => {
    const transaction = factories.createTransaction({
      description: "Some nice coffee shop"
    })

    it("overrides the category", () => {
      const result = subject.apply(transaction)
      expect(result.category).toEqual("FOOD")
    })

    it("overrides the subcategory", () => {
      const result = subject.apply(transaction)
      expect(result.subcategory).toEqual("COFFEE")
    })

    describe("when override has no subcategory", () => {
      const transaction = factories.createTransaction({
        fullDescription: "Paiement Caisse",
        subcategory: "PHONE"
      })

      it("overrides the category", () => {
        const result = subject.apply(transaction)
        expect(result.category).toEqual("TRANSFER")
      })

      it("removes the transaction subcategory", () => {
        const result = subject.apply(transaction)
        expect(result.subcategory).toEqual(undefined)
      })
    })
  })
})
