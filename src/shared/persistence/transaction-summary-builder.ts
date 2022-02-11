import * as types from "@shared/types"

export class TransactionSummaryBuilder {
  build(
    monthYear: types.MonthYear,
    transactions: types.TransactionWithExpense[]
  ) {
    let summary = this.createEmptySummary(monthYear)
    transactions.forEach((transaction) => this.associate(transaction, summary))
    return summary
  }

  private createEmptySummary(monthYear: types.MonthYear) {
    return {
      ...monthYear,
      centAmounts: { total: 0 }
    }
  }

  private associate(
    transaction: types.TransactionWithExpense,
    summary: types.TransactionSummary
  ) {
    const amount = transaction.centAmountWithExpenses
    summary.centAmounts.total += amount

    if (transaction.category) {
      const category = transaction.category.toLocaleLowerCase()

      if (summary.centAmounts[category] === undefined) {
        summary.centAmounts[category] = {}
      }

      if (transaction.subcategory) {
        const subcategory = transaction.subcategory.toLowerCase()
        const currentAmount = summary.centAmounts[category][subcategory] ?? 0
        summary.centAmounts[category][subcategory] = currentAmount + amount
      } else {
        const currentAmount = summary.centAmounts[category].other ?? 0
        summary.centAmounts[category].other = currentAmount + amount
      }
    } else {
      const currentAmount = summary.centAmounts.other ?? 0
      summary.centAmounts.other = currentAmount + amount
    }
  }
}
