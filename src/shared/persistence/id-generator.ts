import { AccwebTransaction } from "@shared/types"

const hash = require("string-hash")

export class IdGenerator {
  generateId(transaction: AccwebTransaction) {
    const date = hash(transaction.dateTransaction)
    const amount = hash(transaction.montantTransaction)
    const name = hash(transaction.descriptionCourte)
    return `txn_${date}${amount}${name}`
  }
}
