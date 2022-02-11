import * as types from "@shared/types"

export class TransactionSummaryBuilder {
  build(
    monthYear: types.MonthYear,
    transactions: types.TransactionWithExpense[]
  ) {
    let summary: types.TransactionSummary = {
      ...monthYear,
      centAmounts: { total: 0 }
    }

    transactions.forEach((txn) => {
      const amount = txn.centAmountWithExpenses
      summary.centAmounts.total += amount

      if (txn.category) {
        const category = txn.category.toLocaleLowerCase()

        if (summary.centAmounts[category] === undefined) {
          summary.centAmounts[category] = {}
        }

        if (txn.subcategory) {
          const subcategory = txn.subcategory.toLowerCase()
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
    })

    return summary
  }
}
