import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as dynamodb from "@aws-cdk/aws-dynamodb"
import * as secretsmanager from "@aws-cdk/aws-secretsmanager"

import { FetchTransactionsLambda } from "./lambdas/fetch-transactions-lambda"
import { CreateSessionLambda } from "./lambdas/create-session-lambda"
import { UpdateTransactionLambda } from "./lambdas/update-transaction-lambda"
import { AuthorizeTokenLambda } from "./lambdas/authorize-token-lambda"
import { CreateExpenseLambda } from "./lambdas/create-expense-lambda"

export interface ApiStackProps extends core.AppProps {
  envName: string,
  table: dynamodb.Table
}

export class ApiStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)
    const api = this.createGateway(props)
    const transactionsResource = api.root.addResource("transactions")
    const tokenSecret = this.getTokenSecret()

    const authLambda = new AuthorizeTokenLambda(this, {
      tokenSecret: tokenSecret,
      api: api
    })

    const transactionLambdaProps = {
      resource: transactionsResource,
      authorizer: authLambda.authorizer,
      table: props.table,
      api: api
    }

    new FetchTransactionsLambda(this, transactionLambdaProps)
    new UpdateTransactionLambda(this, transactionLambdaProps)
    new CreateExpenseLambda(this, { tokenSecret: tokenSecret, api: api })
    new CreateSessionLambda(this, { tokenSecret: tokenSecret, api: api })
  }

  private createGateway(props: ApiStackProps) {
    const api = new apigateway.RestApi(this, "ApiGateway", {
      restApiName: `${props.envName} Transaction Service`
    })

    const key = api.addApiKey("ApiKey")

    api.addUsagePlan("UsagePlan", {
      apiKey: key,
      apiStages: [{
        api: api,
        stage: api.deploymentStage
      }]
    })

    return api
  }

  private getTokenSecret() {
    return secretsmanager.Secret
      .fromSecretNameV2(this, "AuthTokenSecret", "authTokenSecret")
      .secretValue
      .toString()
  }
}
