import React, { useContext, useCallback } from 'react';
import App from '../../components/App/Context/App';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CreateEvent from '../Event/CreateEvent';
import ListEvents from '../Event/ListEvents';
import ListUsers from '../User/ListUsers';
import UserNotifications from '../Notification/Notifications';
import AddUserEvent from '../Event/AddUserEvent';
import Cookies from 'js-cookie';

const useStyles = makeStyles({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function Menu({ data }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const {setSession, session} = useContext(App);

    let content;

    switch (value) {
        case 0:
            content = <ListEvents />;
        break;
        case 1:
            content = <CreateEvent />;
        break;
        case 2:
            content = <AddUserEvent />;
        break;
        case 3:
            content = <ListUsers />;
        break;
        case 4:
            content = <UserNotifications />;
        break;
        default:
        content = <ListEvents />;
}

const logout = useCallback(() => {
    Cookies.remove('session');
    setSession(null);
}, [setSession]);

return (
    <div style={{ flex: 1, width: '100%'}}>
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
            setValue(newValue);
            }}
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction label="Lista de eventos" icon={<ListAltIcon />} />
            <BottomNavigationAction label="Crear evento" icon={<AddCircleIcon />} />
            <BottomNavigationAction label="Añadir usuarios a evento" icon={<GroupAddIcon />} />
            <BottomNavigationAction label="Lista de usuarios" icon={<AssignmentIndIcon />} />
            <BottomNavigationAction label="Notificationes" icon={<NotificationsIcon />} />
            <BottomNavigationAction label="Cerrar Sesion" icon={<ExitToAppIcon />} onClick={logout} />
        </BottomNavigation>
        {content}
    </div>
);
}

export default Menu;
