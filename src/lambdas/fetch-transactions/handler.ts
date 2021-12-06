import { DynamoDBSource } from "@shared/persistence/datasource"
import { PersistedTransactionRepository, TransactionRepository } from "@shared/persistence/transaction-repository"
import { env, Logger } from "@shared/utils"
import { APIGatewayProxyEvent } from "aws-lambda"

const response = (status: number, body: any) => {
  return {
    statusCode: status,
    headers: {},
    body: JSON.stringify(body)
  }
}

exports.handler = async (event: APIGatewayProxyEvent, context?: any) => {
  const logger = new Logger()
  logger.logEvent({ category: "LAMBDA_EVENT", payload: event })

  try {
    const dynamodb = new DynamoDBSource(logger)

    const repo = new PersistedTransactionRepository({
      dataSource: dynamodb,
      tableName: env("TABLE_NAME")
    })

    const handler = new Handler({
      logger: logger,
      repo: repo
    })

    const transactions = await handler.process(event)
    return response(200, { transactions })
  } catch (error) {
    const errorMessage = (<Error>error).message
    logger.logEvent({ category: "ERROR", payload: { message: errorMessage } })
    return response(500, { message: errorMessage })
  }
}

export class Handler {
  private readonly props

  constructor(props: {
    repo: TransactionRepository,
    logger?: Logger
  }) {
    this.props = props
  }

  async process(event: { queryStringParameters?: any }) {
    const year = event.queryStringParameters?.year
    const month = event.queryStringParameters?.month

    if (!year) {
      throw new Error('Missing "year" query parameter')
    }
    if (!month) {
      throw new Error('Missing "month" query parameter')
    }

    const transactions = await this.props.repo.findMany({
      year: parseInt(year),
      month: parseInt(month)
    })

    return transactions
  }
}
