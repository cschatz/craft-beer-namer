/* Setting things up. */
var path = require('path'),
    https = require('https'),
    Twit = require('twit'),
    T = new Twit(require('./config.js')),
		fs = require('fs');

var minutes = 60 // default to tweeting once an hour
if (process.argv.length > 2) {
	minutes = process.argv[2];
}

var PIDFILE = ".pid";

function sendTweet(tweet) {
  console.log("Will send tweet '" + tweet + "'");
  T.post('statuses/update', { status: tweet }, function(err, data, res) {
    if (err){
      console.log(err.message);
    }
    else {
  		console.log('Sent');
		}
  });
}

function generatePhrase(rhymeWord) {
  // console.log("Ryhmeable word is " + rhymeWord);
  let wordrequest = https.get("https://api.datamuse.com/words?rel_jjb=" + rhymeWord,
          wordresponse => {
            let body= "";
            wordresponse.on('data', data => {
                          body += data.toString();
                      });
            wordresponse.on('end', () => {
                        let phrase = "";  
                        const info = JSON.parse(body);
                        if (info.length == 0) {
                          phrase = "I got nothing, sorry.";
                        } else {
                          let i = Math.floor(Math.random()*info.length);
                          phrase = info[i].word + " " + rhymeWord + " hop";
                        }
                        sendTweet(phrase);
                  });
          });
}

function generate() {
  let wordrequest = https.get("https://api.datamuse.com/words?rel_rhy=hop",
          wordresponse => {
            let body= "";
            wordresponse.on('data', data => {
                          body += data.toString();
                      });
            wordresponse.on('end', () => {
                          const info = JSON.parse(body).filter(item => {
                            return (item.numSyllables == 1 && item.score > 500);
                          });
                          let i = Math.floor(Math.random()*info.length);
                          generatePhrase(info[i].word);
                      });
          });
}

var pid = process.pid
console.log("Bot launching, tweet frequency = once per " + minutes + " minutes");
console.log("PID is " + pid);

fs.writeFile(PIDFILE, pid + "\n", function(err) { 
	if (err)	
		console.log("Problem saving PID to file: " + err);
});

generate();
setInterval(function() {
		generate();
	}, minutes*60*1000);

// generate();

