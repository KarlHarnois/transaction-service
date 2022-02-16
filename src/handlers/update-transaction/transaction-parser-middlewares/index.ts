import { MTGMiddleware } from "./mtg-middleware"
import { Middleware } from "./middleware"
import { KeywordMapMiddleware } from "./keyword-map-middleware"

export const allMiddlewares: Middleware[] = [
  new MTGMiddleware(),

  new KeywordMapMiddleware({
    cafe: { category: "FOOD", subcategory: "COFFEE" },
    coffee: { category: "FOOD", subcategory: "COFFEE" },
    "bonjour sante": { category: "HEALTH", subcategory: "SUBSCRIPTION" },
    fido: { category: "UTILITIES", subcategory: "PHONE" },
    barber: { category: "MISC", subcategory: "HAIRCUT" },
    communauto: { category: "TRANSPORT", subcategory: "CAR_RENTAL" },
    "paiement caisse": { category: "TRANSFER" }
  })
]
