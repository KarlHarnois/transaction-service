import { AuthToken } from "@shared/auth-token"
import { Logger } from "@shared/utils"

const response = (effect: string, methodArn: string) => {
  return {
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: methodArn
        }
      ]
    }
  }
}

const validate = (token?: string) => {
  if (token === undefined) {
    throw new Error('Expected "event.authorizationToken" parameter to be set')
  }

  const secret = process.env.AUTH_TOKEN_SECRET

  if (secret === undefined) {
    throw new Error('Expected $AUTH_TOKEN_SECRET secret to be set')
  }

  const decodedToken = AuthToken.decode(token, secret)

  if (decodedToken === undefined) {
    throw new Error("Invalid token")
  } else if (decodedToken?.isExpired) {
    throw new Error("Expired token")
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  logger.logEvent({ category: "LAMBDA_EVENT", payload: event })

  try {
    validate(event.authorizationToken)
    return response("Allow", event.methodArn)
  } catch(error) {
    logger.logEvent({ category: "ERROR", payload: error })
    return response("Deny", event.methodArn)
  }
}
