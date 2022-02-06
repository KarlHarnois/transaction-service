import { Logger } from "@shared/utils"
import { Handler, Event } from "../handler"

export class CreateExpenseHandler extends Handler {
  async processEvent(event: Event) {
    return this.response(200, {})
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const handler = new CreateExpenseHandler(logger)
  return await handler.call(event)
}
