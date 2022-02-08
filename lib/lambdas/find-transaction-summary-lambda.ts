import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import * as dynamodb from "@aws-cdk/aws-dynamodb"
import { Lambda } from "./lambda"

export interface FindTransactionSummaryLambdaProps {
  authorizer: apigateway.Authorizer
  api: apigateway.RestApi
  table: dynamodb.Table
}

export class FindTransactionSummaryLambda extends Lambda {
  constructor(scope: core.Construct, props: FindTransactionSummaryLambdaProps) {
    super()
    const lambda = this.createLambda(scope, props)
    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
    props.table.grantReadData(lambda)
  }

  private createLambda(
    scope: core.Construct,
    props: FindTransactionSummaryLambdaProps
  ) {
    return new lambdaNodejs.NodejsFunction(
      scope,
      "FindTransactionSummaryLambda",
      {
        entry: this.handlerPath("find-transaction-summary"),
        timeout: core.Duration.seconds(90),
        memorySize: 1024,
        environment: {
          TABLE_NAME: props.table.tableName
        }
      }
    )
  }

  private createIntegration(lambda: lambdaNodejs.NodejsFunction) {
    return new apigateway.LambdaIntegration(lambda, {
      requestParameters: {
        "integration.request.querystring.year": this.yearQueryParam,
        "integration.request.querystring.month": this.monthQueryParam
      },
      requestTemplates: {
        "application/json": '{ "statusCode": "200" }'
      }
    })
  }

  private createMethod(
    integration: apigateway.Integration,
    props: FindTransactionSummaryLambdaProps
  ) {
    const resource = props.api.root.addResource("transaction_summaries")

    return resource.addMethod("GET", integration, {
      authorizer: props.authorizer,
      apiKeyRequired: true,
      requestParameters: {
        [this.yearQueryParam]: true,
        [this.monthQueryParam]: true
      }
    })
  }
}
