export interface TransactionSource {
  name: string
  last4?: string
}

export interface Transaction {
  id: string
  description: string
  fullDescription: string
  category?: string
  subcategory?: string
  centAmount: number
  currency: string
  currencyCentAmount: number
  source: TransactionSource,
  timestamps: {
    authorizedAt: number,
    postedAt: number
  }
}

export interface Expense {
  id: string
  transactionId: string
  centAmount: number
}

export interface DefiQuestion {
  rawValue: string
  answer: string
}

export interface Credentials {
  cardNumber: string
  password: string
  questions: DefiQuestion[]
}

export interface AccwebImport {
  id: string
  number: number
}

export interface AccwebTransaction {
  identifiant: string
  numeroSequence: string
  dateInscription: string
  montantTransaction: string
  typeTransaction: string
  descriptionCourte: string
  descriptionSimplifiee: string
  dateTransaction: string
  devise: string
  numeroCarteMasque?: string
  codeRelation: string
  categorieTransaction?: string
  categorieParentTransaction?: string
  montantDevise?: string
  montantRecompense?: string
  tauxProgrammeRecompense?: string
  idCategorieTransaction?: number
  idCategorieParentTransaction?: number
  indicateurTransactionRecurrente?: boolean
  codeSousTypeTransaction?: string
  indicateurCategorieTransactionAutre?: boolean
}

export interface AccwebFinancialProduct {
  name: string
}
