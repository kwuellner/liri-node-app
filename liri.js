require("dotenv").config();

var inquirer = require('inquirer');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify)

var search = process.argv[2];
var input = process.argv[3];

// beginning questions
// inquirer.prompt([
//     {
//         type: "input",
//         name: "name",
//         message: "What is your name?"
//     },

//     {
//         type: "list",
//         name: "whichApp",
//         message: "Which application would you like to run?",
//         choice: ["Spotify", "OMBD", "BandsInTown"]
//     },
// ])
// .then(function (user) {


//concert-this
function concertThis(artist) {

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var concertInfo = JSON.parse(body);

            var dayTime = concertInfo[0].datetime
            var momentDT = moment().format('L');

            console.log("======================");
            console.log("Venue: " + concertInfo[0].venue.name +
                "\nLocation: " + concertInfo[0].venue.city + "," + concertInfo[0].venue.state +
                "\nDate of the Event: " + momentDT + "\n======================");
        };
    });

}

// spotify-this-song
function spotifyThis(songSearch) {
    if (songSearch === undefined || null) {
        songSearch = "The Sign Ace of Base";
    }

    spotify.search({
        type: 'track',
        query: songSearch
    },
        function (err, data) {
            if (err) {
                return console.log('Error: ' + err)
            }
            else {
                for (i = 0; i < data.tracks.items.length && i < 5; i++) {

                    var songQuery = data.tracks.items[i];
                    console.log("Artist: " + songQuery.artists[0].name +
                        "\nSong: " + songQuery.name +
                        "\nSong Link" + songQuery.preview_url +
                        "\nAlbum: " + songQuery.album.name +
                        "\n=====================");
                }
            };
        });
}

// movie-this
function movieThis(movieSearch) {

    if (movieSearch === undefined || null) {
        movieSearch = "Mr Nobody";
    }

    var queryURL = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy";

    request(queryURL, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var movieData = JSON.parse(body);

            console.log("======================");
            console.log("Title: " + movieData.title +
                "\nYear: " + movieData.released +
                "\nIMDB Rating: " + movieData.imdbRating +
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
                "\nCountry: " + movieData.country +
                "\nLanguage: " + movieData.language +
                "\nPlot: " + movieData.plot +
                "\nActors: " + movieData.actors +
                "\n======================");
        };
    });

    // switch actions for functions
    var ask = function (actions, dataLog) {
        switch (actions) {
            case "concert-this":
                concertThis(dataLog);
                break;
            case "movie-this":
                movieThis(dataLog);
                break;
            case "spotify-this-song":
                spotifyThis(dataLog);
                break;
            case "do-what-it-says":
                doWhatItSays();
                break;
            default:
                console.log("Invalid. Please try again");
        }
    };
}

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
        var randomText = data.split(",");

        if (randomText.length == 2) {
            ask(randomText[0]);
        }
        else if (randomText.length == 1) {
            ask(randomText[0]);
        }
    });
}

