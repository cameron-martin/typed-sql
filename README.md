# typed-sql

Infers the type of executing an SQL query, at compile time, using TypeScript's template literal types.

## Usage

```ts
interface Schema {
  users: {
    id: number,
    name: string,
    is_admin: boolean
  }
}

new Client<Schema>.query('SELECT id, name AS username FROM users WHERE is_admin = true') // QueryResult<{ id: number, name: string }>
```
