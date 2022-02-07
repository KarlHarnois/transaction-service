import { env, Logger } from "@shared/utils"
import { DataSource, DynamoDBSource } from "@shared/persistence/datasource"
import { Handler, Event } from "../handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"

interface CreateExpensePayload {
  expense: {
    transactionId: string
  }
}

export class CreateExpenseHandler extends Handler {
  private readonly props

  constructor(props: {
    logger: Logger,
    dataSource: DataSource,
    tableName: string
  }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    const payload: CreateExpensePayload = this.validateBody(event)
    await this.validateTransactionExists(payload.expense.transactionId)
    return this.response(201, {})
  }

  private async validateTransactionExists(id: string) {
    const transaction = await this.findTransaction(id)
    if (!transaction) throw new Error(`Transaction with id ${id} not found.`)
  }

  private async findTransaction(id: string) {
    const repo = new PersistedTransactionRepository(this.props)
    return await repo.find(id)
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dataSource = new DynamoDBSource(logger)
  const handler = new CreateExpenseHandler({ logger, dataSource, tableName: env("TABLE_NAME") })
  return await handler.call(event)
}
