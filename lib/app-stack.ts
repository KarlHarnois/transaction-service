import * as core from "@aws-cdk/core"
import { DataStack } from './data-stack'
import { ApiStack } from "./api-stack"

export interface AppStackProps extends core.StackProps {
  envName: string
}

export class AppStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props: AppStackProps) {
    super(scope, id, props)

    const dataStack = new DataStack(scope, `Transaction${props.envName}DataStack`, {})

    const apiStack = new ApiStack(scope, `Transaction${props.envName}ApiStack`, {
      envName: props.envName,
      table: dataStack.table
    })
  }
}
