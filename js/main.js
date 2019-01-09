
var base_url = "http://puigpedros.salleurl.edu/pwi/pac4/";
var atack_api = "ataque.php?";
var server_api = "partida.php?";
var token = "token=46b153a6-6fa5-4b7b-b67c-c73a2512af5b";

var left, up, right, down; 
var s, w, d, o, e1,e2;
var x=480/2, y=480/2, dim=10;
var cols = dim, rows = dim;
var block_margin = 1;

var ajaxASYNC = {request: ajaxRequest};
var mapInfo;

var id;
var mapView, mapViewArray;
var navKeys, navKeysArray;
var orientation, orientationItem, orientationArray;
var nombre, sexo, nivel, ataque, defensa, vida, objetos;

var enemy, enemy_id;

var left_select,left_last, right_select, right_last;
var fight_btn, collect_btn;

var start, save, retrieve, del;
var dialog, dialog_btn;

var enemies;

var modal, modal_close;
var nav_btn;

/* Inicializar el juego */
function iniciarJuego() {

  //document.addEventListener('click', processClick, false);
  mapInfo = document.getElementById('mapInfo');
  document.onkeydown = processKeyDown;
  enemies = [];


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
  retrieve.addEventListener('click', loadGame, false);
  del = document.getElementById('delete');
  del.addEventListener('click', deleteGame, false);

  if(verifyServer()) {
    initMapView();
    initNavKeys();
    initOrientation();
    initPlayer();
    initEnemies();
    pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
    pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  }

  nav_btn = document.getElementById('nav-button');
  nav_btn.addEventListener('click', navBar, false);

  modal = document.getElementById('dialog');
  modal_close = document.getElementsByClassName("dialog_close")[0];
  
  modal_close.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  window.onresize = processResize;
}

function processResize(event) {
  console.log('resizing');
  console.log("Inner width: " + window.innerWidth);
  if (window.innerWidth >= 689) {
    var nav = document.getElementById('nav');
    nav.style.display = "grid";
    if(!nav.classList.contains('active')) {
      document.getElementById('nav-icon').style.display = "none";
    }else {
      document.getElementById('nav-icon').style.display = "block";
    } 
  } else {
    var nav = document.getElementById('nav');
    if(!nav.classList.contains('active')) {
      nav.style.display = "none";
    }
    document.getElementById('nav-icon').style.display = "block";
  }
}

function navBar() {
  console.log('NAV');
  showMenu();
}

function showMenu() {

  if (document.getElementById('nav-button').classList.contains('active-button')) {
    document.getElementById('nav-button').classList.remove('active-button');
    var nav = document.getElementById('nav');
    nav.getElementsByClassName('navList')[0].style.flexDirection = "row";
    nav.style.display = "none";
    nav.classList.remove('active');
    var menu = document.getElementById('header');
    //menu.appendChild(nav);
    menu.insertBefore(nav, menu.children[1]);
    document.getElementById('nav-icon').textContent = 'menu';
    processResize();
  } else {
    document.getElementById('nav-button').classList.add('active-button');
    console.log("Header Height: " + document.getElementById('header').offsetHeight);
    var nav = document.getElementById('nav');
    nav.classList.add('active');
    nav.getElementsByClassName('navList')[0].style.flexDirection = "column";
    nav.style.display = "grid";
    var menu = document.getElementById('flex_menu');
    menu.appendChild(nav);
    document.getElementById('nav-icon').textContent = 'clear';
  }
}

function submitForm() {
  console.log("SUBMIT");
  console.log("Name: " + document.getElementById('name_input').value);
  modal.style.display = "none";
}

function clearDialog() {
  if(document.getElementById('container') != null) {
    document.getElementById('dialog_body').removeChild(document.getElementById('container'));
  }
}

function startGame() {
  clearDialog();
  initStartGameDialog();
}

function saveGame() {
  clearDialog();
  var title = document.getElementById('dialog_title');
  title.textContent = "Save Game";
  modal.style.display = "block";
}

function loadGame() {
  clearDialog();
  var title = document.getElementById('dialog_title');
  title.textContent = "Load Game";
  modal.style.display = "block";

}

function deleteGame() {
  clearDialog();
  var title = document.getElementById('dialog_title');
  title.textContent = "Delete Game";
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
  orientationArray = [];

  createGrid(orientationItem, orientationArray, 1, 1);
  orientationArray[0].grid_div.style.backgroundColor = "transparent";
  
  var div = document.createElement('div');
  div.classList.add('orientation_circle');  
  div.style.width = parseInt(orientationArray[0].grid_div.style.width) + "px";
  div.style.height = parseInt(orientationArray[0].grid_div.style.height) + "px";

  var p = document.createElement('p');
  p.classList.add('orientation_value');
  p.textContent = "N";

  orientation = p;

  div.appendChild(p);
  orientationArray[0].grid_div.appendChild(div);

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
  document.getElementById('player_objects').appendChild(div);
}

