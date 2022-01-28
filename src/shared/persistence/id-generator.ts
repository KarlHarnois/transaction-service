import { AccwebTransaction } from "@shared/types"

export class IdGenerator {
  generateTransactionId(transaction: AccwebTransaction) {
    return `txn_${transaction.identifiant}`
  }

  generateAccwebTransactionId(transaction: AccwebTransaction) {
    return `act_${transaction.identifiant}`
  }

  generateAccwebImportId(number: number) {
    return `imp_${number}`
  }
}
