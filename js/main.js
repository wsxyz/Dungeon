var base_url = "http://puigpedros.salleurl.edu/pwi/pac4/";
var atack_api = "ataque.php?";
var server_api = "partida.php?";
var token = "token=46b153a6-6fa5-4b7b-b67c-c73a2512af5b";

var left, up, right, down; 
var s, w, d;
var x=480/4, y=480/4, dim=10;
var cols = dim, rows = dim;
var block_margin = 1;

var ajaxASYNC = {request: ajaxRequest};
var mapInfo;

var id;
var mapView, mapViewArray;
var navKeys, navKeysArray;
var nombre, sexo, nivel, ataque, defensa, vida, objetos;

var enemy;
var or;

/* Inicializar el juego */
function iniciarJuego() {

  document.addEventListener('click', processClick, false);
  mapInfo = document.getElementById('mapInfo');
  document.onkeydown = processKeyDown;


  s = "dungeon_step.png";
  w = "dungeon_wall.png";
  d = "dungeon_door.png";

  player.estadoPartida.direccion = 0;

  //var tmp = document.getElementById('main').offsetWidth;
  //console.log(tmp);
  //document.getElementById('main').style.width = "0px";
  //document.getElementById('main').style.height = "0px";

  /*setTimeout(function() {
    document.getElementById('main').style.width = "inherit";
    initNavKeys();
    initPlayer();
    initEnemy();
    pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
    pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  },3000);*/

  console.log(document.getElementById('main').offsetWidth);

  if(verifyServer()) {
    initMapView();
    initNavKeys();
    initPlayer();
    initEnemy();
    pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
    pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  }
}

function verifyServer() {
  var ok = 1;;

  return ok;
}

function initMapView() {
  mapView = document.getElementById('mapView');
  mapView.style.width = x + ((block_margin * 2) * dim) + "px";
  mapView.style.height = y + ((block_margin * 2) * dim) + "px";
  mapViewArray = [];
  initMapa(player.estadoPartida.nivel);
  createMapView();
}

function initNavKeys() {
  navKeys = document.getElementById('navKeys');
  navKeys.style.width = x + ((block_margin * 2) * 3) + "px";
  navKeys.style.height = y + ((block_margin * 2) * 3) + "px";
  navKeysArray = [];
  createNavKeys();
}

function initPlayer() {
  nombre = document.getElementById('nombre');
  nombre.textContent = "Nombre: " + "Alex";
  sexo = document.getElementById('sexo');
  sexo.textContent = "Sexo: " + "Hombre";
  nivel = document.getElementById('nivel');
  nivel.textContent = "Nivel: " + player.nivel;
  ataque = document.getElementById('ataque');
  ataque.textContent = "Ataque: " + player.ataque;
  defensa = document.getElementById('defensa');
  defensa.textContent = "Defensa: " + player.defensa;
  vida = document.getElementById('vida');
  vida.textContent = "Vida: " + player.vida;
  objetos = document.getElementById('objetos');
  objetos.textContent = "Objetos: " + player.objetos;
  id = player.estadoPartida.x + (player.estadoPartida.y * dim);
}

function initEnemy() {
  var p;
  enemy = document.createElement('div');
  p = document.createElement('p');
  p.textContent = "Vida: " + enemigo.vida;
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Ataque: " + enemigo.ataque;
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Defensa: " + enemigo.defensa;
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Xp: " + enemigo.xp;
  enemy.appendChild(p);
  p = document.createElement('p');
  enemigo.img = "img";
  p.textContent = "Objetos: " + enemigo.objetos;
  enemy.appendChild(p);
  document.getElementById('main').appendChild(enemy);
}

function createGrid(dst, dst_arr, cols, rows) {
  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      var div = document.createElement('div');
      div.classList.add ('block');
      div.style.width = (x/cols) + "px";
      div.style.height = (y/rows) + "px";
      div.style.margin = block_margin + "px";
      div.style.backgroundColor = "aquamarine";
      div.style.display = "grid";
      var obj = {grid_div: div};
      dst_arr.push(obj);
      dst.appendChild(dst_arr[dst_arr.length - 1].grid_div);
    }
  }
}

