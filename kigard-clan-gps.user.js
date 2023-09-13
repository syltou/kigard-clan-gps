// ==UserScript==
// @name kigard-clan-gps
// @author Fergal <ffeerrggaall@gmail.com>
// @contributor Ciol <ciolfire@gmail.com> (100% inspiré de Kigard Fashion Script)
// @contributor
// @description Un script facilitant la localisation des membres du clan
// @version 0.5.2
// @grant GM_addStyle
// @match https://tournoi.kigard.fr/*
// @exclude 
// ==/UserScript==



if (typeof GM_addStyle == 'undefined') {
  this.GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}

var members = [];
var mypos, myname;
var listNames, buttons;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p');
const subp = urlParams.get('g');
const inv = urlParams.get('genre');

var id_equip = [1,2,7,8,9,10,11,14,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,32,33,
               34,39,47,48,49,50,51,52,53,54,55,56,57,58,59,60,62,64,74,75,76,77,78,
               79,80,81,82,83,84,85,86,87,91,92,93,95,98,99,100,101,102,103,104,105,
               106,107,108,109,110,111,114,115,116,117,118,119,120,121,122,123,124,
               125,126,127,128,129,130,136,137,138,140,141,146,147,148,149,150,151,
               152,155,156,157,160,161,162,163,166,167,168,170,177,181,182,183,184,
               185,186,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,
               203,204,205,206,207,212,216,224,225,226,227,228,229,230,231,232,233];
var id_conso = [3,4,15,26,36,38,40,41,42,43,44,45,46,61,63,96,97,113,131,153,154,159,
               164,165,178,179,180,208,211,213,214,215,217,218,219,221,222];
var id_resso = [5,6,12,13,35,65,66,67,68,69,70,71,72,73,89,90,94,112,132,,133,134,135,
                142,143,144,145,171,172,173,174,175,176,187,209,210,220,223];
var id_left = [37,88,139,158,169];

if(localStorage.getItem("show_eq")==null) localStorage.setItem("show_eq",1);
if(localStorage.getItem("show_co")==null) localStorage.setItem("show_co",1);
if(localStorage.getItem("show_re")==null) localStorage.setItem("show_re",1);

let top = document.getElementsByClassName("margin_position");
mypos = parsePosition(top[0].innerText.trim());
let name = document.getElementsByTagName("strong");
myname = name[0].innerText.trim();



if (page == "empathie") {
    findMules();
    addButtonEmpathie();
}

if (page == "inventaire" && (inv == "Equipement" || inv == "Consommable" || inv == "Ressource")) {
    saveInventory(inv);
}

if (page == "gestion_stock") {
    let mule = urlParams.get('id_monstre');
    saveInventory(mule);
}


if (page == "clan" && subp == "membres") {
    listNames = getNames();
    getPositions();
    localStorage.setItem("members",members);
    localStorage.setItem("fetched",1);
}

if (page == 'vue') {
    // if(localStorage.getItem("fetched")){
    //     members = localStorage.getItem("members");
    //     updateView(members);

}

if (page == 'InventaireComplet') {
    createInventory();

}

changeMenu();

if (page == "arene") {
    orderArenas();
}

function orderArenas() {
    var name, arenas, title, x, y, i, arenapos, temp;
    arenas = document.getElementsByClassName("ddTitleText");
    for (i=0;i<arenas.length;i++){
        title = arenas[i].innerText;
        temp = title.split(':');
        x = temp[1].split(' ')[0];
        y = temp[2].split(']')[0];
        arenapos = Array(~~x,~~y);
        arenas[i].innerText += " (" + distance(arenapos,mypos) + " " + direction(angle(arenapos,mypos),1) + ")";
    }
}

function updateView(members) {

}


function findMules() {
    let mules = [];
    let form = document.getElementsByTagName("form");
    if(form.length==0) return;
    form = form[form.length-1];
    let muleIcons = document.querySelectorAll('[title="Mulet"]');
    for(var i=0;i<muleIcons.length;i++){
        let mule = muleIcons[0].parentNode.getElementsByClassName("profil_popin")[0].href.split("id=")[1].split("&")[0];
        mules.push(mule);
    }
    localStorage.setItem("mules",mules);
}

