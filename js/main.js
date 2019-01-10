
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
var or, orientationItem, orientationArray;
var nombre, sexo, nivel, ataque, defensa, vida, objetos;

var enemy, enemy_id, enemy_select;

var left_select,left_last, right_select, right_last;
var fight_btn, collect_btn;

var start, save, retrieve, del;
var dialog, dialog_btn;

var enemies;
var num_objects = 0;

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
  start.addEventListener('click', newGame, false);
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
    id = player.estadoPartida.x + (player.estadoPartida.y * dim);
    //initPlayer("Robot","Other");
    initEnemies();
    //pintaMapView(player.estadoPartida.x, player.estadoPartida.y);
    //pintaPosicion(player.estadoPartida.x, player.estadoPartida.y);
  }
  document.getElementById('visor').style.visibility = "hidden";
  document.getElementById('fc_player').style.visibility = "hidden";
  document.getElementById('fc_enemy').style.visibility = "hidden";
  document.getElementById('fc_navigation').style.visibility = "hidden";
  
  nav_btn = document.getElementById('nav-button');
  nav_btn.addEventListener('click', showMenu, false);

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
    let nav = document.getElementById('nav');
    nav.style.display = "grid";
    if(!nav.classList.contains('active')) {
      document.getElementById('nav-icon').style.display = "none";
    }else {
      document.getElementById('nav-icon').style.display = "block";
    } 
  } else {
    let nav = document.getElementById('nav');
    if(!nav.classList.contains('active')) {
      nav.style.display = "none";
    }
    document.getElementById('nav-icon').style.display = "block";
  }
}

