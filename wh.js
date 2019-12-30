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

// trigger a specific webHook
// webHooks.trigger('addUser', {name: "enzoesper", email: "enzo@example2.com"});
// webHooks.trigger('shortname2', {data: 123456}, {header: 'header'}) // payload will be sent as POST request with JSON body (Content-Type: application/json) and custom header