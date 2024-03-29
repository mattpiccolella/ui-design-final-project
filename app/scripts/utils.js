var APP_NAME = 'DayTrippr';

// Find the distance between two locations. We don't really end up using this, but we'll keep it anyway.
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
      console.log(response);
    } else {
      console.log('Sorry, but it seems something went wrong.');
    }
  });
}

// Get the directions between two places. We don't really end up using this, but we'll keep it anyway.
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
      console.log(response);
    } else {
      console.log('Sorry, but it seems something went wrong.');
    }
  });
}

// Set up our initial map. The location is the center of Manhattan.
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7128, lng: -74.0059},
    zoom: 15
  });

  directionsDisplay.setMap(map);
}

// Utility method to help us get icons from Google Maps.
function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

// Split place types into a string, making them camel case i.e. more presentable.
// Takes the number of places we want, as we want different numbers at different points in our app.
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

// Similar to the function above, but return them as a list instead.
function getPlaceTypesAsList(types, number) {
  var typesList = [];
  var typeString = '';
  if (types.length > 0) {
    var numberTypes = (types.length > number ? number : types.length);
    for (var i = 0; i < numberTypes; i++) {
      typesList.push(types[i].replace(/_/g, ' '));
    }
    return typesList;
  } else {
    return [];
  }
}

// Get the link for an icon, based on whether it should be green and what letter it should show.
function generateIconLink(iconChar, green) {
  if (green) {
    return 'http://maps.gstatic.com/mapfiles/markers2/marker_green' + iconChar + '.png';
  } else {
    return 'http://www.google.com/mapfiles/marker' + iconChar + '.png';
  }
}

// Generate a row showing a place.
// Two optional parameters: a function to call upon presenting info (more info button), and a function to remove a place once it's in the trip.
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
    link = $('<a>', {class: 'place-title'}).text(place.name);
    link.click({'place' : place}, presentInfoFunction);    
  } else {
    link = $('<a>', {class: 'place-title', href: place.website, target: '_blank'}).text(place.name);
  }
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

// Basically calls the method above, generating a different row for each place.
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

  return callout;
}

// Simple method to find a trip by the ID of that trip.
function findTripByID(id, trips) {
  for (trip of trips) {
    if (trip.id == id) {
      return trip;
    }
  }

  return null;
}

// Method to actually go through and find the directions and display that route on the map.
function calculateAndDisplayRoute(places, directionsService, directionsDisplay) {
  // The waypoints are all the places that aren't first or last in our route.
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
    // We're looking specifically at walking instructions.
    travelMode: 'WALKING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
    } else {
      // Error in the case where Google cannot find walking directions.
      window.alert('Sorry, but we were unable to find a walking route between those locations. This may be happening because your location is far away. Try somewhere closer!');
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

// A large function to generate all the information about a place. Also takes a handler for a function in the case we want to have an Add Trip button.
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

  // Create the orbit so people can scroll through photos.
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

  // Show more information if it's available.
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