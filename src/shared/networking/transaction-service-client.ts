import { AccwebTransaction, Transaction } from "@shared/types"
import fetch, { Response } from "node-fetch"

export interface TransactionUpdatePayload {
  type: string
}

export interface AccwebUpdatePayload extends TransactionUpdatePayload {
  sourceName: string
  transaction: AccwebTransaction
}

export class TransactionServiceClient {
  private readonly props

  constructor(props: {
    baseUrl: string,
    authToken: string,
    apiKey: string
  }) {
    this.props = props
  }

  updateTransaction(payload: AccwebUpdatePayload): Promise<Transaction[]> {
    return fetch(`${this.props.baseUrl}/transactions`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.props.authToken,
        "x-api-key": this.props.apiKey
      }
    })
    .then(this.validateResponse)
    .then(res => res.json())
    .then(json => json as Transaction[])
  }

  private async validateResponse(response: Response): Promise<Response> {
    const status = response.status

    if (status < 200 || status > 299) {
      const body = await response.json()
      const bodyString = JSON.stringify(body)
      throw new Error(`Request failed with status: ${status}, body: ${bodyString}`)
    }
    return Promise.resolve(response)
  }
}
