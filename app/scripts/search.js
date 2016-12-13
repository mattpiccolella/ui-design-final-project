var trips;
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
  var trip = findTripByID(id, trips);
  selectedTripId = id;
  calculateAndDisplayRoute(trip.places, directionsService, directionsDisplay);
  generateTripGrid(trips);
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

  generateTripGrid(trips);

  initMap();

  $(document).foundation();
});