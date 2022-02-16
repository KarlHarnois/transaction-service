import { Middleware } from "./middleware"
import { Transaction } from "@shared/types"
import * as types from "@shared/types"

export interface Matcher {
  patterns: { [key: string]: string }
  override: CategoryOverride
}

interface CategoryOverride {
  category: types.Category
  subcategory?: types.Subcategory
}

export class PatternMatcherMiddleware implements Middleware {
  private readonly matchers

  constructor(matchers: Matcher[]) {
    this.matchers = matchers
  }

  apply(transaction: Transaction): Transaction {
    for (const matcher of this.matchers) {
      if (this.isMatching(transaction, matcher)) {
        this.applyOverride(transaction, matcher.override)
        return transaction
      }
    }
    return transaction
  }

  private isMatching(transaction: Transaction, matcher: Matcher) {
    let isMatching = false

    for (let [key, pattern] of Object.entries(matcher.patterns)) {
      if (key in transaction) {
        const valueToMatch = (transaction as any)[key]
        isMatching = this.isMatchingRegex(valueToMatch, pattern)
      }
    }
    return isMatching
  }

  private isMatchingRegex(property: string, pattern: string) {
    const regex = new RegExp(pattern)
    return regex.test(property.toLocaleLowerCase())
  }

  private applyOverride(transaction: Transaction, override: CategoryOverride) {
    transaction.category = override.category
    transaction.subcategory = override.subcategory
  }
}
