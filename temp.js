// ==UserScript==
// @name kigard-clan-gps
// @author Fergal <ffeerrggaall@gmail.com>
// @contributor Ciol <ciolfire@gmail.com> (100% inspiré de Kigard Fashion Script)
// @contributor
// @description Un script facilitant la localisation des membres du clan
// @version 0.8.2
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


// if(window.location == "https://tournoi.kigard.fr/liste_pj.php") {

//     testListePJ();
//     return;
// }



var components = [];
var components_alt = [];
var members = [];
var mypos, myname;
var listNames, buttons;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('p');
const subp = urlParams.get('g');
const inv = urlParams.get('genre');

var id_equip = [1,2,7,8,9,10,11,14,16,17,18,19,20,21,22,23,24,25,27,28,29,30,31,32,33,
			   34,39,47,48,49,51,52,53,54,55,56,57,58,59,60,62,64,74,75,76,77,78,
			   79,80,81,82,83,84,85,86,87,91,92,93,95,98,100,101,102,103,104,105,
			   106,107,108,109,110,111,114,115,116,117,118,119,121,122,123,124,
			   125,126,127,129,136,137,138,140,141,146,147,148,149,150,151,
			   152,155,156,157,160,161,162,163,166,167,168,177,181,182,183,184,
			   185,186,188,189,190,191,192,193,194,195,196,197,198,199,200,
			   203,204,205,206,207,212,216,224,225,226,227,228,229,230,231,232,233,
			   236,237,239,241,242,243,244,245,246,249,250,252,256,257,260,261,267,
			   268,269,270,271,275,284,285,286,287,289,290,291,292,294,296,297,
			   306,307,308,309,311,312,313,316,317,318,319,326,327,328,329,331,333,
			   334,335,336,337,344,350];

var id_conso = [3,4,15,26,36,38,40,41,42,43,44,45,46,61,63,96,97,113,131,153,154,159,
			   164,165,178,179,180,208,211,213,214,215,217,218,219,221,222,253,258,259,
			   272,273,277,278,279,280,281,282,303,304,305,330,339,340];

var id_resso = [5,6,12,13,35,65,66,67,68,69,70,71,72,73,89,90,112,
				142,143,144,145,171,172,173,174,175,176,187,209,210,220,223,254,255,262,
				274,276,283,293,295,298,299,300,301,302,310,314,315,338,341,342,343];


var id_left = [37,50,88,94,99,120,128,130,132,133,134,135,139,158,169,170,201,202,
			  234,235,238,240,247,248,251,263,264,265,266,288,320,321,322,323,324,
			  325,332,345,346,347,348,349,351,352,353,354,355,356,357,358,359,360,
			  361,362,363,364,365,366,367,368,369,370];

// if(localStorage.getItem("show_eq")==null) localStorage.setItem("show_eq",1);
// if(localStorage.getItem("show_co")==null) localStorage.setItem("show_co",1);
// if(localStorage.getItem("show_re")==null) localStorage.setItem("show_re",1);


let top = document.getElementsByClassName("margin_position");
mypos = parsePosition(top[0].innerText.trim());
let name = document.getElementsByTagName("strong");
myname = name[0].innerText.trim();

if (page == "options") {
	if (urlParams.get('sm') == "portrait") {
		let bloc = document.getElementById("bloc");
		for(var i=0;i<id_left.length;i++) {
			bloc.innerHTML += '<img src="https://tournoi.kigard.fr/images/items/' + id_left[i] + '.gif" class="transparent" width="72">';
		}
	}
}

if (page == "empathie") {
    findMules();
	addButtonEmpathie();
}

if(page == "formules") {


	modifyFormulasPage();
}





if (page == "inventaire" && (inv == "Equipement" || inv == "Consommable" || inv == "Ressource")) {
    console.log("Start saveInventory "+inv);
	saveInventory(inv);
	let bloc = document.getElementById("bloc");
	addCopyButton(bloc.getElementsByTagName("table")[0],"inventory");
}

if (page == "gestion_stock") {
	// let mule = urlParams.get('id_monstre');
	// saveMulet(mule);
	let bloc = document.getElementById("bloc");
	addCopyButton(bloc.getElementsByTagName("table")[0],"inventory");
}

// DOES NOT WORK IN FIREFOX
if (page == "messagerie" && subp == "nouveau_message") {
	// addPasteButton(document.getElementById("new_message"));
}

if (page == "clan" && subp == "membres") {
    $('img[src="images/metiers/puacheur.gif"]')[0].src="images/metiers/pecheur.gif" ;
	listNames = getNames();
	getPositions();
	localStorage.setItem("members",members);
	localStorage.setItem("fetched",1);
}

if (page == 'vue') {
	// if(localStorage.getItem("fetched")){
	//	 members = localStorage.getItem("members");
	//	 updateView(members);

}

if (page == 'InventaireComplet') {
	// updateInventory();
    let w = open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Equipement");
    $( w.document ).ready( function () {
        console.log("TOTO");
    });
    w.close();
    w = window.open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Consommable");
    $( w.document ).ready( function () {
        console.log("TOTO");
    });
    w.close();

    w = window.open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Ressource");
    $( w.document ).ready( function () {
        console.log("TOTO");
    });
    w.close();
	createInventory();

}

changeMenu();

if (page == "arene") {
	orderArenas();
}


function testListePJ() {

    let listPJ = $("td:first-child").children("a");
    for(var i=0;i<5;i++) {
        setTimeout(parseEquipment, 500*i, listPJ[i]);
    }
}

