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

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7128, lng: -74.0059},
    zoom: 15
  });

  mapMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: "http://www.google.com/mapfiles/markerA.png"
  });

  directionsDisplay.setMap(map);
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function getPlaceTypes(types, number) {
  var typesString = '';
  if (types.length > 0) {
    var numberTypes = (types.length > number ? number : types.length);
    for (var i = 0; i < numberTypes; i++) {
      typesString = typesString + types[i].replace(/_/g, ' ');
      if (i != numberTypes - 1) {
        typesString = typesString + ', ';
      }
    }
    return typesString;
  } else {
    return 'Type unavailable';
  }
}

function generateTripCard(trip) {
  var callout = $("<div>", {"class": "callout", "onclick": "focusTrip(" + trip.id + ")"});
  callout.append($("<h5>" + trip.title + "</h5>"))

  var iconChar = 'A';
  for (var i = 0; i < trip.places.length; i++) {
    var iconLink;
    if (i != trip.places.length - 1) {
      iconLink = 'http://maps.gstatic.com/mapfiles/markers2/marker_green' + iconChar + '.png';
    } else {
      iconLink = 'http://www.google.com/mapfiles/marker' + iconChar + '.png';
    }
    var row = $('<div>', {"class": "row"});

    var imgCol = $('<div>', {"class": "large-2 columns"});
    imgCol.append($('<img>', {"src": iconLink}));

    var infoCol = $('<div>', {"class": "large-10 columns no-padding"});
    var link = $('<a>', {"href": trip.places[i].website, "target": "_blank"});
    var name = $("<p class='place-title'>" + trip.places[i].name + "</p>");
    link.append(name);
    infoCol.append(link);
    var type = $("<p class='capitalize'>" + getPlaceTypes(trip.places[i].types, 3) + '</p>');
    infoCol.append(type);

    row.append(imgCol);
    row.append(infoCol);

    callout.append(row);

    iconChar = nextChar(iconChar);
  }


  var moreInfo = $("<a class='button radius centered' href='#'>More Info</a>");
  callout.append(moreInfo);
  // TODO: Add expected travel time.
  return callout;
}

function findTripByID(id) {
  var trips = DATA['New York'];

  for (trip of trips) {
    if (trip.id == id) {
      return trip;
    }
  }

  return null;
}

function calculateAndDisplayRoute(trip, directionsService, directionsDisplay) {
  var places = trip.places;

  var waypoints = [];
  if (places.length > 2) {
    for (var i = 1; i < places.length - 1; i++) {
      var place = places[i];
      waypoints.push({
        location: {
          placeId: place.place_id
        },
        stopover: true
      });
    }
  }

  directionsService.route({
    origin: {
      placeId: places[0].place_id
    },
    destination: {
      placeId: places[places.length - 1].place_id
    },
    waypoints: waypoints,
    optimizeWaypoints: true,
    travelMode: 'WALKING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      // TODO: Maybe do something with the route?
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}