function saveInventory(inv) {
    var i, lines, cell, table;
    lines = document.getElementsByTagName('table')[0].getElementsByClassName("item");
    // console.log(lines.length)
    table = "";
    for (i=0;i<lines.length;i++){
        table += "<tr>";
        if(lines[i].parentNode.tagName == "TD") {
            cell = lines[i].parentNode.outerHTML;
            table += cell;
        }
        table += "</tr>";
    }
    localStorage.setItem(inv,table);

}

function mergeInventory() {

    let i, table;
    let temp = localStorage.getItem("mules");
    let mules = temp.split(',');
    console.log(mules);

    let inv_to_show = [];
    if(localStorage.getItem("show_eq")==1) inv_to_show.push("Equipement");
    if(localStorage.getItem("show_co")==1) inv_to_show.push("Consommable");
    if(localStorage.getItem("show_re")==1) inv_to_show.push("Ressource");
    console.log(inv_to_show);

    let merged = '<table width="100%"><tbody>';
    for(i=0; i<inv_to_show.length; i++){
        table = localStorage.getItem(inv_to_show[i]);
        if(table==null){
            merged += "Visitez d'abord la page " + inv_to_show[i] + " !<br>";
        }
        else {
            merged += table;
        }
    }
    for(i=0; i<mules.length; i++){
        table = localStorage.getItem(mules[i]);
        if(table==null){
            merged += "Visitez d'abord l'inventaire du mulet " + mules[i] + " !<br>";
        }
        else {
            merged += table;
        }
    }
    merged += "</tbody></table>";
    return merged;

}

function createInventory() {
     let state_eq, state_co, state_re;
    if(urlParams.get('Equipement')=='on') {
        localStorage.setItem("show_eq",1);
        state_eq = 'checked="checked"';
    }
    else{
        localStorage.setItem("show_eq",0);
        state_eq = '';
    }
    if(urlParams.get('Consommable')=='on') {
        localStorage.setItem("show_co",1);
        state_co = 'checked="checked"';
    }
    else{
        localStorage.setItem("show_co",0);
        state_co = '';
    }
    if(urlParams.get('Ressource')=='on') {
        localStorage.setItem("show_re",1);
        state_re = 'checked="checked"';
    }
    else{
        localStorage.setItem("show_re",0);
        state_re = '';
    }

    let bloc = document.getElementById("bloc");
    bloc.innerHTML = "\n<h3>Inventaire complet (sauf tenue)</h3>\n\n"
    + '<form id="form_inv" method="get" formaction="index.php?p=InventaireComplet">'
    + '<input type="hidden" name="p"  value="' + page + '"/><strong>Catégories : </strong>&nbsp;&nbsp;'
    + '<input type="checkbox" name="Equipement" value="on" ' + state_eq + ' form="form_inv"/>&nbsp;Équipements &nbsp;&nbsp;'
    + '<input type="checkbox" name="Consommable" value="on" ' + state_co + ' form="form_inv"/>&nbsp;Consommables &nbsp;&nbsp;'
    + '<input type="checkbox" name="Ressource" value="on" ' + state_re + ' form="form_inv"/>&nbsp;Ressources &nbsp;&nbsp;'
    + '<input name="refresh_inv" type="submit" value="Modifier" form="form_inv"></form>';

    // console.log(bloc);
    let table = mergeInventory();
    bloc.innerHTML += table;
}


function addButtonEmpathie() {
    var poFields, posFields, submitButton, i, codeButton;
    submitButton = document.getElementsByName("modif_suivant");
    if(submitButton.length==1){
        codeButton = "&nbsp;&nbsp;" + submitButton[0].outerHTML;
    } else {
        codeButton = " ";
    }

    posFields = document.getElementsByClassName("pos");
    for(i=0;i<posFields.length;i=i+2){
        // posFields[i].parentNode.innerHTML += '&nbsp;&nbsp;<input name="reset_pos" value="Reset" type="reset">';
        posFields[i].parentNode.innerHTML += codeButton;
    }

    poFields = document.getElementsByClassName("po");
    for(i=0;i<poFields.length;i++){
        if(poFields[i].tagName == "INPUT"){
            poFields[i].parentNode.innerHTML += codeButton;
        }
    }
}



