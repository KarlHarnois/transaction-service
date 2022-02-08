import { IdGenerator } from "@shared/persistence/id-generator"
import {
  Transaction,
  TransactionSource,
  AccwebTransaction
} from "@shared/types"
import { Middleware } from "./transaction-parser-middlewares/middleware"

export interface TransactionParserProps {
  sourceName: string
  categoryMap: Map<string, string>
  middlewares?: Middleware[]
}

export class TransactionParser {
  private readonly props: TransactionParserProps

  constructor(props: TransactionParserProps) {
    this.props = props
  }

  parseMany(transactions: AccwebTransaction[]): Transaction[] {
    return transactions.map((transaction) => this.parseSingle(transaction))
  }

  parseSingle(transaction: AccwebTransaction): Transaction {
    const result: Transaction = {
      id: this.generateId(transaction),
      description: transaction.descriptionSimplifiee,
      fullDescription: transaction.descriptionCourte,
      category: this.parseCategory(transaction.categorieParentTransaction),
      subcategory: this.parseCategory(transaction.categorieTransaction),
      centAmount: this.parseCentAmount(transaction.montantTransaction),
      currency: transaction.devise,
      currencyCentAmount: this.parseCurrencyAmount(transaction),
      source: this.parseSource(transaction),
      timestamps: {
        postedAt: Date.parse(transaction.dateInscription),
        authorizedAt: Date.parse(transaction.dateTransaction)
      }
    }
    return this.applyMiddlewares(result)
  }

  private generateId(transaction: AccwebTransaction) {
    const generator = new IdGenerator()
    return generator.generateTransactionId(transaction)
  }

  private applyMiddlewares(transaction: Transaction): Transaction {
    let result = transaction

    this.props.middlewares?.forEach((middleware) => {
      result = middleware.apply(result)
    })

    return result
  }

  private parseCategory(category?: string): string | undefined {
    if (category) {
      return this.props.categoryMap.get(category)
    } else {
      return undefined
    }
  }

  private parseCentAmount(amount: string): number {
    return Number.parseInt(amount.replace(".", ""))
  }

  private parseCurrencyAmount(transaction: AccwebTransaction): number {
    if (transaction.montantDevise) {
      return this.parseCentAmount(transaction.montantDevise)
    } else if (transaction.devise === "CAD") {
      return this.parseCentAmount(transaction.montantTransaction)
    } else {
      throw new Error("Could not parse currency amount")
    }
  }

  private parseSource(transaction: AccwebTransaction): TransactionSource {
    const number = transaction.numeroCarteMasque

    return {
      name: this.props.sourceName,
      last4: number?.slice(number.length - 4, number.length)
    }
  }
}
