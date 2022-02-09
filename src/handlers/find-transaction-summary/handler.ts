import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
import { TransactionSummary } from "@shared/types"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"

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

    const transactionSummary: TransactionSummary = {
      ...monthYear,
      amounts: {}
    }

    return this.response(200, { transactionSummary })
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
