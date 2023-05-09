import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {useApolloClient} from "@apollo/react-hooks";
import { getQuery } from '../../utils/apollo_util';
import {getUsers} from './queries.graphql';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TablePagination,
    Box, 
    TextField
} from "@material-ui/core";
import useDebounce from "../App/Hooks/useDebounce";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const ListEvents = () => {
  const classes = useStyles(),
    apolloClient = useApolloClient(),
    [pag, setPag] = useState(0),
    [num, setNum] = useState(0),
    [ord, setOrd] = useState('createdAt'),
    [asc, setAsc] = useState(false),
    [query, setQuery] = useState(''),
    [userData, setUserData] = useState([]),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(''),
    debQuery = useDebounce(query, 1000),
    [data, setData] = useState([]);

    const getData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getQuery(apolloClient, getUsers, {
                pag,
                num,
                ord,
                asc,
                query
            });
            setData(result.users)
            setUserData(result.users.edges.map(edge => edge.node))
            setLoading(false)
        } catch (error) {
            console.log('Error listado de usuarios', error)
            setError(error)
        }
    }, [apolloClient, setLoading, debQuery, pag, num, ord, asc,]);

    useEffect(() => {
        getData()
        if (debQuery) setPag(0);
    }, [pag, num, ord, asc, debQuery]);

    const handleChangePage = (event, newPage) => {
        setPag(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setNum(parseInt(event.target.value, 10));
        setPag(0);
      };

    if (loading) return <CircularProgress />;
    if (error) return <p>Error</p>;

    return (
        <>
            <Box width='400px' p='10px 24px'>
                <TextField variant="outlined" fullWidth label={"Buscar..."} value={query} onChange={e => setQuery(e.target.value)} />
            </Box>
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.totalCount}
                rowsPerPage={num}
                page={pag}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default ListEvents;
