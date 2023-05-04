
import React from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal'


class ResultModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Prediction:props.Prediction
        };
        this.handleClose = props.onClose
    }

    render() {
        return (
            <Container className='mx-5 mt-3'>
                <Modal size="sm" show={this.props.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Costo previsto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            {this.props.Prediction}
                        </p>
                    </Modal.Body>
                </Modal>

            </Container>
        )
    };



}
export default ResultModal;