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

interface IUserReadResult {
    id: number;
    name: string;
    email: string,
    password: string,
    username?: string,
}
const readUserByEmail = async (email: string): Promise<string | IUserReadResult> => {
    try {
        const user = await Knex(TableNames.user).select('*').where({ email }).first();

        if (!user) return 'Usuário não existe';

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username,
        };
    } catch (error) {
        return 'Erro interno';
    }
}

export const UserProvider = {
    createUser,
    readUserByEmail,
}
