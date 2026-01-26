export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    displayName?: string;
    avtarUrl?: string;
    bio?:string;
    createdAt: string;
    updatedAt: string;
}