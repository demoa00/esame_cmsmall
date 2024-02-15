import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Container, Form, Row, Col, Spinner } from 'react-bootstrap';

import { BsSaveFill } from 'react-icons/bs';
import { FaArrowLeft } from 'react-icons/fa';
import { TbHexagonLetterH, TbHexagonLetterI, TbHexagonLetterP } from 'react-icons/tb';

import API from '../../API';
import MyEditMetaData from './MyEditMetaData';
import MyEditComponent from './MyEditComponent';



function MyEditPage(props) {
    const navigate = useNavigate();

    const [images_path, setImagesPath] = useState([]);
    const [list_users, setListUsers] = useState([]);

    const [value_page_meta_data, setValuePageMetaData] = useState(props.page != undefined ? {
        title: props.page.title,
        author_id: props.page.author_id,
        publication_date: props.page.publication_date
    } : undefined);
    const [list_value_component, setListValueComponent] = useState(props.page != undefined ? props.page.content : []);

    const [error, setError] = useState('');
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (load === true) {
            if (props.logged_in) {
                if (props.user.admin == 1) {
                    API.getAllUsers().then((l) => { setListUsers(l); setLoad(false); });
                    API.getImagesPath().then((l) => { setImagesPath(l); setLoad(false); });
                } else {
                    API.getImagesPath().then((l) => { setImagesPath(l); setLoad(false); });
                }
            }
        }
    }, [load]);

    const addComponent = (type) => {
        setListValueComponent([...list_value_component, { pos: list_value_component.length, type: type, value: '' }]);
    }

    const submitHandle = (event) => {
        event.preventDefault();

        let one_header = 0;
        let one_other_component = 0;

        list_value_component.forEach(v => {
            if (v.type == 'header') {
                one_header++;
            } else if (v.type == 'paragraph' || v.type == 'image') {
                one_other_component++;
            }
        });

        let err_msg = '';
        if (one_header < 1) {
            err_msg += 'The page require at least one header component!';
        }
        if (one_other_component < 1) {
            err_msg += ' The page require at least one component between paragraph or image!';
        }
        if (value_page_meta_data.publication_date != '') {
            if (props.page) {
                if (dayjs(value_page_meta_data.publication_date).diff(dayjs(props.page.creation_date), 'day') < 0) {
                    err_msg += ' The publication date cannot be earlier than the creation date!';
                }
            } else {
                if (dayjs(value_page_meta_data.publication_date).diff(dayjs(), 'day') < 0) {
                    err_msg += ' The publication date cannot be earlier than the creation date!';
                }
            }
        }

        if (err_msg === '') {
            if (props.page != undefined) {
                let new_page = {
                    id: props.page.id,
                    author_id: value_page_meta_data.author_id,
                    content: list_value_component,
                    title: value_page_meta_data.title,
                    creation_date: props.page.creation_date,
                    publication_date: value_page_meta_data.publication_date ? value_page_meta_data.publication_date : ''
                }

                API.updatePage(new_page).then(() => { setError(''); navigate('/backoffice'); }).catch(() => setError('Error in updating page!'));
            } else {
                let new_page = {
                    content: list_value_component,
                    title: value_page_meta_data.title,
                    publication_date: value_page_meta_data.publication_date ? value_page_meta_data.publication_date : ''
                }

                API.addNewPage(new_page).then(() => { setError(''); navigate('/backoffice'); }).catch(() => setError('Error in adding page!'));
            }
        } else {
            setError(err_msg);
        }
    }

    return (
        load
            ?
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '10rem' }}>
                <Spinner animation="grow" variant="dark" />
            </Container>
            :
            <Container fluid style={{ marginTop: '10px' }}>
                <Row>
                    <Col>
                        <Button variant='danger' onClick={() => { props.logged_in ? navigate(props.page ? `/pages/${props.page.id}` : '/backoffice') : navigate(props.page ? `/pages/${props.page.id}` : '/') }} >
                            <FaArrowLeft page={props.page} />
                        </Button>
                    </Col>
                </Row>
                <Form className='d-flex flex-column justify-content-center' onSubmit={submitHandle} style={{ marginTop: '20px', fontSize: '20px', textAlign: 'center' }}>
                    {
                        error != ''
                            ?
                            <Alert variant="danger" onClose={() => setError('')} dismissible>
                                <Alert.Heading>Error!</Alert.Heading>
                                <p>{error}</p>
                            </Alert>
                            :
                            <></>
                    }
                    <MyEditMetaData page={props.page} list_users={list_users} value_page_meta_data={value_page_meta_data} setValuePageMetaData={setValuePageMetaData} user={props.user} logged_in={props.logged_in} />
                    <Row>
                        <Row>
                            {list_value_component.map((c, key) => (<MyEditComponent key={key} component={c} images_path={images_path} list_value_component={list_value_component} setListValueComponent={setListValueComponent} />))}
                        </Row>
                        <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <Col className="d-flex flex-row justify-content-between col-7">
                                <Button variant='dark' onClick={() => addComponent("header")}>
                                    + Header <TbHexagonLetterH size={20} />
                                </Button>
                                <Button variant='dark' onClick={() => addComponent("paragraph")}>
                                    + Paragraph <TbHexagonLetterP size={20} />
                                </Button>
                                <Button variant='dark' onClick={() => addComponent("image")}>
                                    + Image <TbHexagonLetterI size={20} />
                                </Button>
                            </Col>
                            <Col className="col-5">
                                <Button type='submit' variant='success' className='btn-xs'>
                                    <BsSaveFill size={26} /> Save
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Form>
            </Container>
    );
}

export default MyEditPage;