import React, {useContext} from 'react';
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Login from "../components/Session/Login";
import Head from "next/head";

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 12px'
    },
    background: {
        height: '100%',
        width: '100%',
        backgroundColor: '#E9E9E9', 
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
}));

const LoginPage = () => {
    const classes = useStyles();


    return <div className={classes.background}>
        <Head>
            <title>Login</title>
        </Head>
        <Container maxWidth={"lg"} className={classes.root}>
            <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                <Box display={'flex'} flexDirection={'center'} alignItems={'center'} style={{maxWidth: '500px', marginBottom: '50px'}}>
                    <Login/>
                </Box>
            </Box>
        </Container>
    </div>

};

export default LoginPage;
