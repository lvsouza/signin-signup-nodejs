import { Knex } from "../connection";
import { TableNames } from "../TableNames";

interface IUserToCreate {
    name: string;
    email: string,
    password: string,
    username?: string,
}
const createUser = async (userToCreate: IUserToCreate) => {
    await Knex(TableNames.user).insert(userToCreate);
}

export const UserProvider = {
    createUser,
}