function parseEquipment(link) {

    let w=window.open(link.href);
    console.log(document.getElementsByTagName("h3")[0]);
    w.close();

}


function filterFormulas() {

	var filter, smalls, cat;
	let radioButtons = document.getElementsByName("formulaFilter");
	for(var i=0;i<radioButtons.length;i++) {
		if(radioButtons[i].checked) {
			localStorage.setItem("filter"+(i+1),"checked");
			filter = radioButtons[i].labels[0].innerText.trim();
		}
		else localStorage.setItem("filter"+(i+1),"");
	}

	// console.log(filter)

	let table = document.getElementsByTagName("tbody")[0];
	let lines = table.getElementsByTagName("tr");

	for(i=0;i<lines.length;i++) {
		smalls = lines[i].getElementsByTagName("small");
		if(filter=="Tous"){
			lines[i].removeAttribute('hidden');
		}
		else if(filter=="Autres") {
			if(smalls.length==0) lines[i].removeAttribute('hidden');
			else lines[i].setAttribute('hidden',true);
		}
		else {
			if(smalls.length>0) {
				cat = smalls[smalls.length-1].getElementsByTagName("i");
				if(cat[0].innerText.split('-')[1].trim() == filter) lines[i].removeAttribute('hidden');
				else lines[i].setAttribute('hidden',true);
			}
			else lines[i].setAttribute('hidden',true);
		}
	}
}


function modifyFormulasPage() {

	updatePageAttributes();
	updateOriginalFilters();
	addCategoryFilter();
	addDifficultyFilter();

	addExtraFilters()
	updateTableTitle();

	addCopyButton($('#formulas-table')[0],"formulas");

}


function updateOriginalFilters() {

	let bloc = document.getElementById("bloc");
	let parts = bloc.innerHTML.split('<br><br>');

	bloc.innerHTML = parts[0] + '</blockquote></div><div class="filtres" style="text-align:center;"><blockquote class="bloc"><strong>Métiers</strong><br>' + parts[1];

	// remove existing event for formule filters
	$("a[data-formule]").off("click");
	// add a new one
	$("a[data-formule]").click(selectFormulaFilter);
	// set default filters
	$('a[data-formule="Connues"]').attr("class", "sel"); // formules Connues


	// remove existing event for metier filters
	$("a[data-metier]").off("click");
	// add a new one
	$("a[data-metier]").click(selectMetierFilter);
	// set default filters
	$('a[data-metier="Tous"]').attr("class", "sel"); // métiers Tous

}

function updateInventory() {
	let w=window.open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Equipement",'_self');
	$( w.document ).ready( function () {
		saveInventory('Equipement');
		console.log( "Equipement updated!" );
	});
	// });
	// w.close();

	window.open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Consommable",'_self');
	// // w.resizeTo(0,0);
	// // w.moveTo(0,w.screen.availHeight+10);
	// $( w.document ).ready(function() {
	saveInventory('Consommable');
	console.log( "Consommable updated!" );
	// });
	// w.close();

	window.open("https://tournoi.kigard.fr/index.php?p=inventaire&genre=Ressource",'_self');
	// // w.resizeTo(0,0);
	// // w.moveTo(0,w.screen.availHeight+10);
	// $( w.document ).ready(function() {
	saveInventory('Ressource');
	console.log( "Ressource updated!" );
	// });
	// w.close();

	window.open("https://tournoi.kigard.fr/index.php?p=empathie",'_self');
	// // w.resizeTo(0,0);
	// // w.moveTo(0,w.screen.availHeight+10);
	// $( w.document ).ready(function() {
	findMules();
	console.log( "Mules found!" );
	// });
	// w.close();

	// temp = localStorage.getItem("mules_id");
	// let mules_id = temp ? temp.split(',') : [];
	// temp = localStorage.getItem("mules_name");
	// let mules_name = temp ? temp.split(',') : [];

	// console.log(mules_id)
	// console.log(mules_name)

	// for(var i=0;i<mules_id.length;i++) {
		// w=window.open("https://tournoi.kigard.fr/index.php?p=gestion_stock&id_monstre=" + mules_id[i]);
		// // w.resizeTo(0,0);
		// // w.moveTo(0,w.screen.availHeight+10);
		// $( w.document ).ready(function() {
			// saveMulet(mules_id[i],w);;
			// console.log( "Mule "+ mules_name[i] +" updated!" );
		// });
		// w.close();
	// }

	// window.open("https://tournoi.kigard.fr/index.php?p=InventaireComplet",'_self');

}

// function updateComponentFilter() {

// 	listComponents();

// 	var div;
// 	let bloc = document.getElementById("bloc");
// 	let table = bloc.getElementsByTagName("table")[0];
// 	let list_icons = '<blockquote id="components" class="bloc"><strong>Ingrédients</strong><br><a href="#" data-comp="Tous" hidden=true></a>';
// 	for(var i=0;i<components.length;i++) {
// 		list_icons += '<span><a href="#" data-comp="' + components[i].split('.')[0] + '"><img src="images/items/' + components[i] + '" class="item"> </a>';
// 		// if(i<components.length-1) list_icons += '<img src="images/interface/puce_small.gif" alt="">';
// 		list_icons += '</span>';
// 	}
// 	list_icons += '</blockquote>';

// 	let blockquote = document.getElementById("components");
// 	if(blockquote) div = blockquote.parentNode;
// 	else {
// 		div = document.createElement("div");
// 		div.setAttribute('class',"filtres");
// 		div.setAttribute('style',"text-align:center;");
// 		div.setAttribute('class',"filtres");
// 		div.setAttribute('style',"text-align:center;");
// 	}

