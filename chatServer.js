/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, I am Bob. I will be helping you order pizza today!"); //We start with the introduction;
  setTimeout(timedQuestion, 4500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hey ' + input + '!';// output response
  waitTime =3000;
  question = 'How are you doing today?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= input + ' huh? Alright. A fresh, hot pizza makes everything better!';// outct-devicefarm-1257.tech.cornell.eduput response
  waitTime =3000;
  question = 'Please type in your full address';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' Nice. We deliver to ' + input + '!';
  waitTime = 3000;
  question = 'What is your phone number?';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= 'Thanks!';
  waitTime = 3000;
  question = 'What size pizza can I get you? (small/medium/large)';			    	// load next question
  }
  else if (questionNum == 4) {
  answer = input + ' it is!';
  waitTime =3000;
  question = 'Choose toppings';
  }
  else if (questionNum == 5) {
  answer= 'Thanks! Your pizza with ' + input +' is on the way!';// output response
  waitTime = 10000;
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
