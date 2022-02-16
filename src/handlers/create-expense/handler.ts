import { env, Logger } from "@shared/utils"
import { DataSource, DynamoDBSource } from "@shared/persistence/datasource"
import { Handler, Event } from "../handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import { PersistedExpenseRepository } from "@shared/persistence/expense-repository"
import { IdGenerator } from "@shared/persistence/id-generator"
import * as types from "@shared/types"

export class CreateExpenseHandler extends Handler {
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
    this.validateBody("CreateExpensePayload", event)
    const transactionId = this.validatePathId(event)
    const transaction = await this.findTransaction(transactionId)
    const expense = this.buildExpense(event.body, transaction)
    await this.persistExpense(expense)
    return this.response(201, { expense })
  }

  private async findTransaction(id: string) {
    const repo = new PersistedTransactionRepository(this.props)
    const transaction = await repo.find(id)

    if (transaction === undefined) {
      throw new Error(`Transaction with id ${id} not found.`)
    }

    this.validateJSON({ definition: "Transaction", data: transaction })
    return transaction
  }

  private buildExpense(
    payload: types.CreateExpensePayload,
    transaction: types.Transaction
  ): types.ExpenseWithTransactionDetails {
    const generator = new IdGenerator()
    const params = payload.expense

    return {
      id: generator.generateExpenseId(),
      centAmount: params.centAmount,
      transactionDetails: {
        id: transaction.id,
        authorizedAt: transaction.timestamps.authorizedAt
      }
    }
  }

  private async persistExpense(expense: types.ExpenseWithTransactionDetails) {
    const repo = new PersistedExpenseRepository(this.props)
    return await repo.persist(expense)
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dataSource = new DynamoDBSource(logger)
  const handler = new CreateExpenseHandler({
    logger,
    dataSource,
    tableName: env("TABLE_NAME")
  })
  return await handler.call(event)
}
