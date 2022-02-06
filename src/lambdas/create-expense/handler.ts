import { Logger } from "@shared/utils"
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
    return response(201, {})
  } catch (error) {
    const errorMessage = (<Error>error).message
    logger.logEvent({ category: "ERROR", payload: { message: errorMessage } })
    return response(500, { message: errorMessage })
  }
}
