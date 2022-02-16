import { MTGMiddleware } from "./mtg-middleware"
import { Middleware } from "./middleware"
import { PatternMatcherMiddleware } from "./pattern-matcher-middleware"

export const allMiddlewares: Middleware[] = [
  new MTGMiddleware(),
  new PatternMatcherMiddleware([
    {
      patterns: { fullDescription: "cafe|coffee" },
      override: { category: "FOOD", subcategory: "COFFEE" }
    },
    {
      patterns: { fullDescription: "bonjour sante" },
      override: { category: "HEALTH", subcategory: "SUBSCRIPTION" }
    },
    {
      patterns: { fullDescription: "bonjour sante" },
      override: { category: "HEALTH", subcategory: "SUBSCRIPTION" }
    },
    {
      patterns: { fullDescription: "fido" },
      override: { category: "UTILITIES", subcategory: "PHONE" }
    },
    {
      patterns: { fullDescription: "barber" },
      override: { category: "MISC", subcategory: "HAIRCUT" }
    },
    {
      patterns: { fullDescription: "communauto" },
      override: { category: "TRANSPORT", subcategory: "CAR_RENTAL" }
    },
    {
      patterns: { fullDescription: "paiement caisse" },
      override: { category: "TRANSPORT" }
    }
  ])
]
