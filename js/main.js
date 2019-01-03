
var base_url = "http://puigpedros.salleurl.edu/pwi/pac4/";
var atack_api = "ataque.php?";
var server_api = "partida.php?";
var token = "token=46b153a6-6fa5-4b7b-b67c-c73a2512af5b";

var left, up, right, down; 
var s, w, d, o, e;
var x=480/2, y=480/2, dim=10;
var cols = dim, rows = dim;
var block_margin = 1;

var ajaxASYNC = {request: ajaxRequest};
var mapInfo;

var id;
var mapView, mapViewArray;
var navKeys, navKeysArray;
var orientationItem, orArr;
var nombre, sexo, nivel, ataque, defensa, vida, objetos;

var enemy;
var or;

var left_select,left_last, right_select, right_last;
var fight_btn, collect_btn;

var start, save, retrieve, del;
var dialog, dialog_btn;

var enemies;

var modal, span;

/* Inicializar el juego */
function iniciarJuego() {

  //document.addEventListener('click', processClick, false);
  mapInfo = document.getElementById('mapInfo');
  document.onkeydown = processKeyDown;

  player.estadoPartida.direccion = 0;

  fight_btn = document.getElementById('fight_btn');
  fight_btn.addEventListener('click', fight, false);
  fight_btn.disabled = true;

  collect_btn = document.getElementById('collect_btn');
  collect_btn.addEventListener('click', collect, false);
  collect_btn.disabled = true;

  start = document.getElementById('start');
  start.addEventListener('click', startGame, false);
  save = document.getElementById('save');
  save.addEventListener('click', saveGame, false);
  retrieve = document.getElementById('retrieve');
  retrieve.addEventListener('click', retrieveGame, false);
  del = document.getElementById('delete');
  del.addEventListener('click', deleteGame, false);

  if(verifyServer()) {
    initMapView();
    initNavKeys();
    initOrientation();
    initPlayer();
    initEnemies();
    //initEnemy();
    pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
    pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
    pintaObjeto("skeleton.png", player.estadoPartida.x, player.estadoPartida.y);
    //pintaEnemyInfo();
  }

  modal = document.getElementById('myModal');
  span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function submitForm() {
  console.log("SUBMIT");
  modal.style.display = "none";
}

function startGame() {
  if(document.getElementById('container') != null) {
    document.getElementById('modal_body').removeChild(document.getElementById('container'));
  }
  initStartGameDialog();
}

function saveGame() {
  if(document.getElementById('container') != null) {
    document.getElementById('modal_body').removeChild(document.getElementById('container'));
  }

  var title = document.getElementById('modal_title');
  title.textContent = "Guardar Partida";
  modal.style.display = "block";
}

function retrieveGame() {
  if(document.getElementById('container') != null) {
    document.getElementById('modal_body').removeChild(document.getElementById('container'));
  }
  var title = document.getElementById('modal_title');
  title.textContent = "Recuperar Partida";
  modal.style.display = "block";

}

function deleteGame() {
  if(document.getElementById('container') != null) {
    document.getElementById('modal_body').removeChild(document.getElementById('container'));
  }
  var title = document.getElementById('modal_title');
  title.textContent = "Borrar Partida";
  modal.style.display = "block";  
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
  x = 134;
  y = 134;
  navKeys.style.width = x + ((block_margin * 2) * 3) + "px";
  navKeys.style.height = y + ((block_margin * 2) * 3) + "px";
  navKeysArray = [];
  createNavKeys();
}

function initOrientation() {
  orientationItem = document.getElementById('orientationItem');
  orientationItem.style.width =  x + ((block_margin * 2) * 3) + "px";;
  orientationItem.style.height = y + ((block_margin * 2) * 3) + "px";;
  orArr = [];

  createGrid(orientationItem, orArr, 1, 1);
  orArr[0].grid_div.style.backgroundColor = "transparent";
  var div = document.createElement('div');
  div.style.border = "4px solid aquamarine";
  var tmp = parseInt(orArr[0].grid_div.style.width);
  
  div.style.width = tmp + "px";
  tmp = parseInt(orArr[0].grid_div.style.width);
  
  div.style.height = tmp + "px";
  div.style.display = "table";
  div.style.justifySelf = "center";
  div.style.alignSelf = "center";
  div.style.borderRadius = "50%";

  var p = document.createElement('p');
  p.textContent = "N";
  p.style.fontSize = "50px";
  p.style.textAlign = "center";
  p.style.verticalAlign = "middle";
  p.style.display = "table-cell";
  p.style.color = "cyan";
  p.style.fontWeight = "bold";
  
  or = p;

  div.appendChild(p);
  orArr[0].grid_div.appendChild(div);

  console.log("x: " + x + " y: " + y);
}

function processObject(e) {
  if(e.target.id == "left_list") {
    player.ataque -=  player.mochila[left_last].attack;
    player.defensa -= player.mochila[left_last].defense;
    right_select[left_last].disabled = false;
    player.ataque +=  player.mochila[e.target.selectedIndex].attack;
    player.defensa += player.mochila[e.target.selectedIndex].defense;
    if (e.target.selectedIndex != 0) {
      right_select[e.target.selectedIndex].disabled = true;
    }
    left_last = e.target.selectedIndex;
    console.log("Att: " + player.ataque + " Def: " + player.defensa);

  } else {
    player.ataque -=  player.mochila[right_last].attack;
    player.defensa -= player.mochila[right_last].defense;
    left_select[right_last].disabled = false;
    player.ataque +=  player.mochila[e.target.selectedIndex].attack;
    player.defensa += player.mochila[e.target.selectedIndex].defense;

    if (e.target.selectedIndex != 0) {
      left_select[e.target.selectedIndex].disabled = true;
    }

    right_last = e.target.selectedIndex;
    console.log("Att: " + player.ataque + " Def: " + player.defensa);
  }
  ataque.textContent = player.ataque;
  defensa.textContent = player.defensa;
}

function updateObjects() {

}

function processClick2(e) {
console.log("XXXXX" + e.target.id);
}

function createObjects(select, hand) {
  var div = document.createElement('div');
  div.id = hand + "_objects";
  div.classList.add('objects');
  var p = document.createElement('p');
  p.id = hand + "_objects_title";
  p.classList.add('playerInfo');
  var tmp = hand.charAt(0).toUpperCase() + hand.slice(1);
  p.textContent = tmp + " Hand: ";
  div.appendChild(p);
  select.id = hand + "_list";
  select.classList.add('list');
  
  select.addEventListener('change', processObject, false);
  for(var i = 0; i < player.mochila.length; i++) {
    var option = document.createElement('option');
    option.classList.add('list_item');
    option.textContent = player.mochila[i].name + " {" + player.mochila[i].attack + "," + player.mochila[i].defense + "} ";
    option.value = player.mochila[i].name;
    select.appendChild(option);
  }
  select[0].selected = 'selected';

  div.appendChild(select);
  document.getElementById('main_objects').appendChild(div);
}

function initPlayer() {

  nombre = document.getElementById('p_nombre_val');
  nombre.textContent = "Alex";
  sexo = document.getElementById('p_sexo_val');
  sexo.textContent = "Hombre";
  nivel = document.getElementById('p_nivel_val');
  nivel.textContent = player.nivel;
  xp = document.getElementById('p_xp_val');
  xp.textContent = player.xp;
  ataque = document.getElementById('p_ataque_val');
  ataque.textContent = player.ataque;
  defensa = document.getElementById('p_defensa_val');
  defensa.textContent = player.defensa;
  vida = document.getElementById('p_vida_val');
  vida.textContent = player.vida;
  
  var element = {name: "None", attack:0, defense:0};
  player.mochila.push(element);
  var element = {name: "Object_1", attack:2, defense:1};
  player.mochila.push(element);
  var element = {name: "Object_2", attack:3, defense:4};
  player.mochila.push(element);
  left_last = 0;
  right_last = 0;

  player.manoderecha = "";
  player.manoizquierda = "";
  
  left_select = document.createElement('select');
  createObjects(left_select, "left");

  right_select = document.createElement('select');
  createObjects(right_select, "right");

  id = player.estadoPartida.x + (player.estadoPartida.y * dim);
}

function updatePlayer(pts) {

}

function initEnemies() {

  initEnemy();
}

function initEnemy() {
  var p, span;
  var section = document.createElement('section');
  section.classList.add('fld_wrap2');
  var fieldset = document.createElement('fieldset');
  fieldset.classList.add('fieldset2');
  var legend = document.createElement('legend');
  legend.classList.add('legend2');
  legend.textContent = "Enemy";
  var section2 = document.createElement('section');
  section2.id = "enemycarac";
  section2.style.padding = "2px";
  section2.style.margin = "2px";

  section.appendChild(fieldset);
  fieldset.appendChild(legend);
  fieldset.appendChild(section2);

  enemy = document.createElement('div');
  enemy.id = "enemy";

  enemy.style.display = "flex";
  enemy.style.flexDirection = "column";
  enemy.style.justifyContent = "space-between";
  //enemy.style.margin = "2px";
  //enemy.style.padding = "2px";

  var div = document.createElement('div');
  div.id = "enemyDiv";
  div.style.display = "flex";
  div.style.flexDirection = "row";
  div.style.justifyContent = "space-between";
  div.style.alignItems = "center";

  p = document.createElement('p');
  p.textContent = "Vida: ";
  span = document.createElement('span');
  span.textContent = enemigo.vida;
  p.appendChild(span);
  p.classList.add('enemyInfo');
  div.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Ataque: ";
  span = document.createElement('span');
  span.textContent = enemigo.ataque;
  p.appendChild(span);
  p.classList.add('enemyInfo');
  div.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Defensa: ";
  span = document.createElement('span');
  span.textContent = enemigo.defensa;
  p.appendChild(span);
  p.classList.add('enemyInfo');
  div.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Xp: ";
  span = document.createElement('span');
  span.textContent = enemigo.xp;
  p.appendChild(span);
  p.classList.add('enemyInfo');
  div.appendChild(p);
  p = document.createElement('p');
  enemigo.img = "img";
  p.textContent = "Objetos: " + enemigo.objetos;
  p.classList.add('enemyInfo');
  div.appendChild(p);

  enemy.appendChild(div);
  section2.appendChild(enemy);
  document.getElementById('navegacion').appendChild(section);
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
      div.style.borderRadius = "2px";
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
        a.href = "#/";
        a.addEventListener('click', moveFront, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
        navKeysArray[i].grid_div.style.borderRadius = "4px";
        navKeysArray[i].grid_div.style.border = " 2px solid cyan";
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;
      case 2:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 3:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', turnLeft, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
        navKeysArray[i].grid_div.style.borderRadius = "4px";
        navKeysArray[i].grid_div.style.border = " 2px solid cyan";
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;
      case 4:
      navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 5:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', turnRight, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
        navKeysArray[i].grid_div.style.borderRadius = "4px";
        navKeysArray[i].grid_div.style.border = " 2px solid cyan";
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;
      case 6:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
      case 7:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', moveBack, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
        navKeysArray[i].grid_div.style.borderRadius = "4px";
        navKeysArray[i].grid_div.style.border = " 2px solid cyan";
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;
      case 8:
        navKeysArray[i].grid_div.style.backgroundColor = "transparent";
      break;
    }
  }
}

