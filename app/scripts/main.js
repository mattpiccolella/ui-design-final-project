// Setup global application variables.
var autocomplete;
var map;
var mapMarker;

function initSampleMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7128, lng: -74.0059},
    zoom: 15
  });

  mapMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: "http://www.google.com/mapfiles/markerA.png"
  });
}

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

  console.log(place);
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

$(document).ready(function () {
  getDirections('2920 Broadway, New York, NY 10027', '70 Morningside Drive, New York, NY 10027');
  getDistanceMatrix(['2920 Broadway, New York, NY 10027'], ['70 Morningside Drive, New York, NY 10027']);

  //setupAutoCompleteSearch();
  initSampleMap();

  // Bind the autocomplete to the map so we see local places.
  //autocomplete.bindTo('bounds', map);
  $(document).foundation();
});