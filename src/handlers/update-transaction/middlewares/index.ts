import { MTGMiddleware } from "./mtg-middleware"
import { Middleware } from "./middleware"
import { CategoryMatcherMiddleware } from "./category-matcher-middleware"

export const allMiddlewares: Middleware[] = [
  new MTGMiddleware(),
  new CategoryMatcherMiddleware([
    {
      pattern: { fullDescription: "cafe" },
      override: { category: "FOOD", subcategory: "COFFEE" }
    },
    {
      pattern: { fullDescription: "bonjour sante" },
      override: { category: "HEALTH", subcategory: "SUBSCRIPTION" }
    },
    {
      pattern: { fullDescription: "bonjour sante" },
      override: { category: "HEALTH", subcategory: "SUBSCRIPTION" }
    },
    {
      pattern: { fullDescription: "fido" },
      override: { category: "UTILITIES", subcategory: "PHONE" }
    },
    {
      pattern: { fullDescription: "barber" },
      override: { category: "MISC", subcategory: "HAIRCUT" }
    },
    {
      pattern: { fullDescription: "communauto" },
      override: { category: "TRANSPORT", subcategory: "CAR_RENTAL" }
    },
    {
      pattern: { fullDescription: "paiement caisse" },
      override: { category: "TRANSPORT" }
    }
  ])
]
