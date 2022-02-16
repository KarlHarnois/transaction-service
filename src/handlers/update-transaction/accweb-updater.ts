import { TransactionRepository } from "@shared/persistence/transaction-repository"
import { TransactionParser } from "./transaction-parser"
import { allMiddlewares } from "./middlewares"
import { UpdateTransactionPayload } from "@shared/types"

export class AccwebUpdater {
  private readonly repo

  constructor(props: { repo: TransactionRepository }) {
    this.repo = props.repo
  }

  async process(payload: UpdateTransactionPayload) {
    const parser = this.createParser(payload)
    const transaction = parser.parseSingle(payload.transaction)
    this.repo.persist(transaction)
    return transaction
  }

  private createParser(payload: UpdateTransactionPayload) {
    return new TransactionParser({
      sourceName: payload.sourceName,
      middlewares: allMiddlewares
    })
  }
}
