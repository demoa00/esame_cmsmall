import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Form, FormGroup, Row, Button, Alert } from 'react-bootstrap';

import { CgLogIn } from 'react-icons/cg';
import { BsBuildingFillGear } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';

import API from '../API';



function MyLogin(props) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('bob@test.it');
    const [password, setPassword] = useState('pwd');

    const [error_msg, setErrorMsg] = useState('');

    const usernameHandle = (event) => {
        let value = event.target.value;
        setUsername(value);
    };

    const passwordHandle = (event) => {
        let value = event.target.value;
        setPassword(value);
    };

    const submitHandle = (event) => {
        event.preventDefault();

        const credentials = { username, password };

        API.login(credentials).then(user => {
            setErrorMsg('');
            props.loginSuccessful(user);
        }).catch(() => setErrorMsg('Wrong username or password!'));

    }

    return (
        <Container fluid className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <Card className='d-flex justify-content-center align-items-center' style={error_msg === '' ? { height: '31rem', width: '20rem', backgroundColor: 'black', color: 'white', textAlign: 'center' }
                : { height: '40rem', width: '20rem', backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
                <Card.Header as='h2' className='d-flex align-content-center align-items-center' style={{ paddingBottom: '0' }}>
                    <BsBuildingFillGear size={40}/>
                    CSM mall
                </Card.Header>
                <Card.Header as='h3' style={{ padding: '0' }}>
                    Login
                </Card.Header>
                <Card.Body style={{ width: '16rem' }}>
                    <FaUserCircle size={80} />
                    {error_msg ?
                        <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>
                            <Alert.Heading>Error!</Alert.Heading>
                            <p>{error_msg}</p>
                        </Alert>
                        :
                        <></>
                    }
                    <Form onSubmit={submitHandle} style={{ paddingTop: '10px' }}>
                        <Row>
                            <FormGroup>
                                <Form.Label style={{ fontSize: 20 }}>Username</Form.Label>
                                <Form.Control required type='username' value={username} onChange={usernameHandle} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Form.Label style={{ fontSize: 20 }}>Password</Form.Label>
                                <Form.Control required type='password' value={password} onChange={passwordHandle} />
                            </FormGroup>
                        </Row>
                        <Row style={{ display: 'block', paddingTop: '1.5rem' }}>
                            <Button type='submit' variant='secondary' style={{ width: '3.5rem', paddingTop: '10px', paddingBottom: '10px' }}>
                                <CgLogIn size={24} />
                            </Button>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Button variant='outline-danger' onClick={() => navigate('/')}>
                        Return to home page
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default MyLogin;