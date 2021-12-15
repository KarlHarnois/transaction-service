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
    let countByIsd: { [key: string]: number } = {}

    transactions.forEach(txn => {
      const count = countByIsd[txn.id] ?? 0
      countByIsd[txn.id] = count + 1
    })

    let errors: Error[] = []

    Object.keys(countByIsd).forEach(id => {
      const count = countByIsd[id]
      if (count <= 1) return
      const error = new Error(`Found ${count} duplicate transaction ids: ${id}`)
      errors.push(error)
    })

    return errors
  }
}
