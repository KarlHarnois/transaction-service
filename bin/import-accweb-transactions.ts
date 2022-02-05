import { env, chunk } from "@shared/utils"
import { AuthToken } from "@shared/auth-token"
import { TransactionServiceClient } from "@shared/networking/transaction-service-client"
import { AccwebTransaction, Transaction } from "@shared/types"
import { ImportValidator } from "@shared/validation/import-validator"
import * as fs from "fs"

require("dotenv").config({ path: ".envrc" })

const sourceName = "MasterCard"

interface Summary {
  successes: SuccessResult[]
  errors: ErrorResult[]
}

type Result = SuccessResult | ErrorResult

interface SuccessResult {
  transaction: Transaction
}

interface ErrorResult {
  error: Error
  accwebIdentifier: string
}

function isSuccess(result: Result): result is SuccessResult {
  return (result as SuccessResult).transaction !== undefined
}

function isError(result: Result): result is ErrorResult {
  return (result as ErrorResult).error !== undefined
}

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

async function createSingleTransaction(client: TransactionServiceClient, transaction: AccwebTransaction): Promise<Result> {
  try {
    const response = await client.updateTransaction({
      type: "accweb",
      sourceName: sourceName,
      transaction: transaction
    })
    process.stdout.write(".")

    return { transaction: response.transaction }
  } catch (error) {
    process.stdout.write("x")

    return {
      error: (error as Error),
      accwebIdentifier: transaction.identifiant
    }
  }
}

function aggregateResults(results: Result[]) {
  let summary: Summary = {
    successes: [],
    errors: []
  }

  results.forEach(result => {
    if (isError(result)) {
      summary.errors.push(result)
    } else if (isSuccess(result)) {
      summary.successes.push(result)
    } else {
      console.log(`Something unexpected happened: ${result}`)
    }
  })

  return summary
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

  let allResults: Result[] = []

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
  .then(summary => {
    console.log(`Created ${summary.successes.length} transactions with ${summary.errors.length} errors`)

    summary.errors.forEach((error) => {
      console.log(`Error for transaction ${error.accwebIdentifier}: ${error.error}`)
    })

    const output = new ImportValidator()
      .validate(summary.successes.flatMap(s => s.transaction))
      .errors
      .forEach(error => console.log(error.message))
  })
  .catch(err => console.log(err.message))
