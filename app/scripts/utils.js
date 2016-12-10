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

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function getPlaceTypes(types) {
  // TODO: Maybe make this better.
  if (types.length >= 1) {
    return types[0];
  } else {
    return 'Type unavailable';
  }
}

function generateTripCard(trip) {
  var callout = $("<div>", {"class": "callout"});
  callout.append($("<h5>" + trip.title + "</h5>"))

  var iconChar = 'A';
  for (var i = 0; i < trip.places.length; i++) {
    var iconLink = 'http://www.google.com/mapfiles/marker' + iconChar + '.png';
    var row = $('<div>', {"class": "row"});

    var imgCol = $('<div>', {"class": "large-2 columns"});
    imgCol.append($('<img>', {"src": iconLink}));

    var infoCol = $('<div>', {"class": "large-10 columns no-padding"});
    var link = $('<a>', {"href": trip.places[i].website, "target": "_blank"});
    var name = $("<p class='place-title'>" + trip.places[i].name + "</p>");
    link.append(name);
    infoCol.append(link);
    var type = $("<p class='capitalize'>" + getPlaceTypes(trip.places[i].types) + '</p>');
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


