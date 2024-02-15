import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Row } from 'react-bootstrap';

import { HiDocumentPlus } from 'react-icons/hi2';
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from 'react-icons/tb';
import { BiShowAlt, BiWindowAlt } from 'react-icons/bi';



function MyGridCards(props) {
    const navigate = useNavigate();

    const orderAsc = (p1, p2) => {
        if (p1.status == 'draft') {
            return -1;
        } else {
            return dayjs(p1.publication_date).diff(dayjs(p2.publication_date));
        }
    };

    const orderDesc = (p1, p2) => {
        if (p2.status == 'draft') {
            return -1;
        } else {
            return dayjs(p2.publication_date).diff(dayjs(p1.publication_date));
        }
    };

    return (
        <>
            <Row style={{ margin: '0px' }}>
                {
                    props.order
                        ?
                        <Col className='d-flex justify-content-center align-items-center' style={{ height: '3rem', padding: '0px' }}>
                            <Button variant='dark' className='d-flex justify-content-center align-items-center' onClick={() => props.setOrder(false)} style={{ width: '15rem', height: '2rem' }}>
                                Order by publication date <TbSortDescendingNumbers size={22} />
                            </Button>
                        </Col>
                        :
                        <Col className='d-flex justify-content-center align-items-center' style={{ height: '3rem', padding: '0px' }}>
                            <Button variant='dark' className='d-flex justify-content-center align-items-center' onClick={() => props.setOrder(true)} style={{ width: '15rem', height: '2rem' }}>
                                Order by publication date <TbSortAscendingNumbers size={22} />
                            </Button>
                        </Col>
                }
                {
                    props.logged_in
                        ?
                        <>
                            {
                                props.backoffice
                                    ?
                                    <Col className='d-flex justify-content-center align-items-center' style={{ padding: '0px' }}>
                                        <Button variant='dark' className='d-flex justify-content-center align-items-center' onClick={() => navigate('/add')} style={{ width: '15rem', height: '2rem' }}>
                                            Add new page <HiDocumentPlus size={24} />
                                        </Button>
                                    </Col>
                                    :
                                    <></>
                            }
                            <Col className='d-flex justify-content-center align-items-center' style={{ padding: '0px' }}>
                                <Button variant='dark' className='d-flex justify-content-center align-items-center' onClick={() => { props.backoffice === 'backoffice' ? navigate('/') : navigate('/backoffice') }} style={{ width: '15rem', height: '2rem' }}>
                                    {props.backoffice === 'backoffice' ? 'Go to front-office' : 'Go to back-office'} <BiWindowAlt size={24} />
                                </Button>
                            </Col>
                        </>
                        :
                        <></>
                }
            </Row>
            <Row xs={1} md={2} className="g-4" style={{ margin: '10px' }}>
                {
                    props.pages_list.sort(props.order ? (p1, p2) => orderDesc(p1, p2) : (p1, p2) => orderAsc(p1, p2)).map((page) => (
                        <Col key={page.id}>
                            <Card style={{ backgroundColor: '#ecd7ad', border: '1px solid #d4c097' }}>
                                <Card.Body>
                                    <Card.Title style={{ backgroundColor: '#d4c097', border: '1px solid #bdab87', borderRadius: '10px', padding: '5px' }}>
                                        {page.title}
                                    </Card.Title>
                                    <Card.Text>
                                        {`By ${page.author_name}`}
                                    </Card.Text>
                                    <Card.Text>
                                        {`Creation: ${dayjs(page.creation_date).format('D MMM, YYYY')}`}
                                        <br />
                                        {`Publication: ${page.publication_date ? dayjs(page.publication_date).format('D MMM, YYYY') : '-'}`}
                                    </Card.Text>
                                    <Card.Text className='d-flex justify-content-end align-items-end'>
                                        <Button className='btn btn-outline-dark' onClick={() => navigate(`/pages/${page.id}`)} style={{ backgroundColor: '#d4c097', border: '1px solid #bdab87', padding: '6px' }}>
                                            <BiShowAlt size={30} />
                                        </Button>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </>
    );
}

export default MyGridCards;