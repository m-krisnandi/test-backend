import { User } from "../api/v1/users/model";

interface TokenUser {
    userId: string;
    name: string;
    email: string;
}

const createTokenUser = (user: User): TokenUser => {
    return {
        userId: user.id,
        name: user.name,
        email: user.email
    }
}

export { createTokenUser }