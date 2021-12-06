#!/usr/bin/env node

import * as cdk from "@aws-cdk/core"
import { AppStack } from "../lib/app-stack"

const envName = process.env["APPLICATION_ENV"]

if (envName) {
  const app = new cdk.App()

  new AppStack(app, `Transaction${envName}AppStack`, {
    envName: envName,
    env: {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT
    }
  })
} else {
  console.log("Undefined $APPLICATION_ENV")
  process.exit
}
