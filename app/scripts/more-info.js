var placeInfoText = $("<p class='light-gray' id='blank-trip'>Select a place listed under the map on your right to see detail of each of them.</p>");
var errorText = $("<p class='light-gray' id='blank-trip'>Sorry, but we cannot find this trip. Please go back and try again.</p>")
var trips;
var pageTrip;
var selectedPlaceId;

function getTripForPage() {
  var tripId = getQueryVariable('tripId');
  trips = DATA;

  var newTrips = store.get('addedTrips');
  if (newTrips) {
    trips = newTrips.concat(trips);
  }

  var trip = findTripByID(tripId, trips);
  return trip;
}

function drawTripPlaces() {
  var currentTrip = $('#current-trip-steps');
  currentTrip.empty();
  var iconChar = 'A';
    for (var i = 0; i < pageTrip.places.length; i++) {
      var iconLink = generateIconLink(iconChar, (i != pageTrip.places.length - 1));
      var row = generatePlaceRow(pageTrip.places[i], iconLink, showTripInfo, null);
      if (pageTrip.places[i].place_id == selectedPlaceId) {
        row.css('border', '2px solid hsla(0,0%,4%,.25)');
        row.css('border-radius', '3px');
      }
      row.click({place_id: pageTrip.places[i].place_id}, function(event) {
        selectedPlaceId = event.data.place_id;
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({placeId: event.data.place_id}, function(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            generatePlaceInfo(place, $('#place_info'), false, null);
            $(document).foundation();
            drawTripPlaces();
          } else {
            // TODO: Handle the error.
            console.log('Could not get the place');
          }
        });
      });
      currentTrip.append(row);
      iconChar = nextChar(iconChar);
    }
    if (pageTrip.places.length > 1) {
      calculateAndDisplayRoute(pageTrip.places, directionsService, directionsDisplay);
    } else {
      updateMapForNewPlace(pageTrip.places[0], firstLegMarker);
    }
}

function showTripInfo(event) {
  generatePlaceInfo(event.data.place, $('#place_info'), false, null);
  $(document).foundation();
}

$(document).ready(function() {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  initMap();

  pageTrip = getTripForPage();

  if (pageTrip) {
    $('#place_info').append(placeInfoText);
    $('#trip-title').html(pageTrip.title);
    $(document).prop('title', 'DayTrippr | ' + pageTrip.title);
  } else {
    $('#place_info').append(errorText);
  }

  drawTripPlaces();
  // When we select a place, the info will show over here.
  // generatePlaceInfo(place, $('#place_info'), false, null);
});