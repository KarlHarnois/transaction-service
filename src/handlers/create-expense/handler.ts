import { env, Logger } from "@shared/utils"
import { DataSource, DynamoDBSource } from "@shared/persistence/datasource"
import { Handler, Event } from "../handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import { PersistedExpenseRepository } from "@shared/persistence/expense-repository"
import { ExpenseWithTransactionDetails, Transaction } from "@shared/types"
import { IdGenerator } from "@shared/persistence/id-generator"

interface CreateExpensePayload {
  expense: {
    centAmount: number
  }
}

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
    this.validateBodyIsPresent(event)
    const payload: CreateExpensePayload = event.body
    const transactionId = this.validatePathId(event)
    const transaction = await this.findTransaction(transactionId)
    const expense = this.buildExpense(payload, transaction)
    await this.persistExpense(expense)
    return this.response(201, { expense })
  }

  private async findTransaction(id: string) {
    const repo = new PersistedTransactionRepository(this.props)
    const transaction = await repo.find(id)
    if (<Transaction>transaction) return transaction
    throw new Error(`Transaction with id ${id} not found.`)
  }

  private buildExpense(
    payload: CreateExpensePayload,
    transaction: Transaction
  ): ExpenseWithTransactionDetails {
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

  private async persistExpense(expense: ExpenseWithTransactionDetails) {
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