import { AuthToken } from "@shared/auth-token"
import { APIGatewayProxyEvent } from "aws-lambda"
import { env } from "@shared/utils"

exports.handler = async (event: APIGatewayProxyEvent, context?: any) => {
  try {
    const token = new AuthToken({})

    const session = {
      expiration: token.expiration,
      token: token.encode(env("AUTH_TOKEN_SECRET"))
    }

    return response(200, session)
  } catch (error) {
    return response(500, error)
  }
}

const response = (status: number, body: any) => {
  return {
    statusCode: status,
    headers: {},
    body: JSON.stringify(body)
  }
}
