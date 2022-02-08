import { DynamoDBSource, DataSource } from "@shared/persistence/datasource"
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
    return this.response(200, {})
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
