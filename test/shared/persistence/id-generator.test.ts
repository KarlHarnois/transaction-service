import { IdGenerator } from "@shared/persistence/id-generator"
import * as fixtures from "../../fixtures"

describe("IdGenerator", () => {
  describe("generateId", () => {
    it("generates Accweb transaction ids", () => {
      const transaction = fixtures.accwebTransactions[0]
      const generator = new IdGenerator()
      const id = generator.generateId(transaction)
      expect(id).toEqual("txn_133591027536626244433877038067")
    })
  })
})
