import { useEffect, useState } from "react";
import { authenticatedUserContext, getAuthenticatedUser } from "../../utilities/Auth";

export enum LoggedIn {
    FALSE, TRUE, INITIAL
}
export default function ContextProvider({ children }: any) {
    const [loggedIn, setLoggedIn] = useState(LoggedIn.INITIAL);
    const [authenticatedUser, setAuthenticatedUser] = useState({});
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
            (async () => {
                const user = getAuthenticatedUser(loggedIn);
                setAuthenticatedUser(user);
                setDataFetched(true);
            })()
    }, [loggedIn]);
     
    
    const updateLoggedIn = (isLoggedIn: LoggedIn) => {
        setLoggedIn(isLoggedIn)
    }
    
    return (
        <authenticatedUserContext.Provider value={{authenticatedUser, updateLoggedIn}}>
            {dataFetched &&
            children}
        </authenticatedUserContext.Provider>
    )
}
  