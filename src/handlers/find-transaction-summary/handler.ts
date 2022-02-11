import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
import { PersistedTransactionExpenseRepository } from "@shared/persistence/transaction-expense-repository"
import { TransactionSummaryBuilder } from "@shared/persistence/transaction-summary-builder"
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
    const builder = new TransactionSummaryBuilder()
    const transactionSummary = builder.build(monthYear, transactions)
    return this.response(200, { transactionSummary })
  }

  private async findTransactions(monthYear: types.MonthYear) {
    const repo = new PersistedTransactionExpenseRepository(this.props)
    return await repo.findMany(monthYear)
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
