import * as core from "@aws-cdk/core"
import * as dynamodb from "@aws-cdk/aws-dynamodb"

export interface DataStackProps extends core.AppProps {}

export class DataStack extends core.Stack {
  readonly table: dynamodb.Table

  constructor(scope: core.Construct, id: string, props: DataStackProps) {
    super(scope, id, props)

    this.table = this.createTable()

    // Check /docs/table-design.md for more info.
    this.addGSI({ number: 1, partitionKey: "SK" })
    this.addGSI({ number: 2, partitionKey: "transactionId", sortKey: "SK" })

    new core.CfnOutput(this, "TableName", {
      value: this.table.tableName
    })
  }

  private createTable(): dynamodb.Table {
    return new dynamodb.Table(this, "Table", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING
      }
    })
  }

  private addGSI(args: {
    number: number
    partitionKey: string
    sortKey?: string
  }) {
    const props: dynamodb.GlobalSecondaryIndexProps = {
      indexName: `GSI${args.number}`,
      partitionKey: {
        name: args.partitionKey,
        type: dynamodb.AttributeType.STRING
      },
      ...(args.sortKey && {
        sortKey: {
          name: args.sortKey,
          type: dynamodb.AttributeType.STRING
        }
      })
    }

    this.table.addGlobalSecondaryIndex(props)
  }
}
