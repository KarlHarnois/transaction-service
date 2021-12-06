import { MTGMiddleware } from "./mtg-middleware"
import { Middleware } from "./middleware"

export const allMiddlewares: Middleware[] = [
  new MTGMiddleware()
]
