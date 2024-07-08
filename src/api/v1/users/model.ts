interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    mobile_phone: string;
    created_at: string;
    updated_at: string;
}

interface SigninResponse {
    token: string;
}

export { User, SigninResponse };