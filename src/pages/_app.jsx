import React, {useState, useEffect} from 'react';
import {ApolloProvider} from 'react-apollo';
import Context from "../components/App/Context/App"
import { createApolloClient } from "../client/apollo";
import LoginPage from "./login";
import HomePage from './home'
import Cookies from 'js-cookie';

const MyApp = () => {
    const [session, setSession] = useState(null);
    const apolloClient = createApolloClient();

    useEffect(() => {
        const sessionCookie = Cookies.get('session');
            if (sessionCookie) {
                setSession(JSON.parse(sessionCookie));
            }
    }, []);
    
    return (
        <>
            <ApolloProvider client={apolloClient}>
                <Context.Provider value={{ session, setSession }}>
                    {!session ? (
                        <LoginPage />
                    ) : (
                        <HomePage />
                    )}
                </Context.Provider>
            </ApolloProvider>
        </>
    );
}

export default MyApp;
