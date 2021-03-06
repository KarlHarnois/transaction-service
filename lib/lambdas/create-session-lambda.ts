import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import { Lambda } from "./lambda"

export interface CreateSessionLambdaProps {
  tokenSecret: string
  api: apigateway.RestApi
}

export class CreateSessionLambda extends Lambda {
  constructor(scope: core.Construct, props: CreateSessionLambdaProps) {
    super()

    const lambda = this.createLambda({
      scope,
      construct: "CreateSessionLambda",
      handler: "create-session",
      env: {
        AUTH_TOKEN_SECRET: props.tokenSecret
      }
    })

    const integration = this.createIntegration(lambda)
    const method = this.createMethod(integration, props)
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
