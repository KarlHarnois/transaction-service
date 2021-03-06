import { DocumentClient } from "aws-sdk/clients/dynamodb"

export interface Query {
  toInput(): DocumentClient.QueryInput
}

export class FindSingleTransaction implements Query {
  private readonly props

  constructor(props: { id: string; tableName: string }) {
    this.props = props
  }

  toInput() {
    return {
      TableName: this.props.tableName,
      IndexName: "GSI1",
      KeyConditionExpression: "SK = :id",
      ExpressionAttributeValues: {
        ":id": this.props.id
      },
      ConsistentRead: false
    }
  }
}

export class QueryByMonthYear implements Query {
  private readonly props

  constructor(props: {
    year: number
    month: number
    tableName: string
    type: string
  }) {
    this.props = props
  }

  toInput() {
    return {
      TableName: this.props.tableName,
      KeyConditionExpression: "PK = :partitionKey and begins_with(SK, :type)",
      ExpressionAttributeValues: {
        ":partitionKey": `${this.props.year}-${this.props.month}`,
        ":type": this.props.type
      },
      ConsistentRead: true
    }
  }
}
