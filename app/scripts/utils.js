var APP_NAME = 'DayTrippr';

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

function generateIconLink(iconChar, green) {
  if (green) {
    return 'http://maps.gstatic.com/mapfiles/markers2/marker_green' + iconChar + '.png';
  } else {
    return 'http://www.google.com/mapfiles/marker' + iconChar + '.png';
  }
}

function generatePlaceRow(place, iconLink, presentInfoFunction, removeFunction) {
  var row = $('<div>', {"class": "row place-row"});

  var imgCol = $('<div>', {"class": "large-2 columns"});
  imgCol.append($('<img>', {"src": iconLink}));

  var infoCol;
  if (removeFunction) {
    infoCol = $('<div>', {"class": "large-9 columns no-padding"});
  } else {
    infoCol = $('<div>', {"class": "large-10 columns no-padding"});
  }

  var link;
  if (presentInfoFunction) {
    link = $('<a>');
    link.click({'place' : place}, presentInfoFunction);    
  } else {
    link = $('<a>', {href: place.website, target: '_blank'});
  }
  var name = $("<p class='place-title'>" + place.name + "</p>");
  link.append(name);
  infoCol.append(link);
  var type = $("<p class='capitalize no-margin'>" + getPlaceTypes(place.types, 2) + '</p>');
  infoCol.append(type);

  row.append(imgCol);
  row.append(infoCol);

  if (removeFunction) {
    var removeCol = $('<div>', {"class": "large-1 columns no-padding"});
    var remove = $("<a><i class='fi-x'></i></a>");
    remove.click(function(){
      removeFunction(place.place_id);
    });
    removeCol.append(remove);
    row.append(removeCol);
  }

  return row;
}

function generateTripCard(trip) {
  var callout = $("<div>", {"class": "callout", "onclick": "focusTrip(" + trip.id + ")"});
  callout.append($("<h5><a onclick=focusTrip(" + trip.id + ")>" + trip.title + "</a></h5>"))

  var iconChar = 'A';
  for (var i = 0; i < trip.places.length; i++) {
    var iconLink = generateIconLink(iconChar, (i != trip.places.length - 1));
    var row = generatePlaceRow(trip.places[i], iconLink, null, null);

    callout.append(row);

    iconChar = nextChar(iconChar);
  }


  var moreInfo = $("<a class='button radius centered'>More Info</a>");
  callout.append(moreInfo);
  moreInfo.click(function() {
    open('more-info.html?tripId=' + trip.id);
  });
  // TODO: Add expected travel time.
  return callout;
}

function findTripByID(id, trips) {
  for (trip of trips) {
    if (trip.id == id) {
      return trip;
    }
  }

  return null;
}

function calculateAndDisplayRoute(places, directionsService, directionsDisplay) {
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

// Taken from CSS Tricks
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable) {
      return pair[1];
    }
  }
  return(false);
}

function generatePlaceInfo(place, selector, shouldAddTrip, addTripFunction) {
  var elements = [];
  selector.empty();

  var title = $("<h4 class='info'>" + place.name + '</h4>');
  var address = $("<h6 class='info'>" + place.formatted_address + '</h6>');
  if (place.formatted_phone_number) {
    var number = $("<h6 class='info'>" + place.formatted_phone_number + '</h6>');
  }
  var types = $("<h6 class='info capitalize'>" + getPlaceTypes(place.types, 3) + '</h6>');

  selector.append(title);
  selector.append(address);
  if (place.formatted_phone_number) {
    selector.append(number);
  }
  selector.append(types);

  if (place.photos) {
    orbit = $("<div class='orbit' role='region' data-auto-play='false' data-orbit>");
    var orbitContainer = $('<ul/>').addClass('orbit-container');
    var prevButton = $('<button class="orbit-previous"><span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;</button>');
    var nextButton = $('<button class="orbit-next"><span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;</button>');
    orbitContainer.append(prevButton);
    orbitContainer.append(nextButton);
    for (var i = 0; i < (place.photos.length > 4 ? 4 : place.photos.length); i++) {
      var imageUrl;
      if (place.photos[i].getUrl) {
        imageUrl = place.photos[i].getUrl({'maxHeight': 300});
      }
      if (imageUrl) {
        var imageSlide = $('<li/>').addClass('orbit-slide');
        var img = $('<img class="orbit-image">').attr('src', imageUrl); 
        var caption = $('<figcaption class="orbit-caption"></figcaption>');
        imageSlide.append(img);
        imageSlide.append(caption);
        orbitContainer.append(imageSlide);
      }
    }
    orbit.append(orbitContainer);
    selector.append(orbit);
  }

  if (place.opening_hours && place.opening_hours.weekday_text) {
    var hours = $("<h6 class='info'>Hours on " + place.opening_hours.weekday_text[(new Date()).getDay()] + "</h6>");
    selector.append(hours);
  }

  if (place.website) {
    var website = $("<h6 class='info'><a href='" + place.website + "' target='_blank'>Visit Website</a></h6>");
    selector.append(website);
  }

  if (shouldAddTrip) {
    var addToTripButton = $("<a id='add-to-trip-button' class='button'>Add to Trip</a>");
    selector.append(addToTripButton);
    $('#add-to-trip-button').click(addTripFunction);
  }
}