function createMapView() {
  createGrid(mapView, mapViewArray, dim, dim);
}

function createNavKeys() {
  createGrid(navKeys, navKeysArray, 3, 3);
  for(var i = 0; i < navKeysArray.length; i++) {
    switch(i) {
      case 0:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 1:
        var a = document.createElement('a');
        a.href = "#";
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "gray";
      break;
      case 2:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 3:
        var a = document.createElement('a');
        a.href = "#";
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "gray";
      break;
      case 4:
        var div = document.createElement('div');
        div.style.backgroundColor = "blue";
        var tmp = parseInt(navKeysArray[i].grid_div.style.width);
        tmp -= 4;
        div.style.width = tmp + "px";
        tmp = parseInt(navKeysArray[i].grid_div.style.width);
        tmp -= 4;
        div.style.height = tmp + "px";
        div.style.display = "table";
        div.style.justifySelf = "center";
        div.style.alignSelf = "center";
        div.style.borderRadius = "50%";

        var p = document.createElement('p');
        p.textContent = "N";
        p.style.textAlign = "center";
        p.style.verticalAlign = "middle";
        p.style.display = "table-cell";
        p.style.color = "white";
        p.style.fontWeight = "bold";
        or = p;

        div.appendChild(p);
        navKeysArray[i].grid_div.appendChild(div);

      break;
      case 5:
        var a = document.createElement('a');
        a.href = "#";
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "gray";
      break;
      case 6:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 7:
        var a = document.createElement('a');
        a.href = "#";
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "gray";
      break;
      case 8:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
    }
  }
}

function pintaMapView(x, y) {
  mapViewArray[id].grid_div.style.backgroundColor = "aquamarine";
  mapViewArray[x + (y * dim)].grid_div.style.backgroundColor = "red";
}

/* Convierte lo que hay en el mapa en un archivo de imagen */
function mapaToImg(x, y) {
  return mapa[y][x][player.estadoPartida.direccion];
}

/*******************************************************************/
/*******************************************************************/
function processKeyDown(key) {
  switch (key.keyCode) {
    case 65: case 37:  //Left
    turnLeft();
    break;
    case 87: case 38:  //Up
    moveFront();
    break;
    case 68: case 39:  //Right    
    turnRight();
    break;
    case 83: case 40:  //Down
    moveBack();
    break;
  }
  pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
  console.log("x: " + player.estadoPartida.x + " y: " + player.estadoPartida.y + " dir: " + player.estadoPartida.direccion);
}

function turnLeft() {
  switch(player.estadoPartida.direccion) {
    case 0:
      player.estadoPartida.direccion = 2;
      or.textContent = "W";
    break;
    case 1:
      player.estadoPartida.direccion = 3;
      or.textContent = "E";
    break;
    case 2:
      player.estadoPartida.direccion = 1;
      or.textContent = "S";
    break;
    case 3:
      player.estadoPartida.direccion = 0;
      or.textContent = "N";
    break;
  }
}

function moveFront() {
  id = player.estadoPartida.x + (player.estadoPartida.y * dim);
  switch (player.estadoPartida.direccion) {
    case 0:
      if (player.estadoPartida.y > 0) {
        player.estadoPartida.y -= 1;
      }
    break;
    case 1:
      if (player.estadoPartida.y < 9) {
        player.estadoPartida.y += 1;
      }
    break;
    case 2:
      if (player.estadoPartida.x > 0) {
        player.estadoPartida.x -= 1;
      }
    break;
    case 3:
    if (player.estadoPartida.x < 9) {
      player.estadoPartida.x += 1;
    }
    break;
  }
}

function turnRight() {
  switch(player.estadoPartida.direccion) {
    case 0:
      player.estadoPartida.direccion = 3;
      or.textContent = "E";
    break;
    case 1:
      player.estadoPartida.direccion = 2;
      or.textContent = "W";
    break;
    case 2:
      player.estadoPartida.direccion = 0;
      or.textContent = "N";
    break;
    case 3:
      player.estadoPartida.direccion = 1;
      or.textContent = "S";
    break;
  }
}

