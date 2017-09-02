var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var Twitter = require("twitter");
var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: keys.spotifykeys.client_ID,
  secret: keys.spotifykeys.client_secret
});

//-------- Prompt user for input-------------------------------------------------

inquirer
  .prompt([
    {
      type: "list",
      message: "Please select",
      choices: [
        "Read Brian Hummel's Tweets",
        "Get Information about a song from Spotify",
        "Get information about a film from OMDB",
        "Trigger the Unknown"
      ],
      name: "whichAction"
    },
    {
      type: "input",
      message: "Please enter the name of a song: ",
      name: "song",
      when: function(answers) {
        return answers.whichAction === "Get Information about a song from Spotify";
      }
    },
    {
      type: "input",
      message: "Enter the name of a film: ",
      name: "film",
      when: function(answers) {
        return answers.whichAction === "Get information about a film from OMDB";
      }
    }
  ])
  .then(function(user) {
    var action = user.whichAction;
    var currentdate = new Date(); // used to set date information when writing to log.txt

    //--------------- lookup-ACTION OBJECT----------------------------------------------

    var lookup = {
      //--------------Logging to log.txt---------------------

      logTime:
        "Log entry created on " +
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds(),

      log: function(thingToLog) {
        fs.appendFile("log.txt", thingToLog, function(error) {
          if (error) console.log("error");
        });
      },

      //----------------- TWITTER ----------------------------

      "Read Brian Hummel's Tweets": function() {
        var params = { screen_name: "BrianPHummel", count: "20" };
        client.get("statuses/user_timeline", params, function(error, tweets) {
          if (!error) {
            for (var i = 0; i < tweets.length; i++) {
              console.log("\n" + tweets[i].created_at);
              console.log(tweets[i].text + "\n");
              lookup.log(
                "\n" +
                  lookup.logTime +
                  "\n" +
                  "Posted on " +
                  tweets[i].created_at +
                  "\n" +
                  tweets[i].text +
                  "\n"
              );
            }
          }
        });
      },

      //----------------- SPOTIFY ----------------------------

      "Get Information about a song from Spotify": function() {
        if (!user.song) {
          user.song = "THE SIGN ace of base";
        }
        spotify.search({ type: "track", query: user.song, limit: 1 }, function(
          err,
          data
        ) {
          if (err) {
            console.log("Error occurred" + err);
            return;
          }
          // console.log(JSON.stringify(data, null, 2));    //test prints the full Spotify return JSON object
          for (var i = 0; i < data.tracks.items.length; i++) {
            var songWrite =
              "\nThe song " +
              data.tracks.items[0].name.toUpperCase() +
              " is by the artist " +
              data.tracks.items[0].artists[0].name.toUpperCase() +
              "\nThe song appears on the album " +
              data.tracks.items[0].album.name.toUpperCase() +
              "\nTo preview on Spotify, command+click the link below: \n\n" +
              data.tracks.items[0].preview_url +
              "\n";
            console.log(songWrite);
            lookup.log("\n \n" + lookup.logTime + songWrite);
          }
        });
      },

      //----------------- OMDB ----------------------------

      "Get information about a film from OMDB": function() {
        if (!user.film) {
          user.film = "Mr. Nobody";
        }
        var queryURL =
          "http://www.omdbapi.com/?t=" +
          user.film +
          "&y=&plot=short&apikey=40e9cece";
        request(queryURL, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var filmWrite =
              "\nThe movie title is " +
              JSON.parse(body).Title.toUpperCase() +
              "\nThe film was released in " +
              JSON.parse(body).Year +
              "\nIt's IMBD Rating is " +
              JSON.parse(body).imdbRating +
              "\nThe film was produced in " +
              JSON.parse(body).Country +
              "\nThe film's language is " +
              JSON.parse(body).Language +
              "\nThe plot of the movie is " +
              JSON.parse(body).Plot +
              "\nActors in the movie include " +
              JSON.parse(body).Actors +
              "\nOfficial Website is " +
              JSON.parse(body).Website +
              "\n";
            console.log(filmWrite);
            lookup.log("\n \n" + lookup.logTime + filmWrite);
            // console.log(response);   logs full JSON response
          }
        });
      },

      //----------------- RANDOM ----------------------------

      "Trigger the Unknown": function() {
        fs.readFile("random.txt", "UTF8", function(error, data) {
          data = data.split(",");
          action = data[0];
          user.song = data[1];
          lookup[action]();
        });
      }
    }; // End of lookup-Action object

    //-----------------query the lookup Object with the action property selected by user---------

    lookup[action]();
  });
