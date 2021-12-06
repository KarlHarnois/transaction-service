import { DocumentClient } from "aws-sdk/clients/dynamodb"

export interface Query {
  toInput(): DocumentClient.QueryInput
}

export class FindSingleTransaction implements Query {
  private readonly props

  constructor(props: {
    id: string,
    tableName: string
  }) {
    this.props = props
  }

  toInput() {
    return {
      TableName: this.props.tableName,
      IndexName: "transactionIdIndex",
      KeyConditionExpression: "sortKey = :sortKey",
      ExpressionAttributeValues: {
        ":sortKey": `id/${this.props.id}`
      },
      ConsistentRead: false
    }
  }
}

export class FindManyTransactions implements Query {
  private readonly props

  constructor(props: {
    year: number,
    month: number,
    tableName: string
  }) {
    this.props = props
  }

  toInput() {
    return {
      TableName: this.props.tableName,
      KeyConditionExpression: "resourceId = :resourceId",
      ExpressionAttributeValues: {
        ":resourceId": `transaction/${this.props.year}-${this.props.month}`
      },
      ConsistentRead: true
    }
  }
}
