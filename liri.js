require("dotenv").config();

var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var search = process.argv[2];
var input = process.argv[3];

//concert-this
function concertThis(artist) {

    var artistURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(artistURL)

        .then(function (response) {
            console.log("\n======================");
            console.log("Artist: " + response.data[0].lineup);
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Location: " + response.data[0].venue.city + "," + response.data[0].venue.state);
            console.log("Date of the Event: " + moment(response.data[0].datetime).format('L'));
            console.log("======================\n");
        })

        .catch(function (error) {
            console.log("error");
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
                return console.log('Error: ' + err);
            }
            else {
                for (i = 0; i < data.tracks.items.length && i < 5; i++) {

                    var songQuery = data.tracks.items[i];
                    console.log("\n=====================");
                    console.log("Artist: " + songQuery.artists[0].name);
                    console.log("Song: " + songQuery.name);
                    console.log("Song Link: " + songQuery.preview_url);
                    console.log("Album: " + songQuery.album.name);
                    console.log("=====================\n");
                }
            }
        });
}

// movie-this
function movieThis(movieSearch) {

    if (movieSearch === undefined || null) {
        movieSearch = "Mr. Nobody";
    }

    var movieURL = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy";

    axios.get(movieURL)

        .then(function (response) {

            console.log("\n======================");
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[0].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("======================\n");
        })

        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request) {
                console.log(error.request);
            }
            else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}




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


function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        spotifyThis(dataArr[1]);

        if (error) {
            return console.log(error);

        }

    });

};


ask(search, input);

