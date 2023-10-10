import { createContext, useContext } from 'react';
import { Role } from './roles';

export type AuthenticatedUser = {
    id: number
    name: string
    role: Role
}
export const authenticatedUserContext = createContext<any>(null);
export const useAuth = () => useContext(authenticatedUserContext);


export const getAuthenticatedUser = async () => {
    const response = await fetch('http://localhost:8080/api/v1/whos-authenticated', {
            method: 'GET',
            credentials: "include",
        })

    if (response.ok)
        return await response.json(); 

    return {};
}
