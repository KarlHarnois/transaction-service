import { Middleware } from "./middleware"
import { Transaction } from "@shared/types"

export class MTGMiddleware implements Middleware {
  private readonly MTG_STORES = [
    "Centre De Jeux Expedit",
    "Valet D Coeur",
    "Jeux Face A Face"
  ]

  private readonly PAYPAL_KEYWORDS = [
    "JEUXFACEFAC",
    "EXPEDITION",
    "LEVALETDCOE"
  ]

  apply(transaction: Transaction): Transaction {
    if (
      this.isInStoreTransaction(transaction) ||
      this.isPaypalMtgTransaction(transaction)
    ) {
      transaction.category = "Entertainment"
      transaction.subcategory = "MTG"
    }
    return transaction
  }

  private isInStoreTransaction(transaction: Transaction): boolean {
    return this.MTG_STORES.includes(transaction.description)
  }

  private isPaypalMtgTransaction(transaction: Transaction): boolean {
    if (transaction.description !== "Paypal") {
      return false
    }
    let result = false

    this.PAYPAL_KEYWORDS.forEach((keyword) => {
      if (transaction.fullDescription.includes(keyword)) {
        result = true
      }
    })

    return result
  }
}