function pintaMapView(x, y) {
  mapViewArray[id].grid_div.style.backgroundColor = "aquamarine";
  mapViewArray[x + (y * dim)].grid_div.style.backgroundColor = "orangered";
}

/* Convierte lo que hay en el mapa en un archivo de imagen */
function mapaToImg(x, y) {
  return mapa[y][x][player.estadoPartida.direccion];
}

function pintaEnemyInfo() {
  enemy.style.display = "";
  /*var canvas = document.getElementById('visor');
  var context = canvas.getContext('2d');
  context.font = "30px Arial";
  context.fillStyle = "red";
  context.textAlign = "center";
  context.fillText("Hello",canvas.width/2,canvas.height/2);*/
}


function collect() {
  console.log("COLLECT");
}

function pintaObjeto(src, x, y) {
  // Consigue el canvas
  var canvas = document.getElementById('visor');
  var context = canvas.getContext('2d');

  if (mapa[y][x][4].type == "enemy") {
    var base_image = new Image();
    base_image.src = "./media/"+src;
    //base_image.addEventListener('click', fight(), false);
  
    base_image.onload = function () {
      // Pinta imagen en el canvas
      context.drawImage(this, 125, 80);
      pintaEnemyInfo();
      fight_btn.disabled = false;
    }
  } else {
    enemy.style.display = "none";
    fight_btn.disabled = true;
  }
}
/*******************************************************************/
/*******************************************************************/
function processKeyDown(key) {
  switch (key.keyCode) {
    case 37:  //Left
    key.preventDefault();
    turnLeft();
    break;
    case 38:  //Up
    key.preventDefault();
    moveFront();
    break;
    case 39:  //Right    
    key.preventDefault();
    turnRight();
    break;
    case 40:  //Down
    key.preventDefault();
    moveBack();
    break;
  }
  console.log("x: " + player.estadoPartida.x + " y: " + player.estadoPartida.y + " dir: " + player.estadoPartida.direccion);
}

