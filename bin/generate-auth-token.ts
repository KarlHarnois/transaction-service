import { AuthToken } from "../src/shared/auth-token"
import { env } from "@shared/utils"

require("dotenv").config({ path: ".envrc" })

try {
  const secret = env("AUTH_TOKEN_SECRET")
  const token = new AuthToken({}).encode(secret)
  console.log(token)
} catch (error) {
  console.log((<Error>error).message)
}
