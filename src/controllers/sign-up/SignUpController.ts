import { Request, Response } from 'express';

const signUp = (req: Request, res: Response) => {
    return res.send('Chegou aqui!');
}

export const SignUpController = {
    signUp,
}
