import * as path from "path"
import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"

export interface CreateExpenseLambdaProps {
  tokenSecret: string
  api: apigateway.RestApi
}

export class CreateExpenseLambda {
  constructor(scope: core.Construct, props: CreateExpenseLambdaProps) {
    const lambda = this.createLambda(scope, props)
    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
  }

  private createLambda(scope: core.Construct, props: CreateExpenseLambdaProps) {
    return new lambdaNodejs.NodejsFunction(scope, "CreateExpenseLambda", {
      entry: `${path.resolve(__dirname)}/../../src/lambdas/create-expense/handler.ts`,
      timeout: core.Duration.seconds(90),
      environment: {
        AUTH_TOKEN_SECRET: props.tokenSecret
      }
    })
  }

  private createIntegration(lambda: lambdaNodejs.NodejsFunction) {
    return new apigateway.LambdaIntegration(lambda, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    })
  }

  private createMethod(integration: apigateway.Integration, props: CreateExpenseLambdaProps) {
    const resource: apigateway.Resource = props.api.root.addResource("expenses")
    return resource.addMethod("POST", integration, {
      apiKeyRequired: true
    })
  }
}
