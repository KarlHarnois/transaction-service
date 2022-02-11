import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
import { PersistedTransactionExpenseRepository } from "@shared/persistence/transaction-expense-repository"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"
import * as types from "@shared/types"

export class FindTransactionSummaryHandler extends Handler {
  private readonly props

  constructor(props: {
    logger: Logger
    dataSource: DataSource
    tableName: string
  }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    const monthYear = this.validateMonthYear(event)
    const transactions = await this.findTransactions(monthYear)
    const emptySummary = this.createEmptySummary(monthYear)

    const transactionSummary = this.addTransactionsToSummary(
      transactions,
      emptySummary
    )

    return this.response(200, { transactionSummary })
  }

  private async findTransactions(monthYear: types.MonthYear) {
    const repo = new PersistedTransactionExpenseRepository(this.props)
    return await repo.findMany(monthYear)
  }

  private createEmptySummary(monthYear: types.MonthYear) {
    return {
      ...monthYear,
      centAmounts: { total: 0 }
    }
  }

  private addTransactionsToSummary(
    transactions: types.TransactionWithExpense[],
    summary: types.TransactionSummary
  ) {
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

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dataSource = new DynamoDBSource(logger)

  const handler = new FindTransactionSummaryHandler({
    tableName: env("TABLE_NAME"),
    dataSource,
    logger
  })

  return await handler.call(event)
}
