import {
  PersistedTransactionRepository,
  TransactionRepository
} from "@shared/persistence/transaction-repository"
import { DynamoDBSource } from "@shared/persistence/datasource"
import { AccwebUpdater } from "./accweb-updater"
import { env, Logger } from "@shared/utils"
import { AccwebUpdatePayload } from "@shared/networking/transaction-service-client"
import { Handler, Event } from "../handler"

export class UpdateTransactionHandler extends Handler {
  private props

  constructor(props: { logger: Logger; repo: TransactionRepository }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    this.validateBodyIsPresent(event)
    const updater = new AccwebUpdater({ repo: this.props.repo })
    const payload: AccwebUpdatePayload = event.body
    const transaction = await updater.process(payload)
    return this.response(200, { transaction })
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dynamodb = new DynamoDBSource(logger)

  const repo = new PersistedTransactionRepository({
    tableName: env("TABLE_NAME"),
    dataSource: dynamodb
  })

  const handler = new UpdateTransactionHandler({ logger, repo })
  return await handler.call(event)
}
