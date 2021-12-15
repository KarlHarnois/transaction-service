import { Transaction } from "@shared/types"

export class IngestionOutput {
  errors: Error[]
}

export class IngestionValidator {
  validate(transactions: Transaction[]): IngestionOutput {
    let output: IngestionOutput = { errors: [] }

    this.validateIds(transactions).forEach(error => {
      output.errors.push(error)
    })

    return output
  }

  private validateIds(transactions: Transaction[]): Error[] {
    let transactionByIds: { [key: string]: Transaction[] } = {}

    transactions.forEach(txn => {
      let list = transactionByIds[txn.id] ?? []
      list.push(txn)
      transactionByIds[txn.id] = list
    })

    return this.errorsForDuplicateIds(transactionByIds)
  }

  private errorsForDuplicateIds(hash: { [key: string]: Transaction[] }) {
    let errors: Error[] = []

    Object.keys(hash).forEach(id => {
      const transactions = hash[id]
      const count = transactions.length
      if (count <= 1) return
      const descriptions = transactions.map(txn => txn.description).join(", ")
      const error = new Error(`Found ${count} duplicate transaction ids ${id} with descriptions: ${descriptions}`)
      errors.push(error)
    })

    return errors
  }
}