function changeMenu() {

    var i, menu, submenus, list, temp;
    menu = document.getElementById("menu");
    submenus = menu.getElementsByClassName("parent");

    var url = '';
    if(localStorage.getItem("show_eq")==1) url += '&Equipement=on';
    if(localStorage.getItem("show_co")==1) url += '&Consommable=on';
    if(localStorage.getItem("show_re")==1) url += '&Ressource=on';

    for (i=0;i<submenus.length;i++){
        if(submenus[i].innerText == "Inventaire"){
            list = submenus[i].parentNode.getElementsByTagName("ul");
            temp = list[0].innerHTML.slice(0,-5) + '<li><a href="index.php?p=InventaireComplet' + url + '">Tout</a></li>' + list[0].innerHTML.slice(-5);
            list[0].innerHTML = temp
            // console.log(list[0]);
        }
    }
    // console.log(menu.innerText);

}

function getMap() {
}

// get members name from page clan->membres
function getNames() {
    // in the 1th column
    let xpath = '//tbody/tr[*]/td[2]';
    let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let listNames = Array();
    for (var i=0;i < lines.snapshotLength;i++) {
        let line = lines.snapshotItem(i);
        listNames[i] = line.textContent.trim();
    }
    return listNames;
}

// get members position from page clan->membres

function getPositions() {
  // in the 8th column
  let xpath = '//tbody/tr[*]/td[8]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i=0;i < lines.snapshotLength;i++) {
      let line = lines.snapshotItem(i);
      let pos = parsePosition(line.textContent.trim());
      let dis = distance(pos,mypos);
      let ang = angle(pos,mypos);
      let dir = direction(ang);
      //console.log(ang);
      let prevHTML = line.innerHTML;
      if(listNames[i] != myname) {
          line.innerHTML = "<div class='grille-membres'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                         + "<img src='https://raw.githubusercontent.com/syltou/kigard-clan-gps/main/compass2.png' style='transform:rotate(" + (-1*ang) + "deg);'></div><div>"
                         + prevHTML + "</div><div>&nbsp;(" + dis + " cases " + dir + ")&nbsp;</div></div>";//.format(distance(pos,mypos));
      }
      else {
          line.innerHTML = "<div class='grille-membres'><div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                         + "<img src='https://raw.githubusercontent.com/syltou/kigard-clan-gps/main/compass2.gif'></div><div>"
                         + prevHTML + "</div><div>&nbsp;(Vous êtes ici)&nbsp;</div></div>";
      }
      members.push([listNames[i],pos]);
  }
}


function parsePosition(str){
    let x = ~~str.split(':')[1].split('|')[0];
    let y = ~~str.split(':')[2].split('(')[0];
    return Array(x,y);
}

function distance(vec1, vec2){
    let dx = Math.abs(vec1[0]-vec2[0]);
    let dy = Math.abs(vec1[1]-vec2[1]);
    return Math.max(dx,dy);
}

function angle(vec1, vec2){
    let dx = (vec1[0]-vec2[0]);
    let dy = (vec1[1]-vec2[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function direction(angle,short=0){
    if (angle<=22.5 && angle>-22.5){
        if(short) return "E";
        else return "à l'Est";
    } else if (angle<=67.5 && angle>22.5){
        if(short) return "NE";
        else return "au Nord-Est";
    } else if (angle<=112.5 && angle>67.5){
        if(short) return "N";
        else return "au Nord";
    } else if (angle<=157.5 && angle>112.5){
        if(short) return "NO";
        else return "au Nord-Ouest";
    } else if (angle<=-157.5 || angle>157.5){
        if(short) return "O";
        else return "à l'Ouest";
    } else if (angle<=-112.5 && angle>-157.5){
        if(short) return "SO";
        else return "au Sud-Ouest";
    } else if (angle<=-67.5 && angle>-112.5){
        if(short) return "S";
        else return "au Sud";
    } else if (angle<=-22.5 && angle>-67.5){
        if(short) return "SE";
        else return "au Sud-Est";
    }
}


