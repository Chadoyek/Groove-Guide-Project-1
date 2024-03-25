var artists_output = "";
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


var clearSavedEl = document.querySelector("#clear_saved");
  clearSavedEl.addEventListener("click", function() {
    console.log("Clear Saved button clicked!");
    savedArtists = []; //clear saved artists array
    localStorage.removeItem("savedArtists"); //remove saved artists from local storage
    //clear display
    if(savedArtistsDisplayEl)  {
      savedArtistsDisplayEl.innerHTML = ""; 
    }
});
