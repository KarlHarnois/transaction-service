import { AccwebUpdater } from "@lambdas/update-transaction/accweb-updater"
import { InMemoryTransactionRepository } from "@shared/persistence/transaction-repository"
import * as fixtures from "../../fixtures"
import * as factories from "../../factories"

describe("AccwebUpdater", () => {
  let subject: AccwebUpdater
  let repo: InMemoryTransactionRepository

  beforeEach(() => {
    repo = new InMemoryTransactionRepository([])
    subject = new AccwebUpdater({ repo: repo })
  })

  describe("process", () => {
    const process = async () => {
      await subject.process({
        type: "accweb",
        sourceName: "Amex",
        transaction: fixtures.accwebTransactions[1]
      })
    }

    it("persists the new transaction", async () => {
      await process()
      expect(repo.transactions.length).toEqual(1)
    })

    it("uses the provided source", async () => {
      await process()

      expect(repo.transactions.map((t) => t.source)).toEqual([
        {
          name: "Amex",
          last4: "0000"
        }
      ])
    })
  })
})
