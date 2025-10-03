import http from "./http";

export type AuthResponse = {
    id: number;
    fullName: string;
    email: string;
    token: string;
};

export type ApiResponse<AuthResponse> = {
    Message : any
    data : AuthResponse
};

export const register =  (fullName: string, email: string, password: string , Role : string)=> http.post<AuthResponse>("/auth/register", {fullName, email, password , Role});
export const login =  (email: string, password: string)=> http.post<ApiResponse<AuthResponse>>("/auth/login", {email, password});