// 	div.innerHTML = list_icons;
// 	bloc.insertBefore(div,table);

// 	$('a[data-comp]').click(selectComponentFilter);
// 	// set default filters
// 	$('a[data-comp="Tous"]').attr("class", "sel"); // comp Tous
// }




function selectFormulaFilter() {
	$('a[data-formule]').removeAttr("class");
	// var formule = $(this).data('formule');
	// var metier = $('a[data-metier][class="sel"]').data('metier');
	// var cat = $('a[data-category][class="sel"]').data('category');
	// var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	// var comp = 'Tous';
	$(this).attr("class", "sel");
	$(document).ready(applyFiltering());//formule,metier,cat,diff,comp);
    updateComponentFilter();
	$('#search')[0].value = '';
	return false;
}

function selectMetierFilter() {
	$('a[data-metier]').removeAttr("class");
	// var formule = $('a[data-formule][class="sel"]').data('formule');
	// var metier = $(this).data('metier');
	// var cat = $('a[data-category][class="sel"]').data('category');
	// var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	// var comp = 'Tous';
	$(this).attr("class", "sel");
	$(document).ready(applyFiltering());//formule,metier,cat,diff,comp);
    updateComponentFilter();
	$('#search')[0].value = '';
    return false;
}

function selectCategoryFilter() {
	$('a[data-category]').removeAttr("class");
	// var formule = $('a[data-formule][class="sel"]').data('formule');
	// var metier = $('a[data-metier][class="sel"]').data('metier');
	// var cat = $(this).data('category');
	// var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	// var comp = 'Tous';
	$(this).attr("class", "sel");
	$(document).ready(applyFiltering());//formule,metier,cat,diff,comp);
    updateComponentFilter();
	$('#search')[0].value = '';
    return false;
}

function selectDifficultyFilter() {
	$('a[data-difficulty]').removeAttr("class");
	// var formule = $('a[data-formule][class="sel"]').data('formule');
	// var metier = $('a[data-metier][class="sel"]').data('metier');
	// var cat = $('a[data-category][class="sel"]').data('category');
	// var diff = $(this).data('difficulty');
	// var comp = 'Tous';
	$(this).attr("class", "sel");
	$(document).ready(applyFiltering());//formule,metier,cat,diff,comp);
    updateComponentFilter();
	$('#search')[0].value = '';
    return false;
}

function selectComponentFilter() {
	let prev = $('a[data-comp][class="sel"]').data('comp');
	$('a[data-comp]').removeAttr("class");
	// $('a[data-comp]').children("img").removeAttr("width");
	$('a[data-comp]').children("img").removeAttr("style");
	// var formule = $('a[data-formule][class="sel"]').data('formule');
	// var metier = $('a[data-metier][class="sel"]').data('metier');
	// var cat = $('a[data-category][class="sel"]').data('category');
	// var diff= $('a[data-difficulty][class="sel"]').data('difficulty');
	var comp = $(this).data('comp');
	if (comp==prev) {
		comp = 'Tous';
		$('a[data-comp="Tous"]').attr("class", "sel");
	}
	else {
		$(this).attr("class", "sel");
		// $(this).children("img").attr("width","25");
		$('a[data-comp]').not('[class="sel"]').children("img").attr("style","opacity:0.4");
	}
	$(document).ready(filterComponents(comp));//formule,metier,cat,diff,comp);
	$('#search')[0].value = '';
	return false;
}


function selectComponentFilter2() {
	let selected = [];
	let sel_comp = $('a[data-comp][class="sel"]');
	if( sel_comp.length==1 && sel_comp.data('comp') == 'Tous') {
		$('a[data-comp]').children("img").attr("style","opacity:0.4");
		$('a[data-comp="Tous"]').removeAttr("class");
	}
	else {
		for (var i=0; i<sel_comp.length; i++) {
			selected.push(~~sel_comp[i].getAttribute('data-comp'));
		}
	}
	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff= $('a[data-difficulty][class="sel"]').data('difficulty');
	var comp = $(this).data('comp');

	if (selected.includes(comp)) {
		$(this).removeAttr("class");
		$(this).children("img").attr("style","opacity:0.4");
		selected = selected.splice(selected.indexOf(comp),1);
		if (selected.length==1) {
			$('a[data-comp]').removeAttr("class");
			$('a[data-comp="Tous"]').attr("class", "sel");
			$('a[data-comp]').children("img").removeAttr("style");
			comp = 'Tous';
		}
		else {
			comp = selected;
		}
	}
	else {
		$(this).attr("class", "sel");
		$(this).children("img").removeAttr("style");
		selected.push(comp);
		if (selected.length+2==$('a[data-comp]').length) {
			$('a[data-comp]').removeAttr("class");
			$('a[data-comp="Tous"]').attr("class", "sel");
			$('a[data-comp]').children("img").removeAttr("style");
			comp = 'Tous';
		}
		else {
			comp = selected;
		}
	}
	applyFiltering(formule,metier,cat,diff,comp);
	return false;
}



function applyFiltering() {//formule,metier,cat,diff,comp) {
	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff = $('a[data-difficulty][class="sel"]').data('difficulty');

	console.log("HALLO");

	$('tr[data-formule]').show();
	if (formule != 'Connues') {
		$('tr[data-formule="Connues"]').hide();
	}
	if (metier != 'Tous') {
		$('tr:not([data-metier*=' + metier + '])').hide();
	}
	if (cat != 'Tous') {
		$('tr:not([data-category*=' + cat + '])').hide();
	}
	if (diff != 'Tous') {
		// $('td:nth-child(2):not(:contains("' + diff + '"))').parent().hide();
		$('td:nth-child(2)').filter(function() {
			return $(this).text() !== diff+'%';
		}).parent('[data-formule]').hide();
	}

	$('tr[data-metier=fixe]').show();
	updateTableTitle()
}

