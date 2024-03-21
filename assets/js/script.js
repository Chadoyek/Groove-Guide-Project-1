// Monthly Listeners Slider

const rangeInput = document.querySelectorAll(".rangeInput Input");
listenersInput = document.querySelectorAll(".listenersInput Input");
progress = document.querySelector(".sliderListeners .progress");

let sliderGap = 1000;

listenersInput.forEach(input =>{
  input.addEventListener("input", e =>{
    //getting 2 inputs and parsing them to numbers
    let minVal = parseInt(listenersInput[0].value),
    maxVal = parseInt(listenersInput[1].value);

    if((maxVal - minVal >= sliderGap) && maxVal <=100000){
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


$(document).foundation();
//snagged from spotify's API doc listed here: 
//https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

var client_id = '3609e8db73c940d59d8b0dd1d47e0dd7';
var client_secret = '73ca7f76b05e435a933602925a2392e7';
var url = 'https://accounts.spotify.com/api/token';
var form = new URLSearchParams({grant_type: 'client_credentials'});

/* Element Selectors */
var minPopRangeEl = document.querySelector(".range-min");
var maxPopRangeEl = document.querySelector(".range-max");
var selectEl = document.getElementById("genreSelect");
var fetchButton = document.getElementById("fetchButton");
var accordionEl = document.getElementById("accordion-ul");


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
    console.log(token)
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


//minPop = 0;
//maxPop = 100;

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
       //Using console.log to examine the data
       console.log(data);
       generateArtistCards(data);
     });
 }

function generateArtistCards(data){
  accordionEl.replaceChildren();
  for (var i = 0; i < data.tracks.length; i++) {
    console.log("i: " + i);
     //populate the card variables based on fetch request
     //generate the cards

     var accordionLi = document.createElement("li");
     accordionLi.classList.add("accordion-item", "is-active");
     accordionLi.setAttribute('data', "accordion-item");

     var accordionTitle = document.createElement("a");
     accordionTitle.classList.add("accordion-title");
     accordionTitle.textContent = data.tracks[i].artists[i].name;

     accordionEl.append(accordionLi);
     accordionLi.append(accordionTitle);

   }

  //<li class="accordion-item is-active" data-accordion-item>
  //  <a href="#" class="accordion-title">Accordion 1</a>
  //  <div class="accordion-content" data-tab-content >
  //    <p>Panel 1. Lorem ipsum dolor</p>
  //  </div>
  //</li>

}
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