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
    const hash = this.aggregateExpensesByTransactions()

    return this.props.transactions.map((txn) => {
      const expenses = hash[txn.id] ?? []
      const centAmountWithExpenses =
        txn.centAmount - this.expenseTotal(expenses)

      return { expenses, centAmountWithExpenses, ...txn }
    })
  }

  private aggregateExpensesByTransactions() {
    let result: { [transactionId: string]: types.Expense[] } = {}

    this.props.expenses.forEach((expense) => {
      const { transactionDetails, ...rest } = expense
      const { id } = transactionDetails
      result[id] === undefined ? (result[id] = [rest]) : result[id]?.push(rest)
    })

    return result
  }

  private expenseTotal(expenses: types.Expense[]) {
    return expenses.reduce((acc, expense) => {
      return acc + expense.centAmount
    }, 0)
  }
}
