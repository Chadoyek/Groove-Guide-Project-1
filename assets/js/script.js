$(document).foundation();
//snagged from spotify's API doc listed here: 
//https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

var client_id = 'CLIENT_ID';
var client_secret = 'CLIENT_SECRET';

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
    console.log("error!")
  }
});

//we should be getting this back: 

//{
  //  "access_token": "NgCXRKc...MzYjw",
    //"token_type": "bearer",
    //"expires_in": 3600
 //}

 //curl --request GET \
 // --url 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA' \
 // --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'
//variable for genre
var genre = ""
//variable for minimum popularity
var minPop = 0
//variable for maximukm popularity
var maxPop = 100

 function getApi() {
    //get the API with user selected stuff
      var requestUrl = 'https://api.spotify.com/v1/recommendations?seed_genres=' + genre + '&&min_popularity='+ minPop + '&max_popularity='+ maxPop;
    
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //Using console.log to examine the data
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            //populate the card variables based on fetch request
            //generate the cards
            
          }
        });
    }
    fetchButton.addEventListener('click', getApi);