import { Transaction } from "@shared/types"
import { DataSource } from "./datasource"
import * as queries from "./datasource-query"
import * as mutations from "./datasource-mutation"

export interface TransactionRepository {
  find(id: string): Promise<Transaction|undefined>
  findMany(args: { year: number, month: number }): Promise<Transaction[]>
  persist(transaction: Transaction): Promise<Transaction>
}

export class InMemoryTransactionRepository implements TransactionRepository {
  transactions: Transaction[]

  constructor(transactions: Transaction[]) {
    this.transactions = transactions
  }

  find(id: string) {
    const result = this.transactions.find(t => t.id === id)
    return Promise.resolve(result)
  }

  findMany(args: { year: number, month: number }) {
    return Promise.resolve(this.transactions)
  }

  persist(transaction: Transaction) {
    const index = this.transactions.findIndex(t => t.id === transaction.id)

    if (index >= 0) {
      this.transactions[index] = transaction
    } else {
      this.transactions.push(transaction)
    }

    return Promise.resolve(transaction)
  }
}

export class PersistedTransactionRepository implements TransactionRepository {
  private readonly props

  constructor(props: {
    tableName: string,
    dataSource: DataSource
  }) {
    this.props = props
  }

  async find(id: string) {
    const query = new queries.FindSingleTransaction({
      tableName: this.props.tableName,
      id: id
    })
    const result = await this.props.dataSource.performQuery(query)
    return result.items[0]?.jsonObject
  }

  async findMany(args: { year: number, month: number }) {
    const query = new queries.FindManyTransactions({
      tableName: this.props.tableName,
      ...args
    })
    const result = await this.props.dataSource.performQuery(query)
    return result.items.map(item => item.jsonObject)
  }

  async persist(transaction: Transaction) {
    const mutation = new mutations.PersistTransaction({
      transaction: transaction,
      tableName: this.props.tableName
    })

    await this.props.dataSource.performMutation(mutation)
    return transaction
  }
}