function filterComponents(comp) {
	applyFiltering();
	if (comp != 'Tous') {
		if (typeof(comp)=='number') {
			$('td:last-child').not(':has([src*="items/'+comp+'.gif"])').parent('[data-formule]').hide();
		}
		else {
			let lines = $('tr[data-formule]:visible');
			for (var l=0; l<lines.length; l++) {
				let icons = lines.eq(l).children('td:last-child').children('img[src]');
				let count = 0;
				for (var c=0; c<comp.length; c++) {
					for (var i=0; i<icons.length; i++) {
						if(icons[i].src.includes('/'+comp[c]+'.gif')) {
							count += 1;
						}
					}
				}
				if (count!=comp.length) {
					lines.eq(l).attr('hidden','true');
				}
			}
		}
	}
	updateTableTitle()
}


function updatePageAttributes() {
	let table = document.getElementsByTagName("table")[0];
	table.setAttribute('id','formulas-table');
	let smalls = table.getElementsByTagName("small");

	for(var i=0;i<smalls.length;i++) {
		if(smalls[i].parentNode.tagName != 'EM') {
			let line = smalls[i].parentNode.parentNode;
			let value = smalls[i].innerText.split('-')[1].trim();
			switch(value) {
				case 'Tête':
					line.setAttribute('data-category','tete');
					break;
				case 'Buste':
					line.setAttribute('data-category','buste');
					break;
				case 'Pieds':
					line.setAttribute('data-category','pieds');
					break;
				case 'Main droite':
					line.setAttribute('data-category','main-droite');
					break;
				case 'Main gauche':
					line.setAttribute('data-category','main-gauche');
					break;
				case 'Deux mains':
				case 'Deux mains d\'arc':
				case 'Deux mains de fusil':
					line.setAttribute('data-category','deux-mains');
					break;
				// case 'Contenant d\'arc':
				// case 'Contenant de fusil':
				//	 line.setAttribute('data-category','contenant');
				//	 break;
				// case 'Fétiche':
				//	 line.setAttribute('data-category','fetiche');
				//	 break;
				default:
					line.setAttribute('data-category','autres');
			}
		}
	}

	let trs = table.getElementsByTagName("tr");
	for(i=1;i<trs.length;i++) {
	   if(trs[i].getAttribute('data-category') == null) trs[i].setAttribute('data-category','autres');
	}
}



function addCategoryFilter() {

	let table = bloc.getElementsByTagName("table")[0];

	let extra = document.createElement("div");
	extra.setAttribute('class',"filtres");
	extra.setAttribute('style',"text-align:center;");

	extra.innerHTML = '<blockquote class="bloc"><strong>Types d\'objet</strong><br><a href="#" data-category="Tous">Tous</a> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/7.gif" class="item"><a href="#" data-category="tete">Tête</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/48.gif" class="item"><a href="#" data-category="buste">Buste</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/8.gif" class="item"><a href="#" data-category="pieds">Pieds</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/136.gif" class="item"><img src="images/items/76.gif" class="item"><a href="#" data-category="main-droite">Main droite</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/2.gif" class="item"><img src="images/items/24.gif" class="item"><a href="#" data-category="main-gauche">Main gauche</a> </span>'
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/122.gif" class="item"><img src="images/items/17.gif" class="item"><a href="#" data-category="deux-mains">Deux mains</a> </span>'
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <a href="#" data-category="autres">Autres</a> </span>'
		+ '</blockquote>';

	bloc.insertBefore(extra,table);

	$('a[data-category]').click(selectCategoryFilter);
	$('a[data-category="Tous"]').attr("class", "sel"); // default selected

}

function addDifficultyFilter() {

	let table = bloc.getElementsByTagName("table")[0];

	let extra = document.createElement("div");
	extra.setAttribute('class',"filtres");
	extra.setAttribute('style',"text-align:center;");
	extra.innerHTML = '<blockquote class="bloc"><strong>Difficulté</strong><br><a href="#" data-difficulty="Tous">Toutes</a> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <a href="#" data-difficulty="0">0%</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <a href="#" data-difficulty="20">20%</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <a href="#" data-difficulty="40">40%</a> </span> '
		+ '</blockquote>';

	bloc.insertBefore(extra,table);
	bloc.insertBefore(document.createElement("br"),table);

	$('a[data-difficulty]').click(selectDifficultyFilter);
	$('a[data-difficulty="Tous"]').attr("class", "sel"); // default selected

}


function addExtraFilters() {

	let div = document.createElement("div");
    div.setAttribute('style',"text-align:center;");
	div.setAttribute('class',"filtres");
	let bkq = document.createElement("blockquote");
    bkq.setAttribute('id',"extra-filters");
	bkq.setAttribute('class',"bloc");

	let t = document.createElement("strong");
	t.appendChild(document.createTextNode("Filtrer par ingrédient"));
	bkq.appendChild( t );
	bkq.appendChild(addComponentFilter());

	t = document.createElement("strong");
	let tt = document.createElement("span");
	tt.setAttribute('style',"font-size: 1.2em; font-weight: bold; color: red ");
	tt.appendChild(document.createTextNode("OU "));
	t.appendChild( tt );
	t.appendChild(document.createTextNode(" par chaîne de caractères"));
	bkq.appendChild( t );
	bkq.appendChild(addSearchBar());
	// bkq.appendChild( document.createElement("br") );
	// bkq.appendChild( document.createElement("br") );
	div.appendChild(bkq);

	let bloc = document.getElementById("bloc");
	let table = bloc.getElementsByTagName("table")[0];
	bloc.insertBefore(div,table);
	bloc.insertBefore(document.createElement("br"),table);

}


