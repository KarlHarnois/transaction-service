import { MTGMiddleware } from "./mtg-middleware"
import { Middleware } from "./middleware"
import { CoffeeMiddleware } from "./coffee-middleware"

export const allMiddlewares: Middleware[] = [
  new MTGMiddleware(),
  new CoffeeMiddleware()
]
