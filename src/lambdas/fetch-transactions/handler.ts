import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"

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
    const repo = new PersistedTransactionRepository(this.props)
    const transactions = await repo.findMany(monthYear)
    return this.response(200, { transactions })
  }

  private monthYear(event: Event) {
    const year = event.queryStringParameters?.year
    const month = event.queryStringParameters?.month

    if (!year) {
      throw new Error('Missing "year" query parameter')
    }
    if (!month) {
      throw new Error('Missing "month" query parameter')
    }

    return {
      year: parseInt(year),
      month: parseInt(month)
    }
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
