// Pull in required dependencies
var path = require('path');

// Import the list of friend entries
var friends = require('../data/friends.js');
var questions = require('../data/questions.js');

// create random friends by going to randomuser to get name and image then generate random scores.
// push each random friend to friends array 

const request = require('request');
 
request('https://randomuser.me/api/?inc=name,picture&results=13', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  var someNewFriends = body.results;
  for (var i = 0; i < body.results.length; i++) {

    var randScores=generateRandScores();    
    var aNewRandomFriend = {
        name:body.results[i].name.first,
        photo:body.results[i].picture.large,
        scores:randScores
      }
    friends.push(aNewRandomFriend);
  }
});

function generateRandScores(){
  var anArray=[];
  for (var j = 0; j < 10; j++) {
    anArray.push(Math.round(Math.random()*4+1));
  }; 
  return anArray; 
}

// Export API routes
module.exports = function(app) {

  // Total list of friend entries
  app.get('/api/friends', function(req, res) {
    res.json(friends);
  }); 

  app.get('/api/questions/:qID?', function(req, res) {
    if (req.params.qID>=0)
      res.json(questions[req.params.qID]);
    else
      res.json(questions);
  }); 

  // Add new friend entry
  app.post('/api/friends', function(req, res) {
    // Capture the user input object
    var newFriend = req.body;

    // Compute best friend match
    var matchName = '';
    var matchImage = '';
    var bestMatchValue = 10000; // Start off with a large number for no possible matches, lowest number indicates best match
    var BFFIndex=0;

    // Examine all existing friends in the list
    for (var i = 0; i < friends.length; i++) {
      // Compute absolute values for each question
      var absoluteVal = 0;
      for (var j = 0; j < newFriend.scores.length; j++) {
        absoluteVal += Math.abs(friends[i].scores[j] - newFriend.scores[j]);
      }

      // If lowest difference, record the friend match
      if (absoluteVal < bestMatchValue) { // lower number indicates better match
        bestMatchValue = absoluteVal;
        BFFIndex=i;
      }
    }

    // Add new friend to array for future match possibilites
    friends.push(newFriend);

    // return best match
    res.json(friends[BFFIndex]);
  });
};