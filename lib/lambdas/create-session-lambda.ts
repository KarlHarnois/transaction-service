import * as path from "path"
import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import { Lambda } from "./lambda"

export interface CreateSessionLambdaProps {
  tokenSecret: string
  api: apigateway.RestApi
}

export class CreateSessionLambda extends Lambda {
  constructor(scope: core.Construct, props: CreateSessionLambdaProps) {
    super()
    const lambda = this.createLambda(scope, props)
    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
  }

  private createLambda(scope: core.Construct, props: CreateSessionLambdaProps) {
    return new lambdaNodejs.NodejsFunction(scope, "CreateSessionLambda", {
      entry: this.handlerPath("create-session"),
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

  private createMethod(
    integration: apigateway.Integration,
    props: CreateSessionLambdaProps
  ) {
    const resource: apigateway.Resource = props.api.root.addResource("sessions")
    return resource.addMethod("POST", integration, {
      apiKeyRequired: true
    })
  }
}