function addComponentFilter() {

	listComponents();

	let div = document.createElement("div");
    div.setAttribute('id',"list-components");
	div.setAttribute('class',"filtres");
	div.setAttribute('style',"text-align:center;");


	let all_comp = document.createElement("a");
	all_comp.href = "#";
	all_comp.setAttribute('data-comp',"Tous");
	all_comp.setAttribute('hidden','true');
	div.appendChild(all_comp);
	// = '<a href="#" data-comp="Tous" hidden=true></a>';

	for(var i=0;i<components.length;i++) {
		let comp = document.createElement("a");
		comp.href = "#";
		comp.setAttribute('data-comp',components[i].split('.')[0]);
		let img = document.createElement("img");
		img.src = 'images/items/' + components[i];
		img.title = components_alt[i];
		comp.appendChild(img);
		let span = document.createElement("span");
		span.appendChild(comp);
		div.appendChild(span);

		// list_comp += '<span><a href="#" data-comp="' + components[i].split('.')[0] + '"><img src="images/items/' + components[i] + '" title="' + components_alt[i] + '"> </a></span>';
	}
	// div.innerHTML = list_comp;

	// let bloc = document.getElementById("bloc");
	// let table = bloc.getElementsByTagName("table")[0];
	// bloc.insertBefore( document.createElement("br") ,table);
	// bloc.insertBefore(div,table);

	$(div).find('a[data-comp]').click(selectComponentFilter);
	// set default filters
	$(div).find('a[data-comp="Tous"]').attr("class", "sel"); // comp Tous

	return div;
}

function addSearchBar() {

	let div = document.createElement("div");
	div.setAttribute('style',"text-align:center;");
	//<label form="search"><b>OU</b> par chaînes de caractères &nbsp;&nbsp;</label>
	div.innerHTML += '<input id="search" type="text">';

	$(div).find('#search').change(searchText);

	return div;

}


function searchText() {
	let tex = $('#search')[0].value ;
	$(document).ready(applyFiltering());
    updateComponentFilter();
	$('tr[data-formule]:visible:not(:contains("'+tex+'"))').hide();
	updateTableTitle()

}


function updateComponentFilter() {

    listComponents();
    let list_comp = '<a href="#" data-comp="Tous" hidden=true></a>';
	for(var i=0;i<components.length;i++) {
		list_comp += '<span><a href="#" data-comp="' + components[i].split('.')[0] + '"><img src="images/items/' + components[i] + '" title="' + components_alt[i] + '"> </a></span>';
	}

    let div = document.getElementById("list-components");
    div.innerHTML = list_comp;

    $('a[data-comp]').click(selectComponentFilter);
	// set default filters
	$('a[data-comp="Tous"]').attr("class", "sel");
}




function updateTableTitle() {
	let displayed_lines = $("tr[data-formule]:visible");
	$("table:first").children("tbody:first").children("tr:first").children("td:first")[0].innerText = displayed_lines.length + " formules";
}

function listComponents() {
	components = [];
	components_alt = [];
	let imgs = $("tr[data-formule]:visible").children("td:last-child").children("img");

	for(var j=0;j<imgs.length;j++) {
		let ingr = imgs[j].src.split("/items/")[1];
		let name = imgs[j].alt;
		if(!(components.includes(ingr))) {
			components.push(ingr);
			components_alt.push(name);
		}
	}

	// console.log(components);
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
	let mules_id = [];
	let mules_name = [];
	let form = document.getElementsByTagName("form");
	if(form.length==0) return;
	form = form[form.length-1];
	let muleIcons = document.querySelectorAll('[title="Mulet"]');
	for(var i=0;i<muleIcons.length;i++){
		let id = muleIcons[i].parentNode.getElementsByClassName("profil_popin")[0].href.split("id=")[1].split("&")[0];
		let name = muleIcons[i].parentNode.getElementsByTagName("a")[0].innerText.trim();
		mules_id.push(id)
		mules_name.push(name);
	}
	localStorage.setItem("mules_name",mules_name);
	localStorage.setItem("mules_id",mules_id);
	if(localStorage.getItem("show_mules")==null) localStorage.setItem("show_mules",mules_id);

}

function saveInventory(inv) {
    $( this.document ).ready(function () {
        console.log("Ready!");
    });
	var i, lines, cell, table;
	lines = document.getElementsByTagName('table')[0].getElementsByClassName("item");
	console.log($("h3")[0].innerText )
	table = "";
	for (i=0;i<lines.length;i++){
		if(lines[i].parentNode.tagName == "TD") {
			table += "<tr data-inv='" + inv + "'>";
			cell = lines[i].parentNode.outerHTML;
			table += cell;
			table += "</tr>";
		}
	}
	localStorage.setItem(inv,table);
	let ts = (new Date()).getTime();
	localStorage.setItem(inv+'_ts',ts);
	console.log("Saved "+ inv);
}

