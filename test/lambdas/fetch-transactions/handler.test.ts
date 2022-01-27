import { Handler } from "@lambdas/fetch-transactions/handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import * as factories from "../../factories"
import * as mocks from "../../mocks"

describe("Handler", () => {
  let subject: Handler
  let datasource: mocks.MockDataSource

  const transactions = [
    factories.createTransaction({ id: 1234 }),
    factories.createTransaction({ id: 4567 })
  ]

  const process = async () => {
    return await subject.process({
      queryStringParameters: {
        year: 2000,
        month: 11
      }
    })
  }

  beforeEach(() => {
    datasource = new mocks.MockDataSource()
    datasource.transactions = transactions

    const repo = new PersistedTransactionRepository({
      tableName: "test_table",
      dataSource: datasource
    })

    subject = new Handler({ repo })
  })

  it("returns the transactions", async () => {
    const result = await process()
    expect(result).toEqual(transactions)
  })

  it("performs the correct query", async () => {
    await process()

    expect(datasource.queries[0].toInput()).toEqual({
      ConsistentRead: true,
      KeyConditionExpression: "PK = :partitionKey and begins_with(SK, :type)",
      ExpressionAttributeValues: {
        ":partitionKey": "2000-11",
        ":type": "txn"
      },
      TableName: "test_table"
    })
  })
})
