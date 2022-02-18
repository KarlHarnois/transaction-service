import * as playwright from "playwright"

import {
  AccwebTransaction,
  AccwebFinancialProduct,
  Credentials,
  DefiQuestion
} from "@shared/types"

export class AccwebDownloadAutomation {
  private readonly props
  private readonly page

  private readonly QUESTION_LABEL_SELECTOR = "label[for=valeurReponse]"
  private readonly PRODUCT_TITLE_SELECTOR = ".titre-produit"

  constructor(props: {
    credentials: Credentials
    product: AccwebFinancialProduct
    page: playwright.Page
  }) {
    this.props = props
    this.page = props.page
  }

  async perform(): Promise<AccwebTransaction[]> {
    await this.gotoLogin()
    await this.fillLogin()
    await this.waitForScreenAfterLogin()

    if (!this.isProductSummary) {
      await this.answerQuestion()
    }

    await this.gotoProduct()
    const transactions = await this.waitForTransactions()
    return transactions
  }

  private async gotoLogin() {
    await this.page.goto(
      "https://accweb.mouv.desjardins.com/identifiantunique/securite-garantie/authentification/auth/manuel"
    )
  }

  private async fillLogin() {
    await this.page.fill("#codeUtilisateur", this.props.credentials.cardNumber)
    await this.page.fill("#motDePasse", this.props.credentials.password)
    await this.page.click("button[type=submit]")
  }

  private async waitForScreenAfterLogin() {
    await Promise.any([
      this.page.waitForSelector(this.QUESTION_LABEL_SELECTOR),
      this.page.waitForSelector(this.PRODUCT_TITLE_SELECTOR)
    ])
  }

  private get isProductSummary(): boolean {
    return this.page.url().includes("sommaire")
  }

  private async answerQuestion() {
    await this.page.waitForSelector(this.QUESTION_LABEL_SELECTOR)
    const label = await this.page.$(this.QUESTION_LABEL_SELECTOR)
    const labelText = await label?.textContent()
    const question = labelText?.split(":")?.pop()?.trim()

    const answer = this.props.credentials.questions.find(
      (defiQuestion: DefiQuestion) => defiQuestion.rawValue === question
    )?.answer

    await this.page.fill("#valeurReponse", answer ?? "")
    await this.page.click("button[type=submit]")
  }

  private async gotoProduct() {
    const selector = this.PRODUCT_TITLE_SELECTOR
    await this.page.waitForSelector(selector)
    let links = await this.page.$$(selector)
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

  private async waitForTransactions() {
    const response = await this.page.waitForResponse((response) => {
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
