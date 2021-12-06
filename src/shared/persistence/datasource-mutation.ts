import { TransactWriteItemsInput, TransactWriteItem } from "aws-sdk/clients/dynamodb"
import { Transaction } from "@shared/types"

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
    const now = Date.now()
    const createdAt = transaction.timestamps.created_at || now
    const postedAt = new Date(transaction.timestamps.postedAt)

    return {
      Put: {
        TableName: this.props.tableName,
        Item: {
          ...transaction,
          resourceId: `transaction/${postedAt.getFullYear()}-${postedAt.getMonth() + 1}`,
          sortKey: `id/${transaction.id}`,
          timestamps: {
            ...transaction.timestamps,
            createdAt: createdAt,
            updatedAt: now
          }
        } as any
      }
    }
  }
}
