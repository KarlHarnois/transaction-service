import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import * as dynamodb from "@aws-cdk/aws-dynamodb"
import { Lambda } from "./lambda"

export interface UpdateTransactionLambdaProps {
  resource: apigateway.Resource
  authorizer: apigateway.Authorizer
  api: apigateway.RestApi
  table: dynamodb.Table
}

export class UpdateTransactionLambda extends Lambda {
  constructor(scope: core.Construct, props: UpdateTransactionLambdaProps) {
    super()

    const lambda = this.createLambda({
      scope,
      construct: "UpdateTransactionLambda",
      handler: "update-transaction",
      env: {
        TABLE_NAME: props.table.tableName
      }
    })

    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
    props.table.grantReadWriteData(lambda)
  }

  private createMethod(
    integration: apigateway.Integration,
    props: UpdateTransactionLambdaProps
  ) {
    return props.resource.addMethod("PUT", integration, {
      authorizer: props.authorizer,
      apiKeyRequired: true
    })
  }
}
