require("dotenv").config();

var keys = require("./keys.js");


var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);



var request = require("request");


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
    var moment = require('moment');

    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            var eventData = JSON.parse(data);
            var venue = JSON.stringify(eventData[0].venue.name);
            var city = JSON.stringify(eventData[0].venue.city);
            var state = JSON.stringify(eventData[0].venue.region);
            var date = eventData[0].datetime;
            var format = "YYYY-MM-DD HH-mm-ss";
            var convertedDate = moment(date, format);

            
            console.log("Venue: " + venue.replace(/\"/g, ""));
            console.log("City: " + city.replace(/\"/g, "") + ", " + state.replace(/\"/g, ""));
            console.log("Date: " + moment(convertedDate).format("MM/DD/YYYY"));
            for (var i = 0; i < data.length; i++) {
                
            }
        }
    });

}

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            logOutput.error(err);
        } else {

            var randomArray = data.split(",");

            action = randomArray[0];

            argument = randomArray[1];

            doSomething(action, argument);
        }
    });
}


