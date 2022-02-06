import { FetchTransactionsHandler } from "@lambdas/fetch-transactions/handler"
import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import * as factories from "../../factories"
import * as mocks from "../../mocks"

describe("FetchTransactionHandler", () => {
  let subject: FetchTransactionsHandler
  let datasource: mocks.MockDataSource

  const transactions = [
    factories.createTransaction({ id: 1234 }),
    factories.createTransaction({ id: 4567 })
  ]

  const processEvent = async () => {
    return await subject.processEvent({
      queryParams: {
        year: 2000,
        month: 11
      }
    })
  }

  beforeEach(() => {
    datasource = new mocks.MockDataSource()
    datasource.transactions = transactions

    const logger = new mocks.MockLogger()
    const repo = new PersistedTransactionRepository({
      tableName: "test_table",
      dataSource: datasource
    })

    subject = new FetchTransactionsHandler({ logger, repo })
  })

  it("returns the correct status", async () => {
    const response = await processEvent()
    expect(response.statusCode).toEqual(200)
  })

  it("returns the transactions", async () => {
    const response = await processEvent()
    expect(JSON.parse(response.body).transactions).toEqual(transactions)
  })

  it("performs the correct query", async () => {
    await processEvent()

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
