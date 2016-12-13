// Global variables.
var trips;
var selectedTrips;
var selectedTripId;

// Generate the results that show as a grid. Takes a list of trips that are then drawn.
function generateTripGrid(trips) {
  $('#trip-grid').empty();
  if (trips.length == 0) {
    $('#no-search-results').show();
  } else {
    $('#no-search-results').hide();
  }

  var row;
  for (var i = 0; i < trips.length; i++) {
    if (i % 2 == 0) {
      if (i != 0) {
        $('#trip-grid').append(row);
      }
      row = $("<div>", {"class": "row"});
    }
    var col = $("<div>", {"class": "large-6 columns"});
    var tripCard = generateTripCard(trips[i]);
    if (trips[i].id == selectedTripId) {
      tripCard.css('border', '3px solid black');
    }
    col.append(tripCard);
    row.append(col);
  }

  $('#trip-grid').append(row);
}

// Whenever we click a trip, we want to make sure it gets highlighted and the route is drawn.
function focusTrip(id) {
  var trip = findTripByID(id, selectedTrips);
  selectedTripId = id;
  calculateAndDisplayRoute(trip.places, directionsService, directionsDisplay);
  generateTripGrid(selectedTrips);
}

// Find all the trips that match a search query.
function searchTrips(query) {
  var newTrips = [];
  for (trip of trips) {
    // First check title
    if (trip.title.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      newTrips.push(trip);
    // Then check place name
    } else if (queryMatchesPlaceName(trip, query)) {
      newTrips.push(trip);
    // Then check place type
    } else if (queryMatchesPlaceType(trip, query)) {
      newTrips.push(trip);
    }
  }

  selectedTrips = newTrips;
  generateTripGrid(selectedTrips);
}

// Go through all the place names and check whether any of them match.
function queryMatchesPlaceName(trip, query) {
  for (place of trip.places) {
    if (place.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      return true;
    }
  }
  return false;
}

// Go through all of the displayed place names and find one that matches.
function queryMatchesPlaceType(trip, query) {
  for (place of trip.places) {
    var types = getPlaceTypesAsList(place.types, 2);
    for (type of types) {
      console.log('Checking type ' + type);
      if (type.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        console.log('Match on Type: ' + type);
        return true;
      }
    }
  }
}

$(document).ready(function () {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  // Instantiate the page.
  trips = DATA;

  var newTrips = store.get('addedTrips');
  if (newTrips) {
    trips = newTrips.concat(trips);
  }

  selectedTrips = trips;

  generateTripGrid(selectedTrips);

  initMap();

  $('#search-bar').on('input', function(e){
    var query = $('#search-bar').val();
    console.log(query);
    searchTrips(query);
  });

  $(document).foundation();
});