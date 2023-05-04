import {Outlet} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const BarraNavigazione = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container className='mx-5'>
                    <Navbar.Brand href="/">Previsione prezzi auto</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/Predict">Previsione singola</Nav.Link>
                            <Nav.Link href="/PredictFile">Previsione da file</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </>
    );
};

export default BarraNavigazione;