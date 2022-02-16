import { SchemaValidator } from "@shared/schema-validator"
import * as factories from "@test/factories"

describe("SchemaValidator", () => {
  let subject: SchemaValidator

  beforeAll(() => {
    subject = new SchemaValidator()
  })

  describe("validate", () => {
    describe("when data is invalid", () => {
      it("throws an error", () => {
        const args = { definition: "Monkey", data: { foo: "bar" } }
        const func = () => subject.validate(args)
        const error = new Error("Schema definition for type Monkey not found.")
        expect(func).toThrow(error)
      })
    })

    describe("when data is valid", () => {
      const data = factories.createTransaction({})

      it("does not throw an error", () => {
        const func = () => subject.validate({ definition: "Transaction", data })
        expect(func).not.toThrow()
      })
    })

    describe("when data is invalid", () => {
      const data = { foo: "bar" }

      it("throws an error", () => {
        const func = () => subject.validate({ definition: "Transaction", data })
        expect(func).toThrow()
      })
    })
  })
})
