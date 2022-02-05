import { AccwebImport, AccwebTransaction } from "@shared/types"
import { DataSource } from "./datasource"

export interface AccwebRepository {
  findImports(): Promise<AccwebImport[]>
  findTransactions(accwebImport: AccwebImport): Promise<AccwebTransaction[]>
  persistImport(accwebImport: AccwebImport): Promise<AccwebImport>
  persistTransactions(accwebImport: AccwebImport, transactions: AccwebTransaction[]): Promise<AccwebTransaction[]>
}

export class PersistedAccwebRepository implements AccwebRepository {
  private readonly props

  constructor(props: {
    tableName: string,
    dataSource: DataSource
  }) {
    this.props = props
  }

  async findImports() {
    return []
  }

  async findTransactions(accwebImport: AccwebImport) {
    return []
  }

  async persistImport(accwebImport: AccwebImport) {
    return { id: "", number: 1 }
  }

  async persistTransactions(accwebImport: AccwebImport, transactions: AccwebTransaction[]) {
    return []
  }
}
