

export interface UserResponse{
    message?: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        token?: string;
        password?:string;
    };
}

