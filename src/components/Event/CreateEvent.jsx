import React, {useCallback, useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Box, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import {useApolloClient} from "@apollo/react-hooks";
import {createEvent} from "./queries.graphql";
import {useSnackbar} from "notistack";
import Grid from "@material-ui/core/Grid";
import { getQuery, getMutation } from '../../utils/apollo_util';
import moment, { utc } from "moment";

const CreateEvent = () =>{
    const apolloClient = useApolloClient(),        
        [loading, setLoading] = useState(false),
        [title, setTitle] = useState(''),
        [description, setDescription] = useState(''),
        [start, setStart] = useState(''),
        [end, setEnd] = useState(''),
        [location, setLocation] = useState(''),
        [status, setStatus] = useState(0),
        [error, setError] = useState('');

        const create = useCallback(async (title, description, start, end, location) => {
            try {
                if(loading) return;
                setError('')
                setStatus(0)
                setLoading(true)                
                console.log(title, description, start, end, location)
                const result = await getMutation(apolloClient, createEvent, {
                    title, description, 
                    start_time: moment(start), 
                    end_time: moment(end), 
                    location
                });
                if(result.createEvent.error){
                    setError(result.createEvent.error)
                    setLoading(false)
                }else{
                    setStatus(result.createEvent.status)
                    setLoading(false)
                    setTimeout(()=>{
                        reset()
                    }, 4000)                
                }
            } catch (error) {
                setLoading(false)
                console.log("Error al crear usuario", error);
            }
        }, [apolloClient]);

        const reset = useCallback(() => {
            setTitle('')
            setDescription('')
            setStart('')
            setEnd('')
            setLocation('')
            setStatus(0)
            setError('')
        })
    return <Box position={'relative'} width={'100%'} style={{top: 30}}>
        <Typography variant={"h5"} style={{textAlign: 'center'}}>
            Crear Evento
        </Typography>
        <Box my={"25px"}>
            <Divider/>
        </Box>
        <form>       
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                    required
                    autoFocus
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    label="Titulo"
                    type="text"
                    fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField required autoFocus
                        value={description} onChange={event => setDescription(event.target.value)}
                        label="Descripcion"
                        type="text" fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField required autoFocus
                        placeholder="Inicio"
                        value={start} onChange={event => setStart(event.target.value)}
                        label="Inicio"
                        focused={true}
                        type="datetime-local" fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField required autoFocus
                        value={end} onChange={event => setEnd(event.target.value)}
                        label="Fin"
                        type="datetime-local" fullWidth
                        focused={true}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField required autoFocus
                        value={location} onChange={event => setLocation(event.target.value)}
                        label="Lugar"
                        type="text" fullWidth
                    />
                </Grid>     
                {
                    error && 
                    <Grid item xs={12}>
                        <Typography>
                        {error}
                        </Typography>
                    </Grid>
                }
                {
                    status === 200 &&
                    <Grid item xs={12}>
                        <Typography>
                            Evento creado correctamente
                        </Typography>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Button color={"primary"} onClick={() => create(title, description, start, end, location )}>
                        {loading ? 'Creando evento' : 'Crear evento'}
                    </Button>
                </Grid> 
            </Grid>
        </form>
    </Box>
}

export default CreateEvent