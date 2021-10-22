import { Logger } from "@shared/utils"
import { Query } from "./datasource-query"
import { Mutation } from "./datasource-mutation"
import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb"

export interface DataSource {
  performQuery(query: Query): Promise<{ items: any[] }>
  performMutation(mutation: Mutation): Promise<void>
}

export class DynamoDBSource implements DataSource {
  private readonly logger
  private readonly client

  constructor(logger: Logger) {
    this.logger = logger

    this.client = new DocumentClient({
      maxRetries: 3,
      httpOptions: {
        timeout: 10000,
        connectTimeout: 10000
      }
    })
  }

  async performQuery(query: Query): Promise<{ items: any[] }> {
    const input = query.toInput()

    this.logger.logEvent({
      category: "QUERY",
      payload: { input: input }
    })

    const output = await this.client.query(input).promise()

    this.logger.logEvent({
      category: "QUERY",
      payload: { output: output }
    })

    return {
      items: output.Items || []
    }
  }

  async performMutation(mutation: Mutation) {
    const input = mutation.toInput()
    this.logger.logEvent({ category: "TRANSACT_WRITE", payload: input })

    return this.client
      .transactWrite(input)
      .promise()
      .then(_ => {})
  }
}
