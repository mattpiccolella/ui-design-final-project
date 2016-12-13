// Global application variables.
var selectedPlace;
var currentTripPlaces = [];
var markers = [];
var genericMapMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
});
var firstLegMarker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
    icon: "http://www.google.com/mapfiles/markerA.png"
});


// Helper and placeholder text for our application.
var helpText = $("<p class='light-gray' id='blank-trip'>You haven't added any places to your trip yet! Search on the left side to select an item and add it to your trip.</p>");
var placeInfoText = $("<p class='light-gray' id='blank-trip'>Information about search result will show up here.</p>");

// Set up the search for our Google Places searchbox.
function setupAutoCompleteSearch() {
  var input = document.getElementById('place_search');

  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', placeSearchChanged);
}

// Respond to changes in search text.
function placeSearchChanged() {
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    console.log('Sorry, but you entered an invalid place.')
    return;
  }
  updateMapForNewPlace(place, genericMapMarker);
  selectedPlace = place;
  generatePlaceInfo(place, $('#place_info'), true, addCurrentPlaceToTrip);
  updateCurrentTrip(false);
  $(document).foundation();
}

// Push the new place to the trip, update the current trip.
function addCurrentPlaceToTrip() {
  currentTripPlaces.push(selectedPlace);

  updateCurrentTrip(true);
}

// In the case where we want to clear the page, we need the ability to reset the search.
function resetPlaceSearch() {
  $('#place_info').empty();

  $('#place_info').append(placeInfoText);

  $('#place_search').val('');
}

// Search through the trips and remove the one with a given ID.
// Also update the current trip once we have removed that place.
function removePlaceFromTrip(placeId) {
  var index = -1;
  for (var i = 0; i < currentTripPlaces.length; i++) {
    if (placeId == currentTripPlaces[i].place_id) {
      index = i;
    }
  }

  if (index != -1) {
    currentTripPlaces.splice(index, 1);
  }

  updateCurrentTrip(true);
}

// Update the current trip.
// Parameter: shouldChangeMap - whether the map should also be updated.
function updateCurrentTrip(shouldChangeMap) {
  var currentTrip = $('#current-trip-steps');
  currentTrip.empty();

  if (currentTripPlaces.length == 0) {
    currentTrip.append(helpText);
  } else {
    var iconChar = 'A';
    for (var i = 0; i < currentTripPlaces.length; i++) {
      // Helper methods to generate the actual HTML for each trip.
      var iconLink = generateIconLink(iconChar, (i != currentTripPlaces.length - 1));
      var row = generatePlaceRow(currentTripPlaces[i], iconLink, showTripInfo, removePlaceFromTrip);
      // Mark a trip as selected.
      if (currentTripPlaces[i].place_id == selectedPlace.place_id) {
        row.css('border', '2px solid hsla(0,0%,4%,.25)');
        row.css('border-radius', '3px');
      }
      currentTrip.append(row);
      iconChar = nextChar(iconChar);
    }
    if (shouldChangeMap) {
      genericMapMarker.setVisible(false);
      firstLegMarker.setVisible(false);
      directionsDisplay.setDirections({routes: []});
      if (currentTripPlaces.length > 1) {
        calculateAndDisplayRoute(currentTripPlaces, directionsService, directionsDisplay);
      } else {
        updateMapForNewPlace(currentTripPlaces[0], firstLegMarker);
      }
    }
  }
}

// Show the actual information for a place on the screen.
function showTripInfo(event) {
  generatePlaceInfo(event.data.place, $('#place_info'), false, null);
  $('#place_search').val(event.data.place.name + ', ' + event.data.place.formatted_address);
  selectedPlace = event.data.place;
  updateCurrentTrip(false);
  $(document).foundation();
}

// Our global method for actually creating a trip. This adds to the local storage.
function createTrip() {
  var isValid = true;

  // Error handling for title.
  if ($('#title_bar').val() == '') {
    $('#title_bar').css('border', '1px solid red');
    isValid = false;
  }

  // Alert the user if they try to create a blank trip.
  if (currentTripPlaces.length == 0) {
    alert("Please add at least one place to your trip before creating it.");
    isValid = false;
  }

  if (isValid) {
    var newTrip = {};
    newTrip.title = $('#title_bar').val();
    newTrip.id = Math.floor(Math.random() * 100000) + 1  ;
    newTrip.places = currentTripPlaces;

    // Save the data to local storage.
    var pastAddedPlaces = store.get('addedTrips');
    if (pastAddedPlaces) {
      pastAddedPlaces.unshift(newTrip);
      store.set('addedTrips', pastAddedPlaces);
    } else {
      store.set('addedTrips', [newTrip]);
    }

    alert('Thanks so much for adding your trip! Return to the Search page to find your trip.');

    // Clear the page so a user can create a new trip.
    currentTripPlaces = [];
    updateCurrentTrip(true);
    resetPlaceSearch();
    $('#title_bar').val('');
    directionsDisplay.setDirections({routes: []});
  }
}

$(document).ready(function() {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  // Set up the page.
  initMap();

  setupAutoCompleteSearch();

  $(document).foundation();

  $('#place_info').append(placeInfoText);

  updateCurrentTrip(true);

  $('#create-trip-button').click(createTrip);

  // Error handling for the title bar.
  $('#title_bar').on('input', function() {
    var numChars = $('#title_bar').val().length;
    if (numChars == 0) {
      $('#title_bar').css('border', '1px solid red');
    } else {
      $('#title_bar').css('border', '');
    }
  })
});