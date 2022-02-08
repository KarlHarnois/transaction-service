import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import { PersistedExpenseRepository } from "@shared/persistence/expense-repository"
import { TransactionExpenseBuilder } from "@shared/persistence/transaction-expense-builder"
import * as types from "@shared/types"

export class FetchTransactionsHandler extends Handler {
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
    const monthYear = this.monthYear(event)
    const transactions = await this.findTransactions(monthYear)
    const expenses = await this.findExpenses(monthYear)
    const transactionsWithExpenses = this.associate(transactions, expenses)
    return this.response(200, { transactions: transactionsWithExpenses })
  }

  private monthYear(event: Event) {
    const year = event.queryStringParameters?.year
    const month = event.queryStringParameters?.month

    if (!year) throw new Error('Missing "year" query parameter')
    if (!month) throw new Error('Missing "month" query parameter')

    return {
      year: parseInt(year),
      month: parseInt(month)
    }
  }

  private async findTransactions(monthYear: types.MonthYear) {
    const repo = new PersistedTransactionRepository(this.props)
    return await repo.findMany(monthYear)
  }

  private async findExpenses(monthYear: types.MonthYear) {
    const repo = new PersistedExpenseRepository(this.props)
    return await repo.findMany(monthYear)
  }

  private associate(
    transactions: types.Transaction[],
    expenses: types.ExpenseWithTransactionDetails[]
  ) {
    const builder = new TransactionExpenseBuilder({ expenses, transactions })
    return builder.assignExpenses()
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dataSource = new DynamoDBSource(logger)

  const handler = new FetchTransactionsHandler({
    tableName: env("TABLE_NAME"),
    dataSource,
    logger
  })

  return await handler.call(event)
}
