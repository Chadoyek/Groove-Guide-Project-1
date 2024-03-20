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
var minPop = document.querySelector('#sliderOutput1'); //variable for minimum popularity //we still need to gather this data, it isnt being done right now
var maxPop = document.querySelector('#sliderOutput2');//variable for maximum popularity // we still need to gather this data, it isnt being done right now
var tracksSaved = document.querySelector('#tracksSaved'); //placeholder variable for tracks saved //Feature to add later? 

var client_id = '3609e8db73c940d59d8b0dd1d47e0dd7';
var client_secret = '73ca7f76b05e435a933602925a2392e7';
var url = 'https://accounts.spotify.com/api/token';
var form = new URLSearchParams({grant_type: 'client_credentials'});
var selectEl = document.getElementById("genreSelect");
console.log(selectEl);

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
   // getApi(token);
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
        console.log(data);

        Object.entries(data).forEach(([key, value]) => {
           console.log(key);
           console.log(value);
           
          for (var i = 0; i < value.length; i++) {
            //populate the genre variables based on fetch request
            var optionEl = document.createElement("option");
            optionEl.textContent = value[i];
            selectEl.append(optionEl)            
          }
          
        });
        

      });
  }

//manually set variables for testing
genre = "country"
minPop = 0
maxPop = 100

function getApi() {
   //get the API with user selected stuff
   var requestUrl = 'https://api.spotify.com/v1/recommendations?seed_genres=' + genre + '&&min_popularity='+ minPop + '&max_popularity='+ maxPop;
   
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
       for (var i = 0; i < data.length; i++) {
         //populate the card variables based on fetch request
         //generate the cards
         
       }
     });
 }
fetchButton.addEventListener('click', getApi);

//testing our set genre & slider data.
console.log( "your genre is: " + genre, "and your popularity settings are: "+ popLow, " and "+ popHigh + "." );

// how the request should look
 //curl --request GET \
 // --url 'https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA' \
 // --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'