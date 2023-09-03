// ==UserScript==
// @name Kigard Clan GPS
// @author Fergal <ffeerrggaall@gmail.com>
// @contributor Ciol <ciolfire@gmail.com> (100% inspiré de Kigard Fashion Script)
// @contributor
// @description Un script facilitant la localisation des membres du clan
// @version 0.1
// @grant GM_addStyle
// @match https://tournoi.kigard.fr/index.php?p=clan&g=membres
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



var mypos;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p')

let test = document.getElementsByClassName("margin_position");
mypos = parsePosition(test[0].innerText.trim());
console.log(mypos);

if (page == "clan" && urlParams.get('g') == "membres") {
   console.log(page)
   getPosition();
}

function getPosition() {
  /* -- BEGIN : Applique les skins sur la liste des personnages -----*/
  //Récupère la liste des PJ
  let xpath = '//tbody/tr[*]/td[8]';
  let lines = document.evaluate(xpath, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i=0;i < lines.snapshotLength;i++) {
    let line = lines.snapshotItem(i);
    let pos = parsePosition(line.textContent.trim());
    // console.log(pos);
    let prevHTML = line.innerHTML;
    // console.log(prevHTML);
    line.innerHTML = "<div>" + prevHTML + "</div> <div>(" + distance(pos,mypos) + " cases " + direction(angle(pos,mypos)) + ")</div>";//.format(distance(pos,mypos));

    // if (customList.includes(PJ)) {
    //   let customImg = encodeURI(`https://raw.githubusercontent.com/Ciolfire/kigard-fashion-script/main/${period}/${PJ}.gif`);
    //   let img = document.evaluate('.//img', line , null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //   img.src= customImg;
    // }
  }
  /* -- END   : Applique les skins sur la liste des personnages -----*/
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
        console.log(dx,dy);
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
