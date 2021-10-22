import { Transaction } from "@shared/types"

export interface Middleware {
  apply: (transaction: Transaction) => Transaction
}
