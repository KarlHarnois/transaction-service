import * as jwt from "jsonwebtoken"

export interface Payload extends jwt.JwtPayload {}

export class AuthToken {
  readonly payload

  constructor(payload: Payload) {
    this.payload = payload
    if (!payload.exp) payload.exp = this.defaultExp
  }

  get expiration() {
    return this.payload.exp
  }

  get isExpired() {
    const now = new Date().getTime()
    if (this.expiration) return now > this.expiration
    return true
  }

  static decode(token: string, secret: string): AuthToken | undefined {
    const payload = jwt.verify(token, secret) as Payload

    if (payload) {
      return new AuthToken(payload)
    } else {
      return undefined
    }
  }

  encode(secret: string): string {
    return jwt.sign(this.payload, secret)
  }

  private get defaultExp() {
    const now = new Date().getTime()
    const thirtyMinutesFromNow = now + 60000 * 30
    return thirtyMinutesFromNow
  }
}
