import { AccwebTransaction } from "@shared/types"

export const accwebTransactions: AccwebTransaction[] = [
  {
    "identifiant": "id-1",
    "numeroSequence": "1",
    "dateInscription": "2021-09-16",
    "montantTransaction": "150.26",
    "typeTransaction": "Achat",
    "descriptionCourte": "RB - EPICERIE 1111 - Full desc",
    "descriptionSimplifiee": "Rb - Epicerie 1111",
    "dateTransaction": "2021-09-15T17:50:07Z",
    "devise": "CAD",
    "numeroCarteMasque": "2121 21** **** 0000",
    "montantRecompense": "0.43",
    "tauxProgrammeRecompense": "2.00",
    "codeRelation": "P",
    "categorieTransaction": "Épicerie",
    "categorieParentTransaction": "Alimentation",
    "idCategorieTransaction": 4,
    "idCategorieParentTransaction": 1,
    "montantDevise": "150.26",
    "indicateurTransactionRecurrente": false,
    "codeSousTypeTransaction": "TR-ACHAT",
    "indicateurCategorieTransactionAutre": false
  },
  {
    "identifiant": "id-2",
    "numeroSequence": "2",
    "dateInscription": "2021-10-22",
    "montantTransaction": "66.66",
    "typeTransaction": "AutreAutorisation",
    "descriptionCourte": "CENTRE DE JEUX EXPEDIT - Full desc",
    "descriptionSimplifiee": "Centre De Jeux Expedit",
    "dateTransaction": "2021-10-20T20:02:43Z",
    "devise": "CAD",
    "numeroCarteMasque": "2121 21** **** 0000",
    "codeRelation": "P"
  }
]
