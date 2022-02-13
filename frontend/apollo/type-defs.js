import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    status: String!
  }

  type TodoAttributes {
    message: String!
  }

  type Todo {
    id: ID!
    attributes: TodoAttributes
  }

  type Pagination {
    page: Int
    pageCount: Int
    pageSize: Int
    total: Int
  }

  type TodosMeta {
    pagination: Pagination
  }

  type Todos {
    data: [Todo]
    meta: TodosMeta
  }

  type Query {
    viewer: User
    todos: Todos
  }
`
