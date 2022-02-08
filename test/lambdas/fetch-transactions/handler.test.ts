import { FetchTransactionsHandler } from "@lambdas/fetch-transactions/handler"
import * as factories from "../../factories"
import * as mocks from "../../mocks"

describe("FetchTransactionsHandler", () => {
  let subject: FetchTransactionsHandler
  let dataSource: mocks.MockDataSource

  const transactions = [
    factories.createTransaction({ id: 1234 }),
    factories.createTransaction({ id: 4567 })
  ]

  beforeEach(() => {
    const logger = new mocks.MockLogger()

    dataSource = new mocks.MockDataSource()
    dataSource.jsonObjects = transactions

    subject = new FetchTransactionsHandler({
      logger,
      dataSource,
      tableName: "testTable"
    })
  })

  describe("call", () => {
    const event = {
      queryStringParameters: {
        year: 2000,
        month: 11
      }
    }

    it("returns the correct status", async () => {
      const response = await subject.call(event)
      expect(response.statusCode).toEqual(200)
    })

    it("returns the transactions", async () => {
      const response = await subject.call(event)
      expect(JSON.parse(response.body)).toEqual({ transactions })
    })

    it("performs the correct query", async () => {
      await subject.call(event)

      expect(dataSource.queries[0].toInput()).toEqual({
        ConsistentRead: true,
        KeyConditionExpression: "PK = :partitionKey and begins_with(SK, :type)",
        ExpressionAttributeValues: {
          ":partitionKey": "2000-11",
          ":type": "txn"
        },
        TableName: "testTable"
      })
    })
  })
})
