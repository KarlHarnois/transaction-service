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
- Get Accweb transaction for a Accweb import

## Table
### Composite Primary Key
Provides access of entities by month+year where we can sort the entity type with the id prefixes:
- Transaction ids are prefixed by `txn`
- Expense ids are prefixed by `exp`
- Accweb transaction ids are prefixed by `act`
- Accweb import ids are prefixed by `imp`

| PK          | SK               | Attribute        | Attribute    |
|-------------|------------------|------------------|--------------|
| *yearMonth* | *id*             | *transactionId*  | *jsonObject* |
| 2020-12     | txn_1XA2929112q8 | —                | { ... }      |
| 2020-12     | exp_328SD822az89 | txn_1XA2929112q8 | { ... }      |

Accweb transactions and imports are also associated here:
| PK         | SK               | Attribute        | Attribute    |
|------------|------------------|------------------|--------------|
| *importId* | *id*             | *transactionId*  | *jsonObject* |
| imp_1      | act_229a9229AS2w | txn_1XA2929112q8 | { ... }      |
| imp_1      | imp_1            | —                | { ... }      |

### GSI 1
This index is to access entities by id.
| PK               | Attribute   | Attribute        | Attribute        | Attribute    |
|------------------|-------------|------------------|------------------|--------------|
| *id*             | *yearMonth* | *transactionId*  | *importId*       | *jsonObject* |
| txn_1XA2929112q8 | 2020-12     | —                | —                | { ... }      |
| exp_328SD822az89 | 2020-12     | txn_1XA2929112q8 | —                | { ... }      |
| act_229a9229AS2w | 2020-12     | txn_1XA2929112q8 | imp_553DFd302s23 | { ... }      |
| imp_553DFd302s23 | 2020-12     | —                | —                | { ... }      |

### GSI 2
This index is for relationships between entities and transactions. Match the sort key id prefix to filter the entity type.
| PK               | SK               | Attribute   | Attribute  | Attribute    |
|------------------|------------------|-------------|------------|--------------|
| *transactionId*  | *id*             | *yearMonth* | *importId* | *jsonObject* |
| txn_1XA2929112q8 | exp_328SD822az89 | 2020-12     |  —         | { ... }      |
| txn_1XA2929112q8 | act_229a9229AS2w | 2020-12     |  —         | { ... }      |
