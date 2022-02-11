import * as types from "@shared/types"
import { DataSource } from "./datasource"
import { PersistedTransactionRepository } from "./transaction-repository"
import { PersistedExpenseRepository } from "./expense-repository"
import { TransactionExpenseBuilder } from "./transaction-expense-builder"

export interface TransactionExpenseRepository {
  findMany(monthYear: types.MonthYear): Promise<types.TransactionWithExpense[]>
}

export class PersistedTransactionExpenseRepository
  implements TransactionExpenseRepository
{
  private readonly props

  constructor(props: { tableName: string; dataSource: DataSource }) {
    this.props = props
  }

  async findMany(monthYear: types.MonthYear) {
    const transactions = await this.findTransactions(monthYear)
    const expenses = await this.findExpenses(monthYear)
    const builder = new TransactionExpenseBuilder({ transactions, expenses })
    return builder.assignExpenses()
  }

  private async findTransactions(monthYear: types.MonthYear) {
    const repo = new PersistedTransactionRepository(this.props)
    return await repo.findMany(monthYear)
  }

  private async findExpenses(monthYear: types.MonthYear) {
    const repo = new PersistedExpenseRepository(this.props)
    return await repo.findMany(monthYear)
  }
}
