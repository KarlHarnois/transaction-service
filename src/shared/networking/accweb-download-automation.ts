import * as playwright from "playwright"

import {
  AccwebTransaction,
  AccwebFinancialProduct,
  Credentials,
  DefiQuestion
} from "@shared/types"

export class AccwebDownloadAutomation {
  private readonly props
  private readonly browser

  private readonly QUESTION_LABEL_SELECTOR = "label[for=valeurReponse]"
  private readonly PRODUCT_TITLE_SELECTOR = ".titre-produit"

  constructor(props: {
    credentials: Credentials
    product: AccwebFinancialProduct
    browser: playwright.ChromiumBrowser
  }) {
    this.props = props
    this.browser = props.browser
  }

  async perform(): Promise<AccwebTransaction[]> {
    const page = await this.browser.newPage()
    await this.gotoLogin(page)
    await this.fillLogin(page)
    await this.waitForScreenAfterLogin(page)

    if (!this.isProductSummary(page)) {
      await this.answerQuestion(page)
    }

    await this.gotoProduct(page)
    const transactions = await this.waitForTransactions(page)
    return transactions
  }

  private async gotoLogin(page: playwright.Page) {
    await page.goto(
      "https://accweb.mouv.desjardins.com/identifiantunique/securite-garantie/authentification/auth/manuel"
    )
  }

  private async fillLogin(page: playwright.Page) {
    await page.fill("#codeUtilisateur", this.props.credentials.cardNumber)
    await page.fill("#motDePasse", this.props.credentials.password)
    await page.click("button[type=submit]")
  }

  private async waitForScreenAfterLogin(page: playwright.Page) {
    await Promise.any([
      page.waitForSelector(this.QUESTION_LABEL_SELECTOR),
      page.waitForSelector(this.PRODUCT_TITLE_SELECTOR)
    ])
  }

  private isProductSummary(page: playwright.Page): boolean {
    return page.url().includes("sommaire")
  }

  private async answerQuestion(page: playwright.Page) {
    await page.waitForSelector(this.QUESTION_LABEL_SELECTOR)
    const label = await page.$(this.QUESTION_LABEL_SELECTOR)
    const labelText = await label?.textContent()
    const question = labelText?.split(":")?.pop()?.trim()

    const answer = this.props.credentials.questions.find(
      (defiQuestion: DefiQuestion) => defiQuestion.rawValue === question
    )?.answer

    await page.fill("#valeurReponse", answer ?? "")
    await page.click("button[type=submit]")
  }

  private async gotoProduct(page: playwright.Page) {
    const selector = this.PRODUCT_TITLE_SELECTOR
    await page.waitForSelector(selector)
    let links = await page.$$(selector)
    let matchingLinks = []

    for (const link of links) {
      const isProduct = await this.isProductLink(link)

      if (isProduct) {
        matchingLinks.push(link)
      }
    }

    const link = matchingLinks[matchingLinks.length - 1]

    if (link) {
      await link.click()
    } else {
      console.log(`Could not find link for ${this.product.name}.`)
    }
  }

  private async isProductLink(
    link: playwright.ElementHandle<SVGElement | HTMLElement>
  ) {
    const text = await link.textContent()
    const productName = this.product.name.toLowerCase()
    return text?.toLowerCase().includes(productName) ?? false
  }

  private async waitForTransactions(page: playwright.Page) {
    const response = await page.waitForResponse((response) => {
      return response
        .url()
        .includes(
          "/api/distribution-libreservice/dossier-operation/operations/v3/transactions"
        )
    })
    const body = await response.body()
    const json = JSON.parse(body.toString())
    return json.sectionFacturee.transactionListe
  }

  private get product() {
    return this.props.product
  }
}
