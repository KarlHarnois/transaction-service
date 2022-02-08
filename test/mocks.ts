import { DataSource } from "@shared/persistence/datasource"
import { Query } from "@shared/persistence/datasource-query"
import { Mutation } from "@shared/persistence/datasource-mutation"
import { LoggableEvent, Logger } from "@shared/utils"

export class MockDataSource implements DataSource {
  queries: Query[] = []
  mutations: Mutation[] = []
  jsonObjects: any[] = []

  async performQuery(query: Query) {
    this.queries.push(query)

    return {
      items: this.jsonObjects.map((json) => {
        return { jsonObject: json }
      })
    }
  }

  async performMutation(mutation: Mutation) {
    this.mutations.push(mutation)
  }
}

export class MockLogger extends Logger {
  logEvent(event: LoggableEvent): void {}
}
