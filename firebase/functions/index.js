'use strict';
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({debug: true});
const number=Math.floor(Math.random() * 10);


app.intent('Default Welcome Intent', conv => {
  conv.user.storage.number_of_rights=5;
  conv.ask(`Welcome! You have ${conv.user.storage.number_of_rights} rights to guess my number. Say a number.`);
});

app.intent('guess_number', conv => {
  console.log('number : ',number);
  console.log('guess : ',conv.parameters.number);
  
  if(conv.parameters.number==number){
    conv.close('That is right. Thanks');
     }
  else if(conv.user.storage.number_of_rights===1){
    conv.close("You do not have any right to guess. Sorry :(");
  }
  else if(conv.user.storage.number_of_rights===2){
    conv.user.storage.number_of_rights=parseInt(conv.user.storage.number_of_rights)-1;
    conv.ask("Wrong. Last chance, let's guess");
  }
  else{
    console.log('rights:',conv.user.storage.number_of_rights);
    conv.user.storage.number_of_rights=parseInt(conv.user.storage.number_of_rights)-1;
    conv.ask('Wrong! You have '+conv.user.storage.number_of_rights+ ' rights');
  }
  
});

exports.dialogflowFirebaseFulfillment=functions.https.onRequest(app);
