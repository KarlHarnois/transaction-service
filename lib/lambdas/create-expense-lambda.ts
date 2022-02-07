import * as path from "path"
import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import * as dynamodb from "@aws-cdk/aws-dynamodb"

export interface CreateExpenseLambdaProps {
  transactionByIdResource: apigateway.Resource
  tokenSecret: string
  table: dynamodb.Table
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
        AUTH_TOKEN_SECRET: props.tokenSecret,
        TABLE_NAME: props.table.tableName
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
    const resource = props.transactionByIdResource.addResource("expenses")

    return resource.addMethod("POST", integration, {
      apiKeyRequired: true
    })
  }
}
