# Table Design
## Access Patterns
- Get transactions for a month+year
- Get a transaction by id
- Get transaction total for a category for a month+year
- Get transaction total for a subcategory for a month+year
- Get transaction total for a category for a year
- Get transaction total for a subcategory for a year
- Get expenses for a month+year
- Get expense for a given transaction
- Get expense total for a category for a month+year
- Get expense total for a subcategory for a month+year
- Get expense total for a category for a year
- Get expense total for a subcategory for a year
- Create an expense for a specific transaction by id

## Schema
### Composite Primary Key
This provide access of entities by month+year where we can sort the entity type with the id prefixes:
- Transaction ids are prefixed by `txn`
- Accweb transaction ids are prefixed by `acc`
- Expense ids are prefixed by `exp`

| PK           | SK               | Attribute        | Attribute    |
|--------------|------------------|------------------|--------------|
| *Year-Month* | *id*             | *relationshipId* | *jsonObject* |
| 2020-12      | txn_1XA2929112q8 | —                | { ... }      |
| 2020-12      | acc_229a9229AS2w | txn_1XA2929112q8 | { ... }      |
| 2020-12      | exp_328SD822az89 | txn_1XA2929112q8 | { ... }      |

### GSI 1
This index is to access entities by id.
| PK               | Attribute    | Attribute        | Attribute    |
|------------------|--------------|------------------|--------------|
| *id*             | *Year-Month* | *relationshipId* | *jsonObject* |
| txn_1XA2929112q8 | 2020-12      | —                | { ... }      |
| acc_229a9229AS2w | 2020-12      | txn_1XA2929112q8 | { ... }      |
| exp_328SD822az89 | 2020-12      | txn_1XA2929112q8 | { ... }      |

### GSI 2
This index is for relationships between entities. Match the sort key id prefix to filter the entity type. Here are the access patterns:
- Get expense for a transaction
- Get Accweb transaction for a transaction

| PK               | SK               | Attribute    | Attribute    |
|------------------|------------------|--------------|--------------|
| *relationshipId* | *id*             | *Year-Month* | *jsonObject* |
| —                | txn_1XA2929112q8 | 2020-12      | { ... }      |
| txn_1XA2929112q8 | acc_229a9229AS2w | 2020-12      | { ... }      |
| txn_1XA2929112q8 | exp_328SD822az89 | 2020-12      | { ... }      |
