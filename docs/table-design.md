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

## Entities
- TransactionTotalView (category, subcategory, centAmount, month, year)
- ExpenseTotalView (category, subcategory, centAmount, month, year)

### Transaction
Get transactions by month+year:
```
| Primary Key                    |            |
| PK          | SK               | Attributes |
|-------------|------------------|------------|
| Year-Month  | id               | jsonObject |
| 2020-12     | txn_1XA2929112q8 | { ... }    |
```
GSI 1 to get transaction by id:
```
| Secondary Key    |            |
| PK               | Attributes |
|------------------|------------|
| id               | jsonObject |
| txn_1XA2929112q8 | { ... }    |
```
### Expense
Get expenses by month+year:
```
| Primary Key                    |            |
| PK          | SK               | Attributes |
|-------------|------------------|------------|
| Year-Month  | id               | jsonObject |
| 2020-12     | exp_328SD822az89 | { ... }    |
```
GSI 1 to get expense by id:
```
| Secondary Key    |            |
| PK               | Attributes |
|------------------|------------|
| id               | jsonObject |
| exp_328SD822az89 | { ... }    |
```
GSI 2 to get expense for a given transaction:
```
| Secondary Key                       |            |
| PK               | SK               | Attributes |
|------------------|------------------|------------|
| relationshipId   | id               | jsonObject |
| txn_1XA2929112q8 | exp_328SD822az89 | { ... }    |
```
### Accweb Transaction
Get Accweb transactions by month+year:
| Primary Key                    |            |
| PK          | SK               | Attributes |
|-------------|------------------|------------|
| Year-Month  | id               | jsonObject |
| 2020-12     | acc_229a9229AS2w | { ... }    |
GSI 2 to get Accweb transaction for a given transaction:
```
| Secondary Key                       |            |
| PK               | SK               | Attributes |
|------------------|------------------|------------|
| relationshipId   | id               | jsonObject |
| txn_1XA2929112q8 | acc_229a9229AS2w | { ... }    |
```
