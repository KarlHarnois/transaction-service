import { Logger } from "@shared/utils"
import { CreateExpenseLambda } from "lib/lambdas/create-expense-lambda"
import { Handler, Event, Response } from "../handler"

export class CreateExpenseHandler extends Handler {
  constructor(props: { logger: Logger }) {
    super(props.logger)
  }

  async processEvent(event: Event) {
    return this.response(200, {})
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const handler = new CreateExpenseHandler({ logger })
  return await handler.call(event)
}