function initPlayer() {

  nombre = document.getElementById('p_val_nombre');
  nombre.textContent = "Alex";
  sexo = document.getElementById('p_val_sexo');
  sexo.textContent = "Hombre";
  nivel = document.getElementById('p_val_nivel');
  nivel.textContent = player.nivel;
  xp = document.getElementById('p_val_xp');
  xp.textContent = player.xp;
  ataque = document.getElementById('p_val_ataque');
  ataque.textContent = player.ataque;
  defensa = document.getElementById('p_val_defensa');
  defensa.textContent = player.defensa;
  vida = document.getElementById('p_val_vida');
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
  for(var i = 0; i < 2; i++) {
    let tmp = Object.assign({}, enemigo);
    tmp.vida = Math.floor(Math.random() * 10) + 1;
    tmp.ataque = Math.floor(Math.random() * 1) + 1;
    tmp.defensa = Math.floor(Math.random() * 1) + 1;
    tmp.xp = Math.floor(Math.random() * 10) + 1;
    tmp.img = "./media/skeleton.png";
    enemies.push(tmp);
  }
  initEnemy();
}

function initEnemy() {
  var p, span;
  var section = document.createElement('div');
  section.classList.add('fieldset_wrap');
  section.classList.add('fw_enemy');
  var fieldset = document.createElement('fieldset');
  fieldset.classList.add('fieldset');
  fieldset.classList.add('f_enemy');

  var legend = document.createElement('legend');
  legend.classList.add('fieldset_legend');
  legend.classList.add('fl_enemy');
  legend.textContent = "Enemy";
  var section2 = document.createElement('div');
  section2.classList.add('fieldset_content');
  section2.classList.add('fc_content');

  section.appendChild(fieldset);
  fieldset.appendChild(legend);
  fieldset.appendChild(section2);

  enemy = document.createElement('div');
  enemy.classList.add('enemyDetails');

  p = document.createElement('p');
  p.textContent = "Vida: ";
  span = document.createElement('span');
  span.classList.add('e_val');
  span.id = 'e_val_vida';
  p.appendChild(span);
  p.classList.add('enemyInfo');
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Ataque: ";
  span = document.createElement('span');
  span.classList.add('e_val');
  span.id = 'e_val_ataque';
  p.appendChild(span);
  p.classList.add('enemyInfo');
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Defensa: ";
  span = document.createElement('span');
  span.classList.add('e_val');
  span.id = 'e_val_defensa';
  p.appendChild(span);
  p.classList.add('enemyInfo');
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Xp: ";
  span = document.createElement('span');
  span.classList.add('e_val');
  span.id = 'e_val_xp';
  p.appendChild(span);
  p.classList.add('enemyInfo');
  enemy.appendChild(p);
  p = document.createElement('p');
  p.textContent = "Objetos: " + enemigo.objetos;
  p.classList.add('enemyInfo');
  enemy.appendChild(p);

  section2.appendChild(enemy);
  document.getElementById('main').insertBefore(section, document.getElementById('main').children[1]);
}

