$(document).ready(function () {
  getDirections('2920 Broadway, New York, NY 10027', '70 Morningside Drive, New York, NY 10027');
  getDistanceMatrix(['2920 Broadway, New York, NY 10027'], ['70 Morningside Drive, New York, NY 10027']);

  initMap();

  // Bind the autocomplete to the map so we see local places.
  //autocomplete.bindTo('bounds', map);
  $(document).foundation();
});