import { ExpenseWithTransactionDetails } from "@shared/types"
import { DataSource } from "./datasource"
import * as mutations from "./datasource-mutation"
import * as queries from "./datasource-query"

export interface ExpenseRepository {
  persist(
    expense: ExpenseWithTransactionDetails
  ): Promise<ExpenseWithTransactionDetails>

  findMany(args: {
    year: number
    month: number
  }): Promise<ExpenseWithTransactionDetails[]>
}

export class PersistedExpenseRepository implements ExpenseRepository {
  private readonly props

  constructor(props: { tableName: string; dataSource: DataSource }) {
    this.props = props
  }

  async persist(expense: ExpenseWithTransactionDetails) {
    const mutation = new mutations.PersistExpense({
      expense,
      tableName: this.props.tableName
    })

    await this.props.dataSource.performMutation(mutation)
    return expense
  }

  async findMany(args: { year: number; month: number }) {
    const query = new queries.QueryByMonthYear({
      tableName: this.props.tableName,
      type: "exp",
      ...args
    })
    const result = await this.props.dataSource.performQuery(query)
    return result.items.map((item) => item.jsonObject)
  }
}
