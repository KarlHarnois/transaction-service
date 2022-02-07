import { Expense } from "@shared/types"
import { DataSource } from "./datasource"
import * as mutations from "./datasource-mutation"

export interface ExpenseRepository {
  persist(expense: Expense): Promise<Expense>
}

export class PersistedExpenseRepository implements ExpenseRepository {
  private readonly props

  constructor(props: { tableName: string, dataSource: DataSource }) {
    this.props = props
  }

  async persist(expense: Expense) {
    const mutation = new mutations.PersistExpense({
      expense,
      tableName: this.props.tableName
    })

    await this.props.dataSource.performMutation(mutation)
    return expense
  }
}
