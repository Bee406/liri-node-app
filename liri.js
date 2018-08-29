require("dotenv").config();

var keys = require("./keys.js");


var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var moment = require('moment');

var request = require("request");

// var results = "";

var fs = require("fs");

var action = process.argv[2];

var argument = "";

doSomething(action, argument);

function doSomething(action, argument) {

    argument = getArgument();

    switch (action) {

        case "spotify-this-song":

            var songTitle = argument;

            if (songTitle === "") {
                spotifyThisSong("Ace of Base");

            } else {

                spotifyThisSong(songTitle);
            }

            break;

        case "movie-this":

            var movieName = argument;

            if (movieName === "") {
                movieThis("Mr. Nobody");

            } else {
                movieThis(movieName);
            }
            break;

        case "concert-this":

            var artist = argument;

            concertThis(artist);

            break;

        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}


function getArgument() {

    var argumentArray = process.argv;


    for (var i = 3; i < argumentArray.length; i++) {
        argument += argumentArray[i];
    }
    return argument;
}


function spotifyThisSong(songTitle) {

    spotify.search({ type: 'track', query: songTitle, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //Artist
        var artistsInfo = data.tracks.items[0].album.artists;

        var artistsList = [];
        for (var i = 0; i < artistsInfo.length; i++) {
            artistsList.push(artistsInfo[i].name);
        }

        var artists = artistsList.join(", ");

        log ("Spotify This Song: " + songTitle + "\n");

        log("Artists: " + artists + "\n");

        //Song Name
        log("Song Name: " + data.tracks.items[0].name + "\n");

        //Preview Link
        log("Song Preview: " + data.tracks.items[0].preview_url + "\n");

        log("Album: " + data.tracks.items[0].album.name + "\n");
        
        log("------------- \n");

    });
}

function movieThis(movieName) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(data, null, 4));
            var movie = JSON.parse(data);

            log("Movie This: " + movieName + "\n");

            log("Movie Title: " + movie.Title + "\n");
            log("Release Year: " + movie.Year + "\n");
            log("IMDB Rating: " + movie.imdbRating + "\n");
            log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value + "\n");
            log("Country Produced In: " + movie.Country + "\n");
            log("Language: " + movie.Language + "\n");
            log("Plot: " + movie.Plot + "\n");
            log("Actors: " + movie.Actors + "\n");
            log("------------- \n");
        }
    });
}

function concertThis(artist) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";


    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            var eventData = JSON.parse(data);
            log("Concert This: " + artist + "\n");

            for (var i = 0; i < data.length; i++) {
                
                //gettind rid of the error message
                if (eventData[i]) {
                    // console.log(eventData);
                    var venue = JSON.stringify(eventData[i].venue.name);
                    var city = JSON.stringify(eventData[i].venue.city);
                    var state = JSON.stringify(eventData[i].venue.region);
                    var date = eventData[0].datetime;
                    var format = "YYYY-MM-DD HH-mm-ss";
                    var convertedDate = moment(date, format);

                    

                    log("Venue: " + venue.replace(/\"/g, "") + "\n");
                    log("City: " + city.replace(/\"/g, "") + ", " + state.replace(/\"/g, "") + "\n");
                    log("Date: " + moment(convertedDate).format("MM/DD/YYYY") + "\n");
                    log("------------- \n");

                }
            }
        }
    });

}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            logOutput.error(err);
        } else {
            // console.log("Data: " + data);
            var dataArray = data.split(",");

            action = dataArray[0];

            argument = dataArray[1];

            doSomething(action, argument);
        }
    });
}

function log(data){
    fs.appendFile("log.txt", data, function (err) { 
        if (err){
            console.log(err);
        }
    });
    console.log(data);

}
