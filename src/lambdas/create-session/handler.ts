import { AuthToken } from "@shared/auth-token"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"

export class CreateSessionHandler extends Handler {
  private props

  constructor(props: { logger: Logger, secret: string }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    const token = new AuthToken({})

    return this.response(201, {
      expiration: token.expiration,
      token: token.encode(this.props.secret)
    })
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const handler = new CreateSessionHandler({ logger, secret: env("AUTH_TOKEN_SECRET") })
  return await handler.call(event)
}
