import { DataSource } from "@shared/persistence/datasource"
import { Query } from "@shared/persistence/datasource-query"
import { Mutation } from "@shared/persistence/datasource-mutation"
import { LoggableEvent, Logger } from "@shared/utils"

export class MockDataSource implements DataSource {
  queries: Query[] = []
  mutations: Mutation[] = []
  jsonObjects: { [type: string]: any[] } = {}

  async performQuery(query: Query) {
    this.queries.push(query)
    const type = this.itemType(query)

    if (type) {
      const objects = this.jsonObjects[type] ?? []

      return {
        items: objects.map((json) => {
          return { jsonObject: json }
        })
      }
    } else {
      return { items: [] }
    }
  }

  async performMutation(mutation: Mutation) {
    this.mutations.push(mutation)
  }

  private itemType(query: Query): string | undefined {
    const attributes = query.toInput().ExpressionAttributeValues ?? {}
    const type = attributes[":type"] ?? this.typeForId(attributes[":id"])
    return type ? type : undefined
  }

  private typeForId(id?: string): string | undefined {
    return id ? id.substring(0, 3) : undefined
  }
}

export class MockLogger extends Logger {
  logEvent(event: LoggableEvent): void {}
}
