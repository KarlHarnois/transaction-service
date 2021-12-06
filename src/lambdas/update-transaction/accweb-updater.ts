import { TransactionRepository } from "@shared/persistence/transaction-repository"
import { AccwebUpdatePayload } from "@shared/networking/transaction-service-client"
import { TransactionParser } from "./transaction-parser"
import { allMiddlewares } from "./transaction-parser-middlewares"
import { Transaction } from "@shared/types"
import { map } from "./categories"

export class AccwebUpdater {
  private readonly repo

  constructor(props: { repo: TransactionRepository }) {
    this.repo = props.repo
  }

  async process(payload: AccwebUpdatePayload) {
    const parser = this.createParser(payload)
    const parsedTransaction = parser.parseSingle(payload.transaction)
    const transaction = await this.mergeWithPreviousVersion(parsedTransaction)
    this.repo.persist(transaction)
    return transaction
  }

  private createParser(payload: AccwebUpdatePayload) {
    return new TransactionParser({
      sourceName: payload.sourceName,
      categoryMap: map,
      middlewares: allMiddlewares
    })
  }

  private async mergeWithPreviousVersion(transaction: Transaction): Promise<Transaction> {
    const previousVersion = await this.repo.find(transaction.id)

    if (previousVersion) {
      return {
        ...transaction,
        isExpensed: previousVersion.isExpensed
      }
    } else {
      return transaction
    }
  }
}
