import { PersistedTransactionRepository } from "@shared/persistence/transaction-repository"
import * as factories from "@test/factories"
import * as mocks from "@test/mocks"

describe("PersistedTransactionRepository", () => {
  let subject: PersistedTransactionRepository
  let dataSource: mocks.MockDataSource

  beforeEach(() => {
    dataSource = new mocks.MockDataSource()

    subject = new PersistedTransactionRepository({
      tableName: "test_table",
      dataSource: dataSource
    })
  })

  describe("find", () => {
    it("performs the correct query", async () => {
      await subject.find("txn_1234")

      expect(dataSource.queries[0].toInput()).toMatchObject({
        TableName: "test_table",
        ConsistentRead: false,
        KeyConditionExpression: "SK = :id",
        ExpressionAttributeValues: {
          ":id": "txn_1234"
        }
      })
    })

    describe("when queried transaction is not persisted yet", () => {
      beforeEach(() => {
        dataSource.jsonObjects = { txn: [] }
      })

      it("returns nothing", async () => {
        const result = await subject.find("txn_1234")
        expect(result).toBeUndefined()
      })
    })

    describe("when the queried transaction exists", () => {
      const transaction = factories.createTransaction({ id: "txn_1234" })

      beforeEach(() => {
        dataSource.jsonObjects = { txn: [transaction] }
      })

      it("returns the transaction", async () => {
        const result = await subject.find("txn_1234")
        expect(result).toEqual(transaction)
      })
    })
  })

  describe("persist", () => {
    const transaction = factories.createTransaction({
      id: "4444",
      version: undefined,
      category: "Food",
      timestamps: {
        authorizedAt: 1640482950
      }
    })

    it("performs the correct mutation", async () => {
      await subject.persist(transaction)

      expect(dataSource.mutations[0].toInput()).toMatchObject({
        TransactItems: [
          {
            Put: {
              TableName: "test_table",
              Item: {
                PK: "1970-1",
                SK: "4444",
                jsonObject: {
                  category: "Food",
                  centAmount: expect.any(Number),
                  currency: expect.any(String),
                  currencyCentAmount: expect.any(Number),
                  description: expect.any(String),
                  fullDescription: expect.any(String),
                  timestamps: {
                    authorizedAt: 1640482950
                  }
                }
              }
            }
          }
        ]
      })
    })
  })
})
