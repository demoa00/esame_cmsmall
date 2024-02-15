import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Row, Col } from 'react-bootstrap';

import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { IoTrash } from 'react-icons/io5';



const URL = "http://localhost:3001/";

function MyButtons(props) {
    return (
        <Col className="d-flex align-items-center">
            <Col>
                <Col>
                    <Button variant='primary' onClick={() => props.pos > 0 ? props.upComponent() : {}} style={{ marginLeft: '10px', paddingLeft: '3px', paddingRight: '3px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                        <BsArrowUpShort size={18} />
                    </Button>
                </Col>
                <Col>
                    <Button variant='primary' onClick={() => props.pos < props.length - 1 ? props.downComponent() : {}} style={{ marginLeft: '10px', paddingLeft: '3px', paddingRight: '3px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                        <BsArrowDownShort size={18} />
                    </Button>
                </Col>
            </Col>
            <Col>
                <Button variant='danger' onClick={() => props.deleteComponent()} style={{ marginLeft: '10px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '0px', paddingBottom: '0px', fontSize: '10' }}>
                    <IoTrash size={16} />
                </Button>
            </Col>
        </Col>
    );
}

function MyImageSelect(props) {
    let image_select = [];

    for (let i = 0; i < props.images_path.length; i++) {
        image_select.push(
            <Col key={i} className="d-flex flex-column align-items-center">
                <img src={`${URL + props.images_path[i].path}`} style={{ width: '143px', height: '90px', margin: '10px' }} />
                <Form.Check inline name={`group${props.component.pos}`} type="radio" required value={props.images_path[i].path} onChange={props.valueHandle} checked={props.list_value_component[props.component.pos].value === props.images_path[i].path ? true : false} />
            </Col>
        );
    }
    return (
        <Row style={{ width: '30rem' }}>
            {image_select}
        </Row>
    );
}

function MyEditComponent(props) {
    let component = props.component;
    let list_value_component = props.list_value_component;

    const valueHandle = (event) => {
        let value = event.target.value;

        props.setListValueComponent((old_value) =>
            old_value.map((v) => {
                if (v.pos == component.pos) {
                    return { ...v, value: value };
                } else {
                    return v;
                }
            }));
    }

    const deleteComponent = () => {
        props.setListValueComponent((old_value) =>
            old_value.filter((v) => v.pos != component.pos).map((v) => {
                if (v.pos < component.pos) {
                    return v;
                } else if (v.pos > component.pos) {
                    return { ...v, pos: v.pos - 1 };
                }
            }))
    }

    const upComponent = () => {
        props.setListValueComponent((old_value) =>
            old_value.map((v) => {
                if (v.pos == component.pos - 1) {
                    return { ...v, pos: v.pos + 1 };
                } else if (v.pos == component.pos) {
                    return { ...v, pos: v.pos - 1 };
                } else {
                    return v;
                }
            }).sort((v1, v2) => v1.pos - v2.pos)
        )
    }

    const downComponent = () => {
        props.setListValueComponent((old_value) =>
            old_value.map((v) => {
                if (v.pos == component.pos) {
                    return { ...v, pos: v.pos + 1 };
                } else if (v.pos == component.pos + 1) {
                    return { ...v, pos: v.pos - 1 };
                } else {
                    return v;
                }
            }).sort((v1, v2) => v1.pos - v2.pos)
        )
    };

    switch (component.type) {
        case 'header':
            return (
                <FormGroup className="d-flex flex-row align-items-center" style={{ margin: '20px' }}>
                    <Col>
                        <Form.Label style={{ marginRight: '10px' }}>Header</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control type='text' required className="border border-dark" value={list_value_component[component.pos].value} onChange={valueHandle} style={{ width: '30rem', height: '2rem' }} />
                    </Col>
                    <MyButtons pos={component.pos} length={list_value_component.length} upComponent={upComponent} downComponent={downComponent} deleteComponent={deleteComponent} />
                </FormGroup>
            );
        case 'paragraph':
            return (
                <FormGroup className="d-flex flex-row align-items-center" style={{ margin: '20px' }}>
                    <Col>
                        <Form.Label style={{ marginRight: '10px' }}>Paragraph</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control as="textarea" required className="border border-dark" rows={3} value={list_value_component[component.pos].value} onChange={valueHandle} style={{ width: '30rem', height: '10rem' }} />
                    </Col>
                    <MyButtons pos={component.pos} length={list_value_component.length} upComponent={upComponent} downComponent={downComponent} deleteComponent={deleteComponent} />
                </FormGroup>
            );
        case 'image':
            return (
                <FormGroup className="d-flex flex-row align-items-center" style={{ margin: '20px' }}>
                    <Col>
                        <Form.Label style={{ marginRight: '10px' }}>Image</Form.Label>
                    </Col>
                    <Col>
                        <MyImageSelect images_path={props.images_path} valueHandle={valueHandle} list_value_component={list_value_component} component={component} />
                    </Col>
                    <MyButtons pos={component.pos} length={list_value_component.length} upComponent={upComponent} downComponent={downComponent} deleteComponent={deleteComponent} />
                </FormGroup>
            );
        default:
            break;
    }
}

export default MyEditComponent;