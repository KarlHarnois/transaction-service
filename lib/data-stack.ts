import * as core from "@aws-cdk/core"
import * as dynamodb from "@aws-cdk/aws-dynamodb"

export interface DataStackProps extends core.AppProps {
}

export class DataStack extends core.Stack {
  readonly table: dynamodb.Table

  constructor(scope: core.Construct, id: string, props: DataStackProps) {
    super(scope, id, props)

    this.table = this.createTable()

    // Check docs/table-design.md for more info.
    this.addGSI({ name: "GSI 1", partitionKey: "SK" })
    this.addGSI({ name: "GSI 2", partitionKey: "transactionId", sortKey: "SK" })
    this.addGSI({ name: "GSI 3", partitionKey: "importId", sortKey: "PK" })

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

  private addGSI(args: { name: string, partitionKey: string, sortKey?: string }) {
    const props: dynamodb.GlobalSecondaryIndexProps = {
      indexName: args.name,
      partitionKey: {
        name: args.partitionKey,
        type: dynamodb.AttributeType.STRING
      },
      ... (args.sortKey && {
        sortKey: {
          name: args.sortKey,
          type: dynamodb.AttributeType.STRING
        }
      })
    }

    this.table.addGlobalSecondaryIndex(props)
  }
}
