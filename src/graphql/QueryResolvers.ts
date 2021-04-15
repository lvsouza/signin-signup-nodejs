import { UserProvider } from "../database/providers";

export const QueryResolvers = {
  Query: {
    users: () => {
      return UserProvider.readAllUsers();
    },
    userById: (_: any, { id }: any) => {
      return UserProvider.readUserById(id);
    },
    userByEmail: (_: any, { email }: any) => {
      return UserProvider.readUserByEmail(email);
    }
  }
};
