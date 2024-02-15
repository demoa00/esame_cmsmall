import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

import MyGridCards from './MyGridCards';
import API from '../API';



function MyMain(props) {
    const { backoffice } = useParams();

    useEffect(() => {
        if (props.logged_in && backoffice === 'backoffice') {
            API.getAllCreatedPages().then((l) => props.setPagesList(l)).catch(() => navigate("/page-not-found"));
            props.setBackOffice(true);
        } else {
            API.getAllPublishedPages().then((l) => props.setPagesList(l)).catch(() => navigate("/page-not-found"));
            props.setBackOffice(false);
        }
    }, [props.logged_in, backoffice]);

    return (
        <Container fluid style={{ padding: '0px' }}>
            <MyGridCards backoffice={backoffice} pages_list={props.pages_list} order={props.order} setOrder={props.setOrder} user={props.user} logged_in={props.logged_in} />
        </Container>
    );
}

export default MyMain;