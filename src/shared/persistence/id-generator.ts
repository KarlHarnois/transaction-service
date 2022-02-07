import { AccwebTransaction } from "@shared/types"
import * as uuid from "uuid"

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

  generateExpenseId() {
    return `exp_${uuid.v4()}`
  }
}
