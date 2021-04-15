import { makeExecutableSchema } from "@graphql-tools/schema";
import { graphqlHTTP } from "express-graphql";

import { QueryResolvers } from './QueryResolvers';
import { TypeDefinition } from './TypeDefinition';

const schema = makeExecutableSchema({
  resolvers: QueryResolvers,
  typeDefs: TypeDefinition,
});

export const GraphqlHTTP = graphqlHTTP({
  schema,
  customFormatErrorFn: error => {
    return {
      message: error.message,
    }
  },
});
