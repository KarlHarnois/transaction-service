import * as core from "@aws-cdk/core"
import * as dynamodb from "@aws-cdk/aws-dynamodb"

export interface DataStackProps extends core.AppProps {
}

export class DataStack extends core.Stack {
  readonly table: dynamodb.Table

  constructor(scope: core.Construct, id: string, props: DataStackProps) {
    super(scope, id, props)

    this.table = new dynamodb.Table(this, "Table", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "resourceId",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: "sortKey",
        type: dynamodb.AttributeType.STRING
      }
    })

    this.table.addGlobalSecondaryIndex({
      indexName: "transactionIdIndex",
      partitionKey: {
        name: "sortKey",
        type: dynamodb.AttributeType.STRING
      }
    })

    new core.CfnOutput(this, "TableName", {
      value: this.table.tableName
    })
  }
}
