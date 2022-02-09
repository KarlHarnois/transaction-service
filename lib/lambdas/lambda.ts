import * as lambdaNodejs from "@aws-cdk/aws-lambda-nodejs"
import * as core from "@aws-cdk/core"
import * as path from "path"

export class Lambda {
  readonly YEAR_QUERY_PARAM = "method.request.querystring.year"
  readonly MONTH_QUERY_PARAM = "method.request.querystring.month"
  private readonly DEFAULT_TIMEOUT = core.Duration.seconds(90)
  private readonly DEFAULT_MEMORY_SIZE = 1024

  createLambda(args: {
    scope: core.Construct
    construct: string
    handler: string
    env: any
  }) {
    return new lambdaNodejs.NodejsFunction(args.scope, args.construct, {
      entry: this.handlerPath(args.handler),
      timeout: this.DEFAULT_TIMEOUT,
      memorySize: this.DEFAULT_MEMORY_SIZE,
      environment: args.env
    })
  }

  handlerPath(dirname: string) {
    return `${path.resolve(__dirname)}/../../src/handlers/${dirname}/handler.ts`
  }
}
