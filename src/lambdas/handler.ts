import { APIGatewayProxyEvent } from "aws-lambda"
import { Logger } from "@shared/utils"

export interface Event {
  body?: any
  queryParams?: any
}

export interface Response {
  statusCode: number
  headers: any
  body: any
}

export abstract class Handler {
  readonly logger: Logger

  constructor(logger: Logger) {
    this.logger = logger
  }

  abstract processEvent(event: Event): Promise<Response>

  async call(event: APIGatewayProxyEvent) {
    this.logger.logEvent({ category: "LAMBDA_EVENT", payload: event })

    try {
      const response = await this.processEvent(this.parseEvent(event))
      return response
    } catch(error) {
      this.logger.logEvent({ category: "ERROR", payload: error })
      const errorMessage = (<Error>error).message
      return this.response(500, { message: errorMessage })
    }
  }

  response(status: number, body: any): Response {
    return {
      statusCode: status,
      headers: {},
      body: JSON.stringify(body)
    }
  }

  private parseEvent(event: APIGatewayProxyEvent): Event {
    const result = { queryParams: event.queryStringParameters }

    if (event.body) {
      return { ...result, body: JSON.parse(event.body) }
    } else {
      return result
    }
  }
}
