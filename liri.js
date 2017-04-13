// Global Vars
// List of required NPM packages

var keys = require('./keys.js');

var twitter = require('twitter');

var spotify = require('spotify');

var request = require('request');

var fs = require('fs');


// capture node user inputs

var appSelector = process.argv[2];

var appCommand = process.argv[3];

// Processing multi-word app Commands to add them to arg 3

for (i=4; i < process.argv.length; i++) {

	appCommand += "+" + process.argv[i];
} 

// create switch function for each app

function appSwitch() {

	switch(appSelector){

	case "my-tweets":
	twitterFunc();
	break;

	case "spotify-this-song":
	spotifyFunc();
	break;

	case "movie-this":
	movieFunc();
	break;

	case "do-what-it-says":
	orderFunc();
	break;
	}
};


// OMDBAPP Part
function movieFunc(){

	console.log("Getcha Popcorn ready");

	// check to see if movie name argument is entered and what to do if not
	var movieName;

	if(appCommand === undefined){
		movieName = "Mr. Nobody";
	} else {
		movieName = appCommand;
	};

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

	request(queryUrl, function(error, response, body){
		if(!error && response.statusCode == 200) {
			console.log("Movie Title: " + JSON.parse(body)["Title"]);
	        console.log("Release Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
  		}

	}); // close request



}; // close movieFunc();

function spotifyFunc(){
	console.log("Crank it up to 11!");

	// Take song name from arg or if blank default to ...
	var trackPick;
	if(appCommand === undefined){
		trackPick = "The Sign by Ace of Base";
	} else {
		trackPick = appCommand;
	};

	spotify.search({ type: 'track', query: trackPick }, function(err, data) {
	    if (err) {
	        console.log('Error occurred: ' + err);
	        return;
	    } else{
	    	console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    };	
	}); // close spotify.search()
}; // close spotifyFunc()

function twitterFunc(){
	console.log("For the birds");

	//twitter variable from NPM Package
	var client = new twitter({
			  	consumer_key: keys.twitterKeys.consumer_key,
				consumer_secret: keys.twitterKeys.consumer_secret,
				access_token_key: keys.twitterKeys.access_token_key,
				access_token_secret: keys.twitterKeys.access_token_secret
	});

	// paramaters for twitter GET function
	var paramaters = {
			screen_name: 'caryjcooper',
			count: 20
		};

	// Twitter get method to display tweets
	client.get('statuses/user_timeline', paramaters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedTweets = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedTweets);
	            console.log("-------------------------");
	        };
	    };
	}); // close Twitter Client get method

};// close twitterFunc()

function orderFunc(){
		console.log("Read the command from 'random.txt' file");

		fs.readFile("random.txt","utf8", function(error,data){
			if(error){
				console.error(error);
			} else {

			var textArray = data.split(',');
			appSelector = textArray[0];
			appCommand = textArray[1];

				// for multi-word arguments
				for (i=2; i< textArray.length; i++) {
					appCommand = appCommand + "+" + textArray[i];
				}; // close for loop

			appSwitch() // run appSwitch func to evaluate the txt file
			}; // close else

		}); // close readFile()
}; // close orderFunc()


function createLog(){

	fs.writeFile('log.txt', 'NODE LOG', function(error){

	if (error) {
		return console.error(error);
	} else {console.log('log file created')
		}
	});
}; //close createLog()


// function logAppend(item){

// 	fs.appendFile('log.txt',item,function(error){

// 	if (error) {

// 		console.error(error);
// 	}
// 		console.log("Data has been logged");

// 	});
// };
appSwitch();
createLog();


