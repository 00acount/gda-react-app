import { useEffect, useState } from "react";
import { authenticatedUserContext, getAuthenticatedUser } from "./Auth";

export default function ContextProvider({ children }: any) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState({});
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
            (async () => {
                const user = await getAuthenticatedUser();
                setAuthenticatedUser(user);
                setDataFetched(true);
            })()
    }, [loggedIn]);
     
    
    const updateLoggedIn = (isLoggedIn: boolean) => {
        setLoggedIn(isLoggedIn)
    }
    
    return (
        <authenticatedUserContext.Provider value={{authenticatedUser, updateLoggedIn}}>
            {dataFetched &&
            children}
        </authenticatedUserContext.Provider>
    )
}
  