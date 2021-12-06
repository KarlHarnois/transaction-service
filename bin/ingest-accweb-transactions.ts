import { env, chunk } from "@shared/utils"
import { AuthToken } from "@shared/auth-token"
import { TransactionServiceClient } from "@shared/networking/transaction-service-client"
import { AccwebTransaction } from "@shared/types"
import * as fs from "fs"

require("dotenv").config({ path: ".envrc" })

const sourceName = "MasterCard"

function readTransactions(): Promise<AccwebTransaction[]> {
  const filepath = "./tmp/transactions.json"

  if (!fs.existsSync(filepath)) {
    return Promise.reject(Error(`${filepath} not found`))
  }

  const data = fs.readFileSync(filepath)
  const transactions: AccwebTransaction[] = JSON.parse(data.toString())
  console.log(`Read ${transactions.length} transactions from ${filepath}`)
  return Promise.resolve(transactions)
}

async function createSingleTransaction(client: TransactionServiceClient, transaction: AccwebTransaction) {
  try {
    await client.updateTransaction({
      type: "accweb",
      sourceName: sourceName,
      transaction: transaction
    })
    process.stdout.write(".")
    return { type: "transaction" }
  } catch {
    process.stdout.write("x")
    return { type: "error" }
  }
}

function aggregateResults(results: { type: string }[]) {
  let counts = { transactions: 0, errors: 0 }

  results.forEach(result => {
    if (result.type === "transaction") {
      counts.transactions += 1
    } else {
      counts.errors += 1
    }
  })

  return counts
}

async function createManyTransactions(transactions: AccwebTransaction[]) {
  const secret = env("AUTH_TOKEN_SECRET")
  const apiKey = env("API_KEY")
  const token = new AuthToken({}).encode(secret)

  const client = new TransactionServiceClient({
    baseUrl: env("TRANSACTION_SERVICE_URL"),
    authToken: token,
    apiKey: apiKey
  })

  console.log(`Pushing ${transactions.length} transactions to the transaction service...`)

  let allResults: { type: string }[] = []

  const transactionBatches = chunk({ elements: transactions, size: 10 })

  for (const batch of transactionBatches) {
    const batchResults = await Promise.all(batch.map(async transaction => {
      return createSingleTransaction(client, transaction)
    }))
    batchResults.forEach(res => allResults.push(res))
  }
  console.log("\n")
  return aggregateResults(allResults)
}

readTransactions()
  .then(createManyTransactions)
  .then(counts => {
    console.log(`Created ${counts.transactions} transactions with ${counts.errors} errors`)
  })
  .catch(err => console.log(err.message))
