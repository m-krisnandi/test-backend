interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}

interface SigninResponse {
    token: string;
}

export { User, SigninResponse };