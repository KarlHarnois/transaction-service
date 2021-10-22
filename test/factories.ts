import * as types from "@shared/types"

export function createTransaction(attributes: any): types.Transaction {
  return {
    id: "id",
    description: "description",
    fullDescription: "full_description",
    centAmount: 1000,
    currency: "CAD",
    currencyCentAmount: 1000,
    source: {
      name: "source_name"
    },
    timestamps: {
      postedAt: Date.now()
    },
    ...attributes
  }
}
