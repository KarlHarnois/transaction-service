import { AccwebTransaction } from "@shared/types"

const hash = require("string-hash")

export class IdGenerator {
  generateId(transaction: AccwebTransaction) {
    return `txn_${hash(`${transaction.dateTransaction}${transaction.montantDevise}`)}`
  }
}
