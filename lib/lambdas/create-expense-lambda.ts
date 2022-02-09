import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import * as dynamodb from "@aws-cdk/aws-dynamodb"
import { Lambda } from "./lambda"

export interface CreateExpenseLambdaProps {
  transactionByIdResource: apigateway.Resource
  authorizer: apigateway.Authorizer
  table: dynamodb.Table
  tokenSecret: string
}

export class CreateExpenseLambda extends Lambda {
  constructor(scope: core.Construct, props: CreateExpenseLambdaProps) {
    super()

    const lambda = this.createLambda({
      scope,
      construct: "CreateExpenseLambda",
      handler: "create-expense",
      env: {
        AUTH_TOKEN_SECRET: props.tokenSecret,
        TABLE_NAME: props.table.tableName
      }
    })

    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
    props.table.grantReadWriteData(lambda)
  }

  private createIntegration(lambda: lambdaNodejs.NodejsFunction) {
    return new apigateway.LambdaIntegration(lambda, {
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    })
  }

  private createMethod(
    integration: apigateway.Integration,
    props: CreateExpenseLambdaProps
  ) {
    const resource = props.transactionByIdResource.addResource("expenses")

    return resource.addMethod("POST", integration, {
      authorizer: props.authorizer,
      apiKeyRequired: true
    })
  }
}
