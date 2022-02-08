import * as types from "@shared/types"

export function createTransaction(attributes: any): types.Transaction {
  return {
    id: "txn_12345",
    description: "description",
    fullDescription: "full_description",
    centAmount: 1000,
    currency: "CAD",
    currencyCentAmount: 1000,
    source: {
      name: "source_name"
    },
    timestamps: {
      authorizedAt: Date.now()
    },
    ...attributes
  }
}

export function createAccwebTransaction(
  attributes: any
): types.AccwebTransaction {
  return {
    identifiant: "id",
    numeroSequence: "1",
    dateInscription: "2021-09-16",
    montantTransaction: "150.26",
    typeTransaction: "Achat",
    descriptionCourte: "RB - EPICERIE 1111 - Full desc",
    descriptionSimplifiee: "Rb - Epicerie 1111",
    dateTransaction: "2021-09-15T17:50:07Z",
    devise: "CAD",
    numeroCarteMasque: "2121 21** **** 0000",
    montantRecompense: "0.43",
    tauxProgrammeRecompense: "2.00",
    codeRelation: "P",
    categorieTransaction: "Épicerie",
    categorieParentTransaction: "Alimentation",
    idCategorieTransaction: 4,
    idCategorieParentTransaction: 1,
    montantDevise: "150.26",
    indicateurTransactionRecurrente: false,
    codeSousTypeTransaction: "TR-ACHAT",
    indicateurCategorieTransactionAutre: false,
    ...attributes
  }
}

export function createExpense(attributes: any): types.Expense {
  return {
    id: "exp_12345",
    centAmount: 1000,
    transactionDetails: {
      id: "transactionId",
      authorizedAt: Date.now()
    },
    ...attributes
  }
}
