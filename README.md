## A wallet management system for tracking transactions, generating reports, setting budgets, and visualizing financial data for multiple accounts.


## Database Schema

The application uses a PostgreSQL database with the following structure:
```mermaid

erDiagram
    User ||--o{ Account : has
    User ||--o{ Category : creates
    User ||--o{ Transaction : makes
    User ||--o{ Budget : manages
    Account ||--o{ Transaction : contains
    Category ||--o{ SubCategory : has
    Category ||--o{ Transaction : categorizes
    Category ||--o{ BudgetCategory : includes
    SubCategory ||--o{ Transaction : subcategorizes
    Budget ||--o{ BudgetCategory : allocates

    User {
        int id PK
        string username UK
        string email UK
        string password
        string fullName
        datetime createdAt
        datetime updatedAt
    }

    Account {
        int id PK
        int userId FK
        int accountNumber
        string name
        enum type
        decimal currentBalance
        string currency
        datetime createdAt
        datetime updatedAt
    }

    Category {
        int id PK
        int userId FK
        string name
        enum type
        string color
        datetime createdAt
        datetime updatedAt
    }

    SubCategory {
        int id PK
        int categoryId FK
        string name
        datetime createdAt
        datetime updatedAt
    }

    Transaction {
        int id PK
        int userId FK
        int accountId FK
        int categoryId FK
        int subCategoryId FK
        decimal amount
        enum type
        string description
        datetime transactionDate
        enum status
        datetime createdAt
        datetime updatedAt
    }

    Budget {
        int id PK
        int userId FK
        string name
        decimal amount
        datetime startDate
        datetime endDate
        string currency
        datetime createdAt
        datetime updatedAt
    }

    BudgetCategory {
        int id PK
        int budgetId FK
        int categoryId FK
        decimal allocatedAmount
        decimal spentAmount
        datetime createdAt
        datetime updatedAt
    }

```
### Key Features of the Database Design:

1. **User-Centric Design**
   - Each user can have multiple accounts, categories, and budgets
   - All transactions are linked to a specific user for data isolation

2. **Financial Management**
   - Track multiple account types (Bank, Mobile Money, Cash, etc.)
   - Hierarchical categorization with categories and subcategories
   - Comprehensive transaction tracking with status management

3. **Budgeting System**
   - Flexible budget creation with date ranges
   - Category-based budget allocation
   - Track spent amounts against allocated budgets

4. **Data Integrity**
   - Foreign key constraints ensure data consistency
   - Unique constraints prevent duplicate entries
   - Proper indexing for optimal query performance
