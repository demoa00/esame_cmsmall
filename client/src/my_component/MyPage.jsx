import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import dayjs from 'dayjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';

import { FaArrowLeft } from 'react-icons/fa';
import { GoGear } from 'react-icons/go';
import { IoTrash } from 'react-icons/io5';

import API from '../API';



const URL = "http://localhost:3001/";

const style = {
    metadata: {
        borderRadius: '8px',
        border: '1px solid #d4c097',
        margin: '10px'
    },
    page: {
        card: {
            width: '30rem',
            border: '2px solid #bdab87',
            borderRadius: '7px'
        },
        header: {
            backgroundColor: '#d4c097'
        },
        paragraph: {
            margin: '10px'
        },
        image: {
            width: '286px',
            height: '180px',
            margin: '10px'
        }
    }
};

function MyComponent(props) {
    let component = props.component;

    switch (component.type) {
        case 'header':
            return (
                <Card.Header style={style.page.header}>
                    {component.value}
                </Card.Header>
            );
        case 'paragraph':
            return (
                <Card.Text style={style.page.paragraph}>
                    {component.value}
                </Card.Text>
            );
        case 'image':
            return (<Card.Img src={URL + component.value} style={style.page.image} />);
        default:
            break;
    }
}

function MyPage(props) {
    const navigate = useNavigate();

    const [load, setLoad] = useState(true);

    let { id } = useParams();

    useEffect(() => {
        if (load === true) {
            API.getPageDataById(id).then((p) => {
                props.setPage(p);
                setLoad(false);
            }).catch((err) => { console.log(err); navigate("/page-not-found"); });
        }
    }, [load]);

    return (
        <>
            {
                load
                    ?
                    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '10rem' }}>
                        <Spinner animation="grow" variant="dark" />
                    </Container>
                    :
                    <Container fluid style={{ marginTop: '10px' }}>
                        <Row className='dflex justify-content-between' style={{ textAlign: 'center', padding: '10px' }}>
                            <Col style={style.metadata}>
                                {`Title: ${props.page.title}`}
                            </Col>
                            <Col style={style.metadata}>
                                {`Author name: ${props.page.author_name}`}
                            </Col>
                            <Col style={style.metadata}>
                                {`Creation date: ${dayjs(props.page.creation_date).format('D MMM, YYYY')}`}
                            </Col>
                            <Col style={style.metadata}>
                                {`Publication date: ${props.page.publication_date ? dayjs(props.page.publication_date).format('D MMM, YYYY') : '-'}`}
                            </Col>
                            <Col style={style.metadata}>
                                {`Status: ${props.page.status}`}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col className={(props.logged_in && (props.user.id == props.page.author_id || props.user.admin == 1) && props.backoffice) ? "d-flex align-items-start" : "d-flex align-items-start col-3"} style={{ padding: '0px' }}>
                                <Button variant='dark' onClick={() => { props.backoffice ? navigate('/backoffice') : navigate('/') }} style={{ marginLeft: '10px' }}>
                                    <FaArrowLeft />
                                </Button>
                            </Col>
                            <Col>
                                <Card style={style.page.card}>
                                    {props.page.content.map((c, key) => (<MyComponent key={key} component={c} />))}
                                </Card>
                            </Col>
                            {
                                (props.logged_in && (props.user.id == props.page.author_id || props.user.admin == 1) && props.backoffice)
                                    ?
                                    <Col className="d-flex flex-column align-items-end justify-content-start" style={{ padding: '0px' }}>
                                        <Button variant='primary' onClick={() => navigate(`/edit/${props.page.id}`)} style={{ paddingLeft: '9.5px', paddingRight: '9.5px', marginRight: '10px' }}>
                                            <GoGear size={21} />
                                        </Button>
                                        <Button variant='danger' onClick={() => API.deletePage(props.page.id).then(() => { props.backoffice ? navigate('/backoffice') : navigate('/') }).catch((err) => { console.log(err); navigate("/page-not-found"); })} style={{ paddingLeft: '9.5px', paddingRight: '9.5px', marginTop: '10px', marginRight: '10px' }}>
                                            <IoTrash size={21} />
                                        </Button>
                                    </Col>
                                    :
                                    <></>
                            }
                        </Row>
                    </Container>
            }
        </>
    );
}

export default MyPage;