import { AccwebRepository, PersistedAccwebRepository } from "@shared/persistence/accweb-repository"
import { CreateAccwebImportPayload } from "@shared/networking/transaction-service-client"
import { DynamoDBSource  } from "@shared/persistence/datasource"
import { IdGenerator } from "@shared/persistence/id-generator"
import { env, Logger } from "@shared/utils"

const response = (status: number, body: any) => {
  return {
    statusCode: status,
    headers: {},
    body: JSON.stringify(body)
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dynamodb = new DynamoDBSource(logger)

  const repo = new PersistedAccwebRepository({
    tableName: env("TABLE_NAME"),
    dataSource: dynamodb
  })

  const handler = new Handler(repo)
  const payload = JSON.parse(event.body)

  try {
    if ((<CreateAccwebImportPayload>payload) === undefined) {
      throw new Error(`Invalid payload: ${payload}`)
    } else {
      const result = await handler.process(payload)
      return response(201, result)
    }
  } catch (error) {
    return response(500, error)
  }
}

export class Handler {
  private repo: AccwebRepository

  constructor(repo: AccwebRepository) {
    this.repo = repo
  }

  async process(payload: CreateAccwebImportPayload) {
    const previousImport = await this.findMostRecentImport()
    const number = (previousImport?.number ?? 0) + 1
    const accwebImport = await this.persistImport(number)
    const transactions = this.repo.persistTransactions(accwebImport, payload.transactions)
    return { import: accwebImport, transactions: transactions }
  }

  private async persistImport(number: number) {
    const generator = new IdGenerator()
    const id = generator.generateAccwebImportId(number)
    return await this.repo.persistImport({ id: id, number: number })
  }

  private async findMostRecentImport() {
    const imports = await this.repo.findImports()

    return imports.reduce((previous, current) => {
      return (previous.number > current.number) ? previous : current
    })
  }
}
