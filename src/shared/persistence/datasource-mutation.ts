import { TransactWriteItemsInput } from "aws-sdk/clients/dynamodb"
import { Transaction, ExpenseWithTransactionDetails } from "@shared/types"

export interface Mutation {
  toInput(): TransactWriteItemsInput
}

export class PersistTransaction implements Mutation {
  private readonly props

  constructor(props: { tableName: string; transaction: Transaction }) {
    this.props = props
  }

  toInput(): TransactWriteItemsInput {
    return {
      TransactItems: [this.item]
    }
  }

  private get item() {
    const transaction = this.props.transaction

    return {
      Put: {
        TableName: this.props.tableName,
        Item: {
          PK: monthYear(transaction.timestamps.authorizedAt),
          SK: transaction.id,
          jsonObject: transaction
        } as any
      }
    }
  }
}

export class PersistExpense implements Mutation {
  private readonly props

  constructor(props: {
    tableName: string
    expense: ExpenseWithTransactionDetails
  }) {
    this.props = props
  }

  toInput(): TransactWriteItemsInput {
    return {
      TransactItems: [this.item]
    }
  }

  private get item() {
    const expense = this.props.expense

    return {
      Put: {
        TableName: this.props.tableName,
        Item: {
          PK: monthYear(expense.transactionDetails.authorizedAt),
          SK: expense.id,
          jsonObject: expense
        } as any
      }
    }
  }
}

const monthYear = (timestamp: number) => {
  const date = new Date(timestamp)
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}`
}
