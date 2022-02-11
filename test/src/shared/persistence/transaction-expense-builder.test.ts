import { TransactionExpenseBuilder } from "@shared/persistence/transaction-expense-builder"
import * as factories from "@test/factories"

describe("TransactionExpenseBuilder", () => {
  let subject: TransactionExpenseBuilder

  beforeEach(() => {
    const transactions = [
      factories.createTransaction({ id: "txn_1", centAmount: 1000 }),
      factories.createTransaction({ id: "txn_2", centAmount: 7000 }),
      factories.createTransaction({ id: "txn_3", centAmount: 4000 })
    ]

    const expenses = [
      {
        id: "exp_1",
        centAmount: 5050,
        transactionDetails: {
          id: "txn_2",
          authorizedAt: 111111111111
        }
      },
      {
        id: "exp_2",
        centAmount: 1000,
        transactionDetails: {
          id: "txn_2",
          authorizedAt: 111111111111
        }
      }
    ]

    subject = new TransactionExpenseBuilder({ transactions, expenses })
  })

  describe("assignExpenses", () => {
    it("returns the correct amount of transactions", () => {
      const result = subject.assignExpenses()
      expect(result.length).toEqual(3)
    })

    it("assigns the cent amount with expenses", () => {
      const result = subject.assignExpenses()

      expect(result.map((txn) => txn.centAmountWithExpenses)).toEqual([
        1000, 950, 4000
      ])
    })

    it("assigns the expense to the correct transaction", () => {
      const result = subject.assignExpenses()

      expect(result.map((txn) => txn.expenses)).toEqual([
        [],
        [
          { id: "exp_1", centAmount: 5050 },
          { id: "exp_2", centAmount: 1000 }
        ],
        []
      ])
    })
  })
})
