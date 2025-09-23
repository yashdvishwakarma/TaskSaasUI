import http from "./http";

export type AuthResponse = {
    id: number;
    fullName: string;
    email: string;
    token: string;
};

export const register =  (fullName: string, email: string, password: string , Role : string)=> http.post<AuthResponse>("/auth/register", {fullName, email, password , Role});
export const login =  (email: string, password: string)=> http.post<AuthResponse>("/auth/login", {email, password});