import React, {Fragment, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Box, TextField, Link} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import App from "../App/Context/App";
import {useApolloClient} from "@apollo/react-hooks";
import {login} from "./queries.graphql";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getMutation } from '../../utils/apollo_util';
import SignUp from './SignUp';
import Cookies from 'js-cookie';


const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '12px',
        maxWidth: '550px',
        width: '100%'
    },
    title1: {
        color: theme.palette.primary.main,
        fontSize: '24px'
    },
    btnLoading: {
        color: 'rgba(0, 0, 0, 0.26)'
    },
    link: {
        cursor: 'pointer'
    },
    
    
}));

const Login = () => {
    const classes = useStyles(),
        apolloClient = useApolloClient(),
        {enqueueSnackbar} = useSnackbar(),
        {setSession, session} = useContext(App),
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [loading, setLoading] = useState(false),
        [signUp, setSignUp] = useState(false),
        [error, setError] = useState(''),
        [status, setStatus] = useState(0);

    const handleSubtmit = useCallback(async (email, password) => {
        try{            
            if(loading) return;
            setLoading(true)
            const result = await getMutation(apolloClient, login, {
                email, password
            });
            if(result.login.error){
                setError(result.login.error)
            }else{
                setStatus(result.login.status)
                Cookies.set('session', JSON.stringify(result.login.data), { expires: 1 });
                setSession(result.login.data)
            }
            setLoading(false)
        }catch(error){
            console.log("Error al iniciar sesion", error);
        }        
    }, [email, password, setSession]);


    return <Box position={'relative'} width={'100%'}>
        <Card className={classes.root}>
            <CardContent style={{padding: '50px 30px 30px 30px'}}>
                <Collapse in={!signUp}>
                    <Typography variant={"h5"}>
                        Iniciar sesión
                    </Typography>
                    <Box my={"25px"}>
                        <Divider/>
                    </Box>
                    <form>
                        <Box style={{marginBottom: 30, marginTop: 20}}>
                            <TextField disabled={loading} required autoFocus
                                value={email} onChange={event => setEmail(event.target.value)}
                                label="Correo electrónico"
                                type="email" fullWidth
                            />
                            <TextField disabled={loading} required autoFocus
                                value={password} onChange={event => setPassword(event.target.value)}
                                label="Password"
                                type="password" fullWidth
                            />
                        </Box>
                        {
                            error &&
                            <Typography>
                                {error}
                            </Typography>
                        }
                        <Box mb={"25px"}>
                            <Button color={"primary"}  onClick={() => handleSubtmit(email, password)}>
                                {loading ? 'Iniciando....' : 'Iniciar Sesion'}
                            </Button>
                        </Box>
                        <Box style={{marginBottom: 30}}>
                            <Divider/>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}
                                justifyContent={'flex-end'}
                                mb={"20px"}>
                            <Box>
                                <Link disabled={loading} onClick={() => setSignUp(!signUp)}
                                        className={classes.link}>
                                    Crear Usuario
                                </Link>
                            </Box>
                        </Box>
                    </form>
                </Collapse>
                <Collapse in={signUp}>
                    <SignUp setView={setSignUp}/>
                </Collapse>
            </CardContent>
        </Card>
    </Box>
};

export default Login;
