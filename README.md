## LIRI NODE App

### This *Language Interpretation and Recognition Interface* is a Node.js CLI application that allows a user to query the Twitter, Spotify and OMDB API's.

When the application launches, users are present with four options:
  1. Read Brian Hummel's Tweets
    * queries Twitter API
    * returns the last 20 tweets from MY personal account
  2. Get Information about a song from Spotify
    * allows user to enter a song name
    * queries Spotify API
    * returns information about the song and a link to song preview
  3. Get information about a film from OMDB
    * allows user to enter a film name
    * queries OMDB API
    * returns information about the film
  4. Trigger the Unknown
    * references a locally stored file on server via FS module
    * file instructs app to query the Spotify API with a Backstreet Boys song title

* The application runs in the Node.js command line interface.
* The application interacts with the user through the *Inquirer.js* NPM Library.
* Asynchronous calls are made to the Twitter API using the *twitter* NPM Library.
* Asynchronous calls are made to the Spotify API using the *node-spotify-api* NPM Library.
* HTTP calls are made to the OMDB API by using the *Request* NPM Library.
* Each user interaction is time-stamped and committed to a Log file via the Node FS Module.