function saveMulet(mule) {
	var i, lines, cell, table, inv;
	lines = document.getElementsByTagName('table')[0].getElementsByClassName("item");
	console.log($("h3")[0].innerText )
	table = "";
	for (i=0;i<lines.length;i++){
		if(lines[i].parentNode.tagName == "TD") {

			let icon = lines[i].src.split('items/')[1].split('.gif')[0];
			if (id_equip.includes(~~icon)) inv = "Equipement";
			if (id_conso.includes(~~icon)) inv = "Consommable";
			if (id_resso.includes(~~icon)) inv = "Ressource";

			table += "<tr data-inv='" + inv + "'>";
			cell = lines[i].parentNode.outerHTML;
			table += cell;
			table += "</tr>";
		}
	}
	localStorage.setItem(mule,table);
	let ts = (new Date()).getTime();
	localStorage.setItem(mule+'_ts',ts);
	console.log("Saved mulet "+ mule);
}


function mergeInventory() {

	let i, table, temp;
	temp = localStorage.getItem("mules_id");
	let mules_id = temp ? temp.split(',') : [];
	temp = localStorage.getItem("mules_name");
	let mules_name = temp ? temp.split(',') : [];
	temp = localStorage.getItem("show_mules");
	let mules_to_show = temp ? temp.split(',') : [];

	// console.log(mules_to_show);

	let inv_to_show = [];
	if(localStorage.getItem("show_eq")==1) inv_to_show.push("Equipement");
	if(localStorage.getItem("show_co")==1) inv_to_show.push("Consommable");
	if(localStorage.getItem("show_re")==1) inv_to_show.push("Ressource");
	console.log(inv_to_show);
	// let mule_to_show = [];
	// if(localStorage.getItem("show_eq")==1) mule_to_show.push("Equipement");
	// if(localStorage.getItem("show_co")==1) mule_to_show.push("Consommable");

	let merged = '<table id="inventaire_complet" width="100%"><tbody>';
	for(i=0; i<inv_to_show.length; i++){
		table = localStorage.getItem(inv_to_show[i]);
		if(table==null){
			merged += "Visitez d'abord la page " + inv_to_show[i] + " !<br>";
		}
		else {
			merged += table;
		}
	}
	for(i=0; i<mules_to_show.length; i++){
		table = localStorage.getItem(mules_to_show[i]);
		let mule;
		if(table==null){
			if(mules_name[i]=="Mulet") mule=mules_id[i];
			else mule=mules_name[i];
			merged += "Visitez d'abord l'inventaire du mulet " + mule + " !<br>";
		}
		else {
			merged += table;
		}
	}
	merged += "</tbody></table>";
	return merged;

}

function createInventory() {
	let state_eq, state_co, state_re, show_mules;
	let temp, i, t;

	temp = localStorage.getItem("mules_id");
	let mules_id = temp ? temp.split(',') : [];
	temp = localStorage.getItem("mules_name");
	let mules_name = temp ? temp.split(',') : [];

	// console.log(mules_id);
	// console.log(mules_name);

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

	let ts_eq = (t=localStorage.getItem("Equipement_ts")) ? (new Date()).getTime() - t : null;
	let ts_co = (t=localStorage.getItem("Consommable_ts")) ? (new Date()).getTime() - t : null;
	let ts_re = (t=localStorage.getItem("Ressource_ts")) ? (new Date()).getTime() - t : null;

	show_mules = [];
	for(i=0;i<mules_id.length;i++) {
		if(urlParams.get(mules_id[i])=='on') {
			show_mules.push(mules_id[i]);
		}
	}
	localStorage.setItem("show_mules",show_mules);

	let myhtml = "<h3>Inventaire complet (sauf tenue)</h3>"
	+ '<form id="form_inv" method="get" formaction="index.php?p=InventaireComplet">'
	+ '<table><tbody><tr><td><input type="hidden" name="p"  value="' + page + '"/><strong>Catégories : </strong>&nbsp;&nbsp;</td><td>'
	+ '<input type="checkbox" name="Equipement" value="on" ' + state_eq + ' form="form_inv"/>&nbsp;Équipements (' + formatTime(ts_eq) + ')&nbsp;&nbsp;'
	+ '<input type="checkbox" name="Consommable" value="on" ' + state_co + ' form="form_inv"/>&nbsp;Consommables (' + formatTime(ts_co) + ')&nbsp;&nbsp;'
	+ '<input type="checkbox" name="Ressource" value="on" ' + state_re + ' form="form_inv"/>&nbsp;Ressources (' + formatTime(ts_re) + ')&nbsp;&nbsp;</td></tr>';

	if(mules_id.length>0){
		myhtml += '<tr><td><strong>Mulets : </strong>&nbsp;&nbsp;</td><td>'
		for(i=0; i<mules_id.length; i++) {
			let name = mules_name[i];
			let state_mule = '';
			let mule_ts = localStorage.getItem(mules_id[i]+"_ts");
			let ts = null;
			if(mule_ts) ts = (new Date()).getTime() - mule_ts;
			// console.log(ts);
			if(name=="Mulet") name=mules_id[i];
			if(show_mules.includes(mules_id[i])) state_mule = 'checked="checked"';
			myhtml += '<input type="checkbox" name="' + mules_id[i] + '" value="on" ' + state_mule + ' form="form_inv"/>&nbsp;' + name + ' (' + formatTime(ts) + ')&nbsp;&nbsp;';
		}
		myhtml += '</td></tr>';
	}
	myhtml += '</tbody></table><input name="refresh_inv" type="submit" value="Modifier" form="form_inv"></form><br><br>';

	// -------------------------------------------------------------------

	let category_selector = document.createElement("div");
	category_selector.setAttribute('class',"filtres");
	// category_selector.setAttribute('hidden',"true");
	category_selector.setAttribute('style',"text-align:center;");

	category_selector.innerHTML = '<blockquote class="bloc"><strong>Catégories</strong><br><a href="#" data-inv="Tous">Tout</a> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/74.gif" class="item"><a href="#" data-inv="Equipement">Équipements</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/3.gif" class="item"><a href="#" data-inv="Consommable">Consommables</a> </span> '
		+ '<span><img src="images/interface/puce_small.gif" alt=""> <img src="images/items/5.gif" class="item"><a href="#" data-inv="Ressource">Ressources</a> </span> '
		+ '</blockquote>';
	myhtml += category_selector.outerHTML;

	// -------------------------------------------------------------------

	if(mules_id.length>0){

		let mule_selector = document.createElement("div");
		mule_selector.setAttribute('class',"filtres");
		// mule_selector.setAttribute('hidden',"true");
		mule_selector.setAttribute('style',"text-align:center;");

		mulesHTML = '<blockquote class="bloc"><strong>Mulets</strong><br><a href="#" data-mule="Tous">Tous</a> ';
		mulesHTML += '<span><img src="images/interface/puce_small.gif" alt=""> <a href="#" data-mule="Aucun">Aucun</a> ';

		for(i=0; i<mules_id.length; i++) {
			let name = mules_name[i];
			let mule_ts = localStorage.getItem(mules_id[i]+"_ts");
			let ts = null;
			if(mule_ts) ts = (new Date()).getTime() - mule_ts;
			mulesHTML += '<span><img src="images/interface/puce_small.gif" alt=""> '
									+ '<img src="images/vue/monstre/37.gif" class="item">&nbsp;'
									+ '<a href="#" data-mule="' +  mules_id[i] + '">' + name + ' (' + formatTime(ts) + ')</a> </span> '
		}
		mulesHTML += '</blockquote>';
		mule_selector.innerHTML = mulesHTML;
		myhtml += mule_selector.outerHTML;
	}
	// -------------------------------------------------------------------

	let table = mergeInventory();
	myhtml += table;

	let bloc = document.getElementById("bloc");
	bloc.innerHTML = myhtml;

	addCopyButton(document.getElementById("inventaire_complet"));

}