function moveBack() {
  id = player.estadoPartida.x + (player.estadoPartida.y * dim);
  switch (player.estadoPartida.direccion) {
    case 0:
      if (player.estadoPartida.y < 9) {
        player.estadoPartida.y += 1;
      }
    break;
    case 1:
      if (player.estadoPartida.y > 0) {
        player.estadoPartida.y -= 1;
      }
    break;
    case 2:
      if (player.estadoPartida.x < 9) {
        player.estadoPartida.x += 1;
      }
    break;
    case 3:
      if (player.estadoPartida.x > 0) {
        player.estadoPartida.x -= 1;
      }
    break;
  }
}
/*******************************************************************/
/*******************************************************************/
function func1() {
  console.log("hit");
  console.log(this.responseXML);
}
function connectServer(api, type) {
  switch(api) {
    case 0: //Atack Api
    break;

    case 1: //Server Api
      switch (type) {
        case 0: //POST
          var obj = "{name: 'demo'}";
          eval(obj);
          console.log(obj);
          //var my_url = base_url + server_api + token + "&slot=1";
          
          var my_url = "http://puigpedros.salleurl.edu/pwi/pac4/partida.php?token=46b153a6-6fa5-4b7b-b67c-c73a2512af5b&slot=1";
          $.ajax({
            type: "POST",
            url: my_url,
            data: obj,
            dataType: "json"
          });

          /*fetch(my_url, {
            method: "POST",
            body: JSON.stringify(obj)
          }).then(function(response) {
            console.log("shit");
            console.log(response);
          });*/

          //$.post(my_url, JSON.stringify(obj));

          //ajaxASYNC.request(my_url, "POST");

        break;

        case 1: //GET
          console.log("GET SAVED");
          var my_url = base_url + atack_api + token;
          ajaxASYNC.request(my_url, "GET");

          /*$.ajax({
            type: "GET",
            url: my_url,
            success: func1,
          });*/
        break;

        case 2: //DELETE
        break;
      }
    break;
  }
}

function requestListener() {
  //var result = eval(this.responseText);
  //console.log(this.responseText)
  console.log("resp: " + this.responseXML.body);

  //var json = JSON.parse(this.responseText);
  //console.log(json);
}

function ajaxRequest(url, type) {
  console.log("URL: " + (url + "&ataque=1&defensa=2"));
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", requestListener);
  xhr.open(type, url, true);
  xhr.responseType = "document";

  if (type == "POST") {
    var obj = '{name: "demo"}';
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(obj));
  } else {
    xhr.send();
  }
}

function processClick() {
  console.log("click");
}

/*******************************************************************/
/*******************************************************************/
function initMapa(level) {
  switch (level) {
    case -2:
    /* 0 Norte, 1 Sud, 2 Este, 3 Oeste*/
    mapa[0] = [[w,s,w,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,w]];
    mapa[1] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[2] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[3] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[4] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,d]];
    mapa[5] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[6] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[7] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[8] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,w]];
    mapa[9] = [[s,w,w,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,w]];
    break;

    case -1:
    /*mapa[0] = [[w,s,w,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,w]];
    mapa[1] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[2] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[3] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[4] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,d]];
    mapa[5] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[6] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[7] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[8] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,w]];
    mapa[9] = [[s,w,w,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,w]];*/
    break;

    case 0:
    /*mapa[0] = [[w,s,w,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,s], [w,s,s,w]];
    mapa[1] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,w,w]];
    mapa[2] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[3] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[4] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,d]];
    mapa[5] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[6] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[7] = [[s,s,w,s], [s,s,s,s], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [0,1,2,3], [s,s,s,s], [s,s,w,w]];
    mapa[8] = [[s,s,w,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,s], [s,s,s,w]];
    mapa[9] = [[s,w,w,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,s], [s,w,s,w]];*/
    break;
  }
}