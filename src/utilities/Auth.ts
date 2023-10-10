import { createContext, useContext } from 'react';
import { Role } from './roles';
import { API_URL } from './backend-api';

export type AuthenticatedUser = {
    id: number
    name: string
    role: Role
}
export const authenticatedUserContext = createContext<any>(null);
export const useAuth = () => useContext(authenticatedUserContext);


export const getAuthenticatedUser = async () => {
    const response = await fetch(`${API_URL}/api/v1/whos-authenticated`, {
            method: 'GET',
            credentials: "include",
        })

    if (response.ok)
        return await response.json(); 

    return {};
}