function addCopyButton(table,type) {

	let parent = table.parentNode;
	let span = document.createElement("span");
	parent.insertBefore(span,table);

	// let button2 = '<input name="copy_list" type="button" value="Copier la liste">';
	let button = document.createElement("input");//, { name: "copy_list"; type: "button"; value: "Copier la liste" });
	button.id = "copy_list";
	button.type = "button";
	button.value = "Copier la liste";

	let space = document.createTextNode('&nbsp;')
 


	switch(type) {

		  case 'inventory':

			span.appendChild(button);
			$("#copy_list").click(copyListInventory);
			break;


		  case 'formulas':

			let filter1 = document.createElement("input");
			filter1.id = "show_formule";
			filter1.type = "checkbox";
			let label1 = document.createElement("label");
			label1.setAttribute('for',"show_formule");
			label1.innerHTML = "Formules";
			let filter2 = document.createElement("input");
			filter2.id = "show_caracs";
			filter2.type = "checkbox";
			let label2 = document.createElement("label");
			label2.setAttribute('for',"show_caracs");
			label2.innerHTML = "Caracs";
			let filter3 = document.createElement("input");
			filter3.id = "show_diff";
			filter3.type = "checkbox";
			let label3 = document.createElement("label");
			label3.setAttribute('for',"show_diff");
			label3.innerHTML = "Difficulté";
			let filter4 = document.createElement("input");
			filter4.id = "show_metier";
			filter4.type = "checkbox";
			let label4 = document.createElement("label");
			label4.setAttribute('for',"show_metier");
			label4.innerHTML = "Métier";
			let filter5 = document.createElement("input");
			filter5.id = "show_bonus";
			filter5.type = "checkbox";
			let label5 = document.createElement("label");
			label5.setAttribute('for',"show_bonus");
			label5.innerHTML = "Bonus";
			span.appendChild(button);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter1);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label1);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter2);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label2);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter3);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label3);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter4);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label4);
			span.appendChild( document.createTextNode( '\u00A0\u00A0' ) );
			span.appendChild(filter5);
			span.appendChild( document.createTextNode( '\u00A0' ) );
			span.appendChild(label5);
			$("#copy_list").click(copyListFormulas);
			break;


		  default:

	}
}

function copyListInventory() {

	navigator.clipboard.writeText($("table:first").children("tbody:first").children("tr").find("strong").each(function(){$(this).text($(this).text()+'\n')}).text());
}

