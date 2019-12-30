const express = require("express");
const fs = require('fs');
// Initialize WebHooks module.
var WebHooks = require('node-webhooks')

// Initialize webhooks module from on-disk database
var webHooks = new WebHooks({
    db: './webHooks.json', // json file that store webhook URLs
    httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
  })
  
var emitter = webHooks.getEmitter()

emitter.on('*.success', function (shortname, statusCode, body) {
console.log('Success on trigger webHook' + shortname + 'with status code', statusCode, 'and body', body)
})

emitter.on('*.failure', function (shortname, statusCode, body) {
console.error('Error on trigger webHook' + shortname + 'with status code', statusCode, 'and body', body)
})

const app = express();
const port = process.env.PORT || 3034;

app.use(express.json());

// Fetch all the webhooks
app.get('/api/webhook/get', async (req, res) => {
    const whBuffer = fs.readFileSync('./webHooks.json');
    const whJSON = whBuffer.toString();
    const whData = JSON.parse(whJSON);

    res.status(200).send(whData);
});

// Fetch a signle webhook by its name
app.get('/api/webhook/get/:name', (req, res) => {
    const name = req.params.name;
    
    const whBuffer = fs.readFileSync('./webHooks.json');
    const whJSON = whBuffer.toString();
    const whData = JSON.parse(whJSON);

    const datadata = whData[name];
    // console.log(datadata);

    res.status(200).send({datadata});
})

// Add a new url to a existing webhook
app.post('/api/webhook/add/:name', (req, res) => {
    const name = req.params.name;
    const url = req.body.url;

    // sync instantation - add a new webhook called 'shortname1'
    webHooks.add(name, url).then(function(){
        res.status(201).send(url)
    }).catch(function(err){
        console.log(err)
    });
    
    // const whBuffer = fs.readFileSync('./webHooks.json');
    // const whJSON = whBuffer.toString();
    // const whData = JSON.parse(whJSON);

    // whData[name].push(url);
    // const whJSONToSave = JSON.stringify(whData);
    // fs.writeFileSync('./webHooks.json', whJSONToSave);

    // res.status(201).send(url)
});

// Trigger an existing webhook
app.post('/api/webhook/trigger/:name', (req, res) => {
    const name = req.params.name;
    const data = req.body;

    webHooks.trigger(name, data);
    res.send();
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
})