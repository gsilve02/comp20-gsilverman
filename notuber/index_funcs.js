var username = "vJ8HkH3e";
var url = "http://enigmatic-beach-51061.heroku.com/submit";
var mode, otherMarkers, newMarker;
var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var myLoc = new google.maps.LatLng(myLat, myLng);
var myOptions = {
      zoom: 15,
      center: myLoc,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
var map;
var marker;
var infowindow = new google.maps.InfoWindow();

var geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};

function init()
{
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  getMyLocation();
}

function getMyLocation() {
  if (navigator.geolocation) {
    // found this method of calling getCurrentPosition on Modzilla Dev Tools
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, geolocationOptions);
  }
  else {
    alert("Ahh it looks like your geolocation services aren't working");
  }
}

// found the following two functions and how to use them with
// navigator.geolocation.geCurrentPosition on Modzilla Developer Tools
function geolocationSuccess(position) {
  myLat = position.coords.latitude;
  myLng = position.coords.longitude;
  sendLocation();
  renderMap();
}

function geolocationError() {
  alert("Sorry it looks like your geolocation doesn't work");
}

function sendLocation() {
  var param = "username=" + username + "&lat=" + myLat + "&lng=" + myLng;
  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(param);

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {

      // see what kind of user you are
      if (request.responseText[2] == "v") {
        mode = "vehicles"
      } else if (request.responseText[2] == "p") {
        mode = "passengers"
      } else {
        alert("error in JSON data");
      }

      if (mode == "vehicles") {
        otherMarkers = "img/drivers.png";
      } else if (mode == "passengers") {
        otherMarkers = "img/vehicles";
      }

      data = JSON.parse(request.responseText);
      data = data[mode];

      for (i = 0; i < data.length; i++) {
        var newVehicle = data[i];
        var newLoc = new google.maps.LatLng(newVehicle["lat"], newVehicle["lng"]);

        var distance = google.maps.geometry.spherical.computeDistanceBetween(newLoc, myLoc) * 0.000621371;
        distance = distance.toFixed(3);
        var newTitle = newVehicle["username"] + ": " + distance;

        if (mode == "vehicles") {
          newMarker = new google.maps.Marker({
            position: newLoc,
            icon: "img/drivers.png",
            title: "<p>Username: " + newVehicle["username"] + "<br/>Distance: " + distance + " miles</p>"
          });

        } else if (mode == "passengers") {
          newMarker = new google.maps.Marker({
            position: newLoc,
            icon: "img/vehicles.png",
            title: newTitle
          });
        }
        newMarker.setMap(map);
        google.maps.event.addListener(newMarker, 'click', function() {
          infowindow.setContent(this.title);
          infowindow.open(map, this);
        });
      }
    }
  }

}

function renderMap()
{
  myLoc = new google.maps.LatLng(myLat, myLng);

  map.panTo(myLoc);

  marker = new google.maps.Marker({
    position: myLoc,
    icon: "img/pushteen.png",
    title: "<p>Your username: " + username + "</p>"
  });
  marker.setMap(map);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(marker.title);
    infowindow.open(map, marker);
  });
 }
