import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';



const URL = "http://localhost:3001/";

function MyComponentPage(props) {
    let component = props.component;

    switch (component[0]) {
        case 'header':
            return (
                <Card.Header style={{ backgroundColor: '#0dcaf0b5', border: '2px solid #0dcaf0b5' }}>
                    {component[1]}
                </Card.Header>
            );
        case 'paragraph':
            return (
                <Card.Text style={{ margin: '10px' }}>
                    {component[1]}
                </Card.Text>
            );
        case 'image':
            return (<Card.Img src={URL + component[1]} style={{ width: '286px', height: '180px', margin: '10px' }} />);
        default:
            props.setError(true);
            return (<Card.Text style={{ backgroundColor: '#dc3545', textAlign: 'center' }}>Page object corrupted</Card.Text>)
    }
}

export default MyComponentPage;