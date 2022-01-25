# Table Design
## Access Patterns
- Get transactions for a month+year
- Get a transaction by id
- Get transaction total for a category for a month+year
- Get transaction total for a subcategory for a month+year
- Get transaction total for a category for a year
- Get transaction total for a subcategory for a year
- Get expenses for a month+year
- Get expense by id
- Get expense total for a category for a month+year
- Get expense total for a subcategory for a month+year
- Get expense total for a category for a year
- Get expense total for a subcategory for a year
- Create an expense for a specific transaction by id

## Entities
- TransactionTotalView (category, subcategory, centAmount, month, year)
- ExpenseTotalView (category, subcategory, centAmount, month, year)

### Transaction
Primary Key:
```
| Primary Key                    |            |
| PK          | SK               | Attributes |
|-------------|------------------|------------|
| Year-Month  | id               | jsonObject |
| 2020-12     | txn_1XA2929112q8 | { ... }    |
```
GSI to get transaction by id:
```
| Secondary Key    |            |
| PK               | Attributes |
|------------------|------------|
| id               | jsonObject |
| txn_1XA2929112q8 | { ... }    |
```

### Expense
Primary Key:
```
| Primary Key                    |            |
| PK          | SK               | Attributes |
|-------------|------------------|------------|
| Year-Month  | id               | jsonObject |
| 2020-12     | exp_328SD822az89 | { ... }    |
```
GSI to get expense by id
```
| Secondary Key    |            |
| PK               | Attributes |
|------------------|------------|
| id               | jsonObject |
| exp_328SD822az89 | { ... }    |
```
