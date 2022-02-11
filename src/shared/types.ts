export interface MonthYear {
  month: number
  year: number
}

export const ALL_CATEGORIES = [
  "FOOD",
  "ENTERTAINMENT",
  "HOUSING",
  "HEALTH",
  "TRANSPORT",
  "UTILITIES",
  "MISC"
] as const

export const ALL_SUBCATEGORIES = [
  "GROCERY",
  "RESTAURANT",
  "FURNITURE",
  "ALCOOL",
  "PHARMACY",
  "CLOTHING",
  "HEALTHCARE",
  "SUBSCRIPTION",
  "COFFEE",
  "PHONE",
  "MTG",
  "HAIRCUT"
] as const

export type Category = typeof ALL_CATEGORIES[number]
export type Subcategory = typeof ALL_SUBCATEGORIES[number]

export interface TransactionSource {
  name: string
  last4?: string
}

export interface Transaction {
  id: string
  description: string
  fullDescription: string
  category?: Category
  subcategory?: Subcategory
  centAmount: number
  currency: string
  currencyCentAmount: number
  source: TransactionSource
  timestamps: {
    authorizedAt: number
    postedAt: number
  }
}

export interface TransactionWithExpense extends Transaction {
  centAmountWithExpenses: number
  expenses: Expense[]
}

export interface Expense {
  id: string
  centAmount: number
}

export interface ExpenseWithTransactionDetails extends Expense {
  transactionDetails: {
    id: string
    authorizedAt: number
  }
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

export interface TransactionSummary {
  month: number
  year: number
  centAmounts: any
}
