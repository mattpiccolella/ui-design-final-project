// Setup global application variables.
var autocomplete;
var map;
var mapMarkers = [];
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

function setupAutoCompleteSearch() {
  var input = document.getElementById('place_search');

  autocomplete = new google.maps.places.Autocomplete(input);

  // TODO: Bind bounds to the map to improve searches.

  autocomplete.addListener('place_changed', placeSearchChanged);
}

function placeSearchChanged() {
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    // TODO: Handle the error.
    console.log('Sorry, but you entered an invalid place.')
    return;
  }

  updateMapForNewPlace(place);

  console.log(JSON.stringify(place));
}

function updateMapForNewPlace(place) {
  mapMarker.setVisible(false);

  // Alternatively we can show viewpoint, which zooms nicely on the place.
  map.setCenter(place.geometry.location);
  map.setZoom(15);
  
  // We could also show some info window on this.
  mapMarker.setPosition(place.geometry.location);
  mapMarker.setVisible(true);
}