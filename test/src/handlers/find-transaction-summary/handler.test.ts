import { FindTransactionSummaryHandler } from "@handlers/find-transaction-summary/handler"
import * as queries from "@shared/persistence/datasource-query"
import * as factories from "@test/factories"
import * as mocks from "@test/mocks"

describe("FindTransactionSummaryHandler", () => {
  let subject: FindTransactionSummaryHandler
  let dataSource: mocks.MockDataSource

  beforeEach(() => {
    const logger = new mocks.MockLogger()

    dataSource = new mocks.MockDataSource()

    dataSource.jsonObjects = {
      txn: [
        factories.createTransaction({
          id: "txn_1",
          centAmount: -5000,
          category: undefined,
          subcategory: undefined
        }),
        factories.createTransaction({
          id: "txn_2",
          centAmount: 3000,
          category: "Food",
          subcategory: undefined
        }),
        factories.createTransaction({
          id: "txn_3",
          centAmount: 5050,
          category: "Food",
          subcategory: "Grocery"
        }),
        factories.createTransaction({
          id: "txn_4",
          centAmount: 1000,
          category: "Food",
          subcategory: "Grocery"
        })
      ],
      exp: [
        factories.createExpense({
          id: "exp_1",
          centAmount: 5000,
          transactionDetails: { id: "txn_3" }
        })
      ]
    }

    subject = new FindTransactionSummaryHandler({
      dataSource,
      logger,
      tableName: "testTable"
    })
  })

  describe("call", () => {
    describe("when payload is valid", () => {
      const event = {
        queryStringParameters: {
          year: 2000,
          month: 11
        }
      }

      it("returns the correct status code", async () => {
        const response = await subject.call(event)
        expect(response.statusCode).toEqual(200)
      })

      it("returns the correct summary", async () => {
        const response = await subject.call(event)

        expect(JSON.parse(response.body).transactionSummary).toEqual({
          month: 11,
          year: 2000,
          amounts: {
            food: {
              grocery: 1050,
              other: 5000
            },
            other: 0
          }
        })
      })
    })
  })
})
