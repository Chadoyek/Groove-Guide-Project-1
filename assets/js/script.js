// Listeners Slider

const rangeInput = document.querySelectorAll(".rangeInput Input");
listenersInput = document.querySelectorAll(".listenersInput Input");
progress = document.querySelector(".sliderListeners .progress");

//let sliderGap = 5;
let sliderGap = 5;

listenersInput.forEach(input =>{
  input.addEventListener("input", e =>{
    //getting 2 inputs and parsing them to numbers
    let minVal = parseInt(listenersInput[0].value),
    maxVal = parseInt(listenersInput[1].value);

    if((maxVal - minVal >= sliderGap) && maxVal <=100){
      if(e.target.className === "input-min"){ // if active input is min input
        rangeInput[0].value = minVal;
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      }else{
        rangeInput[1].value = maxVal;
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
    }
  });
})
rangeInput.forEach(input =>{
  input.addEventListener("input", e =>{
    //getting 2 ranges and parsing them to numbers
    let minVal = parseInt(rangeInput[0].value),
    maxVal = parseInt(rangeInput[1].value);

    if(maxVal - minVal < sliderGap){
      if(e.target.className === "range-min"){ // if active slider is min slider
        rangeInput[0].value = maxVal - sliderGap;
      }else{
        rangeInput[1].value = minVal + sliderGap;
      }
      
    }else{
      listenersInput[0].value = minVal;
      listenersInput[1].value = maxVal;
      progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  })
})


//snagged from spotify's API doc listed here: 
//https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

//var client_id = '3609e8db73c940d59d8b0dd1d47e0dd7';
var client_id = 'df9aa5598206496d8f260a29f1738f45';
//var client_secret = '73ca7f76b05e435a933602925a2392e7';
var client_secret = '4b888695abc84c6aaa541ff00b7a5381';
var url = 'https://accounts.spotify.com/api/token';
var form = new URLSearchParams({grant_type: 'client_credentials'});
var artists_output = "";

/* Element Selectors */
var minPopRangeEl = document.querySelector(".range-min");
var maxPopRangeEl = document.querySelector(".range-max");
var selectEl = document.getElementById("genreSelect");
var fetchButton = document.getElementById("fetchButton");
var accordionEl = document.querySelector(".accordion");
var resultsListEl = document.querySelector("#results");
var savedArtistsDisplayEl = document.querySelector("#saved_artists_display");

var saveButton = "";

var savedArtists = JSON.parse(localStorage.getItem("savedArtists"));
if (!savedArtists) {
  savedArtists = [];
}

if(savedArtists){
  for(i=0; i<savedArtists.length; i++){
    artists_output += "<div class='artist_info'>";
    artists_output += "<p>Artist: <a href='"+savedArtists[i].spotifyUrl+"' target='_blank'>"+savedArtists[i].artistName+"</a></p>";
    artists_output += "<p>Song: <a href='"+savedArtists[i].songUrl+"' target='_blank'>"+savedArtists[i].recSong+"</a></p>";
    artists_output += "</div>";
  }

  if(savedArtistsDisplayEl){
    savedArtistsDisplayEl.innerHTML = artists_output;
  }
}


var tracksSaved = document.querySelector('#tracksSaved'); //placeholder variable for tracks saved //Feature to add later? 

/* Global Variables */
var selectedGenre = "";
var minPop = document.querySelector(".input-min").value;
var maxPop = document.querySelector(".input-max").value;

$(document).ready(function(){
  $(document).foundation();

  // this initializes the dialog (and uses some common options that I do)
  $("#dialog").dialog({
    autoOpen : false, modal : true, show : "blind", hide : "blind"
  });

  $("#fetchButton").click(function(){
    var isConfirmed = true;
    if(selectedGenre === ""){
      isConfirmed = false;
      $( "#dialog" ).dialog("open");
    }
    getApi(selectedGenre, minPop, maxPop);
  });
});


selectEl.addEventListener('change', function() {
  selectedGenre = this.value;
});

minPopRangeEl.addEventListener('change', function(){
  minPop = this.value;
  console.log("Selected Min Pop: " + minPop);
});

maxPopRangeEl.addEventListener('change', function(){
  maxPop = this.value;
  console.log("Selected Max Pop: " + maxPop);
});


var authOptions = {
  method: "POST",
  headers: {
    'Authorization': 'Basic ' + (btoa(client_id + ':' + client_secret)),
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: form
};

fetch(url, authOptions).then (function(response) {
  if (response.status === 200) {
  
  //console.log("error!")
  response.json().then(function(body){
    token = body.access_token;
    //console.log(token)
    getGenres(token);
  })
  return;
  }
  response.json().then(function(error){
    console.log(error)
  })
});

//we should be getting this back: 

//{
  //  "access_token": "NgCXRKc...MzYjw",
    //"token_type": "bearer",
    //"expires_in": 3600
 //}

function getGenres() {
  //get the genres

  var requestUrl = 'https://api.spotify.com/v1/recommendations/available-genre-seeds'

  fetch(requestUrl, {
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //Using console.log to examine the data

    Object.entries(data).forEach(([key, value]) => {
      for (var i = 0; i < value.length; i++) {
        //populate the genre variables based on fetch request
        var optionEl = document.createElement("option");
        optionEl.textContent = value[i].toUpperCase();
        optionEl.value = value[i];
        selectEl.append(optionEl)            
      }
    });
  });
}

function getApi(selectedGenre, minPop, maxPop) {
  //get the API with user selected stuff
  var requestUrl = 'https://api.spotify.com/v1/recommendations?seed_genres=' + selectedGenre + '&&min_popularity='+ minPop + '&max_popularity='+ maxPop;
  console.log("Request URL: " + requestUrl);
   
  fetch(requestUrl, {
    headers: {
      'Authorization': 'Bearer ' + token
    },
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    generateArtistCards(data);
  });
}

function generateArtistCards(data){

  for (var i=0; i<5; i++){
    console.log(data.tracks[i]);
    var artistName = data.tracks[i].artists[0].name;
    var spotifyUrl = data.tracks[i].artists[0].external_urls.spotify;
    var recSong    = data.tracks[i].name;
    var songUrl    = data.tracks[i].external_urls.spotify;

    var resultsLi = document.createElement("li");
    resultsLi.innerHTML += "<a href='"+spotifyUrl+"' target='_blank'>"+artistName+"</a> <br />";

    //var resultsSong = document.createElement("p");
    //resultsSong.innerHTML ="<a href='"+songUrl+"' target='_blank'>"+recSong+"</a>";
    //resultsListEl.appendChild(resultsLi, " ", resultsSong);

    //var saveButton = document.createElement("button");
    saveButton = document.createElement("button");
    saveButton.className = "save_artist";
    saveButton.textContent = "save artist";
    saveButton.setAttribute("data-artistName", artistName);
    saveButton.setAttribute("data-spotifyUrl", spotifyUrl);
    saveButton.setAttribute("data-recSong", recSong);
    saveButton.setAttribute("data-songUrl", songUrl);
    resultsLi.append(saveButton);
    resultsListEl.append(resultsLi);

  }
  saveArtists();
}//generateArtists


function saveArtists(){
  var saveArtistButton = document.querySelectorAll(".save_artist");
  for(i=0; i<saveArtistButton.length; i++){
    saveArtistButton[i].addEventListener("click", function(e) {
      console.log("Save button clicked.");
    this.style.color = "#a41b4c";
      artistObj = e.target;
      saveNewArtist(artistObj);
     }) 
  }
}


function saveNewArtist(artistObj) {
  console.log(artistObj);
  var artistArray = {
    artistName: artistObj.dataset.artistName,
    spotifyUrl: artistObj.dataset.spotifyUrl,
    recSong:  artistObj.dataset.recSong,
    songUrl: artistObj.dataset.songUrl,
  }

  console.log(artistArray);
  savedArtists.push(artistArray);
  localStorage.setItem("savedArtists", JSON.stringify(savedArtists));
}


 
//testing our set genre & slider data.
// how the request should look
 //curl --request GET \
 // --url 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA' \
 // --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'

