import * as types from "@shared/types"

export const categoryMap: { [key: string]: types.Category } = {
  Alimentation: "FOOD",
  Loisirs: "ENTERTAINMENT",
  Habitation: "HOUSING",
  Santé: "HEALTH",
  Transport: "TRANSPORT"
}

export const subcategoryMap: { [key: string]: types.Subcategory } = {
  Épicerie: "GROCERY",
  Restaurants: "RESTAURANT",
  "Mobilier et décoration": "FURNITURE",
  "Boissons alcoolisées": "ALCOOL",
  "Pharmacie/Médicaments": "PHARMACY",
  Vêtements: "CLOTHING",
  "Soins médicaux": "HEALTHCARE"
}
