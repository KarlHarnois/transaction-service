import { TransactionRepository } from "@shared/persistence/transaction-repository"
import { AccwebUpdatePayload } from "@shared/networking/transaction-service-client"
import { TransactionParser } from "./transaction-parser"
import { allMiddlewares } from "./middlewares"

export class AccwebUpdater {
  private readonly repo

  constructor(props: { repo: TransactionRepository }) {
    this.repo = props.repo
  }

  async process(payload: AccwebUpdatePayload) {
    const parser = this.createParser(payload)
    const transaction = parser.parseSingle(payload.transaction)
    this.repo.persist(transaction)
    return transaction
  }

  private createParser(payload: AccwebUpdatePayload) {
    return new TransactionParser({
      sourceName: payload.sourceName,
      middlewares: allMiddlewares
    })
  }
}
