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

      expect(repo.transactions.map(t => t.source)).toEqual([
        {
          name: "Amex",
          last4: "0000"
        }
      ])
    })

    describe("when a transaction with the same id already exists", () => {
      beforeEach(() => {
        const existingVersion = factories.createTransaction({ id: "txn_37561336141111237231129609267", isExpensed: true })
        repo.transactions.push(existingVersion)
      })

      it("updates the description", async () => {
        await process()
        expect(repo.transactions.map(t => t.description)).toEqual(["Centre De Jeux Expedit"])
      })

      it("does not override the expensed flag", async () => {
        await process()
        expect(repo.transactions.map(t => t.isExpensed)).toEqual([true])
      })
    })
  })
})
