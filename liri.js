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
