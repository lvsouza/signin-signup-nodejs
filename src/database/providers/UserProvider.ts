import { Knex } from "../connection";
import { TableNames } from "../TableNames";

interface IUserToCreate {
    name: string;
    email: string,
    password: string,
    username?: string,
}
const createUser = async (userToCreate: IUserToCreate) => {
    try {
        const [insertedUserId] = await Knex(TableNames.user).insert(userToCreate);

        return {
            id: insertedUserId,
            name: userToCreate.name,
            email: userToCreate.email,
            username: userToCreate.username,
        };
    } catch (error) {
        return "Erro ao inserir o usuário"
    }
}

export const UserProvider = {
    createUser,
}
