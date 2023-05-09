import React, { useState, useCallback, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {useApolloClient} from "@apollo/react-hooks";
import { getQuery, getMutation} from '../../utils/apollo_util';
import {getEvents, getUsersEvents, addUserEvent} from './queries.graphql';
import {getUsers} from '../User/queries.graphql';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,    
    Box,
    Typography, 
    Button
} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
    top: 30
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function NativeSelects() {
    const classes = useStyles(),
        apolloClient = useApolloClient(),
        [loading, setLoading] = useState(false),
        [usersEvent, setUsersEvent] = useState([]),
        [events, setEvents] = useState([]),
        [users, setUsers] = useState([]),
        [error, setError] = useState(''),
        [status, setStatus] = useState(0),
        [selectedEvent, setSelectedEvent,] = useState(''),
        [selectedUser, setSelectedUser] = useState('');

    const handleChangeEvent = (event) => {
        setUsersEvent([])
        setSelectedEvent(event.target.value);
    };
    const handleChangeUser = (event) => {
        setSelectedUser(event.target.value);
    };

    const getData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getQuery(apolloClient, getEvents, {});
            setEvents(result.events.edges.map(edge => edge.node))

            const resultUser= await getQuery(apolloClient, getUsers, {});
            setUsers(resultUser.users.edges.map(edge => edge.node))

            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('error listados', error)
            setError(error)
        }
    }, [apolloClient, setLoading]);

    const getUsersEvent = useCallback(async () => {
        try {
            if(selectedEvent === '') return
            setLoading(true);            
            const result = await getQuery(apolloClient, getUsersEvents, {eventId: selectedEvent});
            if(result.error){
                setUsersEvent([])
            }else{
                setUsersEvent(result.usersEvent.data.userEvent.map(item => item))
            }            
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log('error listados', error)
            setError(error)
        }
    }, [apolloClient, setLoading, selectedEvent]);

    const addUser = useCallback(async (selectedEvent, selectedUser) => {
        try {
            if(loading) return;
            setError('')
            setStatus(0)
            setLoading(true)                            
            const result = await getMutation(apolloClient, addUserEvent, {
                userId: selectedUser,
                eventId: selectedEvent
            });
            if(result.addUserEvent.error){
                setError(result.addUserEvent.error)
                setLoading(false)
            }else{
                setStatus(result.addUserEvent.status)
                setLoading(false)
                setTimeout(()=>{
                    getUsersEvent()
                }, 100)                
            }
        } catch (error) {
            setLoading(false)
            console.log("Error al crear usuario", error);
        }
    }, [apolloClient]);

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        getUsersEvent()
    },[selectedEvent])

  return (
    <div>
        <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
                Evento
            </InputLabel>
            <NativeSelect
                value={selectedEvent}
                onSelect={selectedEvent}
                onChange={handleChangeEvent}
            >
                <option value="">Selecciona un evento</option>
                {
                    events.map(item => {
                        return <option value={item.id}>{item.title}</option>                        
                    })
                }
            </NativeSelect>
        </FormControl>
        <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
                Usuario
            </InputLabel>
            <NativeSelect
                value={selectedUser}
                onChange={handleChangeUser}
            >
                <option value="">Selecciona un usuario</option>
                {
                    users.map(item => {
                        return <option value={item.id}>{item.name} / {item.email}</option>                        
                    })
                }
            </NativeSelect>
        </FormControl>
        <Button color={"primary"} style={{marginTop: 40}} onClick={() => addUser(selectedEvent, selectedUser)}>
                        {loading ? 'Añadiendo usuario' : 'Añadir usuario'}
        </Button>
        {
                    error && 
                    <Typography style={{marginTop: 30}}>
                        {error}
                    </Typography>                    
                }
                {
                    status === 200 &&
                    <Typography style={{marginTop: 30}}>
                        Usuario agregado correctamente
                    </Typography>
                }
        <Box style={{marginTop: 100}}>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { usersEvent.length <= 0 ? 
                            <Typography>Sin datos de usuarios en el evento</Typography>
                        :
                        usersEvent.map(item => (
                            <TableRow key={item.user.id}>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>{item.user.email}</TableCell>
                                <TableCell>{
                                    item.status === 'pending' ? 'Pendiente' : item.status === 'accepted' ? 'Aceptado' : 'Rechazado'
                                }</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    </div>
 );
}
