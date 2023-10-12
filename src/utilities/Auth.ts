import { createContext, useContext } from 'react';
import { Role } from './roles';
import { LoggedIn } from '../components/common/context-provider';

export type AuthenticatedUser = {
    id: number
    name: string
    role: Role
}
export const authenticatedUserContext = createContext<any>(null);
export const useAuth = () => useContext(authenticatedUserContext);


export const getAuthenticatedUser = (isLoggedIn: LoggedIn) => {
    const token = localStorage.getItem('Authorization');
    let userCredentials = {};

    try {
        const decodedToken = atob(token?.split('.').at(1) ?? '');
        const jsonToken = JSON.parse(decodedToken);
        userCredentials = JSON.parse(jsonToken.sub);
    } catch (e) {}

    if (isLoggedIn === LoggedIn.FALSE) {
        localStorage.removeItem('Authorization');
        userCredentials = {};
    }

    return userCredentials;
}