function showMenu() {
  if (document.getElementById('nav-button').classList.contains('active-button')) {
    document.getElementById('nav-button').classList.remove('active-button');
    let nav = document.getElementById('nav');
    nav.getElementsByClassName('navList')[0].style.flexDirection = "row";
    nav.style.display = "none";
    nav.classList.remove('active');
    let menu = document.getElementById('header');
    menu.insertBefore(nav, menu.children[1]);
    document.getElementById('nav-icon').textContent = 'menu';
    processResize();
  } else {
    document.getElementById('nav-button').classList.add('active-button');
    let nav = document.getElementById('nav');
    nav.classList.add('active');
    nav.getElementsByClassName('navList')[0].style.flexDirection = "column";
    nav.style.display = "grid";
    let menu = document.getElementById('flex_menu');
    menu.appendChild(nav);
    document.getElementById('nav-icon').textContent = 'clear';
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
  p.id = 'orientation_value';
  p.classList.add('orientation_value');
  p.textContent = "N";

  or = p;

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
  select.classList.add('player_list');
  select.classList.add('playerInfo');
  
  select.addEventListener('change', processObject, false);
  for(let i = 0; i < player.mochila.length; i++) {
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

function initPlayer(name, gender) {

  nombre = document.getElementById('p_val_nombre');
  nombre.textContent = name;
  sexo = document.getElementById('p_val_sexo');
  sexo.textContent = gender;
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
  var tmp = "Object_" + num_objects;
  var element = {name: tmp, attack:2, defense:1};
  player.mochila.push(element);
  num_objects++;
  var tmp = "Object_" + num_objects;
  var element = {name: tmp, attack:3, defense:4};
  player.mochila.push(element);
  num_objects++;
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
    var tmp = Object.assign({}, enemigo);
    tmp.vida = Math.floor(Math.random() * 10) + 1;
    tmp.ataque = Math.floor(Math.random() * 1) + 1;
    tmp.defensa = Math.floor(Math.random() * 1) + 1;
    tmp.xp = Math.floor(Math.random() * 10) + 1;
    tmp.img = "./media/skeleton.png";
    let val = "Object_" + num_objects;
    let element = {name: val, attack:(Math.floor(Math.random() * 5) + 1), defense:(Math.floor(Math.random() * 5) + 1)};
    tmp.objetos = [];
    tmp.objetos.push(element);
    num_objects++;
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
  section2.classList.add('fc_enemy');
  section2.id = "fc_enemy";

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

  var enemy_obj = document.createElement('div');
  enemy_obj.id = "enemy_objects";
  enemy_obj.classList.add('enemy_objects');

  p = document.createElement('p');
  p.textContent = "Objetos: ";
  p.classList.add('enemyInfo');
  enemy_obj.appendChild(p);

  enemy_select = document.createElement('select');
  enemy_select.id = "enemy_list";
  enemy_select.classList.add('list');
  enemy_select.classList.add('enemy_list');
  //enemy_select.style.display = 'none';

  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "None {0,0}";
  option.value = "None {0,0}";
  enemy_select.appendChild(option);

  enemy_obj.appendChild(enemy_select);
  enemy.appendChild(enemy_obj);
  section2.appendChild(enemy);

  document.getElementById('main').insertBefore(section, document.getElementById('main').children[1]);
  //document.getElementById('fc_navigation').insertBefore(section, document.getElementById('fc_navigation').children[1]);
  //document.getElementById('fc_navigation').appendChild(section);
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
  //document.getElementById('enemy_list').style.display = 'none';

  var select = document.getElementById('enemy_list')
  var length = select.options.length;
  for (i = 0; i < length; i++) {
    select.options[i] = null;
  }

  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "None {0,0}";
  option.value = "None {0,0}";
  enemy_select.appendChild(option);

}
function pintaEnemyInfo(id) {
  document.getElementById('e_val_vida').textContent = enemies[id].vida;
  document.getElementById('e_val_ataque').textContent = enemies[id].ataque;
  document.getElementById('e_val_defensa').textContent = enemies[id].defensa;
  document.getElementById('e_val_xp').textContent = enemies[id].xp;
  document.getElementById('enemy_list').style.display = '';
  
  var select = document.getElementById('enemy_list')
  var length = select.options.length;
  for (i = 0; i < length; i++) {
    select.options[i] = null;
  }

  console.log("NUmobj: " + enemies[enemy_id].objetos.length);
  for(i = 0; i < enemies[enemy_id].objetos.length; i++) {
    console.log('creating');
    var option = document.createElement('option');
    option.classList.add('list_item');
    option.textContent = enemies[enemy_id].objetos[i].name + " {" + enemies[enemy_id].objetos[i].attack + "," + enemies[enemy_id].objetos[i].defense + "} ";
    option.value = enemies[enemy_id].objetos[i].name;
    select.appendChild(option);
  }

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
  console.log("To enemy: " + parseInt(this.response, 10));
  enemies[enemy_id].vida += parseInt(this.response, 10);
  let tmp = document.getElementById('e_val_vida');
  tmp.textContent = enemies[enemy_id].vida;
  if(enemies[enemy_id].vida <= 0) {
    player.xp += enemies[enemy_id].xp;
    xp.textContent = player.xp;
    console.log("Plyer size: " + player.mochila.length);
    Array.prototype.push.apply(player.mochila,enemies[enemy_id].objetos);
    console.log("Plyer size: " + player.mochila.length);
    let i = player.mochila.length - 1;
    var option = document.createElement('option');
    option.classList.add('list_item');
    option.textContent = player.mochila[i].name + " {" + player.mochila[i].attack + "," + player.mochila[i].defense + "} ";
    option.value = player.mochila[i].name;
    left_select.appendChild(option);
    var opt = option.cloneNode(true);
    right_select.appendChild(opt);

    mapa[player.estadoPartida.y][player.estadoPartida.x][4].type = "null";
    updateScreen();
  } else {
    fightBack();
  }
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

function connectServer(type, mode) {

  switch (type) {

    case 0: //GET ARRAY SLOTS
    console.log("GET SAVED");
    var my_url = base_url + server_api + token;
    console.log(my_url);
    $.ajax({
      url: my_url,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      success: function (result) {
        console.log("Response: " + result);        
        var tmp = JSON.stringify(result);
        var json = JSON.parse(tmp);
        console.log(json);
        console.log("Json Length: " + json.length);
        var slot = document.getElementById('slot_list');
        var options = slot.getElementsByClassName('list_item');
        
        if (mode == 'load' || mode == 'delete') {
          for(let j = 1; j < options.length; j++) {
            options[j].disabled = true;
          }
          for(let i = 0; i < json.length; i++) {
            options[json[i]].disabled = false;
          }
        }else if(mode == 'save') {
          for(let j = 1; j < options.length; j++) {
            options[j].disabled = false;
          }
          for(let i = 0; i < json.length; i++) {
            options[json[i]].disabled = true;
          }
        }

      },
      error: function (result) {
        console.log(result);
      }
    });

    break;

    case 1: //GET SLOT
      var slot_val = document.getElementById('slot_list').selectedIndex;
      if(slot_val != 0) {
        var my_url = base_url + server_api + token + "&slot=" + slot_val;
        console.log(my_url);
        $.ajax({
          url: my_url,
          type: "GET",
          dataType: "json",
          success: function (result) {
            console.log("Response: " + result);
            var tmp = JSON.stringify(result);
            var json = JSON.parse(tmp);
            console.log(json);
            player = json;
            updateScreen();
            
          },
          error: function (result) {
            console.log(result);
          }
        });  
      } else {
        console.log("please select");
      }
    break;

    case 2: //POST
      var slot_val = document.getElementById('slot_list').selectedIndex;
      if (slot_val != 0) {
        var my_url = base_url + server_api + token + "&slot=" + slot_val;
        ajaxRequest(my_url);
      } else {
        console.log("please select");
      }
    break;

    case 3: //DELETE
      var slot_val = document.getElementById('slot_list').selectedIndex;
      if (slot_val != 0) {
        var my_url = base_url + server_api + token + "&slot=" + slot_val;
        $.ajax({
          url: my_url,
          type: "DELETE",
          success: function(result) {
            console.log('delete success');
          }
        });
      } else {
        console.log("please select");
      }
    break;
  
  }
}

function requestListener() {
  console.log("resp: " + this.response);
}

function ajaxRequest(url) {
  console.log("URL: " + url);
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", requestListener);
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("json=" + JSON.stringify(player));
}

function processClick() {
  console.log("click");
}

/*******************************************************************/
function updateMenuState() {
  var nav = document.getElementById('nav');
  if(nav.classList.contains('active')) {
    document.getElementById('nav-button').classList.remove('active-button');
    nav.style.display = "none";
    nav.getElementsByClassName('navList')[0].style.flexDirection = "row";
    nav.style.display = "none";
    nav.classList.remove('active');
    var menu = document.getElementById('header');
    menu.insertBefore(nav, menu.children[1]);
    document.getElementById('nav-icon').textContent = 'menu';
    processResize();
  }
}

function clearDialog() {
  if(document.getElementById('container') != null) {
    document.getElementById('dialog_body').removeChild(document.getElementById('container'));
  }
}

function newGame() {
  clearDialog();
  initNewGameDialog();
}

function submitNewGame() {
  console.log('Submit New Game');
  modal.style.display = "none";
  updateMenuState();  

  console.log("Name: " + document.getElementById('name_input').value);
  console.log("Gender: " + document.getElementById('gender_list').value);
  initPlayer(document.getElementById('name_input').value, document.getElementById('gender_list').value);
  updateScreen();
  document.getElementById('visor').style.visibility = "visible";
  document.getElementById('fc_player').style.visibility = "visible";
  document.getElementById('fc_enemy').style.visibility = "visible";
  document.getElementById('fc_navigation').style.visibility = "visible";
}

function saveGame() {
  clearDialog();
  initSaveGameDialog();
}

function submitSaveGame() {
  console.log('Submit Save Game');
  modal.style.display = "none";
  updateMenuState();  
  console.log("Name: " + document.getElementById('name_input').value);
  console.log("Slot: " + document.getElementById('slot_list').value);
  connectServer(2, "save");
}

function loadGame() {
  clearDialog();
  initLoadGameDialog();
}

function submitLoadGame() {
  console.log('Submit Load Game');
  modal.style.display = "none";
  updateMenuState();  
  console.log("Slot: " + document.getElementById('slot_list').value);
  connectServer(1, "load");
}

function deleteGame() {
  clearDialog();
  initDeleteGameDialog();
}

function submitDeleteGame() {
  console.log('Submit Delete Game');
  modal.style.display = "none";
  updateMenuState();  
  console.log("Slot: " + document.getElementById('slot_list').value);
  connectServer(3, "delete");
}

function initNewGameDialog(){
  
  var title = document.getElementById('dialog_title');
  title.textContent = "New Game";

  var container = document.createElement('div');
  container.id = "container";
  var form = document.createElement('form');
  form.addEventListener('submit', submitNewGame, false);
  
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

  var input = document.createElement('select');
  input.id = 'gender_list';
  var option = document.createElement('option');
  option.classList.add('list_item');
  input.classList.add('input_select');
  option.textContent = "Male";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "Female";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "Other";
  input.appendChild(option);

  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);
  
  var div = document.createElement('div');
  div.classList.add("button_wrap");
  var input = document.createElement('input');
  input.classList.add("button_input");
  input.type = "submit";
  input.value = "Submit";
  div.appendChild(input);
  form.appendChild(div);

  container.appendChild(form);
  document.getElementById('dialog_body').appendChild(container);
  modal.style.display = "block";
}

function initSaveGameDialog() {

  connectServer(0, "save");

  var title = document.getElementById('dialog_title');
  title.textContent = "Save Game";

  var container = document.createElement('div');
  container.id = "container";
  var form = document.createElement('form');
  form.addEventListener('submit', submitSaveGame, false);
  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Name:";
  var br = document.createElement('br');
  var input = document.createElement('input');
  input.classList.add('input_value');
  input.id = "name_input";
  input.type = "text";
  input.title = "Enter Game Name";
  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);

  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Slot:";
  var br = document.createElement('br');

  var input = document.createElement('select');
  input.id = 'slot_list';
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "None";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  input.classList.add('input_select');
  option.textContent = "Slot 1";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "Slot 2";
  input.appendChild(option);

  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);

  var div = document.createElement('div');
  div.classList.add("button_wrap");
  var input = document.createElement('input');
  input.classList.add("button_input");
  input.type = "submit";
  input.value = "Submit";
  div.appendChild(input);
  form.appendChild(div);

  container.appendChild(form);
  document.getElementById('dialog_body').appendChild(container);

  modal.style.display = "block";
}

function initLoadDeleteDialog(type) {

  var title = document.getElementById('dialog_title');
  
  var container = document.createElement('div');
  container.id = "container";
  var form = document.createElement('form');
  if(type == 0) {
    title.textContent = "Load Game";
    form.addEventListener('submit', submitLoadGame, false);
  } else {
    form.addEventListener('submit', submitDeleteGame, false);
    title.textContent = "Delete Game";
  }

  var div = document.createElement('div');
  div.classList.add('input');
  div.textContent = "Slot:";
  var br = document.createElement('br');

  var input = document.createElement('select');
  input.id = 'slot_list';
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "None";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  input.classList.add('input_select');
  option.textContent = "Slot 1";
  input.appendChild(option);
  var option = document.createElement('option');
  option.classList.add('list_item');
  option.textContent = "Slot 2";
  input.appendChild(option);

  div.appendChild(br);
  div.appendChild(input);
  form.appendChild(div);

  var div = document.createElement('div');
  div.classList.add("button_wrap");
  var input = document.createElement('input');
  input.classList.add("button_input");
  input.type = "submit";
  input.value = "Submit";
  div.appendChild(input);
  form.appendChild(div);

  container.appendChild(form);
  document.getElementById('dialog_body').appendChild(container);
  modal.style.display = "block";
}

function initLoadGameDialog() {
  connectServer(0, "load");
  initLoadDeleteDialog(0);
}

function initDeleteGameDialog() {
  connectServer(0, "delete");
  initLoadDeleteDialog(1);
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