import { TransactWriteItemsInput, TransactWriteItem } from "aws-sdk/clients/dynamodb"
import { Transaction, Expense } from "@shared/types"

export interface Mutation {
  toInput(): TransactWriteItemsInput
}

export class PersistTransaction implements Mutation {
  private readonly props

  constructor(props: {
    tableName: string,
    transaction: Transaction
  }) {
    this.props = props
  }

  toInput(): TransactWriteItemsInput {
    return {
      TransactItems: [this.transactItem]
    }
  }

  private get transactItem(): TransactWriteItem {
    const transaction = this.props.transaction
    const authorizedAt = new Date(transaction.timestamps.authorizedAt)

    return {
      Put: {
        TableName: this.props.tableName,
        Item: {
          PK: `${authorizedAt.getFullYear()}-${authorizedAt.getMonth() + 1}`,
          SK: transaction.id,
          jsonObject: transaction
        } as any
      }
    }
  }
}

export class PersistExpense implements Mutation {
  private readonly props

  constructor(props: { tableName: string, expense: Expense }) {
    this.props = props
  }

  toInput(): TransactWriteItemsInput {
    return {
      TransactItems: []
    }
  }
}
