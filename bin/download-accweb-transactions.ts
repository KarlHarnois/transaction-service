import { AccwebClient } from "@shared/networking/accweb-client"
import { AccwebTransaction } from "@shared/types"
import { env } from "@shared/utils"
import { ArgumentParser } from "@shared/argument-parser"
import * as fs from "fs"

require("dotenv").config({ path: ".envrc" })

function downloadAccwebTransactions(
  sourceName: string
): Promise<AccwebTransaction[]> {
  const client = new AccwebClient({
    cardNumber: env("DESJARDINS_CARD_NUMBER"),
    password: env("DESJARDINS_PASSWORD"),
    questions: [
      {
        rawValue:
          "Quelle est la ville/municipalité de mon premier appartement/logement?",
        answer: env("DESJARDINS_CITY_ANSWER")
      },
      {
        rawValue: "Quel est le nom de mon premier animal de compagnie?",
        answer: env("DESJARDINS_PET_ANSWER")
      },
      {
        rawValue:
          "Quel est le nom de l'école que je fréquentais à ma cinquième année du secondaire?",
        answer: env("DESJARDINS_SCHOOL_ANSWER")
      }
    ]
  })

  console.log("Fetching transactions from Accweb...")
  return client.fetchTransactions({ name: sourceName })
}

function storeTransactions(transactions: AccwebTransaction[]) {
  const dir = "./tmp"
  const json = JSON.stringify(transactions)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  console.log(`Writing ${transactions.length} to file...`)

  fs.writeFile(`${dir}/transactions.json`, json, "utf8", (err) => {
    if (err) throw err
  })

  return transactions
}

const parser = new ArgumentParser(process.argv.slice(2))
const sourceName = parser.getArgument("sourceName")

if (sourceName) {
  downloadAccwebTransactions(sourceName)
    .then(storeTransactions)
    .then((transactions) => {
      console.log(`Successfully downloaded ${transactions.length} transactions`)
    })
    .catch((err) => console.log(err.message))
} else {
  console.log("--sourceName argument not found.")
}
