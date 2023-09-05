// ==UserScript==
// @name kigard-clan-gps
// @author Fergal <ffeerrggaall@gmail.com>
// @contributor Ciol <ciolfire@gmail.com> (100% inspiré de Kigard Fashion Script)
// @contributor
// @description Un script facilitant la localisation des membres du clan
// @version 0.3
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



var mypos, myname;
var listNames;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p')

let top = document.getElementsByClassName("margin_position");
mypos = parsePosition(top[0].innerText.trim());
let name = document.getElementsByTagName("strong");
myname = name[0].innerText.trim();


if (page == "clan" && urlParams.get('g') == "membres") {
    listNames = getNames();
    getPositions();
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

function direction(angle){
    if (angle<=22.5 && angle>-22.5){
        return "à l'Est";
    } else if (angle<=67.5 && angle>22.5){
        return "au Nord-Est";
    } else if (angle<=112.5 && angle>67.5){
        return "au Nord";
    } else if (angle<=157.5 && angle>112.5){
        return "au Nord-Ouest";
    } else if (angle<=-157.5 || angle>157.5){
        return "à l'Ouest";
    } else if (angle<=-112.5 && angle>-157.5){
        return "au Sud-Ouest";
    } else if (angle<=-67.5 && angle>-112.5){
        return "au Sud";
    } else if (angle<=-22.5 && angle>-67.5){
        return "au Sud-Est";
    }
}
