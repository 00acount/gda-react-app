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

        if ((Date.now() / 1000 - jsonToken.exp > 0)
             || (isLoggedIn === LoggedIn.FALSE))
            throw new Error('token expired');

        userCredentials = JSON.parse(jsonToken.sub);
    } catch (e) {
        localStorage.removeItem('Authorization');
        userCredentials = {};
    }



    return userCredentials;
}
