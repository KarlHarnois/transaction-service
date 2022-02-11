import { TransactionParser } from "@handlers/update-transaction/transaction-parser"
import { allMiddlewares } from "@handlers/update-transaction/transaction-parser-middlewares/index"
import * as fixtures from "@test/fixtures"

describe("TransactionParser", () => {
  describe("parseMany", () => {
    const subject = new TransactionParser({
      sourceName: "Visa",
      middlewares: allMiddlewares
    })

    const transactions = subject.parseMany(fixtures.accwebTransactions)

    it("returns the correct amount of transactions", () => {
      expect(transactions.length).toEqual(3)
    })

    it("parses the ids", () => {
      expect(transactions.map((t) => t.id)).toEqual([
        "txn_id-1",
        "txn_id-2",
        "txn_id-3"
      ])
    })

    it("parses the categories", () => {
      expect(transactions.map((t) => t.category)).toEqual([
        "FOOD",
        "ENTERTAINMENT",
        "FOOD"
      ])
    })

    it("parses the subcategories", () => {
      expect(transactions.map((t) => t.subcategory)).toEqual([
        "GROCERY",
        "MTG",
        "COFFEE"
      ])
    })

    it("parses the amounts", () => {
      expect(transactions.map((t) => t.centAmount)).toEqual([15026, 6666, 8821])
    })

    it("parses the currency amounts", () => {
      expect(transactions.map((t) => t.currencyCentAmount)).toEqual([
        15026, 6666, 8821
      ])
    })

    it("parses the descriptions", () => {
      expect(transactions.map((t) => t.description)).toEqual([
        "Rb - Epicerie 1111",
        "Centre De Jeux Expedit",
        "Cafe Eclair"
      ])
    })

    it("parses the full descriptions", () => {
      expect(transactions.map((t) => t.fullDescription)).toEqual([
        "RB - EPICERIE 1111 - Full desc",
        "CENTRE DE JEUX EXPEDIT - Full desc",
        "CAFE ECLAIR"
      ])
    })

    it("parses the currencies", () => {
      expect(transactions.map((t) => t.currency)).toEqual(["CAD", "CAD", "CAD"])
    })

    it("parses the sources", () => {
      expect(transactions.map((t) => t.source)).toEqual([
        {
          name: "Visa",
          last4: "0000"
        },
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
      expect(transactions.map((t) => t.timestamps.postedAt)).toEqual([
        1631750400000, 1634860800000, 1634860800000
      ])
    })

    it("parses the authorization date", () => {
      expect(transactions.map((t) => t.timestamps.authorizedAt)).toEqual([
        1631728207000, 1634760163000, 1634760163000
      ])
    })
  })
})
