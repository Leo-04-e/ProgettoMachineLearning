# to run --> flask --app page run 
# app.py
from flask import Flask, request, jsonify, send_file, send_from_directory
import pandas as pd
import json
from flask_cors import CORS
from joblib import dump, load
import numpy as np
import random
import string

app = Flask(__name__)
CORS(app)


@app.post('/predictsingle')
def predictsingle():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        content=request.get_json()
        df = pd.io.json.json_normalize(content)
        df = df.rename({'Prodyear': 'Prod. year', 'LeatherInterior': 'Leather interior','FuelType':'Fuel type','EngineVolume':'Engine volume','GearBoxType':'Gear box type','DriveWheels':'Drive wheels'}, axis='columns')
        return jsonify(predict(df).tolist())
    else:
        return 'Content-Type not supported!'
    
def predict(dtf):
    dtf['Levy'] = pd.to_numeric(dtf['Levy'].replace('-', '0'), downcast='float')
    if(dtf['Mileage'].dtype!='int64'):
        dtf['Mileage'] = pd.to_numeric(dtf['Mileage'].str.split(' ').str[0], downcast='float') 
    dtf['Doors'] = np.where((dtf['Doors'] == '>5'), '5',dtf['Doors']) 
    dtf['Doors'] = np.where((dtf['Doors'] == '04-May'), '4',dtf['Doors'])
    dtf['Doors'] = np.where((dtf['Doors'] == '02-Mar'), '2',dtf['Doors'])
    dtf['Leather interior'] = dtf['Leather interior'].map({'No':False,'Yes':True,'true':True,'false':False,True:True,False:False})
    dtf['Wheel'] = dtf['Wheel'].map({'Left wheel':True, 'Right-hand drive':False})
    label_features=['Color','Gear box type','Drive wheels']
    #creazione della colonna price solo perchè necessaria perche il column trasfom funzioni
    dtf['Price']=dtf['Levy']
    for x in label_features:
        label_encoder = load(x+'.joblib')
        dtf[x] = label_encoder.transform(dtf[x])
    transformer=load('onehotencoder.joblib')
    transformed = transformer.transform(dtf)
    dtf = pd.DataFrame(transformed, columns=transformer.get_feature_names_out())
    Y="remainder__Price"
    dtf  = dtf.drop([Y], axis=1,errors='ignore').copy()
    model=load('modelloml.joblib')
    ris=model.predict(dtf)
    return ris

@app.post('/predictfile')
def predictfile():
    if 'test.csv' not in request.files:
        return '404'
    try:
        file = request.files['test.csv']

        dtf=pd.read_csv(file)
        f = open('restrictions.json')
        data=json.load(f)
        f.close()
        dtf = dtf[dtf['Manufacturer'].isin(data['Manufacturers'])]
        dtf = dtf[dtf['Model'].isin(data['Models'])]
        dtf = dtf[dtf['Category'].isin(data['Categories'])]
        dtf = dtf[dtf['Fuel type'].isin(data['FuelTypes'])]
        dtf = dtf[dtf['Engine volume'].isin(data['EngineVolumes'])]
        dtf = dtf[dtf['Gear box type'].isin(data['GearBoxTypes'])]
        dtf = dtf[dtf['Drive wheels'].isin(data['DriveWheels'])]
        dtf = dtf[dtf['Wheel'].isin(data['Wheels'])]
        dtf = dtf[dtf['Color'].isin(data['Colors'])]
        dtf['Price']=predict(dtf)
        filename=get_random_string(20)+'.csv'
        dtf.to_csv('output\\'+filename,index=False)
        return filename
    except Exception as e:
        return 'bad request!', 400

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

@app.get('/download/<path:filename>')
def download(filename):
    return send_file('output\\'+filename)

@app.get('/restrictions')
def restrictions():
    f = open('restrictions.json')
    data=json.load(f)
    f.close()
    return data