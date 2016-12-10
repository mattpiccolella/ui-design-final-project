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

var helpText = $("<p class='light-gray' id='blank-trip'>You haven't added any places to your trip yet! Search on the left side to select an item and add it to your trip.</p>");
var placeInfoText = $("<p class='light-gray' id='blank-trip'>Information about search result will show up here.</p>");

function setupAutoCompleteSearch() {
  var input = document.getElementById('place_search');

  autocomplete = new google.maps.places.Autocomplete(input);

  // TODO: Bind bounds to the map to improve searches.

  autocomplete.addListener('place_changed', placeSearchChanged);
}

function placeSearchChanged() {
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    // TODO: Handle the error.
    console.log('Sorry, but you entered an invalid place.')
    return;
  }
  updateMapForNewPlace(place, genericMapMarker);
  generatePlaceInfo(place);
  console.log(place);
}

function addCurrentPlaceToTrip() {
  currentTripPlaces.push(selectedPlace);

  updateCurrentTrip();
}

function resetPlaceSearch() {
  $('#place_info').empty();

  $('#place_info').append(placeInfoText);

  $('#place_search').val('');
}

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

  updateCurrentTrip();
}

function updateCurrentTrip() {
  genericMapMarker.setVisible(false);
  firstLegMarker.setVisible(false);
  var currentTrip = $('#current-trip-steps');
  currentTrip.empty();

  if (currentTripPlaces.length == 0) {
    currentTrip.append(helpText);
  } else {
    var iconChar = 'A';
    for (var i = 0; i < currentTripPlaces.length; i++) {
      var iconLink = generateIconLink(iconChar, (i != currentTripPlaces.length - 1));
      var row = generatePlaceRow(currentTripPlaces[i], iconLink, removePlaceFromTrip);
      currentTrip.append(row);
      iconChar = nextChar(iconChar);
    }
    if (currentTripPlaces.length > 1) {
      calculateAndDisplayRoute(currentTripPlaces, directionsService, directionsDisplay);
    } else {
      updateMapForNewPlace(currentTripPlaces[0], firstLegMarker);
    }
  }
}

function createTrip() {
  var isValid = true;

  if ($('#title_bar').val() == '') {
    $('#title_bar').css('border', '1px solid red');
    isValid = false;
  }

  if (currentTripPlaces.length == 0) {
    alert("Please add at least one place to your trip before creating it.");
    isValid = false;
  }

  if (isValid) {
    var newTrip = {};
    newTrip.title = $('#title_bar').val();
    newTrip.id = Math.floor(Math.random() * 100000) + 1  ;
    newTrip.places = currentTripPlaces;

    var pastAddedPlaces = store.get('addedTrips');
    console.log(pastAddedPlaces);
    if (pastAddedPlaces) {
      pastAddedPlaces.push(newTrip);
      store.set('addedTrips', pastAddedPlaces);
    } else {
      store.set('addedTrips', [newTrip]);
    }

    alert('Thanks so much for adding your trip! Return to the Search page to find your trip.');

    currentTripPlaces = [];
    updateCurrentTrip();
    resetPlaceSearch();
    $('#title_bar').val('');
    directionsDisplay.setDirections({routes: []});
  }
}

function generatePlaceInfo(place) {
  $('#place_info').empty();

  selectedPlace = place;

  var title = $("<h4 class='info'>" + place.name + '</h4>');
  var address = $("<h6 class='info'>" + place.formatted_address + '</h6>');
  var number = $("<h6 class='info'>" + place.formatted_phone_number + '</h6>');
  var types = $("<h6 class='info capitalize'>" + getPlaceTypes(place.types, 3) + '</h6>');

  $('#place_info').append(title);
  $('#place_info').append(address);
  $('#place_info').append(number);
  $('#place_info').append(types);

  if (place.photos) {
    orbit = $("<div class='orbit' role='region' data-auto-play='false' data-orbit>");
    var orbitContainer = $('<ul/>').addClass('orbit-container');
    var prevButton = $('<button class="orbit-previous"><span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;</button>');
    var nextButton = $('<button class="orbit-next"><span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;</button>');
    orbitContainer.append(prevButton);
    orbitContainer.append(nextButton);
    for (var i = 0; i < (place.photos.length > 4 ? 4 : place.photos.length); i++) {
      var imageUrl = place.photos[i].getUrl({'maxHeight': 300});
      if (imageUrl) {
        var imageSlide = $('<li/>').addClass('orbit-slide');
        var img = $('<img class="orbit-image">').attr('src', imageUrl); 
        var caption = $('<figcaption class="orbit-caption"></figcaption>');
        imageSlide.append(img);
        imageSlide.append(caption);
        orbitContainer.append(imageSlide);
      }
    }
    console.log(orbitContainer);
    orbit.append(orbitContainer);
    $('#place_info').append(orbit);
    $(document).foundation();
  }

  if (place.opening_hours && place.opening_hours.weekday_text) {
    var hours = $("<h6 class='info'>Hours on " + place.opening_hours.weekday_text[(new Date()).getDay()] + "</h6>");
    $('#place_info').append(hours);
  }

  if (place.website) {
    var website = $("<h6 class='info'><a href='" + place.website + "' target='_blank'>Visit Website</a></h6>");
    $('#place_info').append(website);
  }

  var addToTripButton = $("<a id='add-to-trip-button' class='button'>Add to Trip</a>");
  $('#place_info').append(addToTripButton);
  $('#add-to-trip-button').click(addCurrentPlaceToTrip);
}

$(document).ready(function() {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  setupAutoCompleteSearch();

  initMap();

  $(document).foundation();

  $('#place_info').append(placeInfoText);

  updateCurrentTrip();

  $('#create-trip-button').click(createTrip);

  $('#title_bar').on('input', function() {
    var numChars = $('#title_bar').val().length;
    if (numChars == 0) {
      $('#title_bar').css('border', '1px solid red');
    } else {
      $('#title_bar').css('border', '');
    }
  })
})