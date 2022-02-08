import { FetchTransactionsHandler } from "@lambdas/fetch-transactions/handler"
import * as factories from "../../factories"
import * as mocks from "../../mocks"

describe("FetchTransactionsHandler", () => {
  let subject: FetchTransactionsHandler
  let dataSource: mocks.MockDataSource

  const transactions = [
    factories.createTransaction({ id: "txn_1" }),
    factories.createTransaction({ id: "txn_2" })
  ]

  const expenses = [
    factories.createExpense({
      id: "exp_1",
      transactionDetails: { id: "txn_2" }
    }),
    factories.createExpense({
      id: "exp_2",
      transactionDetails: { id: "txn_2" }
    })
  ]

  beforeEach(() => {
    const logger = new mocks.MockLogger()

    dataSource = new mocks.MockDataSource()
    dataSource.jsonObjects = { txn: transactions, exp: expenses }

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

    it("returns the transactions, including the expenses", async () => {
      const response = await subject.call(event)

      expect(JSON.parse(response.body)).toEqual({
        transactions: [
          expect.objectContaining({
            id: "txn_1",
            expenses: []
          }),
          expect.objectContaining({
            id: "txn_2",
            expenses: [
              expect.objectContaining({ id: "exp_1" }),
              expect.objectContaining({ id: "exp_2" })
            ]
          })
        ]
      })
    })

    it("performs the correct transaction query", async () => {
      await subject.call(event)

      expect(dataSource.queries[0].toInput()).toEqual(
        expect.objectContaining({
          TableName: "testTable",
          ExpressionAttributeValues: {
            ":partitionKey": "2000-11",
            ":type": "txn"
          }
        })
      )
    })

    it("performs the correct expense query", async () => {
      await subject.call(event)

      expect(dataSource.queries[1].toInput()).toEqual(
        expect.objectContaining({
          TableName: "testTable",
          ExpressionAttributeValues: {
            ":partitionKey": "2000-11",
            ":type": "exp"
          }
        })
      )
    })
  })
})
