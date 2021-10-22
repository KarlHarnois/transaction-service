import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import { DynamoDBSource  } from "@shared/persistence/datasource"
import { AccwebUpdater } from "./accweb-updater"
import { env, Logger } from "@shared/utils"
import { AccwebUpdatePayload } from "@shared/networking/transaction-service-client"

const response = (status: number, body: any) => {
  return {
    statusCode: status,
    headers: {},
    body: JSON.stringify(body)
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  logger.logEvent({ category: "LAMBDA_EVENT", payload: event })

  try {
    const dynamodb = new DynamoDBSource(logger)

    const repo = new PersistedTransactionRepository({
      tableName: env("TABLE_NAME"),
      dataSource: dynamodb
    })

    const updater = new AccwebUpdater({ repo: repo })
    const payload = JSON.parse(event.body)

    if ((<AccwebUpdatePayload>payload) !== undefined) {
      const transaction = await updater.process(payload)
      return response(200, { transaction: transaction })
    } else {
      throw new Error(`Invalid payload: ${payload}`)
    }
  } catch (error) {
    logger.logEvent({ category: "ERROR", payload: error })
    return response(500, { message: (<Error>error).message })
  }
}
