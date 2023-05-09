import React, {useCallback, useEffect, useState} from 'react';
import {Box, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import {useApolloClient} from "@apollo/react-hooks";
import {createUser} from "./queries.graphql";
import Typography from "@material-ui/core/Typography";
import {useSnackbar} from "notistack";
import Card from "@material-ui/core/Card";
import { getQuery, getMutation } from '../../utils/apollo_util';
import {useRouter} from "next/router";
import sha256 from "sha256";
import CardContent from "@material-ui/core/CardContent";


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

const SignUp = ({setView}) => {
    const classes = useStyles(),
        apolloClient = useApolloClient(),
        router = useRouter(),
        {enqueueSnackbar} = useSnackbar(),
        [loading, setLoading] = useState(false),
        [name, setName] = useState(''),
        [password, setPassword] = useState(''),
        [email, setEmail] = useState(''),
        [status, setStatus] = useState(0),
        [error, setError] = useState('');

        const create = useCallback(async (name, email, password) => {
            try {
                if(loading) return;
                setError('')
                setStatus(0)
                setLoading(true)
                const hashedPassword = sha256(password);
                const result = await getMutation(apolloClient, createUser, {
                    name, email, password: hashedPassword
                });

                if(result.addUser.error){
                    setError(result.addUser.error)
                }else{
                    setStatus(result.addUser.status)
                    setTimeout(() => {
                        setLoading(false) 
                        setView(false)
                        reset()
                    }, 1000);
                }
            } catch (error) {
                console.log("Error al crear usuario", error);
            }
        }, [apolloClient]);

        const reset = useCallback(() => {
            setName('')
            setEmail('')
            setPassword('')
            setStatus(0)
            setError('')
        })
    return <Box position={'relative'} width={'100%'}>
        <Card className={classes.root}>
            <CardContent style={{padding: '50px 30px 30px 30px'}}>
                    <Typography variant={"h5"}>
                        Crear Usuario
                    </Typography>
                    <Box my={"25px"}>
                        <Divider/>
                    </Box>
                    <form onSubmit={() => create(name, email, password)}>
                    <Box style={{marginBottom: 30, marginTop: 20}}>
                        <TextField required autoFocus
                            value={name} onChange={event => setName(event.target.value)}
                            label="Nombre"
                            type="text" fullWidth
                        />
                        <TextField required autoFocus
                            value={email} onChange={event => setEmail(event.target.value)}
                            label="Email"
                            type="email" fullWidth
                        />
                        <TextField required autoFocus
                            value={password} onChange={event => setPassword(event.target.value)}
                            label="password"
                            type="password" fullWidth
                        />
                    </Box>
                    
                    {
                        error && 
                        <Typography>
                            {error}
                        </Typography>
                    }
                    {
                        status === 200 &&
                        <Typography>
                            Usuario creado correctamente
                        </Typography>
                    }
                    <Box mb={"25px"}>
                        <Button color={"primary"} type='subtmit'>
                            {loading ? 'Creando usuario' : 'Crear usuario'}
                        </Button>
                        <Button color={"primary"} onClick={() => setView(false)}>
                            Regresar
                        </Button>
                    </Box>
                    </form>
            </CardContent>
        </Card>
    </Box>
};

export default SignUp;
