import * as path from "path"
import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import { Lambda } from "./lambda"

export interface AuthorizeTokenLambdaProps {
  api: apigateway.RestApi
  tokenSecret: string
}

export class AuthorizeTokenLambda extends Lambda {
  readonly authorizer

  constructor(scope: core.Construct, props: AuthorizeTokenLambdaProps) {
    super()
    const lambda = this.createLambda(scope, props)

    this.authorizer = new apigateway.TokenAuthorizer(scope, "TokenAuthorizer", {
      handler: lambda
    })
  }

  private createLambda(
    scope: core.Construct,
    props: AuthorizeTokenLambdaProps
  ) {
    return new lambdaNodejs.NodejsFunction(scope, "AuthorizeTokenLambda", {
      entry: this.handlerPath("authorize-token"),
      timeout: core.Duration.seconds(90),
      environment: {
        REGION: core.Stack.of(scope).region,
        ACCOUNT_ID: core.Stack.of(scope).account,
        API_GATEWAY_ID: props.api.restApiId,
        AUTH_TOKEN_SECRET: props.tokenSecret
      }
    })
  }
}