function createGrid(dst, dst_arr, cols, rows) {
  for(var i = 0; i < cols; i++) {
    for(var j = 0; j < rows; j++) {
      var div = document.createElement('div');
      div.classList.add ('block');
      div.style.width = (x/cols) + "px";
      div.style.height = (y/rows) + "px";
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
    navKeysArray[i].grid_div.classList.add('control');
    switch(i) {
      case 1:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', moveFront, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;

      case 3:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', turnLeft, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;

      case 5:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', turnRight, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;

      case 7:
        var a = document.createElement('a');
        a.href = "#/";
        a.addEventListener('click', moveBack, false);
        navKeysArray[i].grid_div.appendChild(a);
        navKeysArray[i].grid_div.classList.add('ripple');
        navKeysArray[i].grid_div.classList.add('button');
      break;
    }
  }
}

function pintaMapView(x, y) {
  mapViewArray[id].grid_div.style.backgroundColor = "aquamarine";
  mapViewArray[x + (y * dim)].grid_div.style.backgroundColor = "rgba(255,69,144,1.0)";
}

/* Convierte lo que hay en el mapa en un archivo de imagen */
function mapaToImg(x, y) {
  return mapa[y][x][player.estadoPartida.direccion];
}

function clearEnemyInfo() {
  document.getElementById('e_val_vida').textContent = '';
  document.getElementById('e_val_ataque').textContent = '';
  document.getElementById('e_val_defensa').textContent = '';
  document.getElementById('e_val_xp').textContent = '';

}
function pintaEnemyInfo(id) {
  //enemy.style.display = "";
  /*var canvas = document.getElementById('visor');
  var context = canvas.getContext('2d');
  context.font = "30px Arial";
  context.fillStyle = "red";
  context.textAlign = "center";
  context.fillText("Hello",canvas.width/2,canvas.height/2);*/
  document.getElementById('e_val_vida').textContent = enemies[id].vida;
  document.getElementById('e_val_ataque').textContent = enemies[id].ataque;
  document.getElementById('e_val_defensa').textContent = enemies[id].defensa;
  document.getElementById('e_val_xp').textContent = enemies[id].xp;
}


function collect() {
  console.log("COLLECT");
}

function pintaObjeto(x, y) {
  // Consigue el canvas
  var canvas = document.getElementById('visor');
  var context = canvas.getContext('2d');

  if (mapa[y][x][4].type == "enemy") {
    var base_image = new Image();
    base_image.src = enemies[mapa[y][x][4].id].img;
    enemy_id = mapa[y][x][4].id;
    base_image.onload = function () {
      // Pinta imagen en el canvas
      context.drawImage(this, 125, 80);
      pintaEnemyInfo(mapa[y][x][4].id);
      fight_btn.disabled = false;
    }
  } else {
    fight_btn.disabled = true;
    clearEnemyInfo();
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
  pintaObjeto(player.estadoPartida.x, player.estadoPartida.y);
}

function turnLeft() {
  switch(player.estadoPartida.direccion) {
    case 0:
      player.estadoPartida.direccion = 2;
      orientation.textContent = "W";
    break;
    case 1:
      player.estadoPartida.direccion = 3;
      orientation.textContent = "E";
    break;
    case 2:
      player.estadoPartida.direccion = 1;
      orientation.texontent = "S";
    break;
    case 3:
      player.estadoPartida.direccion = 0;
      orientation.textContent = "N";
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
      orientation.textContent = "E";
    break;
    case 1:
      player.estadoPartida.direccion = 2;
      orientation.textContent = "W";
    break;
    case 2:
      player.estadoPartida.direccion = 0;
      orientation.textContent = "N";
    break;
    case 3:
      player.estadoPartida.direccion = 1;
      orientation.textContent = "S";
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
  /*vida = document.getElementById('p_val_vida');
  player.vida = parseInt(player.vida, 10) + parseInt(this.response, 10);
  vida.textContent = player.vida;*/
  console.log("To enemy: " + parseInt(this.response, 10));
  enemies[enemy_id].vida += parseInt(this.response, 10);
  let tmp = document.getElementById('e_val_vida');
  tmp.textContent = parseInt(tmp.textContent, 10) + parseInt(this.response, 10);
  fightBack();
}

function fight() {
  var my_url = base_url + atack_api + token + "&ataque=" + player.ataque + "&defensa=" + player.defensa;
  var xhr = new XMLHttpRequest();
  console.log('Fight URL: '+ my_url);

  xhr.addEventListener("load",fightListener, true);
  xhr.open('GET', my_url, true);
  xhr.send();
}

function fightBackListener() {
  vida = document.getElementById('p_val_vida');
  player.vida = parseInt(player.vida, 10) + parseInt(this.response, 10);
  vida.textContent = player.vida;
  console.log("To player: " + parseInt(this.response, 10));
}

function fightBack() {
  var my_url = base_url + atack_api + token + "&ataque=" + enemies[enemy_id].ataque + "&defensa=" + enemies[enemy_id].defensa;
  var xhr = new XMLHttpRequest();
  console.log('Fight BACK URL: '+ my_url);
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
  var title = document.getElementById('dialog_title');
  title.textContent = "New Game";

  var container = document.createElement('div');
  container.id = "container";
  var form = document.createElement('form');
  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Name:";
  var br = document.createElement('br');
  var input = document.createElement('input');
  input.classList.add('input_value');
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
  input.classList.add('input_value');
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
  document.getElementById('dialog_body').appendChild(container);
  modal.style.display = "block";
}

/*******************************************************************/
function initMapa(level) {
  
  s = "dungeon_step.png";
  w = "dungeon_wall.png";
  d = "dungeon_door.png";
  o = {type: "objeto"};
  e1 = {type: "enemy", id: 0};
  e2 = {type: "enemy", id: 1};

  switch (level) {
    case -2:
    /* 0 Norte, 1 Sud, 2 Este, 3 Oeste*/
    //[Norte, Sud, Este, Oeste, ]
    mapa[0] = [[w,s,w,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,s,o], [w,s,s,w,o]];
    mapa[1] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,e1], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[2] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[3] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[4] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,d,o]];
    mapa[5] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[6] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[7] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,w,w,o]];
    mapa[8] = [[s,s,w,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,s,o], [s,s,s,w,o]];
    mapa[9] = [[s,w,w,s,e2], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,s,o], [s,w,s,w,o]];
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