function updateScreen() {
  pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
  pintaObjeto("skeleton.png", player.estadoPartida.x, player.estadoPartida.y);
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
  updateScreen();
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
  updateScreen();
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
  updateScreen();
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
  updateScreen();
}
/*******************************************************************/
/*******************************************************************/
function fightListener() {
  console.log("Fight Return: " + this.response);
  vida = document.getElementById('p_vida_val');
  console.log("pre: " + player.vida);
  player.vida = parseInt(player.vida, 10) + parseInt(this.response, 10);
  console.log("post: " + player.vida);
  vida.textContent = player.vida;
  fightBack();
}

function fight() {
  console.log("FIGHT");
  var my_url = base_url + atack_api + token + "&ataque=" + player.ataque + "&defensa=" + player.defensa;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load",fightListener, true);
  xhr.open('GET', my_url, true);
  xhr.send();
}

function fightBackListener() {
  console.log("Fight Return: " + this.response);
  vida = document.getElementById('p_vida_val');
  console.log("pre: " + player.vida);
  player.vida = parseInt(player.vida, 10) + parseInt(this.response, 10);
  console.log("post: " + player.vida);
  vida.textContent = player.vida;
}

function fightBack() {
  console.log("FIGHT BACK");
  var my_url = base_url + atack_api + token + "&ataque=" + enemigo.ataque + "&defensa=" + enemigo.defensa;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load",fightBackListener, true);
  xhr.open('GET', my_url, true);
  xhr.send();
}

