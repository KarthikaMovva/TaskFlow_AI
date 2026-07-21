import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";


interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (
        accessToken: string,
        refreshToken: string
    ) => void;
    logout: () => void;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children
}: AuthProviderProps) {

    const [
        accessToken,
        setAccessToken
    ] = useState<string | null>(
        localStorage.getItem("accessToken")
    );

    const [
        refreshToken,
        setRefreshToken
    ] = useState<string | null>(

        localStorage.getItem("refreshToken")

    );

    const [
        isAuthenticated,
        setIsAuthenticated
    ] = useState(
        !!localStorage.getItem("accessToken")
    );

    function login(

        access: string,

        refresh: string

    ) {

        /*
            Save in browser.
        */

        localStorage.setItem(

            "accessToken",

            access

        );

        localStorage.setItem(

            "refreshToken",

            refresh

        );

        /*
            Save in React state.
        */

        setAccessToken(

            access

        );

        setRefreshToken(

            refresh

        );

        setIsAuthenticated(

            true

        );

    }

    function logout() {

        localStorage.removeItem(

            "accessToken"

        );

        localStorage.removeItem(

            "refreshToken"

        );

        setAccessToken(

            null

        );

        setRefreshToken(

            null

        );

        setIsAuthenticated(

            false

        );

    }

    useEffect(() => {

        setIsAuthenticated(

            !!accessToken

        );

    }, [

        accessToken

    ]);

    return (

        <AuthContext.Provider

            value={{

                accessToken,

                refreshToken,

                isAuthenticated,

                login,

                logout

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    const context =

        useContext(

            AuthContext

        );

    if (!context) {

        throw new Error(

            "useAuth must be used inside AuthProvider"

        );

    }

    return context;

}