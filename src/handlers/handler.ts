import { Logger } from "@shared/utils"

export interface Event {
  body?: any
  queryStringParameters?: any
  pathParameters?: { id?: string }
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

  async call(event: Event) {
    this.logger.logEvent({ category: "LAMBDA_EVENT", payload: event })

    try {
      const response = await this.processEvent(this.parseBody(event))
      return response
    } catch (error) {
      this.logger.logEvent({ category: "ERROR", payload: error })
      const errorMessage = (<Error>error).message
      return this.response(500, { error: { message: errorMessage } })
    }
  }

  response(status: number, body: any): Response {
    return {
      statusCode: status,
      headers: {},
      body: JSON.stringify(body)
    }
  }

  validatePathId(event: Event): string {
    const id = event.pathParameters?.id
    if (id) return id
    throw new Error("Path id not found.")
  }

  validateBodyIsPresent(event: Event) {
    if (event.body === undefined) throw new Error("Payload not found.")
  }

  private parseBody(event: Event): Event {
    if (event.body) {
      return { ...event, body: JSON.parse(event.body) }
    } else {
      return event
    }
  }
}