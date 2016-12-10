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

  updateMapForNewPlace(place);
  generatePlaceInfo(place);
  console.log(place);
}

function generatePlaceInfo(place) {
  $('#place_info').empty();

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
}

$(document).ready(function() {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  setupAutoCompleteSearch();

  initMap();

  $(document).foundation();
})