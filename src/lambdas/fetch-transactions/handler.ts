import { DynamoDBSource } from "@shared/persistence/datasource"
import { PersistedTransactionRepository, TransactionRepository } from "@shared/persistence/transaction-repository"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"

export class FetchTransactionsHandler extends Handler {
  private readonly props

  constructor(props: { repo: TransactionRepository, logger: Logger }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    const monthYear = this.monthYear(event)
    const transactions = await this.props.repo.findMany(monthYear)
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
  const dynamodb = new DynamoDBSource(logger)

  const repo = new PersistedTransactionRepository({
    dataSource: dynamodb,
    tableName: env("TABLE_NAME")
  })

  const handler = new FetchTransactionsHandler({ logger, repo })
  return await handler.call(event)
}
