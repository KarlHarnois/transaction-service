import * as path from "path"
import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"

export interface AuthorizeTokenLambdaProps {
  api: apigateway.RestApi
  tokenSecret: string
}

export class AuthorizeTokenLambda {
  readonly authorizer

  constructor(scope: core.Construct, props: AuthorizeTokenLambdaProps) {
    const lambda = this.createLambda(scope, props)

    this.authorizer = new apigateway.TokenAuthorizer(scope, "TokenAuthorizer", {
      handler: lambda
    })
  }

  private createLambda(scope: core.Construct, props: AuthorizeTokenLambdaProps) {
    return new lambdaNodejs.NodejsFunction(scope, 'AuthorizeTokenLambda', {
      entry: `${path.resolve(__dirname)}/../../src/lambdas/authorize-token/handler.ts`,
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
