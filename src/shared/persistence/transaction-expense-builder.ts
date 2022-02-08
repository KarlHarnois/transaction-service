import * as types from "@shared/types"

export class TransactionExpenseBuilder {
  private readonly props

  constructor(props: {
    transactions: types.Transaction[]
    expenses: types.ExpenseWithTransactionDetails[]
  }) {
    this.props = props
  }

  assignExpenses(): types.TransactionWithExpense[] {
    let expensesByTransaction: { [transactionId: string]: types.Expense[] } = {}

    this.props.expenses.forEach((expense) => {
      const { transactionDetails, ...rest } = expense

      if (expensesByTransaction[transactionDetails.id] === undefined) {
        expensesByTransaction[transactionDetails.id] = []
      }

      expensesByTransaction[transactionDetails.id]?.push(rest)
    })

    return this.props.transactions.map((txn) => {
      const expenses = expensesByTransaction[txn.id] ?? []

      return {
        expenses,
        ...txn
      }
    })
  }
}
