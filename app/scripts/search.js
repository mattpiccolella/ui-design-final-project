var trips;
var selectedTrips;
var selectedTripId;

function generateTripGrid(trips) {
  $('#trip-grid').empty();
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

function focusTrip(id) {
  $('#click-a-trip').hide();
  var trip = findTripByID(id, selectedTrips);
  selectedTripId = id;
  calculateAndDisplayRoute(trip.places, directionsService, directionsDisplay);
  generateTripGrid(selectedTrips);
}

function searchTrips(query) {
  var newTrips = [];
  for (trip of trips) {
    if (trip.title.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      newTrips.push(trip);
    } else if (queryMatchesPlaceName(trip, query)) {
      newTrips.push(trip);
    } else if (queryMatchesPlaceType(trip, query)) {
      newTrips.push(trip);
    }
  }

  selectedTrips = newTrips;
  generateTripGrid(selectedTrips);
}

function queryMatchesPlaceName(trip, query) {
  for (place of trip.places) {
    if (place.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
      console.log('Match on Place Name: ' + place.name);
      return true;
    }
  }
  return false;
}

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