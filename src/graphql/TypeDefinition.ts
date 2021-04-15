export const TypeDefinition = `
  type User {
    username: String
    email: String!
    name: String!
    id: Int!
  }

  type Query {
    users: [User!]!
    userById(id: Int!): User
    userByEmail(email: String!): User
  }
`;