function connectServer(api, type) {
  switch(api) {
    case 0: //Atack Api
    var my_url = base_url + atack_api + token + "&ataque=" + player.ataque + "&defensa=" + player.defensa;
    ajaxASYNC.request(my_url, "GET");
    break;

    case 1: //Server Api
      switch (type) {
        case 0: //POST
          var obj = "{name: 'demo'}";
          eval(obj);
          console.log(obj);
          
          var my_url = base_url + atack_api + token + "&slot=1";
          $.ajax({
            type: "POST",
            crossDomain: true,
            url: my_url,
            data: obj,
            dataType: 'json',
            contentType: 'application/json'
          });
        break;

        case 1: //GET
          console.log("GET SAVED");

        break;

        case 2: //DELETE
        break;
      }
    break;
  }
}

function requestListener() {
  console.log("resp: " + this.response);
}

function ajaxRequest(url, type) {
  console.log("URL: " + url);
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", requestListener);
  xhr.open(type, url, true);

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

function initStartGameDialog(){
  var title = document.getElementById('modal_title');
  title.textContent = "Empezar Partida";

  var container = document.createElement('div');
  container.id = "container";
  var form = document.createElement('form');
  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Name:";
  var br = document.createElement('br');
  var input = document.createElement('input');
  input.id = "name_input";
  input.type = "text";
  input.title = "Enter your Name";
  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);

  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Gender:";
  var br = document.createElement('br');
  var input = document.createElement('input');
  input.id = "gender_input";
  input.type = "text";
  input.title = "Enter your Gender"
  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);
  
  var div = document.createElement('div');
  div.id = "button_wrap";
  var input = document.createElement('input');
  input.id = "button_input";
  input.type = "button";
  input.value = "Submit";
  input.addEventListener('click', submitForm, false);
  div.appendChild(input);
  form.appendChild(div);

  container.appendChild(form);
  document.getElementById('modal_body').appendChild(container);
  modal.style.display = "block";
}



/*******************************************************************/
function initMapa(level) {
  
  s = "dungeon_step.png";
  w = "dungeon_wall.png";
  d = "dungeon_door.png";
  o = {type: "objeto"};
  e = {type: "enemy"};

  switch (level) {
    case -2:
    /* 0 Norte, 1 Sud, 2 Este, 3 Oeste*/
    //[Norte, Sud, Este, Oeste, ]
    mapa[0] = [[w,s,w,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,w,o]];
    mapa[1] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,e], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[2] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[3] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[4] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,d,o]];
    mapa[5] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[6] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[7] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[8] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,w,o]];
    mapa[9] = [[s,w,w,s,e], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,w,o]];
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