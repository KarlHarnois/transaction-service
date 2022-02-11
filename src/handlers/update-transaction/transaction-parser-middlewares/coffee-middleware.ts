import { Middleware } from "./middleware"
import { Transaction } from "@shared/types"

export class CoffeeMiddleware implements Middleware {
  private readonly KEYWORDS = ["cafe", "coffee"]

  apply(transaction: Transaction): Transaction {
    const description = transaction.description.toLowerCase()

    this.KEYWORDS.forEach((keyword) => {
      if (description.includes(keyword)) {
        transaction.category = "FOOD"
        transaction.subcategory = "COFFEE"
      }
    })

    return transaction
  }
}
