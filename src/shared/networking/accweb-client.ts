import * as playwright from "playwright"
import { AccwebDownloadAutomation } from "./accweb-download-automation"

import {
  AccwebTransaction,
  AccwebFinancialProduct,
  Credentials
} from "@shared/types"

export class AccwebClient {
  private readonly credentials: Credentials

  constructor(credentials: Credentials) {
    this.credentials = credentials
  }

  async fetchTransactions(
    product: AccwebFinancialProduct
  ): Promise<AccwebTransaction[]> {
    const browser = await playwright.chromium.launch({
      headless: false,
      slowMo: 300
    })

    const automation = new AccwebDownloadAutomation({
      credentials: this.credentials,
      product: product,
      browser: browser
    })

    const transactions = await automation.perform()
    await browser.close()
    return transactions
  }
}
