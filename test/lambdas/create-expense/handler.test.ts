import { CreateExpenseHandler } from "@lambdas/create-expense/handler"
import * as queries from "@shared/persistence/datasource-query"
import * as mocks from "../../mocks"

describe("CreateExpenseHandler", () => {
  let subject: CreateExpenseHandler
  let dataSource: mocks.MockDataSource

  beforeEach(() => {
    const logger = new mocks.MockLogger()
    dataSource = new mocks.MockDataSource()
    subject = new CreateExpenseHandler({ dataSource, logger, tableName: "testTable" })
  })

  describe("call", () => {
    describe("when payload is valid", () => {
      const event = {
        body: JSON.stringify({
          expense: {
            transactionId: "txn_123456",
            centAmount: 5000
          }
        })
      }

      describe("when transaction does not exits", () => {
        it("returns the correct status code", async () => {
          const response = await subject.call(event)
          expect(response.statusCode).toEqual(500)
        })

        it("returns the correct error message", async () => {
          const response = await subject.call(event)
          const body = JSON.parse(response.body)
          expect(body).toEqual({ error: { message: "Transaction with id txn_123456 not found." }})
        })

        it("performs the correct query", async () => {
          await subject.call(event)
          const expected = new queries.FindSingleTransaction({ id: "txn_123456", tableName: "testTable" })
          expect(dataSource.queries).toEqual([expected])
        })
      })

      describe("when transaction exists", () => {
        beforeEach(() => {
          dataSource.jsonObjects = [{ id: "txn_123456" }]
        })

        it("returns the correct status code", async () => {
          const response = await subject.call(event)
          expect(response.statusCode).toEqual(201)
        })

        it("creates an expense", async () => {
        })

        it("returns the created expense", async () => {
        })
      })
    })
  })
})
