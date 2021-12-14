import { TransactionParser } from "@lambdas/update-transaction/transaction-parser"
import { allMiddlewares } from "@lambdas/update-transaction/transaction-parser-middlewares/index"
import { map } from "@lambdas/update-transaction/categories"
import * as fixtures from "../../fixtures"

describe("TransactionParser", () => {
  describe("parseMany", () => {
    const subject = new TransactionParser({
      sourceName: "Visa",
      categoryMap: map,
      middlewares: allMiddlewares
    })

    const transactions = subject.parseMany(fixtures.accwebTransactions)

    it("returns the correct amount of transactions", () => {
      expect(transactions.length).toEqual(2)
    })

    it("parses the ids", () => {
      expect(transactions.map(t => t.id)).toEqual(["id-1", "id-2"])
    })

    it("parses the categories", () => {
      expect(transactions.map(t => t.category)).toEqual(["Food", "Entertainment"])
    })

    it("parses the subcategories", () => {
      expect(transactions.map(t => t.subcategory)).toEqual(["Grocery", "MTG"])
    })

    it("parses the amounts", () => {
      expect(transactions.map(t => t.centAmount)).toEqual([15026, 6666])
    })

    it("parses the currency amounts", () => {
      expect(transactions.map(t => t.currencyCentAmount)).toEqual([15026, 6666])
    })

    it("sets the expensed flag to false", () => {
      expect(transactions.map(t => t.isExpensed)).toEqual([false, false])
    })

    it("parses the descriptions", () => {
      expect(transactions.map(t => t.description)).toEqual([
        "Rb - Epicerie 1111",
        "Centre De Jeux Expedit"
      ])
    })

    it("parses the full descriptions", () => {
      expect(transactions.map(t => t.fullDescription)).toEqual([
        "RB - EPICERIE 1111 - Full desc",
        "CENTRE DE JEUX EXPEDIT - Full desc"
      ])
    })

    it("parses the currencies", () => {
      expect(transactions.map(t => t.currency)).toEqual(["CAD", "CAD"])
    })

    it("parses the sources", () => {
      expect(transactions.map(t => t.source)).toEqual([
        {
          name: "Visa",
          last4: "0000"
        },
        {
          name: "Visa",
          last4: "0000"
        }
      ])
    })

    it("parses the posted dates", () => {
      expect(transactions.map(t => t.timestamps.postedAt)).toEqual([
        1631728207000,
        1635105763000
      ])
    })

    it("parses the authorization date", () => {
      expect(transactions.map(t => t.timestamps.authorizedAt)).toEqual([
        1631750400000,
        1634860800000
      ])
    })
  })
})
