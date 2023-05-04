import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Spinner from "react-bootstrap/Spinner";

class PredictFile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAllert:false,
            prediction:[],
            selectedFile:"",
            filename:"",
            Risultato:"",
            showspinner:false,
            showdownload:false,
        };
        this.onInputchange = this.onInputchange.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    onInputchange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async handleFileUpload(event) {
        await this.setState({
            selectedFile: event.target.files[0]
        });
    }

    onSubmitForm(event) {
        event.preventDefault()
        if(this.state.selectedFile===""){
            this.setState({ showAllert: true })
            this.setState({ variant: 'danger' })
            this.setState({ Risultato: 'Selezionare un file' })
        }else{
            const formData = new FormData();
            var file = new File([this.state.selectedFile], `test.csv`);
            formData.append("test.csv", file);
            this.setState({ showAllert: false })
            this.setState({showdownload: false})
            this.setState({showspinner:true})

            axios.post('http://localhost:5000/predictfile',
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then((response)=> {
                this.setState({ filename: response.data })
                this.setState({ showAllert: true })
                this.setState({variant:'success'})
                this.setState({Risultato:"Elaborazione conclusa scaricare il file di risultato"})
                this.setState({showdownload:true})
                this.setState({showspinner:false})
            })
                .catch(()=> {
                    this.setState({ showAllert: true })
                    this.setState({ variant: 'danger' })
                    this.setState({ Risultato: 'I dati presenti nel file non sono elaborabili' })
                    this.setState({showdownload:false})
                    this.setState({showspinner:false})
                });
        }

    }
    downloadFile() {
        fetch('http://localhost:5000/download/' + this.state.filename, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/csv',
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `Prediction.csv`,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
            });
    }

    render() {
        return (
            <Container className='mx-5 mt-3'>
                <h3>Caricare un file per avere la previsione dei prezzi</h3>

                <strong>Caricare un file csv contenente le colonne: Levy, Manufacturer, Model, Prod. year, Category, Leather interior, Fuel type, Engine volume, Mileage, Cylinders, Gear box type, Drive wheels, Doors, Wheel, Color, Airbags <br/>
                Le righe con dati che non rispettano le limitazione (esempio sulla previsione singola) verrano rimosse</strong>
                <Alert show={this.state.showAllert} key={this.state.variant} variant={this.state.variant} className="mt-3">
                    {this.state.Risultato}
                </Alert>
                <Form onSubmit={this.onSubmitForm} style={{ maxWidth: 400 }} className="mt-3">
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Carica un file</Form.Label>
                        <Form.Control type="file" onChange={(e)=>this.handleFileUpload(e)} accept=".csv"/>
                    </Form.Group>
                    <Button variant="primary" type="submit" value="Submit">
                        Elabora
                    </Button>
                </Form>
                <Spinner animation="border" variant="primary" hidden={!this.state.showspinner} className="my-3"/>
                <br/>
                <Button variant="success" onClick={()=>this.downloadFile()} className="my-3" hidden={!this.state.showdownload}>
                    Scarica
                </Button>
            </Container>

        )
    };



}
export default PredictFile;