import {
  AccwebRepository,
  PersistedAccwebRepository
} from "@shared/persistence/accweb-repository"
import { CreateAccwebImportPayload } from "@shared/networking/transaction-service-client"
import { DynamoDBSource } from "@shared/persistence/datasource"
import { IdGenerator } from "@shared/persistence/id-generator"
import { env, Logger } from "@shared/utils"
import { Handler, Event } from "../handler"

export class CreateAccwebImportHandler extends Handler {
  private props

  constructor(props: { logger: Logger; repo: AccwebRepository }) {
    super(props.logger)
    this.props = props
  }

  async processEvent(event: Event) {
    this.validateBodyIsPresent(event)
    const payload: CreateAccwebImportPayload = event.body
    const previousImport = await this.findMostRecentImport()
    const number = (previousImport?.number ?? 0) + 1
    const accwebImport = await this.persistImport(number)
    const transactions = this.repo.persistTransactions(
      accwebImport,
      payload.transactions
    )
    return this.response(201, { transactions, import: accwebImport })
  }

  private async persistImport(number: number) {
    const generator = new IdGenerator()
    const id = generator.generateAccwebImportId(number)
    return await this.repo.persistImport({ id: id, number: number })
  }

  private async findMostRecentImport() {
    const imports = await this.repo.findImports()

    return imports.reduce((previous, current) => {
      return previous.number > current.number ? previous : current
    })
  }

  private get repo() {
    return this.props.repo
  }
}

exports.handler = async (event: any, context?: any) => {
  const logger = new Logger()
  const dynamodb = new DynamoDBSource(logger)

  const repo = new PersistedAccwebRepository({
    tableName: env("TABLE_NAME"),
    dataSource: dynamodb
  })

  const handler = new CreateAccwebImportHandler({ logger, repo })
  return await handler.call(event)
}
