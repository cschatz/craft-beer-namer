/* Setting things up. */
var path = require('path'),
    https = require('https'),
    Twit = require('twit'),
    config = {
				/* Make sure you set the appropriate environment variables
					 with your API keys.
					 See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(require('./config.js'));


function sendTweet(tweet) {
  console.log("Will send tweet '" + tweet + "'");
  T.post('statuses/update', { status: tweet }, function(err, data, res) {
    if (err){
      console.log('Error: ' + err);
    }
    else {
  		console.log('Sent');
		}
  });
}

function generatePhrase(rhymeWord) {
  console.log("Ryhmeable word is " + rhymeWord);
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
                          phrase = info[i].word + " " + "hop";
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
                          generatePhrase(info[i].word, response);
                      });
          });
}

console.dir(config);

generate();

