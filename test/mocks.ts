import { DataSource } from "@shared/persistence/datasource"
import { Query } from "@shared/persistence/datasource-query"
import { Mutation } from "@shared/persistence/datasource-mutation"
import { Transaction } from "@shared/types"

export class MockDataSource implements DataSource {
  queries: Query[] = []
  mutations: Mutation[] = []
  transactions: Transaction[] = []

  async performQuery(query: Query) {
    this.queries.push(query)

    return {
      items: this.transactions.map(transaction => {
        return { jsonObject: transaction }
      })
    }
  }

  async performMutation(mutation: Mutation) {
    this.mutations.push(mutation)
  }
}
