$(document).ready(function () {
  // Set top margin of our content.
  var headerHeight = $('.fixed-bar').outerHeight();
  $('#content').css('margin-top', headerHeight);

  var trips = DATA['New York'];

  var sample = generateTripCard(trips[0]);
  $('#content').append(sample);
  console.log(sample);


  initSampleMap();


  // Bind the autocomplete to the map so we see local places.
  //autocomplete.bindTo('bounds', map);
  $(document).foundation();
});