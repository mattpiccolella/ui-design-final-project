var trips;

function generateTripGrid(trips) {
  var row;
  for (var i = 0; i < trips.length; i++) {
    if (i % 2 == 0) {
      if (i != 0) {
        $('#trip-grid').append(row);
      }
      row = $("<div>", {"class": "row"});
    }
    var col = $("<div>", {"class": "large-6 columns"});
    col.append(generateTripCard(trips[i]));
    row.append(col);
  }

  $('#trip-grid').append(row);
}

function focusTrip(id) {
  var trip = findTripByID(id, trips);
  calculateAndDisplayRoute(trip.places, directionsService, directionsDisplay);
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