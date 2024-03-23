// Monthly Listeners Slider

const rangeInput = document.querySelectorAll(".rangeInput Input");
listenersInput = document.querySelectorAll(".listenersInput Input");
progress = document.querySelector(".sliderListeners .progress");

//let sliderGap = 1000;
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

    //if((maxVal - minVal >= sliderGap) && maxVal <=100000){
    //  if(e.target.className === "input-min"){ // if active input is min input
    //    rangeInput[0].value = minVal;
    //    progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
    //  }else{
    //    rangeInput[1].value = maxVal;
    //    progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    //  }
    //}
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

$(document).ready(function(){
  $(document).foundation();
});
//snagged from spotify's API doc listed here: 
//https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

var client_id = '3609e8db73c940d59d8b0dd1d47e0dd7';
// var client_id = 'df9aa5598206496d8f260a29f1738f45';
var client_secret = '73ca7f76b05e435a933602925a2392e7';
// var client_secret = '4b888695abc84c6aaa541ff00b7a5381';
var url = 'https://accounts.spotify.com/api/token';
var form = new URLSearchParams({grant_type: 'client_credentials'});

/* Element Selectors */
var minPopRangeEl = document.querySelector(".range-min");
var maxPopRangeEl = document.querySelector(".range-max");
var selectEl = document.getElementById("genreSelect");
var fetchButton = document.getElementById("fetchButton");
//var accordionEl = document.getElementById("accordion-ul");
var accordionEl = document.querySelector(".accordion");
var resultsListEl = document.querySelector("#results");
var savedArtists = JSON.parse(localStorage.getItem("#Artists"));
if (!savedArtists) {
  savedArtists = []
}


var tracksSaved = document.querySelector('#tracksSaved'); //placeholder variable for tracks saved //Feature to add later? 

/* Global Variables */
var selectedGenre = "";
var minPop = document.querySelector(".input-min").value;
var maxPop = document.querySelector(".input-max").value;

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
        optionEl.textContent = value[i];
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
    //resultsLi.classList.add("accordion-item");
    //resultsLi.setAttribute("data", "accordion-item");
    
    resultsLi.innerHTML = "<a href='"+spotifyUrl+"' target='_blank'>"+artistName+"</a>";

    var resultsSong = document.createElement("p");
    resultsSong.innerHTML ="<a href='"+songUrl+"' target='_blank'>"+recSong+"</a>";
    resultsListEl.appendChild(resultsLi, " ", resultsSong);

    var saveButton = document.createElement("button");
    saveButton.textContent = "save artist";
    saveButton.setAttribute("data-artistName", artistName);
    saveButton.setAttribute("data-spotifyUrl", spotifyUrl);
    saveButton.setAttribute("data-recSong", recSong);
    saveButton.setAttribute("data-songUrl", songUrl);
    resultsListEl.appendChild(saveButton);

    // localStorage.setItem("li", resultsLi);

    // window.location.href = "saved_artists.html";

    
    //resultsListEl.append(resultsSong);
  }

  // //accordionEl.replaceChildren();
  // console.log(data);
  // resultsListEl.replaceChildren();
  // Object.entries(data.tracks).forEach(([key, value]) => {
  //   var artistsArray = value.artists;
  //   console.log (value);
  //   //for(i=0; i<artistsArray.length; i++){
  //   for(i=0; i<10; i++){
  //     var artistName = artistsArray[i].name;
  //     var spotifyUrl = artistsArray[i].external_urls.spotify;
  //     //var artistSong = artistsArray[i].name; //to be added

  //     //populate the card variables based on fetch request
  //     //generate the cards

  //     var resultsLi = document.createElement("p");
  //     //resultsLi.classList.add("accordion-item");
  //     //resultsLi.setAttribute("data", "accordion-item");
  //     resultsListEl.append(resultsLi);
  //     resultsLi.innerHTML = "<a href='"+spotifyUrl+"' target='_blank'>"+artistName+"</a>";
  //     //resultsLi.append(artistName);
  //     //var resultsSong = document.createElement("li");
  //     //resultsListEl.append(resultsSong);
  //     //resultsSong.innerHTML ="<a href='"+spotifyUrl+"' target='_blank'>"+artistSong+"</a>";
      
  //   // var accordionLi = document.createElement("li");
    // accordionLi.classList.add("accordion-item");
    // accordionLi.setAttribute("data", "accordion-item");

    // var accordionTitle = document.createElement("a");
    // accordionTitle.classList.add("accordion-title");
    // accordionTitle.textContent = artistName;

    // var accordionDiv = document.createElement("div");
    // accordionDiv.classList.add("accordion-content");
    // accordionDiv.setAttribute("data", "data-tab-content");
    // //accordionDiv.innerHTML = "<p"+spotifyUrl+"</p";
    // accordionDiv.innerHTML = "<p<a href='"+spotifyUrl+"'Open in Spotify</a</p";

    // accordionEl.append(accordionLi);
    // accordionLi.append(accordionTitle);
    // accordionLi.append(accordionDiv);

   // }
  //});
  $('#accordion').html(accordionEl).accordion({collapsible: true}); 
} 

// function storeArtist() {
//   localStorage.setItem("savedArtist", JSON.stringify(savedArtist));
//   console.log(storeArtist);
// }

function renderSavedArtist(data) {
  // loop through saved artist
  for (var i=0; i<5; i++){
    console.log(data.tracks)
  }
  resultsLi = document.createElement("li");

  for (var i = 0; i < artistObj.length; i++) {
    var saved = savedArtists[i];

    var li = document.createElement("li");
    li.textContent = saved;
    li.setAttribute("data-index", i);

    li.appendChild();
    saved.appendChild(li);
  }
}

// function init () {
//   resultsListEl = JSON.parse(localStorage.getItem("#Artists"));
//   if (resultsListEl !== null) {
//     savedArtists = resultsListEl;
//   }
//   renderSavedArtist();
// }

// saveButton.addEventListener("click", function(e) {
//   artistObj = e.target;
//   if (savedArtists === "") {

//     saveNewArtist();m
//     renderSavedArtist();
//   }
// }) 


// this will be the function called when saved btn is clicked 
function saveNewArtist(e) {
  var artistObj = {
    artistName: e.target.dataset.artistName,
    spotifyUrl: e.target.dataset.spotifyUrl,
    recSong:  e.target.dataset.recSong,
    songUrl: e.target.dataset.songUrl,
  }
  savedArtists.push(artistObj);
  localStorage.setItem("#Artists", JSON.stringify(savedArtists));

  window.location.href = "saved_artists.html";

}

// init();


fetchButton.addEventListener('click', function(){
  if(selectedGenre === ""){
    alert("Please select a Genre to continue!");
  }
  getApi(selectedGenre, minPop, maxPop);
});

//testing our set genre & slider data.
// how the request should look
 //curl --request GET \
 // --url 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA' \
 // --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'

