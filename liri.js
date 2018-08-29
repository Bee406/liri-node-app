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

        console.log("Artists: " + artists);

        //Song Name
        console.log("Song Name: " + data.tracks.items[0].name);

        //Preview Link
        console.log("Song Preview: " + data.tracks.items[0].preview_url);

        console.log("Album: " + data.tracks.items[0].album.name);

    });
}

function movieThis(movieName) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(data, null, 4));
            var movie = JSON.parse(data);

            console.log("Movie Title: " + movie.Title);
            console.log("Release Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[2].Value);
            console.log("Country Produced In: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        }
    });
}

function concertThis(artist) {

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";


    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            var eventData = JSON.parse(data);
            console.log(eventData);

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

                    console.log("Venue: " + venue.replace(/\"/g, ""));
                    console.log("City: " + city.replace(/\"/g, "") + ", " + state.replace(/\"/g, ""));
                    console.log("Date: " + moment(convertedDate).format("MM/DD/YYYY"));
                    console.log("-------------");

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