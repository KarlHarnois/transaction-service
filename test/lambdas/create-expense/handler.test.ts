import { CreateExpenseHandler } from "@lambdas/create-expense/handler"
import * as factories from "../../factories"
import * as queries from "@shared/persistence/datasource-query"
import * as mutations from "@shared/persistence/datasource-mutation"
import * as mocks from "../../mocks"

describe("CreateExpenseHandler", () => {
  let subject: CreateExpenseHandler
  let dataSource: mocks.MockDataSource

  beforeEach(() => {
    const logger = new mocks.MockLogger()
    dataSource = new mocks.MockDataSource()
    subject = new CreateExpenseHandler({
      dataSource,
      logger,
      tableName: "testTable"
    })
  })

  describe("call", () => {
    describe("when payload is absent", () => {
      const event = {
        pathParameters: {
          id: "txn_123456"
        }
      }

      it("returns the correct status code", async () => {
        const response = await subject.call(event)
        expect(response.statusCode).toEqual(500)
      })

      it("returns the correct error message", async () => {
        const response = await subject.call(event)
        const body = JSON.parse(response.body)
        expect(body).toEqual({ error: { message: "Payload not found." } })
      })
    })

    describe("when payload is valid", () => {
      const event = {
        pathParameters: {
          id: "txn_123456"
        },
        body: JSON.stringify({
          expense: {
            centAmount: 5000
          }
        })
      }

      describe("when transaction does not exist", () => {
        it("returns the correct status code", async () => {
          const response = await subject.call(event)
          expect(response.statusCode).toEqual(500)
        })

        it("returns the correct error message", async () => {
          const response = await subject.call(event)
          const body = JSON.parse(response.body)
          expect(body).toEqual({
            error: { message: "Transaction with id txn_123456 not found." }
          })
        })

        it("performs the correct query", async () => {
          await subject.call(event)
          const expected = new queries.FindSingleTransaction({
            id: "txn_123456",
            tableName: "testTable"
          })
          expect(dataSource.queries).toEqual([expected])
        })
      })

      describe("when transaction exists", () => {
        const expense = expect.objectContaining({
          id: expect.stringContaining("exp_"),
          centAmount: 5000,
          transactionDetails: {
            id: "txn_123456",
            authorizedAt: 1640304000000
          }
        })

        beforeEach(() => {
          const timestamps = { authorizedAt: 1640304000000 }
          const transaction = factories.createTransaction({
            id: "txn_123456",
            timestamps
          })
          dataSource.jsonObjects = { txn: [transaction] }
        })

        it("returns the correct status code", async () => {
          const response = await subject.call(event)
          expect(response.statusCode).toEqual(201)
        })

        it("creates an expense", async () => {
          await subject.call(event)
          const expected = new mutations.PersistExpense({
            tableName: "testTable",
            expense
          })
          expect(dataSource.mutations).toEqual([expected])
        })

        it("returns the created expense", async () => {
          const response = await subject.call(event)
          const body = JSON.parse(response.body)
          expect(body).toEqual({ expense })
        })
      })
    })
  })
})
