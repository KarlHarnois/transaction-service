import { Lambda } from "@lib/lambdas/lambda"

describe("Lambda", () => {
  let subject: Lambda

  beforeEach(() => {
    subject = new Lambda()
  })

  describe("handlerPath", () => {
    it("returns the correct path", () => {
      const actual = subject.handlerPath("create-user")
      const expected = "/lib/lambdas/../../src/handlers/create-user/handler.ts"
      expect(actual).toEqual(expect.stringContaining(expected))
    })
  })
})
