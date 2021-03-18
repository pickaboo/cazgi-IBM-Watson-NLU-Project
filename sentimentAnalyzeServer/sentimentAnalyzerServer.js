const express = require('express');
const app = new express();
const dotenv = require('dotenv');

dotenv.config();

function getNLUInstance() {
let api_key = process.env.API_KEY;
let api_url = process.env.API_URL;

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  serviceUrl: api_url,
});

return naturalLanguageUnderstanding;
}

function getParams (isUrl, isEmotions, data) {
const analyzeparams = {
    'features': {
        'entities' : {
            'emotion' : isEmotions,
            'sentiment': !isEmotions
        }, 'keywords': {
            'emotion': isEmotions,
            'sentiment': !isEmotions
        }
    } 
    }

    isUrl ? analyzeparams["url"] = data : analyzeparams["text"] = data;
    
    console.log('===>', analyzeparams);
    return analyzeparams;
}

app.use(express.static('client'))
const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });


app.get("/url/emotion", (req,res) => {
    getNLUInstance().analyze(getParams(true, true, req.query.url))
    .then (result => {
        return res.send({emotions: result.result.entities[0].emotion});
    }
    );
});


app.get("/url/sentiment", (req,res) => {
    const nlu = getNLUInstance();
    nlu.analyze(getParams(true, false, req.query.url)).then (result => {
        return res.send(result.result.entities[0].sentiment.label);
    });
});


app.get("/text/emotion", (req,res) => {
    const nlu = getNLUInstance();
    nlu.analyze(getParams(false, true, req.query.text)).then (result => {
        console.log(JSON.stringify(result.result));
        return res.send(JSON.stringify(result.result.keywords[0].emotion));
    });
});


app.get("/text/sentiment", (req,res) => {
    const nlu = getNLUInstance();
  
    nlu.analyze(getParams(false, false, req.query.text)).then (result => {
    console.log(JSON.stringify(result.result.keywords[0]));
        return res.send(JSON.stringify(result.result.keywords[0].sentiment.label));
    });
});


let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

