import React, {useContext} from 'react';
import App from "../components/App/Context/App";
import Menu from "../components/Menu/Menu";

function HomePage() {
    const {setSession, session} = useContext(App);
    

    return (
        <>
            <Menu data={session}/>
        </>
    );
}

export default HomePage;
