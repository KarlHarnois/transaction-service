import { CategoryMatcherMiddleware } from "@handlers/update-transaction/middlewares/category-matcher-middleware"
import * as factories from "@test/factories"

describe("CategoryMatcherMiddleware", () => {
  let subject: CategoryMatcherMiddleware

  beforeEach(() => {
    subject = new CategoryMatcherMiddleware([
      {
        pattern: { description: "Some Nice Coffee Shop" },
        override: { category: "FOOD", subcategory: "COFFEE" }
      },
      {
        pattern: { fullDescription: "paiement caisse" },
        override: { category: "TRANSFER" }
      }
    ])
  })

  describe("apply", () => {
    describe("when override has not subcategory", () => {
      const transaction = factories.createTransaction({
        fullDescription: "Paiement Caisse",
        subcategory: "PHONE"
      })

      it("assigns the category", () => {
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
