import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Typeahead } from 'react-bootstrap-typeahead';
import ResultModal from "./ResultModal";
class Predict extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Levy:0,
      Manufacturer: [],
      Model: [],
      Prodyear: 2000,
      Category: [],
      LeatherInterior: false,
      FuelType: [],
      EngineVolume: [],
      Mileage: 0,
      Cylinders: 0,
      GearBoxType: [],
      DriveWheel: [],
      Doors: 0,
      Wheel: [],
      Color: [],
      Airbags: 0,
      Manufacturers: [],
      Models: [],
      Categories: [],
      FuelTypes: [],
      EngineVolumes: [],
      GearBoxTypes: [],
      DriveWheels:[],
      Wheels:[],
      Colors:[],
      showAllert:false,
      modalresultvisible:false,
      prediction:[],
      formenabled:false
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.loadrestrictions()
  }

  async loadrestrictions() {
      axios.get('http://localhost:5000/restrictions')
          .then((response) => {
            // handle success
            var data=response.data
            this.setState({
              Manufacturers: data.Manufacturers,
              Models: data.Models,
              Categories: data.Categories,
              FuelTypes: data.FuelTypes,
              EngineVolumes:data.EngineVolumes,
              GearBoxTypes: data.GearBoxTypes,
              DriveWheels:data.DriveWheels,
              Wheels:data.Wheels,
              Colors:data.Colors
            })
            this.setState({ formenabled: true })
          })
          .catch((error) => {
            // handle error
            console.log(error);
            this.setState({ Risultato: "Errore durante il caricamento" })
            this.setState({ variant: "danger" })
            this.setState({ showAllert: true })
            this.setState({ formenabled: false })
          })
          .finally(function () {
            // always executed
          });


  }
  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  async onChangeManufacturer(selected) {
    await this.setState({
      Manufacturer: selected
    });
  }
  async onChangeModel(selected) {
    await this.setState({
      Model: selected
    });
  }
  async onChangeCategory(selected) {
    await this.setState({
      Category: selected
    });
  }
  async onChangeFuelType(selected) {
    await this.setState({
      FuelType: selected
    });
  }
  async onChangeEngineVolume(selected) {
    await this.setState({
      EngineVolume: selected
    });
  }
  async onChangeGearBoxType(selected) {
    await this.setState({
      GearBoxType: selected
    });
  }
  async onChangeDriveWheel(selected) {
    await this.setState({
      DriveWheel: selected
    });
  }
  async onChangeWheel(selected) {
    await this.setState({
      Wheel: selected
    });
  }
  async onChangeColor(selected) {
    await this.setState({
      Color: selected
    });
  }
  async onInputchangeSelect(text, event) {
    var array = []
    if (event.target.name === "Manufacturer") {
      array = this.state.Manufacturers
    } else if (event.target.name === "Model") {
      array = this.state.Models
    }
    else if (event.target.name === "Category") {
      array = this.state.Categories
    }
    else if (event.target.name === "FuelType") {
      array = this.state.FuelTypes
    }
    else if (event.target.name === "EngineVolume") {
      array = this.state.EngineVolumes
    }
    else if (event.target.name === "GearBoxType") {
      array = this.state.GearBoxTypes
    }
    else if (event.target.name === "DriveWheel") {
      array = this.state.DriveWheels
    }
    else if (event.target.name === "Wheel") {
      array = this.state.Wheels
    }
    else if (event.target.name === "Color") {
      array = this.state.Colors
    }
    if (array.includes(text)) {
      await this.setState({
        [event.target.name]: [text]
      });
    }
    else {
      await this.setState({
        [event.target.name]: []
      });
    }
  }

  onSubmitForm(event) {
    event.preventDefault();
    if (this.state.Manufacturer == "" || this.state.Model == "" || this.state.Category == "" || this.state.FuelType == "" || this.state.EngineVolume == "" || this.state.GearBoxType == "" || this.state.DriveWheel == "" || this.state.Wheel == "" || this.state.Color == "" || this.state.Prodyear === "" || this.state.Mileage === "" || this.state.Doors ===""||this.state.Airbags==="" ||this.state.Cylinders==="" || this.state.Levy==="") {
      this.setState({ Risultato: "Inserire tutti i dati" })
      this.setState({ variant: "danger" })
      this.setState({ showAllert: true })
    }
    else {
      var payload={Manufacturer : this.state.Manufacturer[0], Model: this.state.Model[0], Prodyear: this.state.Prodyear, Category : this.state.Category[0], LeatherInterior : this.state.LeatherInterior, FuelType : this.state.FuelType[0], EngineVolume : this.state.EngineVolume[0], Mileage : this.state.Mileage, Cylinders : this.state.Cylinders,GearBoxType : this.state.GearBoxType[0],DriveWheels : this.state.DriveWheel[0], Doors : this.state.Doors, Wheel : this.state.Wheel[0], Color : this.state.Color[0], Airbags : this.state.Airbags,Levy:this.state.Levy}
      axios.post('http://localhost:5000/predictsingle', payload)
        .then((response) => {
          // handle success
          this.setState({ prediction: response.data[0] })
          this.setState({ showAllert: false })
          this.setState({ modalresultvisible: true })
        })
        .catch((error) => {
          // handle error
          console.log(error);
          this.setState({ Risultato: "Errore nel salvataggio dei dati" })
          this.setState({ variant: "danger" })
          this.setState({ showAllert: true })
        })
        .finally(function () {
          // always executed
        });
    }


  }
  modalCloseResult() {
    this.setState({ modalresultvisible: false })
  }
  render() {
    return (
      <Container className='mx-5 my-3'>
        <h3>Selezionare tutte le caratteristiche per avere la previsione del prezzo</h3>
        <ResultModal  show={this.state.modalresultvisible} onClose={() => this.modalCloseResult()} Prediction={this.state.prediction}/>
        <Alert show={this.state.showAllert} variant={this.state.variant}>
          {this.state.Risultato}
        </Alert>
        <Form onSubmit={this.onSubmitForm} style={{ maxWidth: 400 }}>
          <Form.Group className="mb-3">
            <Form.Label>Produttore</Form.Label>
            <Typeahead id="Manufacturer"
              onChange={(e) => this.onChangeManufacturer(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.Manufacturers}
              placeholder="Seleziona un produttore"
              selected={this.state.Manufacturer} name="Manufacturer" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Modello</Form.Label>
            <Typeahead id="Model"
              onChange={(e) => this.onChangeModel(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.Models}
              placeholder="Seleziona un modello"
              selected={this.state.Model} name="Model" />
          </Form.Group>
          <Form.Group name="Prodyear" className="mb-3" controlId="Prodyear">
            <Form.Label>Anno di produzione</Form.Label>
            <Form.Control type="number" min="1900" max="2100" name="Prodyear" defaultValue={this.state.Prodyear} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
              Inserire l'anno di produzione
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoria</Form.Label>
            <Typeahead id="Category"
              onChange={(e) => this.onChangeCategory(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.Categories}
              placeholder="Seleziona un categoria"
              selected={this.state.Category} name="Category" />
          </Form.Group>
          <Form.Group name="LeatherInterior" className="mb-3" controlId="LeatherInterior">
            <Form.Label>Interno in pelle</Form.Label>
            <Form.Check
              type="switch"
              id="custom-switch"
              name="LeatherInterior" defaultValue={this.state.LeatherInterior} onChange={this.onInputchange}
            /><Form.Text className="text-muted">
              Seleziona se è presente l'interno in pelle
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo di alimentazione</Form.Label>
            <Typeahead id="FuelType"
              onChange={(e) => this.onChangeFuelType(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.FuelTypes}
              placeholder="Seleziona un tipo di alimentazione"
              selected={this.state.FuelType} name="FuelType" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Volume del motore</Form.Label>
            <Typeahead id="EngineVolume"
              onChange={(e) => this.onChangeEngineVolume(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.EngineVolumes}
              placeholder="Seleziona un il volume del motore"
              selected={this.state.EngineVolume} name="EngineVolume" />
          </Form.Group>
          <Form.Group name="Mileage" className="mb-3" controlId="Mileage">
            <Form.Label>Chilometraggio</Form.Label>
            <Form.Control type="number" min="0"  name="Mileage" defaultValue={this.state.Mileage} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
                Inserire il chilometraggio
            </Form.Text>
          </Form.Group>
          <Form.Group name="Cylinders" className="mb-3" controlId="Cylinders">
            <Form.Label>Numero di cilindri</Form.Label>
            <Form.Control type="number" min="0"  name="Cylinders" defaultValue={this.state.Cylinders} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
              Inserire il numero di cilindri
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo di cambio</Form.Label>
            <Typeahead id="GearBoxType"
              onChange={(e) => this.onChangeGearBoxType(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.GearBoxTypes}
              placeholder="Seleziona un tipo di cambio"
              selected={this.state.GearBoxType} name="GearBoxType" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ruote motrici</Form.Label>
            <Typeahead id="DriveWheel"
              onChange={(e) => this.onChangeDriveWheel(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.DriveWheels}
              placeholder="Seleziona le ruote motrici"
              selected={this.state.DriveWheel} name="DriveWheel" />
          </Form.Group>
          <Form.Group name="Doors" className="mb-3" controlId="Doors">
            <Form.Label>Porte</Form.Label>
            <Form.Control type="number" min="0"  name="Doors" defaultValue={this.state.Doors} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
              Seleziona il numero di porte
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Posizione del volante</Form.Label>
            <Typeahead id="Wheel"
              onChange={(e) => this.onChangeWheel(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.Wheels}
              placeholder="Seleziona la posizione del volante"
              selected={this.state.Wheel} name="Wheel" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Colore</Form.Label>
            <Typeahead id="Color"
              onChange={(e) => this.onChangeColor(e)}
              onInputChange={(t, e) => this.onInputchangeSelect(t, e)}
              options={this.state.Colors}
              placeholder="Seleziona un colore"
              selected={this.state.Color} name="Color" />
          </Form.Group>
          <Form.Group name="Airbags" className="mb-3" controlId="Airbags">
            <Form.Label>Airbag</Form.Label>
            <Form.Control type="number" min="0"  name="Airbags" defaultValue={this.state.Airbags} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
              Seleziona il numero di airbags
            </Form.Text>
          </Form.Group>
          <Form.Group name="Levy" className="mb-3" controlId="Levy">
            <Form.Label>Tassa</Form.Label>
            <Form.Control type="number" min="0"  name="Levy" defaultValue={this.state.Levy} onChange={this.onInputchange} />
            <Form.Text className="text-muted">
              Seleziona il valore della tassa
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" value="Submit" disabled={!this.state.formenabled} >
            Elabora
          </Button>
        </Form>
        <Alert className="mt-3" show={this.state.showAllert} variant={this.state.variant}>
          {this.state.Risultato}
        </Alert>
      </Container>
    )
  };



}
export default Predict;