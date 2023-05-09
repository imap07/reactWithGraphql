import React, { useState, useEffect, useCallback, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {useApolloClient} from "@apollo/react-hooks";
import { getQuery, getMutation} from '../../utils/apollo_util';
import App from "../App/Context/App";
import {userEvents, updateUserEvent} from './queries.graphql';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Typography,
    Box, 
    Modal
} from "@material-ui/core";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
    maxWidth: 400,
    width: "100%",
    outline: "none",
    },
    content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    
    },
});

const ListEvents = () => {
  const classes = useStyles(),
    {setSession, session} = useContext(App),
    apolloClient = useApolloClient(),    
    [eventData, setEventData] = useState([]),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(''),
    [status, setStatus] = useState(0),
    userId = session?.user?.id, 
    [openModal, setOpenModal] = useState(false),
    [selectedEvent, setSelectedEvent] = useState(null),
    [data, setData] = useState([]);

    const getData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getQuery(apolloClient, userEvents, {
                userId
            });
            console.log(result)
            setData(result.userEvents)
            setEventData(result.userEvents.data.map(item => item))
            setLoading(false)
        } catch (error) {
            console.log('error listado de eventos', error)
            setError(error)
        }
    }, [apolloClient, setLoading]);

    const updateStatus = useCallback(async (eventData,status) => {
        try {
            if(loading) return;
            setError('')
            setStatus(0)
            setLoading(true)         
            console.log(eventData.event.id, status)       
            const result = await getMutation(apolloClient, updateUserEvent, {
                userId,
                eventId: eventData.event.id,
                status
            });
            console.log(result)
            if(result.updateUserEvent.error){
                setError(result.updateUserEvent.error)
                setOpenModal(false)
                setLoading(false)
            }else{
                setStatus(result.updateUserEvent.status)
                setOpenModal(false)
                setLoading(false)
                setTimeout(()=>{
                    getData()
                }, 100)                
            }            
        } catch (error) {
            setLoading(false)
            console.log("Error al actualizar invitacion", error);
        }
    }, [apolloClient]);

    useEffect(() => {
        getData()        
    }, []);

    const handleEventSelection = (event) => {
        setSelectedEvent(event);
        setOpenModal(true);
    };
    
    
    if (loading) return <CircularProgress />;
    if (error) return <p>Error</p>;

    return (
        <>            
            <TableContainer style={{marginTop: 50}}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Fecha inicio</TableCell>
                            <TableCell>Fecha fin</TableCell>
                            <TableCell>Lugar</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {   eventData.length <= 0 ? 
                                <Typography style={{textAlign: 'center'}}>
                                    Sin notificationes
                                </Typography>
                            :
                            eventData.map((item) => (
                                <TableRow key={item.event.id} onClick={() => handleEventSelection(item)}>
                                    <TableCell>{item.event.id}</TableCell>
                                    <TableCell>{item.event.title}</TableCell>
                                    <TableCell>{item.event.description}</TableCell>
                                    <TableCell>{item.event.start_time}</TableCell>
                                    <TableCell>{item.event.end_time}</TableCell>
                                    <TableCell>{item.event.location}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>      
            <Modal open={openModal} onClose={() => setOpenModal(false)} className={classes.modal}>
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component="h2">
                    {selectedEvent?.event.title}
                    </Typography>
                    <Typography variant="body1" component="p">
                    {selectedEvent?.event.description}
                    </Typography>
                    <Typography variant="body1" component="p">
                    Fecha inicio: {selectedEvent?.event.start_time}
                    </Typography>
                    <Typography variant="body1" component="p">
                    Fecha fin: {selectedEvent?.event.end_time}
                    </Typography>
                    <Typography variant="body1" component="p">
                    Lugar: {selectedEvent?.event.location}
                    </Typography>
                    <Box flexDirection={'row'} padding={2}>
                        <Button variant="contained" style={{marginRight: 10}} color="primary" onClick={() => updateStatus(selectedEvent,'accepted')}>
                            Aceptar
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => updateStatus(selectedEvent,'rejected')}>
                            Rechazar
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Modal>    
        </>
    );
};

export default ListEvents;
