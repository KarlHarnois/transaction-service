import { IdGenerator } from "@shared/persistence/id-generator"
import * as factories from "@test/factories"

describe("IdGenerator", () => {
  const subject = new IdGenerator()
  const accwebTransaction = factories.createAccwebTransaction({
    identifiant: "12345"
  })

  it("generates transaction ids", () => {
    const id = subject.generateTransactionId(accwebTransaction)
    expect(id).toEqual("txn_12345")
  })

  it("generates accweb transaction ids", () => {
    const id = subject.generateAccwebTransactionId(accwebTransaction)
    expect(id).toEqual("act_12345")
  })

  it("generates accweb import ids", () => {
    const id = subject.generateAccwebImportId(1)
    expect(id).toEqual("imp_1")
  })
})
