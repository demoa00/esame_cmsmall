import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, FormGroup, Navbar } from 'react-bootstrap';

import { BsBuildingFillGear } from 'react-icons/bs';
import { FaPencilAlt, FaUserCircle } from 'react-icons/fa';
import { LuDelete } from 'react-icons/lu';
import { HiOutlineLogout } from 'react-icons/hi';

import API from '../API';



function MyNavbar(props) {
    const navigate = useNavigate();

    const [edit_title, setEditTitle] = useState(false);
    const [title, setTitle] = useState('');
    const [value_title, setValueTitle] = useState('');

    useEffect(() => {
        if (edit_title === false) {
            API.getTitle().then((title) => { setTitle(title); setValueTitle(title); }).catch((err) => { console.log(err); navigate("/page-not-found"); });
        }
    }, []);

    const titleHandle = (event) => {
        let value = event.target.value;
        setValueTitle(value);
    };

    const submitHandle = (event) => {
        event.preventDefault();

        API.updateTitle(value_title).then((new_title) => { setEditTitle(false); setTitle(new_title); setValueTitle(new_title); }).catch((err) => { console.log(err); navigate("/page-not-found"); });
    }

    return (
        <Navbar variant='dark' style={{ backgroundColor: 'black' }}>
            <Container fluid className='d-flex justify-content-between'>
                <Navbar.Brand className='d-flex align-items-center'>
                    <BsBuildingFillGear size={32} />
                    {
                        props.logged_in
                            ?
                            <>
                                {
                                    (props.user.admin && props.backoffice)
                                        ?
                                        <>
                                            {
                                                edit_title
                                                    ?
                                                    <Form className='d-flex align-items-center' onSubmit={submitHandle}>
                                                        <FormGroup style={{ marginRight: '5px' }}>
                                                            <Form.Control type='text' required value={value_title} onChange={titleHandle} style={{ width: '10rem', height: '1.5rem' }} />
                                                        </FormGroup>
                                                        <Button type='submit' className='btn-xs' variant='success' style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                                                            <FaPencilAlt size={12} />
                                                        </Button>
                                                        <Button className='btn-xs' variant='danger' onClick={() => { setEditTitle(false); setValueTitle(title); }} style={{ marginLeft: '5px', paddingLeft: '5px', paddingRight: '5px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                                                            <LuDelete size={14} />
                                                        </Button>
                                                    </Form>
                                                    :
                                                    <>
                                                        <label style={{ marginRight: '5px' }}>{title}</label>
                                                        <Button variant='dark' className='btn-xs' onClick={() => setEditTitle(true)} style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                                                            <FaPencilAlt size={12} />
                                                        </Button>
                                                    </>

                                            }
                                        </>
                                        :
                                        <label style={{ marginRight: '5px' }}>{title}</label>
                                }
                            </>
                            :
                            <label style={{ marginRight: '5px' }}>{title}</label>
                    }
                </Navbar.Brand>
                {
                    props.logged_in
                        ?
                        <>
                            <Navbar.Brand>
                                {`Welcome, ${props.user.name}`}
                            </Navbar.Brand>

                            <Navbar.Brand>
                                {`Role: ${props.user.admin ? 'admin' : 'simple user'}`}
                            </Navbar.Brand>

                            <Navbar.Brand>
                                <Button variant='dark' onClick={() => { setEditTitle(false); props.doLogout(); }}>
                                    <HiOutlineLogout size={26} />
                                </Button>
                            </Navbar.Brand>
                        </>
                        :
                        <Navbar.Brand>
                            <Button variant='dark' onClick={() => { navigate('/login'); }}>
                                <FaUserCircle size={26} />
                            </Button>
                        </Navbar.Brand>
                }
            </Container>
        </Navbar>
    );
}

export default MyNavbar;