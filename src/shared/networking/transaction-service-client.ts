import { AccwebTransaction, Transaction } from "@shared/types"
import fetch, { Response } from "node-fetch"
import * as types from "@shared/types"

export interface UpdateTransactionResponse {
  transaction: Transaction
}

export class TransactionServiceClient {
  private readonly props

  constructor(props: { baseUrl: string; authToken: string; apiKey: string }) {
    this.props = props
  }

  updateTransaction(
    payload: types.UpdateTransactionPayload
  ): Promise<UpdateTransactionResponse> {
    return fetch(`${this.props.baseUrl}/transactions`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: this.props.authToken,
        "x-api-key": this.props.apiKey
      }
    })
      .then(this.validateResponse)
      .then((res) => res.json())
      .then((json) => json as UpdateTransactionResponse)
  }

  private async validateResponse(response: Response): Promise<Response> {
    const status = response.status

    if (status < 200 || status > 299) {
      const body = await response.json()
      const bodyString = JSON.stringify(body)
      throw new Error(
        `Request failed with status: ${status}, body: ${bodyString}`
      )
    }
    return Promise.resolve(response)
  }
}
