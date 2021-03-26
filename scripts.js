
var wallyLatLong = wallyPoint()
let markersWally = [];

const image = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';

let map;
let markers = [];

let tentativas = 10;
let numClique = 0;

var continuar = 'y';

// Centralize map on center of South America
const myLatlng = { lat: -14.000, lng: -54.000 };

// Inicialize map
map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
});

// Popups a infowindow to show instructions
let infoWindow = new google.maps.InfoWindow({
  content: "Clique no mapa e tente adivinhar onde está Wally!",
  position: myLatlng,
});
infoWindow.open(map);

// This event listener executes all actions when the map is clicked.
map.addListener("click", (event) => {
  infoWindow.close(); // closes first infowindow
  numClique ++;
  addMarker(event.latLng, numClique); // add a maker with title (number of try)

  // console.log(event.latLng.toJSON())

  tentativas = tentativas - 1
  infoWindow = new google.maps.InfoWindow({
    position: event.latLng,
    content: "Você ainda possui " + tentativas + " tentativas."
  });
  infoWindow.open(map);

  // returns distance between waldo location and guessed location
  var distancia = (getDistanceFromLatLonInKm(
    wallyLatLong,
    event.latLng.toJSON(),
  ));

// checks if user finds waldo
  if(distancia < 500){
    alert("Parabéns, você encontrou Wally")
    alert("O mapa será limpo e você poderá começar o jogo novamente!")
    restartGame();
    infoWindow.close();
  };

// if not user finds waldo, show the directions of waldo.
  var direcao = wallyDirection(
    wallyLatLong,
    event.latLng.toJSON(),
  );

  alert("Wally está mais a "+ direcao.dirLat + " e " + direcao.dirLng + " de onde você clicou!")


  if (tentativas == 0) {
    alert("Infelizmente você não localizou Wally. O jogo acabou!")
    restartGame();
    infoWindow.close();
  };
});


function wallyDirection(position1, position2){
  var dirLat;
  var dirLng;
  if (position1.lng < position2.lng){
    dirLng = 'Oeste'
  }else{
    dirLng = 'Leste'
  }
  if (position1.lat < position2.lat){
    dirLat = 'Sul'
  }else{
    dirLat = 'Norte'
  }
  return {dirLat: dirLat, dirLng:dirLng}
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

// Adds a marker to the map and push to the markers array.
function addMarker(location, title) {
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "Tentativa " + title
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(mapMarker=markers, map) {
  for (let i = 0; i < mapMarker.length; i++) {
    mapMarker[i].setMap(map);
    console.log("Executando setMapOnAll para: " + mapMarker[i])
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(mapMarker=markers) {
  setMapOnAll(mapMarker,null);
}

// Shows any markers currently in the array.
function showMarkers(mapMarker=markers) {
  setMapOnAll(mapMarker,map);
}

// Restart Game. Deletes all markers in the array, and set default game values.
function restartGame() {
  clearMarkers(markers);
  clearMarkers(markersWally);
  markers = [];
  markersWally = [];
  tentativas = 10;
  numClique = 0;
  wallyLatLong = wallyPoint();
}

// Calculates geografic distance between user guess and waldo location
function getDistanceFromLatLonInKm(position1, position2) {
    "use strict";
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        R = 6371,
        dLat = deg2rad(position2.lat - position1.lat),
        dLng = deg2rad(position2.lng - position1.lng),
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(deg2rad(position1.lat))
            * Math.cos(deg2rad(position1.lat))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // '* 1' means, return value in KM. If want to show Km, change to '* 1000'
    return ((R * c * 1).toFixed());
}
// return a random location for waldo, limited for Upperleft (5,-71) downright(-33,-37)
// since I don't limited using south america borders, this point could be at ocean.
function wallyPoint(){
  const wallyLat = getRandomInRange(-33, 5, 3);
  const wallyLong = getRandomInRange(-71, -37, 3);
  return { lat: wallyLat, lng: wallyLong }
}

// Waldo marker, using a green pin
function addWaldoMarker(location=wallyLatLong, pin=image){
  const wallyMarker = new google.maps.Marker({
    position: location,
    map: map,
    icon:pin,
    title: "Olá, eu sou Wally!",
  });
  markersWally.push(wallyMarker);
  console.log("Marcador do Wally: " + markersWally)
};