function copyListFormulas() {

	var i, j , m, p;

	var formule = $('a[data-formule][class="sel"]').data('formule');
	var metier = $('a[data-metier][class="sel"]').data('metier');
	var cat = $('a[data-category][class="sel"]').data('category');
	var diff = $('a[data-difficulty][class="sel"]').data('difficulty');
	var comp = $('a[data-comp][class="sel"]').data('comp');
	var comp_name = $('a[data-comp][class="sel"]').children("img").attr("title");
	var search = $('#search')[0].value ;

	let show_formule = $("#show_formule")[0].checked;
	let show_caracs = $("#show_caracs")[0].checked;
	let show_diff = $("#show_diff")[0].checked;
	let show_metier = $("#show_metier")[0].checked;
	let show_bonus = $("#show_bonus")[0].checked;


	let category = ''
	for ( i=0;i<cat.split('-').length;i++) {
		category += cat.split('-')[i][0].toUpperCase();
		for ( j=1;j<cat.split('-')[i].length;j++) {
			category += cat.split('-')[i][j];
		}
		category += ' ';
	}

	let buffer = "";
	buffer += "Formules ";
	if(metier != 'Tous') buffer += metier;
    if(diff != 'Tous') buffer += " de difficulté " + diff + "%";
    if(cat != 'Tous') buffer += " pour les éléments de type " + category.trim();
    if(comp != 'Tous') buffer += " contenant l'ingrédient " + comp_name.trim();
	if(search) buffer += ' dont la description contient "' + search + '"';
    buffer += " :\n";

	let liste = $("tr[data-formule]:visible");
    for (i=0;i<liste.length;i++) {
        buffer += "- " + liste[i].getElementsByTagName("strong")[0].innerText;
		if(show_diff || show_metier) {
			buffer += " (";
			if(show_diff) {
				buffer += liste[i].getElementsByTagName("td")[1].innerText;
				if(show_metier) buffer += ', ';
			}
			if(show_metier) {
				let metiers = liste[i].getElementsByTagName("td")[2].getElementsByTagName('img');
				for ( m=0; m<metiers.length; m++) {
					buffer += metiers[m].title;
					if(m<metiers.length-1) buffer += '/';
				}
			}
			buffer += ") ";
		}

        // buffer += " (" + liste[i].getElementsByTagName("td")[1].innerText + "):";
        let components = liste[i].getElementsByTagName("td")[3].getElementsByTagName("img");
        let quantity = liste[i].getElementsByTagName("td")[3].innerText.split('x');
        if(show_formule) {
			for (j=0;j<components.length;j++) {
				buffer += " " + quantity[j] + "x " + components[j].alt;
			}
		}
        buffer += "\n";
		if(show_caracs) {
			let line2 = liste[i].getElementsByTagName("td")[0].innerText.split('\n')[1];
			let caracs = line2.split(' )')[0];
			let place = line2.split(' )')[1];
			buffer += caracs.slice(0,-1)+"Poids "+caracs.slice(-1) +")";
			buffer += place;
		}
		let line3 = liste[i].getElementsByTagName("td")[0].innerText.split('\n')[2];
		if(show_bonus && line3 != undefined) {
			let parts = line3.split(" : ");
			buffer += " " + parts[0] + " : ";
			for (p=1;p<parts.length;p++) {
				buffer += parts[p] + " ";
			}
		}
		if( show_caracs || (show_bonus && line3 != undefined) ) buffer += "\n";
    }

	navigator.clipboard.writeText(buffer);
}


// function addPasteButton(element) {
//	 let parent = element.parentNode;
//	 // let button2 = '<input name="copy_list" type="button" value="Copier la liste">';
//	 let button = document.createElement("input");//, { name: "copy_list"; type: "button"; value: "Copier la liste" });
//	 button.name = "paste_in_message";
//	 button.type = "button";
//	 button.value = "Coller";
//	 parent.insertBefore(button,element);
//	 let paste_button = document.getElementsByName("paste_in_message");
//	 paste_button[0].addEventListener("click", pasteInMessage);
// }

// does not work in firefox
// function pasteInMessage() {
//	 let doc = document.getElementsByTagName('iframe')[0].contentWindow.document;
//	 doc.open();
//	 navigator.clipboard.readText().then((clipText) => (doc.write(clipText)));
//	 doc.close();
// }



function formatTime(time) {
	if(typeof(time)!="number") return -1;
	time /= 1000; // time in sec
	let list_divid = [60,60,24,7];
	let list_units = ['s','m','h','d','w'];
	var i = 0;
	while(i<list_divid.length){
		if(time/list_divid[i]<1) break;
		time = time/list_divid[i];
		i += 1;
	}
	return ""+Math.floor(time)+list_units[i];
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

	var i, j, menu, submenus, list, temp;
	menu = document.getElementById("menu");
	submenus = menu.getElementsByClassName("parent");
	temp = localStorage.getItem("show_mules");
	let mules_to_show = [];
	if(temp) mules_to_show = temp.split(',');
	temp = localStorage.getItem("mules_id");
	let mules_id = [];
	if(temp) mules_id = temp.split(',');
	temp = localStorage.getItem("mules_name");
	let mules_name = [];
	if(temp) mules_name = temp.split(',');

	var urlTout = '';
	if(localStorage.getItem("show_eq")==1) urlTout += '&Equipement=on';
	if(localStorage.getItem("show_co")==1) urlTout += '&Consommable=on';
	if(localStorage.getItem("show_re")==1) urlTout += '&Ressource=on';
	for(i=0;i<mules_to_show.length;i++) {
		urlTout += '&' + mules_to_show[i] + '=on';
	}

	// urlMules = [];
	// for (i=0;i<localStorage.getItem("mules").length;i++){
	//	 urlMules

	for (i=0;i<submenus.length;i++){
		if(submenus[i].innerText == "Inventaire"){
			list = submenus[i].parentNode.getElementsByTagName("ul");
			temp = list[0].innerHTML.slice(0,-5);
			for(j=0;j<mules_id.length;j++) {
				let name = mules_name[j];
				if(name=="Mulet") name += " " + mules_id[j];
				temp += '<li><a href="index.php?p=gestion_stock&id_monstre=' + mules_id[j] + '"><img src="images/vue/monstre/37.gif" alt="Mulet" title="Mulet" class="elements" vertical-align="middle">&nbsp;' + name + '</a></li>';
			}
			temp += '<li><a href="index.php?p=InventaireComplet' + urlTout + '">Tout</a></li>' + list[0].innerHTML.slice(-5);
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