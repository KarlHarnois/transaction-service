import { Middleware } from "./middleware"
import { Transaction } from "@shared/types"
import * as types from "@shared/types"

export interface Matcher {
  pattern: any
  override: CategoryOverride
}

interface CategoryOverride {
  category: types.Category
  subcategory?: types.Subcategory
}

export class CategoryMatcherMiddleware implements Middleware {
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

    for (let [key, value] of Object.entries(matcher.pattern)) {
      if (key in transaction) {
        const valueToMatch = (transaction as any)[key]
        isMatching = this.isMatchingSubstring(valueToMatch, value as string)
      }
    }
    return isMatching
  }

  private isMatchingSubstring(property: string, value: string) {
    return property.toLocaleLowerCase().includes(value.toLocaleLowerCase())
  }

  private applyOverride(transaction: Transaction, override: CategoryOverride) {
    transaction.category = override.category
    transaction.subcategory = override.subcategory
  }
}
