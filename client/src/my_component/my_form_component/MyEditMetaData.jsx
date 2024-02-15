import dayjs from 'dayjs';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormGroup, Row, Col} from 'react-bootstrap';



const URL = "http://localhost:3001/";

function MyUserSelect(props) {
    let tmp_list_users = props.list_users.filter((u) => u.id != props.page.author_id);
    tmp_list_users.unshift({ id: props.page.author_id, name: props.page.author_name });

    return (
        <>
            <Form.Select id='name' className="border border-dark" onChange={props.valueHandle} style={{ margin: '10px' }}>
                {
                    tmp_list_users.map((u, key) => {
                        return (
                            <option key={key} value={u.id}>{u.name}</option>
                        );
                    })
                }
            </Form.Select>
        </>
    );
}

function MyEditMetaData(props) {
    const valueHandle = (event) => {
        let id = event.target.id;
        let value = event.target.value;

        switch (id) {
            case 'title':
                props.setValuePageMetaData((old_value) => ({ ...old_value, title: value }));
                break;
            case 'name':
                props.setValuePageMetaData((old_value) => ({ ...old_value, author_id: value }));
                break;
            case 'p_date':
                props.setValuePageMetaData((old_value) => ({ ...old_value, publication_date: value }));
                break;
            default:
                console.log("Wrong id");
                break;
        }
    }

    return (
        <Row className="d-flex flex-row align-items-center" style={{ margin: '20px', textAlign: 'center' }}>
            {
                props.page
                    ?
                    < Col >
                        <FormGroup className="d-flex flex-column align-items-center">
                            <Form.Label>{'Title: '}</Form.Label>
                            <Form.Control id='title' type="text" required className="border border-dark" value={props.value_page_meta_data.title} onChange={valueHandle} style={{ margin: '10px' }}></Form.Control>
                        </FormGroup>
                    </Col>
                    :
                    <Col>
                        <FormGroup className="d-flex flex-column align-items-center">
                            <Form.Label>{'Title: '}</Form.Label>
                            <Form.Control id='title' type="text" required className="border border-dark" onChange={valueHandle} style={{ margin: '10px' }}></Form.Control>
                        </FormGroup>
                    </Col>
            }
            {
                props.page
                    ?
                    <>
                        {
                            props.logged_in
                                ?
                                <>
                                    {
                                        props.user.admin == 1
                                            ?
                                            <Col>
                                                <FormGroup className="d-flex flex-column align-items-center">
                                                    <Form.Label>{'Author: '}</Form.Label>
                                                    <MyUserSelect page={props.page} list_users={props.list_users} valueHandle={valueHandle} />
                                                </FormGroup>
                                            </Col>
                                            :
                                            <Col>
                                                <FormGroup>
                                                    <Form.Label>
                                                        {`Author: ${props.page.author_name}`}
                                                    </Form.Label>
                                                </FormGroup>
                                            </Col>
                                    }
                                </>
                                :
                                <></>
                        }
                    </>
                    :
                    <></>
            }
            {
                props.page
                    ?
                    <Col>
                        <FormGroup>
                            <Form.Label>
                                {`Creation date: ${dayjs(props.page.creation_date).format('D MMM, YYYY')}`}
                            </Form.Label>
                        </FormGroup>
                    </Col>
                    :
                    <></>
            }
            {
                props.page
                    ?
                    <Col>
                        <FormGroup className="d-flex flex-column align-items-center">
                            <Form.Label>{'Publication date: '}</Form.Label>
                            <Form.Control id='p_date' type="date" className="border border-dark" value={props.value_page_meta_data.publication_date} onChange={valueHandle} style={{ margin: '10px' }}></Form.Control>
                        </FormGroup>
                    </Col>
                    :
                    <Col>
                        <FormGroup className="d-flex flex-column align-items-center">
                            <Form.Label>{'Publication date: '}</Form.Label>
                            <Form.Control id='p_date' type="date" className="border border-dark" onChange={valueHandle} style={{ margin: '10px' }}></Form.Control>
                        </FormGroup>
                    </Col>
            }
        </Row >
    );
}

export default MyEditMetaData;