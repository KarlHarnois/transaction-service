import { Middleware } from "./middleware"
import { Transaction } from "@shared/types"
import * as types from "@shared/types"

interface ConfigValue {
  category: types.Category
  subcategory?: types.Subcategory
}

export class KeywordMapMiddleware implements Middleware {
  private readonly config

  constructor(config: { [keyword: string]: ConfigValue }) {
    this.config = config
  }

  apply(transaction: Transaction): Transaction {
    const description = transaction.fullDescription.toLowerCase()

    for (const [keyword, value] of Object.entries(this.config)) {
      if (description.includes(keyword)) {
        transaction.category = value.category
        transaction.subcategory = value.subcategory
      }
    }

    return transaction
  }
}
