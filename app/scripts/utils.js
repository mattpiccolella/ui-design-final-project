function getDistanceMatrix(origins, destinations) {
  var distanceMatrixService = new google.maps.DistanceMatrixService();
  var distanceMatrixRequest = {
    origins: origins,
    destinations: destinations,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  distanceMatrixService.getDistanceMatrix(distanceMatrixRequest, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {                    
      // TODO: Handle the response.
      console.log(response);
    } else {
      // TODO: Handle the error.
      console.log('Sorry, but it seems something went wrong.');
    }
  });
}

function getDirections(origin, destination) {
  var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(directionsRequest, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {                    
      // TODO: Handle the response.
      console.log(response);
    } else {
      // TODO: Handle the error.
      console.log('Sorry, but it seems something went wrong.');
    }
  });
}


