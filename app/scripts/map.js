// Setup global application variables.
var autocomplete;
var map;
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

// Change the map to zoom in on a new place and make a new marker visible.
function updateMapForNewPlace(place, mapMarker) {
  mapMarker.setVisible(false);

  // Alternatively we can show viewpoint, which zooms nicely on the place.
  map.setCenter(place.geometry.location);
  map.setZoom(15);
  
  // We could also show some info window on this.
  mapMarker.setPosition(place.geometry.location);
  mapMarker.setVisible(true);
  mapMarker.setMap(map);
}