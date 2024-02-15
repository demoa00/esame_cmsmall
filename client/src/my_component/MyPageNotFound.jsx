import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Container, Row } from 'react-bootstrap';

import { TbTruckReturn } from 'react-icons/tb';



function MyPageNotFound() {
    return (
        <Container style={{ paddingTop: '2rem', textAlign: 'center' }}>
            <Row>
                <Alert variant='danger'>
                    <span style={{ fontSize: 50 }}>Page not found!</span><br />
                    <span style={{ fontSize: 24 }}>Press the button to go back</span>
                </Alert>
            </Row>
            <Row>
                <Link to='/'>
                    <Button variant='danger'>
                        <TbTruckReturn size='24' />
                    </Button>
                </Link>
            </Row>
        </Container>
    );
}

export default MyPageNotFound;