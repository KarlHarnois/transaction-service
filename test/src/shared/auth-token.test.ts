import { AuthToken, Payload } from "@shared/auth-token"

describe("AuthToken", () => {
  const secret = "123456"

  describe("encode", () => {
    function decodedExp(payload: Payload) {
      const token = new AuthToken(payload)
      const encoded = token.encode(secret)
      const decodedToken = AuthToken.decode(encoded, secret)
      return decodedToken?.payload.exp || 0
    }

    describe("when expiration is not defined", () => {
      it("uses the correct default", () => {
        const now = new Date().getTime()
        const exp = decodedExp({})

        expect(exp - now).toBeGreaterThan(28 * 60000)
        expect(exp - now).toBeLessThan(32 * 60000)
      })
    })

    describe("when expiration is defined", () => {
      it("uses the provided expiration", () => {
        const now = new Date().getTime()
        const exp = decodedExp({ exp: now })

        expect(exp).toEqual(now)
      })
    })
  })

  describe("isExpired", () => {
    describe("when expiration is in the future", () => {
      it("returns false", () => {
        const now = new Date().getTime()
        const future = now + 30 * 60000
        const token = new AuthToken({ exp: future })
        expect(token.isExpired).toEqual(false)
      })
    })

    describe("when expiration is in the past", () => {
      it("returns true", () => {
        const now = new Date().getTime()
        const past = now - 100000
        const token = new AuthToken({ exp: past })
        expect(token.isExpired).toEqual(true)
      })
    })
  })
})
